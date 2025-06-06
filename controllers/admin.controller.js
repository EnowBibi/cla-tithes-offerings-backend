const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');

exports.getReport = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch report', error: error.message });
  }
};

exports.exportReport = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('user', 'name email');

    const reportData = transactions.map(tx => ({
      Name: tx.user.name,
      Email: tx.user.email,
      Amount: tx.amount,
      Category: tx.category,
      Status: tx.status,
      Date: tx.createdAt.toISOString()
    }));

    res.status(200).json({ export: reportData });
  } catch (error) {
    res.status(500).json({ message: 'Failed to export report', error: error.message });
  }
};
