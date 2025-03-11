import React, { useState, useEffect } from 'react';
import '../App.css'
import Banner3 from '../images/mm-2.png';
import Banner1 from '../images/mm-1.jpg';
import Banner4 from '../images/mm-3.jpg';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPeopleCarryBox } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { MdCreditScore } from "react-icons/md";
import { ImSpinner11 } from "react-icons/im";
import { AiOutlineCheck } from "react-icons/ai";

function Main() {

    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentBanner, setCurrentBanner] = useState(0);

    const [name, setName] = useState('');
    const [lastname, setlastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [tercihEdilen, setTercihEdilen] = useState([]);

    const [successModal, setSuccessModal] = useState(false);


    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0,0);
        })

    }, [])


    const banners = [
        {
            image: Banner4,
            title: "TÜM ALIŞVERİŞLERDE GEÇERLİ",
            subtitle: "SEPETTE",
            highlight: "%20 İNDİRİM!",
            link: "/tum_urunler",
            buttonText: "Alışverişe Başla!",
            brand: "Missé Moris."
        },
        {
            image: Banner3,
            title: "YENİ SEZON",
            subtitle: "KOLEKSİYONU",
            highlight: "YENİ ÜRÜNLER",
            link: "/tum_urunler",
            buttonText: "Keşfet",
            brand: "Missé Moris."
        },
        {
            image: Banner1,
            title: "EN ÇOK",
            subtitle: "TERCİH EDİLEN",
            highlight: "ÖZEL FİYATLAR",
            link: "/tum_urunler",
            buttonText: "İncele",
            brand: "Missé Moris."
        }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/getPosts');
                const productData = response.data.posts;
                setProductData(productData);
                console.log("ÜRÜNLER ", productData);

                const tercihEdilen = productData.filter((product) => product.tags.includes('Tercih Edilen'));
                console.log("TERCİH EDİLEN SAYISI", tercihEdilen);
                setTercihEdilen(tercihEdilen);

            } catch (error) {
                setError('Veri alınırken hata', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleClick = () => {
        window.scrollTo(0, 0);
    }


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const changeBanner = (index) => {
        setCurrentBanner(index);
    };

    const formatTurkishLira = (price) => {
        return price.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        });
    };


    const handleSubmit = async (e) => {
        console.log("-------ABONE EKLENİYOR -- -- -- - -")
        window.scrollTo(0, 0);
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/abone/add', {
                name,
                lastname,
                phone,
                email,
                createdDate: new Date()
            });
            console.log("RESPONSE", response);
            setName('');
            setlastName('');
            setPhone('');
            setEmail('');
            setSuccessModal(true);
            console.log("GÖNDERİLEN ABONE", response.data);
            
        } catch (error) {
            setError('Veri eklenirken bir hata ile karşılaşıldı', error);
            console.error(error);
        }

    }



    return (
        <div className="h-full w-full">
            <div className="w-full flex flex-col justify-between items-center">
                {/* Banner Slider */}
                <div className="relative w-full h-screen overflow-hidden">
                    {banners.map((banner, index) => (
                        <div
                            key={index}
                            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <img
                                className="object-cover h-full w-full transition-all duration-1000 ease-in-out hover:scale-105"
                                src={banner.image}
                                alt={`banner-${index + 1}`}
                            />
                            <div className="absolute top-0 left-0 w-full h-full flex items-center flex-col justify-center">
                                <div className='p-3 flex flex-col items-center justify-center'>
                                    <div className="flex flex-col items-center justify-center text-center text-white bg-opacity-30 p-8 rounded-md space-y-4 animate__animated animate__fadeInUp">
                                        <h1 className="text-4xl backdrop-blur-sm md:text-5xl xl:text-6xl font-extralight text-shadow-lg">
                                            {banner.title}
                                        </h1>
                                        <h2 className="text-4xl backdrop-blur-sm md:text-6xl font-semibold tracking-wide text-shadow-lg">
                                            {banner.subtitle}
                                        </h2>
                                        <h3 className="text-4xl backdrop-blur-sm md:text-7xl bg-white text-black p-2 montserrat bg-transparent font-semibold text-shadow-lg">
                                            {banner.highlight}
                                        </h3>
                                    </div>
                                    <div className='mt-5'>
                                        <Link to={banner.link} className='w-48 p-3 px-5 py-3 duration-300 ease-in-out text-white border-4 border-white font-bold text-lg hover:bg-white hover:text-black transition-all'>
                                            {banner.buttonText}
                                        </Link>
                                    </div>
                                    <div className='mt-16'>
                                        <h1 className='text-sm raleway text-white text-shadow-lg'>{banner.brand}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Slider Dots */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => changeBanner(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-1000 ${index === currentBanner ? 'bg-white scale-125' : 'bg-white/50'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {successModal && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
                        <div className='flex flex-col w-2/3 relative items-center rounded-md  p-5'>

                            <div className='p-5 rounded-lg flex text-center raleway flex-col items-center gap-4 bg-white text-black '>
                                <div className='flex items-center justify-center gap-2'>
                                    <AiOutlineCheck className='text-emerald-500' size={25} />
                                    <h1 className='my-2'>Abonelik Talebiniz Alınmıştır. Teşekkür Eder, iyi alışverişler dileriz.</h1>
                                </div>
                                <div >
                                    <button className='p-1.5 text-xs montserrat bg-red-600 text-white rounded-md' onClick={() => setSuccessModal(false)} type='button'>Kapat</button>
                                </div>
                            </div>

                        </div>

                    </div>
                )
                }

                {/* ÜRÜN GÖSTERİMİ */}
                <div className="relative w-full container mx-auto my-10 mt-20 overflow-hidden">
                    <div className="flex items-center flex-wrap gap-6 my-4 mb-16 justify-between px-1">
                        <div>
                            <h1 className="montserrat text-gray-600 text-xl md:text-2xl tracking-wider">
                                Yenilikler: Dünyanın en iyi markalarından ve butiklerinden günlük olarak özenle seçilmiş
                            </h1>
                        </div>

                        <div>
                            <Link to={'/tum_urunler'}>
                                <h1 className="font-bold font-sans p-3 rounded-xl hover:bg-black hover:text-white duration-300 ease-in-out transition-transform border-2 border-black text-black">
                                    Alışverişe Başla
                                </h1>
                            </Link>
                        </div>
                    </div>

                    <div className="p-2">

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto gap-4 md:gap-6 xl:gap-8 pr-2 w-full items-start cursor-pointer  justify-center">
                            {loading ? (
                                <div className="w-full flex justify-center items-start h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                                </div>
                            ) : productData && productData.length > 0 ? (
                                productData.slice(3, 11).map((product, index) => (
                                    <div className='flex  items-center flex-grow w-auto xl:w-72  justify-center'>
                                        <div
                                            key={index}
                                            className=" rounded-lg bg-white flex flex-col items-start justify-between transition-transform transform hover:shadow-xl duration-300 ease-in-out"
                                        >
                                            <div className="relative object-cover overflow-hidden ">
                                                <Link
                                                    to={`/urun/${product._id}`}
                                                    key={product._id}
                                                    onClick={handleClick}
                                                    className="relative group w-full "
                                                >
                                                    {product.imageUrls && product.imageUrls.length > 0 ? (
                                                        <div className="relative w-full h-full">
                                                            <img
                                                                src={`http://localhost:5000${product.imageUrls[0]}`}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover transition-all duration-500 ease-in-out transform "
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = '/placeholder.jpg';
                                                                }}
                                                            />
                                                            {product.imageUrls[1] && (
                                                                <img
                                                                    src={`http://localhost:5000${product.imageUrls[1]}`}
                                                                    alt="Second Image"
                                                                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = '/placeholder.jpg';
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src="/placeholder.jpg"
                                                            alt="Placeholder"
                                                            className="w-full h-full object-center"
                                                        />
                                                    )}
                                                </Link>
                                            </div>
                                            <div className="flex flex-col p-4 gap-2">
                                                <h2 className="text-xs md:text-sm raleway tracking-wider text-gray-800">{product.brand} {product.name}</h2>
                                                <p style={{
                                                    fontSize: '10px'
                                                }} className=" md:text-sm text-gray-500">{product.description}</p>
                                                <span className='flex flex-col items-start justify-center gap-1'>
                                                    <span className="text-xs text-gray-800 text-opacity-55 font-extrabold line-through  ">
                                                        {formatTurkishLira((product.price / 6) + (product.price))}
                                                    </span>
                                                    <span className="text-sm font-extrabold text-shadow shadow-white shadow-lg text-emerald-500">
                                                        {formatTurkishLira(product.price)}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                    </div>

                                ))
                            ) : (
                                <div className="w-full text-center py-4 text-gray-500">Listelenecek Ürün Bulunamadı.</div>
                            )}
                        </div>
                        <div className='flex items-center mt-24 justify-center w-full'>
                            <Link to={'/tum_urunler'} onClick={handleClick} >
                                <h1 className='border border-black p-3 rounded-sm bg-white raleway text-black hover:text-white hover:bg-black duration-300 transition-all ease-in-out'>TÜM ÜRÜNLERİ GÖSTER</h1>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Banner 2 */}
                <div className="relative hidden w-full my-16 backdrop-blur-3xl h-screen overflow-hidden">
                    <div className='bg-red-700 w-full  h-full flex items-center justify-center'>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center o-transparent">
                            <div className="flex flex-col items-center justify-center text-center text-white bg-opacity-70 p-8 rounded-md space-y-4 animate__animated animate__fadeInUp">
                                <h1 className="text-3xl md:text-5xl xl:text-6xl raleway font-bold">SEZON SONU</h1>
                                <h2 className="text-3xl md:text-5xl xl:text-6xl raleway font-semibold">İNDİRİMLERİ BAŞLADI!</h2>
                                <Link to='/indirimli_urunler' className='w-48 p-3 px-5 py-3 hover:text-black duration-300 ease-in-out text-white border-4  border-white font-bold text-lg hover:bg-white transition-all'>
                                    İndirimleri İncele
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='w-full h-[10rem] lg:h-[20rem] bg-gray-300/80 my-12 flex items-center justify-center '>
                    <div className='h-full flex items-center justify-center scroll-wrapper w-full'>

                        <div className='font-semibold text-3xl md:text-5xl xl:text-7xl  gap-6 tracking-widest text-black uppercase scroll-text'>
                            <span> MİSSE MORİS - simple, stylish and useful global products -  Pamper yourself you are worth it.</span>
                            <span> MİSSE MORİS - simple, stylish and useful global products -  Pamper yourself you are worth it.</span>
                            <span> MİSSE MORİS - simple, stylish and useful global products -  pamper yourself you are worth it.</span>
                            <span> MİSSE MORİS - simple, stylish and useful global products -  pamper yourself you are worth it.</span>
                            <span> MİSSE MORİS - simple, stylish and useful global products -  pamper yourself you are worth it.</span>
                            <span> MİSSE MORİS - simple, stylish and useful global products - pamper yourself you are worth it.</span>
                            <span> MİSSE MORİS - simple, stylish and useful global products - pamper yourself you are worth it.</span>
                            <span> MİSSE MORİS - simple, stylish and useful global products -  pamper yourself you are worth it.</span>
                            <span> MİSSE MORİS - simple, stylish and useful global products - pamper yourself you are worth it.</span>
                            <span> MİSSE MORİS - simple, stylish and useful global products -  pamper yourself you are worth it.</span>
                            <span> MİSSE MORİS - simple, stylish and useful global products -  pamper yourself you are worth it.</span>
                        </div>

                    </div>
                </div>



                <div className='container mx-auto mb-6'>
                    {/* FOUR INFO */}
                    <div className='w-full flex mb-4 py-6 items-center justify-center gap-4'>
                        <div className='flex flex-row p-10 flex-wrap items-start justify-center'>


                            <div className='flex flex-col flex-grow h-40  gap-4  w-96  items-center justify-center p-5 py-4'>
                                <div className='flex flex-col border w-full rounded-md p-3 shadow-xl items-center justify-center gap-4'>
                                    <div>
                                        <FaPeopleCarryBox size={25} />
                                    </div>

                                    <div>
                                        <h1 className='font-light text-center uppercase text-sm'>Tüm Türkiye'ye ücretsiz teslimat</h1>
                                    </div>

                                    <div>
                                        <h1 className='font-light text-center uppercase text-xs'>1-5 iş gününde kapınıza kadar teslim.</h1>
                                    </div>
                                </div>
                            </div>


                            <div className='flex flex-col flex-grow h-40 gap-4 w-96 items-center justify-center p-5 py-4'>
                                <div className='flex flex-col border w-full rounded-md p-3 shadow-xl items-center justify-center gap-4'>
                                    <div>
                                        <ImSpinner11 className='rotate-180' size={25} />
                                    </div>

                                    <div>
                                        <h1 className='font-light uppercase text-center text-sm'>Kolay iade imkanı</h1>
                                    </div>

                                    <div>
                                        <h1 className='font-light uppercase text-center text-xs'>14 gün içersinde kullanmadığınız ürünü kolayca iade edebilirsiniz.</h1>
                                    </div>
                                </div>
                            </div>


                            <div className='flex flex-col gap-4 flex-grow h-40 w-96 items-center justify-center p-5 py-4'>
                                <div className='flex flex-col border w-full rounded-md p-3 shadow-xl items-center justify-center gap-4'>
                                    <div>
                                        <MdCreditScore size={25} />
                                    </div>

                                    <div>
                                        <h1 className='font-light uppercase text-center text-sm'>Taksitle alışveriş imkanı</h1>
                                    </div>

                                    <div>
                                        <h1 className='font-light uppercase text-center text-xs'>İyzico Ödeme yöntemi ile 9-12 taksite kadar alışveriş yapabilirsiniz.</h1>
                                    </div>
                                </div>
                            </div>



                            <div className='flex flex-col flex-grow gap-4  h-40 w-96 items-center justify-center p-5 py-4'>
                                <div className='flex flex-col border w-full rounded-md p-3 shadow-xl items-center justify-center gap-4'>
                                    <div>
                                        <BiSupport size={25} />
                                    </div>

                                    <div>
                                        <h1 className='font-light uppercase text-center text-sm'>MÜŞTERİ HİZMETLERİ</h1>
                                    </div>

                                    <div>
                                        <h1 className='font-light uppercase text-center text-xs'>Dilerseniz 7/24 Whatsapp hattımızdan, veya iletişim sayfamızdan hızlı ve kolay yardım alın.</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>




                </div>




                <div className='container my-16 mx-auto'>
                    <div className='w-full flex flex-col items-center justify-center'>
                        <div className='mb-8'>
                            <h1 className='montserrat text-3xl md:text-4xl xl:text-4xl border-b pb-4 border-black'>HAFTANIN TERCİH EDİLENİ</h1>
                        </div>
                        <div>
                            {tercihEdilen.slice(0, 1).map((product) => (
                                <div className='flex items-start mt-8  flex-wrap md:flex-nowrap justify-center gap-2' key={product._id}>
                                    <div className='w-full md:w-4/5 flex flex-grow xl:w-1/2'>
                                        <img
                                            src={`http://localhost:5000${product.imageUrls[0]}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover cursor-pointer transition-all duration-500 ease-in-out transform "
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className='flex flex-col flex-grow p-5 w-full md:w-1/2 gap-4'>
                                        <h1 className='text-xl md:text-4xl xl:text-5xl raleway'>{product.name}</h1>
                                        <h1 className='text-xl md:text-4xl  font-bold '>{product.brand}</h1>

                                        <h1 className='text-sm md:text-lg lg:text-xl xl:text-2xl raleway'>{product.description}</h1>
                                        <h1 className='text-sm md:text-lg lg:text-xl xl:text-2xl  raleway'>{product.color}</h1>
                                     

                                        <div className='flex flex-col gap-5'>

                                            <div className='flex flex-col items-start mt-5 justif-center gap-4'>
                                                <h1 className='font-light tracking-wider text-lg'>ÖZELLİKLER</h1>
                                                <ul className='text-sm raleway list-disc flex flex-col items-start justify-center gap-1'>
                                                    <li>
                                                        30 cm genişlik, 22 cm  yükseklik, 15 cm derinlik ölçüsündedir.
                                                    </li>

                                                    <li>
                                                        Siparişiniz, görseldeki çanta sapıyla birlikte gönderilmektedir.
                                                    </li>

                                                    <li>
                                                        %100 vegan deri
                                                    </li>

                                                    <li>
                                                        Su geçirmez

                                                    </li>

                                                    <li>
                                                        Ön yüzeyde tipografi ve logo işlemeli
                                                    </li>

                                                    <li>
                                                        Çift kulp
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className='flex flex-col items-start mt-5 justif-center gap-4'>
                                                <h1 className='font-light font-sans tracking-wider text-lg'>KULLANIM</h1>
                                                <ul className='text-sm raleway list-disc flex flex-col items-start justify-center gap-1'>
                                                    <li>
                                                        Kuru temizleme kullanmayın
                                                    </li>

                                                    <li>
                                                        Çamaşır makinesinde yıkamayın
                                                    </li>

                                                    <li>
                                                        Kurutma makinesi kullanmayın
                                                    </li>

                                                    <li>
                                                        Hassas ütü ayarı ile ütüleyin

                                                    </li>

                                                    <li>
                                                        Direk güneş ışığına maruz bırakmamaya özen gösterin
                                                    </li>

                                                    <li>
                                                        Ürünü katlamadan, buruşturmadan; yüzeyi düz olacak şekilde asarak ya da yatırarak muhafaza ediniz
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div>


                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>


                {/* Banner 3 */}
                <div className="relative container mx-auto w-full  overflow-hidden">
                    <div className='h-[40rem] w-full mb-10 '>
                        <img
                            className=" h-full  w-full object-cover"
                            src={Banner4}
                            alt="main-image-3"
                        />
                        <div className="absolute bottom-0 z-20 left-0 w-full h-full flex items-center justify-center ">
                            <div className="flex flex-col mt-12 pb-12 items-start justify-center bg-black p-10 text-center backdrop-blur-2xl text-white bg-opacity-50 rounded-md  space-y-4 animate__animated animate__fadeInUp">
                                <div className='flex flex-col border-b w-full pb-5 items-start gap-2'>
                                    <h1 className="text-xl md:text-4xl lg:text-5xl text-white raleway font-bold">Bültenimizden Haberdar Olmak İçin</h1>
                                    <h1 className='raleway  text-xl md:text-4xl'>ABONE OLUN</h1>
                                </div>


                                <form onSubmit={handleSubmit} className='w-full cursor-pointer flex-wrap '>
                                    <div className='flex flex-row flex-wrap w-full my-4 items-start gap-6 justify-start'>
                                        <div className='flex flex-col gap-4 items-center justify-center'>
                                            <div className='flex flex-col items-start justify-center gap-2'>

                                                <input type='text'
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    name='name'
                                                    placeholder='Adınız'
                                                    required
                                                    className='text-xs border-b text-white bg-transparent rounded-md p-4'>

                                                </input>
                                            </div>

                                            <div className='flex flex-col items-start justify-center gap-2'>

                                                <input type='text'
                                                    name='lastname'
                                                    value={lastname}
                                                    onChange={(e) => setlastName(e.target.value)}
                                                    placeholder='Soyadınız'
                                                    required
                                                    className='text-xs border-b text-whit bg-transparent rounded-md p-4'>

                                                </input>
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-4 items-center justify-center'>


                                            <div className='flex flex-col items-start justify-center gap-2'>

                                                <input type='text'
                                                    name='phone' value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder='Telefon Numarası'
                                                    required
                                                    maxLength={11}
                                                    className='text-xs border-b text-whit bg-transparent rounded-md p-4'>

                                                </input>
                                            </div>

                                            <div className='flex flex-col items-start justify-center gap-'>

                                                <input type='email'
                                                    placeholder='Email'
                                                    name='email'
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    className='text-xs border-b text-whit bg-transparent rounded-md p-4'>

                                                </input>
                                            </div>
                                        </div>


                                    </div>
                                    <div className='mt-4 flex items-center justify-start mb-6'>
                                        <button type='submit' className='p-3 z-50 w-36 raleway rounded-md bg-emerald-700 text-sm my-6 font-sans '>
                                            Abone Ol
                                        </button>
                                    </div>


                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;