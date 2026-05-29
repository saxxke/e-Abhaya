'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  MapPin, 
  Calendar, 
  AlignLeft, 
  Paperclip, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Bot, 
  AlertTriangle,
  Scale,
  FileCode,
  File,
  X,
  UploadCloud,
  FileImage
} from 'lucide-react';

interface NewComplaintWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface MockAttachment {
  name: string;
  size: string;
  type: string;
}

export default function NewComplaintWizard({ onClose, onSuccess }: NewComplaintWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Incident Basics
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('THEFT');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  // Step 2: Narrative Text
  const [description, setDescription] = useState('');
  
  // Real-time AI Triage Preview States
  const [aiTriageLoading, setAiTriageLoading] = useState(false);
  const [aiCategory, setAiCategory] = useState('THEFT');
  const [aiPriorityScore, setAiPriorityScore] = useState(0);
  const [aiSuggestedSections, setAiSuggestedSections] = useState<string[]>([]);
  const [aiSummary, setAiSummary] = useState('');

  // Step 3: Evidence Attachments
  const [attachments, setAttachments] = useState<MockAttachment[]>([]);

  // Debounced Live AI Triage Trigger (Step 2)
  useEffect(() => {
    if (!description.trim() || description.length < 15) {
      setAiPriorityScore(0);
      setAiSuggestedSections([]);
      setAiSummary('');
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setAiTriageLoading(true);
      try {
        const res = await fetch('/api/triage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description })
        });

        if (res.ok) {
          const data = await res.json();
          setAiCategory(data.category);
          setAiPriorityScore(data.priorityScore);
          setAiSuggestedSections(data.suggestedSections);
          setAiSummary(data.aiSummary);
        }
      } catch (err) {
        console.error('Triage call error:', err);
      } finally {
        setAiTriageLoading(false);
      }
    }, 600); // 600ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [description, title]);

  // Handle mock evidence attachment creation
  const handleAddMockAttachment = (fileName: string, fileSize: string, fileType: string) => {
    setError('');
    // Avoid duplicates
    if (attachments.some((item) => item.name === fileName)) return;
    setAttachments((prev) => [...prev, { name: fileName, size: fileSize, type: fileType }]);
  };

  const handleRemoveAttachment = (name: string) => {
    setAttachments((prev) => prev.filter((item) => item.name !== name));
  };

  // Submit Handler
  const handleFormSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category: aiCategory || category,
          location,
          aiSummary: aiSummary || 'Narrative analysis pending review.',
          aiPriorityScore: aiPriorityScore || 20,
          legalSections: aiSuggestedSections
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to submit complaint.');
      } else {
        onSuccess();
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Priority color indicators
  const getPriorityColor = (score: number) => {
    if (score === 0) return 'text-slate-500 bg-slate-900/60';
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-zoomIn">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-950 border border-indigo-500/20 rounded-xl text-indigo-400 shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-200">File New Complaint</h3>
              <p className="text-xs text-slate-500">Secure, encrypted submission channel</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition-all duration-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wizard Progression Stepper */}
        <div className="px-6 py-4 bg-slate-950/40 border-b border-slate-850/60 flex items-center justify-between text-xs font-semibold tracking-wider uppercase text-slate-500">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-400 font-bold' : ''}`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center border text-[10px] ${step >= 1 ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900'}`}>1</span>
            <span>Incident Basics</span>
          </div>
          <div className="h-px bg-slate-800 flex-grow mx-4"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-400 font-bold' : ''}`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center border text-[10px] ${step >= 2 ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900'}`}>2</span>
            <span>Narrative details</span>
          </div>
          <div className="h-px bg-slate-800 flex-grow mx-4"></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-indigo-400 font-bold' : ''}`}>
            <span className={`h-5 w-5 rounded-full flex items-center justify-center border text-[10px] ${step >= 3 ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900'}`}>3</span>
            <span>Evidence</span>
          </div>
        </div>

        {/* Form Body - Scrollable Area */}
        <div className="flex-grow p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-850">
          
          {error && (
            <div className="p-4 bg-rose-950/40 border border-rose-900/60 text-rose-200 rounded-xl text-xs flex items-start gap-3" role="alert">
              <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: INCIDENT BASICS */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Incident Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Stolen Bicycle from Residential Garage"
                  required
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none transition-colors placeholder:text-slate-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Category (Initial Selection)</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none transition-colors"
                  >
                    <option value="THEFT">THEFT</option>
                    <option value="CYBER_CRIME">CYBER CRIME</option>
                    <option value="ASSAULT">ASSAULT / HARESSEMENT</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Incident Date & Time</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500 pointer-events-none" />
                    <input 
                      type="datetime-local"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Incident Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500 pointer-events-none" />
                  <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Sector 4, Dwarka, New Delhi"
                    required
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none transition-colors placeholder:text-slate-600 font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: NARRATIVE DETAILS & REAL-TIME AI ANALYSIS */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Incident Narrative Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe exactly what happened. Mention key details like what was stolen, if someone threatened you, clicked phishing links, or entered verification details..."
                  rows={6}
                  required
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none transition-colors leading-relaxed placeholder:text-slate-600"
                />
                <span className="text-[10px] text-slate-500 block leading-normal">
                  💡 Type at least 15 characters to trigger the live AI Triage engine (auto-identifies penal codes and priority scoring).
                </span>
              </div>

              {/* JAW-DROPPING LIVE AI TRIAGE ASSESSMENT CARD */}
              <div className="bg-slate-950/70 border border-slate-850/80 rounded-2xl p-5 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    <Bot className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
                    <span>Real-Time Rakshak AI Triage</span>
                  </div>
                  {aiTriageLoading && (
                    <div className="flex items-center gap-1.5 text-[10px] text-indigo-400">
                      <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-ping"></span>
                      <span>Analyzing text...</span>
                    </div>
                  )}
                </div>

                {description.length >= 15 ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Priority Score Meter */}
                      <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-slate-500">Urgency Meter</span>
                          <span className={getPriorityColor(aiPriorityScore).split(' ')[0]}>{aiPriorityScore} / 100</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getPriorityProgressColor(aiPriorityScore)}`}
                            style={{ width: `${aiPriorityScore}%` }}
                          ></div>
                        </div>
                        <p className="text-[9px] text-slate-500 leading-tight">
                          Calculated priority indexes represent initial response timelines.
                        </p>
                      </div>

                      {/* Category Auto-Detection */}
                      <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl flex flex-col justify-between">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Auto-Detected Category
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {aiCategory}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500 leading-tight mt-2">
                          Automatically routes complaints to specialized officers.
                        </p>
                      </div>

                    </div>

                    {/* AI-Suggested Penal Code Sections */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Scale className="h-3.5 w-3.5 text-slate-400" /> Suggested Penal Sections (BNS/IPC)
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {aiSuggestedSections.map((sec, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-900 border border-slate-800 text-slate-300 font-semibold"
                          >
                            <FileCode className="h-3 w-3 text-indigo-400" />
                            {sec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* AI-Generated Executive Summary */}
                    <div className="bg-slate-900/40 border border-slate-850/60 rounded-xl p-3.5 text-xs text-slate-400 leading-relaxed">
                      <span className="font-bold text-slate-300 block mb-1">Incident Digest:</span>
                      {aiSummary}
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-slate-600 leading-relaxed font-medium">
                    Waiting for incident description details to initialize triage parameters...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: EVIDENCE ATTACHMENTS TRAY */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Attach Crime Evidence Media</label>
                <div 
                  className="bg-slate-950/40 border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-300 group"
                >
                  <UploadCloud className="h-10 w-10 text-slate-600 group-hover:text-indigo-400 transition-colors mb-3" />
                  <p className="text-xs font-bold text-slate-300">Drag & Drop files or browse media</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    Supports JPG, PNG, PDF, MP4 (Max size: 25MB per file). All media encrypted at rest.
                  </p>
                </div>
              </div>

              {/* Quick Mock Files Helpers */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  ⚡ Simulate Evidence (Double-Click to attach mock assets):
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddMockAttachment('CCTV_Entrance_Footage.mp4', '14.2 MB', 'video')}
                    className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 px-3 py-1.5 rounded-xl text-slate-300 hover:text-slate-100 transition-all duration-300 flex items-center gap-1.5"
                  >
                    📹 CCTV Backyard Video
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddMockAttachment('Phishing_Website_Screenshot.png', '1.4 MB', 'image')}
                    className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 px-3 py-1.5 rounded-xl text-slate-300 hover:text-slate-100 transition-all duration-300 flex items-center gap-1.5"
                  >
                    🖼️ Phishing SMS Screenshot
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddMockAttachment('Bicycle_Invoice.pdf', '320 KB', 'pdf')}
                    className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 px-3 py-1.5 rounded-xl text-slate-300 hover:text-slate-100 transition-all duration-300 flex items-center gap-1.5"
                  >
                    📄 Product Receipt PDF
                  </button>
                </div>
              </div>

              {/* Uploaded Files Queue */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Attachments Queue ({attachments.length})
                </span>

                {attachments.length > 0 ? (
                  <div className="space-y-2">
                    {attachments.map((file) => (
                      <div 
                        key={file.name}
                        className="bg-slate-950/80 border border-slate-850 p-3.5 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          {file.type === 'video' ? (
                            <UploadCloud className="h-4.5 w-4.5 text-rose-400 shrink-0" />
                          ) : file.type === 'image' ? (
                            <FileImage className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
                          ) : (
                            <File className="h-4.5 w-4.5 text-amber-400 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-slate-300 truncate max-w-xs">{file.name}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{file.size} • Encrypted</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveAttachment(file.name)}
                          className="text-slate-500 hover:text-slate-300 p-1 hover:bg-slate-900 rounded transition-all duration-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-950/20 border border-slate-850/60 rounded-xl text-xs text-slate-600 font-medium">
                    No files attached. Providing media significantly increases investigation rates.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-6 border-t border-slate-850 bg-slate-900 flex justify-between gap-4 shrink-0">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-98"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            )}
          </div>
          <div>
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && (!title.trim() || !location.trim() || !date)}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-slate-100 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-98 shadow-[0_0_10px_rgba(79,70,229,0.2)]"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFormSubmit}
                disabled={loading || description.length < 15}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-100 px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-98 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              >
                <CheckCircle className="h-4 w-4" /> {loading ? 'Submitting FIR...' : 'Submit Secure Complaint'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
