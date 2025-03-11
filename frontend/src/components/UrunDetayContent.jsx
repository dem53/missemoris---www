import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from "react-icons/fa";
import Cart from './Cart';
import FavoriteButton from './FavorilerButton';
import '../App.css'

function UrunDetayContent() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [sessionId, setSessionId] = useState(null);

    const handleClick = () => {
        window.scrollTo(0, 0);
    }

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/getDetail/${id}`);
                setProduct(response.data.post);
            } catch (err) {
                console.error('Hata detayı:', err);
                setError(err.response?.data?.message || 'Ürün detayları alınırken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [id]);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('authToken');
            let sessionId = localStorage.getItem('sessionId');

            const response = await axios.get('http://localhost:5000/api/cart', {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    "Content-Type": 'application/json'
                },
                params: {
                    sessionId: !token ? sessionId : undefined
                }
            });
            setCartItems(response.data.items);
            localStorage.setItem('cartItems', JSON.stringify(response.data.items || []));
            console.log("cart items", localStorage.getItem('cartItems'))
        } catch (error) {
            console.error('Sepet yükleme hatası:', error);
        }
    };


    const handleAddToCart = async (product) => {

        try {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');
            let sessionId = localStorage.getItem('sessionId');

            const payload = token
                ? { productId: product._id, quantity: 1, userId: userId }
                : { productId: product._id, quantity: 1, sessionId: sessionId };

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

    useEffect(() => {
        if (cartItems.length > 0) {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }, [cartItems]);

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

    const handleBuyNow = async (product) => {

        await handleAddToCart(product);
        navigate('/odeme', { state: { cartItems: [...cartItems, { product, quantity }] } });
    };

    const handleImageChange = (index) => {
        setCurrentImageIndex(index);
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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
                <Link to="/" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    Anasayfaya Dön
                </Link>
            </div>
        );
    }

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

            <div className='mt-16 flex flex-col border-b-2 justify-between items-start'>
                <div className='flex flex-row items-center montserrat gap-2 mb-4'>
                    <div className='text-gray-400'>
                        <Link to='/'>Anasayfa</Link>
                    </div>
                    <div>
                        <h1 className='text-gray-400'>/</h1>
                    </div>
                    <Link to={'/tum_urunler'} className='py-4'>
                        <h1 className='text-lg font-semibold text-gray-400'>Tüm Ürünler</h1>
                    </Link>

                    <div>
                        <h1 className='text-gray-400'>/</h1>
                    </div>
                    <div className='py-4'>
                        <h1 className='text-lg font-semibold text-gray-800'>Ürün Detayları</h1>
                    </div>
                </div>
            </div>

            <div className='flex flex-col shadow-lg py-6 relative lg:flex-row my-4 mb-12'>
                {product && (
                    <>
                        <div className="lg:w-1/2 mb-4 lg:mb-0">
                            <div className="relative overflow-hidden h-[35rem] object-cover">
                                {product.imageUrls && product.imageUrls.length > 0 ? (
                                    <img
                                        src={`http://localhost:5000${product.imageUrls[currentImageIndex]}`}
                                        alt={product.name}
                                        className="w-full h-full cursor-zoom-in object-cover transition-transform duration-500 ease-in-out transform details-img"
                                        onClick={openModal}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder.jpg';
                                        }}
                                    />
                                ) : (
                                    <img
                                        src="/placeholder.jpg"
                                        alt="Placeholder"
                                        className="w-full h-full object-center"
                                    />
                                )}
                            </div>
                            <div className="flex justify-center mt-4">
                                {product.imageUrls.map((url, index) => (
                                    <button
                                        key={index}
                                        className={`w-16 h-16 mx-1 rounded-lg overflow-hidden ${currentImageIndex === index ? 'border-2 border-blue-500' : ''}`}
                                        onClick={() => handleImageChange(index)}
                                    >
                                        <img
                                            src={`http://localhost:5000${url}`}
                                            alt={`Thumbnail ${index}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder.jpg';
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-1/2 lg:pl-8 p-6 rounded-lg bg-gray-100">
                            <h1 className="text-5xl raleway mb-2">{product.name}</h1>
                            <p className="text-gray-600 font-sans mb-6">{product.brand}</p>
                            <p className="text-gray-600 font-sans mb-4">{product.description}</p>
                            <span className="text-2xl montserrat text-black">{formatTurkishLira(product.price)}</span>
                            <div className="flex flex-col items-start mt-4 mb-5">
                                <label className='font-extralight mb-1 text-lg text-black'>Adet</label>
                                <div className="flex justify-center items-center">
                                    <button
                                        onClick={decreaseQuantity}
                                        className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded-l"
                                    >
                                        -
                                    </button>
                                    <input
                                        type='number'
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, e.target.value))}
                                        className='bg-gray-100 cursor-pointer p-3 w-32 text-center montserrat text-sm rounded-none border'
                                    />
                                    <button
                                        onClick={increaseQuantity}
                                        className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded-r"
                                    >
                                        +
                                    </button>
                                </div>


                            </div>

                            <div className="mt-4 flex flex-col w-64 items-start gap-5 ">
                                <div className='bg-white text-black border-2 border-black w-64 px-5 py-1 raleway hover:bg-gray-100 rounded-sm transition duration-300 ease-in-out'>
                                    <FavoriteButton tittle={'Favorilere Ekle'} onSuccess={'Favorim'} productId={product._id} />
                                </div>

                                <div className='flex items-center justify-center gap-2'>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleAddToCart(product);

                                        }}
                                        className="bg-white text-black border-2 flex items-center justify-center gap-2 border-black w-64 px-5 py-3 raleway hover:bg-gray-100 rounded-sm transition duration-300 ease-in-out">
                                        <FaShoppingCart className="text-gray-600" />
                                        Sepete Ekle
                                    </button>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleBuyNow(product);
                                        handleClick()
                                    }}
                                    className="bg-black border-black hover:bg-gray-800 hover:duration-300 text-white px-5 py-3 raleway rounded-sm transition w-64 ease-in-out">
                                    Hemen Satın Al
                                </button>
                            </div>


                            <div className='flex flex-col items-start gap-4 mt-6 justify-center'>
                                <p className='text-sm raleway'>
                                    Bonheur B+B Vegan Leather Çanta, günlük kullanım için şık ve çok yönlü alternatiflerdendir. Çanta, ön yüzündeki tipografi ve logo işleme detayıyla; geniş, dikdörtgen bir siluete sahiptir.
                                </p>

                                <p className='text-sm raleway'>
                                    Renkli ve %100 vegan deriden üretilen B+BAG koleksiyonu, stil ve işlevin mükemmel bir birleşimidir.
                                </p>

                                <p className='text-sm raleway'>
                                    Kulplar, çantayı dirsek kıvrımında konforlu bir şekilde kullanmanız için yeterince uzundur. Dilerseniz çantanızı kulplarından tutarak, dilerseniz de çanta askısı ile omuzda düz ya da çapraz takarak kullanabilirsiniz.
                                </p>

                            </div>


                            <div className='flex flex-col gap-5'>


                                <div className='flex flex-col items-start mt-5 justif-center gap-4'>
                                    <h1 className='font-light tracking-wider text-lg'>ÖZELLİKLER</h1>
                                    <ul className='text-sm raleway list-disc flex flex-col items-start justify-center gap-1'>
                                        <li>
                                            30 cm genişlik, 22 cm  yükseklik, 15 cm derinlik ölçüsündedir.
                                        </li>

                                        <li>
                                            Siparişiniz, görseldeki çanta sapıyla birlikte gönderilmektedir.
                                        </li>

                                        <li>
                                            %100 vegan deri
                                        </li>

                                        <li>
                                            Su geçirmez

                                        </li>

                                        <li>
                                            Ön yüzeyde tipografi ve logo işlemeli
                                        </li>

                                        <li>
                                            Çift kulp
                                        </li>
                                    </ul>
                                </div>




                                <div className='flex flex-col items-start mt-5 justif-center gap-4'>
                                    <h1 className='font-light font-sans tracking-wider text-lg'>KULLANIM</h1>
                                    <ul className='text-sm raleway list-disc flex flex-col items-start justify-center gap-1'>
                                        <li>
                                            Kuru temizleme kullanmayın
                                        </li>

                                        <li>
                                            Çamaşır makinesinde yıkamayın
                                        </li>

                                        <li>
                                            Kurutma makinesi kullanmayın
                                        </li>

                                        <li>
                                            Hassas ütü ayarı ile ütüleyin

                                        </li>

                                        <li>
                                            Direk güneş ışığına maruz bırakmamaya özen gösterin
                                        </li>

                                        <li>
                                            Ürünü katlamadan, buruşturmadan; yüzeyi düz olacak şekilde asarak ya da yatırarak muhafaza ediniz
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="relative">
                        <button onClick={closeModal} className="absolute top-2 right-2 text-white text-2xl">✖</button>
                        <img
                            src={`http://localhost:5000${product.imageUrls[currentImageIndex]}`}
                            alt={product.name}
                            className="max-w-full max-h-screen"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default UrunDetayContent;