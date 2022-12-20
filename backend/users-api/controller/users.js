const { Post, User, Comment } = require('../models');

exports.addFollowing = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      exclude: ['password'],
    });
    if (user) {
      await user.addFollowings(parseInt(req.params.id, 10));
      res.status(200).json({ success: true });
    } else {
      res.status(403).json({
        message: 'my information is deleted',
        statusCode: 403,
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.removeFollowing = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      exclude: ['password'],
    });
    if (user) {
      await user.removeFollowings(parseInt(req.params.id, 10));
      res.status(200).json({ success: true });
    } else {
      res.status(403).json({
        message: 'my information is deleted',
        statusCode: 403,
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getFeeds = async (req, res, next) => {
  try {
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
          model: User,
          attributes: ['id'],
          as: 'SaveUsers',
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
      post.setDataValue('files', JSON.parse(post.files));
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

      post.SaveUsers.forEach((user) => {
        if (user.id === req.user.id) {
          post.setDataValue('isSaved', true);
        }
      });
    });
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  const user = await User.findOne({
    where: { username: req.params.username },
    attributes: {
      exclude: ['password'],
    },
    include: [
      {
        model: User,
        as: 'Followers',
      },
      {
        model: User,
        as: 'Followings',
      },
      {
        model: Post,
        attributes: ['id'],
        as: 'SavePosts',
      },
    ],
  });
  if (!user) {
    return res.status(403).json({
      message: 'wrong profile',
      statusCode: 403,
    });
  }

  const savedPosts = await Post.findAll({
    where: { id: user.SavePosts.map((f) => f.id) },
  });
  savedPosts.forEach((post) => {
    post.setDataValue('files', JSON.parse(post.files));
  });

  const posts = await Post.findAll({
    where: { UserId: user.id },
  });
  posts.forEach((post) => {
    post.setDataValue('files', JSON.parse(post.files));
  });

  if (req.user.id !== user.id) {
    user.setDataValue('isMe', false);
  } else {
    user.setDataValue('isMe', true);
  }
  // user에 user.postscount, user.followingcount, user.followercount, user.posts
  // 우선은 모델이 또 Post로 되어있으니까, setDatavalue로 하고 수정.
  // follower들도 이름이 달라서 set으로 해야할듯.
  // profile?.followers.length
  user.setDataValue('savedPosts', savedPosts);
  user.setDataValue('posts', posts);
  user.setDataValue('postCount', posts.length);
  user.setDataValue('following', user.Followings);
  user.getDataValue('following').forEach((following) => {
    if (req.user.Followings.map((f) => f.id).includes(following.id)) {
      following.setDataValue('isFollowing', true);
    }
  });
  user.setDataValue('followingCount', user.Followings.length);
  user.setDataValue('followers', user.Followers);
  user.setDataValue('followersCount', user.Followers.length);
  user.getDataValue('followers').forEach((follower) => {
    if (req.user.Followings.map((f) => f.id).includes(follower.id)) {
      follower.setDataValue('isFollowing', true);
    }
    if (follower.username === req.user.username) {
      user.setDataValue('isFollowing', true);
    }
  });
  return res.status(200).json({ success: true, data: user });
};

exports.updateProfile = async (req, res, next) => {
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
};

exports.getSuggestionFollowing = async (req, res, next) => {
  const myUser = await User.findOne({
    where: { id: req.user.id },
    include: {
      model: User,
      attributes: ['id'],
      as: 'Followings',
    },
  });
  let users = await User.findAll();
  users = users.filter((user) => user.id !== req.user.id);
  users.forEach((user) => {
    myUser.Followings.forEach((following) => {
      if (following.id === user.id) {
        user.setDataValue('isFollowing', true);
      }
    });
  });

  res.status(200).json({ success: true, data: users });
};
