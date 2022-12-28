const login = require("./login");
const signup = require("./signup");
const verify = require("./verify");

module.exports = {
  ...login,
  ...signup,
  ...verify,
};
