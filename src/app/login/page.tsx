import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#07070D]">
      {/* Left Brand Panel */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#0F0F1A] border-r border-[#1E1E30] p-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(108,99,255,0.15),transparent_50%)]" />
        
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
                <CheckCircle2 size={20} className="text-[#6C63FF]" />
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
            <p className="text-[#8A8AA0]">Enter your credentials to access your dashboard.</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@company.com" className="bg-[#0F0F1A] border-[#1E1E30] focus:ring-[#6C63FF]/30" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-[#6C63FF] hover:underline">Forgot password?</Link>
              </div>
              <Input id="password" type="password" className="bg-[#0F0F1A] border-[#1E1E30] focus:ring-[#6C63FF]/30" />
            </div>
            <Button className="w-full bg-[#6C63FF] hover:bg-[#5A52E0] text-white font-bold h-11">
              Log In
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

          <Button variant="outline" className="w-full border-[#1E1E30] text-[#EEEEF5] hover:bg-[#1E1E30] h-11">
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-[#8A8AA0]">
            New to SUPERNOVA?{" "}
            <Link href="/signup" className="text-[#6C63FF] hover:underline font-medium">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
