"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DispenseButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDispense = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/prescriptions/${id}/dispense`, {
        method: "POST",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to dispense");
      }
    } catch (err) {
      console.error(err);
      alert("Error dispensing medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDispense}
      disabled={loading}
      className="text-blue-600 hover:text-blue-900 font-medium disabled:opacity-50"
    >
      {loading ? "Processing..." : "Mark Dispensed"}
    </button>
  );
}
