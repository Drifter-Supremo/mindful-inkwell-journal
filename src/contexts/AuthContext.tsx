import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  signOut: () => Promise<void>;
  isSigningOut: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signOut: async () => {},
  isSigningOut: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setIsSigningOut(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    // Add a slight delay before actually signing out for animation purposes
    await new Promise(resolve => setTimeout(resolve, 300));
    return firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user,
      signOut: handleSignOut,
      isSigningOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
