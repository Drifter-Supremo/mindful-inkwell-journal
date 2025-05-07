import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, db, storage } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, username: string) => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
  isSigningOut: boolean;
  isLoading: boolean;
}

export interface UserProfile {
  username: string;
  photoURL?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  signOut: async () => {},
  signIn: async () => { throw new Error("Not implemented"); },
  signUp: async () => { throw new Error("Not implemented"); },
  resetPassword: async () => { throw new Error("Not implemented"); },
  updateUserProfile: async () => { throw new Error("Not implemented"); },
  uploadProfilePicture: async () => { throw new Error("Not implemented"); },
  isSigningOut: false,
  isLoading: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      } else {
        console.log("No user profile found");
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(true);

      if (firebaseUser) {
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUserProfile(null);
        setIsSigningOut(false);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error("Sign-in error:", error);
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, username: string) => {
    try {
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, { displayName: username });

      // Create a user profile document in Firestore
      const userProfile: UserProfile = {
        username: username,
      };

      await setDoc(doc(db, "users", user.uid), userProfile);
      setUserProfile(userProfile);

      return user;
    } catch (error: any) {
      console.error("Sign-up error:", error);
      throw error;
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  const handleUpdateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error("No authenticated user");

    try {
      const userDocRef = doc(db, "users", user.uid);

      // Get current profile data
      const userDoc = await getDoc(userDocRef);
      const currentProfile = userDoc.exists() ? userDoc.data() as UserProfile : { username: user.displayName || "" };

      // Merge with new data
      const updatedProfile = { ...currentProfile, ...data };

      // Update Firestore
      await setDoc(userDocRef, updatedProfile, { merge: true });

      // Update local state
      setUserProfile(updatedProfile);

      // Update Firebase Auth profile if username changed
      if (data.username && data.username !== user.displayName) {
        await updateProfile(user, { displayName: data.username });
      }

      // Update Firebase Auth profile if photoURL changed
      if (data.photoURL && data.photoURL !== user.photoURL) {
        await updateProfile(user, { photoURL: data.photoURL });
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  const handleUploadProfilePicture = async (file: File) => {
    if (!user) throw new Error("No authenticated user");

    try {
      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);

      // Upload the file
      await uploadBytes(storageRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Update the user profile with the new photo URL
      await handleUpdateUserProfile({ photoURL: downloadURL });

      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    // Add a slight delay before actually signing out for animation purposes
    await new Promise(resolve => setTimeout(resolve, 300));
    return firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      signOut: handleSignOut,
      signIn: handleSignIn,
      signUp: handleSignUp,
      resetPassword: handleResetPassword,
      updateUserProfile: handleUpdateUserProfile,
      uploadProfilePicture: handleUploadProfilePicture,
      isSigningOut,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
