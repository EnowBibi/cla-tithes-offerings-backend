const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getUserTransactions,
  getAllTransactions
} = require('../controllers/transaction.controller');

const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// Protected route: user must be logged in
router.post('/', authMiddleware, createTransaction);
router.get('/my', authMiddleware, getUserTransactions);

// Admin route: user must be admin
router.get('/all', authMiddleware, roleMiddleware('admin'), getAllTransactions);

module.exports = router;
