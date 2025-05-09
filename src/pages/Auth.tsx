// src/pages/Auth.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { authVariants, logoVariants, fadeInVariants } from "@/lib/animations";
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      // Add a slight delay before navigating for a smoother transition
      setIsExiting(true);
      setTimeout(() => {
        navigate("/entries");
      }, 500);
    }
  }, [user, navigate]);

  const validateForm = () => {
    try {
      if (isSignUp) {
        signupSchema.parse({
          username,
          email,
          password,
          confirmPassword,
        });
      } else if (isForgotPassword) {
        z.object({
          email: z.string().email("Please enter a valid email address"),
        }).parse({ email });
      } else {
        loginSchema.parse({
          email,
          password,
        });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, username);
        toast.success("Account created successfully!");
      } else if (isForgotPassword) {
        await resetPassword(email);
        toast.success("Password reset email sent. Check your inbox.");
        setIsForgotPassword(false);
      } else {
        await signIn(email, password);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      let errorMessage = "An error occurred. Please try again.";

      // Handle specific Firebase error codes
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsername("");
    setErrors({});
  };

  const toggleSignUp = () => {
    resetForm();
    setIsSignUp(!isSignUp);
    setIsForgotPassword(false);
  };

  const toggleForgotPassword = () => {
    resetForm();
    setIsForgotPassword(!isForgotPassword);
    setIsSignUp(false);
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
          className="w-full max-w-md space-y-6 bg-secondary p-6 rounded-lg shadow-lg"
          variants={authVariants}
        >
          <motion.div className="text-center" variants={authVariants}>
            <motion.img
              src="/new-logo-no-background.png"
              alt="Mindful Inkwell Logo"
              className="mx-auto mb-6 h-44 w-44 object-contain"
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
            <motion.p
              className="text-primary/60 mb-6"
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

          <AnimatePresence mode="wait">
            {isForgotPassword ? (
              <motion.form
                key="forgot-password-form"
                className="space-y-4"
                onSubmit={handleSubmit}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeInVariants}
              >
                <motion.h2
                  className="text-xl font-semibold text-primary text-center mb-4"
                  variants={fadeInVariants}
                >
                  Reset Password
                </motion.h2>

                <motion.div className="space-y-2" variants={fadeInVariants}>
                  <Label htmlFor="email" className="text-primary">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </motion.div>

                <motion.div className="pt-2" variants={fadeInVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Reset Link...
                      </>
                    ) : (
                      <>
                        Reset Password
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>

                <motion.div className="text-center mt-4" variants={fadeInVariants}>
                  <button
                    type="button"
                    onClick={toggleForgotPassword}
                    className="text-primary/70 hover:text-primary text-sm"
                    disabled={isLoading}
                  >
                    Back to Sign In
                  </button>
                </motion.div>
              </motion.form>
            ) : isSignUp ? (
              <motion.form
                key="signup-form"
                className="space-y-4"
                onSubmit={handleSubmit}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeInVariants}
              >
                <motion.h2
                  className="text-xl font-semibold text-primary text-center mb-4"
                  variants={fadeInVariants}
                >
                  Create an Account
                </motion.h2>

                <motion.div className="space-y-2" variants={fadeInVariants}>
                  <Label htmlFor="username" className="text-primary">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 h-4 w-4" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      className={`pl-10 ${errors.username ? 'border-red-500' : ''}`}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                  )}
                </motion.div>

                <motion.div className="space-y-2" variants={fadeInVariants}>
                  <Label htmlFor="email" className="text-primary">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </motion.div>

                <motion.div className="space-y-2" variants={fadeInVariants}>
                  <Label htmlFor="password" className="text-primary">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 h-4 w-4" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </motion.div>

                <motion.div className="space-y-2" variants={fadeInVariants}>
                  <Label htmlFor="confirmPassword" className="text-primary">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </motion.div>

                <motion.div className="pt-2" variants={fadeInVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Sign Up
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>

                <motion.div className="text-center mt-4" variants={fadeInVariants}>
                  <button
                    type="button"
                    onClick={toggleSignUp}
                    className="text-primary/70 hover:text-primary text-sm"
                    disabled={isLoading}
                  >
                    Already have an account? Sign In
                  </button>
                </motion.div>
              </motion.form>
            ) : (
              <motion.form
                key="login-form"
                className="space-y-4"
                onSubmit={handleSubmit}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeInVariants}
              >
                <motion.h2
                  className="text-xl font-semibold text-primary text-center mb-4"
                  variants={fadeInVariants}
                >
                  Sign In
                </motion.h2>

                <motion.div className="space-y-2" variants={fadeInVariants}>
                  <Label htmlFor="email" className="text-primary">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </motion.div>

                <motion.div className="space-y-2" variants={fadeInVariants}>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-primary">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={toggleForgotPassword}
                      className="text-primary/70 hover:text-primary text-xs"
                      disabled={isLoading}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/40 h-4 w-4" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </motion.div>

                <motion.div className="pt-2" variants={fadeInVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>

                <motion.div className="text-center mt-4" variants={fadeInVariants}>
                  <button
                    type="button"
                    onClick={toggleSignUp}
                    className="text-primary/70 hover:text-primary text-sm"
                    disabled={isLoading}
                  >
                    Don't have an account? Sign Up
                  </button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Auth;
