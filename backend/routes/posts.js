const express = require('express');
const { verifyToken } = require('./middlewares');

const {
  getPosts,
  uploadPost,
  getDetailPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleSave,
  uploadComment,
} = require('../controller/posts');

const router = express.Router();

router.use(verifyToken);

router.get('/', getPosts);
router.post('/', uploadPost);
router.get('/:id', getDetailPost);
router.post('/:id', updatePost);
router.delete('/:id', deletePost);

router.get('/:id/toggleLike', toggleLike);
router.get('/:id/toggleSave', toggleSave);
router.post('/:id/comments', uploadComment);

module.exports = router;
