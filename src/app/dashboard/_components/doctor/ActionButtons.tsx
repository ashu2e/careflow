import { Pill, FlaskConical, LogOut } from 'lucide-react';

interface ActionButtonsProps {
  onPrescribe: () => void;
  onOrderLab: () => void;
  onEndShift: () => void;
}

export function ActionButtons({ onPrescribe, onOrderLab, onEndShift }: ActionButtonsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-md font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button 
          onClick={onPrescribe}
          className="w-full flex items-center justify-start space-x-3 p-3 rounded-md border border-gray-200 hover:border-teal-500 hover:bg-teal-50 text-gray-700 hover:text-teal-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <Pill className="w-5 h-5 text-teal-600" />
          <span className="font-medium text-sm">Prescribe (P)</span>
        </button>
        
        <button 
          onClick={onOrderLab}
          className="w-full flex items-center justify-start space-x-3 p-3 rounded-md border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FlaskConical className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-sm">Order Lab</span>
        </button>
        
        <div className="pt-4 mt-4 border-t border-gray-100">
          <button 
            onClick={onEndShift}
            className="w-full flex items-center justify-start space-x-3 p-3 rounded-md border border-gray-200 hover:border-red-500 hover:bg-red-50 text-gray-700 hover:text-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <LogOut className="w-5 h-5 text-red-600" />
            <span className="font-medium text-sm">End Shift</span>
          </button>
        </div>
      </div>
    </div>
  );
}
