'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { Shield, Phone, LogOut, User, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Handle loading states
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-4">
        <div className="relative flex h-10 w-10">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-10 w-10 bg-indigo-500"></span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Securing Session...</p>
      </div>
    );
  }

  // Handle redirect if unauthenticated
  if (status === 'unauthenticated') {
    router.replace('/login');
    return null;
  }

  const user = session?.user as any;
  const userRole = user?.role;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* 1. PERSISTENT GLOBAL SOS BANNER */}
      <header 
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
              <Link href="/" className="font-semibold tracking-wider text-xs uppercase text-slate-200 hover:text-indigo-400 transition-colors">e-Abhaya SOS</Link>
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
      </header>

      {/* Main Admin Frame */}
      <div className="flex-grow flex flex-col md:flex-row">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/30 border-r border-slate-900 p-6 shrink-0 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Identity Badge */}
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-900/50 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-300 font-bold shrink-0">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-200 truncate">{user?.name || 'User'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {userRole === 'OFFICER' ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <ShieldCheck className="h-2 w-2 mr-1" /> Officer
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <User className="h-2 w-2 mr-1" /> Citizen
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Menu links */}
            <nav className="space-y-1">
              <Link 
                href={userRole === 'OFFICER' ? '/dashboard/officer' : '/dashboard/citizen'}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${pathname === '/dashboard/citizen' || pathname === '/dashboard/officer' ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 pl-3.5' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'}`}
              >
                <Activity className="h-4 w-4" />
                <span>Dashboard Queue</span>
              </Link>
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-900 mt-6">
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/10 transition-all duration-300 text-left"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out Securely</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 bg-slate-950/30 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
