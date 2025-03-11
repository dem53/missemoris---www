import React from 'react'
import Header from '../components/Header'
import UrunTercihContent from '../components/UrunTercihContent'
import Footer from '../components/Footer'

function CokTercihEdilenlerPage() {
  return (
    <>
     <div className='flex flex-col'>
        <Header />
        <UrunTercihContent />
        <div className='mt-32'>
        </div>
      </div>
        <Footer />
    </>
  )
}

export default CokTercihEdilenlerPage