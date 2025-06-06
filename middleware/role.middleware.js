module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (req.user && req.user.role === requiredRole) {
      return next();
    }
    return res.status(403).json({ message: 'Access denied: insufficient privileges' });
  };
};
