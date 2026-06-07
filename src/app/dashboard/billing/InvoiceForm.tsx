"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InvoiceForm({ patients }: { patients: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    patientId: patients.length > 0 ? patients[0].id : "",
    amount: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: formData.patientId,
          amount: parseInt(formData.amount, 10)
        }),
      });

      if (res.ok) {
        setSuccess("Invoice generated successfully.");
        setFormData({ ...formData, amount: "" });
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to generate invoice");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Patient</label>
          <select 
            name="patientId" 
            value={formData.patientId} 
            onChange={handleChange} 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
            required
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.user.fullName} ({p.user.email})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Total Amount ($)</label>
          <input 
            type="number" 
            name="amount" 
            value={formData.amount} 
            onChange={handleChange} 
            min="1"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm"
            placeholder="e.g., 150"
            required 
          />
        </div>
      </div>
      <div>
        <button 
          type="submit" 
          disabled={loading || patients.length === 0} 
          className="w-full md:w-auto flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Invoice"}
        </button>
      </div>
    </form>
  );
}
