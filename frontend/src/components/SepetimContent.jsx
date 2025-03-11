import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from 'axios';
import { useState } from 'react';

function SepetimContent({ cartItems, onAddToCart, onRemoveFromCart, onClearCart, setIsCartOpen }) {
    const cartRef = useRef(null);
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [productData, setProductData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCartLoading, setIsCartLoading] = useState(true);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://localhost:5000/getPosts');
                const productData = response.data.posts;
                setProductData(productData);
            } catch (error) {
                setError('Veri alınırken hata', error);
            } finally {
                setIsLoading(false);
            }
        };

        const loadCartData = async () => {
            try {
                setIsCartLoading(true);
                await new Promise(resolve => setTimeout(resolve));
            } finally {
                setIsCartLoading(false);
            }
        };

        fetchProducts();
        loadCartData();
    }, []);

    const formatTurkishLira = (price) => {
        return price.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        });
    };

    const calculateTotalPrice = () => {
        return Array.isArray(cartItems)
            ? cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
            : 0;
    };

    const calculateTotalQuantity = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                setIsCartOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsCartOpen]);



    return (
        <div className="bg-white container mx-auto p-4 flex flex-col justify-center">
            <div className='mt-24 bg-gray-100 text-black py-4 px-4'>
                <div className='flex w-full flex-row my-2 justify-between items-center'>
                    <div>
                        <h1 className="montserrat tracking-wide text-2xl">ALIŞVERİŞ SEPETİM</h1>
                    </div>
                    <div>
                        <Link to={'/tum_urunler'}>
                            <h1 className='raleway underline pr-5 underline-offset-4 text-black text-sm'>Alışverişe Devam et</h1>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col mt-10 shadow-xl border p-5 h-full items-start justify-start lg:justify-center lg:flex-row gap-12">
                <div ref={cartRef} className="bg-white shadow-lg h-full flex flex-col w-full lg:w-2/3 rounded-md p-6">
                    <div className="flex justify-between border-b-2 w-full items-center mb-6">
                        <h2 className="text-xl mb-4 font-light">Sepetim ({calculateTotalQuantity()} adet)</h2>
                        {cartItems.length > 0 && (
                            <div onClick={() => onClearCart()} className="cursor-pointer relative items-center text-center hover:bg-red-100 rounded-md duration-300 ease-in-out transition-all text-red-500 justify-center">
                                <div className="p-2 rounded-sm text-sm transition flex items-center justify-center gap-1 duration-300 ease-in-out">
                                    Sepeti Temizle
                                    <FaRegTrashAlt size={15} />
                                </div>
                            </div>
                        )}
                    </div>

                    {isCartLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        </div>
                    ) : cartItems && cartItems.length > 0 ? (
                        <div className="space-y-6">
                            {cartItems && cartItems.map((item, index) => (
                                <div key={index} className="flex items-start justify-between border-b pb-4">
                                    <div className="flex items-start gap-4">
                                        {item.product.imageUrls && item.product.imageUrls.length > 0 ? (
                                            <img
                                                src={`http://localhost:5000${item.product.imageUrls[0]}`}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover mt-2 rounded-md"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 bg-gray-300 flex items-center justify-center text-white text-xl rounded-md">...</div>
                                        )}
                                        <div>
                                            <h3 className="text-lg font-extrabold">{item.product.name}</h3>
                                            <h3 className="text-medium font-semibold">{item.product.brand}</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {formatTurkishLira(item.product.price)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-4 items-end'>
                                        <div className="flex cursor-pointer flex-row border-2 border-gray-300 rounded-lg p-1 justify-evenly items-center gap-4 shadow-md bg-gray-50">
                                            <button
                                                onClick={() => onRemoveFromCart(item.product._id)}
                                                className="text-red-500 hover:text-white hover:bg-red-400 transition-colors duration-300 ease-in-out px-2 py-0.5 rounded-full text-xs font-semibold"
                                            >
                                                <FaRegTrashAlt />
                                            </button>
                                            <span className="text-sm font-medium text-gray-700">{item.quantity}</span>
                                            <button
                                                onClick={() => onAddToCart(item.product)}
                                                className="text-green-500 hover:text-white hover:bg-green-400 transition-colors duration-300 ease-in-out px-2 py-0.5 rounded-full text-xs font-semibold"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className='flex flex-row items-center gap-6 justify-center'>
                                            <div className='flex flex-col items-center justify-center gap-2'>
                                                <h1 className='font-sans font-semibold underline text-xs'>Adet</h1>
                                                <h2 className='raleway text-xs text-gray-700'>{item.quantity}</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center montserrat font-bold flex flex-col gap-4 my-6 text-gray-500 mt-8">
                            <div className='flex items-center justify-center'>
                                <MdOutlineShoppingCart size={60} />
                            </div>
                            <p className='raleway text-xl md:text-2xl'>Sepetinizde ürün bulunmamaktadır.</p>
                            <Link to={'/tum_urunler'}>
                                <button type='button' className='w-64 rounded-md text-black border-2 bg-white border-black hover:bg-black hover:text-white duration-300 ease-in-out p-3 font-sans'>
                                    Alışverişe Devam Et
                                </button>
                            </Link>
                            <Link to={'/indirimli_urunler'}>
                                <button type='button' className='w-64 hover:text-white rounded-md hover:bg-red-500 text-red-500 border-red-500 border-2  p-3 raleway'>
                                    İndirimli Ürünler
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {!isCartLoading && cartItems.length > 0 ? (
                    <div className="w-full md:max-w-2xl lg:w-96 bg-white shadow-lg rounded-md p-6 border-2 border-gray-200">
                        <div className='p-3 rounded-md'>
                            <h3 className="text-xl font-semibold raleway mb-8 border-b-2 border-gray-300 pb-2">Sipariş Özeti</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-semibold">Ürün Adedi :</p>
                                    <p className="font-semibold">{calculateTotalQuantity()} adet</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-semibold">Sepet Tutarı :</p>
                                    <p className="font-semibold">{formatTurkishLira(calculateTotalPrice())}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-bold">Toplam Tutar :</p>
                                    <p className="font-semibold">{formatTurkishLira(calculateTotalPrice())}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={() => navigate('/odeme', { state: { cartItems } })}
                                    className="bg-emerald-500 text-white w-full px-6 py-3 rounded-sm hover:bg-emerald-600 montserrat transition duration-300 ease-in-out"
                                >
                                    Alışverişi Tamamla
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="carousel-wrapper mt-8 container mx-auto">
                <h1 className='font-bold font-sans text-2xl my-8 border-b-2 w-full pb-4'>KASA ÖNÜ FIRSATLAR</h1>
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="carousel-container flex gap-6 items-center cursor-pointer flex-nowrap justify-start space-x-6">
                        {productData && productData.length > 0 ? (
                            productData.slice(0, 10).map((product, index) => (
                                <div
                                    key={index}
                                    className="carousel-item min-w-[250px] md:min-w-[300px] border-2 rounded-lg shadow-xl bg-white flex flex-col items-start justify-between transition-transform transform hover:scale-105 hover:shadow-xl duration-300 ease-in-out"
                                >
                                    <div className="relative w-full h-64 overflow-hidden rounded-t-lg">
                                        <Link
                                            to={`/urun/${product._id}`}
                                            key={product._id}
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
                                    <div className="flex flex-col p-4 gap-2">
                                        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                                        <h3 className="text-sm text-gray-600">{product.brand}</h3>
                                        <p className="text-sm text-gray-500">{product.description}</p>
                                        <h2 className="font-extralight text-sm text-gray-600">{product.price} ₺</h2>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-full text-center py-4 text-gray-500">Listelenecek Ürün Bulunamadı.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SepetimContent;