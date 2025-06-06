const Transaction = require('../models/transaction.model');

exports.createTransaction = async (req, res) => {
  try {
    const { name,amount, category } = req.body;
    const userId = req.user.id;

    const newTransaction = await Transaction.create({
      user: userId,
      name,
      amount,
      category
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create transaction', error: error.message });
  }
};

exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all transactions', error: error.message });
  }
};
