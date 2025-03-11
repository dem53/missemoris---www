const Order = require('../models/order');
const User = require('../models/auth');
const jwt = require('jsonwebtoken');

// Sipariş oluşturma
const createOrder = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        let userId = null;
        let sessionId = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
                userId = decoded.id;
            } catch (error) {
                console.error('Token doğrulama hatası:', error);
                return res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token.' });
            }
        }

        if (!userId) {
            sessionId = req.cookies.sessionId || 'anon_' + Math.random().toString(36).substring(2, 15);
            res.cookie('sessionId', sessionId, { httpOnly: true, maxAge: 30 * 60 * 1000 });
        }

        console.log("Sipariş oluşturuluyor...");

        const { items, totalAmount, shippingAddress, phone, name, surname, paymentMethod, tcIdentityNumber, city, country, district, email } = req.body;

        const newOrder = new Order({
            userId: userId || null, 
            sessionId: sessionId || null,
            items,
            totalAmount,
            shippingAddress,
            email,
            phone,
            name,
            surname,
            paymentMethod,
            tcIdentityNumber,
            city,
            country,
            district
        });

        await newOrder.save();
        console.log("Oluşturulan Sipariş", newOrder);
        res.status(201).json(newOrder);
        
    } catch (error) {
        console.error('Sipariş oluşturulurken hata:', error);
        res.status(500).json({ message: 'Sipariş oluşturulurken bir hata oluştu', error: error.message });
    }
};

//Sipariş Listeleme

const getOrders = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token bulunamadı, lütfen giriş yapın.' });
    }

    try {
        // Token doğrulaması yap
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        const userId = decoded.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ message: 'Bu işlem için admin yetkisi gereklidir.' });
        }

        const orders = await Order.find().populate('items.product');
        res.status(200).json(orders);

    } catch (error) {
        console.error('Siparişler alınırken hata:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Geçersiz token.' });
        }
        res.status(500).json({ message: 'Siparişler alınırken bir hata oluştu', error: error.message });
    }
};


const updateOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Sipariş bulunamadı' });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Sipariş güncellenirken hata:', error);
        res.status(500).json({ message: 'Sipariş güncellenirken bir hata oluştu', error: error.message });
    }
};

const getUserOrders = async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await Order.find({ userId }).populate('items.product');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Kullanıcı siparişleri alınırken hata:', error);
        res.status(500).json({ message: 'Kullanıcı siparişleri alınırken bir hata oluştu', error: error.message });
    }
};



module.exports = { createOrder, getOrders, updateOrder, getUserOrders };
