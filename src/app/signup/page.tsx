"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuth } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: fullName });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
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
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(251,191,36,0.1),transparent_50%)]" />
        
        <div className="relative">
          <Link href="/" className="text-2xl font-bold tracking-tighter gradient-text">SUPERNOVA</Link>
          <h2 className="text-4xl font-bold mt-12 mb-6">Join the next generation of professionals.</h2>
          <div className="space-y-4">
            {[
              "Instant ATS score & improvement report",
              "AI job discovery tailored to your profile",
              "Unlimited interview practice sessions"
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-[#8A8AA0]">
                <CheckCircle2 size={20} className="text-[#FBBF24]" />
                {benefit}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-auto">
          <p className="text-sm italic text-[#44445A]">
            "Building my career used to feel like guesswork. Supernova gives me a data-driven edge."
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
            <h1 className="text-3xl font-bold mb-2">Create your account.</h1>
            <p className="text-[#8A8AA0]">Start your journey to landing your dream role today.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input 
                id="fullname" 
                placeholder="John Doe" 
                className="bg-[#0F0F1A] border-[#1E1E30] focus:ring-[#FBBF24]/30" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                className="bg-[#0F0F1A] border-[#1E1E30] focus:ring-[#FBBF24]/30" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                className="bg-[#0F0F1A] border-[#1E1E30] focus:ring-[#FBBF24]/30" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button disabled={loading} className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold h-11 mt-4">
              {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
            </Button>
          </form>

          <p className="text-[11px] text-[#44445A] text-center leading-relaxed">
            By signing up, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
          </p>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1E1E30]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#07070D] px-2 text-[#44445A]">Or</span>
            </div>
          </div>

          <Button variant="outline" className="w-full border-[#1E1E30] text-[#EEEEF5] hover:bg-[#1E1E30] h-11">
             Continue with Google
          </Button>

          <p className="text-center text-sm text-[#8A8AA0]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#10B981] hover:underline font-medium">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
