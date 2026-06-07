export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <span className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} CareFlow HMS. All rights reserved.
            </span>
          </div>
          <div className="mt-4 md:mt-0 flex justify-center space-x-6 text-sm text-gray-500">
            123 Health Ave, Medical City, MC 10010 | Contact: info@careflow.com
          </div>
        </div>
      </div>
    </footer>
  );
}
