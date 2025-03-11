import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import ConfirmBox from './ConfirmBox';
import UserEklemeModal from './UserEkleModal';
import UserUpdateModal from './UserUpdateModal';
import { useNavigate, Link } from 'react-router-dom';

const UserData = () => {
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isUserAddModalOpen, setIsUserAddModalOpen] = useState(false);
    const [isUserUpdateModalOpen, setIsUserUpdateModalOpen] = useState(false);
    const [userToUpdate, setUserToUpdate] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [filter, setFilter] = useState({ name: '', surname: '', email: '', number: '' });

    const navigate = useNavigate();

    const formatDateToTurkish = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatAdminStatus = (isAdmin) => {
        return isAdmin ? (
            <span className="text-white bg-emerald-500 font-sans p-1 text-sm rounded-md font-medium">Evet</span>
        ) : (
            <span className="text-white bg-red-500 font-sans p-1 text-sm rounded-md font-medium">Hayır</span>
        );
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Token bulunamadı, lütfen giriş yapın');
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:5000/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data.users);
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Kullanıcıları alırken bir hata oluştu');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!id) {
            console.error('Böyle bir ID ait kullanıcı yok.');
            return;
        }
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:5000/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(users.filter(user => user._id !== id));
            alert('Kullanıcı başarıyla silindi');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Kullanıcı silinirken bir hata oluştu');
            console.error(err);
        } finally {
            setIsConfirmOpen(false);
            setUserToDelete(null);
        }
    };

    useEffect(() => {
        const checkAdminAndFetchUsers = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Token bulunamadı, lütfen giriş yapın');
                setLoading(false);
                navigate('/login');
                return;
            }

            try {
                const decoded = jwtDecode(token);
                if (!decoded.isAdmin) {
                    alert('Bu sayfaya erişim yetkiniz yok!');
                    navigate('/');
                    return;
                }
                await fetchUsers();
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Kullanıcıları alırken bir hata oluştu');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        checkAdminAndFetchUsers();
    }, []);

    // Filter users based on the filter state
    const filteredUsers = users.filter(user => {
        const matchesName = user.ad.toLowerCase().includes(filter.name.toLowerCase());
        const matchesSurname = user.soyad.toLowerCase().includes(filter.surname.toLowerCase());
        const matchesEmail = user.email.toLowerCase().includes(filter.email.toLowerCase());
        const matchesNumber = user.number.toLowerCase().includes(filter.number.toLowerCase());
        return matchesName && matchesSurname && matchesEmail && matchesNumber;
    });

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleUsersPerPageChange = (e) => {
        setUsersPerPage(Number(e.target.value));
        setCurrentPage(1); // Sayfa değiştiğinde ilk sayfaya dön
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-5">
            <div className="flex justify-between items-start gap-4 flex-col mt-20 mb-6">
                <div className='flex flex-row items-center montserrat gap-2'>
                    <div className='text-gray-400'>
                        <Link to='/'>
                            Anasayfa
                        </Link>
                    </div>
                    <div>
                        <h1 className='text-gray-400'>/</h1>
                    </div>
                    <div className='py-4'>
                        <h1 className='text-lg font-semibold text-gray-800'>Kullanıcı Yönetimi</h1>
                    </div>
                </div>
                <div className='border w-full border-gray-300 '></div>
                <button
                    className="bg-green-500 text-white px-4 py-2 text-sm rounded hover:bg-green-600 my-3 flex items-center"
                    onClick={() => setIsUserAddModalOpen(true)}
                >
                    Kullanıcı Ekle
                </button>
            </div>

            {/* Filtreleme */}
            <div className="mb-4 flex items-start gap-3 flex-col">
                <div>
                    <h1 className='montserrat text-xl'>Kullanıcı Ara...</h1>
                </div>

                <div className='flex items-center justify-start flex-wrap gap-4'>
                    <input
                        type="text"
                        placeholder="Ad"
                        value={filter.name}
                        onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                        className="border border-gray-500 rounded text-sm raleway p-1 mr-2"
                    />
                    <input
                        type="text"
                        placeholder="Soyad"
                        value={filter.surname}
                        onChange={(e) => setFilter({ ...filter, surname: e.target.value })}
                        className="border border-gray-500 rounded text-sm raleway p-1 mr-2"
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        value={filter.email}
                        onChange={(e) => setFilter({ ...filter, email: e.target.value })}
                        className="border border-gray-500 rounded text-sm raleway p-1 mr-2"
                    />
                    <input
                        type="text"
                        placeholder="Telefon"
                        value={filter.number}
                        onChange={(e) => setFilter({ ...filter, number: e.target.value })}
                        className="border border-gray-500 raleway text-sm rounded p-1"
                    />

                </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-6 overflow-x-auto">
                <h1 className="text-3xl font-sans font-light text-start mb-6">Tüm Kullanıcılar Listesi</h1>
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white font-sans">
                        <tr>
                            <th className="py-2 px-6 text-left font-medium text-sm">Ad</th>
                            <th className="py-2 px-6 text-left font-medium text-sm">Soyad</th>
                            <th className="py-2 px-6 text-left font-medium text-sm">Email</th>
                            <th className="py-2 px-6 text-left font-medium text-sm">Telefon</th>
                            <th className="py-2 px-6 text-left font-medium text-sm">Admin</th>
                            <th className="py-2 px-6 text-left font-medium text-sm">Kayıt Tarihi</th>
                            <th className="py-2 px-6 text-center font-medium text-sm">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user._id} className={`border-t ${user.isAdmin ? 'bg-emerald-50' : 'bg-yellow-50'} hover:bg-opacity-90 transition-colors duration-200`}>
                                <td className="py-3 px-6 text-sm font-medium text-gray-800">{user.ad}</td>
                                <td className="py-3 px-6 text-sm font-medium text-gray-800">{user.soyad}</td>
                                <td className="py-3 px-6 text-sm font-medium text-gray-800">{user.email}</td>
                                <td className="py-3 px-6 text-sm font-medium text-gray-800">{user.number}</td>
                                <td className={`py-3 px-6 text-sm font-medium text-gray-800`}>{formatAdminStatus(user.isAdmin)}</td>
                                <td className="py-3 px-6 text-sm font-medium text-gray-800">{formatDateToTurkish(user.date)}</td>
                                <td className="py-3 px-6 text-sm font-medium text-gray-800 flex flex-row items-start justify-center">
                                    <button
                                        type='button'
                                        className='bg-blue-500 p-1 px-4 text-xs rounded-md text-white font-sans mr-2'
                                        onClick={() => {
                                            setUserToUpdate(user);
                                            setIsUserUpdateModalOpen(true);
                                        }}
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        type='button'
                                        className='bg-red-500 p-1 px-4 text-xs rounded-md text-white font-sans'
                                        onClick={() => {
                                            setUserToDelete(user._id);
                                            setIsConfirmOpen(true);
                                        }}
                                    >
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <div>
                    <label className="mr-2">Sayfa başına kullanıcı sayısı:</label>
                    <select value={usersPerPage} onChange={handleUsersPerPageChange} className="border rounded p-2">
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <div className="flex">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            <UserEklemeModal
                isOpen={isUserAddModalOpen}
                onClose={() => setIsUserAddModalOpen(false)}
            />

            <UserUpdateModal
                isOpen={isUserUpdateModalOpen}
                onClose={() => setIsUserUpdateModalOpen(false)}
                id={userToUpdate ? userToUpdate._id : null}
                userData={userToUpdate}
            />

            <ConfirmBox
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => {
                    console.log('Silinecek Kullanıcı ID:', userToDelete);
                    if (userToDelete) {
                        deleteUser(userToDelete);
                    }
                }}
                message="Bu kullanıcıyı silmek istediğinize emin misiniz?"
            />
        </div >
    );
};

export default UserData;