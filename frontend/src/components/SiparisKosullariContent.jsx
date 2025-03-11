import React from 'react';
import { Link } from 'react-router-dom';

function SiparisKosullariContent() {
    return (

        <div className="container mx-auto p-6">
            <div className='mt-16 flex flex-col border-b-2 justify-between items-start'>
                <div className='flex flex-row items-center montserrat gap-2 mb-4'>
                    <div className='text-gray-400'>
                        <Link to='/'>
                            Anasayfa
                        </Link>
                    </div>
                    <div>
                        <h1 className='text-gray-400'>/</h1>
                    </div>
                    <div className='py-4'>
                        <h1 className='text-lg font-semibold text-gray-800'>Teslimat ve Sipariş Koşulları</h1>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-md flex flex-col rounded-lg p-6 mb-6">
                <h2 className="text-2xl montserrat font-semibold mt-6 mb-4">Ödeme Seçenekleri</h2>
                <p className="mb-12">
                    Siparişlerinizin ödemesini kredi kartı veya banka havalesi yoluyla yapabilirsiniz.
                </p>
                <h3 className="font-semibold montserrat text-xl mb-4">Kredi Kartı İşlemleri</h3>
                <p className="mb-4 font-sans font-extralight">
                    Alışverişlerinizi güvenle yapabilmeniz için kredi kartı bilgileriniz 128 bit SSL kullanılarak şifrelenmektedir.
                    SSL bağlantısının aktif olduğunu, sipariş işlemleri sırasında kart bilgilerinizi girdiğiniz sayfaya geçtiğinizde,
                    tarayıcınızın adres çubuğunun hemen yanında görüntülenecek olan kilit simgesinden anlayabilirsiniz.
                </p>
                <h3 className="font-semibold text-xl montserrat mb-4">Havale/EFT Ödemeleri</h3>
                <p className="mb-4 font-sans font-extralight">
                    İsterseniz siparişinize ait ödemenizi banka havalesi yoluyla da yapabilirsiniz.
                    Sipariş işlemlerinizi havale seçeneğini tercih ederek tamamladıktan sonra, belirtilen tutarı banka hesap numaralarımıza göndermeniz yeterlidir.
                    Siparişinizin en hızlı şekilde onaylanıp gönderilebilmesi için, lütfen havale işlemini tamamladıktan sonra havale bildirim formumuzu kullanarak bilgi veriniz.
                    Siparişi takip eden 3 iş günü içerisinde havalesi yapılmayan siparişler iptal edilmektedir.
                </p>
                <h3 className="font-semibold text-xl montserrat mb-4">Teslimat Bilgileri</h3>
                <p className="mb-4 font-sans font-extralight">
                    Kredi kartıyla yapılan ödemelerde, ilgili bankanın onayı ve güvenlik birimimizin kontrolünü takip eden 3 iş günü içerisinde,
                    havale ile yapılan ödemelerde ise ödemenin hesabımıza geçmesini takip eden 3 iş günü içerisinde siparişiniz kargoya verilir.
                    Adrese teslim kargo hizmeti, seçilmiş olan kargo firmasının ulaşım dahilinde olan bölgelere yapılır.
                    Kargo firmasının adrese teslim bölgesinde yer almayan bölgelere telefon ihbarlı, kargo ofisinden teslimat gerçekleşir.
                    Herhangi bir sorunuz ya da sorununuz olduğunda lütfen iletişim adreslerimizden irtibata geçiniz.
                </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">İletişim Bilgileri</h2>
                <p className="mb-1"><strong>Ünvanı:</strong> LAPANDİA</p>
                <p className="mb-1"><strong>Telefonu:</strong> 0555 000 00 00</p>
                <p className="mb-1"><strong>Adresi:</strong> Merkez Mh. Talat pasa Cd. 1550 sk. Meydan/ANTALYA</p>
                <p className="mb-1"><strong>Mail:</strong> <a href="mailto:info@lapantia.com" className="text-blue-500 hover:underline">info@lapantia.com</a></p>
            </div>
        </div>
    );
}

export default SiparisKosullariContent;