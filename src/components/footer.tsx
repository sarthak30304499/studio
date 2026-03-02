import Link from "next/link";
import { Github, Linkedin, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#07070D] border-t border-[#1E1E30] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-12">
        <div className="col-span-2">
          <Link href="/" className="text-2xl font-bold tracking-tighter gradient-text mb-4 block">SUPERNOVA</Link>
          <p className="text-[#8A8AA0] text-sm max-w-xs leading-relaxed">
            Your Career, Supercharged by AI. The unified workspace for resume analysis, 
            job matching, and interview mastery.
          </p>
          <div className="flex gap-4 mt-8">
            <Link href="#" className="text-[#44445A] hover:text-[#EEEEF5] transition-colors"><Linkedin size={20} /></Link>
            <Link href="#" className="text-[#44445A] hover:text-[#EEEEF5] transition-colors"><Twitter size={20} /></Link>
            <Link href="#" className="text-[#44445A] hover:text-[#EEEEF5] transition-colors"><Github size={20} /></Link>
            <Link href="#" className="text-[#44445A] hover:text-[#EEEEF5] transition-colors"><Youtube size={20} /></Link>
          </div>
        </div>

        <div>
          <h4 className="text-[#EEEEF5] font-semibold mb-6 text-sm">Product</h4>
          <ul className="space-y-4 text-sm text-[#8A8AA0]">
            <li><Link href="/features" className="hover:text-[#EEEEF5]">Features</Link></li>
            <li><Link href="/pricing" className="hover:text-[#EEEEF5]">Pricing</Link></li>
            <li><Link href="/app/jobs" className="hover:text-[#EEEEF5]">Job Matcher</Link></li>
            <li><Link href="/app/interview" className="hover:text-[#EEEEF5]">Interview Prep</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#EEEEF5] font-semibold mb-6 text-sm">Company</h4>
          <ul className="space-y-4 text-sm text-[#8A8AA0]">
            <li><Link href="/about" className="hover:text-[#EEEEF5]">About Us</Link></li>
            <li><Link href="#" className="hover:text-[#EEEEF5]">Careers</Link></li>
            <li><Link href="#" className="hover:text-[#EEEEF5]">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-[#EEEEF5]">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[#EEEEF5] font-semibold mb-6 text-sm">Support</h4>
          <ul className="space-y-4 text-sm text-[#8A8AA0]">
            <li><Link href="/contact" className="hover:text-[#EEEEF5]">Contact Sales</Link></li>
            <li><Link href="#" className="hover:text-[#EEEEF5]">Help Center</Link></li>
            <li><Link href="#" className="hover:text-[#EEEEF5]">API Docs</Link></li>
            <li><Link href="#" className="hover:text-[#EEEEF5]">System Status</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 border-t border-[#1E1E30] mt-24 pt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-[#44445A]">
        <p>© 2025 SUPERNOVA Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Service</Link>
          <Link href="#">Cookie Policy</Link>
          <Link href="#">Status Page</Link>
        </div>
      </div>
    </footer>
  );
}
