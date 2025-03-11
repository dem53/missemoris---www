import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IoFilterOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import Cart from './Cart';
import FavoriteButton from './FavorilerButton';

function UrunContent() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({ name: '', category: '', color: '', size: '', minPrice: '', maxPrice: '' });
    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef(null);

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [sessionId, setSessionId] = useState(null);

    const handleClick = () => {
        window.scrollTo(0, 0); 
      };

    useEffect(() => {
        fetchCart();
    }, [userId, sessionId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilters(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    useEffect(() => {
        const loggedInUser = localStorage.getItem('userId');
        const guestSessionId = localStorage.getItem('sessionId');

        if (loggedInUser) {
            setUserId(loggedInUser);
        } else if (guestSessionId) {
            setSessionId(guestSessionId);
        } else {
            const newSessionId = 'session_' + new Date().getTime();
            localStorage.setItem('sessionId', newSessionId);
            setSessionId(newSessionId);
        }
    }, []);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getPosts');
                const productsData = response.data?.posts || [];
                if (Array.isArray(productsData)) {
                    setProducts(productsData);
                } else {
                    setError('Veri formatı uygun değil');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Ürünler yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);


    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('authToken');
            let sessionId = localStorage.getItem('sessionId');

            if (!token && (!sessionId || sessionId.includes('undefined'))) {
                sessionId = 'session_' + Date.now();
                localStorage.setItem('sessionId', sessionId);
                setSessionId(sessionId);
            }

            const response = await axios.get('http://localhost:5000/api/cart', {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                params: {
                    sessionId: !token ? sessionId : undefined
                }
            });

            if (response.data) {
                setCartItems(response.data.items || []);
                localStorage.setItem('cartItems', JSON.stringify(response.data.items || []));
            }
        } catch (error) {
            console.error('Sepet yükleme hatası:', error);
        }
    };


    const handleAddToCart = async (product) => {
        try {
            const token = localStorage.getItem('authToken');
            let sessionId = localStorage.getItem('sessionId');

            if (!token && (!sessionId || sessionId.includes('undefined'))) {
                sessionId = 'session_' + Date.now();
                localStorage.setItem('sessionId', sessionId);
                setSessionId(sessionId);
            }

            const payload = token
                ? { productId: product._id, quantity: 1, userId }
                : { productId: product._id, quantity: 1, sessionId };

            await axios.post('http://localhost:5000/api/cart/add', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            });

            fetchCart();
            setIsCartOpen(true);

        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Ürün sepete eklenirken bir hata oluştu.');
        }
    };


    const handleRemoveFromCart = async (productId) => {
        try {
            const token = localStorage.getItem('authToken');
            const sessionId = localStorage.getItem('sessionId');

            if (!token && !sessionId) {
                throw new Error('Oturum bilgisi bulunamadı');
            }

            const payload = token ? { productId, userId } : { productId, sessionId };

            await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
                data: payload,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            });

            fetchCart();

        } catch (error) {
            console.error('Error removing from cart:', error);
            if (error.response?.status === 404) {
                alert('Sepet bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin.');
            } else {
                alert('Ürün sepetten çıkarılırken bir hata oluştu.');
            }
        }
    };


    const handleClearCart = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const sessionId = localStorage.getItem('sessionId');

            if (!token && !sessionId) {
                throw new Error('Oturum bilgisi bulunamadı');
            }

            const payload = token ? { userId } : { sessionId };

            await axios.delete('http://localhost:5000/api/cart/clear', {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                data: payload
            });

            fetchCart();

        } catch (error) {
            console.error('Error clearing cart:', error);
            alert('Sepet temizlenirken bir hata oluştu.');
        }
    };


    const formatTurkishLira = (price) => {
        return price.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        });
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-8 text-red-500">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }


    const categories = [...new Set(products.map(product => product.category).flat())];
    const colors = [...new Set(products.map(product => product.color).flat())];
    const sizes = [...new Set(products.flatMap(product => product.size))];

    const resetFilters = () => {
        setFilter({ name: '', category: '', color: '', size: '', minPrice: '', maxPrice: '' });
    };


    const filteredProducts = products.filter(product => {
        const matchesName = product.name.toLowerCase().includes(filter.name.toLowerCase());
        const matchesCategory = filter.category ? product.category.includes(filter.category) : true;
        const matchesColor = filter.color ? (typeof product.color === 'string' && product.color.toLowerCase() === filter.color.toLowerCase()) : true;
        const matchesSize = filter.size ? (product.size && product.size.includes(filter.size)) : true;
        const matchesMinPrice = filter.minPrice ? product.price >= parseFloat(filter.minPrice) : true;
        const matchesMaxPrice = filter.maxPrice ? product.price <= parseFloat(filter.maxPrice) : true;
        return matchesName && matchesCategory && matchesColor && matchesSize && matchesMinPrice && matchesMaxPrice;
    });

    return (
        <div className="container mx-auto px-4 py-8">

            <Cart
                userId={userId}
                sessionId={sessionId}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onClearCart={handleClearCart}
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
                fetchCart={fetchCart}
            />

            {isCartOpen &&
                (<div className='fixed inset-0 bg-black z-20 bg-opacity-50'></div>)
            }


            <div className=' flex flex-col border-b-2 mt-16 justify-between items-start'>
                <div className='flex flex-row items-center montserrat gap-2 mb-4'>
                    <div className='text-gray-400'>
                        <Link to='/'>
                            Anasayfa
                        </Link>
                    </div>
                    <div>
                        <h1 className='text-gray-400'>/</h1>
                    </div>
                    <div className='py-4'>
                        <h1 className='text-lg font-semibold text-gray-800'>Tüm Ürünler</h1>
                    </div>
                </div>
                <div className='flex flex-row items-center justify-center gap-2'>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="text-black font-mono px-2 text-xs py-1 rounded mb-4 border-2 border-black transition duration-300"
                    >
                        {showFilters ? 'Kapat' :
                            <div className='flex items-start montserrat tracking-wider justify-center gap-1'>
                                <IoFilterOutline size={15} className='text-black' />
                                Filtreleme
                            </div>}
                    </button>
                </div>
            </div>

            {/* Arka Plan Overlay */}
            {showFilters && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20"></div>
            )}

            {/* Filtre Paneli */}
            <div
                className={`fixed top-0 left-0 w-80 bg-white shadow-lg h-full z-50 transform ${showFilters ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}
                ref={filterRef}
            >
                <div className="p-4 relative">
                    <div className='absolute top-0 right-2'>
                        <button
                            onClick={() => setShowFilters(false)}
                            className="px-2 rounded-xl hover:bg-gray-200 duration-200 transition-all mt-2 text-black text-2xl"
                        >
                            &times;
                        </button>
                    </div>

                    <div className='flex flex-col mt-12 items-start text-sm justify-center'>
                        <div className='w-full my-3'>
                            <h1 className='montserrat tracking-wide text-xl font-bold underline underline-offset-8'>Filtreleme</h1>
                        </div>
                        <input
                            type="text"
                            placeholder="Ürün Adı"
                            value={filter.name}
                            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                            className="border rounded p-2 mt-4 w-full"
                        />
                        <select
                            value={filter.category}
                            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                            className="border rounded p-2 text-sm mt-4 w-full"
                        >
                            <option value="">Tüm Kategoriler</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filter.color}
                            onChange={(e) => setFilter({ ...filter, color: e.target.value })}
                            className="border rounded p-2 text-sm mt-4 w-full"
                        >
                            <option value="">Tüm Renkler</option>
                            {colors.map((color, index) => (
                                <option key={index} value={color}>
                                    {color}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filter.size}
                            onChange={(e) => setFilter({ ...filter, size: e.target.value })}
                            className="border rounded p-2 text-sm mt-4 w-full"
                        >
                            <option value="">Tüm Bedenler</option>
                            {sizes.map((size, index) => (
                                <option key={index} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <div className='flex flex-row justify-between gap-2'>
                            <input
                                type="number"
                                placeholder="Min Fiyat"
                                value={filter.minPrice}
                                onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })}
                                className="border rounded p-2 mt-4 text-sm w-full"
                            />
                            <input
                                type="number"
                                placeholder="Max Fiyat"
                                value={filter.maxPrice}
                                onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
                                className="border rounded p-2 mt-4 text-sm w-full"
                            />
                        </div>

                        {/* Temizle Butonu */}
                        <button
                            onClick={resetFilters}
                            className="mt-4 bg-gray-700 text-xs w-24 text text-white py-2 rounded-lg"
                        >
                            Temizle
                        </button>
                    </div>
                </div>
            </div>


            {/* Ürünler Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6 gap-4 md:gap-6 lg:gap-8 w-full items-start justify-center pr-2">
                {filteredProducts.length > 0 ? (filteredProducts.map((product) => {
                    return (
                        <div className='flex items-center flex-grow w-auto xl:w-72 justify-center'>
                        <div className="bg-gray-100 shadow-md hover:shadow-xl transition-shadow flex flex-col duration-300 overflow-hidden group">
                            <div className="relative overflow-hidden cursor-pointer">
                                {/* Ürün Resimlerini Göster */}
                                <Link
                                    to={`/urun/${product._id}`}
                                    key={product._id}
                                    onClick={handleClick}
                                    className="relative group w-full h-full"
                                >
                                    {product.imageUrls && product.imageUrls.length > 0 ? (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={`http://localhost:5000${product.imageUrls[0]}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-all duration-500 ease-in-out transform group-hover:scale-110"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/placeholder.jpg';
                                                }}
                                            />
                                            {product.imageUrls[1] && (
                                                <img
                                                    src={`http://localhost:5000${product.imageUrls[1]}`}
                                                    alt="Second Image"
                                                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/placeholder.jpg';
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <img
                                            src="/placeholder.jpg"
                                            alt="Placeholder"
                                            className="w-full h-full object-center"
                                        />
                                    )}
                                </Link>

                            </div>

                            <div className="p-4 space-y-2">
                                <div>
                                    <h3 className="text-xs md:text-sm raleway font-sans font-semibold text-black pb-1 transition-colors duration-300">
                                    {product.brand} {product.name}
                                    </h3>
                              
                                </div>
                                <p style={{fontSize: '10px'}} className="text-gray-600 raleway line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                    <span className='flex flex-col items-start justify-center gap-1'>
                                        <span className="text-xs text-gray-800 text-opacity-55 font-extrabold line-through  ">
                                            {formatTurkishLira((product.price / 6) + (product.price))}
                                        </span>
                                        <span className="text-sm font-extrabold text-shadow shadow-white shadow-lg text-emerald-500">
                                            {formatTurkishLira(product.price)}
                                        </span>
                                    </span>
                                    <div className="flex item-center justify-center  p-0.5">
                          
                                     
                                    
                                            <div className='flex items-center justify-center'>
                                            <FavoriteButton productId={product._id} />

                                        <Link
                                              to={`/urun/${product._id}`}
                                              key={product._id}
                                              
                                            className=" text-black border-hidden hover:pb-4 hover:duration-150 transition-all ease-in-out border-4 font-sans px-2 py-2 rounded-lg text-xs flex items-center gap-2"
                                        >
                                            <FiShoppingCart size={20} />
        
                                        </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>

                    );
                })) : (
                    <div>
                        <span className="text-center montserrat w-full text-black py-7">Listelenecek ürün bulunamadı.</span>
                    </div>
                )}
            </div>
        </div>


    );
}

export default UrunContent;
