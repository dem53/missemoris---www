const express = require('express');
const multer = require('multer');
const path = require('path');
const { 
    getPosts, 
    createPosts, 
    getDetail, 
    getUpdate, 
    deletePost,
    approvePost
} = require('../controllers/post.js');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Multer konfigürasyonu
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

// Route tanımlamaları
/**
 * @swagger
 * /getPosts:
 *   get:
 *     summary: Tüm gönderileri getirir
 *     responses:
 *       200:
 *         description: Başarılı, tüm gönderiler döndürülür.
 *       500:
 *         description: Sunucu hatası
 */
router.get('/getPosts', getPosts);

/**
 * @swagger
 * /getDetail/{id}:
 *   get:
 *     summary: Tek bir gönderi detayını getirir
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Gönderi ID'si
 *     responses:
 *       200:
 *         description: Başarılı, gönderi detayları döndürülür.
 *       404:
 *         description: Gönderi bulunamadı
 */
router.get('/getDetail/:id', getDetail);

/**
 * @swagger
 * /createPost:
 *   post:
 *     summary: Yeni gönderi oluşturur
 *     description: Yöneticiler yeni gönderi oluşturabilir. Gönderi resimleri de eklenebilir.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Başarılı, gönderi oluşturuldu.
 *       400:
 *         description: Geçersiz giriş verisi.
 *       401:
 *         description: Yetkisiz erişim (admin olmanız gerekir).
 */
router.post('/createPost', authenticateToken, isAdmin, upload.array('images'), createPosts); 

/**
 * @swagger
 * /getUpdate/{id}:
 *   patch:
 *     summary: Var olan gönderiyi günceller
 *     description: Yöneticiler var olan gönderiyi güncelleyebilir.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Güncellenmek istenen gönderinin ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Başarılı, gönderi güncellendi.
 *       400:
 *         description: Geçersiz giriş verisi.
 *       404:
 *         description: Gönderi bulunamadı.
 */
router.patch('/getUpdate/:id', authenticateToken, isAdmin, upload.array('images'), getUpdate); 

/**
 * @swagger
 * /deletePost/{id}:
 *   delete:
 *     summary: Bir gönderiyi siler
 *     description: Yöneticiler gönderiyi silebilir.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Silinecek gönderinin ID'si
 *     responses:
 *       200:
 *         description: Başarılı, gönderi silindi.
 *       404:
 *         description: Gönderi bulunamadı
 */
router.delete('/deletePost/:id', authenticateToken, isAdmin, deletePost);

router.patch('/api/orders/:id/approve', authenticateToken, isAdmin, approvePost);

module.exports = router;
