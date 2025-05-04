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
          <div className="flex justify-center mb-6">
            <img
              src="/Gorlea-logo.png"
              alt="Gorlea's Ink"
              className="h-28 w-28 object-contain hover:scale-110 transition-transform duration-300 animate-pulse"
              style={{ animationDuration: '3s' }}
            />
          </div>
          <h1 className="text-2xl font-bold text-primary">Gorlea's Ink</h1>
          <p className="text-primary/60 mb-8">Your private journaling space</p>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full py-2.5 px-4 border rounded-md bg-white hover:bg-gray-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" className="mr-3">
              <g transform="matrix(1, 0, 0, 1, 0, 0)">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </g>
            </svg>
            <span className="text-gray-700 font-medium">Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
