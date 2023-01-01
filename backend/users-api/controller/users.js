const { Post, User, Comment } = require("../models");

exports.addFollowing = async (req, res, next) => {
  try {
    const user = req.user;
    await user.addFollowings(parseInt(req.params.id, 10));
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.removeFollowing = async (req, res, next) => {
  try {
    const user = req.user;
    await user.removeFollowings(parseInt(req.params.id, 10));
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.getFeeds = async (req, res, next) => {
  try {
    // for test without token
    // req.user = req.body.user;

    // only feed that uploaded by person i following
    const posts = await Post.findAll({
      where: {
        UserId: req.user.Followings.map((f) => f.id).concat(req.user.id),
      },
      include: [
        {
          model: User,
          attributes: ["id", "username", "avatar"],
        },
        {
          model: User,
          attributes: ["id"],
          as: "LikeUsers",
        },
        {
          model: User,
          attributes: ["id"],
          as: "SaveUsers",
        },
        {
          model: Comment,
          attributes: ["id", "text"],
          include: {
            model: User,
            attributes: ["id", "avatar", "username"],
          },
          order: [
            ["createdAt", "DESC"],
            ["updatedAt", "DESC"],
          ],
        },
      ],
      order: [
        ["createdAt", "DESC"],
        ["updatedAt", "DESC"],
      ],
    });
    // process data for frontend
    posts.forEach((post) => {
      post.setDataValue("files", JSON.parse(post.files));
      if (post.User.id === req.user.id) {
        post.setDataValue("isMine", true);
      }
      post.setDataValue("commentsCount", post.Comments.length);
      post.LikeUsers.forEach((user) => {
        if (user.id === req.user.id) {
          post.setDataValue("isLiked", true);
        }
      });
      post.setDataValue("likesCount", post.LikeUsers.length);

      post.SaveUsers.forEach((user) => {
        if (user.id === req.user.id) {
          post.setDataValue("isSaved", true);
        }
      });
    });
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: User,
          as: "Followers",
        },
        {
          model: User,
          as: "Followings",
        },
        {
          model: Post,
          as: "SavePosts",
        },
        {
          model: Post,
        },
      ],
    });
    if (!user) {
      return res.status(403).json({
        message: "wrong profile",
        status: 403,
      });
    }

    // process data for frontend
    user.SavePosts.forEach((post) => {
      post.setDataValue("files", JSON.parse(post.files));
    });
    user.Posts.forEach((post) => {
      post.setDataValue("files", JSON.parse(post.files));
    });

    if (req.user.id !== user.id) {
      user.setDataValue("isMe", false);
    } else {
      user.setDataValue("isMe", true);
    }

    user.Followings.forEach((following) => {
      if (req.user.Followings.map((f) => f.id).includes(following.id)) {
        following.setDataValue("isFollowing", true);
      }
    });
    user.setDataValue("postCount", user.Posts.length);
    user.setDataValue("followingCount", user.Followings.length);
    user.setDataValue("followersCount", user.Followers.length);
    user.Followers.forEach((follower) => {
      if (req.user.Followings.map((f) => f.id).includes(follower.id)) {
        follower.setDataValue("isFollowing", true);
      }
      if (follower.username === req.user.username) {
        user.setDataValue("isFollowing", true);
      }
    });
    console.log(user);
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  // for test without token
  // req.user = req.body.user;
  const { fullname, username, website, bio, avatar } = req.body;
  if (fullname == null || username == null) {
    return res.status(403).json({ message: "please enter the name" });
  }

  try {
    await User.update(
      {
        fullname,
        username,
        website,
        bio,
        avatar,
      },
      {
        where: { id: req.user.id },
        fields: ["fullname", "username", "website", "bio", "avatar"],
      }
    );
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: {
        exclude: ["password"],
      },
    });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.getSuggestionFollowing = async (req, res, next) => {
  try {
    // for test without token
    // req.user = req.body.user;
    const myUser = await User.findOne({
      where: { id: req.user.id },
      attributes: ["id"],
      include: {
        model: User,
        attributes: ["id"],
        as: "Followings",
      },
    });
    let users = await User.findAll({
      attributes: ["id", "fullname", "username", "avatar"],
    });
    const followings = myUser.Followings.map((f) => f.id).concat(req.user.id);
    users = users.filter((user) => !followings.includes(user.id));
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};
