import React from 'react'
import Header from '../components/Header'
import UrunİndirimContent from '../components/UrunİndirimContent'
import Footer from '../components/Footer'

function İndirimliÜrünlerPage() {
  return (
    <>
       <div className='flex flex-col'>
        <Header />
        <UrunİndirimContent />
        <div className='mt-32'>
        </div>
      </div>
        <Footer />
    </>
  )
}

export default İndirimliÜrünlerPage