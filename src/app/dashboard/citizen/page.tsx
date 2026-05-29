'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Plus, 
  FileText, 
  MapPin, 
  Clock, 
  Loader2, 
  ChevronRight, 
  ShieldCheck, 
  RefreshCw,
  MessageSquare,
  Bot,
  Activity,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Scale
} from 'lucide-react';
import NewComplaintWizard from '@/components/NewComplaintWizard';
import RakshakChat from '@/components/RakshakChat';

interface Complaint {
  id: string;
  trackingId: string;
  title: string;
  description: string;
  category: string;
  status: 'PENDING' | 'REVIEWING' | 'FIR_REGISTERED' | 'RESOLVED';
  aiSummary: string | null;
  aiPriorityScore: number;
  legalSections: string[];
  location: string;
  createdAt: string;
  updatedAt: string;
}

export default function CitizenDashboard() {
  const { data: session } = useSession();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const fetchComplaints = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await fetch('/api/complaints');
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
        // Sync active complaint details if it was open
        if (activeComplaint) {
          const updated = data.find((c: Complaint) => c.id === activeComplaint.id);
          if (updated) setActiveComplaint(updated);
        }
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleWizardSuccess = () => {
    setIsWizardOpen(false);
    fetchComplaints();
  };

  // Status mapping to color styles
  const getStatusStyle = (status: Complaint['status']) => {
    switch (status) {
      case 'PENDING':
        return 'text-amber-400 bg-amber-950/20 border-amber-900/40';
      case 'REVIEWING':
        return 'text-sky-400 bg-sky-950/20 border-sky-900/40';
      case 'FIR_REGISTERED':
        return 'text-rose-400 bg-rose-950/30 border-rose-900/40 font-bold';
      case 'RESOLVED':
        return 'text-emerald-400 bg-emerald-950/20 border-emerald-900/40';
    }
  };

  const getPriorityColor = (score: number) => {
    if (score < 40) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
    if (score < 75) return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/20';
  };

  // Compile Quick Stats Counters
  const totalReports = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'PENDING').length;
  const reviewingCount = complaints.filter(c => c.status === 'REVIEWING').length;
  const registeredFirs = complaints.filter(c => c.status === 'FIR_REGISTERED').length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Citizen Safety Hub
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Securely register complaints, track legal FIR reviews, and access Rakshak AI guidance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchComplaints(true)}
            disabled={refreshing}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 p-2.5 rounded-xl border border-slate-800 transition-all duration-300 disabled:opacity-50 shrink-0"
            title="Refresh Complaints Queue"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsWizardOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-slate-100 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 tracking-wide transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_15px_rgba(79,70,229,0.3)] shrink-0"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>File New Complaint</span>
          </button>
        </div>
      </div>

      {/* 2. STATS COUNTER DISPLAY GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Filings</span>
          <span className="text-2xl font-extrabold mt-1 text-slate-200">{totalReports}</span>
        </div>
        <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Under Review</span>
          <span className="text-2xl font-extrabold mt-1 text-sky-400">{reviewingCount}</span>
        </div>
        <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">FIR Registered</span>
          <span className="text-2xl font-extrabold mt-1 text-rose-500">{registeredFirs}</span>
        </div>
        <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Resolved Cases</span>
          <span className="text-2xl font-extrabold mt-1 text-emerald-400">{resolvedCount}</span>
        </div>
      </div>

      {/* 3. MAIN COMPLAINTS WORKFLOW LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Complaints List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Filing Records ({complaints.length})
          </h3>

          {loading ? (
            <div className="bg-slate-900/20 border border-slate-900 p-12 rounded-2xl flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
              <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase">Retrieving case files...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="bg-slate-900/20 border border-slate-900 p-12 rounded-2xl text-center space-y-4">
              <div className="p-4 bg-indigo-950/40 border border-indigo-900/20 rounded-full w-fit mx-auto text-indigo-400">
                <FileText className="h-8 w-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-sm font-bold text-slate-300">No active complaints found</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Your record registry is empty. If you are a victim of theft, cyber-fraud, or physical intimidation, file a smart complaint securely to begin investigation.
                </p>
                <button
                  onClick={() => setIsWizardOpen(true)}
                  className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 mt-4"
                >
                  File Your First Complaint
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveComplaint(item)}
                  className={`bg-slate-900/40 border p-5 rounded-2xl hover:bg-slate-900/80 transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 ${activeComplaint?.id === item.id ? 'border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.1)] bg-slate-900/70' : 'border-slate-900 hover:border-slate-850'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold text-slate-500 tracking-wider font-mono">{item.trackingId}</span>
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusStyle(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-200 mt-1.5 leading-snug">{item.title}</h4>
                    </div>

                    {item.aiPriorityScore > 0 && (
                      <span className={`inline-flex shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getPriorityColor(item.aiPriorityScore)}`}>
                        Priority {item.aiPriorityScore}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-900/80 pt-3">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" /> {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" /> {new Date(item.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Timeline Tracking & Detail View */}
        <div className="lg:col-span-1">
          {activeComplaint ? (
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-6 sticky top-24 animate-fadeIn">
              
              {/* Detailed Header */}
              <div>
                <span className="text-xs font-bold text-slate-500 tracking-wider font-mono">{activeComplaint.trackingId}</span>
                <h3 className="text-sm font-bold text-slate-200 mt-1 leading-normal">{activeComplaint.title}</h3>
                <div className="flex items-center gap-2.5 mt-2">
                  <span className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-bold border ${getStatusStyle(activeComplaint.status)}`}>
                    {activeComplaint.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    {activeComplaint.category}
                  </span>
                </div>
              </div>

              {/* 4. VISUAL TIMELINE PROGRESSION STEPPER */}
              <div className="space-y-5 border-t border-slate-850 pt-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-4">
                  Live Status Tracking
                </span>
                
                <div className="relative pl-6 space-y-6 border-l border-slate-850">
                  
                  {/* Step 1: Submitted */}
                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 h-4.5 w-4.5 rounded-full border border-emerald-500 bg-slate-950 flex items-center justify-center text-[10px] text-emerald-400">✓</span>
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">Complaint Submitted</h5>
                      <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Initial digital report received by safety node.</p>
                    </div>
                  </div>

                  {/* Step 2: Under Review */}
                  <div className="relative">
                    <span className={`absolute -left-[30px] top-0 h-4.5 w-4.5 rounded-full border flex items-center justify-center text-[10px] ${
                      activeComplaint.status !== 'PENDING' 
                        ? 'border-emerald-500 bg-slate-950 text-emerald-400' 
                        : 'border-slate-800 bg-slate-950 text-slate-600'
                    }`}>
                      {activeComplaint.status !== 'PENDING' ? '✓' : '2'}
                    </span>
                    <div>
                      <h5 className={`text-xs font-bold ${activeComplaint.status !== 'PENDING' ? 'text-slate-200' : 'text-slate-600'}`}>Under Officer Review</h5>
                      <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Investigating officer matching penal codes and details.</p>
                    </div>
                  </div>

                  {/* Step 3: FIR Registered */}
                  <div className="relative">
                    <span className={`absolute -left-[30px] top-0 h-4.5 w-4.5 rounded-full border flex items-center justify-center text-[10px] ${
                      activeComplaint.status === 'FIR_REGISTERED' || activeComplaint.status === 'RESOLVED'
                        ? 'border-emerald-500 bg-slate-950 text-emerald-400' 
                        : 'border-slate-800 bg-slate-950 text-slate-600'
                    }`}>
                      {activeComplaint.status === 'FIR_REGISTERED' || activeComplaint.status === 'RESOLVED' ? '✓' : '3'}
                    </span>
                    <div>
                      <h5 className={`text-xs font-bold ${
                        activeComplaint.status === 'FIR_REGISTERED' || activeComplaint.status === 'RESOLVED'
                          ? 'text-slate-200' 
                          : 'text-slate-600'
                      }`}>FIR Registered</h5>
                      <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Official FIR approved. Legal clauses locked.</p>
                    </div>
                  </div>

                  {/* Step 4: Resolved */}
                  <div className="relative">
                    <span className={`absolute -left-[30px] top-0 h-4.5 w-4.5 rounded-full border flex items-center justify-center text-[10px] ${
                      activeComplaint.status === 'RESOLVED'
                        ? 'border-emerald-500 bg-slate-950 text-emerald-400' 
                        : 'border-slate-800 bg-slate-950 text-slate-600'
                    }`}>
                      {activeComplaint.status === 'RESOLVED' ? '✓' : '4'}
                    </span>
                    <div>
                      <h5 className={`text-xs font-bold ${activeComplaint.status === 'RESOLVED' ? 'text-slate-200' : 'text-slate-600'}`}>Resolved</h5>
                      <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Final case report logged and filed.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Triage summary & locked sections */}
              <div className="border-t border-slate-850 pt-5 space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                  AI Assessment Records
                </span>

                {activeComplaint.legalSections.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block">Assigned Penal Sections:</span>
                    <div className="flex flex-wrap gap-1">
                      {activeComplaint.legalSections.map((sec, idx) => (
                        <span 
                          key={idx} 
                          className="inline-flex items-center gap-1 bg-slate-950/80 border border-slate-850 text-[10px] px-2 py-0.5 rounded text-slate-300 font-medium"
                        >
                          <Scale className="h-3 w-3 text-indigo-400" /> {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-indigo-400 block uppercase tracking-wider">AI Digest:</span>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {activeComplaint.aiSummary || 'Awaiting automated summary.'}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900/10 border border-slate-900 border-dashed rounded-2xl p-8 text-center text-xs text-slate-600 leading-relaxed font-medium sticky top-24">
              Select a filed complaint from your queue registry to trace live timelines, assigned legal sections, and investigator logs.
            </div>
          )}
        </div>

      </div>

      {/* 3-STEP NEW COMPLAINT wizard MODAL */}
      {isWizardOpen && (
        <NewComplaintWizard 
          onClose={() => setIsWizardOpen(false)}
          onSuccess={handleWizardSuccess}
        />
      )}

      {/* FLOATING RAKSHAK AI CHATBOT widget OVERLAY */}
      <RakshakChat />
    </div>
  );
}
