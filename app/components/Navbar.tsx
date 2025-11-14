import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/PracticApp_LOGO_by_gorkemdereli-2.png"
              alt="PracticApp Logo"
              width={200}
              height={50}
              priority
              className="h-12 w-auto"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}

