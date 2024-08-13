const multer = require("multer");
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + " " + file.originalname);
  },
});
module.exports = {
  multer,
  storage,
};
