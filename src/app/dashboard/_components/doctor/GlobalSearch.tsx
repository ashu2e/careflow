import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2 } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  dob: string;
}

export function GlobalSearch({ inputRef }: { inputRef: React.RefObject<HTMLInputElement | null> }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isFetching } = useQuery<{ results: SearchResult[] }>({
    queryKey: ['patientSearch', query],
    queryFn: async () => {
      const res = await fetch(`/api/patients/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
    enabled: query.length >= 2,
    staleTime: 30000,
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
    <div className="relative w-full max-w-md" ref={containerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 sm:text-sm transition-shadow"
          placeholder="Search patients (Cmd+K)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-400 text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">⌘K</span>
        </div>
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {isFetching ? (
            <div className="flex items-center justify-center py-4 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Searching...
            </div>
          ) : data?.results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">No patients found.</div>
          ) : (
            data?.results.map((patient) => (
              <div
                key={patient.id}
                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-teal-50 text-gray-900 transition-colors"
                onClick={() => {
                  console.log('Opened patient profile:', patient.id);
                  setIsOpen(false);
                  setQuery('');
                }}
              >
                <span className="block truncate font-medium">{patient.name}</span>
                <span className="block truncate text-gray-500 text-xs">DOB: {patient.dob}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
