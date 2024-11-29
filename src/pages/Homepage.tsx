import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import supabase from "../config/supabase-client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function Homepage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
  
        if (!user) throw new Error("No authenticated user");
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
  
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-12">
      <h1 className="text-3xl">Welcome to the homepage</h1>

      <div>
        <h2 className="font-bold">What is this?</h2>
        <p>
          This is a simple app that lets you create interactive stories. You can
          add chapters and choices to create a branching story. You can also
          view the story as a flowchart.
        </p>
      </div>
      <Link to="/stories" className="text-blue-500">
        <Button variant="outline">Go to stories</Button>
      </Link>

      <p>
        {currentUser ? (
          <span>
            You are logged in as <strong>{currentUser.email}</strong>
          </span>
        ) : (
          <Link to="/auth/login" className="text-blue-500">
            <Button variant="outline">Login</Button>
          </Link>
        )}
      </p>
    </div>
  );
}
