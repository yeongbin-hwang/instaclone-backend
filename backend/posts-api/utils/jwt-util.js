const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const redisClient = require("./redis");
const secret = process.env.JWT_SECRET;

module.exports = {
  sign: (email) => {
    const payload = {
      email,
    };

    return jwt.sign(payload, secret, {
      algorithm: "HS256",
      expiresIn: "1h",
      issuer: "instaclone-authApi",
    });
  },
  verify: (token) => {
    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
      return {
        ok: true,
        email: decoded.email,
      };
    } catch (err) {
      return {
        ok: false,
        err: err,
      };
    }
  },
  refresh: () => {
    return jwt.sign({}, secret, {
      algorithm: "HS256",
      expiresIn: "14d",
    });
  },
  refreshVerify: async (token, userId) => {
    const getAsync = promisify(redisClient.get).bind(redisClient);

    try {
      const data = await getAsync(userId);
      if (token === data) {
        try {
          jwt.verify(token, secret);
          return true;
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  },
};
