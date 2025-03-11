import React from 'react'
import '../App.css'
import { Link } from 'react-router-dom';
import { FaInstagram } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import Ödeme1 from '../images/ödeme-bg-1.webp';
import Ödeme2 from '../images/ödeme-bg-2.webp';
import Ödeme3 from '../images/ödeme-bg-3.webp';

function Footer() {

    const handleClick = () => {
        window.scrollTo(0, 0);
    }

    return (

        <footer className='py-2 pt-12 w-full border border-gray-100 flex flex-col items-center justify-center  bg-gray-200'>
            <div className='container mx-auto bg-gray-200 flex flex-col items-center'>
                <div className='flex flex-col lg:flex-row w-full mt-10 items-start justify-center pl-6 lg:pl-0 gap-6 lg:gap-20'>

                    <div className='flex flex-col items-start justify-center gap-4'>
                        <h2 className='montserrat font-bold'>En Sevilenler</h2>
                        <Link onClick={handleClick} className='font-extralight' to="/">
                            Anasayfa
                        </Link>
                        <Link onClick={handleClick}  className='font-extralight' to="/tum_urunler">
                            Tüm Ürünler
                        </Link>

                        <Link  onClick={handleClick}  className='font-extralight' to="/yeni_gelenler">
                            Yeni Gelenler
                        </Link>

                        <Link onClick={handleClick}  className='font-extralight' to="/tercih_edilenler">
                            Çok Tercih Edilenler
                        </Link>

                        <Link onClick={handleClick}  className='font-extralight' to="/indirimli_urunler">
                            İndirimli Ürünler
                        </Link>

                    </div>


                    <div className='flex flex-col items-start justify-center gap-4'>
                        <h2 className='montserrat font-bold'>Kurumsal</h2>
                        <Link onClick={handleClick}  className='font-extralight' to="/hakkimizda">
                            Hakkımızda
                        </Link>
                        <Link onClick={handleClick}  className='font-extralight' to="/siparis_kosullari">
                            Teslimat ve Sipariş Koşulları
                        </Link>
                        <Link onClick={handleClick}  className='font-extralight' to="/gizlilik_politikasi">
                            Güvenlik ve Gizlilik Politikası
                        </Link>
                        <Link onClick={handleClick}  className='font-extralight' to="/iade_kosullari">
                            İptal ve İade Koşulları
                        </Link>

                    </div>


                    <div className='flex flex-col items-start justify-center gap-4'>
                        <h2 className='montserrat font-bold'>Müşteri Hizmetleri</h2>
                        <Link onClick={handleClick}  className='font-extralight' to="/sss">
                            Sıkça Sorulan Sorular
                        </Link>

                        <Link onClick={handleClick}  className='font-extralight' to="/iletisim">
                            İletişim
                        </Link>

                    </div>


                    <div className='flex flex-col items-start justify-center gap-8'>
                        <div className='flex flex-col items-start justify-center gap-3'>
                            <h2 className='montserrat font-bold'>Sosyal Medya</h2>
                            <div className='flex flex-row items-center justify-center gap-3'>
                                <FaInstagram className='cursor-pointer' size={20} />
                                <BiLogoGmail className='cursor-pointer' size={20} />
                            </div>
                        </div>


                        <div className='flex flex-col items-start justify-center gap-4'>
                            <h2 className='montserrat font-bold'>Ödeme Yöntemleri</h2>
                            <div className='flex flex-row items-center justify-center gap-3'>
                                <img className='rounded-xl w-10' alt='ödeme-1-img' src={Ödeme1} />
                                <img className='rounded-xl w-10' alt='ödeme-2-img' src={Ödeme2} />
                                <img className='rounded-xl w-10' alt='ödeme-3-img' src={Ödeme3} />
                            </div>

                        </div>

                    </div>

                </div>


                <div className='w-full md:w-3/4 border mt-16 my-6 border-gray-300'>

                </div>

                <div>
                    <Link onClick={handleClick}  className='font-extralight text-xs font-sans underline underl' to="/gizlilik_politikasi">
                        Güvenlik ve Gizlilik Politikası
                    </Link>
                </div>


                <div  className='font-sans montserrat uppercase mt-8 flex text-black font-extrabold tracking-wider text-3xl md:text-4xl xl:text-5xl'>
                    <Link to='/'>
                        <h2>Missé Moris</h2>
                    </Link>
                </div>


                <div className='flex items-center font-sans text-xs mt-16 justify-center'>
                    <h1>© 2025 Missé Moris - TÜM HAKLARI SAKLIDIR.</h1>
                </div>
            </div>
        </footer>
    )
}

export default Footer