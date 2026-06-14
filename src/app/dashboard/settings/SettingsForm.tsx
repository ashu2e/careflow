"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsForm({ user }: { user: any }) {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    fullName: user.fullName || "",
    phone: user.phone || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [profileStatus, setProfileStatus] = useState({ loading: false, error: "", success: "" });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: "", success: "" });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus({ loading: true, error: "", success: "" });
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      if (res.ok) {
        setProfileStatus({ loading: false, error: "", success: "Profile updated successfully." });
        router.refresh();
      } else {
        const data = await res.json();
        setProfileStatus({ loading: false, error: data.message || "Failed to update profile", success: "" });
      }
    } catch (err) {
      setProfileStatus({ loading: false, error: "An error occurred.", success: "" });
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ loading: false, error: "New passwords do not match.", success: "" });
      return;
    }
    setPasswordStatus({ loading: true, error: "", success: "" });
    try {
      const res = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });
      if (res.ok) {
        setPasswordStatus({ loading: false, error: "", success: "Password updated successfully." });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const data = await res.json();
        setPasswordStatus({ loading: false, error: data.message || "Failed to update password", success: "" });
      }
    } catch (err) {
      setPasswordStatus({ loading: false, error: "An error occurred.", success: "" });
    }
  };

  return (
    <div className="space-y-10">
      {/* Profile Section */}
      <div className="bg-white shadow sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Update your account's profile information and phone number.</p>
          </div>
          <form className="mt-5 space-y-4 max-w-2xl" onSubmit={handleProfileUpdate}>
            {profileStatus.error && <p className="text-sm text-red-600">{profileStatus.error}</p>}
            {profileStatus.success && <p className="text-sm text-green-600">{profileStatus.success}</p>}
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  value={profileData.fullName}
                  onChange={e => setProfileData({...profileData, fullName: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input 
                  type="text" 
                  value={profileData.phone}
                  onChange={e => setProfileData({...profileData, phone: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                  required 
                />
              </div>
            </div>
            <div>
              <button 
                type="submit" 
                disabled={profileStatus.loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {profileStatus.loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white shadow sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Update Password</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Ensure your account is using a long, random password to stay secure.</p>
          </div>
          <form className="mt-5 space-y-4 max-w-md" onSubmit={handlePasswordUpdate}>
            {passwordStatus.error && <p className="text-sm text-red-600">{passwordStatus.error}</p>}
            {passwordStatus.success && <p className="text-sm text-green-600">{passwordStatus.success}</p>}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input 
                type="password" 
                value={passwordData.currentPassword}
                onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input 
                type="password" 
                value={passwordData.newPassword}
                onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input 
                type="password" 
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                required 
              />
            </div>
            <div>
              <button 
                type="submit" 
                disabled={passwordStatus.loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50"
              >
                {passwordStatus.loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
