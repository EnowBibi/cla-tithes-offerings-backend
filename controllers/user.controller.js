const User = require('../models/user.model');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    const base64Image = user.profilePicture?.data
      ? `data:${user.profilePicture.contentType};base64,${user.profilePicture.data.toString('base64')}`
      : null;

    res.status(200).json({
      ...user.toObject(),
      profileImage: base64Image,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

exports.updateScheduledGiving = async (req, res) => {
  try {
    const { enabled, day, amount, category } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        scheduledGiving: {
          enabled,
          day,
          amount,
          category
        }
      },
      { new: true }
    ).select('-password');

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update scheduled giving', error: error.message });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    const { data, contentType } = req.body.profilePicture;
    const buffer = Buffer.from(data, 'base64');

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        profilePicture: {
          data: buffer,
          contentType
        }
      },
      { new: true }
    ).select('-password');

    const base64Image = updatedUser.profilePicture?.data
      ? `data:${updatedUser.profilePicture.contentType};base64,${updatedUser.profilePicture.data.toString('base64')}`
      : null;

    res.status(200).json({
      message: 'Profile picture updated',
      user: {
        ...updatedUser.toObject(),
        profileImage: base64Image,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload profile picture', error: error.message });
  }
};
