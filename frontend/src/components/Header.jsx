import React, { useState, useEffect, useRef } from 'react';
import { FaBarsStaggered } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { CiShop, CiSearch } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { CiUser } from "react-icons/ci";
import { FaRegHeart } from "react-icons/fa";
import '../App.css';

function Header({ user, setUser, cartItemCount }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const [showModalOdeme, setShowModalOdeme] = useState(false);

  const handleClick = () => {
    window.scrollTo(0,0);
  }

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(decodedToken.isAdmin || false);
      } catch (error) {
        console.error('Token decode error:', error);
        setIsAdmin(false);
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleProfileClick = () => {
    window.scrollTo(0,0);
    if (isAuthenticated) {
      navigate('/profil');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    if (setUser) {
      setUser('');
    }
    navigate('/');
    window.location.reload();
    window.scrollTo(0,0);
  };

  return (
    <header className='fixed w-full border-b border-opacity-50 border-black z-50 bg-opacity-90'>
      <div className='w-full py-5 flex items-center px-6 md:px-8 xl:px-12 backdrop-blur-xl   justify-between border-black'>
        <div className='flex flex-row gap-3 pl-2 items-center justify-center w-auto'>
          <div className='flex items-center gap-4'>
            <div className='cursor-pointer transition-transform hover:scale-110 active:scale-95' onClick={toggleSidebar}>
              <FaBarsStaggered className='text-black transition-colors' size={20} />
            </div>
            <div className='cursor-pointer flex md:hidden transition-transform hover:scale-110 active:scale-95'>
              <CiSearch className='text-black  transition-colors' size={30} />
            </div>
          </div>
          <div className='montserrat uppercase hidden md:flex text-black font-extrabold tracking-wider text-2xl'>
            <Link to='/' onClick={handleClick} className=' transition-colors'>
              <h2>Missé Moris</h2>
            </Link>
          </div>
        </div>

        <div className='montserrat uppercase md:hidden flex text-black font-extrabold tracking-wider text-2xl'>
          <Link  to='/' className='transition-colors'>
            <h2>Missé Moris</h2>
          </Link>
        </div>

        <div className='hidden md:flex items-center justify-center pr-6 gap-4'>
          <div className='flex items-center relative justify-center cursor-pointer'>
            <input
              className='relative bg-transparent border-gray-400 text-left pl-8 bg-opacity-85 border text-sm py-2 font-sans rounded-md w-36 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200'
              type='search'
              placeholder='Ara...'
            />
            <IoIosSearch className='absolute left-1.5 text-black' size={20} />
          </div>

          <div className="flex items-center gap-4">
            <div
              className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
              onClick={handleProfileClick}
              title={isAuthenticated ? "Profil Ayarları" : "Giriş Yap"}
            >
              <CiUser className="text-black transition-colors" size={30} />
            </div>

            {isAuthenticated && (
              <Link
                to={'/favorilerim'}
                className="transition-transform hover:scale-110 active:scale-95"
                title="Favorilerim"
                onClick={handleClick} 
              >
                <FaRegHeart className="text-black hover:text-emerald-600 transition-colors" size={20} />
              </Link>
            )}

            <Link
              to={'/sepetim'}
              className="relative transition-transform hover:scale-110 active:scale-95"
              title="Sepetim"
              onClick={handleClick} 
            >
              <CiShop className="text-black transition-colors" size={25} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className='md:hidden flex-row relative flex items-center gap-4'>
          <div
            className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
            onClick={handleProfileClick}
            title={isAuthenticated ? "Profil" : "Giriş Yap"}
          >
            <CiUser className="text-black hover:text-emerald-600 transition-colors" size={25} />
          </div>

          {isAuthenticated && (
            <Link
              to={'/favorilerim'}
              className="transition-transform hover:scale-110 active:scale-95"
              title="Favorilerim"
              onClick={handleClick} 
            >
              <FaRegHeart className="text-black hover:text-emerald-600 transition-colors" size={20} />
            </Link>
          )}


          <Link
            to={'/sepetim'}
            className="relative transition-transform hover:scale-110 active:scale-95"
            title="Sepetim"
            onClick={handleClick} 
          >
            <CiShop className="text-black hover:text-emerald-600 transition-colors" size={25} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs animate-pulse">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-72 bg-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out shadow-2xl z-50`}
      >
        <div className='flex justify-end p-4'>
          <button
            className='p-2 rounded-full hover:bg-gray-200 transition-all duration-200 text-black text-2xl'
            onClick={toggleSidebar}
          >
            &times;
          </button>
        </div>
        <div className='flex flex-col gap-4 raleway pl-6'>
          <Link to='/' onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
            Anasayfa
          </Link>

          <Link to='/tum_urunler' onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
            Tüm Ürünler
          </Link>

          <Link to='/yeni_gelenler' onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
            Yeni Gelenler
          </Link>

          <Link to='/tercih_edilenler' onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
            Tercih Edilenler
          </Link>

          <Link to='/indirimli_urunler' onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
            İndirimli Ürünler
          </Link>

          <Link to='/hakkimizda' onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
            Hakkımızda
          </Link>

          <Link to='/iletisim' onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
            İletişim
          </Link>

          <Link to='/sss' onClick={handleClick}  className='text-sm text-black md:text-lg hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
            S.S.S
          </Link>

          {isAdmin && (
            <div className='flex flex-col gap-4 border-t border-gray-200 pt-4 mt-2'>
              <Link to='/kullanici_yonetimi' onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
                Kullanıcı Yönetimi
              </Link>

              <Link to='/urun_yonetimi' onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
                Ürün Yönetimi
              </Link>

              <Link to='/siparis_yonetimi' onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
                Sipariş Yönetimi
              </Link>

              <Link onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
                <span onClick={() => setShowModalOdeme(!showModalOdeme)} className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
                  <h1>Ödeme Yönetimi</h1>
                </span>

                {showModalOdeme && (
                  <span className='flex flex-col items-start pl-4 justify-center gap-1.5 mt-3'>
                    <Link to={'/havale_yonetimi'} onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
                     - Havale Yönetimi
                    </Link>

                    <Link to={'/kredi_yonetimi'} onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
                     - Kredi Yönetimi
                    </Link>
                  </span>
                )}

              </Link>

              <Link to='/kargo_yonetimi' onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
                Kargo Yönetimi
              </Link>


              <Link to='/panel_yonetimi' onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
                Panel Yönetimi
              </Link>


              <Link to='/rapor_yonetimi' onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
                Rapor Yönetimi
              </Link>


              <Link to='/aboneler' onClick={handleClick}  className='text-sm md:text-lg text-black hover:text-emerald-600 hover:translate-x-2 transition-all duration-200'>
                Abone Üyeler
              </Link>


              <button
                onClick={handleLogout}
                className='text-sm md:text-lg text-red-500 hover:text-red-600 hover:translate-x-2 transition-all duration-200 text-left mt-4'
              >
                Çıkış Yap
              </button>
            </div>

          )}

        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm ${isSidebarOpen ? 'block' : 'hidden'
          } z-40`}
        onClick={toggleSidebar}
      ></div>
    </header>
  );
}

export default Header;