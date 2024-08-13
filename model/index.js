const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: 3306,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected!");
  })
  .catch((err) => {
    console.log("Error" + err);
  });
const db = {};

db.Sequelize = Sequelize;
db.userinfos = require("./userModel")(sequelize, DataTypes);
db.questions = require("../model/questionModel")(sequelize, DataTypes);
db.answers = require("../model/answerModel")(sequelize, DataTypes);
db.userinfos.hasMany(db.questions);
db.questions.belongsTo(db.userinfos);
db.questions.hasMany(db.answers);
db.answers.belongsTo(db.questions);
db.userinfos.hasMany(db.answers);
db.answers.belongsTo(db.userinfos);

db.sequelize = sequelize;
db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done");
});
module.exports = db;
