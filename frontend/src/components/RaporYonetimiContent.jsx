import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineLineChart } from "react-icons/ai";
import { FaC, FaUsers, FaMoneyBillTrendUp, FaUserShield, FaAlignJustify } from "react-icons/fa6";
import { BsClockFill } from "react-icons/bs";
import { AiFillCheckCircle } from "react-icons/ai";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa6";
import { FaClipboardList, FaUser, FaUserPlus } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { AiFillProduct } from "react-icons/ai";

function RaporYonetimiContent() {

  const navigate = useNavigate();

  const [successHavale, setSuccessHavale] = useState(0);
  const [havaleData, setHavaleData] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [orderLength, setOrderLength] = useState(0);
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);
  const [totalHavaleAmount, setTotalHavaleAmount] = useState(0);
  const [pendingOrder, setPendingOrder] = useState(0);
  const [pendingHavale, setPendingHavale] = useState(0);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentData, setPaymentData] = useState(0);
  const [paymentDataSuccess, setPaymentDataSuccess] = useState(0);
  const [paymentDataPending, setPaymentDataPending] = useState(0);
  const [paymentDataTotalAmount, setPaymentDataTotalAmount] = useState(0);
  const [userData, setUserData] = useState(0);
  const [adminData, setAdminData] = useState(0);
  const [addUser, setAddUser] = useState(0);
  const [productData, setProductData] = useState(0);
  const [productStockData, setProductStockData] = useState(0);
  const [productSellData, setProductSellData] = useState(0);
  const [orderRedData, setOrderRedData] = useState(0);
  const [havaleRedData, setHavaleRedData] = useState(0);

  const [showModalSiparis, setShowModalSiparis] = useState(false);
  const [showModalHavale, setShowModalHavale] = useState(false);
  const [showModalSanalPos, setShowModalSanalPos] = useState(false);
  const [showModalKullanici, setShowModalKullanici] = useState(false);
  const [showModalUrun, setShowModalUrun] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    orderLengthData();
    orderAmountData();
    totalOrderData();
    fetchHavaleData();
    fetchSuccessHavale();
    fetchTotalHavaleAmount();
    pendingOrderData();
    pendingHavaleData();
    paymentDataLenght();
  }, [filter, startDate, endDate]);


  {/* Admin Token Kontrolü */ }

  useEffect(() => {
    const checkAdminToken = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setError('Token bulunamadı');
        navigate('/login');
        return;
      }
      try {
        const decoded = jwtDecode(token);
        if (!decoded.isAdmin) {
          navigate('/');
          return;
        }
      } catch (error) {
        setError('Token doğrulanırken bir hata ile karşılaşıldı');
        console.error(error);
      } finally {
        setError(false);

      }
    };
    checkAdminToken();
  }, []);


  {/* Veri Alımı Fonksiyonları */ }

  const fetchSuccessHavale = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('http://localhost:5000/api/odeme/havaleler', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        }
      });
      const filteredHavale = response.data.filter(havale => {
        const havaleDate = new Date(havale.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (startDate && endDate) {
          return havale.status === 'success' && havaleDate >= start && havaleDate <= end;
        } else {
          // Günlük filtreleme
          return havale.status === 'success' && havaleDate.toDateString() === new Date().toDateString();
        }
      });
      setSuccessHavale(filteredHavale.length);
      console.log("Başarılı Havale Sayısı : ", filteredHavale);
    } catch (error) {
      setError("Veri alınırken bir hata ile karşılaşıldı", error);
      console.error(error);
    } finally {
      setError(false);
    }
  };

  const fetchHavaleData = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('http://localhost:5000/api/odeme/havaleler', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json',
        }
      });

      const filteredHavale = response.data.filter(havale => {
        const havaleDate = new Date(havale.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Tarih aralığı kontrolü
        if (startDate && endDate) {
          return havaleDate >= start && havaleDate <= end;
        } else {
          // Günlük filtreleme
          return havaleDate.toDateString() === new Date().toDateString();
        }
      });

      setHavaleData(filteredHavale.length);
      console.log("TOPLAM HAVALE SAYISI : ", filteredHavale.length);
    } catch (error) {
      setError("Veri alınırken bir hata ile karşılaşıldı", error);
      console.error(error);
    }
  };

  const totalOrderData = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('http://localhost:5000/api/orders/list', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        }
      });

      const filteredOrders = response.data.filter(order => {
        const orderDate = new Date(order.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (startDate && endDate) {
          return orderDate >= start && orderDate <= end;
        } else if (filter === 'daily') {
          return orderDate.toDateString() === new Date().toDateString();
        } else if (filter === 'weekly') {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          return orderDate >= weekStart && orderDate <= new Date();
        } else if (filter === 'monthly') {
          return orderDate.getMonth() === new Date().getMonth() && orderDate.getFullYear() === new Date().getFullYear();
        }
        return false;
      });

      setTotalOrder(filteredOrders.length);
      console.log("TÜM SİPARİŞ VERİSİ : ", filteredOrders.length);
    } catch (error) {
      setError('Veri alınırken bir hata ile karşılaşıldı.', error);
      console.error(error);
    } finally {
      setError(false);
    }
  };

  const orderLengthData = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('http://localhost:5000/api/orders/list', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        }
      });

      const filteredOrders = response.data.filter(order => {
        const orderDate = new Date(order.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Tarih aralığı kontrolü ve onay durumu
        if (startDate && endDate) {
          return order.status === 'success' && orderDate >= start && orderDate <= end;
        } else if (filter === 'daily') {
          return order.status === 'success' && orderDate.toDateString() === new Date().toDateString();
        } else if (filter === 'weekly') {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          return order.status === 'success' && orderDate >= weekStart && orderDate <= new Date();
        } else if (filter === 'monthly') {
          return order.status === 'success' && orderDate.getMonth() === new Date().getMonth() && orderDate.getFullYear() === new Date().getFullYear();
        }
        return false;
      });

      setOrderLength(filteredOrders.length);
      console.log("TOPLAM ONAYLANMIŞ SİPARİŞ SAYISI: ", filteredOrders.length);
    } catch (error) {
      setError("Veri alınırken bir hata ile karşılaşıldı");
      console.error(error);
    }
  };

  const orderAmountData = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('http://localhost:5000/api/orders/list', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        }
      });

      const filteredOrders = response.data.filter(order => {
        const orderDate = new Date(order.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (startDate && endDate) {
          return order.status === 'success' && orderDate >= start && orderDate <= end;
        } else if (filter === 'daily') {
          return order.status === 'success' && orderDate.toDateString() === new Date().toDateString();
        } else if (filter === 'weekly') {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          return order.status === 'success' && orderDate >= weekStart && orderDate <= new Date();
        } else if (filter === 'monthly') {
          return order.status === 'success' && orderDate.getMonth() === new Date().getMonth() && orderDate.getFullYear() === new Date().getFullYear();
        }
        return false;
      });

      const totalAmount = filteredOrders.reduce((acc, order) => acc + order.totalAmount, 0);
      setTotalOrderAmount(totalAmount);
      console.log("TOPLAM ONAYLANMIŞ SİPARİŞ TUTARI: ", totalAmount);
    } catch (error) {
      setError("Veri alınırken bir hata ile karşılaşıldı");
      console.error(error);
    }
  };

  const fetchTotalHavaleAmount = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('http://localhost:5000/api/odeme/havaleler', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        }
      });

      const filteredHavale = response.data.filter(havale => {
        const havaleDate = new Date(havale.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (startDate && endDate) {
          return havale.status === 'success' && havaleDate >= start && havaleDate <= end;
        } else {
          return havale.status === 'success' && havaleDate.toDateString() === new Date().toDateString();
        }
      });

      const totalHavaleAmount = filteredHavale.reduce((acc, havale) => acc + havale.amount, 0);
      setTotalHavaleAmount(totalHavaleAmount);
      console.log("TOPLAM ONAYLANMIŞ HAVALE TUTARI: ", totalHavaleAmount);
    } catch (error) {
      setError("Veri alınırken bir hata ile karşılaşıldı");
      console.error(error);
    }
  };

  const pendingOrderData = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('http://localhost:5000/api/orders/list', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        }
      });
      const filterPendingOrders = response.data.filter(order => order.status === 'pending');
      setPendingOrder(filterPendingOrders.length);
      console.log("BEKLEYEN SİPARİŞ SAYISI :", filterPendingOrders);
    } catch (error) {
      setError('Veri alınırken bir hata ile karşılaşıldı.', error);
      console.error(error);
    }
  };

  const pendingHavaleData = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('http://localhost:5000/api/odeme/havaleler', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        }
      });
      const filterPendingHavale = response.data.filter(havale => havale.status === 'pending');
      setPendingHavale(filterPendingHavale.length);
      console.log("BEKLEYEN HAVALE SAYISI: ", filterPendingHavale);
    } catch (error) {
      setError('Veri alınırken bir hata ile karşılaşıldı', error);
      console.error(error);
    }
  };

  const paymentDataLenght = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('http://localhost:5000/api/payments', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
      const paymentInfo = response.data.payments;
      const payments = response.data.payments.length;
      const paymentsSuccess = response.data.payments.filter(payment => payment.paymentStatus === 'SUCCESS').length;
      const paymentsPending = response.data.payments.filter(payment => payment.paymentStatus === 'PENDING').length;
      const paymentsTotalAmount = paymentInfo.reduce((acc, payment) => acc + payment.paidPrice, 0);
      console.log("KREDİ ÖDEME DETAY VERİLERİ ", paymentInfo);
      console.log("TOPLAM ", payments);
      console.log("ONAYLI ", paymentsSuccess);
      console.log("BEKLİYOR", paymentsPending);

      if (payments) {
        setPaymentData(payments);
      }

      if (paymentsSuccess) {
        setPaymentDataSuccess(paymentsSuccess);
      }

      if (paymentsPending) {
        setPaymentDataPending("KREDİ BEKLEYEN SAYISI", paymentsPending);
      }

      if (paymentsTotalAmount) {
        setPaymentDataTotalAmount(paymentsTotalAmount);
      }


    } catch (error) {
      setError('Veri alınırken hata ile karşılaşıldı');
      console.error('Veri alınırken hata ile karşılaşıldı', error);
    } finally {
      setError(false);
    }
  };

  const formatTurkishLira = (price) => {
    return price.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    });
  };

  useEffect(() => {
    const userData = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get('http://localhost:5000/users', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
          }
        });
        const responseUserData = response.data.users;
        const filteredUserData = responseUserData.filter(user => user.isAdmin === true);
        const totalData = ((responseUserData.length) - (filteredUserData.length));
        console.log("totaldata :  :  : ", totalData);
        console.log("KULLANICI DATA", responseUserData);

        setUserData(totalData);
        setAdminData(filteredUserData.length);

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        const newUsers = responseUserData.filter(user => new Date(user.date) > twentyFourHoursAgo);

        setAddUser(newUsers.length);
      } catch (error) {
        setError('Veri alınırken bir hata ile karşılaşıldı', error);
        console.error(error);
      } finally {
        setError(false);
      }
    }

    userData();

  }, []);

  useEffect(() => {
    const productData = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get('http://localhost:5000/getPosts', {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": 'application/json'
          }
        });
        const responseProductData = response.data.posts;
        const totalProductData = responseProductData.length;
        const totalProductStock = responseProductData.reduce((acc, product) => acc + product.stock, 0);
        setProductData(totalProductData)
        setProductStockData(totalProductStock);
        console.log("TOPLAM ÜRÜN SAYISI : : : : : :", responseProductData);
      } catch (error) {
        setError('Veri alınırken bir hata ile karşılaşıldı', error);
        console.error(error);
      } finally {
        setError(false);
      }
    }

    productData();
  }, []);


  {/* Modal Gösterme Fonksiyonları */ }

  const handleShowModalUrun = () => {
    setShowModalUrun(!showModalUrun);
  }

  const handleShowModalKullanici = () => {
    setShowModalKullanici(!showModalKullanici);
  }



  const handleShowModalSiparis = () => {
    setShowModalSiparis(!showModalSiparis);
  }

  const handleShowModalHavale = () => {
    setShowModalHavale(!showModalHavale);
  }

  const handleShowModalSanalPos = () => {
    setShowModalSanalPos(!showModalSanalPos);
  }

  return (
    <div className='container mx-auto p-5'>
      <div className='flex flex-col items-start justify-center gap-4'>
        <div className='flex flex-row mt-16 items-center montserrat gap-2'>
          <div className='text-gray-400'>
            <Link to='/'>
              Anasayfa
            </Link>
          </div>
          <div>
            <h1 className='text-gray-400'>/</h1>
          </div>
          <div className='py-4'>
            <h1 className='text-lg font-semibold text-gray-800'>Rapor Yönetimi</h1>
          </div>
        </div>
        <div className='border w-full border-gray-300'></div>

        {/* Tarih Filtreleme */}
        <div className='flex flex-row gap-4 mt-4'>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className='border p-1 rounded-md text-xs'>
            <option value="daily">Günlük</option>
            <option value="weekly">Haftalık</option>
            <option value="monthly">Aylık</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className='border p-1 rounded-md text-xs cursor-pointer font-sans'
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className='border p-1 text-xs cursor-pointer font-sans rounded-md '
          />
        </div>

        <div className='w-full h-screen flex flex-shrink-0'>


          <div className='flex items-start border rounded-md shadow-2xl  h-max flex-row flex-wrap flex-grow justify-center gap-4 p-2  w-full backdrop-blur-3xl' >

            {/* Kullanıcı RAPORLARI */}
            <div className='w-auto flex cursor-pointer  items-start mt-4 justify-start flex-col gap-6'>

              <div className='flex flex-col p-5  border rounded-lg  shadow-xl  border-gray-500 relative items-start w-full justify-start gap-4 '>


                <div onClick={() => (handleShowModalKullanici())} className='flex flex-row  items-center justify-start gap-2'>
                  <FaUser className='text-gray-600' size={25} />
                  <h1 className=' border-b border-black raleway text-lg '>
                    Kullanıcı Raporları
                  </h1>

                </div>
                {!showModalKullanici && (
                  <div className='flex  items-start flex-col justify-center w-full flex-wrap gap-4'>

                    <div className='border cursor-pointer rounded-md flex-1 backdrop-blur-sm  w-56 bg-gray-700 flex p-2  items-center justify-center pl-4 gap-4'>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                          <div>
                            <h1 className='raleway text-white text-sm text-start '>Admin</h1>
                          </div>
                          <div>
                            <h1 className='montserrat text-white text-sm'>{adminData} kişi</h1>
                          </div>
                        </div>
                        <div>
                          <FaUserShield className='text-slate-200' size={25} />
                        </div>
                      </div>
                    </div>

                    <div className='border cursor-pointer rounded-md flex-1 backdrop-blur-lg  w-56 bg-red-700 flex p-2  items-center justify-center pl-4 gap-4'>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                          <div>
                            <h1 className='raleway text-white text-sm text-start '>Toplam Kullanıcı</h1>
                          </div>
                          <div>
                            <h1 className='montserrat text-white text-sm'>{userData} kişi</h1>
                          </div>
                        </div>
                        <div>
                          <FaUsers className='text-white rounded-sm' size={25} />
                        </div>
                      </div>
                    </div>


                    <div className='border cursor-pointer rounded-md flex-1 backdrop-blur-lg  w-56 bg-emerald-700 flex p-2  items-center justify-center pl-4 gap-4'>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                          <div>
                            <h1 className='raleway text-white text-sm text-start '>Üye Olan (Günlük)</h1>
                          </div>
                          <div>
                            <h1 className='montserrat text-white text-sm'>{addUser} kişi</h1>
                          </div>
                        </div>
                        <div>
                          <FaUserPlus className='text-white rounded-sm' size={25} />
                        </div>
                      </div>
                    </div>


                  </div>
                )}

              </div>

            </div>



            {/* Ürün Rapor */}
            <div className='w-auto flex cursor-pointer  items-start mt-4 justify-start flex-col gap-6'>

              <div className='flex flex-col p-5 shadow-xl rounded-lg border border-gray-500 relative items-start w-full justify-start gap-4 '>


                <div onClick={() => (handleShowModalUrun())} className='flex flex-row  items-center justify-start gap-2'>
                  <AiFillProduct className='text-red-600' size={25} />
                  <h1 className=' border-b border-black raleway text-lg '>
                    Ürün Raporları
                  </h1>

                </div>
                {!showModalUrun && (
                  <div className='flex  items-start flex-col justify-center w-full flex-wrap gap-4'>

                    <div className='border cursor-pointer rounded-md flex-1 backdrop-blur-sm  w-56 bg-gray-700 flex p-2  items-center justify-center pl-4 gap-4'>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                          <div>
                            <h1 className='raleway text-white text-sm text-start '>Toplam Ürün</h1>
                          </div>
                          <div>
                            <h1 className='montserrat text-white text-sm'>{productData} adet</h1>
                          </div>
                        </div>
                        <div>
                          <AiFillProduct className='text-slate-200' size={25} />
                        </div>
                      </div>
                    </div>

                    <div className='border cursor-pointer rounded-md flex-1 backdrop-blur-lg  w-56 bg-red-700 flex p-2  items-center justify-center pl-4 gap-4'>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                          <div>
                            <h1 className='raleway text-white text-sm text-start '>Toplam Stok</h1>
                          </div>
                          <div>
                            <h1 className='montserrat text-white text-sm'>{productStockData} adet</h1>
                          </div>
                        </div>
                        <div>
                          <FaUsers className='text-white rounded-sm' size={25} />
                        </div>
                      </div>
                    </div>


                    <div className='border cursor-pointer rounded-md flex-1 backdrop-blur-lg  w-56 bg-emerald-700 flex p-2  items-center justify-center pl-4 gap-4'>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                          <div>
                            <h1 className='raleway text-white text-sm text-start '>Satılan Ürün (Günlük)</h1>
                          </div>
                          <div>
                            <h1 className='montserrat text-white text-sm'>{productSellData} adet</h1>
                          </div>
                        </div>
                        <div>
                          <AiFillCheckCircle className='text-emerald-500 bg-white rounded-full border-white ' size={25} />
                        </div>
                      </div>
                    </div>


                  </div>
                )}

              </div>

            </div>






            {/* Sipariş Rapor */}
            <div className='w-auto flex cursor-pointer  items-start mt-4 justify-start flex-col gap-6'>

              <div className='flex flex-col p-5 shadow-xl rounded-lg border border-gray-500 relative items-start w-full justify-start gap-4 '>


                <div onClick={() => (handleShowModalSiparis())} className='flex flex-row  items-center justify-start gap-2'>
                  <FaClipboardList className='text-yellow-600' size={25} />
                  <h1 className=' border-b border-black raleway text-lg '>
                    Sipariş Raporları
                  </h1>

                </div>
                {!showModalSiparis && (
                  <div className='flex  items-start flex-col justify-center w-full flex-wrap gap-4'>

                    <div className='border cursor-pointer rounded-md flex-1 backdrop-blur-sm  w-56 bg-blue-800 flex p-2  items-center justify-center pl-4 gap-4'>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                          <div>
                            <h1 className='raleway text-white text-sm text-start '>Toplam Sipariş</h1>
                          </div>
                          <div>
                            <h1 className='montserrat text-white text-sm'>{totalOrder} adet</h1>
                          </div>
                        </div>
                        <div>
                          <AiOutlineLineChart className='text-slate-200' size={25} />
                        </div>
                      </div>
                    </div>

                    <div className='border cursor-pointer rounded-md flex-1 backdrop-blur-lg  w-56 bg-yellow-700 flex p-2  items-center justify-center pl-4 gap-4'>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                          <div>
                            <h1 className='raleway text-white text-sm text-start '>Bekleyen Sipariş</h1>
                          </div>
                          <div>
                            <h1 className='montserrat text-white text-sm'>{pendingOrder} adet</h1>
                          </div>
                        </div>
                        <div>
                          <BsClockFill className='text-gray-400 border-white border-2 bg-white rounded-full' size={25} />
                        </div>
                      </div>
                    </div>

                    {/* SİPARİŞ SAYI VERİ */}
                    <div className='border border-gray-500 flex-1 cursor-pointer bg-emerald-700  w-56 rounded-md backdrop-blur-lg flex p-2  items-center justify-center pl-4 gap-4'>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                          <div>
                            <h1 className='raleway text-white text-sm text-start'>Onaylanan Sipariş</h1>
                          </div>
                          <div>
                            <h1 className='montserrat text-white text-sm'>{orderLength} adet</h1>
                          </div>
                        </div>
                        <div>
                          <AiFillCheckCircle className='text-emerald-400 bg-white rounded-full' size={25} />
                        </div>
                      </div>
                    </div>

                    {/* SİPARİŞ TUTAR VERİ */}
                    <div className='border border-gray-50 cursor-pointer flex-1 backdrop-blur-lg  w-56 bg-emerald-800 rounded-md flex p-2 items-center justify-center pl-4 gap-4'>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                          <div>
                            <h1 className='raleway text-white text-sm text-start'>Onaylanan Sipariş Tutarı</h1>
                          </div>
                          <div>
                            <h1 className='montserrat text-white text-sm'>{formatTurkishLira(totalOrderAmount)}</h1>
                          </div>
                        </div>
                        <div>
                          <FaMoneyBillTrendUp className='text-slate-200' size={25} />
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>

            {/* HAVALE İLE ÖDEME */}
            <div className='w-auto flex cursor-pointer p-5 shadow-xl rounded-lg border border-gray-500 items-start mt-4 justify-start flex-col gap-6'>
              <div className='flex flex-col items-start w-full justify-start gap-4 '>
                <div onClick={() => handleShowModalHavale()} className='flex flex-row items-center justify-start gap-2'>
                  <FaMoneyBillTransfer className='text-emerald-600' size={25} />
                  <h1 className=' border-b border-black raleway text-lg '>
                    Havale Raporları
                  </h1>

                </div>

                {!showModalHavale && (
                  <div className='flex flex-col  items-start justify-center w-full flex-wrap gap-4'>

                    <div className='border cursor-pointer rounded-md flex-1 backdrop-blur-lg w-56 bg-blue-800 flex p-2  items-center justify-center pl-4 gap-4'>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                          <div>
                            <h1 className='raleway text-white text-sm text-start '>Toplam Havale</h1>
                          </div>
                          <div>
                            <h1 className='montserrat text-white text-sm'>{havaleData} adet</h1>
                          </div>
                        </div>
                        <div>
                          <AiOutlineLineChart className='text-slate-200' size={25} />
                        </div>
                      </div>
                    </div>

                    <div className='border cursor-pointer rounded-md flex-1 backdrop-blur-lg bg-yellow-700 w-56 flex p-2  items-center justify-center pl-4 gap-4'>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                          <div>
                            <h1 className='raleway text-white text-sm text-start '>Bekleyen Havale</h1>
                          </div>
                          <div>
                            <h1 className='montserrat text-white text-sm'>{pendingHavale} adet</h1>
                          </div>
                        </div>
                        <div>
                          <BsClockFill className='text-gray-400 border-white border-2 bg-white rounded-full' size={25} />
                        </div>
                      </div>
                    </div>

                    <div className='border cursor-pointer rounded-md flex-1 backdrop-blur-lg w-56 bg-emerald-700 flex p-2 items-center justify-center pl-4 gap-4'>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                          <div>
                            <h1 className='raleway text-white text-sm text-start '>Onaylanan Havale</h1>
                          </div>
                          <div>
                            <h1 className='montserrat text-white text-sm'>{successHavale} adet</h1>
                          </div>
                        </div>
                        <div>
                          <AiFillCheckCircle className='text-emerald-400 bg-white rounded-full' size={25} />
                        </div>
                      </div>
                    </div>

                    {/* Onaylanan Havale Tutarı */}
                    <div className='border cursor-pointer rounded-md flex-1 backdrop-blur-lg w-56 bg-emerald-800 flex p-2 items-center justify-center pl-4 gap-4'>
                      <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-col gap-2'>
                          <div>
                            <h1 className='raleway text-white text-sm text-start '>Onaylanan Havale Tutarı</h1>
                          </div>
                          <div>
                            <h1 className='montserrat text-white text-sm'>{formatTurkishLira(totalHavaleAmount)}</h1>
                          </div>
                        </div>
                        <div>
                          <FaMoneyBillTrendUp className='text-slate-200' size={25} />
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>

            {/* Kredi ile Ödeme */}
            <div className='w-auto flex border p-5 shadow-xl rounded-lg border-gray-500 cursor-pointer items-start mt-4 justify-start flex-col gap-6'>
              <div className='flex flex-col items-start w-full justify-start gap-4 '>
                <div onClick={() => (handleShowModalSanalPos())} className='flex flex-row items-center justify-start gap-2'>
                  <FaCreditCard className='text-blue-600' size={25} />
                  <h1 className=' border-b border-black raleway text-lg '>
                    Sanal Pos Raporları
                  </h1>

                </div>

                {!showModalSanalPos && (<div className='flex flex-col  items-start justify-center w-full flex-wrap gap-4'>
                  <div className='border cursor-pointer rounded-md flex-1 backdrop-blur-lg  bg-blue-800 flex p-2 w-56 items-center justify-center pl-4 gap-4'>
                    <div className='flex w-full items-center justify-between'>
                      <div className='flex flex-col gap-2'>
                        <div>
                          <h1 className='raleway text-white text-sm text-start '>Toplam Sanal Pos</h1>
                        </div>
                        <div>
                          <h1 className='montserrat text-white text-sm'>{paymentData} adet</h1>
                        </div>
                      </div>
                      <div>
                        <AiOutlineLineChart className='text-slate-200' size={25} />
                      </div>
                    </div>
                  </div>

                  <div className='border cursor-pointer rounded-md flex-1 backdrop-blur-lg bg-yellow-700 flex p-2 w-56 items-center justify-center pl-4 gap-4'>
                    <div className='flex w-full items-center justify-between'>
                      <div className='flex flex-col gap-2'>
                        <div>
                          <h1 className='raleway text-white text-sm text-start '>Bekleyen Pos</h1>
                        </div>
                        <div>
                          <h1 className='montserrat text-white text-sm'>{paymentDataPending} adet</h1>
                        </div>
                      </div>
                      <div>
                        <BsClockFill className='text-gray-400 border-white border-2 bg-white rounded-full' size={25} />
                      </div>
                    </div>
                  </div>

                  <div className='border cursor-pointer rounded-md flex-1 backdrop-blur-lg bg-emerald-700 flex p-2 w-56 items-center justify-center pl-4 gap-4'>
                    <div className='flex w-full items-center justify-between'>
                      <div className='flex flex-col gap-2'>
                        <div>
                          <h1 className='raleway text-white text-sm text-start '>Onaylanan Sanal pos</h1>
                        </div>
                        <div>
                          <h1 className='montserrat text-white text-sm'>{paymentDataSuccess} adet</h1>
                        </div>
                      </div>
                      <div>
                        <AiFillCheckCircle className='text-emerald-400 bg-white rounded-full' size={25} />
                      </div>
                    </div>
                  </div>


                  <div className='border cursor-pointer rounded-md flex-1 backdrop-blur-lg bg-emerald-800 flex p-2 w-56 items-center justify-center pl-4 gap-4'>
                    <div className='flex w-full items-center justify-between'>
                      <div className='flex flex-col gap-2'>
                        <div>
                          <h1 className='raleway text-white text-sm text-start '>Onaylanan Toplam Tutar</h1>
                        </div>
                        <div>
                          <h1 className='montserrat text-white text-sm'>{formatTurkishLira(paymentDataTotalAmount)} ₺</h1>
                        </div>
                      </div>
                      <div>
                        <FaMoneyBillTrendUp className='text-slate-200' size={25} />
                      </div>
                    </div>
                  </div>
                </div>)
                }

              </div>
            </div>

          </div>
        </div>
      </div>
    </div >
  );
}

export default RaporYonetimiContent;