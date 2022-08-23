const express = require('express');
const { verifyToken } = require('./middlewares');
const { User, Post, Hashtag, Comment } = require('../models');

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
      {
        model: Comment,
        attributes: ['id', 'text'],
        include: {
          model: User,
          attributes: ['id', 'avatar', 'username'],
        },
        order: [
          ['createdAt', 'DESC'],
          ['updatedAt', 'DESC'],
        ],
      },
    ],
    order: [
      ['createdAt', 'DESC'],
      ['updatedAt', 'DESC'],
    ],
  });
  posts.forEach((post) => {
    post.setDataValue('user', post.User);
    post.setDataValue('comments', post.Comments);
    if (post.Comments) {
      post.setDataValue('commentsCount', post.Comments.length);
      post.getDataValue('comments').forEach((comment) => {
        comment.setDataValue('user', comment.User);
      });
    } else {
      post.setDataValue('commentsCount', 0);
    }
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

    if (tags) {
      const result = await Promise.all(
        tags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1) },
          });
        })
      );
      await post.addHashtags(result.map((r) => r[0]));
    }

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
    post.setDataValue('likesCount', 0);
    post.setDataValue('comments', []);
    post.setDataValue('commentsCount', 0);
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
      {
        model: Comment,
        attributes: ['id', 'text'],
        include: {
          model: User,
          attributes: ['id', 'avatar', 'username'],
        },
        order: [
          ['createdAt', 'DESC'],
          ['updatedAt', 'DESC'],
        ],
      },
    ],
  });
  post.setDataValue('files', JSON.parse(post.files));
  post.setDataValue('user', post.User);
  if (post.User.id === req.user.id) {
    post.setDataValue('isMine', true);
  }
  post.setDataValue('comments', post.Comments);
  if (post.Comments) {
    post.setDataValue('commentsCount', post.Comments.length);
    post.getDataValue('comments').forEach((comment) => {
      comment.setDataValue('user', comment.User);
    });
  } else {
    post.setDataValue('commentsCount', 0);
  }
  post.LikeUsers.forEach((user) => {
    if (user.id === req.user.id) {
      post.setDataValue('isLiked', true);
    }
  });
  post.setDataValue('likesCount', post.LikeUsers.length);

  res.status(200).json({ success: true, data: post });
});

// modify
router.post('/:id', verifyToken, async (req, res, next) => {
  try {
  } catch (err) {
    console.error(err);
    next(err);
  }
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

router.get('/:id/toggleSave', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      include: {
        model: Post,
        attributes: ['id'],
        as: 'SavePosts',
      },
    });
    let detect = false;
    user.SavePosts.forEach((post) => {
      if (post.id === parseInt(req.params.id, 10)) {
        detect = true;
      }
    });
    if (detect) await user.removeSavePost(parseInt(req.params.id, 10));
    else await user.addSavePost(parseInt(req.params.id, 10));
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/:id/comments', verifyToken, async (req, res, next) => {
  const { text } = req.body;
  try {
    const comment = await Comment.create({
      text,
      UserId: req.user.id,
      PostId: req.params.id,
    });

    const user = {};
    user.avatar = req.user.avatar;
    user.username = req.user.username;
    comment.setDataValue('user', user);

    res.status(200).json({ success: true, data: comment });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
