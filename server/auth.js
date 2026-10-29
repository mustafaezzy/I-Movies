const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').split(' ')[1];
    req.userId = jwt.verify(token, process.env.JWT_SECRET || 'dev').id;
    next();
  } catch { res.status(401).json({ message: 'Please log in' }); }
};
