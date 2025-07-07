"use client";

import { Bell, CreditCard, HeartHandshake } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react';
import { useRef } from 'react';
import { ThemeSwitcher } from './theme-switcher';

function CompanyHeader() {
    const pathname = usePathname();
    const navLinks = [
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/admin/users', label: 'Users' },
        { href: '/admin/business', label: 'Business' },
        { href: '/admin/franchise', label: 'Franchise' },
        { href: '/admin/invoices', label: 'Invoices' },
        // { href: '/admin/property', label: 'Property' },
        // { href: '/admin/teams', label: 'Teams' },
        { href: '/admin/earnings', label: 'Earnings' },
        { href: '/admin/payouts', label: 'Payouts' },
        { href: '/admin/settings', label: 'Settings' },
    ];
    const notificationsRef = useRef<HTMLDivElement>(null)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

    const handleDropdownToggle = (dropdown: boolean, setter: (value: boolean) => void) => {
        setter(!dropdown)
    }   

    return (
        <>
            <header className="fixed w-full bg-background-light bg-white dark:bg-stone-800 z-50 py-3 border-b border-stone-200 dark:border-stone-700 mb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start ">
                        {/* Logo */}
                            <Link href="/admin/dashboard" className="flex items-center cursor-pointer ">
                                <div className="flex items-center cursor-pointer">
                                    <Image src="/logo.svg" alt="logo" width={28} height={28} className="z-0" />
                                </div>
                            </Link>
                            <div className="flex items-center justify-start gap-6 text-sm font-medium ml-6">
                                {navLinks.map(link => (
                                    <Link key={link.href} href={link.href}>
                                        <div
                                            className={`text-sm font-medium cursor-pointer hover:text-stone-400 transition-colors duration-200 ${
                                                pathname === link.href
                                                    ? 'text-stone-600 dark:text-stone-400 hover:text-stone-600 dark:hover:text-stone-400'
                                                    : 'text-stone-900 dark:text-stone-100 hover:text-stone-600 dark:hover:text-stone-400'
                                            }`}
                                        >
                                            {link.label}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {/* Right Navigation */}
                        <div className="flex items-center justify-end  gap-2">
                            <ThemeSwitcher />

                            {/* Notifications Dropdown */}
                            <div className="relative mr-2" ref={notificationsRef}>
                                <button 
                                    onClick={() => handleDropdownToggle(isNotificationsOpen, setIsNotificationsOpen)}
                                    className="hover:bg-gray-100 dark:hover:bg-stone-700 p-2 rounded-full transition-colors duration-200"
                                >
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full"></span>
                                </button>
                                <div className={`absolute right-0 mt-3 w-80 dark:bg-stone-800 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-0 py-4 transform transition-all duration-200 origin-top-right ${
                                    isNotificationsOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                                }`}>
                                    <div className="px-6 pb-4 border-b">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold dark:text-gray-100 text-gray-900">Notifications</h3>
                                            <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full font-medium">2 new</span>
                                        </div>
                                    </div>
                                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                                        <div className="px-6 py-4 border-b last:border-0 dark:hover:bg-stone-700 hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="flex gap-4">
                                                <div className="mt-1 rounded-full bg-primary/10 p-2">
                                                    <HeartHandshake className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">New Share Offer</p>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">You received a new share purchase offer</p>
                                                    <p className="text-gray-400 dark:text-gray-600 text-xs mt-2">2 minutes ago</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-6 py-4 border-b last:border-0 dark:hover:bg-stone-700 hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="flex gap-4">
                                                <div className="mt-1 rounded-full dark:bg-green-900/50 bg-green-50 p-2">
                                                    <CreditCard className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">Monthly Earnings Update</p>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">Your monthly earnings have been calculated</p>
                                                    <p className="text-gray-400 dark:text-gray-600 text-xs mt-2">1 hour ago</p>
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
                            <Link href="/">
                                <button
                                    className="cursor-pointer px-4 py-2 rounded-full text-sm font-medium bg-stone-100 hover:bg-stone-200 text-stone-900 dark:text-stone-100 dark:bg-stone-700 dark:hover:bg-stone-600 transition-colors duration-200"
                                    aria-label="Exit Dashboard"
                                >
                                    Exit Dashboard
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default CompanyHeader