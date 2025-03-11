const jwt = require('jsonwebtoken');
const User = require('../models/auth');

// Token kontrolü
const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; 
        if (token) {
            const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Kullanıcı bulunamadı.'
                });
            }
            req.user = user;
            return next(); 
        } else {
            const sessionId = req.body.sessionId || req.sessionId; 
            if (!sessionId) {
                return res.status(400).json({
                    success: false,
                    message: 'Session ID gerekli.'
                });
            }
            req.sessionId = sessionId;
            return next(); 
        }
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(403).json({
            success: false,
            message: 'Geçersiz veya süresi dolmuş token.'
        });
    }
};




// Admin kontrolü
const isAdmin = (req, res, next) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Bu işlem için admin yetkisi gereklidir.'
            });
        }
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Yetkilendirme Hatası.'
        });
    }
};

module.exports = { authenticateToken, isAdmin };
