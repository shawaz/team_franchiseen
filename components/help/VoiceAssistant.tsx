'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import Vapi from '@vapi-ai/web';

interface VoiceAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function VoiceAssistant({ isOpen, onToggle }: VoiceAssistantProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const vapiRef = useRef<Vapi | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Vapi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);
    }
  }, []);

  const startCall = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (!vapiRef.current) {
        throw new Error('Vapi not initialized');
      }

      // Set up event listeners
      vapiRef.current.on('call-start', () => {
        setIsConnected(true);
        setIsConnecting(false);
        startTimer();
      });

      vapiRef.current.on('call-end', () => {
        setIsConnected(false);
        setIsConnecting(false);
        stopTimer();
        setTranscript('');
        setAssistantResponse('');
        setCallDuration(0);
      });

      vapiRef.current.on('speech-start', () => {
        // Handle speech start - simplified to avoid type issues
        setTranscript('');
      });

      // Note: Removed transcript handler due to type issues
      // This would need proper implementation based on VAPI documentation

      vapiRef.current.on('error', () => {
        setError('An error occurred during the call');
        setIsConnecting(false);
        setIsConnected(false);
      });

      // Start the call with assistant configuration
      await vapiRef.current.start({
        model: {
          provider: 'openai',
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              
              content: `You are Franny, the voice assistant for Franchiseen, a new franchise management platform.

Franchiseen is designed to:

Help brands in the UAE register and manage their franchises

Enable investors to fund outlets and earn through automated revenue sharing

Use Solana blockchain for secure payments and tokenized shares

Provide tools for managing POS, expenses, and payouts

Support franchise growth from setup to daily operations

Your role is to:

Guide potential franchise partners through platform features

Explain how to register a franchise or outlet

Answer basic investor questions on how funding and payouts will work

Assist with account and technical setup

Keep responses short, clear, and conversational (voice-first)

If you cannot answer something, politely suggest connecting with the Franchiseen team.`
            }
          ],
          temperature: 0.5,
          maxTokens: 100,
        },
        voice: {
          provider: 'playht',
          voiceId: 'jennifer',
          speed: 0.9,
        },
        firstMessage: "Hi! I am Franny, your Franchiseen assistant. We are helping brands in the UAE manage and grow their franchises with blockchain-powered tools. Would you like to learn how to register your franchise, or explore how investors can join?",
        // Note: Some properties removed due to type constraints
      });

    } catch (error) {
      console.error('Failed to start voice call:', error);
      setError('Failed to start voice call. Please try again.');
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  const toggleMute = () => {
    if (vapiRef.current) {
      const newMutedState = !isMuted;
      vapiRef.current.setMuted(newMutedState);
      setIsMuted(newMutedState);
    }
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
      stopTimer();
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900 bg-opacity-400">
      <div className="bg-stone-800 shadow-2xl w-96 max-w-[calc(100vw-2rem)] p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Voice Assistant</h2>
          <p className="text-sm text-stone-500">
            {isConnected ? 'Connected - Speak naturally' : 'Start a voice conversation with our AI assistant'}
          </p>
        </div>

        {/* Call Status */}
        <div className="text-center mb-6">
          {isConnecting && (
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <div className="animate-spin  h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-sm">Connecting...</span>
            </div>
          )}
          
          {isConnected && (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-600  animate-pulse"></div>
                <span className="text-sm font-medium">Live - {formatDuration(callDuration)}</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Transcript Display */}
        {isConnected && (
          <div className="mb-6 space-y-3">
            {transcript && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>You:</strong> {transcript}
                </p>
              </div>
            )}
            
            {assistantResponse && (
              <div className="bg-stone-50 p-3 rounded-lg">
                <p className="text-sm text-stone-800">
                  <strong>Assistant:</strong> {assistantResponse}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6 ">
          {!isConnected && !isConnecting && (
            <button
              onClick={startCall}
              className="flex w-full items-center justify-center gap-2 bg-yellow-600 text-white py-3  hover:bg-yellow-700 transition-colors"
            >
              <Phone className="h-5 w-5" />
              Start Call
            </button>
          )}
          
          {isConnected && (
            <>
              <button
                onClick={toggleMute}
                className={`p-3  transition-colors ${
                  isMuted 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              
              <button
                onClick={endCall}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-3  hover:bg-red-700 transition-colors"
              >
                <PhoneOff className="h-5 w-5" />
                End Call
              </button>
            </>
          )}
        </div>

        {/* Close Button */}
        <div className="text-center mt-6">
          <button
            onClick={onToggle}
            className="text-stone-500 hover:text-stone-700 text-sm border border-stone-500 w-full py-3  transition-colors"
          >
            Close
          </button>
        </div>

        {/* Instructions */}
        {!isConnected && !isConnecting && (
          <div className="mt-6 p-3 bg-stone-700">
            <p className="text-xs text-stone-50">
              <strong>Tip:</strong> Make sure your microphone is enabled and speak clearly. 
              The assistant can help with franchise management, payments, and platform features.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
