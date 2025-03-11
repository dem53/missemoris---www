import React from 'react'
import { Link } from 'react-router-dom'

function İletisimContent() {
    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='mt-16 flex flex-col border-b-2 justify-between items-start'>
                <div className='flex flex-row items-center montserrat gap-2 mb-4'>
                    <div className='text-gray-400'>
                        <Link to='/'>
                            Anasayfa
                        </Link>
                    </div>
                    <div>
                        <h1 className='text-gray-400'>/</h1>
                    </div>
                    <div className='py-4'>
                        <h1 className='text-lg font-semibold text-gray-800'>İletişim</h1>
                    </div>
                </div>
                <div className='flex flex-row items-center justify-center gap-2'>
                    <div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default İletisimContent