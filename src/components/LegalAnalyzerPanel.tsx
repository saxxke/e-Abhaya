'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Scale, 
  Plus, 
  Check, 
  FileCode, 
  FolderLock, 
  CheckCircle,
  AlertTriangle,
  Loader2,
  FileText
} from 'lucide-react';

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
  submittedBy?: {
    name: string;
    email: string;
  };
}

interface LegalAnalyzerPanelProps {
  complaint: Complaint;
  onUpdate: () => void;
}

export default function LegalAnalyzerPanel({ complaint, onUpdate }: LegalAnalyzerPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Active penal sections state
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [newSection, setNewSection] = useState('');

  // Initialize selected sections from complaint data
  useEffect(() => {
    if (complaint) {
      setSelectedSections(complaint.legalSections || []);
      setError('');
      setSuccess('');
    }
  }, [complaint]);

  // Toggle a chip on or off
  const handleToggleSection = (section: string) => {
    setError('');
    setSuccess('');
    if (selectedSections.includes(section)) {
      setSelectedSections((prev) => prev.filter((item) => item !== section));
    } else {
      setSelectedSections((prev) => [...prev, section]);
    }
  };

  // Add custom section typed by officer
  const handleAddCustomSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSection.trim()) return;

    const formatted = newSection.trim();
    if (selectedSections.includes(formatted)) {
      setError('Section is already added.');
      return;
    }

    setSelectedSections((prev) => [...prev, formatted]);
    setNewSection('');
    setError('');
  };

  // Save changes to legal sections (PATCH call)
  const handleSaveSections = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/complaints/${complaint.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          legalSections: selectedSections
        })
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update sections.');
      } else {
        setSuccess('Suggested penal sections updated and synced!');
        onUpdate();
      }
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  // Official Status Transition: Register FIR or Resolve Case
  const handleStatusTransition = async (nextStatus: 'FIR_REGISTERED' | 'RESOLVED') => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/complaints/${complaint.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          legalSections: selectedSections // Lock selected sections in the database
        })
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Action failed.');
      } else {
        if (nextStatus === 'FIR_REGISTERED') {
          setSuccess('FIR officially approved and registered! Incident is now under active investigation.');
        } else {
          setSuccess('Case file formally closed and resolved.');
        }
        onUpdate();
      }
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (score: number) => {
    if (score < 40) return 'text-emerald-400 bg-emerald-950/20 border-emerald-900/40';
    if (score < 75) return 'text-amber-400 bg-amber-950/20 border-amber-900/40';
    return 'text-rose-400 bg-rose-950/30 border-rose-900/40';
  };

  const getPriorityProgressColor = (score: number) => {
    if (score < 40) return 'bg-emerald-500';
    if (score < 75) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-6 animate-fadeIn">
      
      {/* Case Header */}
      <div className="border-b border-slate-850 pb-5">
        <div className="flex justify-between items-center text-xs font-mono text-slate-500">
          <span>ID: {complaint.trackingId}</span>
          <span>Submitted: {new Date(complaint.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
        </div>
        <h3 className="text-base font-bold text-slate-200 mt-2 leading-snug">{complaint.title}</h3>
        
        {complaint.submittedBy && (
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Complainant: <span className="text-indigo-400">{complaint.submittedBy.name}</span> ({complaint.submittedBy.email})
          </p>
        )}
      </div>

      {/* Narrative & AI Summary */}
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1.5">
            Narrative Statement
          </span>
          <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl text-xs text-slate-300 leading-relaxed max-h-[160px] overflow-y-auto">
            {complaint.description}
          </div>
        </div>

        {complaint.aiSummary && (
          <div className="bg-indigo-950/10 border border-indigo-950/45 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-indigo-400 block uppercase tracking-wider">AI Generated digest:</span>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {complaint.aiSummary}
            </p>
          </div>
        )}
      </div>

      {/* Interactive AI Triage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-850 pt-5">
        <div className="p-3.5 bg-slate-950/60 border border-slate-850 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
            <span className="text-slate-500">Urgency Meter</span>
            <span className={getPriorityColor(complaint.aiPriorityScore).split(' ')[0]}>{complaint.aiPriorityScore} / 100</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getPriorityProgressColor(complaint.aiPriorityScore)}`}
              style={{ width: `${complaint.aiPriorityScore}%` }}
            ></div>
          </div>
        </div>

        <div className="p-3.5 bg-slate-950/60 border border-slate-850 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Auto Classification</span>
          <span className="inline-flex w-fit px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mt-1">
            {complaint.category}
          </span>
        </div>
      </div>

      {/* 2. INTERACTIVE AI LEGAL ASSESSMENT MODULE */}
      <div className="border-t border-slate-850 pt-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <Scale className="h-4 w-4 text-slate-400" /> Penal Code Allocation (BNS/IPC/IT)
          </span>
          <span className="text-[9px] text-slate-500 font-semibold uppercase">Click chips to toggle review</span>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-900/60 text-rose-200 rounded-xl text-[10px] flex items-start gap-2 animate-headShake" role="alert">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 text-emerald-200 rounded-xl text-[10px] flex items-start gap-2" role="alert">
            <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Selected Sections Chips List */}
        <div className="flex flex-wrap gap-1.5">
          {selectedSections.length > 0 ? (
            selectedSections.map((sec) => (
              <button
                key={sec}
                onClick={() => handleToggleSection(sec)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/40 text-indigo-300 hover:bg-slate-900 hover:border-slate-800 hover:text-slate-400 transition-all duration-300"
                title="Click to remove from FIR"
              >
                <Check className="h-3 w-3 text-indigo-400" />
                <span>{sec}</span>
              </button>
            ))
          ) : (
            <p className="text-xs text-slate-600 italic">No penal sections active. Add sections below to configure the FIR.</p>
          )}

          {/* Render seed BNS templates as recommended chips if not already in the list, allowing easy toggle-ins! */}
          {['Section 303(2) BNS - Theft', 'Section 318 BNS - Cheating', 'Section 66D - IT Act', 'Section 331 BNS - House-trespass', 'Section 351 BNS - Criminal Intimidation']
            .filter((item) => !selectedSections.includes(item))
            .map((sec) => (
              <button
                key={sec}
                onClick={() => handleToggleSection(sec)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-500 hover:bg-indigo-500/5 hover:border-indigo-500/20 hover:text-indigo-400 transition-all duration-300"
                title="Click to add to FIR"
              >
                <Plus className="h-3 w-3 text-slate-600" />
                <span>{sec}</span>
              </button>
            ))
          }
        </div>

        {/* Custom Section Input Form */}
        <form onSubmit={handleAddCustomSection} className="flex gap-2">
          <input
            type="text"
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
            placeholder="Add custom code (e.g., Section 296 BNS)"
            className="flex-grow bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none transition-colors placeholder:text-slate-700 font-medium"
          />
          <button
            type="submit"
            className="bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <Plus className="h-4 w-4" /> Add Section
          </button>
        </form>

        <div className="flex gap-3">
          <button
            onClick={handleSaveSections}
            disabled={loading}
            className="bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 px-4 py-2 rounded-xl text-xs font-bold transition-colors active:scale-95 disabled:opacity-50"
          >
            Save Sections Draft
          </button>
        </div>
      </div>

      {/* 3. CASE ACTION TIMELINE ENFORCEMENT & FIR APPROVAL */}
      <div className="border-t border-slate-850 pt-5 space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
          Official Case Transitions
        </span>

        {complaint.status === 'PENDING' || complaint.status === 'REVIEWING' ? (
          <div className="space-y-3">
            <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-xl text-xs text-rose-300/90 leading-relaxed font-medium">
              🚨 **FIR Registration Action:** Approving this transitions the complaint to an official criminal investigation file (`FIR_REGISTERED`), locking current penal sections under the audit log.
            </div>
            <button
              onClick={() => handleStatusTransition('FIR_REGISTERED')}
              disabled={loading || selectedSections.length === 0}
              className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-slate-100 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all duration-300 active:scale-98"
            >
              <FolderLock className="h-4.5 w-4.5" />
              <span>{loading ? 'Confirming Action...' : 'Approve & Register Official FIR'}</span>
            </button>
          </div>
        ) : complaint.status === 'FIR_REGISTERED' ? (
          <div className="space-y-3">
            <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-xs text-emerald-300/90 leading-relaxed font-medium">
              ✓ **Case Resolution Action:** Conclude active investigation, log final disposition, and mark complaint status as `RESOLVED`.
            </div>
            <button
              onClick={() => handleStatusTransition('RESOLVED')}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-100 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-300 active:scale-98"
            >
              <CheckCircle className="h-4.5 w-4.5" />
              <span>{loading ? 'Closing Case...' : 'Mark Complaint as Resolved'}</span>
            </button>
          </div>
        ) : (
          <div className="bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl text-xs text-emerald-300/80 leading-normal flex items-center gap-2.5 font-medium">
            <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>This complaint registry is fully resolved. Case investigation closed.</span>
          </div>
        )}
      </div>

    </div>
  );
}
