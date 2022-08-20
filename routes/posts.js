const express = require('express');
const { verifyToken } = require('./middlewares');
const { User, Post } = require('../models');

const router = express.Router();

router.get('/', verifyToken, async (req, res, next) => {
  const posts = await Post.findAll({
    include: [
      {
        model: User,
        attributes: ['id', 'username', 'avatar'],
      },
      {
        model: User,
        attributes: ['id'],
        as: 'LikeUsers',
      },
    ],
    order: [
      ['createdAt', 'DESC'],
      ['updatedAt', 'DESC'],
    ],
  });
  posts.forEach((post) => {
    post.setDataValue('user', post.User);
    post.setDataValue('files', JSON.parse(post.files));
    if (post.User.id === req.user.id) {
      post.setDataValue('isMine', true);
    }
    post.LikeUsers.forEach((user) => {
      if (user.id === req.user.id) {
        post.setDataValue('isLiked', true);
      }
    });
  });

  res.status(200).json({ success: true, data: posts });
});

router.post('/', verifyToken, async (req, res, next) => {
  const { caption, files, tags } = req.body;
  try {
    console.log(req.body);
    let post = await Post.create({
      caption,
      files: JSON.stringify(files),
      UserId: req.user.id,
    });
    post = await Post.findOne({
      where: { id: post.id },
      include: {
        model: User,
        attributes: ['id', 'username', 'avatar'],
      },
    });
    post.setDataValue('files', JSON.parse(post.files));
    post.setDataValue('user', post.User);
    post.setDataValue('isMine', true);
    console.log(post);
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/:id', verifyToken, async (req, res, next) => {
  const post = await Post.findOne({
    where: { id: req.params.id },
    include: {
      model: User,
      attributes: ['id', 'username', 'avatar'],
    },
  });
  post.setDataValue('files', JSON.parse(post.files));
  post.setDataValue('user', post.User);
  post.setDataValue('comments', []);

  res.status(200).json({ success: true, data: post });
});

router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    // check user id is correct or not
    const post = await Post.findOne({
      where: { id: req.params.id },
      attributes: ['UserId'],
    });
    if (post.UserId !== req.user.id) {
      res.status(403).json({ message: 'illegal user attempt to delete post' });
    }
    if (!post) {
      res.status(403).json({ message: 'do not have the post' });
    }

    Post.destroy({ where: { id: req.params.id } });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/:id/toggleLike', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      include: {
        model: Post,
        attributes: ['id'],
        as: 'LikePosts',
      },
    });
    let detect = false;
    user.LikePosts.forEach((post) => {
      if (post.id === parseInt(req.params.id, 10)) {
        detect = true;
      }
    });
    if (detect) await user.removeLikePost(parseInt(req.params.id, 10));
    else await user.addLikePost(parseInt(req.params.id, 10));
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
