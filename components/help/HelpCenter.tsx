'use client';

import React from 'react';
import AIChatWidget from './AIChatWidget';
import VoiceAssistant from './VoiceAssistant';

interface HelpCenterProps {
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isVoiceOpen: boolean;
  setIsVoiceOpen: (open: boolean) => void;
}

export default function HelpCenter({
  isChatOpen,
  setIsChatOpen,
  isVoiceOpen,
  setIsVoiceOpen
}: HelpCenterProps) {
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (isVoiceOpen) setIsVoiceOpen(false); // Close voice if chat opens
  };

  const toggleVoice = () => {
    setIsVoiceOpen(!isVoiceOpen);
    if (isChatOpen) setIsChatOpen(false); // Close chat if voice opens
  };

  return (
    <>
      <AIChatWidget isOpen={isChatOpen} onToggle={toggleChat} />
      <VoiceAssistant isOpen={isVoiceOpen} onToggle={toggleVoice} />
      
      {/* Voice Assistant Trigger Button */}
      {!isChatOpen && !isVoiceOpen && (
        <button
          onClick={toggleVoice}
          className="fixed bottom-6 left-6 z-50 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-xl hover:shadow-2xl focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
          aria-label="Open voice assistant"
        >
          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </button>
      )}
    </>
  );
}
