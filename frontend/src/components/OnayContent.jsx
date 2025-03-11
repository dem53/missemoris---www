import React from 'react';

const OnayContent = ({ order, onSuccess, onClose }) => {
    
    const handleApprove = () => {
        onSuccess(order._id);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full">
                <div className='flex items-start flex-col justify-center gap-2'>
                    <h2 className="text-2xl raleway border-b-2 w-full pb-4 mb-4">Siparişi Onayla</h2>
                    <p className='font-sans flex items-center text-lg my-1 font-bold gap-2'>Sipariş Ad Soyad: {order.name} {order.surname}</p>
                    <p className='font-sans font-bold flex my-1 items-center text-base gap-2'>Ürün Bilgisi:
                        {order.items && order.items.map((item, index) => (
                            <div className='flex font-bold text-base flex-row' key={index}>
                                <div className='flex flex-row items-center gap-1'>
                                    <h1 className='text-sm font-sans'>{item.product.name}</h1>
                                    <h1 className='text-sm font-sans'>({item.quantity})</h1>
                                </div>
                            </div>
                        ))}
                    </p>
                    <p className='font-sans flex items-center my-1 text-base font-semibold gap-2'>Ödeme Yöntemi: {order.paymentMethod === 'bank_transfer' ? 'Banka Havalesi' : 'credit_card' ? 'Kredi Kartı' : ''} </p>
                    <p className='font-sans flex items-center text-xl my-1 font-bold gap-2'>Toplam Tutar: {order.totalAmount} ₺</p>   
                    <p className='font-sans flex items-center text-base text-red-600 my-1 raleway gap-2'>Not : Belirtilen sipariş onaylandığı takdirde, siparişte bulunan ürünlerin stok durumu düşecektir.</p>   
                </div>
                <div className="py-3 px-4 flex flex-row items-center justify-center my-6 gap-4 border-b">
                    <button onClick={handleApprove} className="bg-green-500 text-white py-2 px-3 rounded-md">Onayla</button>
                    <button onClick={onClose} className="bg-red-500 text-white py-2 px-3 rounded-md">İptal</button>
                </div>
            </div>
        </div>
    );
};

export default OnayContent;