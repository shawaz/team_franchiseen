"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import FranchiseCard from "@/components/franchise/FranchiseCard";

// Legacy sample data - now replaced with real data from API
/*
const _sampleFundingFranchises: Franchise[] = [
  {
    _id: "funding-1",
    title: "Luxury Apartment in Downtown",
    location: "Downtown Dubai",
    price: 15000,
    images: ["/properties/1.png"],
    rating: 4.8,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    availableFrom: "2023-06-01",
    type: "fund",
    returnRate: 8.5,
    investorsCount: 42,
    fundingGoal: 500000,
    fundingProgress: 250000,
    minimumInvestment: 15000,
  },
  {
    _id: "funding-2",
    title: "Beachfront Villa Franchise",
    location: "Palm Jumeirah",
    price: 35000,
    images: ["/properties/2.png"],
    rating: 4.9,
    bedrooms: 4,
    bathrooms: 4,
    squareFeet: 3200,
    availableFrom: "2023-05-15",
    type: "fund",
    returnRate: 9.2,
    investorsCount: 56,
    fundingGoal: 750000,
    fundingProgress: 480000,
    minimumInvestment: 35000,
  },
  {
    _id: "funding-3",
    title: "Modern Studio Franchise",
    location: "Business Bay",
    price: 8500,
    images: ["/properties/3.png"],
    rating: 4.5,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 800,
    availableFrom: "2023-06-10",
    type: "fund",
    returnRate: 7.8,
    investorsCount: 32,
    fundingGoal: 300000,
    fundingProgress: 180000,
    minimumInvestment: 8500,
  },
  {
    _id: "funding-4",
    title: "Family Townhouse Franchise",
    location: "Arabian Ranches",
    price: 22000,
    images: ["/properties/4.png"],
    rating: 4.7,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2400,
    availableFrom: "2023-05-20",
    type: "fund",
    returnRate: 8.1,
    investorsCount: 48,
    fundingGoal: 600000,
    fundingProgress: 360000,
    minimumInvestment: 22000,
  },
  {
    _id: "funding-5",
    title: "Luxury Apartment Franchise",
    location: "Downtown Dubai",
    price: 15000,
    images: ["/properties/5.png"],
    rating: 4.8,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    availableFrom: "2023-06-01",
    type: "fund",
    returnRate: 8.5,
    investorsCount: 42,
    fundingGoal: 500000,
    fundingProgress: 250000,
    minimumInvestment: 15000,
  },
  {
    _id: "funding-6",
    title: "Luxury Apartment Franchise",
    location: "Downtown Dubai",
    price: 15000,
    images: ["/properties/6.png"],
    rating: 4.8,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    availableFrom: "2023-06-01",
    type: "fund",
    returnRate: 8.5,
    investorsCount: 42,
    fundingGoal: 500000,
    fundingProgress: 250000,
    minimumInvestment: 15000,
  },
  {
    _id: "funding-7",
    title: "Luxury Apartment Franchise",
    location: "Downtown Dubai",
    price: 15000,
    images: ["/properties/7.png"],
    rating: 4.8,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    availableFrom: "2023-06-01",
    type: "fund",
    returnRate: 8.5,
    investorsCount: 42,
    fundingGoal: 500000,
    fundingProgress: 250000,
    minimumInvestment: 15000,
  },
  {
    _id: "funding-8",
    title: "Luxury Apartment Franchise",
    location: "Downtown Dubai",
    price: 15000,
    images: ["/properties/8.png"],
    rating: 4.8,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    availableFrom: "2023-06-01",
    type: "fund",
    returnRate: 8.5,
    investorsCount: 42,
    fundingGoal: 500000,
    fundingProgress: 250000,
    minimumInvestment: 15000,
  },
  {
    _id: "funding-9",
    title: "Luxury Apartment Franchise",
    location: "Downtown Dubai",
    price: 15000,
    images: ["/properties/9.png"],
    rating: 4.8,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    availableFrom: "2023-06-01",
    type: "fund",
    returnRate: 8.5,
    investorsCount: 42,
    fundingGoal: 500000,
    fundingProgress: 250000,
    minimumInvestment: 15000,
  },
  {
    _id: "funding-10",
    title: "Luxury Apartment Franchise",
    location: "Downtown Dubai",
    price: 15000,
    images: ["/properties/10.png"],
    rating: 4.8,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    availableFrom: "2023-06-01",
    type: "fund",
    returnRate: 8.5,
    investorsCount: 42,
    fundingGoal: 500000,
    fundingProgress: 250000,
    minimumInvestment: 15000,
  },
];
*/

