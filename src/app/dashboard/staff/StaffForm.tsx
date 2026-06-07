"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "Doctor", // Default
    specialization: "",
    fee: "100",
    department: "",
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
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess("Staff member added successfully.");
        setFormData({
          fullName: "", email: "", password: "", phone: "", 
          role: formData.role, specialization: "", fee: "100", department: ""
        });
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to add staff member");
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input required type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm">
            <option value="Doctor">Doctor</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {formData.role === "Doctor" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <input required={formData.role === "Doctor"} type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Consultation Fee ($)</label>
              <input required={formData.role === "Doctor"} type="number" name="fee" value={formData.fee} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
            </div>
          </>
        ) : (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input required={formData.role !== "Doctor"} type="text" name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm" />
          </div>
        )}
      </div>

      <div>
        <button type="submit" disabled={loading} className="w-full md:w-auto flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Adding..." : "Add Staff Member"}
        </button>
      </div>
    </form>
  );
}
