const {
  storeAnswers,
  renderEdit,
  handleEdit,
  handleDelete,
} = require("../controller/answerController");
const { isAuthenticate } = require("../middleware/userAuthenticate");
const catchError = require("../utils/catchError");

const router = require("express").Router();
router.route("/:id").post(isAuthenticate, catchError(storeAnswers));
router
  .route("/edit/:answerId/:questionId")
  .get(isAuthenticate, renderEdit)
  .post(isAuthenticate, handleEdit);
router.route("/delete/:answerId/:questionId").get(isAuthenticate, handleDelete);
module.exports = router;
