import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaHeart, FaHistory, FaCreditCard, FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
import { FaHome } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";

function ProfilContent() {
  const navigate = useNavigate();

  const [name, setName] = useState([]);
  const [surname, setSurname] = useState([]);


  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('authToken');
      if(!token) {
        navigate('/')
        return;
      }
    };

    checkUser();
  }, [navigate])

  const checkUserId = async() => {
    const userName = localStorage.getItem('userName');
    if(!userName){
      console.log('Kullanıcı adı bulunamadı.')
    }
    const userSurname = localStorage.getItem('userSurname');
    if (!userSurname) {
      console.log('Kullanıcı soyadı bulunamadı');
    }
    console.log("ad", userName);
    console.log("Soy ad :", userSurname);
    setName(userName);
    setSurname(userSurname);
  }

  useEffect(() => {
    checkUserId();
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/'); 
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-5">
      <div className="flex items-center gap-3 mb-6">
        <FaUser className="text-3xl text-emerald-600" />
        <h1 className="text-2xl font-semibold">Profilim</h1>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-start flex-col border-b-2 w-full pb-3 gap-3 mb-6 my-6">
          <div className='flex flex-row items-center justify-start gap-2'>
          <FaUserEdit className="text-2xl text-black" />
          <h2 className="text-2xl montserrat">Profil Ayarları</h2>
          </div>

          <div className='my-2'>
            <h1 className='montserrat text-base uppercase'>{name} {surname}</h1>
          </div>
        </div>
        <ul className="space-y-4">
          <li>
            <Link to="/sepetim" className="flex items-center gap-3 p-3 bg-gray-200 rounded hover:bg-gray-300 transition">
              <FaShoppingCart className="text-black" />
              Sepetim
            </Link>
          </li>
          <li>
            <Link to="/favorilerim" className="flex items-center gap-3 p-3 bg-gray-200 rounded hover:bg-gray-300 transition">
              <FaHeart className="text-black" />
              Favorilerim
            </Link>
          </li>
          <li>
            <Link to="/siparis_gecmisi" className="flex items-center gap-3 p-3 bg-gray-200 rounded hover:bg-gray-300 transition">
              <FaHistory className="text-black" />
              Sipariş Geçmişim
            </Link>
          </li>
          <li>
            <Link to="/odeme_gecmisi" className="flex items-center gap-3 p-3 bg-gray-200 rounded hover:bg-gray-300 transition">
              <FaCreditCard className="text-black" />
              Ödeme Geçmişim
            </Link>
          </li>
          <li>
            <Link to="/profil_ayarlari" className="flex items-center gap-3 p-3 bg-gray-200 rounded hover:bg-gray-300 transition">
            <IoSettingsSharp className='text-black' />
              Profili Düzenle
            </Link>
          </li>
          <li>
<div className='flex items-center justify-start gap-4'>

          <button onClick={() => navigate('/')} className="flex items-center gap-3 w-32 p-1.5 justify-center raleway mt-6 bg-gray-800 text-white rounded hover:bg-black transition">
              <FaHome/>
              Anasayfa
            </button>
            <button onClick={handleLogout} className="flex items-center gap-3 w-32 p-1.5 justify-center raleway mt-6 bg-red-500 text-white rounded hover:bg-red-600 transition">
              <FaSignOutAlt />
              Çıkış
            </button>
              
</div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ProfilContent;