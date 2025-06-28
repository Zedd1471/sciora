// pages/AdminPage.tsx
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import AdminDashboard from "@/components/AdminDashboard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("admin-auth");
    if (stored === "true") setAuthenticated(true);
  }, []);

  const handleLogin = () => {
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem("admin-auth", "true");
    } else {
      alert("Wrong password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    setAuthenticated(false);
    setPasswordInput("");
  };

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 bg-white shadow-md rounded">
          <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="p-2 border rounded w-full mb-4"
          />
          <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
            Login
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} supabase={supabase} />;
}
