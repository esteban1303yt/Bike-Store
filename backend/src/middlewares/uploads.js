const multer = require('multer');

// Almacenamiento en la memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;  