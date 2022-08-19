const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.verifyToken = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    next({
      message,
      statusCode: 403,
    });
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { email: decoded.email } });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};
