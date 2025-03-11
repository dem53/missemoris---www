import React from 'react'
import Header from '../components/Header'
import PanelYonetimiContent from '../components/PanelYonetimiContent'

function PanelYonetimi() {
  return (
    <>
      <div className='flex flex-col gap-10'>
        <Header />
        <PanelYonetimiContent />
      </div>

    </>
  )
}

export default PanelYonetimi