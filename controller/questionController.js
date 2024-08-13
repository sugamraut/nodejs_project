const { cloudinary } = require("../cloudinary/index");
const { questions, userinfos, answers, sequelize } = require("../model");
exports.renderQuestionPage = (req, res) => {
  const [error] = req.flash("error");
  res.render("./questions/askQuestion", { error: error });
};

exports.askQuestion = async (req, res) => {
  const { title, description } = req.body;

  const result = await cloudinary.v2.uploader.upload(req.file.path);

  const userInfoId = req.userInfoId;
  if (!title || !description) {
    req.flash("error", "please provide all the ceredentials");
    res.redirect("/askQuestion");
  }
  await questions.create({
    title,
    description,
    image: result.url,
    userInfoId,
  });
  res.redirect("/");
};
exports.getAllQuestion = async (req, res) => {
  const data = await questions.findAll({
    include: [
      {
        model: userinfos,
      },
    ],
  });
};
exports.renderSingleQuestionPage = async (req, res) => {
  const { id } = req.params;
  const userId = req.userInfoId;
  const data = await questions.findAll({
    where: {
      id: id,
    },
    include: [
      {
        model: userinfos,
        attributes: ["userName"],
      },
    ],
  });
  // let likes;
  // let count = 0;
  // try {
  //   likes = await sequelize.query(`SELECT * from likes_${id}`, {
  //     type: QueryTypes.SELECT,
  //   });
  //   if (likes.length) {
  //     count = likes.length;
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
  const answerData = await answers.findAll({
    where: {
      questionId: id,
    },
    include: [
      {
        model: userinfos,
        attributes: ["userName"],
      },
    ],
  });
  res.render("./questions/singleQuestion.ejs", {
    data,
    answers: answerData,
    userId: userId,
    // likes: count,
  });
};
