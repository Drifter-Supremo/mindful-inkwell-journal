
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (action: "login" | "signup") => {
    try {
      setLoading(true);
      const {
        data: { session },
        error,
      } = action === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;
      if (session) navigate("/entries");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-secondary p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">Mindful Inkwell</h1>
          <p className="text-primary/60">Your private journaling space</p>
        </div>
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-secondary-foreground/10 text-primary-foreground"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-secondary-foreground/10 text-primary-foreground"
          />
          <div className="space-y-2">
            <Button
              className="w-full bg-accent text-primary-foreground hover:bg-accent/90"
              onClick={() => handleAuth("login")}
              disabled={loading}
            >
              Sign In
            </Button>
            <Button
              className="w-full bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90"
              onClick={() => handleAuth("signup")}
              disabled={loading}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
