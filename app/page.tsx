import ServiceCard from "./components/ServiceCard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Image from "next/image";

export default function Home() {
  const services = [
    {
      title: "GİŞE KIBRIS",
      image: "/GPW.png",
      description: "Etkinlik biletleri bir tık uzağında. Konserler, tiyatrolar, festivaller ve daha fazlası.",
      websiteUrl: "https://www.gisekibris.com",
      color: "#e91e63",
      socialLinks: {
        instagram: "https://www.instagram.com/gisekibris/",
        facebook: "https://www.facebook.com/gisekibris/",
        twitter: "https://x.com/gisekibris",
        youtube: "https://www.youtube.com/@gisekibris",
        tiktok: "https://www.tiktok.com/@gisekibris",
      },
    },
    {
      title: "KUPON KIBRIS",
      image: "/KKW.png",
      description: "İndirimler ve fırsatlar bir tık uzağında. En iyi fiyatlarla alışveriş yapın.",
      websiteUrl: "https://www.kuponkibris.com",
      color: "#00bcd4",
      socialLinks: {
        instagram: "https://www.instagram.com/kuponkibris/",
        facebook: "https://www.facebook.com/kuponkibris/",
        twitter: "https://x.com/kuponkibris",
        youtube: "https://www.youtube.com/@kuponkibris",
        tiktok: "https://www.tiktok.com/@kuponkibris",
      },
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a14' }}>
      <Navbar />
      
      {/* Hero + Cards Unified Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/PRCT-Banner.jpg"
            alt="banner"
            fill
            className="object-cover brightness-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a14] via-[#0a0a14]/90 to-[#0a0a14]/35"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#2b2973]/2 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#06b6d4]/1 rounded-full blur-[150px] pointer-events-none"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
          
          {/* Hero Text */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Kıbrıs&apos;ta teknolojik uygulamalarla
              <br />
              <span className="text-[#06b6d4]">hayatı kolaylaştır</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Fırsatlar, indirimler, etkinlik biletleri ve daha fazlası. 
              Tek üyelikle tüm platformlara eriş.
            </p>
          </div>

          {/* 3D Cards Container */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent via-[#06b6d4]/50 to-transparent -mt-16"></div>
            
            {/* Section Label */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse"></div>
                <span className="text-sm text-white/70 font-medium">Platformlarımız</span>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  title={service.title}
                  image={service.image}
                  description={service.description}
                  websiteUrl={service.websiteUrl}
                  socialLinks={service.socialLinks}
                  accentColor={service.color}
                  index={index}
                />
              ))}
            </div>

            {/* Bottom Glow */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-gradient-to-t from-[#2b2973]/20 to-transparent blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
