// auth.js
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // Ganti dengan secret key Anda

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
        req.user = user;
        next();
    });
};

module.exports = {
    authenticateToken,
    secretKey
};
