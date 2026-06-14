import { useState } from 'react';
import { X, Pill } from 'lucide-react';

interface PrescribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrescribeModal({ isOpen, onClose }: PrescribeModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      alert("Prescription added successfully!");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md mx-auto my-6 z-50">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-xl shadow-2xl outline-none focus:outline-none overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-solid border-gray-100 bg-gray-50/80">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Pill className="w-5 h-5 mr-2 text-teal-600" />
              New Prescription
            </h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-gray-400 hover:text-gray-900 float-right text-3xl leading-none font-semibold outline-none focus:outline-none rounded-full hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              <span className="block w-6 h-6 flex items-center justify-center text-xl">
                <X className="w-5 h-5" />
              </span>
            </button>
          </div>
          
          {/* Body */}
          <div className="relative p-6 flex-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Amoxicillin" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 500mg" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white">
                    <option>Once daily</option>
                    <option>Twice daily</option>
                    <option>Three times daily</option>
                    <option>As needed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions (Optional)</label>
                <textarea 
                  rows={3}
                  placeholder="Take with food..." 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end pt-4 border-t border-solid border-gray-100 rounded-b mt-6">
                <button
                  className="text-gray-500 bg-white hover:bg-gray-100 border border-gray-200 font-medium px-4 py-2 rounded-md outline-none focus:outline-none mr-2 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-teal-600 text-white active:bg-teal-700 hover:bg-teal-700 font-medium px-4 py-2 rounded-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 flex items-center"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : null}
                  Prescribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
