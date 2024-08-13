const {
  handleregister,
  renderRegister,
  handleLogin,
  renderLogin,
  renderForgotpasswordPage,
  handleForgotPassword,
  renderOtpPage,
  handleOtpPage,
  renderChangePassword,
  handleChangePassword,
  renderLogout,
} = require("../controller/authController");
const catchError = require("../utils/catchError");

const router = require("express").Router();
router
  .route("/register")
  .post(catchError(handleregister))
  .get(catchError(renderRegister));
router.route("/login").post(handleLogin).get(renderLogin);
router
  .route("/forgotPassword")
  .get(catchError(renderForgotpasswordPage))
  .post(catchError(handleForgotPassword));
router.route("/verifyOtp").get(catchError(renderOtpPage));
router.route("/verifyOtp/:id").post(catchError(handleOtpPage));
router.route("/changePassword").get(catchError(renderChangePassword));
router
  .route("/changepassword/:email/:otp")
  .post(catchError(handleChangePassword));
router.route("/logout").get(catchError(renderLogout));
module.exports = router;
