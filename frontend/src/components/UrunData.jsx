import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import UrunEkleModal from './UrunEkleModal';
import UrunUpdateModal from './UrunUpdateModal';
import ConfirmBox from './ConfirmBox';

const UrunData = () => {
    
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [products, setProducts] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEkleModalOpen, setIsEkleModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(5); 
    const [filter, setFilter] = useState({ name: '', brand: '', category: '', minPrice: '', maxPrice: '', size: '', stock: '' });

    useEffect(() => {
        const checkAdminAndFetchPosts = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const decoded = jwtDecode(token);
                if (!decoded.isAdmin) {
                    navigate('/');
                    return;
                }
                setIsAdmin(true);
                const response = await axios.get('http://localhost:5000/getPosts', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setPosts(response.data.getPost);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setError(error.response?.data?.message || 'Bir hata oluştu');
                setLoading(false);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        checkAdminAndFetchPosts();
    }, [navigate]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getPosts');
                console.log('API Response:', response.data);

                const productsData = response.data?.posts || [];
                if (Array.isArray(productsData)) {
                    setProducts(productsData);
                } else {
                    console.error('API yanıtı dizi değil:', productsData);
                    setError('Veri formatı uygun değil');
                }
                setLoading(false);
            } catch (err) {
                console.error('Hata detayı:', err);
                setError(err.response?.data?.message || 'Ürünler yüklenirken bir hata oluştu');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleUpdate = async (updatedProduct) => {
        console.log('Güncellenen Ürün:', updatedProduct);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
                navigate('/login');
                return;
            }

            const formData = new FormData();
            for (const key in updatedProduct) {
                if (key === 'imageUrls' && updatedProduct.imageUrls) {
                    updatedProduct.imageUrls.forEach((file) => {
                        formData.append('images', file);
                    });
                } else if (key === 'tags') {
                    formData.append('tags', JSON.stringify(updatedProduct.tags || []));
                } else if (key === 'size') {
                    formData.append('size', JSON.stringify(updatedProduct.size || []));
                } else {
                    formData.append(key, updatedProduct[key].toString());
                }
            }

            const response = await axios.patch(`http://localhost:5000/getUpdate/${updatedProduct._id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post._id === updatedProduct._id ? response.data.post : post
                    )
                );
                alert('Ürün başarıyla güncellendi!');
            } else {
                alert('Güncelleme sırasında bir hata oluştu.');
            }
        } catch (error) {
            console.error('Güncelleme hatası:', error);
            alert(error.response?.data?.message || 'Ürün güncellenirken bir hata oluştu!');
        }
    };

    const handleDelete = (productId) => {
        setProductToDelete(productId);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (productToDelete) {
            try {
                const token = localStorage.getItem('authToken');
                await axios.delete(`http://localhost:5000/deletePost/${productToDelete}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setProducts(products.filter(product => product._id !== productToDelete));
                alert('Ürün başarıyla silindi');
            } catch (error) {
                console.error('Silme hatası:', error);
                alert('Ürün silinirken bir hata oluştu');
            } finally {
                setIsConfirmOpen(false);
                setProductToDelete(null);
            }
        }
    };

    const handleAddProduct = (newProduct) => {
        setPosts(prevPosts => {
            if (Array.isArray(prevPosts)) {
                return [...prevPosts, newProduct];
            } else {
                console.error('prevPosts bir dizi değil:', prevPosts);
                return [newProduct];
            }
        });
    };

    const formatTurkishLira = (price) => {
        return price.toLocaleString('tr-TR', {
            style: 'decimal',
            currency: 'TRY'
        });
    };

    // Filter products based on the filter state
    const filteredProducts = products.filter(product => {
        const matchesName = product.name.toLowerCase().includes(filter.name.toLowerCase());
        const matchesBrand = product.brand.toLowerCase().includes(filter.brand.toLowerCase());
        const matchesCategory = filter.category ? product.category.toLowerCase() === filter.category.toLowerCase() : true;
        const matchesMinPrice = filter.minPrice ? product.price >= parseFloat(filter.minPrice) : true;
        const matchesMaxPrice = filter.maxPrice ? product.price <= parseFloat(filter.maxPrice) : true;
        const matchesSize = filter.size ? product.size.toLowerCase() === filter.size.toLowerCase() : true;
        const matchesStock = filter.stock ? (filter.stock === 'inStock' ? product.stock > 0 : product.stock === 0) : true;

        return matchesName && matchesBrand && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesSize && matchesStock;
    });

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleProductsPerPageChange = (e) => {
        setProductsPerPage(Number(e.target.value));
        setCurrentPage(1); 
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
    if (!isAdmin) return <div className="text-center p-4">Bu sayfaya erişim yetkiniz yok!</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-start gap-4 flex-col mt-20 mb-6">
                <div className='flex flex-row items-center montserrat gap-2'>
                    <div className='text-gray-400'>
                        <Link to='/'>
                            Anasayfa
                        </Link>
                    </div>
                    <div>
                        <h1 className='text-gray-400'>/</h1>
                    </div>
                    <div className='py-4'>
                        <h1 className='text-lg font-semibold text-gray-800'>Ürün Yönetimi</h1>
                    </div>
                </div>
                <div className='border w-full border-gray-300 '></div>
                <button
                    onClick={() => setIsEkleModalOpen(true)} // Ekle modalını aç
                    className="bg-green-500 text-white px-4 py-2 text-sm rounded my-3 hover:bg-green-600 flex items-center"
                >
                    Yeni Ürün Ekle
                </button>
            </div>

            {/* Filtreleme */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Ürün Adı"
                    value={filter.name}
                    onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                    className="border rounded p-2 mr-2"
                />
                <input
                    type="text"
                    placeholder="Marka"
                    value={filter.brand}
                    onChange={(e) => setFilter({ ...filter, brand: e.target.value })}
                    className="border rounded p-2 mr-2"
                />
                <input
                    type="number"
                    placeholder="Min Fiyat"
                    value={filter.minPrice}
                    onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })}
                    className="border rounded p-2 mr-2"
                />
                <input
                    type="number"
                    placeholder="Max Fiyat"
                    value={filter.maxPrice}
                    onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
                    className="border rounded p-2 mr-2"
                />
                <select
                    value={filter.size}
                    onChange={(e) => setFilter({ ...filter, size: e.target.value })}
                    className="border rounded p-2 mr-2"
                >
                    <option value="">Beden Seçin</option>
                    {/* Beden seçeneklerini buraya ekleyin */}
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                </select>
                <select
                    value={filter.stock}
                    onChange={(e) => setFilter({ ...filter, stock: e.target.value })}
                    className="border rounded p-2"
                >
                    <option value="">Stok Durumu</option>
                    <option value="inStock">Stokta</option>
                    <option value="outOfStock">Tükendi</option>
                </select>
            </div>

            {/* Ürün Yönetim Tablosu */}
            <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
                <h2 className="text-2xl font-bold mb-6">Mevcut Ürünler</h2>
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Görsel</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün Adı</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beden</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etiket</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentProducts.length > 0 ? (currentProducts.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50 border p-5 cursor-pointer">
                                <td className="px-4 py-2 whitespace-nowrap cursor-pointer">
                                    <img
                                        src={`http://localhost:5000${product.imageUrls[0]}`}
                                        alt={product.name}
                                        className={`w-20 h-20 object-cover rounded-lg`}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder.jpg';
                                        }}
                                    />
                                </td>

                                <td className="px-4 py-2 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                    <div className="text-sm text-gray-500">{product.brand}</div>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {product.category}
                                    </span>
                                </td>

                                <td className="px-4 py-2 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {product.size}
                                    </span>
                                </td>

                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                    {product.tags}
                                </td>

                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                    {product.stock} Adet
                                </td>

                                <td className="px-4 py-2 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{formatTurkishLira(product.price)} ₺</div>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 0
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {product.stock > 0 ? 'Stokta' : 'Tükendi'}
                                    </span>
                                </td>
                                <td className="px-4 flex gap-2 items-center mt-6 justify-start py-2 text-sm font-medium ">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="bg-blue-500 text-white px-3 text-xs py-2 rounded hover:bg-blue-600 transition-colors inline-flex items-center"
                                    >
                                        Güncelle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded text-xs hover:bg-red-600 transition-colors inline-flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))) : (
                            <tr>
                                <td colSpan="8" className="text-center montserrat text-black py-7">Listelenecek ürün bulunamadı.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <div>
                    <label className="mr-2">Sayfa başına ürün sayısı:</label>
                    <select value={productsPerPage} onChange={handleProductsPerPageChange} className="border rounded p-2">
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <div className="flex">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ürün Ekleme Modalı */}
            <UrunEkleModal
                isOpen={isEkleModalOpen}
                onClose={() => setIsEkleModalOpen(false)}
                onAdd={handleAddProduct}
            />

            {/* Güncelleme */}
            {isModalOpen && (
                <UrunUpdateModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    product={selectedProduct}
                    onUpdate={handleUpdate}
                />
            )}

            <ConfirmBox
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                message="Bu ürünü silmek istediğinizden emin misiniz?"
            />
        </div>
    );
};

export default UrunData;