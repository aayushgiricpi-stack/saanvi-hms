const authorizeRole =
  (role) =>
  (req, res, next) => {
    if (
      !req.user ||
      req.user.role !== role
    ) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }

    next();
  };

module.exports = authorizeRole;