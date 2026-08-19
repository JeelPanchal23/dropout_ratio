const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'edushield_super_secret_jwt_key_2026';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Authentication token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired security token.' });
    }
    req.user = user;
    next();
  });
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || (roles.length > 0 && !roles.includes(req.user.role))) {
      return res.status(403).json({ message: 'Forbidden. Insufficient role permissions.' });
    }
    next();
  };
};

const verifyStudentOwnership = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  // Admin and Faculty can access any student record
  if (req.user.role === 'Admin' || req.user.role === 'Faculty') {
    return next();
  }

  // Students can ONLY access their own student ID or records
  const targetId = req.params.id || req.params.studentId || req.body.studentId;
  if (req.user.role === 'Student') {
    if (req.user.studentId && targetId && (req.user.studentId === targetId || req.user.id === targetId)) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden. You can only access your own student data.' });
  }

  return res.status(403).json({ message: 'Forbidden. Unauthorized access.' });
};

module.exports = { authenticateToken, requireRole, verifyStudentOwnership, JWT_SECRET };

