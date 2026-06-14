import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Activity, Calendar, Shield, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Modern Healthcare, <br />
                <span className="text-blue-600">Simplified.</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                CareFlow HMS provides seamless digital healthcare experiences. Book appointments, access your medical records, and consult with top doctors easily.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/register" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium text-lg transition-colors">
                  Get Started
                </Link>
                <Link href="/login" className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 font-medium text-lg transition-colors">
                  Patient Login
                </Link>
                <Link href="/login" className="bg-slate-800 text-white px-6 py-3 rounded-md hover:bg-slate-700 font-medium text-lg transition-colors">
                  Staff Portal
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
              <div className="w-full max-w-md h-80 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center">
                {/* Placeholder for Hero Image */}
                <span className="text-gray-400">Hospital Hero Image</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Comprehensive care tailored to your needs.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="p-6 bg-slate-50 border border-gray-100 rounded-lg text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
                <p className="text-gray-600">Schedule appointments online anytime.</p>
              </div>
              <div className="p-6 bg-slate-50 border border-gray-100 rounded-lg text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">EHR</h3>
                <p className="text-gray-600">Secure electronic health records access.</p>
              </div>
              <div className="p-6 bg-slate-50 border border-gray-100 rounded-lg text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Privacy</h3>
                <p className="text-gray-600">HIPAA compliant data storage.</p>
              </div>
              <div className="p-6 bg-slate-50 border border-gray-100 rounded-lg text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Staff</h3>
                <p className="text-gray-600">Highly qualified doctors and nurses.</p>
              </div>
            </div>
          </div>
        </section>
        {/* Doctors Section */}
        <section id="doctors" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Our Top Doctors</h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Meet our team of experienced professionals dedicated to your health.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Doctor 1 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full mb-4 flex items-center justify-center text-blue-600">
                  <span className="font-bold text-xl">DS</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Dr. Sarah Smith</h3>
                <p className="text-blue-600 font-medium mb-2">Cardiology</p>
                <p className="text-gray-500 text-sm">15+ years of experience in cardiovascular health.</p>
              </div>
              {/* Doctor 2 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full mb-4 flex items-center justify-center text-blue-600">
                  <span className="font-bold text-xl">JW</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Dr. James Wilson</h3>
                <p className="text-blue-600 font-medium mb-2">Neurology</p>
                <p className="text-gray-500 text-sm">Specialist in neurological disorders and treatments.</p>
              </div>
              {/* Doctor 3 */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full mb-4 flex items-center justify-center text-blue-600">
                  <span className="font-bold text-xl">EC</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Dr. Emily Chen</h3>
                <p className="text-blue-600 font-medium mb-2">Pediatrics</p>
                <p className="text-gray-500 text-sm">Dedicated to providing compassionate care for children.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
