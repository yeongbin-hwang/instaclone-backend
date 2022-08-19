const express = require('express');
const passport = require('passport');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', (req, res, next) => {});

// signup and issue the jwt token
router.post('/signup', async (req, res, next) => {
  const { email, fullname, username, password } = req.body;
  const exUser = await User.findOne({ where: { email } });
  if (exUser) {
    // need to fix
    res.status(300).json({ success: false });
  } else {
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
          id: email,
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
  }
});

// check the token is valid or not
router.get('/me', async (req, res, next) => {
  let token;
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
    const user = await User.findOne({ where: { email: decoded.id } });

    if (!user) {
      return next({ message: `no user found for id ${decoded.id}` });
    }

    req.user = user;
    const { username, fullname, email } = user;
    res.status(200).json({
      success: true,
      data: {
        username,
        fullname,
        email,
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
