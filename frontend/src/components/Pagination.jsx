import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex justify-center items-center gap-4 mt-6">
            <button 
                onClick={() => handlePageClick(currentPage - 1)} 
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50"
                disabled={currentPage === 1}
            >
                &lt; Önceki
            </button>
            <span className="font-semibold text-gray-700">
                {currentPage} / {totalPages}
            </span>
            <button 
                onClick={() => handlePageClick(currentPage + 1)} 
                className="p-2 bg-gray-200 hover:bg-gray-300  rounded-md disabled:opacity-50"
                disabled={currentPage === totalPages}
            >
                Sonraki &gt;
            </button>
        </div>
    );
};

export default Pagination;
