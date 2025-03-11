import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FavoriteButton = ({ productId, tittle, onSuccess }) => {

    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        checkFavoriteStatus();
    }, [productId]);

    const checkFavoriteStatus = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            const response = await axios.get(
                `http://localhost:5000/api/favorites/check/${productId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setIsFavorite(response.data.isFavorite);
        } catch (error) {
            console.error('Favori durumu kontrol edilirken hata:', error);
        }
    };

    const toggleFavorite = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast.info('Favorilere eklemek için giriş yapmalısınız');
            navigate('/login');
            return;
        }
        setLoading(true);
        try {
            if (isFavorite) {
                await axios.delete(
                    `http://localhost:5000/api/favorites/remove/${productId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                toast.success('Ürün favorilerden kaldırıldı');
            } else {
                await axios.post(
                    'http://localhost:5000/api/favorites/add',
                    { productId },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                toast.success('Ürün favorilere eklendi');
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-row items-center justify-center'>
            <div>
                <button
                    onClick={toggleFavorite}
                    disabled={loading}
                    className={`p-2 rounded-lg  gap-2 flex items-center justify-center transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {isFavorite ? (
                        <FaHeart className="text-red-500 text-xl" />
                    ) : (
                        <FaRegHeart className="text-black hover:text-red-500 text-xl" />
                    )}
                    
                     {
                        isFavorite ? (
                            <h1>{onSuccess}</h1>
                        ) : (
                            <span> {tittle} </span>
                        )
                     }  
                </button>
            </div>



        </div>
    );
};

export default FavoriteButton;