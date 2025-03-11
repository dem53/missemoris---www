import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FaBox, FaTruck, FaCheck } from 'react-icons/fa';
import { MdPending } from 'react-icons/md';

const OrderStatus = ({ status }) => {
    const getStatusInfo = () => {
        switch (status) {
            case 'pending':
                return {
                    icon: <MdPending className="text-yellow-500" size={20} />,
                    text: 'Onay Bekliyor',
                    color: 'text-yellow-500'
                };
            case 'red':
                return {
                    icon: <FaBox className="text-red-500" size={20} />,
                    text: 'Reddedildi',
                    color: 'text-red-500'
                };
            case 'kargo':
                return {
                    icon: <FaTruck className="text-blue-500" size={20} />,
                    text: 'Kargoya Verildi',
                    color: 'text-blue-500'
                };
            case 'success':
                return {
                    icon: <FaCheck className="text-green-500" size={20} />,
                    text: 'Sipariş Onaylandı',
                    color: 'text-green-500'
                };
            default:
                return {
                    icon: <MdPending className="text-gray-500" size={20} />,
                    text: 'Bilinmiyor',
                    color: 'text-gray-500'
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className="flex items-center gap-2">
            {statusInfo.icon}
            <span className={`${statusInfo.color} font-medium`}>{statusInfo.text}</span>
        </div>
    );
};

const OrderCard = ({ order }) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(null);

    const formatTurkishLira = (price) => {
        return price.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md mb-4 border border-gray-200 overflow-hidden">
            {/* Sipariş Başlık Kısmı */}
            <div className="p-6 cursor-pointer hover:bg-gray-50"
                onClick={() => {
                    setIsDetailsOpen(!isDetailsOpen);
                    if (!isDetailsOpen) setActiveTab('products');
                }}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-600">Sipariş No: {order._id.slice(5, 15)}</p>
                        <p className="text-sm text-gray-600">
                            Tarih: {format(new Date(order.createdAt), 'dd MMMM yyyy', { locale: tr })}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <OrderStatus status={order.status} />
                        <svg
                            className={`w-5 h-5 transition-transform ${isDetailsOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Detaylar Kısmı */}
            {isDetailsOpen && (
                <div className="border-t border-gray-200">
                    {/* Tab Başlıkları */}
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'products' ? 'bg-gray-100 text-emerald-600' : 'text-gray-600'
                                } hover:bg-gray-50 transition-colors`}
                            onClick={() => setActiveTab('products')}
                        >
                            Ürün Bilgileri
                        </button>
                        <button
                            className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'delivery' ? 'bg-gray-100 text-emerald-600' : 'text-gray-600'
                                } hover:bg-gray-50 transition-colors`}
                            onClick={() => setActiveTab('delivery')}
                        >
                            Teslimat ve Ödeme Bilgileri
                        </button>
                    </div>

                    {/* Ürün Bilgileri */}
                    {activeTab === 'products' && (
                        <div className="p-6 space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between border-b last:border-b-0 pb-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={`http://localhost:5000${item.product.imageUrls[0]}`}
                                            alt={item.product.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder.jpg';
                                            }}
                                        />
                                        <div>
                                            <h3 className="font-medium">{item.product.name}</h3>
                                            <p className="text-sm text-gray-600">{item.product.brand}</p>
                                            <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium">{formatTurkishLira(item.price * item.quantity)}</p>
                                </div>
                            ))}

                        </div>
                    )}

                    {/* Teslimat Bilgileri */}
                    {activeTab === 'delivery' && (
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-2">Teslimat Adresi</h3>
                                    <p className="text-gray-600">{order.shippingAddress}</p>
                                    <p className="text-gray-600">{order.district}, {order.city}</p>
                                </div>
                                {order.orderNotes && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-gray-900 mb-2">Sipariş Notu</h3>
                                        <p className="text-gray-600">{order.orderNotes}</p>
                                    </div>
                                )}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-2">Ödeme Bilgileri</h3>
                                    <p className="text-gray-600">Ödeme Yöntemi: {order.paymentMethod === 'credit_card' ? 'Kredi Ödemesi' : 'bank_transfer' ? 'Banka Havalesi' : 'Bilinmiyor'} </p>
                                    <p className="text-gray-600">Tutar: {formatTurkishLira(order.totalAmount)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const SiparisGecmisim = () => {

    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const userId = localStorage.getItem('userId');

                if (!token || !userId) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`http://localhost:5000/api/orders/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

      
                const sortedOrders = response.data.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );

                setOrders(sortedOrders);
            } catch (error) {
                console.error('Siparişler yüklenirken hata:', error);
                setError('Siparişleriniz yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);


    if (loading) {
        return (
            <div className='flex flex-col min-h-screen'>
                <Header />
                <div className="flex-grow container mx-auto px-4 py-8 mt-20">
                    <h1 className="text-2xl font-bold montserrat mb-8 border-b pb-4">Sipariş Geçmişim</h1>
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    </div>

                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex flex-col min-h-screen'>
                <Header />
                <div className="flex-grow container mx-auto px-4 py-8 mt-20">
                    <div className="text-center text-red-500">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <div className="flex-grow container mx-auto px-4 py-8 mt-20">
                <h1 className="text-2xl font-bold montserrat mb-8 border-b pb-4">Sipariş Geçmişim</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Henüz hiç siparişiniz bulunmamaktadır.</p>
                        <button
                            onClick={() => navigate('/tum_urunler')}
                            className="mt-4 bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition-colors"
                        >
                            Alışverişe Başla
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SiparisGecmisim;