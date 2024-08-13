const { QueryTypes } = require("sequelize");
const { answers, sequelize, questions } = require("../model");

exports.storeAnswers = async (req, res) => {
  try {
    const { answer } = req.body;

    const { id: questionId } = req.params;
    const userId = req.userInfoId;
    const data = await answers.create({
      answerText: answer,
      questionId,
      userInfoId: userId,
    });
    await sequelize.query(
      `CREATE TABLE likes_${data.id} (
      id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, userinfoId INT  NOT NULL REFERENCES userinfos(id) ON DELETE CASCADE ON UPDATE CASCADE
      )`,
      {
        type: QueryTypes.CREATE,
      }
    );
    res.redirect(`/question/${questionId}`);
  } catch (error) {
    res.send(error);
    Y;
  }
};
exports.renderEdit = (req, res) => {
  console.log("hello");
  const { answerId, questionId } = req.params;
  res.render("./answers/answer", { answerId, questionId });
};
exports.handleEdit = async (req, res) => {
  const { editdata } = req.body;
  const { answerId, questionId } = req.params;
  const data1 = await answers.update(
    {
      answerText: editdata,
    },
    {
      where: {
        id: answerId,
      },
    }
  );
  console.log(data1);

  res.redirect(`/question/${questionId}`);
};
exports.handleDelete = async (req, res) => {
  const { answerId, questionId } = req.params;
  await answers.destroy({
    where: {
      id: answerId,
    },
  });
  res.redirect(`/question/${questionId}`);
};
