import Link from "next/link";
import ServiceCard from "./components/ServiceCard";
import Header from "./components/Header";

export default function Home() {
  const services = [
    
    {
      title: "GİŞE KIBRIS",
      logoPosition: "right" as const,
      image: "/GPW.png",
      description:
        "Etkinlik biletleri bir tık uzağında.",
      websiteUrl: "https://www.gisekibris.com",
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
      logoPosition: "left" as const,
      image: "/KKW.png",
      description:
        "İndirimler ve fırsatlar bir tık uzağında.",
      websiteUrl: "https://www.kuponkibris.com",
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
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Services Section */}
        

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8  ">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              logoPosition={service.logoPosition}
              image={service.image}
              description={service.description}
              websiteUrl={service.websiteUrl}
              socialLinks={service.socialLinks}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
