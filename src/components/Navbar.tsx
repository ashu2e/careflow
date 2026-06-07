import Link from "next/link";
import { Stethoscope } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">CareFlow HMS</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#services" className="text-gray-600 hover:text-blue-600 font-medium">Services</Link>
            <Link href="#doctors" className="text-gray-600 hover:text-blue-600 font-medium">Doctors</Link>
            <Link href="#contact" className="text-gray-600 hover:text-blue-600 font-medium">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">Log in</Link>
            <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium transition-colors">
              Patient Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
