const express = require('express');

const { verifyToken } = require('./middlewares');

const {
  getSuggestionFollowing,
  updateProfile,
  getFeeds,
  getProfile,
  addFollowing,
  removeFollowing,
} = require('../controller/users');

const router = express.Router();

router.use(verifyToken);

router.get('/', getSuggestionFollowing);
router.put('/', updateProfile);

router.get('/feed', getFeeds);
router.get('/:username', getProfile);

router.get('/:id/follow', addFollowing);
router.get('/:id/unfollow', removeFollowing);

module.exports = router;
