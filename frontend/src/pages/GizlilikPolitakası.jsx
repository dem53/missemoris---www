import React from 'react'
import Header from '../components/Header'
import GizlilikKosullariContent from '../components/GizlilikKosullariContent'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

function GizlilikPolitakasiPage() {
  return (
    <>
      <div className='flex flex-col'>
        <Header />
        <div className='flex flex-row  items-center montserrat gap-2 mb-4'>
          <div className='text-gray-400'>
            <Link to='/'>
              Anasayfa
            </Link>
          </div>
          <div>
            <h1 className='text-gray-400'>/</h1>
          </div>
          <div className='py-4'>
            <h1 className='text-lg font-semibold text-gray-800'>Güvenlik ve Gizlilik Politikası </h1>
          </div>
        </div>
        <GizlilikKosullariContent />
        <Footer />
      </div>
    </>
  )
}

export default GizlilikPolitakasiPage