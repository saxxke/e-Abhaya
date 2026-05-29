'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Loader2, 
  RefreshCw, 
  Bot, 
  Scale, 
  CheckCircle,
  FileText,
  User,
  Search,
  Filter
} from 'lucide-react';
import LegalAnalyzerPanel from '@/components/LegalAnalyzerPanel';

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

export default function OfficerDashboard() {
  const { data: session } = useSession();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('ALL'); // ALL, PENDING, REVIEWING, FIR_REGISTERED, RESOLVED
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchComplaints = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await fetch('/api/complaints');
      if (res.ok) {
        const data = await res.json();
        
        // Sorting queue strictly by aiPriorityScore descending as required
        const sorted = data.sort((a: Complaint, b: Complaint) => b.aiPriorityScore - a.aiPriorityScore);
        
        setComplaints(sorted);

        // Keep active selection synced
        if (selectedComplaint) {
          const updated = sorted.find((c: Complaint) => c.id === selectedComplaint.id);
          if (updated) setSelectedComplaint(updated);
        } else if (sorted.length > 0 && !selectedComplaint) {
          // Auto select first complaint for a premium out-of-the-box split interface
          setSelectedComplaint(sorted[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching officer complaints:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateSuccess = () => {
    fetchComplaints(true);
  };

  // Status mapping to badge style
  const getStatusBadgeStyle = (status: Complaint['status']) => {
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

  const getPriorityBadgeStyle = (score: number) => {
    if (score < 40) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (score < 75) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse';
  };

  // Apply filters
  const filteredComplaints = complaints.filter((item) => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.submittedBy?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 font-sans">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Investigating Officer Console
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Review digital crime files, customize penal sections, and register official smart FIRs.
          </p>
        </div>

        <button
          onClick={() => fetchComplaints(true)}
          disabled={refreshing}
          className="bg-slate-900 hover:bg-slate-800 text-slate-300 p-2.5 rounded-xl border border-slate-800 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shrink-0 self-start sm:self-center text-xs font-bold"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Sync Queue</span>
        </button>
      </div>

      {/* 1. FILTER TABS & SEARCH CONTAINER */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        
        {/* Search */}
        <div className="relative flex-grow max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Tracking ID, complainant name, keywords..."
            className="w-full bg-slate-900/40 border border-slate-900 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none transition-colors placeholder:text-slate-700"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/30 border border-slate-900/80 p-1 rounded-xl w-fit">
          {['ALL', 'PENDING', 'REVIEWING', 'FIR_REGISTERED', 'RESOLVED'].map((filterTab) => (
            <button
              key={filterTab}
              onClick={() => setStatusFilter(filterTab)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${statusFilter === filterTab ? 'bg-indigo-600 text-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'}`}
            >
              {filterTab === 'ALL' ? 'All Queue' : filterTab.replace('_', ' ')}
            </button>
          ))}
        </div>

      </div>

      {/* 3. SPLIT PANEL QUEUE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column: Urgency Queue List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Urgency Queue ({filteredComplaints.length})
            </h3>
            <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">Sorted by Urgency Index</span>
          </div>

          {loading ? (
            <div className="bg-slate-900/20 border border-slate-900 p-12 rounded-2xl flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
              <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase">Assembling triage file queue...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="bg-slate-900/20 border border-slate-900 border-dashed p-12 rounded-2xl text-center">
              <FileText className="h-8 w-8 text-slate-600 mx-auto mb-3" />
              <h4 className="text-xs font-bold text-slate-400">No matching files in queue</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                Try clearing your search query or switching status filters to review other logs.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-900">
              {filteredComplaints.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedComplaint(item)}
                  className={`bg-slate-900/40 border p-4.5 rounded-2xl hover:bg-slate-900/80 transition-all duration-300 cursor-pointer flex flex-col gap-3 ${selectedComplaint?.id === item.id ? 'border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.1)] bg-slate-900/70' : 'border-slate-900 hover:border-slate-850'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-slate-500 tracking-wider font-mono">{item.trackingId}</span>
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold border ${getStatusBadgeStyle(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 mt-1.5 truncate">{item.title}</h4>
                    </div>

                    <div className={`inline-flex shrink-0 px-2 py-0.5 rounded-full text-[9px] font-semibold border ${getPriorityBadgeStyle(item.aiPriorityScore)}`}>
                      Urgency: {item.aiPriorityScore}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-[9px] text-slate-500 border-t border-slate-900/80 pt-2.5">
                    <span className="flex items-center gap-1 font-medium truncate max-w-[120px]">
                      <User className="h-3 w-3 text-slate-500" /> {item.submittedBy?.name || 'Citizen'}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="h-3 w-3 text-slate-500" /> {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-500" /> {new Date(item.createdAt).toLocaleDateString(undefined, { dateStyle: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: AI Triage & FIR Customization Panel */}
        <div className="lg:col-span-3">
          {selectedComplaint ? (
            <LegalAnalyzerPanel 
              complaint={selectedComplaint}
              onUpdate={handleUpdateSuccess}
            />
          ) : (
            <div className="bg-slate-900/10 border border-slate-900 border-dashed rounded-2xl p-12 text-center text-xs text-slate-600 leading-relaxed font-medium">
              Select a file card from the urgency queue to load the Legal Assessment Panel, verify statements, approve sections, and register official FIR entries.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
