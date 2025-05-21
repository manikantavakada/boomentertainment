const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const auth = require('../middleware/auth');

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://root:nimai1234$@localhost:5432/boom',
});

const router = express.Router();

const { upload } = require('../config/malterConfig.js');

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

 
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }


    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = result.rows[0];


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

   
    res.json({ message: 'Login successful', user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});


router.post('/upload', auth, upload, async (req, res) => {
  try {
    const { title } = req.body;
    const files = req.files;

    // Check for required files
    if (!files || !files.video || !files.thumbnail) {
      return res.status(400).send('Video and thumbnail files are required.');
    }

    const videoFile = files.video[0];
    const thumbnailFile = files.thumbnail[0];
    const videoFileName = videoFile.filename;
    const thumbnailFileName = thumbnailFile.filename;

    console.log('Title:', title);
    console.log('Video file:', videoFileName);
    console.log('Thumbnail file:', thumbnailFileName);


    const result = await pool.query(
      'INSERT INTO videos (title, video_url, thumbnail, user_id, likes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, videoFileName, thumbnailFileName, 1, 0]
    );

    console.log('DB result:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error:', err);

    // Delete uploaded files on error
    if (req.files) {
      [req.files.video, req.files.thumbnail].forEach((fileArray) => {
        if (fileArray && fileArray[0]) {
          fs.unlink(`upload/${fileArray[0].filename}`, (err2) => {
            if (err2) console.error('Failed to delete file:', err2);
          });
        }
      });
    }

    res.status(500).send('Error saving video info to database');
  }
});


// List videos
router.get('/videos', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM videos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error fetching videos');
  }
});

// Like video
router.post('/like/:videoId', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE videos SET likes = likes + 1 WHERE id = $1 RETURNING *',
      [req.params.videoId]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Video not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Error liking video');
  }
});

module.exports = router;