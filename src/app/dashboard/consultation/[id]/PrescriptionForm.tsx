"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PrescriptionForm({ appointmentId }: { appointmentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    appointmentId,
    medicineName: "",
    dosage: "",
    duration: "",
    instructions: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess("Prescription added successfully. You can add another or finish consultation.");
        setFormData({ ...formData, medicineName: "", dosage: "", duration: "", instructions: "" });
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to add prescription");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    // Call API to mark appointment as completed
    await fetch(`/api/appointments/${appointmentId}/complete`, { method: "POST" });
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
            <input 
              type="text" 
              name="medicineName" 
              value={formData.medicineName} 
              onChange={handleChange} 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dosage</label>
            <input 
              type="text" 
              name="dosage" 
              value={formData.dosage} 
              onChange={handleChange} 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
              placeholder="e.g., 500mg, 1 pill"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <input 
              type="text" 
              name="duration" 
              value={formData.duration} 
              onChange={handleChange} 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
              placeholder="e.g., 5 days"
              required 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Instructions (Optional)</label>
            <textarea 
              name="instructions" 
              value={formData.instructions} 
              onChange={handleChange} 
              rows={2} 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
              placeholder="e.g., Take after meals"
            />
          </div>
        </div>
        <div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Medicine to Prescription"}
          </button>
        </div>
      </form>

      <div className="pt-4 border-t flex justify-end">
        <button 
          onClick={handleFinish}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium"
        >
          Finish Consultation
        </button>
      </div>
    </div>
  );
}
