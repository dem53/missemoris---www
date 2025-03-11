import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

const Favorilerim = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const tokenControl = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/');
                return;
            }
            if (token) {
                navigate('/favorilerim');
                return;
            }
        };
        tokenControl();
    }, []);


    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://localhost:5000/api/favorites', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(response.data.data);
        } catch (error) {
            toast.error('Favoriler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (productId) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:5000/api/favorites/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(favorites.filter(fav => fav.product._id !== productId));
            toast.success('Ürün favorilerden kaldırıldı');
        } catch (error) {
            toast.error('Ürün kaldırılırken bir hata oluştu');
        }
    };


    const getTurkishFormat = (price) => {
        return price.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        });
    };

    if (loading) {
        return (
            <div className='flex flex-col min-h-screen'>
                <div className="flex-grow container mx-auto px-4 py-8 mt-20">
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
                            <h1 className='text-lg font-semibold text-gray-800'>Favorilerim</h1>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold montserrat border-b-2 pb-3 mb-6">Favorilerim</h1>
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">

            <div className='flex flex-row items-center mt-16 montserrat gap-2 mb-4'>
                <div className='text-gray-400'>
                    <Link to='/'>
                        Anasayfa
                    </Link>
                </div>
                <div>
                    <h1 className='text-gray-400'>/</h1>
                </div>
                <div className='py-4'>
                    <h1 className='text-lg font-semibold text-gray-800'>Favorilerim</h1>
                </div>
            </div>
            <h1 className="text-2xl font-bold montserrat border-b-2 pb-3 mb-6">Favorilerim</h1>

            {favorites.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Henüz favoriniz bulunmuyor.</p>
                    <Link
                        to="/tum_urunler"
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Ürünleri Keşfet
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {favorites.map((favorite) => (
                        <div
                            key={favorite._id}
                            className="border rounded-lg relative overflow-hidden shadow-lg"
                        >
                            <Link to={`/urun/${favorite.product._id}`}>
                                <div className='absolute top-2 left-2 '>
                                    <FaHeart size={25} className="text-red-500 text-xl" />
                                </div>
                                <img
                                    src={`http://localhost:5000${favorite.product.imageUrls[0]}`}
                                    alt={favorite.product.name}
                                    className="w-full h-56 object-cover"
                                />


                            </Link>
                            <div className="p-4">
                                <h2 className="text-xl montserrat font-semibold mb-2">
                                    {favorite.product.name}
                                </h2>
                                <p className="text-gray-600 montserrat mb-2">
                                    {favorite.product.brand}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg montserrat font-bold">
                                        {getTurkishFormat(favorite.product.price)}
                                    </span>
                                    <button
                                        onClick={() => removeFavorite(favorite.product._id)}
                                        className="text-red-500 flex items-center justify-center gap-1 hover:text-red-700"
                                    >
                                        <h1 className='text-sm raleway'>Favorimden Çıkar</h1>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorilerim;