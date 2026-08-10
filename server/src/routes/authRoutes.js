const express = require('express');
const {
    register,
    login,
    me,
} = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');
const {
    loginRateLimiter,
} = require('../middleware/rateLimitMiddleware');

const router = express.Router();

router.post('/register', register);

router.post('/login', loginRateLimiter, login);

router.get('/me', authMiddleware, me);

module.exports = router;