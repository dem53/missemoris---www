import './App.css';
import { RiWhatsappFill } from "react-icons/ri";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TümÜrünlerPage from './pages/TümÜrünlerPage';
import AnasayfaPage from './pages/Anasayfa';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import KullanıcıYönetimi from './pages/KullanıcıYönetimi';
import UrunYonetimiPage from './pages/ÜrünYönetimi';
import TercihEdilenlerPage from './pages/CokTercihEdilenler';
import İndirimliÜrünlerPage from './pages/İndirimliÜrünler';
import SSSPage from './pages/SSS';
import HakkımızdaPage from './pages/Hakkımızda';
import İletisimPage from './pages/İletişim';
import SiparisYönetimiPage from './pages/SiparisYönetimi';
import SiparisKosullariPage from './pages/SiparisKosullari';
import GizlilikKosullariPage from './pages/GizlilikPolitakası';
import YeniGelenlerPage from './pages/YeniGelenler';
import UrunDetayPage from './pages/UrunDetay';
import SepetimPage from './pages/Sepetim'
import ÖdemePage from './pages/Ödeme';
import HavaleYonetimiPage from './pages/HavaleYönetimi';
import RaporYonetimiPage from './pages/RaporYonetimi';
import ProfilPage from './pages/ProfilPage';
import FavorilerPage from './pages/FavorilerPage';
import SiparisGecmisi from './pages/SiparisGecmisim';
import OdemeGecmisi from './pages/ÖdemeGecmisim';
import ProfilAyarlari from './pages/ProfilAyarlari';
import { FaUser, FaHome, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import KrediYönetimiPage from './pages/KrediYonetimi';
import PanelYonetimiPage from './pages/PanelYonetimi';
import AbonelerPage from './pages/Aboneler';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    try {
      const decoded = jwtDecode(token);
      if (decoded.isAdmin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      setError('Admin verisi yüklenirken bir hata', error);
      console.error(error);
    } finally {
      setError(false);
    }
  })

  const phoneNumber = '+15814282698';
  const message = 'LA PANDİA hoşgeldiniz! Merhaba, size nasıl yardımcı olabilirim?';

  const handleWhatsappClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };


  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<AnasayfaPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/tum_urunler" element={<TümÜrünlerPage />} />
        <Route path="/kullanici_yonetimi" element={<KullanıcıYönetimi />} />
        <Route path="/urun_yonetimi" element={<UrunYonetimiPage />} />
        <Route path='/havale_yonetimi' element={<HavaleYonetimiPage />} />
        <Route path='/kredi_yonetimi' element={<KrediYönetimiPage />} />
        <Route path='/rapor_yonetimi' element={<RaporYonetimiPage />} />
        <Route path='/panel_yonetimi' element={<PanelYonetimiPage />} />
        <Route path="/tercih_edilenler" element={<TercihEdilenlerPage />} />
        <Route path="/indirimli_urunler" element={<İndirimliÜrünlerPage />} />
        <Route path="/sss" element={<SSSPage />} />
        <Route path="/hakkimizda" element={<HakkımızdaPage />} />
        <Route path="/favorilerim" element={<FavorilerPage />} />
        <Route path="/iletisim" element={<İletisimPage />} />
        <Route path="/sepetim" element={<SepetimPage />} />
        <Route path="/siparis_yonetimi" element={<SiparisYönetimiPage />} />
        <Route path="/siparis_kosullari" element={<SiparisKosullariPage />} />
        <Route path="/siparis_gecmisi" element={<SiparisGecmisi />} />
        <Route path="/odeme_gecmisi" element={<OdemeGecmisi />} />
        <Route path="/profil_ayarlari" element={<ProfilAyarlari />} />
        <Route path="/gizlilik_politikasi" element={<GizlilikKosullariPage />} />
        <Route path="/yeni_gelenler" element={<YeniGelenlerPage />} />
        <Route path="/odeme" element={<ÖdemePage />} />
        <Route path="/urun/:id" element={<UrunDetayPage />} />
        <Route path='/aboneler' element={<AbonelerPage />} />
      </Routes>

      <div className='fixed bottom-20 animate-bounce hover:animate-none right-4'>
        <div
          className='p-1 rounded-xl cursor-pointer bg-white text-emerald-500'
          onClick={handleWhatsappClick}
        >
          <RiWhatsappFill className='text-emerald-500' size={40} />
        </div>
      </div>


      {isAuthenticated && (
        <div className='fixed sm:hidden cursor-pointer flex z-20 flex-row items-center gap-8 p-2.5 justify-around pt-3 w-full bg-black/60 backdrop-blur-3xl  bottom-0'>
          <Link to={'/'}>
            <div className='flex flex-col text-white gap-1 text-xs items-center justify-center'>
              <div>
                <h1><FaHome size={20} /></h1>
              </div>
              <div>

                <h1>Anasayfa</h1>

              </div>
            </div>
          </Link>

          <Link to={'/sepetim'}>
            <div className='flex flex-col text-white gap-1 text-xs items-center justify-center'>
              <div>
                <h1><FaShoppingCart size={20} /></h1>
              </div>
              <div>

                <h1>Sepetim</h1>

              </div>
            </div>
          </Link>


          <Link to={'/favorilerim'}>
            <div className='flex flex-col text-white gap-1 text-xs items-center justify-center'>
              <div>
                <h1><FaHeart size={20} /></h1>
              </div>
              <div>

                <h1>Favorilerim</h1>

              </div>
            </div>
          </Link>

          <Link to={'/profil'}>
            <div className='flex flex-col gap-1 text-white text-xs items-center justify-center'>
              <div>
                <h1><FaUser size={20} /></h1>
              </div>

              <h1>Profil</h1>

            </div>
          </Link>
        </div>
      )}


      {isAdmin && (
        <div className='fixed sm:hidden cursor-pointer z-20 flex flex-row items-center gap-8 p-2.5 justify-around pt-3 w-full bg-black/60 backdrop-blur-3xl  bottom-0'>
          <Link to={'/'}>
            <div className='flex flex-col text-white gap-1 text-xs items-center justify-center'>
              <div>
                <h1><FaHome size={20} /></h1>
              </div>
              <div>

                <h1>Anasayfa</h1>

              </div>
            </div>
          </Link>

          <Link to={'/sepetim'}>
            <div className='flex flex-col text-white gap-1 text-xs items-center justify-center'>
              <div>
                <h1><FaShoppingCart size={20} /></h1>
              </div>
              <div>

                <h1>Sepetim</h1>

              </div>
            </div>
          </Link>


          <Link to={'/favorilerim'}>
            <div className='flex flex-col text-white gap-1 text-xs items-center justify-center'>
              <div>
                <h1><FaHeart size={20} /></h1>
              </div>
              <div>

                <h1>Favorilerim</h1>

              </div>
            </div>
          </Link>

          <Link to={'/profil'}>
            <div className='flex flex-col gap-1 text-white text-xs items-center justify-center'>
              <div>
                <h1><FaUser size={20} /></h1>
              </div>

              <h1>Profil</h1>

            </div>
          </Link>
        </div>
      )}




    </Router>
  );
}

export default App;