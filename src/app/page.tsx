import Link from "next/link";
import { Shield, Phone, AlertOctagon, Scale, ShieldCheck, HeartHandshake, Eye } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* Background Glowing Ambient Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-rose-900/5 rounded-full blur-3xl -z-10"></div>

      {/* Global persistent high-visibility SOS banner */}
      <div 
        className="w-full bg-slate-900 border-b border-rose-950/60 shadow-[0_4px_20px_rgba(244,63,94,0.08)] sticky top-0 z-50 backdrop-blur-md/95"
        role="banner"
        aria-label="e-Abhaya Emergency SOS Hub"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-400" />
              <span className="font-semibold tracking-wider text-xs uppercase text-slate-400">e-Abhaya SOS</span>
              <span className="hidden md:inline text-xs text-rose-400/80 font-medium">| Emergency Response Hub</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5" role="region" aria-label="Emergency Hotlines">
            <a 
              href="tel:112" 
              className="group flex items-center gap-2 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/40 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-200 transition-all duration-300 transform hover:scale-105"
              aria-label="Call General Police Helpline: 112"
            >
              <Phone className="h-3.5 w-3.5 text-rose-400 group-hover:animate-bounce" />
              <span>General Police: <strong className="text-rose-400">112</strong></span>
            </a>
            <a 
              href="tel:1930" 
              className="group flex items-center gap-2 bg-slate-900 hover:bg-indigo-950/40 border border-indigo-900/50 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-200 transition-all duration-300 transform hover:scale-105"
              aria-label="Call Cyber Crime Cell: 1930"
            >
              <Shield className="h-3.5 w-3.5 text-indigo-400 group-hover:rotate-12" />
              <span>Cyber Cell: <strong className="text-indigo-400">1930</strong></span>
            </a>
            <a 
              href="tel:1091" 
              className="group flex items-center gap-2 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/40 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-200 transition-all duration-300 transform hover:scale-105"
              aria-label="Call Women Helpline: 1091"
            >
              <Phone className="h-3.5 w-3.5 text-rose-400 group-hover:animate-bounce" />
              <span>Women Helpline: <strong className="text-rose-400">1091</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Content Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow flex flex-col items-center justify-center text-center">
        
        {/* Portal Emblem */}
        <div className="bg-indigo-950/50 border border-indigo-800/40 rounded-full p-4 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.15)] shrink-0 transition-transform duration-500 hover:rotate-6">
          <Shield className="h-16 w-16 text-indigo-400" />
        </div>

        {/* Hero Title */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-indigo-200 to-indigo-400 bg-clip-text text-transparent max-w-4xl leading-tight">
          Fearless, Direct & Intelligent Crime Reporting
        </h2>
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
          e-Abhaya digitizes police reporting, improves transparency, and introduces real-time AI triage to protect citizens and support investigating officers.
        </p>

        {/* Call to action buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <Link
            href="/login"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-slate-100 px-8 py-4 rounded-xl font-bold tracking-wide shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.55)] transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95"
          >
            <ShieldCheck className="h-5 w-5" />
            <span>Enter Secure Portal</span>
          </Link>
          <a
            href="tel:112"
            className="w-full sm:w-auto bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 text-rose-200 px-8 py-4 rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95"
          >
            <Phone className="h-5 w-5 text-rose-400 animate-bounce" />
            <span>SOS Emergency Call</span>
          </a>
        </div>

        {/* Grid Features */}
        <section className="mt-20 w-full max-w-6xl">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-8">
            Platform Core Pillars
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Feature 1 */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/80 hover:-translate-y-1">
              <div className="bg-indigo-950/60 border border-indigo-900/50 rounded-xl p-3 w-fit mb-4 text-indigo-400">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-200 mb-2">Empowering Citizens</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Submit details and attachments through a secure, guided 3-Step Wizard. Follow progress transparently on interactive live timelines.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/80 hover:-translate-y-1">
              <div className="bg-indigo-950/60 border border-indigo-900/50 rounded-xl p-3 w-fit mb-4 text-indigo-400">
                <Scale className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-200 mb-2">Smart AI Legal Triage</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Narratives are scanned in real-time by NLP templates to calculate urgency priorities and auto-match relevant **BNS / IPC** sections.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/80 hover:-translate-y-1">
              <div className="bg-indigo-950/60 border border-indigo-900/50 rounded-xl p-3 w-fit mb-4 text-indigo-400">
                <AlertOctagon className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-200 mb-2">Rakshak AI Assistant</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Need guidance? Ask our Rakshak chatbot regarding reporting documents, cyber-fraudGolden Hours, and procedural tracking checklists.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-600 w-full">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} e-Abhaya. Empowering citizens through digitized, smart policing workflows.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Secure Protocol Active</span>
            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping"></div>
          </div>
        </div>
      </footer>

    </div>
  );
}

