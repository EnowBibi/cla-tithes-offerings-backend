const express = require('express');
const router = express.Router();
const pay = require('../services/mynkwa.service');

// Collect payment
router.post('/collect-payment', async (req, res) => {
  try {
    const { amount, phoneNumber } = req.body;

    if (!amount || !phoneNumber) {
      return res.status(400).json({ success: false, error: 'Amount and phoneNumber are required' });
    }

    const response = await pay.payments.collect({ amount, phoneNumber });

    // ✅ Return the full response directly as `data`
    res.json({ success: true, data: response });

  } catch (err) {
    console.error("Payment error:", err);
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || 'Internal server error',
    });
  }
});


// Disburse payment
router.post('/disburse', async (req, res) => {
  try {
    const { amount, phoneNumber } = req.body;
    if (!amount || !phoneNumber) {
      return res.status(400).json({ success: false, error: 'Amount and phoneNumber are required' });
    }

    const response = await pay.payments.disburse({ amount, phoneNumber });

    res.json({ success: true, data: response.payment });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, error: err.message || 'Internal server error' });
  }
});

// Get payment status
router.get('/:id', async (req, res) => {
  try {
    const response = await pay.payments.get({ id: req.params.id }); 
    res.json({ success: true, data: response });
  } catch (err) {
    console.error('Payment status error:', err);
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || 'Internal server error',
    });
  }
});


module.exports = router;
