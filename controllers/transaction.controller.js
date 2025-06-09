const Transaction = require('../models/transaction.model');

exports.createTransaction = async (req, res) => {
   try {
    console.log(req.body)
    const { name, amount, phoneNumber, category, status, referenceId } = req.body;
    const transaction = await Transaction.create({
      user: req.user.id,
      name,
      amount,
      phoneNumber,
      category,
      status,
      referenceId,
    });
    console.log(transaction)
    res.status(201).json({ transaction });
  }catch (err) {
  console.error('Transaction error:', err); // Add this
  res.status(500).json({ message: 'Failed to create transaction', error: err.message });
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
