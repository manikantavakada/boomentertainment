const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/'); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

// Filter for video and image files
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video' && file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else if (file.fieldname === 'thumbnail' && file.mimetype.startsWith('image/')) {
    cb(null, true); 
  } else {
    cb(new Error('Invalid file type. Must be video or image.'), false);
  }
};

// Multer setup for multiple file types
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
}).fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

module.exports = { upload };