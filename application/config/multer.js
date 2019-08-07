/*
  multer.js
  This handles file uploads to the server.
 */

const path = require('path');
const multer = require('multer');

// Set Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Initialize upload module
module.exports = multer({
  // dest: 'uploads/',
  storage: storage,
  limits: {
    // Max file size allowed; 10 megabytes
    fileSize: 1000000000
  }
}).single('uploadImage'); // This name comes from the input field for type="file" in tickets.hbs; name="uploadImage"

// Use this module by 'const upload = require('../multer');'
