const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/'); // Store in upload/ directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, `${Date.now()}${ext}`); // Unique filename (e.g., 1634567890123.jpg)
  },
});

// Filter for video and image files
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video' && file.mimetype.startsWith('video/')) {
    cb(null, true); // Accept video files
  } else if (file.fieldname === 'thumbnail' && file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept image files
  } else {
    cb(new Error('Invalid file type. Must be video or image.'), false);
  }
};

// Multer setup for multiple file types
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for files
  },
}).fields([
  { name: 'video', maxCount: 1 }, // Expect one video file
  { name: 'thumbnail', maxCount: 1 }, // Expect one thumbnail image
]);

module.exports = { upload };