const express = require("express");
require("dotenv").config();
const app = express();
const authRouter = require("./routes/authRoute");
const questionRouter = require("./routes/questionRoute");
const answerRouter = require("./routes/answerRoute");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const flash = require("connect-flash");
const session = require("express-session");
const { promisify } = require("util");
const socketio = require("socket.io");

app.use(express.urlencoded({ extended: true }));
require("./model/index");
app.set("view engine", "ejs"); //automatically point to the views folder so we dont write views/home.ejs ,we simply write home or home.ejs
app.use(cookieParser());
app.use(flash());
app.use(
  session({
    secret: "keyboardcat",
    resave: false,
    saveUninitialized: false,
  })
);
const { renderHome, renderAbout } = require("./controller/authController");
const { answers, sequelize } = require("./model/index");
const { QueryTypes } = require("sequelize");
app.use(async (req, res, next) => {
  try {
    const token = req.cookies.jsonToken;
    const decryptedresult = await promisify(jwt.verify)(token, "codingIsFun");
    if (decryptedresult) {
      res.locals.isAuthenticated = true;
    } else {
      res.locals.isAuthenticated = false;
    }
  } catch (error) {
    res.locals.isAuthenticated = false;
  }
  next();
});
console.log(process.env.API_KEY);
app.get("/", renderHome);

app.get("/about", renderAbout);
app.use("/", authRouter);
app.use("/", questionRouter);
app.use("/answer", answerRouter);

app.use(express.static("public/css/"));
app.use(express.static("./storage/"));
const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`server has started at port no ${PORT} `);
});
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  socket.on("likes", async ({ id, cookie }) => {
    const answer = await answers.findByPk(id);

    if (answer && cookie) {
      const decryptedResult = await promisify(jwt.verify)(
        cookie,
        "codingIsFun"
      );

      if (decryptedResult) {
        const user = await sequelize.query(
          `SELECT * FROM likes_${id} WHERE userinfoId=${decryptedResult.id}`,
          {
            type: QueryTypes.SELECT,
          }
        );
        if (user.length === 0) {
          await sequelize.query(
            `INSERT INTO likes_${id} (userinfoId) VALUES(${decryptedResult.id})`,
            {
              type: QueryTypes.INSERT,
            }
          );
        }
      }
      const likes = await sequelize.query(`SELECT * FROM likes_${id}`, {
        type: QueryTypes.SELECT,
      });
      const likesCount = likes.length;
      await answers.update(
        {
          likes: likesCount,
        },
        {
          where: {
            id: id,
          },
        }
      );
      socket.emit("likeUpdate", { likesCount, id });
    }
  });
});
