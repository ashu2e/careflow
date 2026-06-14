import { useState } from 'react';
import { X, Pill, History, Calendar, FileText } from 'lucide-react';

interface PrescribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock history data
const pastPrescriptions = [
  {
    id: '1',
    date: '2026-05-10',
    medication: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Twice daily',
    status: 'Completed'
  },
  {
    id: '2',
    date: '2026-04-15',
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    status: 'Active'
  },
  {
    id: '3',
    date: '2025-11-02',
    medication: 'Ibuprofen',
    dosage: '400mg',
    frequency: 'As needed',
    status: 'Completed'
  }
];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl mx-auto z-50">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-2xl shadow-2xl outline-none focus:outline-none overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-solid border-gray-100 bg-gray-50/80">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Pill className="w-5 h-5 mr-2 text-teal-600" />
              Prescription Management
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
          <div className="flex flex-col md:flex-row">
            
            {/* Left Column: Write new prescription */}
            <div className="w-full md:w-1/2 p-6 border-r border-gray-100">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-teal-600 mb-4 block">New Prescription</h4>
              
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

                <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end">
                  <button
                    className="bg-teal-600 text-white hover:bg-teal-700 font-medium px-5 py-2.5 rounded-md outline-none focus:outline-none transition-all duration-150 flex items-center shadow-sm w-full justify-center md:w-auto"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Pill className="w-4 h-4 mr-2" />
                    )}
                    Prescribe Medication
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Past History */}
            <div className="w-full md:w-1/2 bg-gray-50 p-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-600 mb-4 flex items-center">
                <History className="w-4 h-4 mr-2" />
                Past History
              </h4>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {pastPrescriptions.map((rx) => (
                  <div key={rx.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-teal-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-gray-900">{rx.medication} {rx.dosage}</h5>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${rx.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {rx.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2 flex flex-col space-y-1">
                      <span className="flex items-center"><FileText className="w-3.5 h-3.5 mr-1 text-gray-400" /> {rx.frequency}</span>
                      <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" /> Prescribed on {new Date(rx.date).toLocaleDateString()}</span>
                    </div>
                    <button className="text-teal-600 text-xs font-medium hover:text-teal-800 transition-colors mt-1">
                      + Re-prescribe
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
