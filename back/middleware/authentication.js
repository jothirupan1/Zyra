const jwt = require('jsonwebtoken');
const jwt_key = 'zayra';

module.exports = (allowedRoles = []) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, jwt_key);
    req.User = { userId: decoded.userId, role: decoded.role };
    if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
};

