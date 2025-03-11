import React from 'react'
import Header from '../components/Header'
import HakkımızdaContent from '../components/HakkimizdaContent'
import Footer from '../components/Footer'

function HakkımızdaPage() {
  return (
    <>
      <div className='flex flex-col'>
        <Header />
        <HakkımızdaContent />
        <Footer />
      </div>
    </>
  )
}

export default HakkımızdaPage