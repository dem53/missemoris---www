const Auth = require('../models/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {

    try {
        const { ad, soyad, email, password, number } = req.body;

        if (!ad || !soyad || !email || !password || !number) {
            return res.status(400).json({
                success: false,
                message: "Tüm alanlar gereklidir!"
            });
        }

        const userExists = await Auth.findOne({
            $or: [{ email }, { number }]
        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: userExists.email === email ?
                    "Bu email zaten kayıtlı!" :
                    "Bu telefon numarası zaten kayıtlı!"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Parolanız 8 karakterden düşük olamaz!"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = await Auth.create({
            ad,
            soyad,
            email,
            password: passwordHash,
            number,
            isAdmin: false
        });

        const token = jwt.sign(
            {
                id: newUser._id,
                isAdmin: newUser.isAdmin
            },
            process.env.SECRET_TOKEN,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            success: true,
            user: {
                id: newUser._id,
                ad: newUser.ad,
                soyad: newUser.soyad,
                email: newUser.email,
                number: newUser.number,
                isAdmin: newUser.isAdmin
            },
            token
        });

        console.log("Yeni kayıt olan kullanıcı", newUser);

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({
            success: false,
            message: "Kayıt işlemi başarısız oldu."
        });
    }
};



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Böyle bir kullanıcı bulunamadı!"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Parolanız yanlış!"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.SECRET_TOKEN,
            { expiresIn: '1d' }
        );

        console.log("Giriş yapan kullanıcı", user);
        console.log("Giriş yapan kullanıcı UUID", user._id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                ad: user.ad,
                soyad: user.soyad,
                email: user.email,
                number: user.number,
                isAdmin: user.isAdmin
            },
            token
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            message: "Giriş işlemi başarısız oldu."
        });
    }
};



// Admin: Tüm kullanıcıları getir
const getUsers = async (req, res) => {
    try {
        // Admin kontrolü middleware'de yapılıyor
        const users = await Auth.find().select('-password');

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({
            success: false,
            message: "Kullanıcılar getirilirken hata oluştu."
        });
    }
};



// Kullanıcı detaylarını getir
const getUserById = async (req, res) => {
    try {
        const user = await Auth.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı!"
            });
        }

        // Kullanıcı kendi bilgilerini veya admin tüm bilgileri görebilir
        if (req.user.id !== user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Bu bilgilere erişim yetkiniz yok!"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({
            success: false,
            message: "Kullanıcı bilgileri getirilirken hata oluştu."
        });
    }
};



// Admin: Yeni kullanıcı ekle
const addUser = async (req, res) => {
    try {

        const { ad, soyad, email, password, number, isAdmin } = req.body;

        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = await Auth.create({
            ad,
            soyad,
            email,
            password: passwordHash,
            number,
            isAdmin: isAdmin || false
        });

        res.status(201).json({
            success: true,
            message: "Yeni kullanıcı başarıyla eklendi.",
            user: {
                id: newUser._id,
                ad: newUser.ad,
                soyad: newUser.soyad,
                email: newUser.email,
                number: newUser.number,
                isAdmin: newUser.isAdmin
            }
        });
    } catch (error) {
        console.error("Add User Error:", error);
        res.status(500).json({
            success: false,
            message: "Kullanıcı eklenirken hata oluştu."
        });
    }
};



// Kullanıcı bilgilerini güncelle
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { ad, soyad, email, number, password } = req.body;

        // Kullanıcıyı ID ile bul
        const user = await Auth.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı!"
            });
        }

        // Kullanıcı kendi bilgilerini ya da admin tüm bilgileri güncelleyebilir
        if (req.user.id !== user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Bu bilgilere erişim yetkiniz yok!"
            });
        }

        // Eğer şifre varsa, hashle ve güncelle
        let passwordHash = user.password;
        if (password) {
            passwordHash = await bcrypt.hash(password, 12);
        }

        // Güncelleme işlemini yap
        user.ad = ad || user.ad;
        user.soyad = soyad || user.soyad;
        user.email = email || user.email;
        user.number = number || user.number;
        user.password = passwordHash;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Kullanıcı bilgileri başarıyla güncellendi.",
            user: {
                id: user._id,
                ad: user.ad,
                soyad: user.soyad,
                email: user.email,
                number: user.number,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({
            success: false,
            message: "Kullanıcı bilgileri güncellenirken hata oluştu."
        });
    }
};

// Kullanıcıyı sil

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await Auth.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).send({
                message: 'Kullanıcı Bulunamadı.'
            });
        }
        res.send({
            message: 'Kullanıcı Başarıyla Silindi.'
        });
    } catch (error) {
        console.error('Delete User Error', error);
        res.status(500).send({
            message: 'Kullanıcı silinirken bir hata oluştu'
        });
    }
}

module.exports = {
    register,
    login,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    addUser
};



