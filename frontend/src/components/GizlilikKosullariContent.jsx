import React from 'react';
import { Link } from 'react-router-dom';

function GizlilikKosullariContent( { onClose } ) {
  return (

    <div className="container mx-auto p-6">

      <div className=' flex flex-col justify-between items-start'>
  
      </div>
      <h1 className='w-full mt-7 flex items-end justify-end pr-2 montserrat  text-xl '>
      
      <button onClick={onClose} className='bg-red-400 p-1.5 px-3 rounded-md cursor-poimter hover:bg-red-600 duration-300 transition-all ease-in-out text-white'>X</button> </h1>
      <h1 className="text-3xl font-bold mb-4 text-center mt-8">Kişisel Verilerin Korunmasına İlişkin Bilgilendirme</h1>
 
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p className="mb-4 font-semibold font-sans">
          LAPANDİA olarak kişisel verilerinizin 6698 sayılı Kişisel Verilerin Korunması Kanunu'na (“Kanun”) uygun olarak işlenerek, muhafaza edilmesine büyük önem veriyoruz.
          Müşterilerimizi kişisel verileri toplama, işleme, aktarma amacımız ve yöntemlerimiz ve buna bağlı olarak sizlerin Kanun'dan kaynaklanan haklarınızla ilgili bilgilendirmek isteriz.
        </p>

        <h2 className="text-2xl font-semibold mb-2">1. Kişisel verilerin toplanmasına ilişkin yöntemler</h2>
        <p className="mb-4 font-sans font-extralight">
          LAPANDİA olarak, veri sorumlusu sıfatıyla, mevzuattan kaynaklanan yasal yükümlülüklerimiz çerçevesinde; markalarımızın hizmetlerinden faydalanabilmeniz,
          onayınız halinde kampanyalarımız hakkında sizleri bilgilendirmek, öneri ve şikayetlerinizi kayıt altına alabilmek, sizlere daha iyi hizmet standartları oluşturabilmek,
          LAPANDİA ticari ve iş stratejilerinin belirlenmesi ve uygulanması gibi amaçlarla kişisel verilerinizi sözlü, internet sitesi, sosyal medya mecraları,
          mobil uygulamalar ve benzeri vasıtalarla sözlü, yazılı ya da elektronik yöntemlerle toplamaktayız.
        </p>

        <h2 className="text-2xl font-semibold mb-2">2. Kişisel verilerin işlenmesi ve işleme amaçları</h2>
        <p className="mb-4 font-sans font-extralight">
          LAPANDİA olarak, veri sorumlusu sıfatı ile çağrı merkezlerimiz, yazılı iletişim kanallarımız, sosyal medya sayfalarımız, mobil iletişim kanalları,
          mağaza içi iletişim kanalları ve/veya bunlarla sınırlı olmamak üzere her türlü kanallar aracılığı ile; onayınız dahilinde elde ettiğimiz kişisel ve/veya
          özel nitelikli kişisel verileriniz tamamen veya kısmen elde edilebilir, kaydedilebilir, saklanabilir, depolanabilir, değiştirilebilir, güncellenebilir,
          periyodik olarak kontrol edilebilir, yeniden düzenlenebilir, sınıflandırılabilir, işlendikleri amaç için gerekli olan ya da ilgili kanunda öngörülen süre
          kadar muhafaza edilebilir, kanuni ya da hizmete bağlı fiili gereklilikler halinde LAPANDİA'nın birlikte çalıştığı özel-tüzel kişilerle ya da
          kanunen yükümlü olduğu kamu kurum ve kuruluşlarıyla ve/veya Türkiye’de veya yurt dışında mukim olan ilgili 3. kişi gerçek kişi/tüzel kişilerle paylaşılabilir/devredilebilir,
          kanuni ya da hizmete bağlı fiili gereklilikler halinde yurtdışına aktarılabilir.
        </p>

        <h2 className="text-2xl font-semibold mb-2">3. Kişisel Verilerin Aktarılması ve Paylaşılması</h2>
        <p className="mb-4 font-sans font-extralight">
          LAPANDİA, söz konusu kişisel verilerinizi sadece; açık rızanıza istinaden veya Kanun'da belirtilen güvenlik ve gizlilik esasları çerçevesinde yeterli
          önlemler alınmak kaydıyla yurt içinde ve gerekli güvenlik önlemlerinin alınması kaydıyla yurt dışında, Şirket faaliyetlerinin yürütülmesi, veri sahipleri ile
          müşterilerimiz arasındaki iş ilişkisinin sağlanması ve/veya bu amaçla görüşmeler yapılması, hizmetler, fırsat ve olanaklar sunulması ve hizmet kalitesinin artırılması
          amacıyla; grup şirketlerimiz, iş ortaklarımız, faaliyetlerimizin gereği anlaşmalı olduğumuz ve hizmet sunduğumuz müşteriler, tedarikçiler, denetim şirketleri veya
          yasal bir zorunluluk gereği bu verileri talep etmeye yetkili olan kamu kurum veya kuruluşları, bunlarla sınırlı olmamak üzere ilgili diğer otoriteler ile paylaşabilecektir.
        </p>

        <h2 className="text-2xl font-semibold mb-2">4. Kişisel Veri Sahibinin KVK Kanunu'nun (“Kanun”) 11. maddesinde Sayılan Hakları</h2>
        <p className="mb-4">
          LAPANDİA ilgili kişilerin aşağıdaki taleplerine karşılık verecektir:
        </p>
        <ul className="list-disc list-inside mb-4 font-sans font-extralight">
          <li>a) LAPANDİA.com kendilerine ilişkin kişisel verileri işleyip işlemediğini ve hangi kişisel verileri işlediğini öğrenme,</li>
          <li>b) İşleme faaliyetinin amaçlarına ilişkin bilgi alma,</li>
          <li>c) LAPANDİA’nın yurt içinde veya yurt dışında kişisel verileri aktardığı üçüncü kişileri bilme,</li>
          <li>d) Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
          <li>e) Kanun'a uygun olarak kişisel verilerin silinmesini veya yok edilmesini isteme,</li>
          <li>f) Kişisel verilerin düzeltilmesi, silinmesi ya da yok edilmesi talebi halinde; yapılan işlemlerin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
          <li>g) İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme ve;</li>
          <li>h) Kişisel verilerinin birer kopyasını alma.</li>
        </ul>
        <p className="mb-4">
          Görüş ve sorularınızla ilgili bizimle iletişime geçebilirsiniz.
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">İletişim Bilgileri</h2>
        <p className="mb-1"><strong>Ünvanı:</strong> LAPANDİA</p>
        <p className="mb-1"><strong>Telefonu:</strong> +90 555 000 10 06</p>
        <p className="mb-1"><strong>Vergi Dairesi:</strong> Kızılbey</p>
        <p className="mb-1"><strong>Vergi No:</strong> 71509070368</p>
        <p className="mb-1"><strong>Adresi:</strong> Kale Mah. Alataş Sokak No:3/1 Ulus Ankara</p>
        <p className="mb-1"><strong>Mail:</strong> <a href="mailto:info@LAPANDİA.com" className="text-blue-500 hover:underline">info@LAPANDİA.com</a></p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-semibold mb-4">Gizlilik ve Güvenlik</h2>
        <p className="mb-4 font-sans font-extralight">
          LAPANDİA, müşterilerine daha iyi hizmet verebilmek amacıyla bazı kişisel bilgilerinizi (isim, yaş, ilgi alanlarınız, e-posta vb.) sizlerden talep etmektedir.
          LAPANDİA sunucularında toplanan bu bilgiler, dönemsel kampanya çalışmaları, müşteri profillerine yönelik özel promosyon faaliyetlerinin kurgulanması ve
          istenmeyen e-postaların iletilmemesine yönelik müşteri "sınıflandırma" çalışmalarında sadece LAPANDİA.com bünyesinde kullanılmaktadır.
          LAPANDİA.com, üyelik formlarından topladığı bilgileri söz konusu üyenin haberi ya da aksi bir talimatı olmaksızın, üçüncü şahıslarla kesinlikle paylaşmamakta,
          faaliyet dışı hiçbir nedenle ticari amaçla kullanmamakta ve de satmamaktadır.
        </p>
        <p className="mb-4 font-sans font-extralight">
          Müşteri bilgileri, ancak resmi makamlarca bu bilgilerin talep edilmesi halinde ve yürürlükteki emredici mevzuat hükümleri gereğince resmi makamlara açıklama yapmak zorunda olduğu durumlarda resmi makamlara açıklanabilecektir.
        </p>
        <p className="mb-4 font-sans font-extralight">
          Müşterinin sisteme girdiği tüm bilgilere sadece müşteri ulaşabilmekte ve bu bilgileri sadece müşteri değiştirebilmektedir.
          Bir başkasının bu bilgilere ulaşması ve bunları değiştirmesi mümkün değildir. Ödeme sayfasında istenen kredi kartı bilgileriniz,
          siteden alışveriş yapan siz değerli müşterilerimizin güvenliğini en üst seviyede tutmak amacıyla hiçbir şekilde LAPANDİA.com veya ona hizmet veren şirketlerin sunucularında tutulmamaktadır.
          Bu şekilde ödemeye yönelik tüm işlemlerin LAPANDİA.com ara yüzü üzerinden banka ve bilgisayarınız arasında gerçekleşmesi sağlanmaktadır.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-semibold mb-4">Çerez Kullanımı</h2>
        <p className="mb-4 font-sans font-extralight">
          Çerezler, sitemizi ziyaret ettiğinizde bilgisayarınız ya da mobil cihazınıza (akıllı telefon veya tablet gibi) kaydedilen küçük metin dosyaları ya da bilgilerdir.
        </p>
        <p className="mb-4 font-sans font-extralight">
          Çerezleri, Sitelerimizin daha kolay kullanılması ve sizin ilgi ve ihtiyaçlarınıza göre ayarlanması için kullanıyoruz.
          İnternet siteleri bu çerez dosyaları okuyup yazabiliyorlar ve bu sayede tanınmanız ve size daha uygun bir internet sitesi sunulması amacıyla
          sizinle ilgili önemli bilgilerin hatırlanması sağlanıyor (tercih ayarlarınızın hatırlanması gibi).
        </p>
        <p className="mb-4 font-sans font-extralight">
          Çerezler ayrıca, Sitelerimiz üzerinde gelecekteki hareketlerinizin hızlanmasına da yardımcı olur.
          Bunlara ek olarak, ziyaretçilerin Sitelerimizi nasıl kullandığını anlamak ve Sitelerimizin tasarımını ve kullanışlılığını geliştirmek amacıyla
          çerezleri Sitelerimizin kullanımı hakkında istatistiksel bilgiler toplamak için de kullanabiliriz.
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mt-6">
        <h2 className="text-xl font-semibold mb-2">İletişim Bilgileri</h2>
        <p className="mb-1"><strong>Ünvanı:</strong> LAPANDİA</p>
        <p className="mb-1"><strong>Telefonu:</strong> +90 850 335 10 06</p>
        <p className="mb-1"><strong>Adresi:</strong> Kale Mah. Alataş Sokak No:3/1 Ulus Ankara</p>
        <p className="mb-1"><strong>Mail:</strong> <a href="mailto:info@LAPANDİA.com" className="text-blue-500 hover:underline">info@LAPANDİA.com</a></p>
      </div>
    </div>
  );
}

export default GizlilikKosullariContent;