'use client';

import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Shield, Phone, Mail, Lock, User, AlertTriangle, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('CITIZEN'); // CITIZEN or OFFICER

  // Feedback states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const userRole = (session.user as any).role;
      if (userRole === 'OFFICER') {
        router.push('/dashboard/officer');
      } else {
        router.push('/dashboard/citizen');
      }
    }
  }, [status, session, router]);

  // Handle auto-fill credential helper
  const handleQuickLogin = (type: 'citizen' | 'officer') => {
    setError('');
    setSuccess('');
    if (type === 'citizen') {
      setEmail('citizen@eabhaya.in');
      setPassword('password123');
      setIsLogin(true);
    } else {
      setEmail('officer@eabhaya.gov.in');
      setPassword('password123');
      setIsLogin(true);
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (isLogin) {
      // NextAuth Sign In
      try {
        const res = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (res?.error) {
          setError('Invalid email or password. Please try again.');
        } else {
          setSuccess('Login successful! Redirecting...');
          // Redirect will be handled by useEffect
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
      }
    } else {
      // Custom Registration API Simulation
      try {
        const registerRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role }),
        });

        const data = await registerRes.json();

        if (!registerRes.ok) {
          setError(data.error || 'Registration failed.');
        } else {
          setSuccess('Account created successfully! Auto-signing you in...');
          
          // Auto sign in after registration
          const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
          });

          if (res?.error) {
            setError('Account created, but automatic login failed. Please sign in manually.');
            setIsLogin(true);
          }
        }
      } catch (err) {
        setError('Connection failed. Please try again later.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      
      {/* 1. persistent HIGH VISIBILITY EMERGENCY SOS HUB BANNER */}
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
      </header>

      {/* Main Body */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Dynamic Glowing Accents */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-900/5 rounded-full blur-3xl -z-10"></div>

        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-200 via-indigo-400 to-rose-300 bg-clip-text text-transparent">
              e-Abhaya
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Smart FIR & Citizen Complaint Management System
            </p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl relative">
            <div className="flex border-b border-slate-800 mb-6">
              <button 
                onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                className={`w-1/2 pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all duration-300 ${isLogin ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                className={`w-1/2 pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all duration-300 ${!isLogin ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                Create Account
              </button>
            </div>

            {/* Error and Success Alert Panels */}
            {error && (
              <div className="mb-6 p-4 bg-rose-950/40 border border-rose-900/60 text-rose-200 rounded-xl text-xs flex items-start gap-3 animate-headShake" role="alert">
                <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-900/60 text-emerald-200 rounded-xl text-xs flex items-start gap-3" role="alert">
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="e.g. Rohan Sharma"
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 text-slate-100 placeholder:text-slate-600"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="citizen@eabhaya.in"
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 text-slate-100 placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-12 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 text-slate-100 placeholder:text-slate-600"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Account Role</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole('CITIZEN')}
                      className={`py-2 px-4 rounded-xl border text-xs font-semibold transition-all duration-300 ${role === 'CITIZEN' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                      Citizen User
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('OFFICER')}
                      className={`py-2 px-4 rounded-xl border text-xs font-semibold transition-all duration-300 ${role === 'OFFICER' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                      Investigating Officer
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-slate-100 py-3 rounded-xl font-semibold tracking-wide shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.45)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 text-sm mt-3 flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : isLogin ? 'Sign In Securely' : 'Register Secure Account'}
              </button>
            </form>

            {/* Quick-Access Seed Credentials Helper Area */}
            {isLogin && (
              <div className="mt-8 border-t border-slate-800 pt-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400/80 block mb-3">
                  ⚡ Quick-Access Testing Accounts:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => handleQuickLogin('citizen')}
                    className="flex flex-col text-left p-3 rounded-xl border border-slate-800 hover:border-indigo-500/50 bg-slate-950/45 hover:bg-slate-950/90 transition-all duration-300"
                  >
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <User className="h-3 w-3 text-indigo-400" /> Rohan Sharma (Citizen)
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">citizen@eabhaya.in</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleQuickLogin('officer')}
                    className="flex flex-col text-left p-3 rounded-xl border border-slate-800 hover:border-indigo-500/50 bg-slate-950/45 hover:bg-slate-950/90 transition-all duration-300"
                  >
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Shield className="h-3 w-3 text-rose-400" /> Insp. Vikram (Officer)
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">officer@eabhaya.gov.in</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} e-Abhaya Smart Policing Portal. Built for high accessibility and fearless crime reporting.</p>
      </footer>
    </div>
  );
}
