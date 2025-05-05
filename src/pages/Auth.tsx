// src/pages/Auth.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { authVariants, logoVariants } from "@/lib/animations";
import { Loader2 } from "lucide-react";

const provider = new GoogleAuthProvider();

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Add a slight delay before navigating for a smoother transition
        setIsExiting(true);
        setTimeout(() => {
          navigate("/entries");
        }, 500);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const auth = getAuth();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle navigation
    } catch (error: any) {
      setIsLoading(false);
      alert(error.message);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="min-h-screen bg-primary flex items-center justify-center p-4"
        initial="hidden"
        animate={isExiting ? "exit" : "visible"}
        exit="exit"
        variants={authVariants}
      >
        <motion.div
          className="w-full max-w-md space-y-8 bg-secondary p-6 rounded-lg shadow-lg"
          variants={authVariants}
        >
          <motion.div className="text-center" variants={authVariants}>
            <motion.div
              className="flex justify-center mb-6"
              whileHover="hover"
              variants={logoVariants}
            >
              <motion.img
                src="/Gorlea-logo.png"
                alt="Gorlea's Ink"
                className="h-28 w-28 object-contain"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    delay: 0.2
                  }
                }}
              />
            </motion.div>
            <motion.h1
              className="text-2xl font-bold text-primary"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  delay: 0.3
                }
              }}
            >
              Gorlea Dot Ink
            </motion.h1>
            <motion.p
              className="text-primary/60 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  delay: 0.4
                }
              }}
            >
              Breathe life to words, watch them dance
            </motion.p>
          </motion.div>
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                delay: 0.5
              }
            }}
          >
            <motion.button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center w-full py-2.5 px-4 border rounded-md bg-white hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="mr-2"
                >
                  <Loader2 className="h-5 w-5 text-gray-500" />
                </motion.div>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                  <g transform="matrix(1, 0, 0, 1, 0, 0)">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </g>
                </svg>
              )}
              <span className="text-gray-700 font-medium">
                {isLoading ? "Signing in..." : "Sign in with Google"}
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Auth;
