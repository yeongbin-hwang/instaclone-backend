const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(403).json({ message: "wrong id or password" });
  }
  try {
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const token = jwt.sign(
        {
          email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
          issuer: "instaclone-server",
        }
      );
      res.status(200).json({ success: true, token });
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
    await User.create({
      email,
      fullname,
      username,
      password: hash,
    });
    const token = jwt.sign(
      {
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
        issuer: "instaclone-server",
      }
    );
    res.status(200).json({ success: true, token });
  } catch (err) {
    next(err);
  }
};
// check the token is valid or not
exports.verifyCheck = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res
      .status(403)
      .json({ message: "You need to be logged in to visit this route" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) {
      return res
        .status(403)
        .json({ message: `no user found for email ${decoded.email}` });
    }

    req.user = user;
    const { username, fullname, email, avatar } = user;
    res.status(200).json({
      success: true,
      data: {
        username,
        fullname,
        email,
        avatar,
      },
    });
  } catch (err) {
    next({
      message: "You need to be logged in to visit this route",
      status: 403,
    });
  }
};
