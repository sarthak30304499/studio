
"use client"

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Zap, Sparkles, Shield, Globe } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Essential tools for active job seekers.",
    features: [
      "3 Resume scans per month",
      "Basic ATS keyword matching",
      "5 Job matches daily",
      "Community support",
      "Standard processing speed"
    ],
    cta: "Get Started",
    popular: false,
    icon: Zap
  },
  {
    name: "Pro",
    price: "$7",
    description: "The complete career intelligence suite.",
    features: [
      "Unlimited resume analysis",
      "Deep-dive ATS suggestions",
      "Priority job matching",
      "AI Interview practice sessions",
      "Higher-Ed roadmaps",
      "Skill gap visualization",
      "Email & Chat support"
    ],
    cta: "Start Free Trial",
    popular: true,
    icon: Sparkles
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Scale career growth across your organization.",
    features: [
      "Everything in Pro",
      "Team management dashboard",
      "API access for high volume",
      "Dedicated account manager",
      "Custom integration support",
      "White-label reports"
    ],
    cta: "Contact Sales",
    popular: false,
    icon: Shield
  }
];

const faqs = [
  {
    q: "How does the AI match score work?",
    a: "Our semantic engine analyzes over 50 data points, including technical skills, soft skills, and industry context, to calculate a precise alignment percentage between your profile and job descriptions."
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes. You can manage your subscription directly from your settings. If you cancel, you'll retain access to Pro features until the end of your billing cycle."
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use enterprise-grade encryption for all document storage and never share your personal data with third parties without your explicit consent."
  }
];

export default function PricingPage() {
  return (
    <div className="bg-[#07070D] min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        {/* Header Section */}
        <section className="text-center mb-24 space-y-6">
          <Badge variant="outline" className="border-primary/30 text-primary uppercase text-[10px] font-black px-4 py-1.5 tracking-[0.2em] mb-4">
            Subscription Plans
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase">
            Invest in your <br /><span className="gradient-text">Future Self.</span>
          </h1>
          <p className="text-[#8A8AA0] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Choose the plan that matches your career ambitions. From entry-level discovery to executive-level precision.
          </p>
        </section>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {tiers.map((tier, i) => (
            <Card 
              key={i} 
              className={`relative bg-[#0F0F1A] border-border overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col ${
                tier.popular ? 'border-primary ring-2 ring-primary/20 shadow-[0_0_50px_rgba(16,185,129,0.15)]' : 'hover:border-primary/50'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 p-4">
                  <Badge className="bg-primary text-white font-black uppercase text-[9px] tracking-widest px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="p-10 pb-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${tier.popular ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                   <tier.icon size={24} />
                </div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight text-white">{tier.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-4">
                   <span className="text-5xl font-black tracking-tighter text-white">{tier.price}</span>
                   {tier.price !== "Custom" && <span className="text-muted-foreground font-bold text-sm">/mo</span>}
                </div>
                <CardDescription className="mt-4 text-[#8A8AA0] font-medium leading-relaxed">{tier.description}</CardDescription>
              </CardHeader>

              <CardContent className="p-10 flex-1 flex flex-col">
                <div className="space-y-4 mb-10 flex-1">
                  {tier.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <Check size={18} className="text-primary mt-0.5 shrink-0" />
                      <span className="text-sm text-[#EEEEF5] font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Link href="/signup" className="w-full">
                  <Button 
                    variant={tier.popular ? "default" : "outline"} 
                    className={`w-full h-14 font-black uppercase tracking-widest text-xs rounded-xl transition-all ${
                      tier.popular 
                        ? 'bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20' 
                        : 'border-border hover:border-primary hover:text-primary'
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trusted By Section */}
        <section className="text-center mb-20 border-t border-border pt-16">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-10">Empowering talent at top-tier firms</p>
           <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale">
              <span className="text-2xl font-black text-white">GOOGLE</span>
              <span className="text-2xl font-black text-white">META</span>
              <span className="text-2xl font-black text-white">STRIPE</span>
              <span className="text-2xl font-black text-white">APPLE</span>
              <span className="text-2xl font-black text-white">NETFLIX</span>
           </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto space-y-12 mb-32">
           <h3 className="text-3xl font-black uppercase tracking-tight text-center mb-10">Frequently Asked <span className="text-primary">Questions</span></h3>
           <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="p-8 bg-[#0F0F1A] border border-border rounded-2xl space-y-3">
                   <h4 className="text-lg font-black text-[#EEEEF5] tracking-tight">{faq.q}</h4>
                   <p className="text-sm text-[#8A8AA0] leading-relaxed font-medium">{faq.a}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Bottom CTA */}
        <section className="p-12 md:p-20 bg-primary/5 border border-primary/20 rounded-[40px] text-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
              <Globe size={300} className="text-primary" />
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8 relative z-10">Ready to accelerate <br />your trajectory?</h2>
           <Link href="/signup" className="relative z-10">
              <Button size="lg" className="h-16 px-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-2xl shadow-primary/20">
                 Join 50k+ Professionals
              </Button>
           </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
