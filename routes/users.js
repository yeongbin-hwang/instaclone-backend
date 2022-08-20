const express = require('express');
const { Post, User } = require('../models');
const { verifyToken } = require('./middlewares');

const router = express.Router();

router.get('/', verifyToken, async (req, res, next) => {
  let users = await User.findAll();
  users = users.filter((user) => user.id !== req.user.id);

  res.status(200).json({ success: true, data: users });
});

router.put('/', verifyToken, async (req, res, next) => {
  const { fullname, username, website, bio, avatar } = req.body;
  if (fullname === null || username === null) {
    res.status(403).json({ message: 'please enter the name' });
  }
  const user = await User.update(
    {
      fullname,
      username,
      website,
      bio,
      avatar,
    },
    {
      where: { id: req.user.id },
      fields: ['fullname', 'username', 'website', 'bio', 'avatar'],
    }
  );
  console.log(user);
  res.status(200).json({ success: true, data: user });
});

router.get('/feed', verifyToken, async (req, res, next) => {
  try {
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
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/:username', verifyToken, async (req, res, next) => {
  const user = await User.findOne({
    where: { username: req.params.username },
    attributes: {
      exclude: ['password'],
    },
  });
  if (!user) {
    return res.status(403).json({
      message: 'wrong profile',
      statusCode: 403,
    });
  }
  if (req.user.id !== user.id) {
    user.setDataValue('isMe', false);
  } else {
    user.setDataValue('isMe', true);
  }
  return res.status(200).json({ success: true, data: user });
});

module.exports = router;
