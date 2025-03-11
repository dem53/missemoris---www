import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsBoxSeamFill } from "react-icons/bs";
import { FaCreditCard } from "react-icons/fa6";
import { MdOutline3dRotation } from "react-icons/md";
import HavaleForm from './HavaleForm';
import PaymentForm from './PaymentForm';
import HavaleBox from './HavaleBox';

const OdemeContent = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [paymentShow, setPaymentShow] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { cartItems } = location.state || { cartItems: [] };
    const [contactInfo, setContactInfo] = useState({
        name: '',
        surname: '',
        address: '',
        phone: '',
        email: '',
        country: 'Türkiye',
        city: '',
        district: '',
        paymentMethod: ''
    });
    const [totalAmount, setTotalAmount] = useState(0);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [paymentStep, setPaymentStep] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);


    const [orderId, setOrderId] = useState(null);
    const [order, setOrder] = useState(null);


    const validateForm = () => {
        const requiredFields = [
            'name', 'surname', 'address', 'city',
            'district', 'paymentMethod'
        ];

        if (!isAuthenticated) {
            requiredFields.push('email', 'phone');
        }

        const isValid = requiredFields.every(field =>
            contactInfo[field] && contactInfo[field].trim() !== ''
        );

        return isValid;
    };

    useEffect(() => {
        setIsFormValid(validateForm());
    }, [contactInfo, isAuthenticated]);


    const handleClick = () => {
        window.scrollTo(0, 0);
    }


    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('https://turkiyeapi.dev/api/v1/provinces');
                const cityNames = response.data.data.map(city => city.name);
                setCities(cityNames);
            } catch (error) {
                console.error('Şehir verileri alınırken hata:', error);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        if (contactInfo.city) {
            const fetchDistricts = async () => {
                try {
                    const response = await axios.get(`https://turkiyeapi.dev/api/v1/districts?province=${contactInfo.city}`);
                    const districtNames = response.data.data.map(district => district.name);
                    setDistricts(districtNames);
                } catch (error) {
                    console.error('İlçe verileri alınırken hata:', error);
                }
            };
            fetchDistricts();
        } else {
            setDistricts([]);
        }
    }, [contactInfo.city]);


    useEffect(() => {
        const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        setTotalAmount(total);
    }, [cartItems]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactInfo({ ...contactInfo, [name]: value });
    };

    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
        setContactInfo({ ...contactInfo, city: selectedCity, district: '' });
    };

    const calculateTotalQuantity = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const handleProceedToPayment = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setPaymentStep(true);
        } else {
            alert('Lütfen tüm zorunlu alanları doldurun.');
        }
    };

    const handlePaymentConfirmation = async () => {

        try {
            const sessionId = localStorage.getItem('sessionId');
            if (!sessionId) {
                sessionId = 'anon_' + Math.random().toString(36).substring(2, 15);
                localStorage.setItem('sessionId', sessionId);
            }
            
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('authToken');

            const orderData = {
                userId: userId || null,
                sessionId: sessionId,
                items: cartItems.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price,
                    size: item.size
                })),
                totalAmount,
                shippingAddress: contactInfo.address,
                phone: contactInfo.phone || null,
                country: contactInfo.country,
                city: contactInfo.city,
                district: contactInfo.district,
                paymentMethod: contactInfo.paymentMethod,
                name: contactInfo.name,
                email: contactInfo.email || null,
                surname: contactInfo.surname
            };

            const response = await axios.post('http://localhost:5000/api/orders', orderData, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                }
            });

                setOrderId(response.data._id);
                setOrder(response.data);
                setPaymentShow(true);

                console.log("SİPARİŞ RESPONSE DATA  : ", response.data);
              
        } catch (error) {
            console.error('Sipariş oluşturulurken hata:', error);
            alert('Sipariş oluşturulurken bir hata oluştu.');
        }


    };



    const handlePaymentForm = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const sessionId = localStorage.getItem('sessionId');

            await axios.delete('http://localhost:5000/api/cart/clear', {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                data: {
                    sessionId: sessionId
                }
            });
            localStorage.removeItem('cartItems');
            alert('Ödeme sayfasına yönlendiriliyorsunuz...');
            setTimeout(() => {
                navigate('/');
            }, 1500)
        } catch (error) {
            console.error('Sepet temizlenirken hata:', error);
        }
    };


    const handleHavaleFormSuccess = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const sessionId = localStorage.getItem('sessionId');

            await axios.delete('http://localhost:5000/api/cart/clear', {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                data: {
                    sessionId: sessionId
                }
            });
            localStorage.removeItem('cartItems');
            alert('Ödemeniz başarıyla alındı. Teşekkür ederiz!');
            navigate('/');
        } catch (error) {
            console.error('Sepet temizlenirken hata:', error);
        }
    };


    const formatTurkishLira = (price) => {
        return price.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        });
    };

    return (
        <div className="container mx-auto px-6 mt-20 bg-white rounded-lg">
            {/* Teslimat - Ödeme Box */}
            <div className='w-full flex items-center relative justify-center p-3'>
                <div className="w-full flex items-center border bg-emerald-50 border-emerald-500 rounded-md justify-center p-5">
                    <div className='bg-emerald-50 flex items-start gap-12 justify-around py-5 w-96'>
                        <div className='flex flex-col gap-3 items-center justify-center'>
                            <div>
                                <BsBoxSeamFill className={`${paymentStep ? 'text-gray-500 text-opacity-30' : 'text-gray-500'}`} size={30} />
                            </div>
                            <div>
                                <h2 className={`raleway text-xl ${paymentStep ? 'opacity-30' : 'opacity-100'}`}>Teslimat</h2>
                            </div>
                        </div>
                        <div className={`w-full border-2 mt-4 border-gray-500 ${paymentStep ? 'border-opacity-100' : 'border-opacity-30'}`}></div>
                        <div className='flex flex-col gap-3 items-center justify-center'>
                            <div>
                                <FaCreditCard className={`${paymentStep ? 'text-gray-500 text-opacity-100' : 'text-gray-500 text-opacity-30'}`} size={30} />
                            </div>
                            <div>
                                <h2 className={`raleway text-xl ${paymentStep ? 'opacity-100' : 'opacity-30'}`}>Ödeme</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col xl:flex-row justify-around p-5 gap-8 bg-gray-50 rounded-lg">
                {/* TESLİMAT VE İLETİŞİM FORM */}
                <div className="flex flex-col w-full p-5">
                    {!paymentStep && (
                        <form onSubmit={handleProceedToPayment} className="space-y-4 p-6 bg-gray-100 shadow-md rounded-lg">
                            <h2 className="text-xl font-semibold montserrat mb-6 border-b-2 pb-2">Teslimat ve İletişim Bilgileri</h2>

                            {!isAuthenticated && (
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-lg font-medium">İletişim Bilgileri</h3>
                                    <label className="block text-gray-700">Email Adresi *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={contactInfo.email}
                                        onChange={handleInputChange}
                                        placeholder="E-Posta"
                                        className="border rounded-md p-2 w-full"
                                        required
                                    />
                                </div>
                            )}

                            <div>

                            <div className="flex flex-col gap-4">
                                    <h3 className="text-lg font-medium">İletişim Bilgileri</h3>
                                    <label className="block text-gray-700">Telefon Numarası *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={contactInfo.phone}
                                        onChange={handleInputChange}
                                        maxLength={11}
                                        placeholder="Telefon"
                                        className="border rounded-md p-2 w-full"
                                        required
                                    />
                                </div>
                                <h3 className="text-lg my-3 mb-4 font-medium">Teslimat Bilgileri</h3>
                                <div className="flex gap-4 mb-4">
                                    <div className="w-1/2">
                                        <label className="block text-gray-700">Ad *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={contactInfo.name}
                                            onChange={handleInputChange}
                                            placeholder="Ad"
                                            className="border rounded-md p-2 w-full"
                                            required
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-gray-700">Soyad *</label>
                                        <input
                                            type="text"
                                            name="surname"
                                            value={contactInfo.surname}
                                            onChange={handleInputChange}
                                            placeholder="Soyad"
                                            className="border rounded-md p-2 w-full"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 mb-4">
                                    <div className="w-1/2">
                                        <label className="block text-gray-700">İl *</label>
                                        <select
                                            name="city"
                                            value={contactInfo.city}
                                            onChange={handleCityChange}
                                            className="border rounded-md p-2 w-full"
                                            required
                                        >
                                            <option value="">Şehir Seçin</option>
                                            {cities.map((city) => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-gray-700">İlçe *</label>
                                        <select
                                            name="district"
                                            value={contactInfo.district}
                                            onChange={handleInputChange}
                                            className="border rounded-md p-2 w-full"
                                            required
                                        >
                                            <option value="">İlçe Seçin</option>
                                            {districts.map((district) => (
                                                <option key={district} value={district}>{district}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700">Adres *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={contactInfo.address}
                                        onChange={handleInputChange}
                                        placeholder="Mahalle, cadde, sokak ve daire no"
                                        className="border rounded-md p-2 w-full"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700">Ödeme Yöntemi *</label>
                                    <select
                                        name="paymentMethod"
                                        value={contactInfo.paymentMethod}
                                        onChange={handleInputChange}
                                        className="border rounded-md p-2 w-full"
                                        required
                                    >
                                        <option value="">Seçiniz</option>
                                        <option value="bank_transfer">Havale (%3)</option>
                                        <option value="credit_card">Kredi Kartı</option>
                                    </select>
                                </div>

                                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg shadow-md p-2 w-full">
                                    <h3 className="text-sm font-semibold mb-4">Ödeme Bilgileri</h3>
                                    <div className="flex items-start justify-start mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-blue-500 mr-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 11V4a1 1 0 011-1h16a1 1 0 011 1v7m-9 4H4m0 0V9a1 1 0 011-1h4a1 1 0 011 1v5m0 0h5m-5 0h5" />
                                        </svg>
                                        <p className="text-sm text-gray-700">
                                            Havale ile ödeme %3 indirim sunmaktadır.
                                        </p>
                                    </div>
                                    <p className="text-sm font-extralight flex items-start gap-2 justify-start text-gray-500">
                                        <span className='mt-0.5'><MdOutline3dRotation size={15} /></span>
                                        <span className='font-sans'>
                                            3D Secure Güvenli ödeme sistemimiz sayesinde tüm işlemleriniz şifreli olarak gerçekleştirilmektedir.
                                        </span>
                                    </p>
                                </div>
                                {contactInfo.paymentMethod === 'bank_transfer' && (
                                    <button
                                        type="submit"
                                        disabled={!isFormValid}
                                        onClick={handleClick}
                                        className={`w-full p-3 mt-4 rounded-md ${isFormValid
                                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        Ödemeye Geç
                                    </button>
                                )}

                                {contactInfo.paymentMethod === 'credit_card' && (
                                    <button
                                        type="submit"
                                        disabled={!isFormValid}
                                        onClick={() => {
                                            handlePaymentConfirmation();
                                            handleClick();
                                        } }
                                        className={`w-full p-3 mt-4 rounded-md ${isFormValid
                                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        Ödemeye Geç
                                    </button>
                                )}

                            </div>
                        </form>
                    )}

                    {paymentStep && contactInfo.paymentMethod === 'bank_transfer' && (
                    
                        <div className='flex flex-col border bg-white rounded-md shadow-lg items-start justify-center p-5'>
                            <h3 className="text-2xl font-bold tracking-wide font-sans mb-4">Havale / EFT Ödeme Bilgileri</h3>
                        

                            <div className='flex flex-col my-2 items-start'>
                                <p className='font sans font-medium text-sm px-4 font-xs my-4 text-black transform ease-in-out'>
                                    <h1>
                                    Not: Lütfen ödemenizi yaptıktan sonra havale formunu doldurunuz.
                                    </h1>
                          
                                    <HavaleBox
                                        tittle={'Ödemenizi yaparken açıklama kısmını AD-SOYAD yazmanız ricada bulunulur.'}
                                        bankName={'Akbank'}
                                        names={'Misse Moris Satış Hizmetleri Ltd'}
                                        ıban={'TR 340003043040304030430430'}
                                        hesapNo={'05372422'}
                                        subeNo={'0043'}
                                    
                                    />
                                      <p className='flex w-full mt-3 items-center gap-2'><span className='font-sans font-extrabold'>Ödeme Yapılacak Tutar: </span>{formatTurkishLira(totalAmount)}</p>
                                </p>
                                
                            </div>

                            <div className='flex items-center px-2 justify-between w-full gap-4'>
                             
                                    <button
                                        onClick={() => setPaymentStep(false)}
                                        className="bg-red-500 text-white rounded-md text-xs py-2 p-1 px-4 mt-4"
                                        style={{
                                            fontSize: '10px'
                                        }}
                                    >
                                            <h1>
                                        Teslimat Bilgilerime
                                        </h1>
                                        <h1>
                                    Geri Dön
                                        </h1>
                                    </button>

                                    <button
                                        onClick={() => {
                                            handlePaymentConfirmation();
                                            handleClick();
                                        }}
                                        className="bg-emerald-500 text-white rounded-md p-1 py-2 px-4 mt-4"
                                        style={{
                                            fontSize: '10px'
                                        }}
                                    >
                                        <h1>
                                        Ödeme Yaptım
                                        </h1>
                                        <h1>
                                    Havaleyi Bildir
                                        </h1>
                                    </button>
                            </div>
                        </div>
                    )}



                    {
                            paymentStep && contactInfo.paymentMethod === 'bank_transfer' && (
                                <div className='flex items-center w-full justify-center'>
                                    {paymentShow && (
                                        <div className='fixed inset-0 flex items-center w-full justify-center bg-black/50 backdrop-blur-sm'>
                                            <div>
                                                <HavaleForm orderId={orderId} onSuccess={handleHavaleFormSuccess} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                    )}



                    {paymentStep && contactInfo.paymentMethod === 'credit_card' && (
                        <div className='flex flex-col border bg-white rounded-md shadow-lg items-start justify-center p-5'>
                            <PaymentForm 
                            order={order}
                            orderId={orderId} 
                            onSuccess={handlePaymentForm} />
                        </div>
                    )}

                    
                </div>

                {/* Sepet Özeti */}
                <div className="w-full bg-white h-full rounded-lg p-6">
                    <h2 className="text-xl w-full montserrat border-b-2 pb-1 font-semibold mb-4">Sepet Özeti</h2>
                    {cartItems.length === 0 ? (
                        <p>Sepetinizde ürün bulunmamaktadır.</p>
                    ) : (
                        <div>
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.product._id} className="flex justify-between">
                                        <div className="flex items-center">
                                            <img
                                                src={`http://localhost:5000${item.product.imageUrls[0]}`}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded-lg shadow-md"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/placeholder.jpg';
                                                }}
                                            />
                                            <div className="ml-4">
                                                <p>{item.product.name} (x{item.quantity})</p>
                                                <p className="text-sm text-gray-500">{item.product.brand}</p>
                                                <p className='raleway mt-1 text-xs'>{item.product.color}</p>
                                         
                                            </div>
                                        </div>
                                        <span className="font-semibold">{formatTurkishLira(item.product.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span>Ürün Adedi:</span>
                                    <span>{calculateTotalQuantity()} adet</span>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <span>Sepet Tutarı:</span>
                                    <span>{formatTurkishLira(totalAmount)}</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <span>Toplam Tutar:</span>
                                    <span className="text-2xl">{formatTurkishLira(totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OdemeContent;