/*
const _sampleLaunchingFranchises: Franchise[] = [
  {
    _id: "launching-1",
    title: "Luxury Penthouse Franchise",
    location: "DIFC",
    price: 520000,
    images: ["/properties/11.png"],
    rating: 4.9,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2800,
    yearBuilt: 2022,
    type: "launch",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    launchProgress: 65,
  },
  {
    _id: "launching-2",
    title: "Waterfront Villa Franchise",
    location: "Emirates Hills",
    price: 1250000,
    images: ["/properties/12.png"],
    rating: 4.8,
    bedrooms: 5,
    bathrooms: 6,
    squareFeet: 7800,
    yearBuilt: 2021,
    type: "launch",
    startDate: "2024-02-01",
    endDate: "2024-08-31",
    launchProgress: 45,
  },
  {
    _id: "launching-3",
    title: "Modern Apartment Franchise",
    location: "Jumeirah Beach Residences",
    price: 280000,
    images: ["/properties/13.png"],
    rating: 4.6,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1600,
    yearBuilt: 2023,
    type: "launch",
    startDate: "2024-03-01",
    endDate: "2024-09-30",
    launchProgress: 30,
  },
  {
    _id: "launching-4",
    title: "Golf Course Mansion Franchise",
    location: "Emirates Golf Club",
    price: 890000,
    images: ["/properties/14.png"],
    rating: 4.9,
    bedrooms: 6,
    bathrooms: 7,
    squareFeet: 9200,
    yearBuilt: 2020,
    type: "launch",
    startDate: "2023-12-01",
    endDate: "2024-05-31",
    launchProgress: 80,
  },
  {
    _id: "launching-5",
    title: "Luxury Penthouse Franchise",
    location: "DIFC",
    price: 520000,
    images: ["/properties/15.png"],
    rating: 4.9,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2800,
    yearBuilt: 2022,
    type: "launch",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    launchProgress: 65,
  },
  {
    _id: "launching-6",
    title: "Luxury Penthouse Franchise",
    location: "DIFC",
    price: 520000,
    images: ["/properties/16.png"],
    rating: 4.9,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2800,
    yearBuilt: 2022,
    type: "launch",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    launchProgress: 65,
  },
  {
    _id: "launching-7",
    title: "Luxury Penthouse Franchise",
    location: "DIFC",
    price: 520000,
    images: ["/properties/17.png"],
    rating: 4.9,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2800,
    yearBuilt: 2022,
    type: "launch",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    launchProgress: 65,
  },
  {
    _id: "launching-8",
    title: "Luxury Penthouse Franchise",
    location: "DIFC",
    price: 520000,
    images: ["/properties/18.png"],
    rating: 4.9,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2800,
    yearBuilt: 2022,
    type: "launch",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    launchProgress: 65,
  },
  {
    _id: "launching-9",
    title: "Luxury Penthouse Franchise",
    location: "DIFC",
    price: 520000,
    images: ["/properties/19.png"],
    rating: 4.9,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2800,
    yearBuilt: 2022,
    type: "launch",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    launchProgress: 65,
  },
  {
    _id: "launching-10",
    title: "Luxury Penthouse Franchise",
    location: "DIFC",
    price: 520000,
    images: ["/properties/20.png"],
    rating: 4.9,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 2800,
    yearBuilt: 2022,
    type: "launch",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    launchProgress: 65,
  },
];
*/

