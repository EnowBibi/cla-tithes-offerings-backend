const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { forgotPassword } = require('../controllers/auth.controller');
const { verifyCode } = require('../controllers/auth.controller');
const { resetPassword } = require('../controllers/auth.controller');

router.post('/reset-password', resetPassword);
router.post('/verify-code', verifyCode);
router.post('/forgot-password', forgotPassword);
router.post('/register', register);
router.post('/login', login);

module.exports = router;

