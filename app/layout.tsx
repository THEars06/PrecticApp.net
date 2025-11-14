import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "PracticApp - Kıbrısta Hayatı Kolaylaştıran Uygulamalar",
  description: "Tek üyelikle tüm platformlara erişim. Fırsatlar, indirimler, etkinlik biletleri, restoran rezervasyonları ve daha fazlası. Kupon Kıbrıs ve Gişe Kıbrıs ile Kıbrıs'taki günlük yaşamını tek uygulamadan yönet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${poppins.className} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
