const express = require('express');
const { Post, User } = require('../models');
const { verifyToken } = require('./middlewares');

const router = express.Router();

router.get('/', verifyToken, async (req, res, next) => {
  const users = await User.findAll();
  users.forEach((user) => {
    user._id = user.id;
  });
  users.filter((user) => user.id !== req.user.id);

  res.status(200).json({ success: true, data: users });
});

router.get('/feed', verifyToken, async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      where: {
        UserId: req.user.id,
      },
    });
    console.log(posts);
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
