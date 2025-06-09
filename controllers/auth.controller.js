const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Email already in use' });

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) return res.status(400).json({ message: 'Phone number already in use' });

    const user = await User.create({ name, email, phone, password });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Register error:', err); 
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Match user by email OR phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.status(200).json({ user, token });

  } catch (err) {
    console.log("error:",err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// You can store this temporary reset code and expiry in the DB
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with that email' });

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the code and expiry to the user (optional, depends on your flow)
    user.resetCode = code;
    user.resetCodeExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    // Set up transporter using Gmail (or use other SMTP service)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,       // from .env
        pass: process.env.MAIL_PASS        // App password, not Gmail password
      }
    });

    const mailOptions = {
      from: '"CLA Support" <no-reply@cla.com>',
      to: email,
      subject: 'Your Password Reset Code',
      html: `
        <h3>Hello ${user.name},</h3>
        <p>Your password reset code is:</p>
        <h2 style="color:#002CDD">${code}</h2>
        <p>This code will expire in 15 minutes.</p>
        <br/>
        <p>God bless,</p>
        <strong>CLA App Team</strong>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Reset code sent to email' });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ message: 'Failed to send reset code', error: err.message });
  }
};
exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.resetCode || !user.resetCodeExpires) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    if (user.resetCode !== code) {
      return res.status(400).json({ message: 'Incorrect verification code' });
    }

    if (user.resetCodeExpires < Date.now()) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    // Optional: clear the code
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Code verified successfully' });
  } catch (err) {
    console.error('Verify code error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.password = password; // bcrypt will hash it in the pre-save hook
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      message: 'Password reset successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
