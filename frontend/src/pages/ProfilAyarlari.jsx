import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserEdit, FaKey } from 'react-icons/fa';
import { MdDriveFileRenameOutline } from 'react-icons/md';

const ProfilAyarlari = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState({
        ad: '',
        soyad: '',
        email: '',
        number: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const userId = localStorage.getItem('userId');

                if (!token || !userId) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`http://localhost:5000/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log('API Response:', response.data);

                const userData = response.data.user || response.data;
                
                setUser({
                    ad: userData.ad || '',
                    soyad: userData.soyad || '',
                    email: userData.email || '',
                    number: userData.number || '',
                });

                setLoading(false);
            } catch (error) {
                console.error('Kullanıcı bilgileri yüklenirken hata:', error);
                console.log('Error details:', error.response);
                toast.error('Kullanıcı bilgileri yüklenemedi');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!user.ad?.trim()) {
            toast.error('Ad alanı boş bırakılamaz');
            return false;
        }
        if (!user.soyad?.trim()) {
            toast.error('Soyad alanı boş bırakılamaz');
            return false;
        }
        if (!user.email?.trim()) {
            toast.error('E-posta alanı boş bırakılamaz');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(user.email)) {
            toast.error('Geçerli bir e-posta adresi giriniz');
            return false;
        }
        if (!user.number?.trim()) {
            toast.error('Telefon alanı boş bırakılamaz');
            return false;
        }
        return true;
    };

    const validatePasswordForm = () => {
        if (!passwordData.currentPassword) {
            toast.error('Mevcut şifrenizi giriniz');
            return false;
        }
        if (!passwordData.newPassword) {
            toast.error('Yeni şifrenizi giriniz');
            return false;
        }
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            toast.error('Yeni şifreler eşleşmiyor');
            return false;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error('Yeni şifre en az 6 karakter olmalıdır');
            return false;
        }
        return true;
    };

    const handleCancel = () => {
        setIsEditing(false);
        setIsChangingPassword(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setSaving(true);
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');

            const updatedData = {
                ad: user.ad,
                soyad: user.soyad,
                email: user.email,
                number: user.number
            };

            const response = await axios.patch(`http://localhost:5000/user/${userId}`, updatedData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const updatedUser = response.data.user || response.data;
            setUser(prevUser => ({
                ...prevUser,
                ...updatedUser
            }));

            toast.success('Profil başarıyla güncellendi');
            setIsEditing(false);
        } catch (error) {
            console.error('Profil güncellenirken hata:', error);
            toast.error(error.response?.data?.message || 'Profil güncellenirken bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!validatePasswordForm()) return;

        try {
            setSaving(true);
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');

            await axios.post(`http://localhost:5000/user/${userId}/change-password`, passwordData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            toast.success('Şifre başarıyla güncellendi');
            setIsChangingPassword(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
        } catch (error) {
            console.error('Şifre güncellenirken hata:', error);
            toast.error(error.response?.data?.message || 'Şifre güncellenirken bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className='flex flex-col min-h-screen'>
                <Header />
                <div className="flex-grow container mx-auto px-4 py-8 mt-20">
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <div className="flex-grow container mx-auto px-4 py-8 mt-20">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 mb-8 border-b pb-4">
                        <FaUser className="text-3xl text-black" />
                        <h1 className="text-2xl font-bold montserrat">Profil Ayarları</h1>
                    </div>

                    {/* Profil Bilgileri Formu */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center mb-3 gap-2">
                                    <FaUserEdit className="text-xl text-black" />
                                    <h2 className="text-xl font-semibold">Kişisel Bilgiler</h2>
                                </div>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 text-black hover:text-emerald-700"
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    <FaUserEdit className="text-lg" />
                                    {isEditing ? 'Vazgeç' : 'Düzenle'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                        <MdDriveFileRenameOutline className="text-lg text-black" />
                                        Ad
                                    </label>
                                    <div className="relative">
                                        <MdDriveFileRenameOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="ad"
                                            value={user.ad}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 pl-10 border rounded-md disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                        <MdDriveFileRenameOutline className="text-lg text-black" />
                                        Soyad
                                    </label>
                                    <div className="relative">
                                        <MdDriveFileRenameOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="soyad"
                                            value={user.soyad}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 pl-10 border rounded-md disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                        <FaEnvelope className="text-lg text-black" />
                                        E-posta
                                    </label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={user.email}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 pl-10 border rounded-md disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                        <FaPhone className="text-lg text-black" />
                                        Telefon
                                    </label>
                                    <div className="relative">
                                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="number"
                                            value={user.number}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 pl-10 border rounded-md disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="mt-6 flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                                        disabled={saving}
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:bg-emerald-300"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Kaydediliyor...
                                            </div>
                                        ) : (
                                            <>
                                                <FaUserEdit />
                                                Kaydet
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Şifre Değiştirme Bölümü */}
                    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <FaLock className="text-xl text-black" />
                                <h2 className="text-lg font-semibold">Şifre Değiştir</h2>
                            </div>
                            <button
                                type="button"
                                className="flex items-center gap-2 text-black hover:text-emerald-700"
                                onClick={() => setIsChangingPassword(!isChangingPassword)}
                            >
                                <FaKey className="text-lg" />
                                {isChangingPassword ? 'Vazgeç' : 'Şifre Değiştir'}
                            </button>
                        </div>

                        {isChangingPassword && (
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div className="relative">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                        <FaLock className="text-lg text-black" />
                                        Mevcut Şifre
                                    </label>
                                    <div className="relative">
                                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-3 py-2 pl-10 border rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                        <FaKey className="text-lg text-black" />
                                        Yeni Şifre
                                    </label>
                                    <div className="relative">
                                        <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-3 py-2 pl-10 border rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                        <FaKey className="text-lg text-black" />
                                        Yeni Şifre Tekrar
                                    </label>
                                    <div className="relative">
                                        <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            name="confirmNewPassword"
                                            value={passwordData.confirmNewPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-3 py-2 pl-10 border rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                                        disabled={saving}
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:bg-emerald-300"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <div className="flex items-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Kaydediliyor...
                                            </div>
                                        ) : (
                                            <>
                                                <FaKey />
                                                Şifreyi Güncelle
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilAyarlari;