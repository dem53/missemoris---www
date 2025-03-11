import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import OnayContent from './OnayContent';

function SiparisYonetimi() {

    
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [selectedFilterStatus, setSelectedFilterStatus] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage, setOrdersPerPage] = useState(10);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchOrderData();
    }, []);

    const fetchOrderData = async () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            console.error('Token bulunamadı.');
            setLoading(false);
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
            const response = await axios.get('http://localhost:5000/api/orders/list', {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": 'application/json'
                }
            });

            console.log("API RESPONSE : ", response.data);
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Veri alınırken hata:', error);
            setError('Veri alınırken bir hata ile karşılaşıldı.');
            setLoading(false);
        }
    };

    const handleApproveOrder = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:5000/api/orders/${id}/approve`, {}, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
                    "Content-Type": 'application/json'
                }
            });
            console.log("Sipariş onaylandı:", response.data);
            fetchOrderData();
        } catch (error) {
            console.error('Sipariş onaylanırken hata:', error);
            setError('Sipariş onaylanırken bir hata oluştu.');
        }
    };

    const handleUpdateOrder = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.patch(`http://localhost:5000/api/orders/${selectedOrder._id}`,
                selectedOrder,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
                        "Content-Type": 'application/json'
                    }
                }
            );
            console.log("Güncellenmiş sipariş:", response.data);
            setShowModal(false);
            fetchOrderData();
        } catch (error) {
            console.error('Sipariş güncellenirken hata:', error);
            setError('Sipariş güncellenirken bir hata oluştu.');
        }
    };

    const openModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const openModal2 = (order) => {
        setSelectedOrder(order);
        setShowModal2(true);
    }

    const closeModal2 = () => {
        setShowModal2(false);
        setSelectedOrder(null);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const handleFilterChange = (e) => {
        setSelectedFilterStatus(e.target.value);
    };

    const handlePriceFilterChange = (e) => {
        if (e.target.name === 'minPrice') {
            setMinPrice(e.target.value);
        } else if (e.target.name === 'maxPrice') {
            setMaxPrice(e.target.value);
        }
    };

    const handleDateFilterChange = (e) => {
        if (e.target.name === 'startDate') {
            setStartDate(e.target.value);
        } else if (e.target.name === 'endDate') {
            setEndDate(e.target.value);
        }
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const filteredOrders = orders.filter(order => {
        const isStatusMatch = selectedFilterStatus === '' || order.status === selectedFilterStatus;
        const isPriceMatch = (minPrice === '' || order.totalAmount >= minPrice) && (maxPrice === '' || order.totalAmount <= maxPrice);
        const orderDate = new Date(order.createdAt);
        const isDateMatch = (startDate === '' || orderDate >= new Date(startDate)) && (endDate === '' || orderDate <= new Date(endDate));
        const isPaymentMethodMatch = paymentMethod === '' || order.paymentMethod === paymentMethod;
        const isPhoneNumberMatch = phoneNumber === '' || order.phone.includes(phoneNumber);

        return isStatusMatch && isPriceMatch && isDateMatch && isPaymentMethodMatch && isPhoneNumberMatch;
    });

    const sortedOrders = filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleOrdersPerPageChange = (e) => {
        setOrdersPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    if (loading) {
        return <div className="text-center">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    if (!isAdmin) {
        return <div className='text-center text-red-600'>Bu sayfaya erişim yetkiniz yok!</div>
    }

    return (
        <div className='container mx-auto border border-gray-100 p-5 px-4'>
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
                        <h1 className='text-lg font-semibold text-gray-800'>Sipariş Yönetimi</h1>
                    </div>
                </div>
                <div className='border w-full border-gray-300 '></div>
            </div>

            <button onClick={toggleFilters} className="mb-4 bg-blue-500 text-sm font-sans text-white py-1.5 px-3 rounded-md">
                {showFilters ? 'Filtreleri Kapat' : 'Filtreleme'}
            </button>

            {showFilters && (
                <div>
                    <div className="mb-4 w-48">
                        <label className="block font-light text-sm mb-2">Durum</label>
                        <select
                            className="w-full p-1 border text-xs py-2 raleway border-gray-300 rounded-md"
                            value={selectedFilterStatus}
                            onChange={handleFilterChange}
                        >
                            <option value="">Tüm Durumlar</option>
                            <option value="pending">Beklemede Olanlar</option>
                            <option value="kargo">Kargoya Verilenler</option>
                            <option value="success">Onaylananlar</option>
                            <option value="iade">İade Edilenler</option>
                            <option value="red">Reddedilenler</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block font-light text-sm mb-2">Fiyat</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                name="minPrice"
                                placeholder="Min Fiyat"
                                value={minPrice}
                                onChange={handlePriceFilterChange}
                                className="w-full p-1 border text-xs py-2 raleway border-gray-300 rounded-md"
                            />
                            <input
                                type="number"
                                name="maxPrice"
                                placeholder="Max Fiyat"
                                value={maxPrice}
                                onChange={handlePriceFilterChange}
                                className="w-full p-1 border text-xs py-2 raleway border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block font-light text-sm mb-2">Tarih</label>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                name="startDate"
                                value={startDate}
                                onChange={handleDateFilterChange}
                                className="w-full p-1 border text-xs py-2 raleway border-gray-300 rounded-md"
                            />
                            <input
                                type="date"
                                name="endDate"
                                value={endDate}
                                onChange={handleDateFilterChange}
                                className="w-full p-1 border text-xs py-2 raleway border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block font-light text-sm mb-2">Ödeme Yöntemi</label>
                        <select
                            className="w-full p-1 border text-xs py-2 raleway border-gray-300 rounded-md"
                            value={paymentMethod}
                            onChange={handlePaymentMethodChange}
                        >
                            <option value="">Tümü</option>
                            <option value="credit_card">Kredi Kartı</option>
                            <option value="bank_transfer">Banka Havalesi</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block font-light text-sm mb-2">Telefon Numarası</label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            placeholder="Telefon Numarası"
                            className="w-full p-1 border text-xs py-2 raleway border-gray-300 rounded-md"
                        />
                    </div>
                </div>
            )}

            <div className="mb-4 ">
                <label className="block font-light text-sm mb-2">Sayfa Başı Sipariş Gösterimi</label>
                <select
                    className=" p-1 border text-xs py-2 raleway border-gray-300 rounded-md"
                    value={ordersPerPage}
                    onChange={handleOrdersPerPageChange}
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <div className="overflow-x-auto border p-3 mt-4 shadow-lg">
                <h1 className='font-sans font-semibold text-2xl my-4 pl-1'>Tüm Sipariş Listesi</h1>
                <table className="w-full bg-gray-100 border shadow-l border-gray-300">
                    <thead>
                        <tr className="text-white font-bold uppercase font-sm rounded-md bg-gray-600 text-xs font-sans">
                            <th className="py-2 px-4 border-b">SİPARİS ID</th>
                            <th className="py-2 px-4 border-b">Kullanıcı</th>
                            <th className="py-2 px-4 border-b">Kullanıcı Ad Soyad</th>
                            <th className="py-2 px-4 border-b text-start">Ürün Bilgisi</th>
                            <th className="py-2 px-4 border-b">Telefon Numarası</th>
                            <th className="py-2 px-4 border-b">Şehir</th>
                            <th className="py-2 px-4 border-b">İlçe</th>
                            <th className="py-2 px-4 border-b text-start ">Teslimat Adresi</th>
                            <th className="py-2 px-4 border-b">Ödeme Yöntemi</th>
                            <th className="py-2 px-4 border-b">Toplam Tutar</th>
                            <th className="py-2 px-4 border-b">Durum</th>
                            <th className="py-2 px-4 border-b">Sipariş Tarihi</th>
                            <th className="py-2 px-4 border-b">Güncelle</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm montserrat py-2'>
                        {currentOrders.length > 0 ? (
                            currentOrders.map(order => (
                                <tr key={order._id} className={`
                                ${order.status === 'pending' ? 'bg-yellow-100' :
                                        order.status === 'kargo' ? 'bg-blue-100' :
                                            order.status === 'success' ? 'bg-emerald-200' :
                                                order.status === 'iade' ? 'bg-yellow-400' :
                                                    order.status === 'red' ? 'bg-red-300' : 'bg-gray-100'} hover:bg-opacity-90 text-xs font-medium raleway cursor-pointer`}>
                                    <td className="py-2 px-4 border-b"> {order._id.slice(5,15)}</td>
                                    <td className="py-2 px-4 border-b">
                                        {order.userId ? 'Üye' : (order.sessionId ? 'Misafir' : 'Bilinmiyor')}
                                    </td>
                                    <td className="py-2 px-4 border-b">{order.name} {order.surname}</td>
                                    <td className="py-2 min-w-48 px-4 border-b">
                                        {order.items && order.items.map((item, index) => (
                                            <div className='flex flex-row' key={index}>
                                                <div className='flex flex-row items-center gap-1'>
                                                    <h1 className='text-xs raleway'>{item.product.name}</h1>
                                                    <h1 className='text-xs font-sans'>({item.quantity})</h1>
                                                </div>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="py-2 px-4 border-b">{order.phone}</td>
                                    <td className="py-2 px-4 border-b">{order.city}</td>
                                    <td className="py-2 px-4 border-b">{order.district}</td>
                                
                                    <td className="py-2 px-4 border-b min-w-48 ">{order.shippingAddress}</td>
                                    <td className={`py-3 px-4 border-b`}>
                                        {order.paymentMethod === 'credit_card' ? 'Kredi Kartı' :
                                            order.paymentMethod === 'bank_transfer' ? 'Banka Havalesi' :
                                                'Bilinmiyor'}
                                    </td>
                                    <td className="py-3 px-4 border-b ">
                                        <span className='p-1 rounded-md font-sans bg-emerald-500 text-white'>{order.totalAmount} ₺</span>
                                    </td>
                                    <td className="py-3 px-4 border-b">
                                        {order.status === 'pending' ? 'Beklemede' :
                                            order.status === 'kargo' ? 'Kargoya Verildi' :
                                                order.status === 'success' ? 'Onaylandı' :
                                                    order.status === 'iade' ? 'İade Edildi' :
                                                        order.status === 'red' ? 'Reddedildi' : 'Bilinmiyor'}
                                    </td>

                                    <td className="py-3 px-4 ">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
                                    <td className=" items-center justify-center py-4 px-4 gap-2 flex ">

                                        {
                                            order.status === '' || order.status === 'kargo' || order.status === 'pending' ? <div>
                                                <button onClick={() => openModal2(order)} className="bg-green-500 text-white py-1 px-3 rounded-md">Onayla</button>
                                            </div> : ''
                                        }

                                        <button onClick={() => openModal(order)} className="bg-blue-500 text-white py-1 px-3 rounded-md">Güncelle</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12" className="text-center raleway text-lg py-6">Listelenecek Sipariş Bulunamadı.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end items-center mt-4">
                <div>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-gray-300 text-gray-700 px-3 py-1 text-sm rounded-md mr-2"
                    >
                        Önceki
                    </button>
                    <span className="text-sm">Sayfa {currentPage} / {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="bg-gray-300 text-gray-700 px-3 py-1 text-sm rounded-md ml-2"
                    >
                        Sonraki
                    </button>
                </div>
            </div>

            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full">
                        <h2 className="text-2xl raleway border-b-2 w-full pb-4 mb-4">Sipariş Güncelle</h2>
                        <form onSubmit={handleUpdateOrder}>
                            <div className="mb-4">
                                <label className="block mb-2">Ad Soyad</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={`${selectedOrder.name} ${selectedOrder.surname}`}
                                    onChange={(e) => setSelectedOrder({ ...selectedOrder, name: e.target.value.split(' ')[0], surname: e.target.value.split(' ')[1] })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Şehir</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={selectedOrder.city}
                                    onChange={(e) => setSelectedOrder({ ...selectedOrder, city: e.target.value })}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Durum</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={selectedOrder.status}
                                    onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value })}
                                >
                                    <option value="pending">Beklemede</option>
                                    <option value="kargo">Kargoya Verildi</option>
                                    <option value="success">Onaylandı</option>
                                    <option value="iade">İade Edildi</option>
                                    <option value="red">Reddedildi</option>
                                </select>
                            </div>
                            <div className="py-3 px-4 flex flex-row items-center justify-start gap-4 border-b">
                                <button type="submit" className="bg-blue-500 text-white py-1 px-3 rounded-md">Güncelle</button>
                                <button type="button" onClick={() => closeModal()} className="bg-red-500 text-white py-1 px-3 rounded-md">İptal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showModal2 && selectedOrder && (
                <OnayContent
                    order={selectedOrder}
                    onSuccess={handleApproveOrder}
                    onClose={closeModal2}
                />
            )}
        </div>
    );
}

export default SiparisYonetimi;