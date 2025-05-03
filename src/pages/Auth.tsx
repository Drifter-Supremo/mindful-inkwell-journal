// src/pages/Auth.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";

const provider = new GoogleAuthProvider();

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/entries");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle navigation
    } catch (error: any) {
      alert(error.message);
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
          <Button
            className="w-full bg-accent text-primary-foreground hover:bg-accent/90"
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
