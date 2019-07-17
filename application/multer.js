const path = require('path');
const multer = require('multer');

// Set Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/images/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// init upload
const upload = multer({
  storage: storage
}).single('MYIMG');

module.exports = upload;
