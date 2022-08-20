const express = require('express');
const { verifyToken } = require('./middlewares');
const { User, Post } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const posts = await Post.findAll({
    include: {
      model: User,
      attributes: ['username', 'avatar'],
    },
    order: [
      ['createdAt', 'DESC'],
      ['updatedAt', 'DESC'],
    ],
  });
  // need to fix, 이름이 User로 들어가서 에러 발생.
  posts.forEach((post) => {
    post.setDataValue('user', post.User);
  });

  res.status(200).json({ success: true, data: posts });
});

router.post('/', verifyToken, async (req, res, next) => {
  const { caption, files, tags } = req.body;
  try {
    console.log(req.body);
    let post = await Post.create({
      caption,
      files: files[0],
      UserId: req.user.id,
    });
    post = await Post.findOne({
      where: { id: post.id },
      include: {
        model: User,
        attributes: ['username', 'avatar'],
      },
    });
    post.setDataValue('user', post.User);
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
