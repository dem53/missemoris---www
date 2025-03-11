import React from 'react';

const ConfirmBox = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-lg font-semibold mb-4">{message}</h2>
                <div className="flex gap-4 justify-end">
                    <button onClick={onConfirm} className="bg-red-500 px-4 py-2 rounded text-white">Evet</button>
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded mr-2">Vazgeç</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmBox;