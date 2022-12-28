const profile = require("./profile");
const follow = require("./follow");
const unfollow = require("./unfollow");
const feed = require("./feed");
const userProfile = require("./userProfile");
module.exports = {
  ...profile,
  ...follow,
  ...unfollow,
  ...feed,
  ...userProfile,
};
