const express = require('express');
const router = express.Router();
const { getReport, exportReport } = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.get('/report', authMiddleware, roleMiddleware('admin'), getReport);
router.get('/export', authMiddleware, roleMiddleware('admin'), exportReport);

module.exports = router;
