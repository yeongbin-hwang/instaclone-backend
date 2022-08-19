const express = require('express');
const { verifyToken } = require('./middlewares');
const { Post } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const posts = await Post.findAll();

  res.status(200).json({ success: true, data: posts });
});

router.post('/', verifyToken, async (req, res, next) => {
  const { caption, files, tags } = req.body;
  try {
    console.log(req.body);
    const post = await Post.create({
      content: caption,
      img: files[0],
      UserId: req.user.id,
    });
    console.log(post);
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
