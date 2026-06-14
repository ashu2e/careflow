import { useQuery } from '@tanstack/react-query';
import { ClipboardList } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function PendingTasksBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ['pendingTasks'],
    queryFn: async () => {
      const res = await fetch('/api/doctor/dashboard/pending-tasks');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    }
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <ClipboardList className="w-5 h-5" />
        {data?.count > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white transform translate-x-1/4 -translate-y-1/4">
            {data.count}
          </span>
        )}
      </button>

      {isOpen && data?.tasks && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-20 py-1">
          <div className="px-4 py-2 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900">Pending Tasks</h4>
          </div>
          {data.tasks.map((task: any) => (
            <div key={task.id} className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer">
              <p className="text-sm text-gray-800">{task.title}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">{task.type}</span>
                <span className="text-xs text-teal-600 font-medium hover:text-teal-700">Review &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
