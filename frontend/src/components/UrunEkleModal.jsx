import React, { useState } from 'react';
import axios from 'axios';

const UrunEkleModal = ({ isOpen, onClose, onAdd }) => {
    const [newPost, setNewPost] = useState({
        name: '',
        description: '',
        stock: '',
        imageUrls: [], 
        category: '',
        tags: [], 
        size: [], 
        price: '',
        brand: '',
        color: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPost(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setNewPost(prev => ({ ...prev, imageUrls: files })); 
        }
    };

    const handleTagChange = (e) => {
        const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
        setNewPost(prev => ({ ...prev, tags: selectedTags }));
    };

    const handleSizeChange = (e) => {
        const selectedSizes = Array.from(e.target.selectedOptions, option => option.value);
        setNewPost(prev => ({ ...prev, size: selectedSizes }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (newPost.imageUrls.length === 0) {
            alert('Lütfen bir resim seçin!');
            return;
        }
    
        const { name, description, price, stock, category, brand, color, size, tags } = newPost;
        if (!name || !description || !price || !stock || !category || !brand || !color || tags.length === 0 || size.length === 0) {
            alert('Lütfen tüm zorunlu alanları doldurun.');
            return;
        }
    
        console.log(newPost);
    
        try {
            const token = localStorage.getItem('authToken');
            const formData = new FormData();
    
            // Form verilerini ekle
            for (const key in newPost) {
                if (key === 'imageUrls') {
                    newPost.imageUrls.forEach((file) => {
                        formData.append('images', file);
                    });
                } else {
                    // Düzeltme: newPost[key] kullanarak erişim sağlanıyor
                    formData.append(key, Array.isArray(newPost[key]) ? JSON.stringify(newPost[key]) : newPost[key]);
                }
            }
    
            const response = await axios.post('http://localhost:5000/createPost', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (response.data.success) {
                onAdd(response.data.post);
                alert('Ürün başarıyla eklendi!');
                window.location.reload();
            } else {
                alert('Ekleme sırasında bir hata oluştu.');
            }
        } catch (error) {
            console.error('Ekleme hatası:', error.response?.data);
            alert('Ekleme sırasında bir hata oluştu: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
        }
    
        onClose();
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-11/12 md:w-2/3 lg:w-1/3">
                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label className="block text-xs font-medium mb-1">Ürün Adı *</label>
                        <input
                            type="text"
                            name="name"
                            value={newPost.name}
                            onChange={handleChange}
                            className="w-full p-1 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-medium mb-1">Marka *</label>
                        <input
                            type="text"
                            name="brand"
                            value={newPost.brand}
                            onChange={handleChange}
                            className="w-full p-1 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-medium mb-1">Açıklama *</label>
                        <textarea
                            name="description"
                            value={newPost.description}
                            onChange={handleChange}
                            className="w-full p-1 border rounded"
                            required
                        />
                    </div>

                    <div className='flex justify-center gap-6 items-start'>
                        <div className="mb-4 w-full">
                            <label className="block text-xs font-medium mb-1">Fiyat (TL) *</label>
                            <input
                                type="number"
                                name="price"
                                value={newPost.price}
                                onChange={handleChange}
                                className="w-full p-1 border rounded"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="mb-4 w-full">
                            <label className="block text-xs font-medium mb-1">Stok *</label>
                            <input
                                type="number"
                                name="stock"
                                value={newPost.stock}
                                onChange={handleChange}
                                className="w-full p-1 border rounded"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className='flex justify-center gap-6 items-start'>
                        <div className="mb-4 w-full">
                            <label className="block text-xs font-medium mb-1">Kategori *</label>
                            <select
                                name="category"
                                value={newPost.category}
                                onChange={handleChange}
                                className="w-full p-1 border rounded"
                                required
                            >
                                <option value="">Seçiniz</option>
                                <option value="Giyim">Giyim</option>
                                <option value="Ayakkabı">Ayakkabı</option>
                                <option value="Çanta">Çanta</option>
                                <option value="Aksesuar">Aksesuar</option>
                            </select>
                        </div>
                        <div className="mb-4 w-full">
                            <label className="block text-xs font-medium mb-1">Beden *</label>
                            <select
                                name="size"
                                value={newPost.size}
                                onChange={handleSizeChange}
                                className="w-full p-1 text-xs rounded"
                                multiple
                                required
                            >
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-medium mb-1">Etiket *</label>
                        <select
                            name="tags"
                            value={newPost.tags}
                            onChange={handleTagChange}
                            className="w-full p-1 border rounded"
                            required
                        >
                            <option value="">Seçiniz</option>
                            <option value="Yeni">Yeni</option>
                            <option value="Tercih Edilen">Tercih Edilen</option>
                            <option value="İndirimli">İndirimli</option>
                            <option value="Sinirli Stok">Sınırlı Stok</option>
                            <option value="Kampanya">Kampanya</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-medium mb-1">Renk *</label>
                        <input
                            type="text"
                            name="color"
                            value={newPost.color}
                            onChange={handleChange}
                            className="w-full p-1 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-medium mb-1">Ürün Görseli *</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full p-1 border rounded"
                            accept="image/*"
                            multiple
                            required
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 duration-300 ease-in-out transition-all text-xs text-white px-4 py-2 rounded">Ekle</button>
                        <button type="button" onClick={onClose} className="mr-2 bg-red-500 hover:bg-red-600 duration-300 text-white text-xs ease-in-out transition-all px-4 py-2 rounded">İptal</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UrunEkleModal;