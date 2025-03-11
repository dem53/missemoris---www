import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AbonelerContent() {

  const [aboneData, setAboneData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const aboneDataFonk = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/abones', {
          headers: {
            "Content-Type": 'application/json'
          }
        });
        console.log("ABONE VERİ İNFO", response.data);
        console.log("ABONE VERİ", response.data.abones);
        const dataAbone = response.data.abones;
        const dataAboneDate = dataAbone.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        if (dataAbone) {
          setAboneData(dataAboneDate);
        }
      } catch (error) {
        console.error('Veri alınırken hata', error);
        setError('Veri alınırken bir hata oluştu');
      } finally {
        setLoading(false);
        console.log('Fonksiyon bitiş....');
      }
    };

    aboneDataFonk();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'long', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false, 
    }).format(date);
  };
  
  return (
    <div className="container mx-auto mt-32 bg-gray-50 p-10 rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-emerald-100 table-auto border-collapse">
          <thead>
            <tr className="border-b bg-gray-800 text-white rounded-lg">
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-100">Ad</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-100">Soyad</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-100">Email</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-100">Telefon</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-100">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {aboneData && aboneData.length > 0 ? (aboneData.map((abones) => (
              <tr key={abones._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 text-sm text-gray-800">{abones.name}</td>
                <td className="py-3 px-6 text-sm text-gray-800">{abones.lastname}</td>
                <td className="py-3 px-6 text-sm text-gray-800">{abones.email}</td>
                <td className="py-3 px-6 text-sm text-gray-800">{abones.phone}</td>
                <td className="py-3 px-6 text-sm text-gray-800">{formatDate(abones.createdDate)}</td>
              </tr>
            ))): (
              <td colSpan={5} className='w-full text-center text-lg montserrat my-8 p-10'>Listelenecek abone bulunamadı.</td>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AbonelerContent;
