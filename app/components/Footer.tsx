import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full  " style={{ backgroundColor: '#2b2973' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center text-center gap-6">
          <p className="text-white text-sm md:text-base font-medium">
          © 2025 PracticApp.net Prasol Media Ltd. | Tüm Hakları Saklıdır.
          </p>
          
        </div>
      </div>
    </footer>
  );
}

