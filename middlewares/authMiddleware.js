const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  
  const token = req.headers['authorization'];

  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token is missing.' });
  }

  try {
    
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.role=decoded.role
                    
    next(); 
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};


const isAdmin = (req, res, next) => {
    
    
    if (req.role !== 'admin') return res.status(403).send('Access denied. You are not authorized to perform this action.');
    next();
};

module.exports = { verifyToken, isAdmin };