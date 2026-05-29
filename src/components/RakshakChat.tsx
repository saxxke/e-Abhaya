'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Shield, HelpCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function RakshakChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Greetings! I am **Rakshak AI**, your virtual guide for legal and procedural support on e-Abhaya. Tell me what happened, or ask about standard procedures, required documents, or case tracking.',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handlePresetClick = (query: string) => {
    sendMessage(query);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message.trim());
    setMessage('');
  };

  const sendMessage = async (text: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      
      // Delay response slightly for natural chat feeling
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: data.response || 'I apologize, I could not process that message. Can you try rephrasing?',
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 700);

    } catch (err) {
      setIsTyping(false);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: '⚠️ Network connection lost. Please try asking again in a few moments.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  // Render text with simple bold/link replacements
  const renderMessageText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold syntax **word** -> <strong>word</strong>
      let rendered = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="text-indigo-300 font-semibold">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <p key={idx} className={idx > 0 ? "mt-1.5" : ""}>
          {parts.length > 0 ? parts : rendered}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      
      {/* Floating Chat FAB button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-slate-100 p-4 rounded-full shadow-[0_4px_25px_rgba(79,70,229,0.35)] hover:shadow-[0_4px_30px_rgba(79,70,229,0.55)] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 group"
          aria-label="Open Rakshak AI Help Desk"
        >
          <MessageSquare className="h-6 w-6 group-hover:rotate-6 transition-transform" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out font-bold text-sm tracking-wide whitespace-nowrap">
            Ask Rakshak AI
          </span>
        </button>
      )}

      {/* Floating Sliding Panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-slideUp">
          
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-950/50 border border-indigo-500/30 rounded-lg text-indigo-400">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Rakshak AI Assistant</h4>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                  <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">Standard Legal Guide</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1"
              aria-label="Close Chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages Logs */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="h-7 w-7 rounded-full bg-indigo-950 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0 text-xs mt-1">
                    R
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-600 text-slate-100 rounded-tr-none' : 'bg-slate-950/80 border border-slate-800/80 text-slate-300 rounded-tl-none'}`}
                >
                  {renderMessageText(msg.text)}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="h-7 w-7 rounded-full bg-indigo-950 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0 text-xs mt-1">
                  R
                </div>
                <div className="bg-slate-950 border border-slate-800/80 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1 shrink-0">
                  <span className="h-1.5 w-1.5 bg-slate-600 rounded-full animate-bounce"></span>
                  <span className="h-1.5 w-1.5 bg-slate-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-1.5 w-1.5 bg-slate-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick-Preset helper queries */}
          <div className="px-4 py-2 border-t border-slate-850/60 bg-slate-950/30 flex flex-wrap gap-1.5">
            <button
              onClick={() => handlePresetClick('Theft procedures')}
              className="text-[10px] bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-full transition-all duration-300"
            >
              🔑 Theft Documents
            </button>
            <button
              onClick={() => handlePresetClick('Cyber crime advice')}
              className="text-[10px] bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-full transition-all duration-300"
            >
              🚨 Cyber Scam Steps
            </button>
            <button
              onClick={() => handlePresetClick('How to file complaint')}
              className="text-[10px] bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-full transition-all duration-300"
            >
              📝 File Complaint FIR
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleFormSubmit} className="p-4 border-t border-slate-800 bg-slate-900 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about procedures, documents..."
              className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 placeholder:text-slate-600"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 p-2.5 rounded-xl text-slate-100 shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-colors active:scale-95 shrink-0"
              aria-label="Send Message"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
