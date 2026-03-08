"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });
      router.push("/dashboard");
      router.refresh();
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

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google signup failed",
        description: error.message,
        variant: "destructive",
      });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#07070D]">
      {/* Left Brand Panel */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#0F0F1A] border-r border-[#1E1E30] p-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(6,95,70,0.1),transparent_50%)]" />

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
                <CheckCircle2 size={20} className="text-accent" />
                {benefit}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-auto">
          <p className="text-sm italic text-[#44445A]">
            &ldquo;Building my career used to feel like guesswork. Supernova gives me a data-driven edge.&rdquo;
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
                className="bg-[#0F0F1A] border-[#1E1E30] focus:ring-accent/30"
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
                className="bg-[#0F0F1A] border-[#1E1E30] focus:ring-accent/30"
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
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                className="bg-[#0F0F1A] border-[#1E1E30] focus:ring-accent/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>

            <Button disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11 mt-4">
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

          <Button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            variant="outline"
            className="w-full border-[#1E1E30] text-[#EEEEF5] hover:bg-[#1E1E30] h-11 font-bold"
          >
            {googleLoading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <svg className="mr-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
            )}
            Continue with Google
          </Button>

          <p className="text-center text-sm text-[#8A8AA0]">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
