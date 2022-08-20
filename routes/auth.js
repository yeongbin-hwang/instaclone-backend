const express = require('express');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(403).json({ message: 'wrong id or password' });
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
          expiresIn: '30d',
          issuer: 'instaclone-server',
        }
      );
      res.status(200).json({ success: true, token });
    } else {
      next({
        message: 'you dont have wrong id or password',
        statusCode: 403,
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// signup and issue the jwt token
router.post('/signup', async (req, res, next) => {
  const { email, fullname, username, password } = req.body;
  const exUser = await User.findOne({ where: { email } });
  if (exUser) {
    res.status(403).json({ message: 'email already exists' });
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
        expiresIn: '30d',
        issuer: 'instaclone-server',
      }
    );
    res.status(200).json({ success: true, token });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// check the token is valid or not
router.get('/me', async (req, res, next) => {
  let token;
  console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next({
      message: 'You need to be logged in to visit this route',
      statusCode: 403,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) {
      return next({ message: `no user found for email ${decoded.email}` });
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
      message: 'You need to be logged in to visit this route',
      statusCode: 403,
    });
  }
});

module.exports = router;
