const Cart = require('../models/cart');
const Product = require('../models/post');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const authenticateUser = (token) => {
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        return decoded.id;
    } catch (error) {
        console.error('Token doğrulama hatası:', error);
        return null;
    }
};

// Sepet getirme
const getCart = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const userId = authenticateUser(token);
      const sessionId = req.body.sessionId || req.query.sessionId;
  
      if (!userId && !sessionId) {
        return res.status(400).json({ message: 'Kullanıcı kimliği veya oturum bilgisi gerekli' });
      }
  
      const query = userId ? { userId } : { sessionId };
      const update = { $setOnInsert: { items: [] } };
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  
      const cart = await Cart.findOneAndUpdate(query, update, options)
        .populate('items.product');
  
      res.json(cart);
    } catch (error) {
      console.error('Sepet getirme hatası:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  };


  const addToCart = async (req, res) => {
    try {

        const { productId, quantity = 1 } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        const userId = authenticateUser(token);
        const sessionId = req.body.sessionId;

        // Kullanıcı kimliği veya oturum kontrolü
        if (!userId && !sessionId) {
            return res.status(400).json({ message: 'Kullanıcı kimliği veya oturum bilgisi gerekli' });
        }

        // Ürün ID kontrolü
        if (!productId) {
            return res.status(400).json({ message: 'Ürün ID gerekli' });
        }

        // Ürünü veritabanından çekme
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı' });
        }

        // Kullanıcıya ait sepeti bulma
        let cart = await Cart.findOne(userId ? { userId } : { sessionId });

        // Eğer sepet yoksa yeni bir sepet oluşturulacak
        if (!cart) {
            cart = new Cart({
                userId: userId || null,
                sessionId: userId ? null : sessionId,
                items: []
            });
        }

        // Mevcut sepette aynı ürün ve aynı bedene sahip bir öğe var mı diye kontrol etme
        const existingItem = cart.items.find(item => 
            item.product.toString() === productId && item.size === size // Burada ürün ve beden kombinasyonuna bakıyoruz
        );

        // Eğer aynı üründen aynı beden zaten sepette varsa, sadece miktarı artırıyoruz
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            // Eğer aynı ürün ve beden yoksa, yeni bir öğe ekliyoruz
            cart.items.push({
                product: productId,
                quantity,
                price: product.price
            });
        }

        // Sepeti kaydetme
        await cart.save();

        console.log("SEPET : ", cart);
        
        // Sepeti popüle etme
        await cart.populate('items.product');
        
        // Başarılı yanıt gönderme
        res.json({
            message: 'Ürün sepete eklendi',
            cart
        });

    } catch (error) {
        console.error('Sepete ekleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};


// Sepetten ürün çıkarma
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const token = req.headers.authorization?.split(' ')[1];
        const userId = authenticateUser(token);
        const sessionId = req.body.sessionId;

        if (!userId && !sessionId) {
            return res.status(400).json({ message: 'Kullanıcı kimliği veya oturum bilgisi gerekli' });
        }

        if (!productId) {
            return res.status(400).json({ message: 'Ürün ID gerekli' });
        }

        let cart = await Cart.findOne(userId ? { userId } : { sessionId });

        if (!cart) {
            return res.status(404).json({ message: 'Sepet bulunamadı' });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Ürün sepette bulunamadı' });
        }

        // Ürün miktarını azalt veya tamamen kaldır
        if (cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity -= 1;
        } else {
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();
        await cart.populate('items.product');

        res.json({
            message: 'Ürün sepetten çıkarıldı',
            cart
        });

    } catch (error) {
        console.error('Sepetten çıkarma hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Sepeti temizleme
const clearCart = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const userId = authenticateUser(token);
        const sessionId = req.body.sessionId;

        if (!userId && !sessionId) {
            return res.status(400).json({ message: 'Kullanıcı kimliği veya oturum bilgisi gerekli' });
        }

        let cart = await Cart.findOne(userId ? { userId } : { sessionId });

        if (!cart) {
            return res.status(404).json({ message: 'Sepet bulunamadı' });
        }

        cart.items = [];
        await cart.save();

        res.json({
            message: 'Sepet temizlendi',
            cart
        });

    } catch (error) {
        console.error('Sepet temizleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Sepetleri birleştirme
const mergeCarts = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        const userId = authenticateUser(token);

        if (!userId || !sessionId) {
            return res.status(400).json({ message: 'Kullanıcı kimliği ve oturum bilgisi gerekli' });
        }

        const guestCart = await Cart.findOne({ sessionId });
        let userCart = await Cart.findOne({ userId });

        if (!guestCart) {
            return res.status(404).json({ message: 'Misafir sepeti bulunamadı' });
        }

        if (!userCart) {
            userCart = new Cart({ userId, items: [] });
        }

        // Misafir sepetindeki ürünleri kullanıcı sepetine ekle
        guestCart.items.forEach(guestItem => {
            const existingItem = userCart.items.find(item => 
                item.product.toString() === guestItem.product.toString()
            );

            if (existingItem) {
                existingItem.quantity += guestItem.quantity;
            } else {
                userCart.items.push(guestItem);
            }
        });

        await userCart.save();
        await Cart.deleteOne({ sessionId });
        await userCart.populate('items.product');

        res.json({
            message: 'Sepetler birleştirildi',
            cart: userCart
        });

    } catch (error) {
        console.error('Sepet birleştirme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
    mergeCarts
};