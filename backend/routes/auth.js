const express = require('express');
const {
    register,
    login,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    addUser
} = require('../controllers/auth');

const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Kullanıcı kaydı yapar
 *     description: Yeni bir kullanıcı kaydeder.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Kullanıcı adı
 *               password:
 *                 type: string
 *                 description: Şifre
 *     responses:
 *       201:
 *         description: Başarılı kayıt
 *       400:
 *         description: Geçersiz giriş
 */
router.post('/register', register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Kullanıcı giriş yapar
 *     description: Kullanıcı adı ve şifre ile giriş yapar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email Adresi
 *               password:
 *                 type: string
 *                 description: Şifre
 *     responses:
 *       200:
 *         description: Başarılı giriş
 *       400:
 *         description: Geçersiz kullanıcı adı veya şifre
 */
router.post('/login', login);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Tüm kullanıcıları getirir
 *     description: Yönetici tarafından tüm kullanıcılar listelenir.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcılar başarıyla listelendi
 *       403:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */
router.get('/users', authenticateToken, isAdmin, getUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Kullanıcıyı ID ile getirir
 *     description: ID'sine göre tek bir kullanıcıyı getirir.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla getirildi
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.get('/user/:id', authenticateToken, getUserById);

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Kullanıcıyı günceller
 *     description: Kullanıcıyı belirtilen ID'ye göre günceller.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Yeni kullanıcı adı
 *               password:
 *                 type: string
 *                 description: Yeni şifre
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla güncellendi
 *       400:
 *         description: Geçersiz veri
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.patch('/user/:id', authenticateToken, updateUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Kullanıcıyı siler
 *     description: Kullanıcıyı belirtilen ID ile siler.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla silindi
 *       404:
 *         description: Kullanıcı bulunamadı
 *       500:
 *         description: Sunucu hatası
 */
router.delete('/user/:id', authenticateToken, isAdmin, deleteUser);

/**
 * @swagger
 * /admin/user:
 *   post:
 *     summary: Yeni bir kullanıcı ekler (Yönetici)
 *     description: Yönetici yetkisine sahip kullanıcı yeni kullanıcı ekler.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *                 description: Yeni kullanıcının admin olup olmadığı
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz veri
 *       500:
 *         description: Sunucu hatası
 */
router.post('/admin/user', authenticateToken, isAdmin, addUser);

/**
 * @swagger
 * /check-admin:
 *   get:
 *     summary: Admin kontrolü yapar
 *     description: Kullanıcının admin olup olmadığını kontrol eder.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı admin
 *       403:
 *         description: Kullanıcı admin değil
 */
router.get('/check-admin', authenticateToken, (req, res) => {
    res.json({
        success: true,
        isAdmin: req.user.isAdmin
    });
});

module.exports = router;
