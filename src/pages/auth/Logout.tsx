// src/pages/auth/Logout.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../config/supabase-client";
import { Button } from "@/components/ui/button";

export default function Logout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Are you sure you want to logout?</h1>
      <Button 
        onClick={handleLogout} 
        disabled={loading}
        variant="destructive"
      >
        {loading ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}