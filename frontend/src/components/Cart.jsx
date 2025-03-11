import React, { useEffect, useRef, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useNavigate, Link } from 'react-router-dom';


function Cart({ isCartOpen, setIsCartOpen, onAddToCart, onRemoveFromCart, onClearCart, cartItems, fetchCart }) {
    const cartRef = useRef(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isCartOpen) {
            fetchCart();
        }
    }, [isCartOpen, fetchCart]);

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

    const handleClick = () => {
        window.scrollTo(0, 0);
    }

    if (loading) {
        return (
            <div className="fixed top-0 right-0 bg-white shadow-lg w-80 h-full z-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div
            ref={cartRef}
            className={`fixed top-0 right-0 bg-white shadow-lg w-80 h-full z-50 p-4 duration-300 transition-transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-medium border-b-2 w-full pb-2 raleway mt-4 font-semibold">
                    Sepetim Önizleme
                </h2>
                <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-red-500 hover:text-red-700"
                >
                    <IoCloseOutline size={24} />
                </button>
            </div>

            {Array.isArray(cartItems) && cartItems.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                    <p>Sepetinizde ürün bulunmamaktadır.</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-300px)]">
                        {Array.isArray(cartItems) && cartItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between border-b pb-3">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={`http://localhost:5000${item.product.imageUrls[0]}`}
                                        alt={item.product.name}
                                        className="w-16 h-16 object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder.jpg';
                                        }}
                                    />
                                    <div>
                                        <h3 className="font-semibold raleway">{item.product.name}</h3>
                                        <p className="text-sm text-gray-500 font-semibold">{item.product.brand}</p>
                                        <p className="text-sm text-gray-600 montserrat mt-1">
                                            {formatTurkishLira(item.product.price)} x {item.quantity}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex cursor-pointer flex-col py-1 rounded-lg justify-evenly items-center gap-2 shadow-sm border border-gray-400">
                                    <button
                                        onClick={() => {
                                            onAddToCart(item.product).finally(() => setLoading(false));
                                        }}
                                        className="text-green-500 transition-colors duration-300 ease-in-out px-2 rounded-full text-xs font-semibold"
                                    >
                                        +
                                    </button>
                                    <span className="text-xs montserrat font-light text-gray-700">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => {
                                            onRemoveFromCart(item.product._id).finally(() => setLoading(false));
                                        }}
                                        className="text-red-500 transition-colors duration-300 ease-in-out px-2 rounded-full text-xs font-semibold"
                                    >
                                        -
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="fixed bottom-0 right-0 w-80 bg-white p-4 border-t">
                        <div className="flex flex-col gap-4">
                            <div onClick={() => navigate('/sepetim', {state: {cartItems}})} className="text-black font-bold cursor-pointer hover:text-blue-800 raleway underline underline-offset-4">
                                Sepetimi Gör
                            </div>

                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">Toplam:</h3>
                                <p className="text-xl font-extrabold">
                                    {formatTurkishLira(calculateTotalPrice())}
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setLoading(true);
                                    onClearCart().finally(() => setLoading(false));
                                }}
                                className="bg-white text-black border-2 border-black w-full px-5 py-3 raleway hover:bg-gray-100 rounded-sm transition duration-300 ease-in-out"
                            >
                                Sepeti Temizle
                            </button>

                            <button
                                onClick={() => navigate('/odeme', { state: { cartItems } }, handleClick())}
                                className="bg-black border-black hover:bg-gray-800 w-full text-white px-5 py-3 raleway rounded-sm transition duration-300 ease-in-out"
                            >
                                Alışverişi Tamamla
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;