"use client";

import { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CheckInQueue } from './doctor/CheckInQueue';
import { NextPatientCard } from './doctor/NextPatientCard';
import { UpcomingAppointments } from './doctor/UpcomingAppointments';
import { GlobalSearch } from './doctor/GlobalSearch';
import { PendingTasksBadge } from './doctor/PendingTasksBadge';
import { UnreadMessagesPreview } from './doctor/UnreadMessagesPreview';
import { ActionButtons } from './doctor/ActionButtons';
import { PrescribeModal } from './doctor/PrescribeModal';
import { OrderLabModal } from './doctor/OrderLabModal';
import { useDoctorShortcuts } from '@/hooks/useDoctorShortcuts';
import { PatientQueueItem, QueueResponse } from '@/hooks/useRealtimeQueue';

export default function DoctorDashboard({ doctor, appointments, userName }: { doctor: any, appointments: any[], userName?: string }) {
  const [selectedPatient, setSelectedPatient] = useState<PatientQueueItem | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isPrescribeOpen, setIsPrescribeOpen] = useState(false);
  const [isOrderLabOpen, setIsOrderLabOpen] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Handle optimistic UI updates for queue
  const handleStartVisit = async (patientId: string, appointmentId: string) => {
    setIsStarting(true);
    
    // Optimistic Update: remove patient from queue immediately
    const previousQueue = queryClient.getQueryData<QueueResponse>(['doctorQueue']);
    if (previousQueue) {
      queryClient.setQueryData<QueueResponse>(['doctorQueue'], {
        ...previousQueue,
        patients: previousQueue.patients.filter(p => p.id !== patientId),
        progress: {
          ...previousQueue.progress,
          seen: previousQueue.progress.seen + 1
        }
      });
      setSelectedPatient(null);
    }

    try {
      const res = await fetch('/api/consultations/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId })
      });
      if (!res.ok) throw new Error('Failed to start consultation');
      console.log(`Successfully started visit with patient ${patientId}`);
    } catch (error) {
      console.error(error);
      // Revert optimistic update on failure
      if (previousQueue) {
        queryClient.setQueryData(['doctorQueue'], previousQueue);
      }
      alert('Failed to start visit. Reverting...');
    } finally {
      setIsStarting(false);
    }
  };

  // Setup Keyboard Shortcuts
  useDoctorShortcuts({
    onEndConsultation: () => {
      console.log("Ended consultation via shortcut");
    },
    onPrescribe: () => {
      setIsPrescribeOpen(true);
    },
    onCloseModal: () => {
      setIsPrescribeOpen(false);
      setIsOrderLabOpen(false);
    },
    onSearchFocus: () => {
      searchInputRef.current?.focus();
    }
  });

  // Select the first patient in queue automatically if none is selected
  useEffect(() => {
    const queueData = queryClient.getQueryData<QueueResponse>(['doctorQueue']);
    if (queueData && queueData.patients.length > 0 && !selectedPatient) {
      setSelectedPatient(queueData.patients[0]);
    }
  }, [queryClient, selectedPatient]);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] p-6 rounded-xl relative">
      <PrescribeModal 
        isOpen={isPrescribeOpen} 
        onClose={() => setIsPrescribeOpen(false)} 
        patient={selectedPatient}
      />
      <OrderLabModal 
        isOpen={isOrderLabOpen} 
        onClose={() => setIsOrderLabOpen(false)} 
        patient={selectedPatient}
      />

      {/* Header section with Global Search and Badges */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName || "Doctor"}</h1>
          <p className="text-gray-500 text-sm mt-1">Have a great shift today.</p>
        </div>
        
        <div className="flex items-center space-x-6">
          <GlobalSearch inputRef={searchInputRef} />
          <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
            <PendingTasksBadge />
            <UnreadMessagesPreview />
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column: Check-in Queue */}
        <div className="col-span-12 lg:col-span-4 flex flex-col h-[600px]">
          <CheckInQueue 
            onSelectPatient={(patient) => setSelectedPatient(patient)} 
          />
        </div>

        {/* Middle Column: Next Patient & Upcoming */}
        <div className="col-span-12 lg:col-span-6 flex flex-col space-y-6 h-[600px]">
          <div className="flex-1">
            <NextPatientCard 
              patient={selectedPatient} 
              onStartVisit={handleStartVisit}
              isStarting={isStarting}
            />
          </div>
          <div className="shrink-0">
            <UpcomingAppointments />
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="col-span-12 lg:col-span-2 flex flex-col space-y-6">
          <ActionButtons 
            onPrescribe={() => setIsPrescribeOpen(true)}
            onOrderLab={() => setIsOrderLabOpen(true)}
            onEndShift={() => {
              if(confirm("Are you sure you want to end your shift?")) {
                console.log("Ended shift");
              }
            }}
          />
        </div>

      </div>
    </div>
  );
}
