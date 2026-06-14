import { useState } from 'react';
import { X, FlaskConical } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { PatientQueueItem } from '@/hooks/useRealtimeQueue';

interface OrderLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientQueueItem | null;
}

export function OrderLabModal({ isOpen, onClose, patient }: OrderLabModalProps) {
  const [testPanel, setTestPanel] = useState('');
  const [priority, setPriority] = useState('routine');
  const [clinicalNotes, setClinicalNotes] = useState('');

  const labMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await fetch('/api/labs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error('Failed to order lab');
      return res.json();
    },
    onSuccess: () => {
      onClose();
      alert("Lab order submitted successfully!");
      setTestPanel('');
      setClinicalNotes('');
      setPriority('routine');
    },
    onError: () => {
      alert("Failed to submit lab order.");
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient?.id) {
      alert("No patient selected.");
      return;
    }
    labMutation.mutate({
      patientId: patient.id,
      testPanel,
      priority,
      clinicalNotes
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md mx-auto my-6 z-50">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-xl shadow-2xl outline-none focus:outline-none overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-solid border-gray-100 bg-gray-50/80">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <FlaskConical className="w-5 h-5 mr-2 text-blue-600" />
              Order Lab Test {patient && `- ${patient.name}`}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Test Panel</label>
                <select 
                  required
                  value={testPanel}
                  onChange={(e) => setTestPanel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="" disabled>Select a test...</option>
                  <option value="cbc">Complete Blood Count (CBC)</option>
                  <option value="cmp">Comprehensive Metabolic Panel (CMP)</option>
                  <option value="lipid">Lipid Panel</option>
                  <option value="hba1c">Hemoglobin A1C</option>
                  <option value="tsh">Thyroid Stimulating Hormone (TSH)</option>
                  <option value="urinalysis">Urinalysis</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name="priority" value="routine" checked={priority === 'routine'} onChange={() => setPriority('routine')} className="text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Routine</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="priority" value="stat" checked={priority === 'stat'} onChange={() => setPriority('stat')} className="text-red-600 focus:ring-red-500" />
                    <span className="ml-2 text-sm text-gray-700">STAT (Urgent)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes (Optional)</label>
                <textarea 
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Reason for ordering..." 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="bg-blue-600 text-white active:bg-blue-700 hover:bg-blue-700 font-medium px-4 py-2 rounded-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 flex items-center"
                  type="submit"
                  disabled={labMutation.isPending}
                >
                  {labMutation.isPending ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : null}
                  Order Test
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
