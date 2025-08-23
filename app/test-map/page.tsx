"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle, CheckCircle } from 'lucide-react';

export default function TestMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.google) {
        addLog('Map initialization failed: mapRef or google not available');
        setStatus('error');
        setErrorMessage('Map container or Google Maps API not available');
        return;
      }

      try {
        addLog('Initializing Google Maps...');
        
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 25.2048, lng: 55.2708 }, // Dubai DIFC
          zoom: 12,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        // Add a test marker
        new google.maps.Marker({
          position: { lat: 25.2048, lng: 55.2708 },
          map: mapInstance,
          title: 'Test Location - Dubai DIFC',
        });

        setMap(mapInstance);
        setStatus('success');
        addLog('Google Maps initialized successfully!');
      } catch (error) {
        addLog(`Error initializing Google Maps: ${error}`);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    const loadGoogleMaps = () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      addLog(`API Key configured: ${apiKey ? 'Yes' : 'No'}`);
      addLog(`API Key (first 10 chars): ${apiKey ? apiKey.substring(0, 10) + '...' : 'Not found'}`);
      
      if (!apiKey) {
        setStatus('error');
        setErrorMessage('Google Maps API key is not configured in environment variables');
        addLog('ERROR: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY not found');
        return;
      }

      if (window.google) {
        addLog('Google Maps API already loaded');
        initMap();
        return;
      }

      addLog('Loading Google Maps script...');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        addLog('Google Maps script loaded successfully');
        initMap();
      };
      
      script.onerror = (error) => {
        addLog(`Failed to load Google Maps script: ${error}`);
        setStatus('error');
        setErrorMessage('Failed to load Google Maps script. Check your API key and internet connection.');
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  const testApiKey = async () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      addLog('No API key to test');
      return;
    }

    try {
      addLog('Testing API key with a simple request...');
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=Dubai&key=${apiKey}`);
      const data = await response.json();
      
      if (data.status === 'OK') {
        addLog('API key test: SUCCESS');
      } else {
        addLog(`API key test failed: ${data.status} - ${data.error_message || 'Unknown error'}`);
      }
    } catch (error) {
      addLog(`API key test error: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Google Maps Test Page</h1>
        <p className="text-muted-foreground">
          This page helps debug Google Maps loading issues
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Container */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Map Test</h2>
              {status === 'loading' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
              {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {status === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
            </div>

            <div className="h-96 bg-gray-100 dark:bg-stone-800 rounded-lg relative">
              <div
                ref={mapRef}
                className="w-full h-full rounded-lg"
              />

              {status === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2 p-4">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <p className="text-sm font-medium text-red-600">Map Loading Failed</p>
                    <p className="text-xs text-muted-foreground">{errorMessage}</p>
                  </div>
                </div>
              )}
            </div>

            <Button onClick={testApiKey} variant="outline" className="w-full">
              Test API Key
            </Button>
          </div>
        </Card>

        {/* Debug Logs */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Debug Logs</h2>
            <div className="h-96 overflow-y-auto bg-gray-50 dark:bg-stone-900 rounded-lg p-4">
              <div className="space-y-1 text-sm font-mono">
                {logs.length === 0 ? (
                  <p className="text-muted-foreground">No logs yet...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-xs">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
            <Button 
              onClick={() => setLogs([])} 
              variant="outline" 
              size="sm"
              className="w-full"
            >
              Clear Logs
            </Button>
          </div>
        </Card>
      </div>

      {/* Environment Info */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>API Key Status:</strong> {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'Configured' : 'Missing'}
          </div>
          <div>
            <strong>Google Maps Loaded:</strong> {typeof window !== 'undefined' && window.google ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Map Instance:</strong> {map ? 'Created' : 'Not created'}
          </div>
          <div>
            <strong>Current Status:</strong> {status}
          </div>
        </div>
      </Card>
    </div>
  );
}
