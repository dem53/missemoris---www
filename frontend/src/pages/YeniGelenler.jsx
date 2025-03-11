import React from 'react'
import Header from '../components/Header'
import UrunYeniGelenContent from '../components/UrunYeniGelenContent'
import Footer from '../components/Footer'

function YeniGelenler() {
  return (
    <>
      <div className='flex flex-col'>
        <Header />
        <UrunYeniGelenContent />
        <div className='mt-32'>
        </div>
      </div>
      <Footer />

    </>
  )
}

export default YeniGelenler