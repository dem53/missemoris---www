import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SiparisKosullariContent from '../components/SiparisKosullariContent'


function SiparisKosullari() {
  return (
    <>
      <div className='flex flex-col'>
        <Header />
        <SiparisKosullariContent />
        <Footer />
      </div>
    </>
  )
}

export default SiparisKosullari