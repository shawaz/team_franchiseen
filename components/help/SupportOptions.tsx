'use client';

import React from 'react';
import { MessageCircle, Mic, Phone, Mail, Clock } from 'lucide-react';

interface SupportOption {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: string;
  available: string;
  color: string;
}

interface SupportOptionsProps {
  onChatClick: () => void;
  onVoiceClick: () => void;
}

const supportOptions: SupportOption[] = [
  {
    icon: MessageCircle,
    title: 'AI Chat Support',
    description: 'Get instant answers',
    action: 'Start Chat',
    available: '24/7',
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    icon: Mic,
    title: 'Voice Assistant',
    description: 'Speak your questions',
    action: 'Start Voice Call',
    available: '24/7',
    color: 'bg-purple-600 hover:bg-purple-700',
  },
  // {
  //   icon: Phone,
  //   title: 'Phone Support',
  //   description: 'Talk to our human support team',
  //   action: 'Call Now',
  //   available: 'Mon-Fri 9AM-6PM',
  //   color: 'bg-green-600 hover:bg-green-700',
  // },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us a detailed message',
    action: 'Send Email',
    available: 'Response within 24h',
    color: 'bg-orange-600 hover:bg-orange-700',
  },
];

export default function SupportOptions({ onChatClick, onVoiceClick }: SupportOptionsProps) {
  const handleOptionClick = (option: SupportOption) => {
    if (option.title === 'AI Chat Support') {
      onChatClick();
    } else if (option.title === 'Voice Assistant') {
      onVoiceClick();
    } else if (option.title === 'Phone Support') {
      // Handle phone support
      window.open('tel:+1-800-FRANCHISE', '_self');
    } else if (option.title === 'Email Support') {
      // Handle email support
      window.open('mailto:support@franchiseen.com', '_self');
    }
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Get instant support
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your preferred way to get help - from AI-powered assistance to human support
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {supportOptions.map((option) => (
            <div key={option.title} className="group">
              <div className="relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
                {/* Icon */}
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${option.color.replace('hover:', '').replace('bg-', 'bg-').replace('600', '100')} mb-4`}>
                    <option.icon className={`h-6 w-6 ${option.color.replace('hover:', '').replace('bg-', 'text-').replace('100', '600')}`} />
                  </div>
                </div>
                
                {/* Content */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{option.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{option.description}</p>
                </div>
                
                {/* Availability */}
                <div className="mb-6">
                  <span className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    <Clock className="h-3 w-3" />
                    {option.available}
                  </span>
                </div>
                
                {/* Action Button */}
                <button 
                  onClick={() => handleOptionClick(option)}
                  className={`w-full h-12 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${option.color} hover:scale-105 active:scale-95`}
                >
                  {option.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
