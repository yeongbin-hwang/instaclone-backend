const { User, Post, Hashtag, Comment } = require("../models");

exports.toggleLike = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ["id"],
      include: {
        model: Post,
        attributes: ["id"],
        as: "LikePosts",
        where: { id: req.params.id },
      },
    });
    if (user) {
      await user.removeLikePost(parseInt(req.params.id, 10));
      res.status(200).json({ success: true });
    } else {
      await req.user.addLikePost(parseInt(req.params.id, 10));
      res.status(200).json({ success: true });
    }
  } catch (err) {
    next(err);
  }
};

exports.toggleSave = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ["id"],
      include: {
        model: Post,
        attributes: ["id"],
        as: "SavePosts",
        where: { id: req.params.id },
      },
    });
    if (user) {
      await user.removeSavePost(parseInt(req.params.id, 10));
      res.status(200).json({ success: true });
    } else {
      await req.user.addSavePost(parseInt(req.params.id, 10));
      res.status(200).json({ success: true });
    }
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    // check user id is correct or not
    const post = await Post.findOne({
      where: { id: req.params.id },
      attributes: ["UserId"],
    });
    if (!post) {
      return res.status(403).json({ message: "do not have the post" });
    }

    if (post.UserId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "illegal user attempt to delete post" });
    }

    await Post.destroy({ where: { id: req.params.id } });
  } catch (err) {
    next(err);
  }
};

exports.getPosts = async (req, res, next) => {
  const posts = await Post.findAll({
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
  posts.forEach((post) => {
    post.setDataValue("commentsCount", post.Comments.length);
    post.setDataValue("files", JSON.parse(post.files));
    if (post.User.id === req.user.id) {
      post.setDataValue("isMine", true);
    }
    post.LikeUsers.forEach((user) => {
      if (user.id === req.user.id) {
        post.setDataValue("isLiked", true);
      }
    });
  });

  res.status(200).json({ success: true, data: posts });
};

exports.uploadPost = async (req, res, next) => {
  const { caption, files, tags } = req.body;
  try {
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
        attributes: ["id", "username", "avatar"],
      },
    });
    post.setDataValue("files", JSON.parse(post.files));
    post.setDataValue("isMine", true);
    post.setDataValue("likesCount", 0);
    post.setDataValue("commentsCount", 0);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

exports.getDetailPost = async (req, res, next) => {
  const post = await Post.findOne({
    where: { id: req.params.id },
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
  });
  // process data for frontend
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
  res.status(200).json({ success: true, data: post });
};

exports.updatePost = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

exports.uploadComment = async (req, res, next) => {
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
    comment.setDataValue("user", user);

    res.status(200).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};
