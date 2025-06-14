const multer = require('multer');
const storage = multer.memoryStorage(); // para trabajar con buffers (no archivos en disco)
module.exports = multer({ storage });