/*
const _sampleOutletsFranchises: Franchise[] = [
  {
    _id: "outlets-1",
    title: "Luxury Hotel Suites Franchise",
    location: "Downtown Dubai",
    price: 100000,
    images: ["/properties/21.png"],
    rating: 4.7,
    projectedAnnualYield: 12.5,
    type: "live",
    currentBalance: 150000,
    totalBudget: 300000,
    activeOutlets: 3,
  },
  {
    _id: "outlets-2",
    title: "Beachfront Resort Villas Franchise",
    location: "Palm Jumeirah",
    price: 150000,
    images: ["/properties/22.png"],
    rating: 4.8,
    type: "live",
    currentBalance: 480000,
    totalBudget: 750000,
    activeOutlets: 5,
    projectedAnnualYield: 11.5,
  },
  {
    _id: "outlets-3",
    title: "Business Bay Office Tower Franchise",
    location: "Business Bay",
    price: 200000,
    images: ["/properties/23.png"],
    rating: 4.6,
    type: "live",
    currentBalance: 650000,
    totalBudget: 1000000,
    activeOutlets: 7,
    projectedAnnualYield: 10.2,
  },
  {
    _id: "outlets-4",
    title: "Luxury Residential Tower Franchise",
    location: "Dubai Marina",
    price: 120000,
    images: ["/properties/24.png"],
    rating: 4.9,
    type: "live",
    currentBalance: 520000,
    totalBudget: 800000,
    activeOutlets: 6,
    projectedAnnualYield: 10.8,
  },
  {
    _id: "outlets-5",
    title: "Luxury Hotel Suites Franchise",
    location: "Bluewaters Island",
    price: 150000,
    images: ["/properties/25.png"],
    rating: 4.9,
    type: "live",
    currentBalance: 150000,
    totalBudget: 300000,
    activeOutlets: 3,
    projectedAnnualYield: 8.5,
  },
  {
    _id: "outlets-6",
    title: "Luxury Hotel Suites Franchise",
    location: "Bluewaters Island",
    price: 150000,
    images: ["/properties/26.png"],
    rating: 4.9,
    type: "live",
    currentBalance: 150000,
    totalBudget: 300000,
    activeOutlets: 3,
    projectedAnnualYield: 8.5,
  },
  {
    _id: "outlets-7",
    title: "Luxury Hotel Suites Franchise",
    location: "Bluewaters Island",
    price: 150000,
    images: ["/properties/27.png"],
    rating: 4.9,
    type: "live",
    currentBalance: 150000,
    totalBudget: 300000,
    activeOutlets: 3,
    projectedAnnualYield: 8.5,
  },
  {
    _id: "outlets-8",
    title: "Luxury Hotel Suites Franchise",
    location: "Bluewaters Island",
    price: 150000,
    images: ["/properties/28.png"],
    rating: 4.9,
    type: "live",
    currentBalance: 150000,
    totalBudget: 300000,
    activeOutlets: 3,
    projectedAnnualYield: 8.5,
  },
  {
    _id: "outlets-9",
    title: "Luxury Hotel Suites Franchise",
    location: "Bluewaters Island",
    price: 150000,
    images: ["/properties/29.png"],
    rating: 4.9,
    type: "live",
    currentBalance: 150000,
    totalBudget: 300000,
    activeOutlets: 3,
    projectedAnnualYield: 8.5,
  },
  {
    _id: "outlets-10",
    title: "Luxury Hotel Suites Franchise",
    location: "Bluewaters Island",
    price: 150000,
    images: ["/properties/30.png"],
    rating: 4.9,
    type: "live",
    currentBalance: 150000,
    totalBudget: 300000,
    activeOutlets: 3,
    projectedAnnualYield: 8.5,
  },
];
*/

interface Franchise {
  _id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  rating?: number;
  bedrooms?: number;
  bathrooms?: number;
  size?: string | number;
  squareFeet?: number;
  description?: string;
  type: "fund" | "launch" | "live";
  businessSlug?: string;
  // funding specific properties
  availableFrom?: string;
  returnRate?: string | number;
  investorsCount?: number;
  fundingGoal?: number;
  fundingProgress?: number;
  minimumInvestment?: number;
  // launching specific properties
  yearBuilt?: number;
  startDate?: string;
  endDate?: string;
  launchProgress?: number;
  // outlets specific properties
  currentBalance?: number;
  totalBudget?: number;
  activeOutlets?: number;
  projectedAnnualYield?: number;
}

