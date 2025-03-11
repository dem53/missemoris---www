import React, { useState } from 'react'
import Header from '../components/Header'
import Main from '../components/Main'
import Footer from '../components/Footer'

function AnasayfaPage() {

  const [user, setUser] = useState(null);
  return (
    <>
      <Header user={user} setUser={setUser} />
      <Main />
      <Footer />
    </>
  );
}

export default AnasayfaPage;
