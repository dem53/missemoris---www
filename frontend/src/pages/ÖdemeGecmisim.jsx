import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import Header from '../components/Header';

// PaymentStatus bileşeni
const PaymentStatus = ({ status, type, paymentStatus }) => {
    const getStatusInfo = () => {
        switch (type) {
            case 'havale':
                switch (status) {
                    case 'pending':
                        return {
                            icon: <FaClock className="text-yellow-500" size={20} />,
                            text: 'Onay Bekliyor',
                            color: 'text-yellow-500'
                        };
                    case 'success':
                        return {
                            icon: <FaCheck className="text-green-500" size={20} />,
                            text: 'Onaylandı',
                            color: 'text-green-500'
                        };
                    case 'rejected':
                        return {
                            icon: <FaTimes className="text-red-500" size={20} />,
                            text: 'Reddedildi',
                            color: 'text-red-500'
                        };
                    default:
                        return {
                            icon: <FaClock className="text-gray-500" size={20} />,
                            text: 'Bilinmiyor',
                            color: 'text-gray-500'
                        };
                }
            case 'kredi':
                switch (paymentStatus) {
                    case 'PENDING':
                        return {
                            icon: <FaClock className="text-yellow-500" size={20} />,
                            text: 'Onay Bekliyor',
                            color: 'text-yellow-500'
                        };
                    case 'SUCCESS':
                        return {
                            icon: <FaCheck className="text-green-500" size={20} />,
                            text: 'Onaylandı',
                            color: 'text-green-500'
                        };
                    case 'rejected':
                        return {
                            icon: <FaTimes className="text-red-500" size={20} />,
                            text: 'Reddedildi',
                            color: 'text-red-500'
                        };
                    default:
                        return {
                            icon: <FaClock className="text-gray-500" size={20} />,
                            text: 'Bilinmiyor',
                            color: 'text-gray-500'
                        };
                }
            default:
                return {
                    icon: <FaClock className="text-gray-500" size={20} />,
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

// PaymentCard bileşeni
const PaymentCard = ({ payment, type }) => {
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
            <div className="p-6 cursor-pointer hover:bg-gray-50"
                onClick={() => {
                    setIsDetailsOpen(!isDetailsOpen);
                    if (!isDetailsOpen) setActiveTab('payment');
                }}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-600">Ödeme No: {payment._id.slice(5, 15)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        
                        {type === 'havale' && (<PaymentStatus status={payment.status} type={type} />)}

                        {type === 'kredi' && (<PaymentStatus paymentStatus={payment.paymentStatus} type={type} />)}

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

            {isDetailsOpen && (
                <div className="border-t border-gray-200">
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'payment' ? 'bg-gray-100 text-emerald-600' : 'text-gray-600'
                                } hover:bg-gray-50 transition-colors`}
                            onClick={() => setActiveTab('payment')}
                        >
                            Ödeme Bilgileri
                        </button>
                        <button
                            className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'order' ? 'bg-gray-100 text-emerald-600' : 'text-gray-600'
                                } hover:bg-gray-50 transition-colors`}
                            onClick={() => setActiveTab('order')}
                        >
                            Sipariş Detayları
                        </button>
                    </div>

                    {activeTab === 'payment' && type === 'havale' && (
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 flex flex-col gap-2 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-2">Havale Bilgileri</h3>
                                    <p className="text-gray-600">Gönderen Adı: {payment.firstName} {payment.lastName}</p>
                                    <p className="text-gray-600">Banka: {payment.bankName}</p>
                                    <p className="text-gray-600">Gönderen IBAN: TR {payment.accountNumber}</p>
                                    <p className="text-gray-600">Tutar: {formatTurkishLira(payment.amount)}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-2">Ödeme Durumu</h3>
                                    <PaymentStatus status={payment.status} type={type} />
                                    {payment.status === 'rejected' && payment.rejectionReason && (
                                        <p className="text-red-500 mt-2">Red Nedeni: {payment.rejectionReason}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}


                    {activeTab === 'payment' && type === 'kredi' && (
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-2">Kredi ile Ödeme</h3>
                                    <p className="text-gray-600">Tutar: {formatTurkishLira(payment.amount)}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-2">Ödeme Durumu</h3>
                                    <PaymentStatus paymentStatus={payment.paymentStatus} type={type} />
                                    {payment.paymentStatus === 'RED' && payment.rejectionReason && (
                                        <p className="text-red-500 mt-2">Red Nedeni: {payment.rejectionReason}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'order' && payment.order && (
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-2">Sipariş Özeti</h3>
                                    <p className="text-gray-600">Sipariş No: {payment.order._id.slice(5, 15)}</p>
                                    <p className="text-gray-600">Toplam Tutar: {formatTurkishLira(payment.order.totalAmount)}</p>
                                </div>
                                {payment.order.items && (
                                    <div className="space-y-4">
                                        {payment.order.items.map((item, index) => (
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
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Ana sayfa bileşeni
const OdemeGecmisim = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState({ havale: [], kredi: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem('authToken');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const responseHavale = await axios.get('http://localhost:5000/api/odeme/havale/kullanici', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const responseKredi = await axios.get('http://localhost:5000/api/payment/kullanici', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                setPayments({
                    havale: responseHavale.data.data || [],
                    kredi: responseKredi.data.data || []
                });

            } catch (error) {
                console.error('Ödemeler yüklenirken hata:', error);
                setError('Ödeme geçmişiniz yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow container mx-auto px-4 py-8 mt-20">
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow container mx-auto px-4 py-8 mt-20">
                    <div className="text-center text-red-500">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow container mx-auto px-4 py-8 mt-20">
                <h1 className="text-2xl font-bold montserrat mb-8 border-b pb-4">Ödeme Geçmişim</h1>

                {payments.havale.length === 0 && payments.kredi.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Henüz hiç ödeme kaydınız bulunmamaktadır.</p>
                        <button
                            onClick={() => navigate('/tum_urunler')}
                            className="mt-4 bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition-colors"
                        >
                            Alışverişe Başla
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Havale ödemeleri */}
                        {payments.havale && payments.havale.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Havale Ödemeleri</h2>
                                {payments.havale.map((payment) => (
                                    <PaymentCard key={payment._id} payment={payment} type="havale" />
                                ))}
                            </div>
                        )}

                        {/* Kredi ödemeleri */}
                        {payments.kredi && payments.kredi.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Kredi Kartı Ödemeleri</h2>
                                {payments.kredi.map((payment) => (
                                    <PaymentCard key={payment._id} payment={payment} type="kredi" />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OdemeGecmisim;