const Post = require('../models/post.js');
const Order = require('../models/order.js');
const Product = require('../models/post.js');

// Ürün listeleme (public)
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json({
            success: true,
            posts: posts,
        });
    } catch (error) {
        console.error('Get Posts Error:', error);
        res.status(500).json({
            success: false,
            message: 'Ürünler getirilirken bir hata oluştu.'
        });
    }
};

// Ürün detay (public)
const getDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Ürün bulunamadı"
            });
        }

        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        console.error('Get Detail Error:', error);
        res.status(500).json({
            success: false,
            message: "Ürün detayı alınırken hata oluştu",
            error: error.message
        });
    }
};

// Ürün oluşturma (admin only)
const createPosts = async (req, res) => {
    try {
        const { name, description, price, stock, category, tags, brand, color, size } = req.body;

        // Zorunlu alanları kontrol et
        if (!name || !description || !price || !stock || !category || !brand || !color || !size) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen tüm zorunlu alanları doldurun.'
            });
        }

        // Dosya kontrolü
        if (!req.files || req.files.length === 0) { 
            return res.status(400).json({
                success: false,
                message: 'Ürün görseli zorunludur.'
            });
        }

        // Yüklenen dosyaların yollarını al
        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

        // Tags kontrolü
        const parsedTags = parseTags(tags);
        
        // Size kontrolü
        const parsedSizes = parseSizes(size);

        const newPost = await Post.create({
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            category,
            imageUrls,
            tags: parsedTags,
            size: parsedSizes,
            brand,
            color,
            createdBy: req.user._id 
        });

        res.status(201).json({
            success: true,
            message: 'Ürün başarıyla oluşturuldu!',
            post: newPost
        });

    } catch (error) {
        console.error('Create Post Error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz veri formatı.',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Ürün oluşturulurken bir hata oluştu.',
            error: error.message
        });
    }
};

// Ürün güncelleme (admin only)
const getUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        // Eğer yeni bir dosya yüklendiyse
        if (req.files && req.files.length > 0) {
            updates.imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        }

        // Tags ve Size güncellemeleri varsa ve string olarak geldiyse parse et
        if (updates.tags && typeof updates.tags === 'string') {
            try {
                updates.tags = JSON.parse(updates.tags);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Tags alanı geçerli bir JSON formatında değil."
                });
            }
        }

        if (updates.size && typeof updates.size === 'string') {
            try {
                updates.size = JSON.parse(updates.size);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Size alanı geçerli bir JSON formatında değil."
                });
            }
        }

        // Sayısal değerleri dönüştür
        if (updates.price) updates.price = Number(updates.price);
        if (updates.stock) updates.stock = Number(updates.stock);

        // Geçerli tag kontrolü
        if (updates.tags && Array.isArray(updates.tags)) {
            const validTags = ['Yeni', 'Tercih Edilen', 'İndirimli', 'Sinirli Stok', 'Kampanya'];
            updates.tags = updates.tags.filter(tag => validTags.includes(tag));
        } else if (updates.tags) {
            return res.status(400).json({
                success: false,
                message: "Tags alanı bir dizi olmalıdır."
            });
        }

        // Güncelleme işlemi
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: "Güncellenecek ürün bulunamadı"
            });
        }

        res.status(200).json({
            success: true,
            message: "Ürün başarıyla güncellendi",
            post: updatedPost
        });
    } catch (error) {
        console.error('Update Post Error:', error);
        res.status(500).json({
            success: false,
            message: "Ürün güncellenirken hata oluştu",
            error: error.message
        });
    }
};


// Ürün silme (admin only)
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({
                success: false,
                message: "Silinecek ürün bulunamadı"
            });
        }

        res.status(200).json({
            success: true,
            message: "Ürün başarıyla silindi",
            post: deletedPost
        });
    } catch (error) {
        console.error('Delete Post Error:', error);
        res.status(500).json({
            success: false,
            message: "Ürün silinirken hata oluştu",
            error: error.message
        });
    }
};

// Helper functions
const parseTags = (tags) => {
    let parsedTags = [];
    if (tags) {
        try {
            parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
            const validTags = ['Yeni', 'Popüler', 'İndirimli', 'Sınırlı Stok', 'Kampanya'];
            parsedTags = parsedTags.filter(tag => validTags.includes(tag));
        } catch (error) {
            console.error('Tags parse error:', error);
            parsedTags = [];
        }
    }
    return parsedTags;
};

const parseSizes = (size) => {
    let parsedSizes = [];
    if (size) {
        try {
            parsedSizes = typeof size === 'string' ? JSON.parse(size) : size;
        } catch (error) {
            console.error('Size parse error:', error);
            parsedSizes = [];
        }
    }
    return parsedSizes;
};


// Siparişi onayla ve stok güncelle
const approvePost = async (req, res) => {

    const { id } = req.params;

    try {
        // Siparişi bul
        const order = await Order.findById(id).populate('items.product');
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Sipariş bulunamadı.'
            });
        }

        order.status = 'success';
        await order.save();

        // Stok güncelleme
        for (const item of order.items) {
            const product = await Product.findById(item.product._id);
            if (product) {
                product.stock -= item.quantity;
                if (product.stock < 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Yetersiz stok.'
                    });
                }
                await product.save();
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Ürün bulunamadı.'
                });
            }
        }

        res.status(200).json({
            success: true,
            message: 'Sipariş başarıyla onaylandı ve stok güncellendi.',
            order
        });
    } catch (error) {
        console.error('Onaylama hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Bir hata oluştu.',
            error: error.message
        });
    }
};

module.exports = {
    getPosts,
    createPosts,
    getDetail,
    getUpdate,
    deletePost,
    approvePost
};