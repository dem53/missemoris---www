import React from 'react'
import Header from '../components/Header'
import AbonelerContent from '../components/AbonelerContent'

function AbonelerPage() {
  return (
    <>
        <div className='flex flex-col gap-7'>
            <Header />
            <AbonelerContent />
        </div>
    </>
  )
}

export default AbonelerPage