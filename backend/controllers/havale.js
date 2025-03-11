const Havale = require('../models/havale');
const Order = require('../models/order');
const jwt = require('jsonwebtoken');

// Yeni havale oluşturma
const createHavale = async (req, res) => {

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
            
    const { orderId, firstName, lastName, bankName, accountNumber, transactionReference, amount } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Sipariş bulunamadı.' });
        }

        const newHavale = new Havale({
            
            userId: userId || null,
            sessionId: sessionId || null,
            orderId,
            firstName,
            lastName,
            bankName,
            accountNumber,
            transactionReference,
            amount
        });

        await newHavale.save();

        return res.status(201).json({ message: 'Havale bilgileri başarıyla kaydedildi.', data: newHavale });
    } catch (error) {
        console.error('Havale oluşturulurken hata:', error);
        return res.status(500).json({ message: 'Havale oluşturulurken bir hata oluştu.' });
    }
};

// Tüm havaleleri listeleme
const getHavales = async (req, res) => {
    try {
        const havaleler = await Havale.find().populate('orderId');
        return res.status(200).json(havaleler);
    } catch (error) {
        console.error('Havaleler alınırken hata:', error);
        return res.status(500).json({ message: 'Havaleler alınırken bir hata oluştu.' });
    }
};

// Havale güncelleme
const updateHavale = async (req, res) => {
    
    const { id } = req.params;

    try {
        const updatedHavale = await Havale.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedHavale) {
            return res.status(404).json({ message: 'Havale bulunamadı.' });
        }
        return res.status(200).json({ message: 'Havale başarıyla güncellendi.', data: updatedHavale });
    } catch (error) {
        console.error('Havale güncellenirken hata:', error);
        return res.status(500).json({ message: 'Havale güncellenirken bir hata oluştu.' });
    }
};

// Havale silme
const deleteHavale = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedHavale = await Havale.findByIdAndDelete(id);
        if (!deletedHavale) {
            return res.status(404).json({ message: 'Havale bulunamadı.' });
        }
        return res.status(200).json({ message: 'Havale başarıyla silindi.' });
    } catch (error) {
        console.error('Havale silinirken hata:', error);
        return res.status(500).json({ message: 'Havale silinirken bir hata oluştu.' });
    }
};

const getUserHavales = async (req, res) => {
    try {
        const userId = req.user.id;

        const havaleler = await Havale.find({ userId })
            .populate({
                path: 'orderId',
                select: 'items totalAmount status createdAt',
                populate: {
                    path: 'items.product',
                    select: 'name brand imageUrls'
                }
            })
            .sort({ createdAt: -1 });
            
        const formattedHavaleler = havaleler.map(havale => ({
            _id: havale._id,
            amount: havale.amount,
            bankName: havale.bankName,
            accountNumber: havale.accountNumber,
            firstName: havale.firstName,
            lastName: havale.lastName,
            status: havale.status,
            createdAt: havale.createdAt,
            order: havale.orderId ? {
                _id: havale.orderId._id,
                totalAmount: havale.orderId.totalAmount,
                status: havale.orderId.status,
                items: havale.orderId.items,
                createdAt: havale.orderId.createdAt
            } : null
        }));

        res.status(200).json({
            success: true,
            count: formattedHavaleler.length,
            data: formattedHavaleler
        });

    } catch (error) {
        console.error('Havale ödemeleri getirilirken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Havale ödemeleri getirilirken bir hata oluştu',
            error: error.message
        });
    }
};


module.exports = {createHavale, getHavales, updateHavale, deleteHavale, getUserHavales };