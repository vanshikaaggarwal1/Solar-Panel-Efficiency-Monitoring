const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Malformed token.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.status === 'Inactive') {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Access denied.' });
    }
    req.user = decoded;
    
    // Attach scoping query helper
    if (decoded.accountType === 'personal' || !decoded.organizationId) {
      req.scope = { userId: decoded.id };
    } else {
      req.scope = { organizationId: decoded.organizationId };
    }

    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'Admin' && req.user.role !== 'Administrator')) {
    return res.status(403).json({ success: false, message: 'Access denied. Admin authorization required.' });
  }
  next();
};

const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    // Personal account users automatically have full access to their personal resources
    if (req.user.accountType === 'personal') {
      return next();
    }

    const normalizedRole = req.user.role || 'Viewer';
    const hasRole = allowedRoles.some(r => r.toLowerCase() === normalizedRole.toLowerCase());

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' does not have sufficient permission for this action.`
      });
    }

    next();
  };
};

const requireAccountTypes = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    const currentType = (req.user.accountType || 'personal').toLowerCase();
    const isAllowed = allowedTypes.some(t => t.toLowerCase() === currentType);

    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        message: `Forbidden for account type '${req.user.accountType}'.`
      });
    }
    next();
  };
};

module.exports = { verifyToken, verifyAdmin, requireRoles, requireAccountTypes, JWT_SECRET };
