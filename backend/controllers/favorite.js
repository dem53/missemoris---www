const Favorite = require('../models/favorite');
const Product = require('../models/post');

const favoriteController = {
  
    getFavorites: async (req, res) => {
        try {
            const favorites = await Favorite.find({ user: req.user.id })
                .populate('product')
                .sort('-createdAt');

            res.json({
                success: true,
                data: favorites
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Favoriler getirilirken bir hata oluştu'
            });
        }
    },


    addToFavorites: async (req, res) => {
        try {
            const { productId } = req.body;

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Ürün bulunamadı'
                });
            }

            const existingFavorite = await Favorite.findOne({
                user: req.user.id,
                product: productId
            });

            if (existingFavorite) {
                return res.status(400).json({
                    success: false,
                    message: 'Bu ürün zaten favorilerinizde'
                });
            }

            const favorite = new Favorite({
                user: req.user.id,
                product: productId
            });

            await favorite.save();

            res.status(201).json({
                success: true,
                message: 'Ürün favorilere eklendi',
                data: favorite
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Favorilere eklenirken bir hata oluştu'
            });
        }
    },

    // Favorilerden kaldır
    removeFromFavorites: async (req, res) => {
        try {
            const { productId } = req.params;

            const favorite = await Favorite.findOneAndDelete({
                user: req.user.id,
                product: productId
            });

            if (!favorite) {
                return res.status(404).json({
                    success: false,
                    message: 'Favori bulunamadı'
                });
            }

            res.json({
                success: true,
                message: 'Ürün favorilerden kaldırıldı'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Favorilerden kaldırılırken bir hata oluştu'
            });
        }
    },

    // Favori durumunu kontrol et
    checkFavoriteStatus: async (req, res) => {
        try {
            const { productId } = req.params;

            const favorite = await Favorite.findOne({
                user: req.user.id,
                product: productId
            });

            res.json({
                success: true,
                isFavorite: !!favorite
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Favori durumu kontrol edilirken bir hata oluştu'
            });
        }
    }
};

module.exports = favoriteController;