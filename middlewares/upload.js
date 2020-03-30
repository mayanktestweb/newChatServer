const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 512 * 1024 * 1024,
    dest: 'public/images'
  }
});

module.exports = upload