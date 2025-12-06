const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../../frontend/media/img/products"));

    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.originalname.toLowerCase();
        cb(null, fileName);
    }
});

const upload = multer({ storage });

module.exports = upload;