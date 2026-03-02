
"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, KeyRound } from "lucide-react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInAnonymously } from "firebase/auth";
import { useAuth } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGuestLogin = async () => {
    if (!auth) {
      toast({
        title: "System Error",
        description: "Firebase authentication service is not ready.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Attempt anonymous sign-in directly
      await signInAnonymously(auth);
      
      toast({
        title: "Access Granted",
        description: "Welcome! Redirecting to your guest dashboard...",
      });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Firebase Guest Login Error:", error);
      
      let message = error.message;
      if (error.code === 'auth/operation-not-allowed') {
        message = "Anonymous authentication is not enabled in the Firebase Console. Please enable it under Auth Providers.";
      }

      toast({
        title: "Guest access failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#07070D]">
      {/* Left Brand Panel */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#0F0F1A] border-r border-[#1E1E30] p-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(6,95,70,0.1),transparent_50%)]" />
        
        <div className="relative">
          <Link href="/" className="text-2xl font-bold tracking-tighter gradient-text">SUPERNOVA</Link>
          <h2 className="text-4xl font-bold mt-12 mb-6">Navigate your career with precision.</h2>
          <div className="space-y-4">
            {[
              "Enterprise-grade AI resume analysis",
              "Hyper-personalized job matching",
              "Interview intelligence from elite coaches"
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-[#8A8AA0]">
                <CheckCircle2 size={20} className="text-primary" />
                {benefit}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-auto">
          <p className="text-sm italic text-[#44445A]">
            "SUPERNOVA transformed my job search. I landed a senior role at a top-tier tech firm in weeks."
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="md:hidden mb-8">
            <Link href="/" className="text-2xl font-bold tracking-tighter gradient-text">SUPERNOVA</Link>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back.</h1>
            <p className="text-[#8A8AA0]">Enter your credentials or enter as a guest.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                className="bg-[#0F0F1A] border-[#1E1E30] focus:ring-primary/30" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                className="bg-[#0F0F1A] border-[#1E1E30] focus:ring-primary/30" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11">
              {loading ? <Loader2 className="animate-spin" /> : "Log In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1E1E30]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#07070D] px-2 text-[#44445A]">Or</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleGoogleLogin} variant="outline" className="border-[#1E1E30] text-[#EEEEF5] hover:bg-[#1E1E30] h-11">
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
              Google
            </Button>
            <Button 
              onClick={handleGuestLogin} 
              disabled={loading}
              variant="outline" 
              className="border-[#1E1E30] text-[#EEEEF5] hover:bg-accent/10 hover:text-accent hover:border-accent/30 h-11 transition-all"
            >
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <KeyRound size={16} className="mr-2" />}
              Guest
            </Button>
          </div>

          <p className="text-center text-sm text-[#8A8AA0]">
            New to SUPERNOVA?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
