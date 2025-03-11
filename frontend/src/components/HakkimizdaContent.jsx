import React from 'react'
import { Link } from 'react-router-dom'

function HakkimizdaContent() {
    return (
        <div className='container mx-auto px-6 py-12'>
            <div className='flex flex-row items-center w-full border-b-2 mt-16 montserrat gap-2 mb-4'>
                <div className='text-gray-400'>
                    <Link to='/'>
                        Anasayfa
                    </Link>
                </div>
                <div>
                    <h1 className='text-gray-400'>/</h1>
                </div>
                <div className='py-4'>
                    <h1 className='text-lg font-semibold text-gray-800'>Hakkımızda</h1>
                </div>
            </div>

            <div className='flex flex-col gap-8 mt-10 my-10 text-lg text-gray-700 leading-relaxed'>
                <p className='text-xl'>
                    Hoş geldiniz! LA PANDİA olarak, siz değerli müşterilerimize sadece şık ve kaliteli giyim değil, aynı zamanda kendinizi özel ve rahat hissedeceğiniz bir alışveriş deneyimi sunmayı hedefliyoruz. Her ürünümüz, stilinize değer katmak ve günlük yaşamınıza renk katmak için özenle seçilmiştir.
                </p>

                <p className='text-xl'>
                    Bizim için her şeyden önce **güven** gelir. Bu yüzden, sadece kaliteli ürünler değil, aynı zamanda güvenli alışveriş imkanı ve sorunsuz müşteri deneyimi sağlamak bizim önceliğimiz. La Pandia’da, bir kıyafet alırken sadece fiziksel değil, aynı zamanda duygusal bir bağ kurmanızı istiyoruz. Alışverişinizin her aşamasında, kendinizi güvende ve değerli hissedeceksiniz.
                </p>

                <p className='text-xl'>
                    **Misyonumuz**, giyimin gücüne inanan, tarzını yansıtırken rahatlığı da önemseyen herkesin hayatına dokunabilmek. Moda sadece dış görünüşü değil, kişiliği de ifade eder. Biz, La Pandia olarak, tarzınızı bulmanıza ve ona özgürce hayat vermenize yardımcı olmak için buradayız.
                </p>

                <p className='text-xl'>
                    Her yeni koleksiyonumuzla, size sadece en trend ve kaliteli ürünleri sunmayı değil, aynı zamanda sizinle güven ve sevgi dolu bir bağ kurmayı arzuluyoruz. Çünkü **La Pandia**, sadece bir marka değil, sizin stil yolculuğunuzun bir parçasıdır.
                </p>

                <p className='text-xl'>
                    Bize katılın, birlikte büyüyelim. Tarzınız, bizimle her zaman daha güzel.
                </p>
            </div>

        </div>
    )
}

export default HakkimizdaContent
