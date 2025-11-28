const jwt = require('jsonwebtoken');
const { admin } = require('../firebase/firebase');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  try {
    // Try Firebase ID token first
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email
    };
    next();
  } catch (firebaseError) {
    // Fallback to JWT for email/password auth
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name
      };
      next();
    } catch (jwtError) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
  }
};

module.exports = { authenticateToken };