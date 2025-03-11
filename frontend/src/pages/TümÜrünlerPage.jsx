import React from 'react'
import Header from '../components/Header';
import UrunContent from '../components/UrunContent';
import Footer from '../components/Footer';

function TümÜrünlerPage() {
  return (

    <>
      <div className='flex flex-col'>
        <Header />
        <UrunContent />
        <div className='mt-32'>
        </div>
      </div>
        <Footer />
    </>
  )
}

export default TümÜrünlerPage