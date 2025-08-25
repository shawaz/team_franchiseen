"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, ArrowRight, Check, MapPin, Building, DollarSign, Star, TrendingUp, Search, Wallet, Calculator, AlertTriangle, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useWallet } from '@solana/wallet-adapter-react';
import { useFranchiseProgram } from '@/hooks/useFranchiseProgram';
import { useGlobalCurrency } from '@/contexts/GlobalCurrencyContext';
import { toast } from 'sonner';
import { Id } from '@/convex/_generated/dataModel';

interface TypeformCreateFranchiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandSlug?: string; // If provided, skip step 1 and use this business
}

interface Business {
  _id: Id<"businesses">;
  name: string;
  slug?: string;
  logoUrl?: string;
  industry?: { name: string } | null;
  category?: { name: string } | null;
  costPerArea?: number;
  min_area?: number;
}

interface FormData {
  selectedBusiness: Business | null;
  location: {
    address: string;
    lat: number;
    lng: number;
  } | null;
  locationDetails: {
    franchiseSlug: string;
    buildingName: string;
    doorNumber: string;
    sqft: string;
    costPerArea: string;
    isOwned: boolean;
    landlordNumber: string;
    landlordEmail: string;
    userNumber: string;
    userEmail: string;
  };
  investment: {
    selectedShares: number;
    totalShares: number;
    sharePrice: number;
  };
}

// Declare global Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

