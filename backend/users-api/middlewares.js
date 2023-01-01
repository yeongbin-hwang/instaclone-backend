const { sign, verify, refreshVerify } = require("./utils/jwt-util");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

module.exports = {
  verifyToken: async (req, res, next) => {
    let accessToken;
    let refreshToken;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer") &&
      req.headers.refresh
    ) {
      accessToken = req.headers.authorization.split(" ")[1];
      refreshToken = req.headers.refresh;
    } else {
      return next({
        message: "you do not have token",
        status: 401,
      });
    }
    // verify accessToken
    const result = verify(accessToken);
    if (!result.ok) {
      const decoded = jwt.decode(accessToken);
      const refreshResult = await refreshVerify(refreshToken, decoded.email);
      // 1. access token expired and refresh token expired
      if (!refreshResult) {
        next({
          message: "Both token are expired",
          status: 401,
        });
      }
      // 2. access token expired and refresh token valid
      else {
        const newAccessToken = sign(decoded.email);
        return res
          .status(201)
          .json({ success: true, accessToken: newAccessToken });
      }
    }
    // 3. access token valid
    const user = await User.findOne({
      where: { email: result.email },
      include: [
        {
          model: User,
          as: "Followers",
        },
        {
          model: User,
          as: "Followings",
        },
      ],
    });

    if (user === null) {
      next({
        message: "your token is invalid",
        status: 401,
      });
    }
    req.user = user;
    next();
  },
};
