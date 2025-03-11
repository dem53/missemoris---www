import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import img from '../images/mm-2 copy.png'

const Login = ({ setUser }) => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const tokenControl = async() => {
      const token = localStorage.getItem('authToken');
      if (token) {
        navigate('/');
        return;
      }
    };
    tokenControl();
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.ad);
      localStorage.setItem('userSurname', user.soyad);
      localStorage.setItem('userIsAdmin', user.isAdmin);
      const userIsAdmin = localStorage.getItem('userIsAdmin');
      setUser(user);
      if (userIsAdmin === 'true'){
        navigate('/rapor_yonetimi');
        return;
      } else {
        navigate('/tum_urunler');
      }
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen login-page-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className='absolute object-cover w-full h-full'>
        <img src={img} alt='login-bg' className='w-full h-full object-cover' />
      </div>

      <div className="max-w-md w-full space-y-8 bg-black/50 backdrop-blur-md p-8 rounded-xl shadow-2xl">
        <div>
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-gray-500 to-blue-700 rounded-full flex items-center justify-center">
            <FaSignInAlt className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl montserrat text-white">
            Giriş Yap
          </h2>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-300 text-center text-sm">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-600 
                           placeholder-gray-400 text-white rounded-lg bg-gray-700/50
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                           transition-all duration-200"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-600 
                           placeholder-gray-400 text-white rounded-lg bg-gray-700/50
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                           transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                       text-sm font-medium rounded-lg text-white bg-blue-600
                  hover:bg-blue-700 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>

                  Giriş Yap
                </>
              )}
            </button>
          </div>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">veya</span>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/register"
            className="flex items-center justify-center gap-2 text-sm text-gray-300 hover:text-white transition-colors duration-200"
          >
            <FaUserPlus className="h-4 w-4" />
            Hesabınız yok mu ?<span className='font-bold '>Üye Ol</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;