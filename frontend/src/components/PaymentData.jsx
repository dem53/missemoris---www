import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Krediİmg from '../images/kredi-karti.svg'

function PaymentData() {
    const [paymentData, setPaymentData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {

        const fetchPaymentData = async () => {
            const token = localStorage.getItem('authToken');
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/payments', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });

                const payments = response.data.payments;

                const sortedPayments = payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                if (payments) {
                    setPaymentData(sortedPayments);
                }
                console.log("KREDİ ÖDEME VERİLERİ ", payments);
                setLoading(false);
            } catch (error) {
                toast.error("Veri alınırken hata ile karşılaşıldı");
                setError("Veri alınırken hata ile karşılaşıldı");
                console.error("Veri alınırken hata ile karşılaşıldı", error);
                setLoading(false);
            }
        };

        fetchPaymentData();
    }, []);

    return (
        <div className='container mx-auto p-5'>
   

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
                    <h1 className='text-lg font-semibold text-gray-800'>Kredi Ödeme Yönetimi</h1>
                </div>
            </div>
            <div className='border w-full border-gray-300'></div>
            <h1 className="text-2xl mt-6 font-semibold mb-4">Gelen Sanal POS Ödemeleri</h1>
            <div className="border w-full flex flex-row flex-wrap items-start gap-6 p-5 mt-4 shadow-lg">
            <div className='overflow-x-auto rounded-md w-full'>
                <div className='flex justify-between p-3 w-full bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-t-md'>
                <div className='flex flex-row items-center justify-center gap-2'>
                        <img src={Krediİmg} alt='banka-havalesi-img' className='w-13 h-12 object-cover'></img>
                        <h1 className='text-lg font-bold font-sans raleway pl-1 py-2'>İyzico Sanal POS Ödemeleri</h1>
                        </div>
                </div>
                <table className='w-full border shadow-md border-gray-300'>
                    <thead>
                        <tr className='bg-gray-700 uppercase text-white text-xs '>
                            <th className='px-4 py-2 border-gray-300 '>Sipariş ID</th>
                            <th className='px-4 py-2 border-gray-300 '>Iyzıco ID</th>
                            <th className='px-4 py-2 border-gray-300'>Ödeme Tutarı</th>
                            <th className='px-4 py-2 border-gray-300 '>Tarih</th>
                            <th className='px-4 py-2 border-gray-300 '>Durum</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm'>
                        {paymentData && paymentData.length > 0 ? (
                            paymentData.map((payment) => (
                                <tr key={payment._id} className={`cursor-pointer text-center transition-all duration-200 ${payment.paymentStatus === 'SUCCESS' ? 'bg-green-100' : payment.paymentStatus === 'PENDING' ? 'bg-blue-100' : payment.paymentStatus === 'FAILED' ? 'bg-red-100' : 'bg-gray-100'}`}>
                                    <td className='border-b py-2'>{payment.conversationId.slice(5, 15)}</td>
                                    <td className='border-b py-2'>{payment.iyzicoPaymentId}</td>
                                    <td className='border-b py-2'>{payment.paidPrice} ₺</td>
                                    <td className='border-b py-2'>{new Date(payment.createdAt).toLocaleDateString('tr-Tr')}</td>
                                    <td className='border-b text-xs raleway py-2'>
                                        <span className={`px-3 py-1 rounded-md ${payment.paymentStatus === 'SUCCESS' ? 'bg-green-500 text-white' : payment.paymentStatus === 'PENDING' ? 'bg-blue-500 text-white' : payment.paymentStatus === 'FAILED' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'}`}>
                                            {payment.paymentStatus === 'SUCCESS' ? 'BAŞARILI' : payment.paymentStatus === 'PENDING' ? 'BEKLEMEDE' : payment.paymentStatus === 'FAILED' ? 'BAŞARISIZ' : 'Bilinmiyor'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className='border py-4 text-center text-gray-500'>Veri bulunamadı.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
                </div>
            </div>
    );
}

export default PaymentData;
