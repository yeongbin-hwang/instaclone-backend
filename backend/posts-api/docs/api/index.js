const comment = require("./comment");
const detailPost = require("./detailPost");
const post = require("./post");
const toggleLike = require("./toggleLike");
const toggleSave = require("./toggleSave");
module.exports = {
  ...post,
  ...comment,
  ...detailPost,
  ...toggleLike,
  ...toggleSave,
};
