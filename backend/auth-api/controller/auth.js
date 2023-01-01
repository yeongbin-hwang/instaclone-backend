const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt-util");
const redisClient = require("../utils/redis");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(403).json({ message: "wrong id or password" });
  }
  try {
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const accessToken = jwt.sign(email);
      const refreshToken = jwt.refresh();

      await redisClient.set(email, refreshToken);
      res.status(200).json({ success: true, accessToken, refreshToken });
    } else {
      res.status(403).json({ message: "you dont have wrong id or password" });
    }
  } catch (err) {
    next(err);
  }
};
// signup and issue the jwt token
exports.signup = async (req, res, next) => {
  const { email, fullname, username, password } = req.body;
  const exUser = await User.findOne({ where: { email } });
  if (exUser) {
    return res.status(403).json({ message: "email already exists" });
  }
  try {
    const hash = await bcrypt.hash(password, 12);
    // check success or not
    await User.create({
      email,
      fullname,
      username,
      password: hash,
    });
    const accessToken = jwt.sign(email);
    const refreshToken = jwt.refresh();

    await redisClient.set(email, refreshToken);
    res.status(201).json({ success: true, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};
// check the token is valid or not
exports.verifyCheck = async (req, res, next) => {
  const { username, fullname, email, avatar } = req.user;
  res.status(200).json({
    success: true,
    data: {
      username,
      fullname,
      email,
      avatar,
    },
  });
};
