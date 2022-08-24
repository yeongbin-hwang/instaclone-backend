const express = require('express');

const { login, signup, verifyCheck } = require('../controller/auth');

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/me', verifyCheck);

module.exports = router;
