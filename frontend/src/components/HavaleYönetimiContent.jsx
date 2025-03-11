import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import ConfirmBox from './ConfirmBox';
import Havaleİmg from '../images/banka-havalesi.png'

const HavaleYonetimContent = () => {
    const navigate = useNavigate();
    const [havaleler, setHavaleler] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedHavaleId, setSelectedHavaleId] = useState(null);
    const [selectedHavale, setSelectedHavale] = useState(null);
    const [status, setStatus] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    useEffect(() => {
        const checkAdminAndFetchPosts = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
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
                const response = await axios.get('http://localhost:5000/api/odeme/havaleler', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const sortedHavaleler = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setHavaleler(sortedHavaleler);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setError(error.response?.data?.message || 'Bir hata oluştu');
                setLoading(false);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        checkAdminAndFetchPosts();
    }, [navigate]);

    const openModal = (id) => {
        setSelectedHavaleId(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedHavaleId(null);
    };

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
        setSelectedHavale(null);
        setStatus('');
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.delete(`http://localhost:5000/api/odeme/havale/${selectedHavaleId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setHavaleler(havaleler.filter(havale => havale._id !== selectedHavaleId));
            closeModal();
        } catch (error) {
            console.error('Havale silinirken hata:', error);
            setError('Havale silinirken bir hata oluştu.');
        }
    };

    const openUpdateModal = (id) => {
        const havale = havaleler.find(h => h._id === id);
        if (havale) {
            setSelectedHavale(havale);
            setStatus(havale.status);
            setSelectedHavaleId(id);
            setShowUpdateModal(true);
        }
    };

    const handleUpdate = async (e) => {

        e.preventDefault();

        const token = localStorage.getItem('authToken');
        try {
            await axios.patch(`http://localhost:5000/api/odeme/havale/${selectedHavaleId}`, {
                ...selectedHavale,
                status: status
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setHavaleler(havaleler.map(havale =>
                havale._id === selectedHavaleId ? { ...havale, status } : havale
            ));
            closeUpdateModal();
        } catch (error) {
            console.error('Havale güncellenirken hata:', error);
            setError('Havale güncellenirken bir hata oluştu.');
        }
    };

    if (loading) {
        return <div className="text-center">Yükleniyor...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    if (!isAdmin) return <div className="text-center p-4">Bu sayfaya erişim yetkiniz yok!</div>;

    return (
        <div className="container mx-auto p-5">
            <div className='flex flex-row mt-20 items-center montserrat gap-2'>
                <div className='text-gray-400'>
                    <Link to='/'>
                        Anasayfa
                    </Link>
                </div>
                <div>
                    <h1 className='text-gray-400'>/</h1>
                </div>
                <div className='py-4'>
    
                    <h1 className='text-lg font-semibold text-gray-800'>Havale Ödeme Yönetimi</h1>
                </div>
            </div>
            <div className='border w-full border-gray-300 '></div>
            <h1 className="text-2xl mt-6 font-semibold mb-4">Gelen Havale Ödemeleri</h1>
            <div className="border w-full flex flex-row flex-wrap items-start gap-6 p-5 mt-4 shadow-lg">
                <div className='overflow-x-auto rounded-md w-full'>
                    <div className='flex justify-between p-2 bg-gradient-to-r from-emerald-500 to-emerald-800 w-full text-white'>
                        <div className='flex flex-row items-center justify-center gap-2'>
                        <img src={Havaleİmg} alt='banka-havalesi-img' className='w-24 h-12 object-cover'></img>
                        <h1 className='text-lg font-bold font-sans raleway pl-1 py-2'>Havale/Fast Ödemeleri</h1>
                        </div>
        
                    </div>

                    <table className="w-full bg-gray-100 border shadow-md border-gray-300">
                        <thead>
                            <tr className="text-white font-bold uppercase bg-gray-700 text-xs">
                                <th className="py-2 px-4 border-b">Sipariş ID</th>
                                <th className="py-2 px-4 border-b">Gönderen AD SOYAD</th>
                                <th className="py-2 px-4 border-b">Banka Adı</th>
                                <th className="py-2 px-4 border-b">IBAN Numarası</th>
                                <th className="py-2 px-4 border-b">Referans No</th>
                                <th className="py-2 px-4 border-b">Ödeme Tutarı</th>
                                <th className="py-2 px-4 border-b">Durum</th>
                                <th className="py-2 px-4 border-b">Tarih</th>
                                <th className="py-2 px-4 border-b">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className='text-sm'>
                            {havaleler && havaleler.length > 0 ? (
                                havaleler.map(havale => (
                                    <tr key={havale._id} className={`cursor-pointer ${havale.status === 'pending' ? 'bg-yellow-100' : havale.status === 'success' ? 'bg-emerald-100' : havale.status === 'red' ? 'bg-red-400' : 'bg-gray-300'} hover:opacity-90 text-center`}>
                                        <td className="py-2 px-4 border-b">{havale.orderId ? havale.orderId._id.slice(5, 15) : 'Bilinmiyor'}</td>
                                        <td className="py-2 px-4 border-b">{havale.firstName} {havale.lastName}</td>
                                        <td className="py-2 px-4 border-b">{havale.bankName}</td>
                                        <td className="py-2 px-4 border-b">TR {havale.accountNumber}</td>
                                        <td className="py-2 px-4 border-b">{havale.transactionReference || '-'}</td>
                                        <td className="py-2 px-4 border-b">{havale.amount} ₺</td>
                                        <td className="py-2 px-4 border-b raleway text-xs">
                                            <span className={`py-1 px-2 rounded-md ${havale.status === 'pending' ? 'bg-yellow-500 text-white' : havale.status === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                {havale.status === 'pending' ? 'Beklemede' : havale.status === 'success' ? 'Onaylandı' : 'Reddedildi'}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border-b">{new Date(havale.createdAt).toLocaleDateString('tr-TR')}</td>
                                        <td className="py-2 px-4 flex items-center justify-center border-b space-x-2">
                                            <button onClick={() => openUpdateModal(havale._id)} className="bg-blue-500 text-white py-1 px-2 rounded-md flex items-center">
                                                <FaEdit className="mr-2" /> Güncelle
                                            </button>
                                            <button onClick={() => openModal(havale._id)} className="bg-red-500 text-white py-1 px-2 rounded-md flex items-center">
                                                <FaTrash className="mr-2" /> Sil
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="text-center py-6">Listelenecek Havale Bulunamadı.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <ConfirmBox
                    message="Seçilen Havaleyi silmek istiyor musunuz?"
                    onConfirm={handleDelete}
                    isOpen={showModal}
                    onClose={closeModal}
                />
            )}

            {showUpdateModal && selectedHavale && (
                <div className="fixed inset-0 flex items-center bg-gray-700 bg-opacity-50 justify-center z-50">
                    <div className="bg-white p-10 w-80 rounded shadow-lg ">
                        <h2 className="text-xl font-semibold mb-8">Havale Güncelle</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block mb-1">Banka Adı</label>
                                <input
                                    type="text"
                                    value={selectedHavale.bankName}
                                    onChange={(e) => setSelectedHavale({ ...selectedHavale, bankName: e.target.value })}
                                    className="border border-gray-300 p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Hesap Numarası</label>
                                <input
                                    type="text"
                                    value={selectedHavale.accountNumber}
                                    onChange={(e) => setSelectedHavale({ ...selectedHavale, accountNumber: e.target.value })}
                                    className="border border-gray-300 p-2 w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Durum</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="border border-gray-300 p-2 w-full"
                                >
                                    <option value="pending">Beklemede</option>
                                    <option value="success">Onaylandı</option>
                                    <option value="red">Reddedildi</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-center mt-8 mb-4">
                                <button type="submit" className="bg-blue-500 text-white py-1 px-3 rounded-md">Güncelle</button>
                                <button type="button" onClick={closeUpdateModal} className="bg-gray-300 text-black py-1 px-3 rounded-md ml-2">İptal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HavaleYonetimContent;
