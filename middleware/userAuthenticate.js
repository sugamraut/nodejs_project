const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { userinfos } = require("../model");

exports.isAuthenticate = async (req, res, next) => {
  const token = req.cookies.jsonToken;
  if (!token || token === undefined || token === null) {
    return res.redirect("/login");
  }
  const decryptedResult = await promisify(jwt.verify)(token, "codingIsFun");
  const data = userinfos.findByPk(decryptedResult.id);
  if (!data) {
    return res.send("Invalid token");
  }
  req.userInfoId = decryptedResult.id;
  next();
};