export default function Home() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("fund");
  const [searchQuery] = useState("");

  // Fetch all franchises from the database
  const allFranchises = useQuery(api.franchise.list, {});
  const allBusinesses = useQuery(api.businesses.listAll, {});

  // Update active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams?.get("tab") as "fund" | "launch" | "invest" | null;
    if (tab && ["fund", "launch", "invest"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Filter franchises based on search query
  const getFilteredProperties = (franchisesToFilter: Franchise[]) => {
    if (!searchQuery) return franchisesToFilter;
    const query = searchQuery.toLowerCase();
    return franchisesToFilter.filter(
      (franchise) =>
        franchise.title.toLowerCase().includes(query) ||
        franchise.location.toLowerCase().includes(query) ||
        (franchise.description?.toLowerCase() || "").includes(query),
    );
  };

  // Render search and filters for each tab
  /*
  const _renderSearchFilters = () => {
    return (
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-xl border border-border">
          <div className="flex-1 relative">
            <MapPin
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder={
                activeTab === "fund"
                  ? "Where are you going?"
                  : "Search location"
              }
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {activeTab === "fund" && (
            <>
              <div className="flex-1 relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Check-in — Check-out"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background"
                />
              </div>

              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Guests"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background"
                />
              </div>
            </>
          )}

          {activeTab === "launch" && (
            <>
              <div className="flex-1 relative ">
                <HomeIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <select className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background">
                  <option value="">Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="townhouse">Townhouse</option>
                </select>
              </div>

              <div className="flex-1 relative">
                <DollarSign
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <select className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background">
                  <option value="">Price Range</option>
                  <option value="0-500000">Up to AED 500,000</option>
                  <option value="500000-1000000">
                    AED 500,000 - 1,000,000
                  </option>
                  <option value="1000000+">AED 1,000,000+</option>
                </select>
              </div>
            </>
          )}

          {activeTab === "live" && (
            <>
              <div className="flex-1 relative">
                <TrendingUp
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <select className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background">
                  <option value="">Return Rate</option>
                  <option value="0-5">Up to 5%</option>
                  <option value="5-10">5% - 10%</option>
                  <option value="10+">10%+</option>
                </select>
              </div>

              <div className="flex-1 relative ">
                <DollarSign
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <select className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background">
                  <option value="">Min Investment</option>
                  <option value="0-5000">Up to AED 5,000</option>
                  <option value="5000-10000">AED 5,000 - 10,000</option>
                  <option value="10000+">AED 10,000+</option>
                </select>
              </div>
            </>
          )}

          <button className="bg-primary uppercase text-primary-foreground px-12 py-2 rounded-lg font-medium">
            Search
          </button>
        </div>
      </div>
    );
  }; */

  // Render property listings based on active tab
  const renderTabContent = () => {
    // Show loading state if data is still loading
    const isLoading = allFranchises === undefined || allBusinesses === undefined;

    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Convert database franchises to display format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const convertToDisplayFormat = (dbFranchises: any[], businesses: any[]) => {
      if (!dbFranchises || !businesses) return [];
      
      return dbFranchises.map((franchise) => {
        const business = businesses.find(b => b._id === franchise.businessId);
        const statusTypeMap: { [key: string]: "fund" | "launch" | "live" } = {
          "Funding": "fund",
          "Launching": "launch", 
          "Active": "live",
          "Closed": "live"
        };
        
        // Extract area and country from locationAddress
        const formatLocation = (address: string) => {
          if (!address) return "Location";
          const parts = address.split(',').map(p => p.trim());
          if (parts.length >= 2) {
            return `${parts[0]}, ${parts[parts.length - 1]}`; // First part (area) and last part (country)
          }
          return address;
        };
        
        return {
          _id: franchise._id,
          title: franchise.building || "Franchise Location",
          location: formatLocation(franchise.locationAddress || "Location"),
          price: franchise.costPerArea || 500,
          images: ["/images/1.svg"],
          rating: 4.5,
          size: franchise.carpetArea,
          type: statusTypeMap[franchise.status] || "fund",
          businessSlug: business?.slug || "business",
          // Funding specific
          returnRate: 8.5,
          investorsCount: Math.floor(Math.random() * 50) + 10,
          fundingGoal: franchise.totalInvestment,
          fundingProgress: (franchise.selectedShares || 0) * (franchise.costPerArea || 500),
          // Launching specific  
          startDate: franchise.launchStartDate,
          endDate: franchise.launchEndDate,
          launchProgress: franchise.status === "Launching" ? 50 : 0,
          // Active/Live specific
          currentBalance: franchise.totalInvestment ? franchise.totalInvestment * 0.6 : 150000,
          totalBudget: franchise.totalInvestment || 300000,
          activeOutlets: 3,
          projectedAnnualYield: 10.5
        };
      });
    };
    
    const convertedFranchises = convertToDisplayFormat(allFranchises || [], allBusinesses || []);
    
    // Filter by status/tab
    let currentProperties: Franchise[] = [];
    switch (activeTab) {
      case "fund":
        currentProperties = convertedFranchises.filter(f => f.type === "fund");
        break;
      case "launch":
        currentProperties = convertedFranchises.filter(f => f.type === "launch");
        break;
      case "live":
        currentProperties = convertedFranchises.filter(f => f.type === "live");
        break;
    }

    const filteredProperties = getFilteredProperties(currentProperties);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-6 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((franchise) => (
            <FranchiseCard
              key={franchise._id.toString()}
              id={franchise._id.toString()}
              type={activeTab as "fund" | "launch" | "live"}
              title={franchise.title}
              location={franchise.location || "Dubai, UAE"}
              price={franchise.price}
              image={
                franchise.images && franchise.images.length > 0
                  ? franchise.images[0]
                  : ""
              }
              rating={franchise.rating || 4.5}
              bedrooms={franchise.bedrooms}
              bathrooms={franchise.bathrooms}
              size={franchise.squareFeet}
              returnRate={franchise.returnRate || 8}
              investorsCount={franchise.investorsCount || 42}
              fundingGoal={franchise.fundingGoal || 500000}
              fundingProgress={franchise.fundingProgress || 250000}
              startDate={franchise.startDate}
              endDate={franchise.endDate}
              launchProgress={franchise.launchProgress}
              currentBalance={franchise.currentBalance}
              totalBudget={franchise.totalBudget}
              activeOutlets={franchise.activeOutlets}
              businessSlug={franchise.businessSlug}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No properties found</h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery
                ? "Try a different search term"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>{renderTabContent()}</>
  );
}