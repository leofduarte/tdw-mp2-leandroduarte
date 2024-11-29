import { useState } from "react";
import supabase from "../../config/supabase-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center h-screen place-content-center ">
      <div className="row flex flex-center">
        <div className="col-6 form-widget space-y-4">
          <h1 className="header">Login</h1>
          <form className="form-widget" onSubmit={handleLogin}>
            <div>
              <Input
                className="inputField"
                type="email"
                placeholder="Your email"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Button className={"button block"} disabled={loading}>
                {loading ? <span>Loading</span> : <span>Send magic link</span>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
