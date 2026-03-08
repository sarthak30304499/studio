import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="bg-[#07070D] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <span className="text-[#10B981] text-xs font-black uppercase tracking-[0.2em] mb-6 animate-in fade-in slide-in-from-top-4 duration-700">Reach Out</span>
        <h1 className="text-5xl md:text-7xl font-extrabold gradient-text mb-8 tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 uppercase">Contact Us</h1>
        <p className="text-[#8A8AA0] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-700 delay-300 mb-12">
          Have questions about Supernova? Want to explore enterprise options? We are here to help.
        </p>

        <div className="w-full max-w-md animate-in fade-in duration-700 delay-500 bg-[#0F0F1A] border border-[#1E1E30] p-8 rounded-3xl shadow-2xl">
          <form className="space-y-6 flex flex-col text-left">
            <div>
              <label className="text-xs font-bold text-[#EEEEF5] uppercase tracking-widest mb-2 block">Name</label>
              <input type="text" className="w-full bg-[#1E1E30]/50 border border-[#1E1E30] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#10B981] transition-colors" placeholder="John Doe" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#EEEEF5] uppercase tracking-widest mb-2 block">Email</label>
              <input type="email" className="w-full bg-[#1E1E30]/50 border border-[#1E1E30] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#10B981] transition-colors" placeholder="john@example.com" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#EEEEF5] uppercase tracking-widest mb-2 block">Message</label>
              <textarea rows={4} className="w-full bg-[#1E1E30]/50 border border-[#1E1E30] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#10B981] transition-colors resize-none" placeholder="Your message..."></textarea>
            </div>
            <Button type="button" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest shadow-[0_0_24px_rgba(6,95,70,0.30)] rounded-xl">
              Send Message
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
