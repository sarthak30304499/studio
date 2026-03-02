import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="glass-nav h-16 flex items-center px-6 lg:px-12 justify-between">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tighter gradient-text">SUPERNOVA</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#8A8AA0]">
        <Link href="/features" className="hover:text-[#EEEEF5] transition-colors">Features</Link>
        <Link href="/pricing" className="hover:text-[#EEEEF5] transition-colors">Pricing</Link>
        <Link href="/about" className="hover:text-[#EEEEF5] transition-colors">About</Link>
        <Link href="/contact" className="hover:text-[#EEEEF5] transition-colors">Contact</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button variant="ghost" className="text-[#EEEEF5] hover:bg-[#1E1E30]">Log In</Button>
        </Link>
        <Link href="/signup">
          <Button className="bg-[#6C63FF] hover:bg-[#5A52E0] text-white shadow-[0_0_24px_rgba(108,99,255,0.20)]">
            Get Started Free
          </Button>
        </Link>
      </div>
    </nav>
  );
}
