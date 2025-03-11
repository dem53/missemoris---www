import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaPhone, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import img from '../images/mm-2 copy.png'


const Register = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const tokenControl = async() => {
      const token = localStorage.getItem('authToken');
      if (token) {
        navigate('/');
        return;
      }
    };
    tokenControl()
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/register', {
        email,
        password,
        ad,     
        soyad, 
        number: phone 
      });

      setSuccess(`Aramıza hoşgeldiniz :) Kayıt başarılı, giriş yapabilirsiniz!`);
      setEmail('');
      setPassword('');
      setAd('');
      setSoyad('');
      setPhone('');
      setError(''); 
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className='absolute object-cover w-full h-full'>
        <img src={img} alt='login-bg' className='w-full h-full object-cover' />
      </div>
      <div className="max-w-md w-full space-y-8 bg-black/50 backdrop-blur-md p-8 mt-12 rounded-xl shadow-2xl">
        <div>
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-gray-500 to-emerald-700 rounded-full flex items-center justify-center">
            <FaUserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl montserrat text-white">
            Üye Ol
          </h2>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-300 text-center text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
            <p className="text-green-300 text-center text-sm">{success}</p>
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ad
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={ad}
                  onChange={(e) => setAd(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-600 
                           placeholder-gray-400 text-white rounded-lg bg-gray-700/50
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                           transition-all duration-200"
                  required
                  placeholder='Ad'
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Soyad
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={soyad}
                  onChange={(e) => setSoyad(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-600 
                           placeholder-gray-400 text-white rounded-lg bg-gray-700/50
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                           transition-all duration-200"
                  required
                  placeholder='Soy Ad'
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-600 
                         placeholder-gray-400 text-white rounded-lg bg-gray-700/50
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         transition-all duration-200"
                placeholder="ornek@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Şifre
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-600 
                         placeholder-gray-400 text-white rounded-lg bg-gray-700/50
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         transition-all duration-200"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Telefon Numarası
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={phone}
                maxLength={11}
                placeholder="(05XX XXX XX XX)"
                onChange={(e) => setPhone(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-600 
                         placeholder-gray-400 text-white rounded-lg bg-gray-700/50
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                       text-sm font-medium rounded-lg text-white bg-emerald-600
                  hover:bg-emerald-700 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FaUserPlus className="h-5 w-5 text-emerald-200 group-hover:text-emerald-300" />
                  </span>
                  Üye Ol
                </>
              )}
            </button>
          </div>
        </form>

        <div className="relative ">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">veya</span>
          </div>
        </div>

        <div className="text-center">
          <a 
            href="/login" 
            className="flex items-center justify-center gap-2 text-sm text-gray-300 hover:text-white transition-colors duration-200"
          >
            <FaSignInAlt className="h-4 w-4" />
            Zaten hesabınız var mı? Giriş Yap
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;