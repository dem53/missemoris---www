import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserUpdateModal = ({ isOpen, onClose, id, userData }) => {
    
    const [formData, setFormData] = useState({
        ad: '',
        soyad: '',
        email: '',
        password: '',
        number: '',
        isAdmin: false,
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                ad: userData.ad,
                soyad: userData.soyad,
                email: userData.email,
                number: userData.number,
                isAdmin: userData.isAdmin,
                password: '',
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.patch(`http://localhost:5000/user/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Kullanıcı başarıyla güncellendi');
            onClose();
        } catch (err) {
            console.error(err);
            alert('Kullanıcı güncellenirken bir hata oluştu: ' + (err.response ? err.response.data.message : err.message));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-white p-8 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out min-w-96">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Kullanıcı Güncelle</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Ad</label>
                        <input
                            type="text"
                            name="ad"
                            value={formData.ad}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Soyad</label>
                        <input
                            type="text"
                            name="soyad"
                            value={formData.soyad}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Şifre</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Telefon</label>
                        <input
                            type="text"
                            name="number"
                            value={formData.number}
                            onChange={handleChange}
                            maxLength={11}
                            required
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4 flex gap-2 items-center">
                        <label className="text-sm block font-medium text-gray-700">Admin</label>
                        <input
                            type="checkbox"
                            name="isAdmin"
                            checked={formData.isAdmin}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                    <button type="submit" className="bg-emerald-500 text-white p-2 rounded-md hover:bg-emerald-600 transition duration-200">Güncelle</button>
                        <button type="button" onClick={onClose} className="mr-2 bg-gray-300 p-2 rounded-md hover:bg-gray-400 transition duration-200">İptal</button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserUpdateModal;