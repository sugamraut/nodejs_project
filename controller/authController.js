const { userinfos, questions } = require("../model/index");
const bcrypt = require("bcryptjs");
const { where } = require("sequelize");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendingEmail");

exports.renderHome = async (req, res) => {
  const data = await questions.findAll({
    include: [
      {
        model: userinfos,
        attributes: ["userName"],
      },
    ],
  });

  res.render("home", { data });
};
exports.renderAbout = (req, res) => {
  res.render("about");
};
exports.renderRegister = (req, res) => {
  const [error] = req.flash("error");

  res.render("./auth/register", { error: error });
};
exports.renderLogin = (req, res) => {
  const [error] = req.flash("error");
  res.render("./auth/login", { error: error });
};
exports.handleregister = async (req, res) => {
  console.log(req.body);
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    req.flash("error", "somthing is missing");
    res.redirect("/register");
  }
  await userinfos.create({
    userName: username,
    email,
    password: bcrypt.hashSync(password, 11),
  });
  res.redirect("/login");
};
exports.handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "somthing is missing");
    res.redirect("/login");
  }
  const [data] = await userinfos.findAll({
    where: {
      email: email,
    },
  });

  if (data) {
    const isValidatePw = bcrypt.compareSync(password, data.password);
    if (isValidatePw) {
      const token = jwt.sign({ id: data.id }, "codingIsFun", {
        expiresIn: "30d",
      });
      res.cookie("jsonToken", token);
      res.redirect("/");
    } else {
      req.flash("error", "invalid credential");
      res.redirect("/login");
    }
  } else {
    req.flash("error", "invalid credential");
    res.redirect("/login");
  }
};
exports.renderForgotpasswordPage = (req, res) => {
  const [error] = req.flash("error");
  res.render("./auth/forgotPassword", { error: error });
};
exports.handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  const validateEmail = await userinfos.findAll({
    where: {
      email: email,
    },
  });
  if (validateEmail.length === 0) {
    req.flash("error", "Provided email is not registered");
    res.redirect("/forgotPassword");
  }

  const OTP = Math.floor(1000 + Math.random() * 9000);

  const data = {
    email: email,
    subject: "Forgot Your Password?",
    text: `Your OTP is ${OTP}.Please,don't share this OTP with anyone.`,
  };
  await sendEmail(data);
  validateEmail[0].otp = OTP;
  validateEmail[0].otpGeneratedTime = Date.now();
  validateEmail[0].save();
  res.redirect("/verifyOtp?email=" + email);
};
exports.renderOtpPage = (req, res) => {
  const email = req.query.email;
  const [error] = req.flash("error");
  res.render("./auth/verifyOtp", { email: email, error: error });
};
exports.handleOtpPage = async (req, res) => {
  const { Otp } = req.body;
  const email = req.params.id;
  if (!Otp || !email) {
    return res.send("Enter Otp ");
  }
  const userData = await userinfos.findAll({
    where: {
      otp: Otp,
      email: email,
    },
  });
  if (userData.length === 0) {
    req.flash("error", "Invalid OTP");
    res.redirect("/verifyOtp");
  } else {
    const currentTime = Date.now();
    const pastTime = userData[0].otpGeneratedTime;
    if (currentTime - pastTime <= 1200000) {
      res.redirect(`/changePassword?email=${email}&otp=${Otp}`);
    } else {
      req.flash("error", "OTP was expired");
      res.redirect("/verifyOtp");
    }
  }
};
exports.renderChangePassword = (req, res) => {
  const { email, otp } = req.query;
  const [error] = req.flash("error");
  res.render("./auth/changePassword", { email: email, otp: otp, error: error });
};
exports.handleChangePassword = async (req, res) => {
  const { email, otp } = req.params;
  const { newPassword, confirmPassword } = req.body;
  if (!email || !otp) {
    req.flash("error", "provide email,otp");
    return res.redirect("/changePassword");
  }
  if (newPassword !== confirmPassword) {
    req.flash("error", "invalid password");
    return res.redirect(`/changePassword?email=${email}&otp=${otp}`);
  }
  const data = await userinfos.findAll({
    where: {
      email: email,
    },
  });
  const currentTime = Date.now();
  const pastTime = data[0].otpGeneratedTime;
  if (currentTime - pastTime <= 1200000) {
    data[0].otp = null;
    data[0].otpGeneratedTime = null;
    await data[0].save();
    await userinfos.update(
      {
        password: bcrypt.hashSync(newPassword, 10),
      },
      {
        where: {
          email: email,
        },
      }
    );
    res.redirect("/login");
  } else {
    req.flash("error", "OTP was expired");
    res.redirect("/changePassword");
  }
};
exports.renderLogout = (req, res) => {
  res.clearCookie("jsonToken");
  res.redirect("/login");
};
