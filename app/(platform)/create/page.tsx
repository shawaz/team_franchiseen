"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Store,
  MapPin,
  DollarSign,
  Building,
  Star,
  Search,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Image from "next/image";

// Google Maps types
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

// Sample franchise brands
const franchiseBrands = [
  {
    id: "mcdonalds" as const,
    name: "McDonald's",
    description: "World's leading fast food franchise",
    logo: "/logo/logo-2.svg",
    category: "Fast Food",
    rating: 4.5,
    outlets: 500,
    costPerArea: 2,
    minInvestment: 1000,
    maxInvestment: 5000,
    icon: Store,
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  {
    id: "subway" as const,
    name: "Subway",
    description: "Healthy sandwich franchise opportunity",
    logo: "/logo/logo-2.svg",
    category: "Fast Food",
    rating: 4.3,
    outlets: 300,
    costPerArea: 1.5,
    minInvestment: 800,
    maxInvestment: 3000,
    icon: Store,
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  {
    id: "starbucks" as const,
    name: "Starbucks",
    description: "Premium coffee franchise with global recognition",
    logo: "/logo/logo-2.svg",
    category: "Coffee",
    rating: 4.7,
    outlets: 200,
    costPerArea: 3,
    minInvestment: 1500,
    maxInvestment: 6000,
    icon: Store,
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "kfc" as const,
    name: "KFC",
    description: "Famous fried chicken franchise",
    logo: "/logo/logo-2.svg",
    category: "Fast Food",
    rating: 4.4,
    outlets: 400,
    costPerArea: 2.2,
    minInvestment: 1200,
    maxInvestment: 4500,
    icon: Store,
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  {
    id: "pizza_hut" as const,
    name: "Pizza Hut",
    description: "Leading pizza franchise with diverse menu",
    logo: "/logo/logo-2.svg",
    category: "Pizza",
    rating: 4.2,
    outlets: 250,
    costPerArea: 1.8,
    minInvestment: 900,
    maxInvestment: 3500,
    icon: Store,
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "custom" as const,
    name: "Other Brand",
    description: "Choose a different franchise brand",
    logo: "/logo/logo-2.svg",
    category: "Other",
    rating: 0,
    outlets: 0,
    costPerArea: 1,
    minInvestment: 500,
    maxInvestment: 2000,
    icon: Building,
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  },
];



interface FranchiseData {
  selectedBrand?: typeof franchiseBrands[0];
  location?: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  locationDetails?: {
    doorNumber: string;
    buildingName: string;
    owned: boolean;
    carpetArea: number;
    contactNumber?: string;
    email?: string;
  };
  investmentDetails?: {
    selectedShares: number;
    totalAmount: number;
  };
}

export default function CreateFranchisePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedShares, setSelectedShares] = useState(5);
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [formData, setFormData] = useState<FranchiseData>({
    selectedBrand: undefined,
    location: undefined,
    locationDetails: {
      doorNumber: "",
      buildingName: "",
      owned: true,
      carpetArea: 0,
    },
    investmentDetails: {
      selectedShares: 0,
      totalAmount: 0,
    },
  });

  // Categories for filtering
  const categories = ["All", "Fast Food", "Coffee", "Pizza", "Other"];

  // Filter brands based on search and category
  const filteredBrands = franchiseBrands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         brand.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBrandSelect = (brand: typeof franchiseBrands[0]) => {
    setFormData((prev) => ({
      ...prev,
      selectedBrand: brand,
    }));
  };

  // Initialize Google Maps
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      // DIFC coordinates (Dubai International Financial Centre)
      const difcLocation = { lat: 25.2048, lng: 55.2708 };

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: difcLocation,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      setMap(mapInstance);

      // Add existing franchise locations with custom mappin icon
      const existingLocations = [
        { lat: 25.2048, lng: 55.2708, name: "Sharif - DIFC" },
        { lat: 25.1972, lng: 55.2744, name: "Sharif - Downtown" },
        { lat: 25.2084, lng: 55.2719, name: "Sharif - Business Bay" },
      ];

      existingLocations.forEach(location => {
        new window.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: mapInstance,
          title: location.name,
          icon: {
            url: '/mappin.svg',
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 32)
          }
        });
      });

      // Add click listener to map
      mapInstance.addListener('click', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        // Remove existing marker
        if (marker) {
          marker.setMap(null);
        }

        // Add new marker with select_location icon
        const newMarker = new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          title: 'Selected Location',
          icon: {
            url: '/select_location.png',
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 40)
          }
        });

        setMarker(newMarker);

        // Reverse geocoding to get address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            setFormData(prev => ({
              ...prev,
              location: {
                address: results[0].formatted_address,
                coordinates: { lat, lng }
              }
            }));
          }
        });
      });

      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            mapInstance.setCenter(userLocation);
          },
          () => {
            // If geolocation fails, keep DIFC as default
            console.log("Geolocation failed, using DIFC as default location");
          }
        );
      }
    };

    if (step === 2) {
      loadGoogleMaps();
    }
  }, [step, marker]);

  // Handle map search
  const handleMapSearch = () => {
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

        // Remove existing marker
        if (marker) {
          marker.setMap(null);
        }

        // Add new marker with select_location icon
        const newMarker = new window.google.maps.Marker({
          position: location,
          map: map,
          title: place.name,
          icon: {
            url: '/select_location.png',
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 40)
          }
        });

        setMarker(newMarker);

        setFormData(prev => ({
          ...prev,
          location: {
            address: place.formatted_address,
            coordinates: { lat: location.lat(), lng: location.lng() }
          }
        }));
      }
    });
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (map) {
          map.setCenter({ lat, lng });
          map.setZoom(15);

          // Remove existing marker
          if (marker) {
            marker.setMap(null);
          }

          // Add new marker with select_location icon
          const newMarker = new window.google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: 'Your Location',
            icon: {
              url: '/select_location.png',
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 40)
            }
          });

          setMarker(newMarker);

          // Reverse geocoding to get address
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
              setFormData(prev => ({
                ...prev,
                location: {
                  address: results[0].formatted_address,
                  coordinates: { lat, lng }
                }
              }));
            }
          });
        }
      },
      () => {
        toast.error("Unable to retrieve your location.");
      }
    );
  };



  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Here you would typically save the franchise data to your backend
      console.log("Franchise data:", formData);

      toast.success(`${formData.selectedBrand?.name} franchise application submitted successfully!`);

      // Redirect to franchise dashboard or success page
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating franchise:", error);
      toast.error("Failed to submit franchise application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" dark:bg-stone-800/50 bg-white text-foreground my-6 dark:text-foreground border ">
      <header className=" flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between pr-6 border-b ">
        <div className="flex items-center gap-2 px-4 w-3/4">
          <div className="ml-2">
            <h1 className="text-lg font-semibold text-foreground">Create New Franchise</h1>
          </div>
        </div>
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-end p-6"
        >
          {[
            { num: 1, label: "Confirm Brand" },
            { num: 2, label: "Confirm Location" },
            { num: 3, label: "Make Payment" }
          ].map((stepInfo, index) => (
            <div key={stepInfo.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm text-white font-medium ${
                    step >= stepInfo.num
                      ? "bg-neutral-700 text-primary-foreground"
                      : "bg-muted-gradient text-muted-foreground"
                  }`}
                >
                  {stepInfo.num}
                </div>
                {/* <span className="text-xs text-muted-foreground mt-1">{stepInfo.label}</span> */}
              </div>
              {index < 2 && (
                <div
                  className={`w-16 h-0.5 mx-2 ${
                    step > stepInfo.num ? "bg-neutral-700" : "bg-muted-gradient"
                  }`}
                />
              )}
            </div>
          ))}
        </motion.div>
        <div className="w-3/4 flex justify-end  gap-4">
          {step === 1 && (
            <Button variant="outline" onClick={() => router.back()}>
                      Cancel Application
                    </Button>
          )}
          {step === 2 && (
            <Button variant="outline" onClick={() => setStep(1)}>
                      Previous
                    </Button>
          )}
          {step === 2 && (
            <Button
                      onClick={() => setStep(3)}
                      className="bg-yellow-600 text-white hover:bg-yellow-700"
                    >
                      Confirm Location
                    </Button>
          )}
          {step === 3 && (
            <>
              <Button variant="outline" onClick={() => setStep(2)}>
                      Previous
                    </Button>
              <Button
                      onClick={handleSubmit}
                      className="bg-yellow-600 text-white hover:bg-yellow-700"
                    >
                      Make Payment
                    </Button>
            </>
          )}


        </div>
      </header>
      <div  className=" p-6">

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className=""
        >
         
              {/* Step 1: Brand Selection */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Select Your Brand
                    </h2>
                    <p className="text-muted-foreground">
                      Choose the franchise brand you want to partner with
                    </p>
                  </div> */}

                  {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search brands..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-background border-border text-foreground"
                    />
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto">
                    {categories.map((category) => (
                        <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background text-foreground border border-border hover:bg-muted'
                        }`}
                        >
                        {category}
                        </button>
                    ))}
                    </div>
                </div>


                  {/* Brand List */}
                  <div className="space-y-3">
                    {filteredBrands.map((brand) => (
                      <motion.div
                        key={brand.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          handleBrandSelect(brand);
                          setStep(2); // Auto-advance to next step
                        }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          formData.selectedBrand?.id === brand.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Brand Logo */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={brand.logo}
                              alt={brand.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>

                          {/* Brand Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground text-lg mb-1">
                                  {brand.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                  {brand.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span>{brand.rating}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{brand.outlets} outlets</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span>${brand.costPerArea}/sq ft</span>
                                  </div>
                                </div>
                              </div>

                              {/* Category Badge */}
                              <div className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs font-medium">
                                {brand.category}
                              </div>
                            </div>
                          </div>

                          {/* Selection Indicator */}
                          {formData.selectedBrand?.id === brand.id && (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {filteredBrands.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No brands found matching your search.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Confirm Location */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >

                    {/* Selected Location and Property Details - Two Columns */}
                  <div className="bg-muted/50 rounded-lg p-4">
                  <div className="grid grid-cols-1 gap-6 ">
                    {/* Left Column - Selected Location */}
                    <div>
                      {formData.location && (
                        <div >
                          <p className="text-sm text-muted-foreground">Selected Location: {formData.location.address}</p>
                          {/* Door Number & Carpet Area */}
                       
                        </div>
                      )}
                      
                    </div>

                    {/* Right Column - Property Details Form */}

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Door No & Building Name</label>
                        <Input
                            value={formData.locationDetails?.doorNumber || ""}
                            onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                locationDetails: {
                                ...prev.locationDetails!,
                                doorNumber: e.target.value,
                                owned: prev.locationDetails?.owned ?? true,
                                buildingName: prev.locationDetails?.buildingName || "",
                                carpetArea: prev.locationDetails?.carpetArea || 0
                                },
                            }))
                            }
                            placeholder="C707 New Place"
                            className="bg-background border-border"
                        />
                        </div>
                        <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Carpet Area</label>
                        <Input
                            type="number"
                            value={formData.locationDetails?.carpetArea || ""}
                            onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                locationDetails: {
                                ...prev.locationDetails!,
                                carpetArea: Number(e.target.value),
                                owned: prev.locationDetails?.owned ?? true,
                                doorNumber: prev.locationDetails?.doorNumber || "",
                                buildingName: prev.locationDetails?.buildingName || ""
                                },
                            }))
                            }
                            placeholder="500"
                            className="bg-background border-border"
                        />
                        </div>

                    <div>
                        <label className="text-sm text-muted-foreground mb-1 block">LandLord Contact Number</label>
                        <Input
                        value={formData.locationDetails?.contactNumber || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({
                            ...prev,
                            locationDetails: { ...prev.locationDetails!, contactNumber: e.target.value },
                            }))
                        }
                        placeholder="+91 9876543210"
                        className="bg-background border-border"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted-foreground mb-1 block">LandLord Email ID</label>
                        <Input
                        type="email"
                        value={formData.locationDetails?.email || ""}
                        onChange={(e) =>
                            setFormData((prev) => ({
                            ...prev,
                            locationDetails: { ...prev.locationDetails!, email: e.target.value },
                            }))
                        }
                        placeholder="contact@example.com"
                        className="bg-background border-border"
                        />
                    </div>

                    </div>


                        
                        
                      </div>
                  </div>

                  {/* Map Container with Controls */}
                  <div className="bg-muted/30 rounded-lg overflow-hidden border border-border">
                    <div className="relative h-[500px] bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20">
                      {/* Map Search Bar - Inside Map */}
                      <div className="absolute top-4 left-4 right-4 z-10">
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="text"
                              placeholder="Search for a location..."
                              value={mapSearchQuery}
                              onChange={(e) => setMapSearchQuery(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleMapSearch()}
                              className="pl-10 bg-background/90 backdrop-blur-sm border-border text-foreground shadow-sm"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-background/90 backdrop-blur-sm"
                            onClick={handleMapSearch}
                          >
                            Search
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-background/90 backdrop-blur-sm"
                            onClick={getCurrentLocation}
                          >
                            <Navigation className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Zoom Controls - Inside Map */}
                      <div className="absolute top-20 right-4 z-10 flex flex-col gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 p-0 bg-background/90 backdrop-blur-sm"
                          onClick={() => map && map.setZoom(map.getZoom() + 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 p-0 bg-background/90 backdrop-blur-sm"
                          onClick={() => map && map.setZoom(map.getZoom() - 1)}
                        >
                          -
                        </Button>
                      </div>
                      {/* Map Legend - Inside Map */}
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span className="text-sm text-foreground">
                                Click on the map to select a location
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-muted-foreground">Existing Outlets</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="text-muted-foreground">Selected Location</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Google Maps Container */}
                      <div
                        ref={mapRef}
                        className="w-full h-full"
                        style={{ minHeight: '500px' }}
                      />

                      {/* Fixed Center Location Indicator */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative">
                          <Image
                            src="/select_location.png"
                            alt="Select Location"
                            width={40}
                            height={40}
                            className="w-10 h-10"
                            style={{
                              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                              transform: 'translate(-50%, -100%)'
                            }}
                          />
                        </div>
                      </div>

                      {/* Loading State */}
                      {!map && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                          <div className="text-center">
                            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                            <p className="text-muted-foreground">Loading Google Maps...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  


                </motion.div>
              )}

              {/* Step 3: Make Payment */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >

                  {/* Shadcn Slider and Text Fields in One Row */}
                  {formData.selectedBrand && formData.locationDetails?.carpetArea && (
                    <div>
                      <h3 className="font-medium text-foreground mb-6">Select Your Investment</h3>

                      <div className="flex items-center gap-6">
                        {/* Shadcn Slider */}
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-3">
                            <label className="text-sm text-muted-foreground  block">
                            Drag to select investment level
                          </label>
                            {/* Min/Max Labels */}
                          <div className="flex justify-between text-sm text-muted-foreground gap-2">
                            <span>Min: {Math.ceil(Math.floor((formData.locationDetails.carpetArea * formData.selectedBrand.costPerArea) / 5.75) * 0.05)} shares</span>
                            <span>Max: {Math.floor((formData.locationDetails.carpetArea * formData.selectedBrand.costPerArea) / 5.75)} shares</span>
                          </div>
                          </div>
                          
                          <div className="border border-border rounded-lg p-4 bg-card">
                            <Slider
                              value={[selectedShares]}
                              onValueChange={(value) => setSelectedShares(value[0])}
                              min={Math.ceil(Math.floor((formData.locationDetails.carpetArea * formData.selectedBrand.costPerArea) / 5.75) * 0.05)}
                              max={Math.floor((formData.locationDetails.carpetArea * formData.selectedBrand.costPerArea) / 5.75)}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          
                        </div>

                        {/* Percentage Field */}
                        <div className="w-32">
                          <label className="text-sm text-muted-foreground mb-3 block">Percentage</label>
                          <div className="relative">
                            <Input
                              type="number"
                              value={Math.round((selectedShares / Math.floor((formData.locationDetails.carpetArea * formData.selectedBrand.costPerArea) / 5.75)) * 100)}
                              onChange={(e) => {
                                const percentage = Number(e.target.value);
                                const totalShares = Math.floor((formData.locationDetails!.carpetArea * formData.selectedBrand!.costPerArea) / 5.75);
                                const newShares = Math.round((percentage / 100) * totalShares);
                                const min = Math.ceil(totalShares * 0.05);
                                const max = totalShares;
                                if (newShares >= min && newShares <= max && percentage >= 5 && percentage <= 100) {
                                  setSelectedShares(newShares);
                                }
                              }}
                              min="5"
                              max="100"
                              className="text-center pr-8 text-lg font-semibold"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground font-medium">%</span>
                          </div>
                        </div>

                        {/* Total Shares Field */}
                        <div className="w-32">
                          <label className="text-sm text-muted-foreground mb-3 block">Total Shares</label>
                          <Input
                            type="number"
                            value={selectedShares}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              const min = Math.ceil(Math.floor((formData.locationDetails!.carpetArea * formData.selectedBrand!.costPerArea) / 5.75) * 0.05);
                              const max = Math.floor((formData.locationDetails!.carpetArea * formData.selectedBrand!.costPerArea) / 5.75);
                              if (value >= min && value <= max) {
                                setSelectedShares(value);
                              }
                            }}
                            min={Math.ceil(Math.floor((formData.locationDetails.carpetArea * formData.selectedBrand.costPerArea) / 5.75) * 0.05)}
                            max={Math.floor((formData.locationDetails.carpetArea * formData.selectedBrand.costPerArea) / 5.75)}
                            className="text-center text-lg font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3-Column Layout: Brand Info, Location & Investment Details, Payment Details */}
                  {formData.selectedBrand && formData.locationDetails?.carpetArea && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


                      {/* Column 2: Location & Investment Details */}
                        {/* Location Details */}
                        <div className="bg-muted/50 rounded-lg p-6">
                          <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={formData.selectedBrand.logo}
                              alt={formData.selectedBrand.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground text-lg mb-1">
                              {formData.selectedBrand.name}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {formData.selectedBrand.description}
                            </p>
                          </div>
                        </div>
                            <div>
                              <span className="text-muted-foreground">Address:</span>
                              <p className="text-foreground font-medium">{formData.location?.address}</p>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Door Number:</span>
                              <span className="text-foreground font-medium">{formData.locationDetails?.doorNumber || 'Not specified'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Carpet Area:</span>
                              <span className="text-foreground font-medium">{formData.locationDetails?.carpetArea} sq ft</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Ownership:</span>
                              <span className="text-foreground font-medium">{formData.locationDetails?.owned ? 'Owned' : 'Rented'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Investment Details */}
                        <div className="bg-muted/50 rounded-lg p-6">
                          <h3 className="font-medium text-foreground mb-4">Investment Details</h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Investment:</span>
                              <span className="font-semibold text-foreground">${(formData.locationDetails.carpetArea * formData.selectedBrand.costPerArea).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Shares:</span>
                              <span className="font-semibold text-foreground">{Math.floor((formData.locationDetails.carpetArea * formData.selectedBrand.costPerArea) / 5.75)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Share Price:</span>
                              <span className="font-semibold text-foreground">$5.75</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Your Shares:</span>
                              <span className="font-semibold text-primary">{selectedShares}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Your Investment:</span>
                              <span className="font-semibold text-primary">${(selectedShares * 5.75).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                      {/* Column 3: Payment Summary */}
                      <div className="bg-background rounded-lg p-6 border border-border">
                        <h3 className="font-medium text-foreground mb-4">Payment Summary</h3>
                        <div className="space-y-4">
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Selected Shares:</span>
                              <span className="font-medium">{selectedShares}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Share Value:</span>
                              <span className="font-medium">₹{(selectedShares * 5.75 * 83).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Service Fee (15%):</span>
                              <span className="font-medium">₹{(selectedShares * 5.75 * 83 * 0.15).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">GST (5%):</span>
                              <span className="font-medium">₹{(selectedShares * 5.75 * 83 * 0.05).toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="border-t border-border pt-4">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-foreground">Total Amount:</span>
                              <span className="font-bold text-lg text-primary">₹{(selectedShares * 5.75 * 83 * 1.2).toLocaleString()}</span>
                            </div>
                          </div>

                          <Button
                            className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                            size="lg"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Processing..." : "Proceed to Payment"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              )}
        </motion.div>
      </div>
    </div>
  );
}