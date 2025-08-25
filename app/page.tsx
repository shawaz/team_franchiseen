"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Globe,
  Phone
} from 'lucide-react';
import Image from 'next/image';
import { getCalApi } from "@calcom/embed-react";
import VoiceAssistant from '@/components/help/VoiceAssistant';

export default function LaunchingSoonPage() {
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
     const handleVoiceClick = () => {
    setIsVoiceOpen(true);
  };

  const toggleVoice = () => {
    setIsVoiceOpen(!isVoiceOpen);// Close chat if voice opens
  };
  
  // Set launch date (example: 30 days from now)
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"franchiseen"});
      cal("ui", {"cssVarsPerTheme":{"light":{"cal-brand":"#292929"},"dark":{"cal-brand":"#fafafa"}},"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, [])
  
  return (
    <>

      {/* Hero Section */}
      <section className="  bg-stone-900  min-h-screen flex flex-col items-center justify-center py-20 px-4">
       <div className="flex items-center gap-3 pb-12">
              <Image
                src="/logo.svg"
                alt="Franchiseen"
                width={30}
                height={30}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-stone-200 dark:text-white">
                FRANCHISEEN
              </span>
            </div>
            
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Main Heading */}
            <div className="space-y-12">
              {/* <Badge className="bg-yellow-100/10 text-yellow-500 border-yellow-500 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Revolutionary Franchise Platform
              </Badge> */}
              <h1 className="text-5xl md:text-7xl font-bold text-stone-100 dark:text-white">
                The Future of
                <span className="bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent block">
                  Franchising
                </span>
                is Almost Here
              </h1>
              <p className="text-lg text-white max-w-3xl mx-auto leading-relaxed">
                Get ready for the world's most advanced franchise marketplace. Connect with verified brands, 
                smart investment tools, and a global community of franchise professionals.
              </p>
            </div>

            {/* Email Signup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-md mx-auto"
            >
              <button onClick={handleVoiceClick} className="w-full h-12 flex items-center justify-center gap-2 bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm border-2 hover:bg-white dark:hover:bg-stone-700 transition-colors text-stone-800 dark:text-white" >
<Phone className="w-4 h-4 mr-2" />
                Speak with Frany
              </button>

              {/* <Button onClick={handleVoiceClick} variant={"outline"} type="submit" className="w-full h-12">
                <Phone className="w-4 h-4 mr-2" />
                Speak with Franny
              </Button> */}

              <button
              data-cal-namespace="franchiseen"
    data-cal-link="shawaz/franchiseen"
    data-cal-text="Schedule a Demo"
className="w-full mt-6 h-12 bg-yellow-600 hover:bg-yellow-700 text-white flex items-center justify-center gap-2"
    data-cal-config='{"layout":"month_view"}'>
      <Bell className="w-4 h-4 mr-2" />
                Schedule a Demo
    </button>

                

            </motion.div>
          </motion.div>
        </div>
         {/* Footer */}
      {/* <footer className="py-12 mt-24  px-4 bg-stone-900 text-white">
        <div className="container mx-auto text-center">
          <p className="text-stone-400 mb-4">
            The future of franchise investment and management
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-stone-500">
            <span className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              Global Platform
            </span>
            <span>•</span>
            <span>Launching {launchDate.getFullYear()}</span>
            <span>•</span>
            <span>Built with ❤️ on Solana</span>
          </div>
        </div>
      </footer> */}
      </section>

      {/* Hero Section */}
      <VoiceAssistant isOpen={isVoiceOpen} onToggle={toggleVoice} />

    </>
  );
}
