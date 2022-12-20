const express = require("express");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");

const { verifyToken } = require("./middlewares");
const { sequelize } = require("./models");
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("database connected in users-api");
  })
  .catch((err) => {
    console.error(err);
  });

const {
  getSuggestionFollowing,
  updateProfile,
  getFeeds,
  getProfile,
  addFollowing,
  removeFollowing,
} = require("./controller/users");

const router = express();

router.set("port", process.env.PORT || 8000);
router.use(morgan("dev"));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // https가 아니면 client가 server로 쿠키를 보내지 않음.
    },
  })
);
router.use(cors());

router.use(verifyToken);

router.get("/users/", getSuggestionFollowing);
router.put("/users/", updateProfile);

router.get("/users/feed", getFeeds);
router.get("/users/:username", getProfile);

router.get("/users/:id/follow", addFollowing);
router.get("/users/:id/unfollow", removeFollowing);

router.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} no router`);
  error.status = 404;
  next(error);
});

router.use((err, req, res, next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json(err);
});

router.listen(router.get("port"), () => {
  console.log("listening on", router.get("port"));
});
