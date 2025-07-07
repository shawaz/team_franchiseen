import React, { useState } from 'react';
import Image from 'next/image';
import { X, MapPin } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';
import { useCurrency } from '@/contexts/CurrencyContext'
import { GoogleMap,  useLoadScript } from '@react-google-maps/api';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface NewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  franchiseData: {
    name: string;
    logo: string;
    address: string;
    totalShares: number;
    soldShares: number;
    costPerShare: number;
    franchiseId?: string;
  };
  businessId: Id<"businesses">;
}

// Add this to fix linter errors for window.initGooglePlacesFranchise
declare global {
  interface Window {
    initGooglePlacesFranchise?: () => void;
    google: {
      maps: {
        places: {
          Autocomplete: new (input: HTMLInputElement, options?: { types: string[] }) => {
            addListener: (event: string, handler: () => void) => void;
            getPlace: () => google.maps.places.PlaceResult;
          };
        };
      };
    };
  }
}

const mapContainerStyle = {
  width: '100%',
  height: '350px',
};
const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India

const NewPaymentModal = ({ isOpen, onClose, franchiseData, businessId }: NewPaymentModalProps) => {
  const { formatAmount, currency } = useCurrency();
  // New fields
  const [locationAddress, setLocationAddress] = useState('');
  const [building, setBuilding] = useState('');
  const [carpetArea, setCarpetArea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [ownership, setOwnership] = useState<'owned' | 'rented' | ''>('');
  const [landlordNumber, setLandlordNumber] = useState('');
  const [rentalAmount, setRentalAmount] = useState('');
  const [deposit, setDeposit] = useState('');
  const [landlordEmail, setLandlordEmail] = useState('');
  const [selectedLatLng, setSelectedLatLng] = useState<{ lat: number; lng: number }>(defaultCenter);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const mapRef = React.useRef<google.maps.Map | null>(null);
  // Add state for search input
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Load Google Maps script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  // Calculations
  const costPerShare = 500; // Default
  const totalInvestment = Number(carpetArea) * franchiseData.costPerShare;
  const totalShares = totalInvestment > 0 ? Math.floor(totalInvestment / costPerShare) : 0;
  const minRequiredShares = totalShares > 0 ? Math.ceil(totalShares * 0.05) : 0;

  // Shares selection
  const [selectedShares, setSelectedShares] = useState(minRequiredShares || 1);
  React.useEffect(() => {
    setSelectedShares(minRequiredShares || 1);
  }, [minRequiredShares]);

  // Payment calculations
  const subTotal = selectedShares * costPerShare;
  const serviceFee = subTotal * 0.15;
  const gst = subTotal * 0.05;
  const totalAmount = subTotal + serviceFee + gst;

  // Reverse geocode when marker is placed
  React.useEffect(() => {
    if (!selectedLatLng || !isLoaded) return;
    setIsGeocoding(true);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: selectedLatLng }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
      if (status === 'OK' && results && results[0]) {
        const place = results[0];
        place.address_components.forEach(() => {
          // If you want to extract more address details, add logic here
        });
        setLocationAddress(place.formatted_address || '');
      }
      setIsGeocoding(false);
    });
  }, [selectedLatLng, isLoaded]);

  // When map center changes, update selectedLatLng only if changed
  const handleOnIdle = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      if (center) {
        const lat = center.lat();
        const lng = center.lng();
        if (lat !== selectedLatLng.lat || lng !== selectedLatLng.lng) {
          setSelectedLatLng({ lat, lng });
        }
      }
    }
  };

  // Google Places Autocomplete for search
  React.useEffect(() => {
    if (!isLoaded) return;
    if (!searchInputRef.current) return;
    const autocomplete = new window.google.maps.places.Autocomplete(
      searchInputRef.current as HTMLInputElement,
      { types: ['geocode'] }
    );
    autocomplete.addListener('place_changed', () => {
      const place: google.maps.places.PlaceResult = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setSelectedLatLng({ lat, lng });
        setSearchValue(place.formatted_address || '');
      }
    });
    // Cleanup
    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isLoaded]);

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

  const createFranchise = useMutation(api.franchise.create);

  const handleStripePayment = async () => {
    setIsSubmitting(true);
    try {
      let franchiseId = franchiseData.franchiseId;
      // If no franchiseId, create the franchise first
      if (!franchiseId) {
        const newFranchiseId = await createFranchise({
          businessId,
          locationAddress,
          building,
          carpetArea: Number(carpetArea),
          costPerArea: franchiseData.costPerShare,
          totalInvestment,
          totalShares,
          selectedShares,
        });
        franchiseId = newFranchiseId;
      }
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          shares: selectedShares,
          franchiseId,
          userEmail: '', // TODO: Replace with actual user email if available
          costPerShare: costPerShare, // Always include costPerShare (default 500)
        }),
      });
      const data = await res.json();
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
    } catch {
      toast.error('Stripe payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative dark:bg-stone-800 bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Start New Franchise</h2>
            <button onClick={onClose} className="dark:text-white text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded overflow-hidden">
              <Image
                src={franchiseData.logo}
                alt={franchiseData.name}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="font-medium">{franchiseData.name}</h3>
              <p className="text-sm dark:text-white text-gray-600">Cost Per Area: {formatAmount(franchiseData.costPerShare)}</p>
            </div>
          </div>
        </div>

        {/* Step 1: Map Search/Select */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
                Search Location
              </label>
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter' && searchValue) {
                    console.log('Enter pressed, searching for:', searchValue);
                    if (window.google && window.google.maps) {
                      const geocoder = new window.google.maps.Geocoder();
                      geocoder.geocode({ address: searchValue }, (results, status) => {
                        console.log('Geocode results:', results, 'Status:', status);
                        if (status === 'OK' && results && results[0].geometry) {
                          const location = results[0].geometry.location;
                          setSelectedLatLng({ lat: location.lat(), lng: location.lng() });
                          setLocationAddress(results[0].formatted_address || searchValue);
                        }
                      });
                    }
                  }
                }}
                className="w-full px-3 py-2 border dark:border-stone-700 dark:bg-stone-900 rounded-lg mb-3"
                placeholder="Search for a place or address"
                autoComplete="off"
              />
              <div className="rounded-lg overflow-hidden border dark:border-stone-700 mb-2" style={{ minHeight: 350 }}>
                {isLoaded ? (
                  <div className="relative" style={{ minHeight: 350 }}>
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={selectedLatLng}
                      zoom={16}
                      onLoad={map => { mapRef.current = map; }}
                      onIdle={handleOnIdle}
                    />
                    {/* Centered MapPin icon overlay */}
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-10">
                      <MapPin className="text-stone-800" size={40} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">Loading map...</div>
                )}
              </div>
              {selectedLatLng && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <div>Lat: {selectedLatLng.lat.toFixed(6)}, Lng: {selectedLatLng.lng.toFixed(6)}</div>
                  {isGeocoding ? (
                    <div>Fetching address...</div>
                  ) : (
                    <div>Address: {locationAddress || 'No address found'}</div>
                  )}
                </div>
              )}
            </div>
            <button
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={!selectedLatLng || !locationAddress}
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Address Preview & Details */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium dark:text-white text-gray-700 mb-1">Selected Address</label>
              <div className="w-full px-3 py-2 border dark:border-stone-700  rounded-lg text-gray-700 dark:text-white bg-gray-50 dark:bg-stone-900">
                {locationAddress || 'No address selected'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
                Do you own the place or is it rented?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`flex-1 py-2 rounded-lg border transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50
                    ${ownership === 'owned'
                      ? 'bg-stone-800 text-white border-stone-800 shadow-md'
                      : 'bg-white dark:bg-stone-900 border-gray-300 dark:border-stone-700 text-gray-700 dark:text-gray-300 hover:bg-stone-100 dark:hover:bg-stone-800'}
                  `}
                  onClick={() => { setOwnership('owned'); setLandlordNumber(''); setRentalAmount(''); setDeposit(''); }}
                >
                  Owned
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 rounded-lg border transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50
                    ${ownership === 'rented'
                      ? 'bg-stone-800 text-white border-stone-800 shadow-md'
                      : 'bg-white dark:bg-stone-900 border-gray-300 dark:border-stone-700 text-gray-700 dark:text-gray-300 hover:bg-stone-100 dark:hover:bg-stone-800'}
                  `}
                  onClick={() => setOwnership('rented')}
                >
                  Rented
                </button>
              </div>
              {ownership === 'rented' && (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
                        Owner&apos;s Phone Number
                      </label>
                      <input
                        type="number"
                        value={landlordNumber}
                        onChange={(e) => setLandlordNumber(e.target.value)}
                        className="w-full px-3 py-2 border dark:border-stone-700 dark:bg-stone-900 rounded-lg"
                        placeholder="Phone Number"
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
                        Owner&apos;s EmailID
                      </label>
                      <input
                        type="email"
                        value={landlordEmail}
                        onChange={(e) => setLandlordEmail(e.target.value)}
                        className="w-full px-3 py-2 border dark:border-stone-700 dark:bg-stone-900 rounded-lg"
                        placeholder="EmailID"
                        min={0}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
                        Rental Amount
                      </label>
                      <input
                        type="number"
                        value={rentalAmount}
                        onChange={(e) => setRentalAmount(e.target.value)}
                        className="w-full px-3 py-2 border dark:border-stone-700 dark:bg-stone-900 rounded-lg"
                        placeholder={`Monthly rent (${currency.symbol})`}
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
                        Deposit
                      </label>
                      <input
                        type="number"
                        value={deposit}
                        onChange={(e) => setDeposit(e.target.value)}
                        className="w-full px-3 py-2 border dark:border-stone-700 dark:bg-stone-900 rounded-lg"
                        placeholder={`Deposit (${currency.symbol})`}
                        min={0}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
                  Door No & Building Name
                </label>
                <input
                  type="text"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-stone-700 dark:bg-stone-900 rounded-lg"
                  placeholder="Door No & Building Name"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
                  Carpet Area
                </label>
                <input
                  type="number"
                  value={carpetArea}
                  onChange={(e) => setCarpetArea(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-stone-700 dark:bg-stone-900 rounded-lg"
                  placeholder="Sqft"
                  min={1}
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                className="w-full bg-gray-200 dark:bg-stone-700 text-gray-700 dark:text-white py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-stone-600 transition-colors"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!locationAddress || !building || !carpetArea || (ownership === '' || (ownership === 'rented' && (!landlordNumber || !rentalAmount || !deposit)))}
                onClick={() => setStep(3)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Investment/Payment Details */}
        {step === 3 && (
          <>
            {/* Investment Details */}
            <div className="p-6 border-b">
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm dark:text-white text-gray-600">Total Investment</span>
                  <span className="font-semibold">{formatAmount(totalInvestment)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm dark:text-white text-gray-600">Total Shares</span>
                  <span className="font-semibold">{totalShares}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm dark:text-white text-gray-600">Minimum Required Shares (5%)</span>
                  <span className="font-semibold">{minRequiredShares}</span>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm dark:text-white font-medium text-gray-700">
                  Select number of shares (min: {minRequiredShares})
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={minRequiredShares || 1}
                    max={totalShares || 1}
                    value={selectedShares}
                    onChange={(e) => setSelectedShares(Number(e.target.value))}
                    className="flex-1 h-2 dark:bg-stone-700 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    disabled={totalShares === 0}
                  />
                  <span className="font-medium">{selectedShares}</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="dark:text-white text-gray-600">Selected Shares</span>
                  <span>{selectedShares}</span>
                </div>
                <div className="flex justify-between">
                  <span className="dark:text-white text-gray-600">Amount</span>
                  <span>₹{subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="dark:text-white text-gray-600">Service Fee (15%)</span>
                  <span>₹{serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="dark:text-white text-gray-600">GST (5%)</span>
                  <span>₹{gst.toLocaleString()}</span>
                </div>
                <div className="h-px dark:bg-stone-700 bg-gray-200 my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="w-full bg-gray-200 dark:bg-stone-700 text-gray-700 dark:text-white py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-stone-600 transition-colors"
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!carpetArea || selectedShares < minRequiredShares || totalShares === 0 || isSubmitting}
                  onClick={handleStripePayment}
                >
                  {isSubmitting ? 'Processing Payment...' : 'Proceed to Payment'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewPaymentModal; 