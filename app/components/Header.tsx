import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full relative overflow-hidden " style={{ backgroundColor: '#2b2973' }}>
      {/* Arka Plan Banner */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/PRCT-Banner.jpg"
          alt="banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* İçerik */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-6xl">
          {/* Ana Başlık */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-white leading-tight ">
            Kıbrıs'ta teknolojik uygulamalarla 
             
            </h1>
            <p className="text-4xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">hayatı kolaylaştır</p>
          </div>

          {/* Açıklama */}
          <div className="max-w-1xl">
           

            <p className="text-base md:text-2xl text-white/90 leading-relaxed">
              Fırsatlar, indirimler, etkinlik biletleri, restoran rezervasyonları ve daha fazlası.
              
            </p>
            <p className="text-base md:text-2xl text-white/90 leading-relaxed">Tek üyelikle tüm platformlara eriş, Kıbrıs'taki günlük yaşamını tek uygulamadan yönet.</p>
            <p className="text-base md:text-2xl text-white/90 leading-relaxed">Özel fırsatlar ve indirimler Etkinlik ve restoran rezervasyonları.</p>
          </div>
        </div>
      </div>
    </header>
  );
}

