import React from 'react'
import { Link } from 'react-router-dom'


function PanelYonetimiContent() {


  return (

    

    <div className='container  mx-auto'>

      <div className="flex justify-between items-start gap-4 flex-col mt-20 mb-6">
        <div className='flex flex-row border-b-2 w-full items-center montserrat gap-2'>
          <div className='text-gray-400'>
            <Link to='/'>
              Anasayfa
            </Link>
          </div>
          <div>
            <h1 className='text-gray-400'>/</h1>
          </div>
          <div className='py-4'>
            <h1 className='text-lg font-semibold text-gray-800'>Panel Yönetimi</h1>
          </div>
        </div>

      </div>

    </div>


  )
}

export default PanelYonetimiContent