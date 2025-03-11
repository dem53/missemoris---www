import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
    
    const [activeIndex, setActiveIndex] = useState(null);

    const questions = [
        {
            question: "1. Ürünlerinizin garantisi var mı ?",
            answer: "Evet, tüm ürünlerimiz 2 yıl garanti kapsamındadır."
        },
        {
            question: "2. Ürün iade süreci nasıl işliyor ?",
            answer: "Ürünlerinizi 14 gün içinde iade edebilirsiniz. İade süreci için müşteri hizmetlerimizle iletişime geçin."
        },
        {
            question: "3. Kargo ücretleri ne kadar ?",
            answer: "Kargo ücretleri, sipariş tutarınıza göre değişiklik göstermektedir. 200 TL ve üzeri siparişlerde kargo ücretsizdir."
        },
        {
            question: "4. Siparişimi nasıl takip edebilirim ?",
            answer: "Siparişinizi takip etmek için e-posta adresinize gönderilen takip linkini kullanabilirsiniz."
        },
        {
            question: "5. Ürünleriniz nereden temin ediliyor ?",
            answer: "Ürünlerimiz, güvenilir ve sertifikalı tedarikçilerden temin edilmektedir."
        },
        {
            question: "6. Hangi ödeme yöntemlerini kabul ediyorsunuz ?",
            answer: "Kredi kartı, banka havalesi ve kapıda ödeme gibi çeşitli ödeme yöntemlerini kabul ediyoruz."
        },
        {
            question: "7. Ürünlerinizi nasıl temizlemeliyim ?",
            answer: "Her ürün için özel bakım talimatları bulunmaktadır. Ürün sayfasında bu bilgilere ulaşabilirsiniz."
        },
        {
            question: "8. Ürünlerinizde indirim kampanyaları var mı ?",
            answer: "Evet, belirli dönemlerde indirim kampanyaları düzenliyoruz. Bültenimize abone olarak güncel kampanyalardan haberdar olabilirsiniz."
        },
        {
            question: "9. Müşteri hizmetlerine nasıl ulaşabilirim ?",
            answer: "Müşteri hizmetlerimize e-posta veya telefon ile ulaşabilirsiniz. İletişim bilgileri web sitemizde mevcuttur."
        },
        {
            question: "10. Ürünlerinizin stok durumu nasıl kontrol ediliyor ?",
            answer: "Stok durumu, ürün sayfasında anlık olarak güncellenmektedir."
        }
    ];

    const toggleAnswer = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="container mx-auto p-5 bg-gray-100 rounded-lg shadow-md">
            <div className='flex flex-row items-center mt-16 montserrat gap-2 mb-4'>
                <div className='text-gray-400'>
                    <Link to='/'>
                        Anasayfa
                    </Link>
                </div>
                <div>
                    <h1 className='text-gray-400'>/</h1>
                </div>
                <div className='py-4'>
                    <h1 className='text-lg font-semibold text-gray-800'>Sıkça Sorulan Sorular</h1>
                </div>
            </div>

            <div className="border-t border-gray-300">
                {questions.map((item, index) => (
                    <div key={index} className="border-b border-gray-300">
                        <div
                            className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-200 transition"
                            onClick={() => toggleAnswer(index)}
                        >
                            <span className="font-medium raleway">{item.question}</span>
                            <span className={`transform transition-transform ${activeIndex === index ? 'rotate-180' : ''}`}>
                                ▼
                            </span>
                        </div>
                        {activeIndex === index && (
                            <div className="p-4 py-8 bg-gray-50">
                               - {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;