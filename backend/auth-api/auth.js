const express = require("express");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");

const { swaggerUi, specs, setUpoption } = require("./handler/export-swagger");
const { login, signup, verifyCheck } = require("./controller/auth");
const { sequelize } = require("./models");
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("database connected in auth-api");
  })
  .catch((err) => {
    console.error(err);
  });

const router = express();
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, setUpoption));

router.set("port", process.env.PORT || 8001);
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

router.post("/auth/login", login);
router.post("/auth/signup", signup);
router.get("/auth/me", verifyCheck);

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
