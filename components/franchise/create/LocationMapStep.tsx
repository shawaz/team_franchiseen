"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';

interface LocationMapStepProps {
  onNext: (data: { location: { address: string; coordinates: { lat: number; lng: number } } }) => void;
  onBack: () => void;
  selectedBrand?: {
    id: string;
    name: string;
    logo: string;
    costPerArea: number;
  };
  location?: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
}

// Sample brand outlets data
const sampleOutlets = [
  { id: '1', lat: 19.0760, lng: 72.8777, name: 'Mumbai Central' },
  { id: '2', lat: 19.0896, lng: 72.8656, name: 'Bandra West' },
  { id: '3', lat: 19.1136, lng: 72.8697, name: 'Andheri East' },
  { id: '4', lat: 19.0330, lng: 72.8697, name: 'Colaba' },
  { id: '5', lat: 19.0728, lng: 72.8826, name: 'Fort' },
];

export default function LocationMapStep({ onNext, selectedBrand, location }: LocationMapStepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [outletMarkers, setOutletMarkers] = useState<google.maps.Marker[]>([]);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const defaultCenter = selectedLocation?.coordinates || { lat: 19.0760, lng: 72.8777 }; // Mumbai
      
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      setMap(mapInstance);

      // Add click listener to map
      mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          handleLocationSelect(lat, lng);
        }
      });

      // Add existing outlets as markers
      const outlets = sampleOutlets.map(outlet => {
        const outletMarker = new google.maps.Marker({
          position: { lat: outlet.lat, lng: outlet.lng },
          map: mapInstance,
          title: `${selectedBrand?.name} - ${outlet.name}`,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#10B981"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(24, 24),
          }
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold">${selectedBrand?.name}</h3>
              <p class="text-sm text-gray-600">${outlet.name}</p>
            </div>
          `
        });

        outletMarker.addListener('click', () => {
          infoWindow.open(mapInstance, outletMarker);
        });

        return outletMarker;
      });

      setOutletMarkers(outlets);

      // Add selected location marker if exists
      if (selectedLocation) {
        const locationMarker = new google.maps.Marker({
          position: selectedLocation.coordinates,
          map: mapInstance,
          title: 'Selected Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EF4444"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(32, 32),
          }
        });
        setMarker(locationMarker);
      }
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [selectedBrand, selectedLocation]);

  const handleLocationSelect = async (lat: number, lng: number) => {
    if (!map) return;

    setIsLoading(true);

    // Remove existing marker
    if (marker) {
      marker.setMap(null);
    }

    // Add new marker
    const newMarker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: 'Selected Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EF4444"/>
            <circle cx="12" cy="9" r="2.5" fill="white"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32),
      }
    });

    setMarker(newMarker);

    // Reverse geocoding to get address
    const geocoder = new google.maps.Geocoder();
    try {
      const result = await geocoder.geocode({ location: { lat, lng } });
      if (result.results[0]) {
        const address = result.results[0].formatted_address;
        setSelectedLocation({
          address,
          coordinates: { lat, lng }
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setSelectedLocation({
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        coordinates: { lat, lng }
      });
    }

    setIsLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !map) return;

    setIsLoading(true);

    const geocoder = new google.maps.Geocoder();
    try {
      const result = await geocoder.geocode({ address: searchQuery });
      if (result.results[0]) {
        const location = result.results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        
        map.setCenter({ lat, lng });
        map.setZoom(15);
        
        await handleLocationSelect(lat, lng);
      }
    } catch (error) {
      console.error('Search error:', error);
    }

    setIsLoading(false);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation || !map) return;

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        map.setCenter({ lat, lng });
        map.setZoom(15);
        
        handleLocationSelect(lat, lng);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLoading(false);
      }
    );
  };

  const handleNext = () => {
    if (selectedLocation) {
      onNext({ location: selectedLocation });
    }
  };

  const handleSelectCenterLocation = async () => {
    if (!map) return;

    const center = map.getCenter();
    if (center) {
      const lat = center.lat();
      const lng = center.lng();
      await handleLocationSelect(lat, lng);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Map Header */}
      <div className="bg-white dark:bg-stone-800 border-b border-gray-200 dark:border-stone-700 px-4 py-4">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-stone-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Search
          </button>
          <button
            onClick={handleCurrentLocation}
            disabled={isLoading}
            className="px-4 py-3 bg-gray-100 dark:bg-stone-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-stone-600 transition-colors disabled:opacity-50"
          >
            <Navigation className="h-5 w-5" />
          </button>
        </div>

        {/* Map Legend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              Move map to desired location and click &quot;Select this location&quot;
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Existing Outlets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Selected Location</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />

        {/* Center Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            {/* Crosshair */}
            <div className="w-8 h-8 border-2 border-red-500 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            {/* Crosshair lines */}
            <div className="absolute top-1/2 left-1/2 w-12 h-0.5 bg-red-500 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-0.5 h-12 bg-red-500 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        {/* Center Select Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="mt-16 pointer-events-auto">
            <button
              onClick={handleSelectCenterLocation}
              disabled={isLoading}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50"
            >
              Select this location
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
            <div className="bg-white dark:bg-stone-800 px-4 py-2 rounded-lg shadow-lg">
              <span className="text-sm">Loading...</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Location Display - Fixed at bottom */}
      {selectedLocation && (
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-stone-800 border-t border-gray-200 dark:border-stone-700 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">Selected Location</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{selectedLocation.address}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Coordinates: {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}
              </p>
            </div>
            <button
              onClick={handleNext}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg"
            >
              Continue to Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
