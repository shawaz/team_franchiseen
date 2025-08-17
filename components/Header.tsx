"use client";

import {
  Bell,
  CreditCard,
  HeartHandshake,
  Power,
  Search,
  Store,
  UserCircle,
  Globe,
  X,
  Filter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { ThemeSwitcher } from "./theme-switcher";
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  useUser,
  useOrganizationList,
} from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import EmailVerificationModal from "./EmailVerificationModal";
import { api } from "../convex/_generated/api";
import CreateBusinessModal from "./business/CreateBusinessModal";
import { Id } from "../convex/_generated/dataModel";
import LanguageCurrencyModal from "./LanguageCurrencyModal";

function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateBusinessOpen, setIsCreateBusinessOpen] = useState(false);
  const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchMode, setIsMobileSearchMode] = useState(false);
  const [isLangCurrModalOpen, setIsLangCurrModalOpen] = useState(false);
  const [langCurrModalType, setLangCurrModalType] = useState<
    "language" | "currency" | null
  >(null);

  // Refs for dropdown containers
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();
  const { userMemberships } = useOrganizationList();
  const email = user?.primaryEmailAddress?.emailAddress;
  const createUser = useMutation(api.myFunctions.createUser);
  const [userId, setUserId] = useState<string | null>(null);

  // Add this line to get Convex user data
  const convexUser = useQuery(
    api.myFunctions.getUserByEmail,
    email ? { email } : "skip",
  );

  const searchResults = useQuery(
    api.businesses.searchByName,
    searchQuery ? { searchQuery } : "skip",
  );

  useEffect(() => {
    async function fetchUserId() {
      if (email) {
        const id = await createUser({ email });
        setUserId(id);
      }
    }
    fetchUserId();
  }, [email, createUser]);

  const userBusinesses =
    useQuery(
      api.businesses.listByOwner,
      userId ? { ownerId: userId as Id<"users"> } : "skip",
    ) || [];

  // Debug logs
  useEffect(() => {
    console.log("Organizations Debug:", {
      userMembershipsData: userMemberships?.data,
      userMembershipsCount: userMemberships?.data?.length,
      isProfileOpen,
    });
  }, [userMemberships?.data, isProfileOpen]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
      const searchContainer = document.getElementById("search-container");
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close other dropdowns when one is opened
  const handleDropdownToggle = (
    dropdown: boolean,
    setter: (value: boolean) => void,
  ) => {
    if (!dropdown) {
      setIsProfileOpen(false);
      setIsNotificationsOpen(false);
    }
    setter(!dropdown);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSearchOpen(!!e.target.value);
  };

  // Handle mobile search mode
  const handleMobileSearchToggle = () => {
    setIsMobileSearchMode(!isMobileSearchMode);
    if (!isMobileSearchMode) {
      // Clear search when opening
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  // Handle keyboard events for mobile search
  const handleMobileSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Escape") {
      setIsMobileSearchMode(false);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header className="fixed w-full bg-background-light dark:bg-stone-800/50 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Search Mode */}
          {isMobileSearchMode ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleMobileSearchKeyDown}
                  className="w-full py-2 px-4 border-2 border-stone-200 dark:border-stone-600 outline-none text-sm bg-white dark:bg-stone-700 focus:border-stone-300 dark:focus:bg-stone-800 transition-colors"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1  hover:bg-stone-100 dark:hover:bg-stone-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 text-stone-500 dark:text-stone-400" />
                  </button>
                )}

                {/* Mobile Search Results Dropdown */}
                {isSearchOpen && (
                  <div className="absolute left-0 right-0 top-full mt-3 bg-white dark:bg-stone-800 border-2 dark:border-stone-700 max-h-[400px] overflow-y-auto z-50">
                    {searchResults && searchResults.length > 0 ? (
                      searchResults.map((business) => (
                        <Link
                          key={business._id}
                          href={`/business/${business._id}`}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-stone-700 transition-colors"
                          onClick={() => {
                            setIsMobileSearchMode(false);
                            setSearchQuery("");
                            setIsSearchOpen(false);
                          }}
                        >
                          <div className="relative h-10 w-10 flex-shrink-0 z-0">
                            <Image
                              src={business.logoUrl || "/logo/logo-2.svg"}
                              alt={business.name}
                              width={40}
                              height={40}
                              className="object-cover rounded-lg z-0"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {business.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {business.industry && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-stone-700 px-2 py-0.5 rounded">
                                  {business.industry.name}
                                </span>
                              )}
                              {business.category && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-stone-700 px-2 py-0.5 rounded">
                                  {business.category.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No businesses found for &quot;{searchQuery}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={handleMobileSearchToggle}
                className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                aria-label="Close search"
              >
                <X className="h-5 w-5 text-stone-700 dark:text-stone-300" />
              </button>
            </div>
          ) : (
            /* Normal Header Mode */
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 w-2/3">
                {/* Logo */}
                <Link href="/" className="flex items-center cursor-pointer ">
                  <div className="flex items-center cursor-pointer">
                    <Image
                      src="/logo.svg"
                      alt="logo"
                      width={28}
                      height={28}
                      className="z-0"
                    />
                    <span className="text-xl ml-4 font-bold">FRANCHISEEN</span>
                  </div>
                </Link>
                {/* <div className="hidden sm:block">|</div> */}
              </div>
              <div className="ml-4 hidden sm:flex items-center justify-center ">
                <div id="search-container" className="w-auto relative">
                  <div className="relative flex items-center dark:bg-stone-800 border-2 transition-all duration-300">
                    <input
                      type="text"
                      placeholder="Search Brands"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-[300px] py-1.5 pl-4 pr-10 dark:bg-stone-800 outline-none text-sm md:focus:w-[400px] transition-all duration-300 bg-white dark:bg-stone-800"
                    />
                    <div className="absolute right-1.5 p-2 dark:bg-stone-800 dark:bg-stone-800 cursor-pointer hover:bg-primary-dark transition-colors">
                      <Filter className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Search Results Dropdown */}
                  {isSearchOpen && (
                    <div className="absolute left-0 right-0 mt-3 bg-white dark:bg-stone-900 border-2 dark:border-stone-700 max-h-[400px] overflow-y-auto z-50">
                      {searchResults && searchResults.length > 0 ? (
                        searchResults.map((business) => (
                          <Link
                            key={business._id}
                            href={`/business/${business._id}`}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-stone-700 transition-colors"
                          >
                            <div className="relative h-10 w-10 flex-shrink-0 z-0">
                              <Image
                                src={business.logoUrl || "/logo/logo-2.svg"}
                                alt={business.name}
                                width={40}
                                height={40}
                                className="object-cover rounded-lg z-0"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {business.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                {business.industry && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-stone-700 px-2 py-0.5 rounded">
                                    {business.industry.name}
                                  </span>
                                )}
                                {business.category && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-stone-700 px-2 py-0.5 rounded">
                                    {business.category.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No franchises available with name &quot;
                            {searchQuery}&quot;
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Navigation */}
              <div className="flex items-center justify-end w-full md:w-2/3">
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded-full sm:hidden block hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                    aria-label="Search"
                    onClick={handleMobileSearchToggle}
                  >
                    <Search className="h-5 w-5 text-stone-700 dark:text-stone-300" />
                  </button>
                  <ThemeSwitcher />
                  <button
                    className="p-2 rounded-full hidden sm:block hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
                    aria-label="Change Currency"
                    onClick={() => {
                      setLangCurrModalType("currency");
                      setIsLangCurrModalOpen(true);
                    }}
                  >
                    <Globe className="h-5 w-5 text-stone-700 dark:text-stone-300" />
                  </button>
                </div>
                <SignedIn>
                  <div className="flex items-center gap-3 ml-2">
                    {/* Notifications Dropdown */}
                    <div className="relative" ref={notificationsRef}>
                      <button
                        onClick={() =>
                          handleDropdownToggle(
                            isNotificationsOpen,
                            setIsNotificationsOpen,
                          )
                        }
                        className="hover:bg-gray-100 hidden md:block dark:hover:bg-stone-800 p-2 rounded-full transition-colors duration-200"
                      >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full"></span>
                      </button>
                      <div
                        className={`absolute  right-0 mt-3 w-80 dark:bg-stone-800 bg-white border-0 py-4 transform transition-all duration-200 origin-top-right ${
                          isNotificationsOpen
                            ? "scale-100 opacity-100"
                            : "scale-95 opacity-0 pointer-events-none"
                        }`}
                      >
                        <div className="px-6 pb-4 border-b">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold dark:text-gray-100 text-gray-900">
                              Notifications
                            </h3>
                            <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">
                              2 new
                            </span>
                          </div>
                        </div>
                        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                          <div className="px-6 py-4 border-b last:border-0 dark:hover:bg-stone-900/30 hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex gap-4">
                              <div className="mt-1 rounded-full bg-primary/10 p-2">
                                <HeartHandshake className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  New Share Offer
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">
                                  You received a new share purchase offer
                                </p>
                                <p className="text-gray-400 dark:text-gray-600 text-xs mt-2">
                                  2 minutes ago
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="px-6 py-4 border-b last:border-0 dark:hover:bg-stone-900/30 hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex gap-4">
                              <div className="mt-1 rounded-full dark:bg-green-900/50 bg-green-50 p-2">
                                <CreditCard className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  Monthly Earnings Update
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">
                                  Your monthly earnings have been calculated
                                </p>
                                <p className="text-gray-400 dark:text-gray-600 text-xs mt-2">
                                  1 hour ago
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="px-6 pt-4 border-t mt-2">
                          <button className="text-primary hover:text-primary/90 text-sm font-medium">
                            View all notifications
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                      <button
                        onClick={() =>
                          handleDropdownToggle(isProfileOpen, setIsProfileOpen)
                        }
                        className="hover:bg-gray-100 hidden md:block dark:hover:bg-stone-700 p-2 rounded-full transition-colors duration-200"
                      >
                        <UserCircle className="h-5 w-5" />
                      </button>
                      <div
                        className={`absolute right-0 mt-3 w-72 dark:bg-stone-800 backdrop-blur bg-white border-0 overflow-hidden transform transition-all duration-200 origin-top-right ${
                          isProfileOpen
                            ? "scale-100 opacity-100"
                            : "scale-95 opacity-0 pointer-events-none"
                        }`}
                      >
                        <div>
                          <Link href="/profile/franchise">
                            <div className="flex items-center gap-3 px-5 py-2 text-gray-700 dark:text-gray-100 dark:hover:bg-stone-900/30 hover:bg-gray-50 transition-colors">
                              <div className="relative h-8 w-8 flex-shrink-0 z-0">
                                <Image
                                  src={convexUser?.avatar || "/logo/logo-2.svg"}
                                  alt="Profile"
                                  width={32}
                                  height={32}
                                  loading="lazy"
                                  className="object-cover rounded z-0"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium truncate">
                                  {" "}
                                  {convexUser?.first_name}{" "}
                                  {convexUser?.family_name}
                                </h3>
                                {/* <p className="text-xs text-gray-500 truncate">
                                                            {convexUser?.email}
                                                            </p> */}
                              </div>
                            </div>
                          </Link>
                        </div>

                        {userBusinesses.length > 0 && (
                          <div className="border-t">
                            {/* <div className="px-5 py-2">
                                                    <h4 className="text-xs font-medium text-gray-500 uppercase">Your Businesses</h4>
                                                </div> */}
                            {userBusinesses.map(
                              (business: {
                                _id: string;
                                name: string;
                                slug?: string;
                                logoUrl?: string;
                                industry?: { name: string };
                              }) => (
                                <Link
                                  key={business._id}
                                  href={business.slug ? `/${business.slug}/franchise` : `/business/${business._id}/franchise`}
                                  className="flex items-center gap-3 px-5 py-2 text-gray-700 dark:text-gray-100 dark:hover:bg-stone-900/30 hover:bg-gray-50 transition-colors"
                                >
                                  <div className="relative h-8 w-8 flex-shrink-0 z-0">
                                    <Image
                                      src={
                                        business.logoUrl || "/logo/logo-2.svg"
                                      }
                                      alt={business.name}
                                      width={32}
                                      height={32}
                                      loading="lazy"
                                      className="object-cover rounded z-0"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium truncate">
                                      {business.name}
                                    </h3>
                                  </div>
                                </Link>
                              ),
                            )}
                          </div>
                        )}

                        <div className="border-t">
                          <Link
                            href="#"
                            className="flex items-center gap-4 px-6 py-3 text-gray-700 dark:text-gray-100 dark:hover:bg-stone-900/30 hover:bg-gray-50 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsCreateBusinessOpen(true);
                            }}
                          >
                            <Store className="h-5 w-5 dark:text-gray-400 text-gray-400" />
                            <span className="text-sm font-medium">
                              Create New Business
                            </span>
                          </Link>
                        </div>
                        <div className="border-t">
                          <SignOutButton>
                            <button className="w-full flex items-center cursor-pointer gap-4 px-6 py-3 text-gray-700 dark:text-gray-100 dark:hover:bg-red-900/50 hover:bg-red-50 transition-colors">
                              <Power className="h-5 w-5 dark:text-red-400 text-red-400" />
                              <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                                Sign Out
                              </span>
                            </button>
                          </SignOutButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </SignedIn>
                <SignedOut>
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => setIsEmailVerificationOpen(true)}
                      className="cursor-pointer hidden md:block uppercase ml-4 px-8 py-2 rounded-full text-sm font-bold bg-neutral-800 hover:bg-yellow-700 text-stone-100 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-yellow-700 transition-colors duration-200"
                      aria-label="Get Started"
                    >
                      Get Started
                    </button>
                    <EmailVerificationModal
                      isOpen={isEmailVerificationOpen}
                      onClose={() => setIsEmailVerificationOpen(false)}
                    />
                  </div>
                </SignedOut>
              </div>
            </div>
          )}
        </div>
      </header>
      <CreateBusinessModal
        isOpen={isCreateBusinessOpen}
        onClose={() => setIsCreateBusinessOpen(false)}
      />
      <LanguageCurrencyModal
        isOpen={isLangCurrModalOpen}
        type={langCurrModalType}
        onClose={() => setIsLangCurrModalOpen(false)}
      />
    </>
  );
}

export default Header;
