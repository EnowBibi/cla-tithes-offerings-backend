const express = require('express');
const router = express.Router();
const { getProfile, updateScheduledGiving, uploadProfilePicture } = require('../controllers/user.controller');

const authMiddleware = require('../middleware/auth.middleware');

router.get('/profile', authMiddleware, getProfile);
router.patch('/schedule', authMiddleware, updateScheduledGiving);
router.post('/profile-picture', authMiddleware, uploadProfilePicture);

module.exports = router;
