import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SepetimContent from '../components/SepetimContent';
import axios from 'axios';

function Sepetim() {

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const storedUserId = localStorage.getItem('userId');
        let currentSessionId = localStorage.getItem('sessionId');

        setUserId(storedUserId);

        if (!token && !currentSessionId) {
            currentSessionId = 'session_' + Date.now();
            localStorage.setItem('sessionId', currentSessionId);
            setSessionId(currentSessionId);
        } else {
            setSessionId(currentSessionId);
        }

        fetchCart(token, currentSessionId);
    }, []);

    
    const handleAddToCart = async (product) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            
            const selectedSize = cartItems.size;
      
            const payload = token
                ? { productId: product._id, quantity: 1, userId, size: selectedSize }
                : { productId: product._id, quantity: 1, sessionId, size: selectedSize };
    
            // API'ye POST isteği gönderme
            await axios.post('http://localhost:5000/api/cart/add', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            });
    
            fetchCart(token, sessionId);
        } catch (error) {
            console.error('Sepete ekleme hatası:', error);
            alert('Ürün sepete eklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };
    

    const fetchCart = async (token, currentSessionId) => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/cart', {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                params: {
                    sessionId: !token ? currentSessionId : undefined
                }
            });
            setCartItems(response.data.items);
            const responseData = response.data.items;
            console.log("RESPONSE DATA", responseData);
            setError(null);
        } catch (error) {
            console.error('Sepet yükleme hatası:', error);
            setError('Sepet yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };


    // Sepetten ürün çıkar
    const handleRemoveFromCart = async (productId) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const payload = token ? { productId, userId } : { productId, sessionId };

            await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
                data: payload,
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                }
            });

            fetchCart(token, sessionId);
        } catch (error) {
            console.error('Sepetten çıkarma hatası:', error);
            alert('Ürün sepetten çıkarılırken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    // Sepeti temizle
    const handleClearCart = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const payload = token ? { userId } : { sessionId };

            await axios.delete('http://localhost:5000/api/cart/clear', {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                data: payload
            });

            fetchCart(token, sessionId); // Sepeti güncelle
        } catch (error) {
            console.error('Sepet temizleme hatası:', error);
            alert('Sepet temizlenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <SepetimContent
                userId={userId}
                sessionId={sessionId}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onClearCart={handleClearCart}
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
                loading={loading}
                error={error}
            />
        </>
    );
}

export default Sepetim;