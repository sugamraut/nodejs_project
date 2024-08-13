module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("userInfo", {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp: {
      type: DataTypes.INTEGER,
    },
    otpGeneratedTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return User;
};
