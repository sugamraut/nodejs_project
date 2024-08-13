const {
  renderQuestionPage,
  askQuestion,
  renderSingleQuestionPage,
} = require("../controller/questionController");
// const { multer, storage } = require("../middleware/multerConfig");
const { isAuthenticate } = require("../middleware/userAuthenticate");
const catchError = require("../utils/catchError");
const { multer, storage } = require("../middleware/multerConfig");

const upload = multer({ storage: storage });

const router = require("express").Router();
router
  .route("/askquestion")
  .get(isAuthenticate, catchError(renderQuestionPage))
  .post(isAuthenticate, upload.single("image"), catchError(askQuestion));
router
  .route("/question/:id")
  .get(isAuthenticate, catchError(renderSingleQuestionPage));
module.exports = router;
