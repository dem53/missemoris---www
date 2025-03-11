import React, { useState } from 'react';
import Header from '../components/Header';
import Login from '../components/Login';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [, setUser] = useState(null);
  const navigate = useNavigate();

  const handleUserLogin = (userData) => {
    setUser(userData); 
    navigate('/'); 
  };

  return (
    <>
      <Header />
      <Login setUser={handleUserLogin} />
      <Footer />
    </>
  );
}

export default LoginPage;