const TypeformCreateFranchiseModal: React.FC<TypeformCreateFranchiseModalProps> = ({ isOpen, onClose, brandSlug }) => {
  const [currentStep, setCurrentStep] = useState(brandSlug ? 2 : 1); // Skip step 1 if brandSlug provided
  const [searchQuery, setSearchQuery] = useState('');
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);

  // Map related state
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [placesService, setPlacesService] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [existingFranchises, setExistingFranchises] = useState<any[]>([]);
  const [conflictingLocation, setConflictingLocation] = useState<boolean>(false);

  const { connected } = useWallet();
  const { createFranchise } = useFranchiseProgram();
  const { formatAmount } = useGlobalCurrency();

  // Get all businesses for selection
  const businesses = useQuery(api.businesses.listAll, {}) || [];

  // Get specific business if brandSlug provided
  const specificBusiness = useQuery(
    api.businesses.getBySlug,
    brandSlug ? { slug: brandSlug } : "skip"
  );

  const [formData, setFormData] = useState<FormData>({
    selectedBusiness: null,
    location: null,
    locationDetails: {
      franchiseSlug: '',
      buildingName: '',
      doorNumber: '',
      sqft: '',
      costPerArea: '',
      isOwned: false,
      landlordNumber: '',
      landlordEmail: '',
      userNumber: '',
      userEmail: ''
    },
    investment: {
      selectedShares: 100,
      totalShares: 1000,
      sharePrice: 5.75
    }
  });

  // Get existing franchise locations for the selected business
  const existingFranchiseLocations = useQuery(
    api.franchise.getLocationsByBusiness,
    formData.selectedBusiness ? { businessId: formData.selectedBusiness._id } : "skip"
  );

  // Auto-select business if brandSlug provided
  useEffect(() => {
    if (specificBusiness && brandSlug) {
      setFormData(prev => ({
        ...prev,
        selectedBusiness: specificBusiness
      }));
    }
  }, [specificBusiness, brandSlug]);

  // Initialize Google Maps when step 2 is reached
  useEffect(() => {
    if (currentStep === 2 && formData.selectedBusiness) {
      // Add delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (mapRef.current) {
          initializeGoogleMaps();
        } else {
          console.log('Map ref not ready, retrying...');
          // Retry after another delay
          const retryTimer = setTimeout(() => {
            if (mapRef.current) {
              initializeGoogleMaps();
            } else {
              console.error('Map ref still not available after retry');
            }
          }, 500);
          return () => clearTimeout(retryTimer);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep, formData.selectedBusiness]);

  // Update existing franchises when locations are loaded
  useEffect(() => {
    if (existingFranchiseLocations) {
      setExistingFranchises(existingFranchiseLocations);
    }
  }, [existingFranchiseLocations]);

  const initializeGoogleMaps = () => {
    if (!mapRef.current) {
      console.error('Map ref not available');
      return;
    }

    // Check if the map container is visible
    const mapContainer = mapRef.current;
    const rect = mapContainer.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      console.error('Map container is not visible or has no dimensions');
      return;
    }

    if (!window.google) {
      // Load Google Maps script if not already loaded
      console.log('Loading Google Maps script...');
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.error('Google Maps API key is not configured');
        toast.error('Google Maps API key is not configured. Please check your environment variables.');
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        console.log('Google Maps script already loading, waiting...');
        // Wait for existing script to load
        existingScript.addEventListener('load', () => {
          console.log('Google Maps script loaded via existing script');
          setTimeout(initMap, 100); // Small delay to ensure Google Maps is fully initialized
        });
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initGoogleMapsCallback`;
      script.async = true;
      script.defer = true;

      // Create global callback
      (window as any).initGoogleMapsCallback = () => {
        console.log('Google Maps script loaded successfully via callback');
        setTimeout(initMap, 100); // Small delay to ensure Google Maps is fully initialized
        delete (window as any).initGoogleMapsCallback; // Clean up
      };

      script.onerror = (error) => {
        console.error('Failed to load Google Maps script:', error);
        toast.error('Failed to load Google Maps. Please check your API key and internet connection.');
        delete (window as any).initGoogleMapsCallback; // Clean up
      };

      document.head.appendChild(script);
    } else {
      console.log('Google Maps already loaded, initializing map...');
      setTimeout(initMap, 100); // Small delay to ensure DOM is ready
    }
  };

  const initMap = () => {
    if (!mapRef.current || !window.google) {
      console.error('Map initialization failed: mapRef or google not available');
      return;
    }

    try {
      const defaultCenter = { lat: 19.0760, lng: 72.8777 }; // Mumbai default

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      setMap(mapInstance);
      console.log('Google Maps initialized successfully');

      // Initialize Places service
      if (window.google.maps.places) {
        const placesService = new window.google.maps.places.PlacesService(mapInstance);
        setPlacesService(placesService);
        console.log('Places service initialized');
      } else {
        console.error('Google Places API not available');
        toast.error('Google Places service not available. Please refresh the page.');
      }

      // Add click listener to map
      mapInstance.addListener('click', (event: any) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          handleLocationSelect(lat, lng);
        }
      });

      // Add existing franchise markers
      if (existingFranchiseLocations) {
        addExistingFranchiseMarkers(mapInstance);
      }
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      toast.error('Failed to initialize Google Maps. Please try again.');
    }
  };

  const addExistingFranchiseMarkers = async (mapInstance: any) => {
    if (!existingFranchiseLocations || !window.google) return;

    const geocoder = new window.google.maps.Geocoder();

    for (const franchise of existingFranchiseLocations) {
      try {
        const result = await geocoder.geocode({ address: franchise.locationAddress });
        if (result.results[0]) {
          const location = result.results[0].geometry.location;

          new window.google.maps.Marker({
            position: location,
            map: mapInstance,
            title: `${formData.selectedBusiness?.name} - ${franchise.building}`,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EF4444"/>
                  <circle cx="12" cy="9" r="2.5" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(24, 24),
            }
          });
        }
      } catch (error) {
        console.error('Error geocoding franchise location:', error);
      }
    }
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    if (!map || !window.google) return;

    // Remove existing marker
    if (marker) {
      marker.setMap(null);
    }

    // Check for conflicts with existing franchises
    const isConflicting = await checkLocationConflict(lat, lng);
    setConflictingLocation(isConflicting);

    // Add new marker
    const newMarker = new window.google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: 'Selected Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${isConflicting ? '#EF4444' : '#10B981'}"/>
            <circle cx="12" cy="9" r="2.5" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 32),
      }
    });

    setMarker(newMarker);

    // Reverse geocoding to get address
    const geocoder = new window.google.maps.Geocoder();
    try {
      const result = await geocoder.geocode({ location: { lat, lng } });
      if (result.results[0]) {
        const address = result.results[0].formatted_address;
        setFormData(prev => ({
          ...prev,
          location: { address, lat, lng }
        }));
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setFormData(prev => ({
        ...prev,
        location: { address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`, lat, lng }
      }));
    }
  };

  const checkLocationConflict = async (lat: number, lng: number): Promise<boolean> => {
    if (!existingFranchiseLocations || !window.google) return false;

    const geocoder = new window.google.maps.Geocoder();
    const minDistance = 1000; // 1km minimum distance

    for (const franchise of existingFranchiseLocations) {
      try {
        const result = await geocoder.geocode({ address: franchise.locationAddress });
        if (result.results[0]) {
          const existingLocation = result.results[0].geometry.location;
          const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
            new window.google.maps.LatLng(lat, lng),
            existingLocation
          );

          if (distance < minDistance) {
            return true; // Conflict found
          }
        }
      } catch (error) {
        console.error('Error checking location conflict:', error);
      }
    }

    return false;
  };

  const handleMapSearch = async () => {
    if (!map || !window.google || !mapSearchQuery.trim()) return;

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      query: mapSearchQuery,
      fields: ['name', 'geometry', 'formatted_address'],
    };

    service.textSearch(request, (results: any, status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
        const place = results[0];
        const location = place.geometry.location;

        map.setCenter(location);
        map.setZoom(15);

        const lat = location.lat();
        const lng = location.lng();
        handleLocationSelect(lat, lng);
      }
    });
  };

  const totalSteps = 5; // Total steps: 1(Business), 2(Location), 3(Details), 4(Investment), 5(OnChain)
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = async () => {
    if (currentStep === totalSteps) {
      await handleSubmit();
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!formData.selectedBusiness) {
      toast.error('Please select a business');
      return;
    }

    setLoading(true);
    try {
      const totalInvestment = calculateTotalInvestment();

      const tx = await createFranchise(
        formData.selectedBusiness.slug || formData.selectedBusiness.name.toLowerCase().replace(/\s+/g, '-'),
        formData.locationDetails.franchiseSlug,
        formData.location?.address || '',
        formData.locationDetails.buildingName,
        parseFloat(formData.locationDetails.sqft),
        parseFloat(formData.locationDetails.costPerArea),
        formData.investment.totalShares
      );

      // Create invoice
      const invoiceData = {
        id: `INV-${Date.now()}`,
        franchiseSlug: formData.locationDetails.franchiseSlug,
        businessName: formData.selectedBusiness.name,
        location: formData.location?.address,
        totalInvestment,
        shares: formData.investment.selectedShares,
        sharePrice: calculateSharePrice(),
        status: 'Pending Approval',
        createdAt: new Date().toISOString(),
        transactionHash: tx
      };

      setInvoice(invoiceData);
      setCurrentStep(totalSteps + 1); // Show invoice step

      toast.success('Franchise proposal submitted successfully!');
    } catch (error) {
      console.error('Error creating franchise:', error);
      toast.error('Failed to create franchise proposal');
    } finally {
      setLoading(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectBusiness = (business: Business) => {
    setFormData(prev => ({
      ...prev,
      selectedBusiness: business,
      locationDetails: {
        ...prev.locationDetails,
        costPerArea: business.costPerArea?.toString() || ''
      }
    }));
  };

  // Remove unused selectLocation function

  const updateLocationDetails = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      locationDetails: {
        ...prev.locationDetails,
        [field]: value
      }
    }));
  };

  const updateInvestment = (selectedShares: number) => {
    setFormData(prev => ({
      ...prev,
      investment: {
        ...prev.investment,
        selectedShares
      }
    }));
  };

  const calculateTotalInvestment = () => {
    const area = parseFloat(formData.locationDetails.sqft) || 0;
    const cost = formData.selectedBusiness?.costPerArea || 0;
    return area * cost;
  };

  const calculateSharePrice = () => {
    const totalInvestment = calculateTotalInvestment();
    const shares = formData.investment.totalShares || 1000;
    return totalInvestment / shares;
  };

  // Filter businesses based on search query
  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.industry?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.selectedBusiness !== null;
      case 2:
        return formData.location !== null && !conflictingLocation;
      case 3:
        const { doorNumber, sqft, isOwned, landlordNumber, landlordEmail, userNumber, userEmail, franchiseSlug, buildingName } = formData.locationDetails;
        const basicFields = doorNumber && sqft && franchiseSlug && buildingName && formData.selectedBusiness?.costPerArea;
        if (isOwned) {
          return basicFields && userNumber && userEmail;
        } else {
          return basicFields && landlordNumber && landlordEmail;
        }
      case 4:
        return true;
      case 5:
        return connected;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-stone-900 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-stone-700">
        <div className="flex items-center gap-3">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="p-2 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="text-sm text-muted-foreground">
            {currentStep === 1 && (
                <p className="text-muted-foreground">Select a business</p>
            )}
            {currentStep === 2 && (

                <p className="text-muted-foreground">Enter location details</p>
            )}
            {currentStep === 3 && (
                <p className="text-muted-foreground">Enter investment details</p>
            )}
            {currentStep === 4 && (

                <p className="text-muted-foreground">Review and confirm</p>

            )}
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-stone-700 h-1">
        <div 
          className="bg-yellow-600 h-1 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Business */}
          {currentStep === 1 && !brandSlug && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              <div className="p-6 pb-4 border-b border-gray-200 dark:border-stone-700">

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search businesses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex-1 p-6 pt-4 overflow-hidden flex flex-col">

              {/* Business List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {filteredBusinesses.map((business) => (
                  <button
                    key={business._id}
                    onClick={() => selectBusiness(business)}
                    className={`w-full p-4 border-2 text-left transition-all ${
                      formData.selectedBusiness?._id === business._id
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                        : 'border-gray-200 dark:border-stone-700 hover:border-gray-300 dark:hover:border-stone-600'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16  overflow-hidden bg-gray-100 dark:bg-stone-700 flex-shrink-0">
                        <Image
                          src={business.logoUrl || "/logo/logo-2.svg"}
                          alt={business.name}
                          width={120}
                          height={120}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-lg">{business.name}</h3>
                          {formData.selectedBusiness?._id === business._id && (
                            <Check className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-base text-muted-foreground mb-1">
                          {business.category?.name} • {business.industry?.name}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          {business.costPerArea && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-medium">{formatAmount(business.costPerArea)}/sq ft</span>
                            </div>
                          )}
                          {business.min_area && (
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              <span>Min: {business.min_area} sq ft</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                {filteredBusinesses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No businesses found matching your search</p>
                  </div>
                )}
              </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Location */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              <div className="p-6 border-b border-gray-200 dark:border-stone-700">

                {/* Search Bar */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search for a location..."
                      value={mapSearchQuery}
                      onChange={(e) => setMapSearchQuery(e.target.value)}
                      className="pl-10"
                      onKeyDown={(e) => e.key === 'Enter' && handleMapSearch()}
                    />
                  </div>
                  <Button onClick={handleMapSearch} variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Google Maps Container */}
              <div className="flex-1 relative">
                <div ref={mapRef} className="w-full h-full" />

                {/* Center Map Pin */}
                {map && !formData.location && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <MapPin className="h-8 w-8 text-stone-600 drop-shadow-lg" />
                  </div>
                )}

                {/* Select Location Button */}
                {map && !formData.location && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <Button
                      onClick={() => {
                        const center = map.getCenter();
                        if (center) {
                          handleLocationSelect(center.lat(), center.lng());
                        }
                      }}
                      className="bg-stone-600 hover:bg-stone-700 text-white shadow-lg"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Select This Location
                    </Button>
                  </div>
                )}

                {/* Loading overlay */}
                {!map && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-stone-800">
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
                      <p className="text-sm text-muted-foreground">Loading map...</p>
                    </div>
                  </div>
                )}

                {/* Selected Location Info */}
                {formData.location && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-stone-800 rounded-lg p-4 shadow-lg border">
                    <div className="flex items-start gap-3">
                      <MapPin className={`h-5 w-5 flex-shrink-0 mt-0.5 ${conflictingLocation ? 'text-red-600' : 'text-green-600'}`} />
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {conflictingLocation ? 'Location Unavailable' : 'Selected Location'}
                        </h4>
                        <p className="text-sm text-muted-foreground">{formData.location.address}</p>
                        {conflictingLocation && (
                          <p className="text-sm text-red-600 mt-1">
                            <AlertTriangle className="h-4 w-4 inline mr-1" />
                            Too close to existing franchise (min 1km required)
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!conflictingLocation && <Check className="h-5 w-5 text-green-600 flex-shrink-0" />}
                        <Button
                          onClick={() => {
                            setFormData(prev => ({ ...prev, location: null }));
                            if (marker) {
                              marker.setMap(null);
                              setMarker(null);
                            }
                            setConflictingLocation(false);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Location Details */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >

              <div className="space-y-6">
                {/* Franchise Details */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Franchise Slug</label>
                    <Input
                      value={formData.locationDetails.franchiseSlug}
                      onChange={(e) => updateLocationDetails('franchiseSlug', e.target.value)}
                      placeholder="e.g., downtown-branch"
                      className="h-12 text-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This will be used in your franchise URL
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Building Name</label>
                    <Input
                      value={formData.locationDetails.buildingName}
                      onChange={(e) => updateLocationDetails('buildingName', e.target.value)}
                      placeholder="e.g., New Place Mall"
                      className="h-12 text-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Door Number</label>
                    <Input
                      value={formData.locationDetails.doorNumber}
                      onChange={(e) => updateLocationDetails('doorNumber', e.target.value)}
                      placeholder="e.g., C707"
                      className="h-12 text-lg"
                    />
                  </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Square Feet</label>
                    <Input
                      type="number"
                      value={formData.locationDetails.sqft}
                      onChange={(e) => updateLocationDetails('sqft', e.target.value)}
                      placeholder="e.g., 1500"
                      className="h-12 text-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Cost per Sq Ft</label>
                    <div className="h-12 px-3 py-2 bg-gray-50 dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-md flex items-center text-lg">
                      {formData.selectedBusiness?.costPerArea ?
                        formatAmount(formData.selectedBusiness.costPerArea) :
                        'Not set by brand owner'
                      }
                    </div>
                    {/* <p className="text-xs text-muted-foreground mt-1">
                      This rate is configured by the brand owner in their account settings
                    </p> */}
                  </div>
                </div>

                {/* Investment Calculation */}
                {formData.locationDetails.sqft && formData.selectedBusiness?.costPerArea && (
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800  p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="h-5 w-5 text-yellow-600" />
                      <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Investment Calculation</h3>
                    </div>
                    <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                      Total Investment: {formatAmount(calculateTotalInvestment())}
                    </div>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                      {formData.locationDetails.sqft} sq ft × {formatAmount(formData.selectedBusiness.costPerArea)} per sq ft
                    </p>
                  </div>
                )}

                {/* Warning if no cost per area set */}
                {formData.locationDetails.sqft && !formData.selectedBusiness?.costPerArea && (
                  <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800  p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <div>
                        <h4 className="font-medium text-orange-800 dark:text-orange-200">Cost Per Area Not Set</h4>
                        <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                          The brand owner needs to set the cost per square foot in their account settings before you can proceed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ownership Toggle */}
                <div className="bg-gray-50 dark:bg-stone-800  p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Property Ownership</h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.locationDetails.isOwned ? 'You own this property' : 'You rent this property'}
                      </p>
                    </div>
                    <Switch
                      checked={formData.locationDetails.isOwned}
                      onCheckedChange={(checked) => updateLocationDetails('isOwned', checked)}
                    />
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-4">
                  {formData.locationDetails.isOwned ? (
                    <>
                      <h3 className="font-medium text-lg">Your Contact Information</h3>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Phone Number</label>
                        <Input
                          type="tel"
                          value={formData.locationDetails.userNumber}
                          onChange={(e) => updateLocationDetails('userNumber', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="h-12 text-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Email</label>
                        <Input
                          type="email"
                          value={formData.locationDetails.userEmail}
                          onChange={(e) => updateLocationDetails('userEmail', e.target.value)}
                          placeholder="your.email@example.com"
                          className="h-12 text-lg"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="font-medium text-lg">Landlord Contact Information</h3>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Landlord Phone Number</label>
                        <Input
                          type="tel"
                          value={formData.locationDetails.landlordNumber}
                          onChange={(e) => updateLocationDetails('landlordNumber', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          className="h-12 text-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Landlord Email</label>
                        <Input
                          type="email"
                          value={formData.locationDetails.landlordEmail}
                          onChange={(e) => updateLocationDetails('landlordEmail', e.target.value)}
                          placeholder="landlord@example.com"
                          className="h-12 text-lg"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Investment */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >

              {/* Investment Amount Display */}
              <div className="bg-gradient-to-br from-stone-50 to-indigo-50 dark:from-stone-950/20 dark:to-yellow-950/20 p-6 text-center border border-stone-200 dark:border-stone-800">
                <div className="text-4xl font-bold text-primary mb-2">
                  ₹{(formData.investment.selectedShares * formData.investment.sharePrice * 83 * 1.2).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formData.investment.selectedShares} shares ({Math.round((formData.investment.selectedShares / formData.investment.totalShares) * 100)}% ownership)
                </div>
              </div>

              {/* Investment Details */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-stone-800  p-4 border shadow-sm">
                  <h3 className="font-medium mb-4">Investment Breakdown</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Share Value:</span>
                      <span className="font-medium">₹{(formData.investment.selectedShares * formData.investment.sharePrice * 83).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Fee (15%):</span>
                      <span className="font-medium">₹{(formData.investment.selectedShares * formData.investment.sharePrice * 83 * 0.15).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST (5%):</span>
                      <span className="font-medium">₹{(formData.investment.selectedShares * formData.investment.sharePrice * 83 * 0.05).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="font-bold text-lg text-primary">₹{(formData.investment.selectedShares * formData.investment.sharePrice * 83 * 1.2).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Number of Shares</label>
                    <div className="text-sm text-muted-foreground">
                      Min: {Math.ceil(formData.investment.totalShares * 0.05)} | Max: {formData.investment.totalShares}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-stone-800  p-4 border shadow-sm">
                    <Slider
                      value={[formData.investment.selectedShares]}
                      onValueChange={(value) => updateInvestment(value[0])}
                      min={Math.ceil(formData.investment.totalShares * 0.05)}
                      max={formData.investment.totalShares}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Percentage</label>
                      <Input
                        type="number"
                        value={Math.round((formData.investment.selectedShares / formData.investment.totalShares) * 100)}
                        onChange={(e) => {
                          const percentage = Number(e.target.value);
                          const newShares = Math.round((percentage / 100) * formData.investment.totalShares);
                          const min = Math.ceil(formData.investment.totalShares * 0.05);
                          const max = formData.investment.totalShares;
                          if (newShares >= min && newShares <= max && percentage >= 5 && percentage <= 100) {
                            updateInvestment(newShares);
                          }
                        }}
                        min="5"
                        max="100"
                        className="text-center text-lg font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Total Shares</label>
                      <Input
                        type="number"
                        value={formData.investment.selectedShares}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          const min = Math.ceil(formData.investment.totalShares * 0.05);
                          const max = formData.investment.totalShares;
                          if (value >= min && value <= max) {
                            updateInvestment(value);
                          }
                        }}
                        min={Math.ceil(formData.investment.totalShares * 0.05)}
                        max={formData.investment.totalShares}
                        className="text-center text-lg font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-green-50 dark:bg-green-950/20  p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-200">Investment Summary</h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        You're investing {formatAmount(calculateTotalInvestment())} for {Math.round((formData.investment.selectedShares / formData.investment.totalShares) * 100)}% ownership in {formData.selectedBusiness?.name} franchise at {formData.location?.address}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: On-Chain Creation */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >

              <div className="space-y-6">
                {/* Investment Summary */}
                <div className="bg-stone-50 dark:bg-stone-800  p-6">
                  <h3 className="text-lg font-semibold mb-4">Final Investment Summary</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Business:</span>
                      <span className="font-medium">{formData.selectedBusiness?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <span className="font-medium">{formData.location?.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Area:</span>
                      <span className="font-medium">{formData.locationDetails.sqft} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Cost per sq ft:</span>
                      <span className="font-medium">{formatAmount(parseFloat(formData.locationDetails.costPerArea))}</span>
                    </div>
                    <div className="border-t border-stone-200 dark:border-stone-600 pt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Investment:</span>
                        <span className="text-xl font-bold text-green-600">{formatAmount(calculateTotalInvestment())}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wallet Connection */}
                {!connected && (
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800  p-4">
                    <div className="flex items-center gap-3">
                      <Wallet className="h-5 w-5 text-yellow-600" />
                      <div>
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Wallet Required</h4>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                          Connect your Solana wallet to create the franchise on-chain
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="bg-stone-50 dark:bg-stone-950/20 border border-stone-200 dark:border-stone-800  p-4">
                  <h4 className="font-medium text-stone-800 dark:text-stone-200 mb-2">Important Information</h4>
                  <div className="text-sm text-stone-600 dark:text-stone-400 space-y-2">
                    <p>• Your franchise proposal will be submitted for brand owner approval</p>
                    <p>• Investment funds will be held in escrow until approval</p>
                    <p>• If rejected, funds will be automatically refunded</p>
                    <p>• Upon approval, franchise tokens will be created and distributed</p>
                    <p>• Monthly profit sharing begins after franchise launch</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Invoice Step */}
          {currentStep === totalSteps + 1 && invoice && (
            <motion.div
              key="invoice"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >

              {/* Invoice */}
              <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700  p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Franchise Proposal Invoice</h3>
                  <span className="text-sm text-muted-foreground">#{invoice.id}</span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Business:</span>
                      <p className="font-medium">{invoice.businessName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <p className="font-medium">{invoice.location}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total Investment:</span>
                      <p className="font-medium">{formatAmount(invoice.totalInvestment)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {invoice.status}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-stone-200 dark:border-stone-600 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="text-xl font-bold">{formatAmount(invoice.totalInvestment)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-stone-50 dark:bg-stone-950/20 border border-stone-200 dark:border-stone-800  p-4">
                <h4 className="font-medium text-stone-800 dark:text-stone-200 mb-2">What happens next?</h4>
                <div className="text-sm text-stone-600 dark:text-stone-400 space-y-1">
                  <p>1. Brand owner will review your proposal</p>
                  <p>2. You'll receive notification of approval/rejection</p>
                  <p>3. If approved, franchise tokens will be created</p>
                  <p>4. You can track progress in your account dashboard</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    onClose();
                    // Navigate to account page to view invoices
                    window.location.href = '/account';
                  }}
                  className="flex-1"
                >
                  View in Account
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {currentStep <= totalSteps && (
        <div className="p-6 border-t border-gray-200 dark:border-stone-700">
          <Button
            onClick={nextStep}
            disabled={!canProceed() || loading}
            className="w-full h-12 text-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Franchise...
              </>
            ) : !connected && currentStep === totalSteps ? (
              <>
                <Wallet className="h-5 w-5 mr-2" />
                Connect Wallet to Create
              </>
            ) : currentStep === totalSteps ? (
              <>
                <Building className="h-5 w-5 mr-2" />
                Create Franchise On-Chain
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>

          {!connected && currentStep === totalSteps && (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
              Connect your wallet to create a franchise on the Solana blockchain
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TypeformCreateFranchiseModal;
