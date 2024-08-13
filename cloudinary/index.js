const cloudinary = require("cloudinary");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "NodeJsProject",
//     allowedformats: ["jpg", "jpeg", "png"],
//   },
// });
module.exports = {
  cloudinary,
};
