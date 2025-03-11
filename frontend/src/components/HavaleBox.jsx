import React from 'react'

function HavaleBox({ tittle, bankName, names, ıban, hesapNo, subeNo }) {
    return (
        <div>
            <div className='flex flex-col items-start justify-center gap-2 text-base p-5 w-full rounded-md border border-black'>
                <p className='font-sans font-semibold w-full border-b-2 pb-2 mb-2'>Havale Yapılacak Hesap Bilgisi</p>
                <p className='font-medium font-sans w-full  text-sm mt-1 pb-2 mb-6'> - {tittle}.</p>
                <p className='flex w-full items-center gap-2'><span className='font-sans font-extrabold'>Banka Adı: </span>{bankName}</p>
                <p className='flex w-full items-center gap-2'><span className='font-sans font-extrabold'>ALICI UNVANI: </span>{names}</p>
                <p className='flex w-full items-center gap-2'><span className='font-sans font-extrabold'>IBAN NO: </span>{ıban}</p>
                <p className='flex w-full items-center gap-2'><span className='font-sans font-extrabold'>HESAP NO::</span>{hesapNo}</p>
                <p className='flex w-full items-center gap-2'><span className='font-sans font-extrabold'>ŞUBE KODU: </span>{subeNo}</p>
            </div>
        </div>
    )
}

export default HavaleBox