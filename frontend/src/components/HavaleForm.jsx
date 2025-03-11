import React, { useState } from 'react';
import axios from 'axios';

const HavaleForm = ({ orderId, onSuccess }) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [transactionReference, setTransactionReference] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError(null);
        setSuccess(null);

        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = 'anon_' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('sessionId', sessionId);
        }

        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('authToken');

        const havaleData = {
            userId: userId || null,
            sessionId: sessionId || null,
            orderId,
            firstName,
            lastName,
            bankName,
            accountNumber,
            transactionReference,
            amount
        };

        try {
            const response = await axios.post('http://localhost:5000/api/odeme/havale', havaleData, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                }
            });

            console.log(response.data);
            setSuccess(response.data.message);
            setFirstName('');
            setLastName('');
            setBankName('');
            setAccountNumber('');
            setTransactionReference('');
            setAmount('');
            onSuccess();
        } catch (error) {
            console.error('Havale işlemi sırasında hata:', error);
            setError('Havale işlemi sırasında bir hata oluştu.');
        }
    };

    return (
        <div className="p-10 bg-gray-100 w-full rounded-lg">
            <h2 className="text-xl font-semibold montserrat border-b-2 pb-3 mb-8">Havale Ödeme Form</h2>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {success && <div className="text-green-500 mb-2">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-4 w-72">

                <div className='w-full flex items-end justify-center gap-4'>
                    
                    <div className='w-full'>
                    <label className="block text-gray-700 ">Ad *</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            placeholder='Ad'
                            className="border rounded-md p-2 w-full"
                        />
                    </div>

                    <div className='w-full'>
                        <label className="block text-gray-700">Soy Ad *</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            placeholder='Soyad'
                            className="border rounded-md p-2 w-full"
                        />
                    </div>


                </div>


                <div>
                    <label className="block text-gray-700">Banka Adı *</label>
                    <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        required
                        placeholder='Banka Adı'
                        className="border rounded-md p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">IBAN No *</label>
                    <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                        placeholder='Başında TR Olmadan giriniz.'
                        maxLength={24}
                        className="border rounded-md p-2 w-full"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Sipariş Numarası (Opsiyonel)</label>
                    <input
                        type="text"
                        value={transactionReference}
                        onChange={(e) => setTransactionReference(e.target.value)}
                        className="border rounded-md p-2 w-full"
                        placeholder='Sipariş Numarası'
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Ödeme Tutarı *</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        placeholder='Ödeme Tutarı'
                        className="border rounded-md p-2 w-full"
                    />
                </div>
                <div className='my-5'>
                <button type="submit" className="bg-emerald-500 text-white rounded-md p-3 my-4 w-full">Havaleyi Bildir</button>
                </div>

            </form>
        </div>
    );
};

export default HavaleForm;