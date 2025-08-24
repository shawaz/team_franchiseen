"use client";

import {
  Bell,
  CreditCard,
  HeartHandshake,
  ChevronDown,
  Home,
  Shield,
  Building,
  DollarSign,
  Users,
  Megaphone,
  TrendingUp,
  Code,
  HelpCircle,
  Calendar,
  Mail,
  FileText,
  Plane,
  BookOpen,
  Target,
  Activity,
  Radio,
  Handshake,
  Database,
  UserCheck,
  Briefcase,
  Wallet,
  CreditCard as CreditCardIcon,
  Receipt,
  UserPlus,
  Building2,
  MapPin,
  FileCheck,
  GraduationCap,
  UserMinus,
  BarChart3,
  MessageSquare,
  ShoppingCart,
  Users2,
  Zap,
  Bug,
  Ticket,
  Menu
} from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react';
import { ThemeSwitcher } from './theme-switcher';
import { usePermissions } from '@/hooks/usePermissions';

function CompanyHeader() {
    const pathname = usePathname();
    const notificationsRef = useRef<HTMLDivElement>(null);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const { hasPermission, isLoading } = usePermissions();

    // Define the menu structure with permissions
    const menuStructure = [
        {
            id: 'home',
            label: 'Home',
            icon: Home,
            permission: 'home.tasks', // At least one home permission required
            items: [
                { href: '/admin/tasks', label: 'Tasks', icon: FileCheck, permission: 'home.tasks' },
                { href: '/admin/mail', label: 'Mail', icon: Mail, permission: 'home.mail' },
                { href: '/admin/calendar', label: 'Calendar', icon: Calendar, permission: 'home.calendar' },
                { href: '/admin/docs', label: 'Docs', icon: FileText, permission: 'home.docs' },
                { href: '/admin/travels', label: 'Travels', icon: Plane, permission: 'home.travels' },
                { href: '/admin/handbook', label: 'Handbook', icon: BookOpen, permission: 'home.handbook' },
            ]
        },
        {
            id: 'admin',
            label: 'Admin',
            icon: Shield,
            permission: 'admin.plan',
            items: [
                { href: '/admin/plan', label: 'Plan', icon: Target, permission: 'admin.plan' },
                { href: '/admin/strategy', label: 'Strategy', icon: Activity, permission: 'admin.strategy' },
                { href: '/admin/activities', label: 'Activities', icon: Activity, permission: 'admin.activities' },
                { href: '/admin/channels', label: 'Channels', icon: Radio, permission: 'admin.channels' },
                { href: '/admin/partners', label: 'Partners', icon: Handshake, permission: 'admin.partners' },
                { href: '/admin/resources', label: 'Resources', icon: Database, permission: 'admin.resources' },
                { href: '/admin/relations', label: 'Relations', icon: UserCheck, permission: 'admin.relations' },
                { href: '/admin/access-control', label: 'Access Control', icon: Shield, permission: 'admin.access-control' },
            ]
        },
        {
            id: 'operations',
            label: 'Operations',
            icon: Building,
            permission: 'operations.office',
            items: [
                { href: '/admin/office', label: 'Office', icon: Building2, permission: 'operations.office' },
                { href: '/admin/funding', label: 'Funding', icon: DollarSign, permission: 'operations.funding' },
                { href: '/admin/projects', label: 'Projects', icon: Briefcase, permission: 'operations.projects' },
                { href: '/admin/ongoing', label: 'Ongoing', icon: Activity, permission: 'operations.ongoing' },
                { href: '/admin/closed', label: 'Closed', icon: FileCheck, permission: 'operations.closed' },
            ]
        },
        {
            id: 'finances',
            label: 'Finances',
            icon: DollarSign,
            permission: 'finances.wallets',
            items: [
                { href: '/admin/wallets', label: 'Wallets', icon: Wallet, permission: 'finances.wallets' },
                { href: '/admin/banks', label: 'Banks', icon: Building2, permission: 'finances.banks' },
                { href: '/admin/budget', label: 'Budget', icon: BarChart3, permission: 'finances.budget' },
                { href: '/admin/invoices', label: 'Invoices', icon: Receipt, permission: 'finances.invoices' },
                { href: '/admin/payee', label: 'Payee', icon: UserCheck, permission: 'finances.payee' },
                { href: '/admin/transactions', label: 'Transactions', icon: CreditCardIcon, permission: 'finances.transactions' },
            ]
        },
        {
            id: 'people',
            label: 'People',
            icon: Users,
            permission: 'people.users',
            items: [
                { href: '/admin/users', label: 'Users', icon: Users2, permission: 'people.users' },
                { href: '/admin/teams', label: 'Teams', icon: Users, permission: 'people.teams' },
                { href: '/admin/openings', label: 'Openings', icon: MapPin, permission: 'people.openings' },
                { href: '/admin/applications', label: 'Applications', icon: FileText, permission: 'people.applications' },
                { href: '/admin/onboarding', label: 'Onboarding', icon: UserPlus, permission: 'people.onboarding' },
                { href: '/admin/training', label: 'Training', icon: GraduationCap, permission: 'people.training' },
                { href: '/admin/offboarding', label: 'Offboarding', icon: UserMinus, permission: 'people.offboarding' },
            ]
        },
        {
            id: 'marketing',
            label: 'Marketing',
            icon: Megaphone,
            permission: 'marketing.market',
            items: [
                { href: '/admin/market', label: 'Market', icon: BarChart3, permission: 'marketing.market' },
                { href: '/admin/content', label: 'Content', icon: FileText, permission: 'marketing.content' },
                { href: '/admin/campaign', label: 'Campaign', icon: Megaphone, permission: 'marketing.campaign' },
            ]
        },
        {
            id: 'sales',
            label: 'Sales',
            icon: TrendingUp,
            permission: 'sales.leads',
            items: [
                { href: '/admin/leads', label: 'Leads', icon: UserPlus, permission: 'sales.leads' },
                { href: '/admin/clients', label: 'Clients', icon: Users2, permission: 'sales.clients' },
                { href: '/admin/company', label: 'Company', icon: Building, permission: 'sales.company' },
                { href: '/admin/competitions', label: 'Competitions', icon: TrendingUp, permission: 'sales.competitions' },
            ]
        },
        {
            id: 'software',
            label: 'Software',
            icon: Code,
            permission: 'software.features',
            items: [
                { href: '/admin/features', label: 'Features', icon: Zap, permission: 'software.features' },
                { href: '/admin/bugs', label: 'Bugs', icon: Bug, permission: 'software.bugs' },
                { href: '/admin/databases', label: 'Databases', icon: Database, permission: 'software.databases' },
            ]
        },
        {
            id: 'support',
            label: 'Support',
            icon: HelpCircle,
            permission: 'support.tickets',
            items: [
                { href: '/admin/tickets', label: 'Tickets', icon: Ticket, permission: 'support.tickets' },
                { href: '/admin/help-desk', label: 'Help Desk', icon: HelpCircle, permission: 'support.help-desk' },
            ]
        }
    ];

    // Filter menu structure based on user permissions
    const filteredMenuStructure = menuStructure.filter(menu => {
        // Check if user has permission for this menu section
        if (!hasPermission(menu.permission)) return false;

        // Filter items within the menu based on permissions
        const filteredItems = menu.items.filter(item => hasPermission(item.permission));

        // Only show menu if it has at least one accessible item
        return filteredItems.length > 0;
    }).map(menu => ({
        ...menu,
        items: menu.items.filter(item => hasPermission(item.permission))
    }));

    const handleDropdownToggle = (dropdown: boolean, setter: (value: boolean) => void) => {
        setter(!dropdown);
    };

    const handleMenuToggle = (menuId: string) => {
        setOpenDropdown(openDropdown === menuId ? null : menuId);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
            // Close menu dropdowns when clicking outside
            const target = event.target as HTMLElement;
            if (!target.closest('.menu-dropdown')) {
                setOpenDropdown(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

                            {/* Mobile menu button */}
                            <button
                                className="lg:hidden p-2 ml-4 rounded-md text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                                onClick={() => {
                                    // This will be handled by the parent layout
                                    const event = new CustomEvent('toggleSidebar');
                                    window.dispatchEvent(event);
                                }}
                            >
                                <Menu className="h-5 w-5" />
                            </button>

                            <div className="hidden lg:flex items-center justify-start gap-2 text-sm font-medium ml-6">
                                {filteredMenuStructure.map(menu => (
                                    <div key={menu.id} className="relative menu-dropdown">
                                        <button
                                            onClick={() => handleMenuToggle(menu.id)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors duration-200 ${
                                                openDropdown === menu.id
                                                    ? 'bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                                                    : 'text-stone-900 dark:text-stone-100'
                                            }`}
                                        >
                                            <menu.icon className="h-4 w-4" />
                                            {menu.label}
                                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                                                openDropdown === menu.id ? 'rotate-180' : ''
                                            }`} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {openDropdown === menu.id && (
                                            <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-stone-800 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 py-2 z-50">
                                                {menu.items.map(item => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setOpenDropdown(null)}
                                                        className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors ${
                                                            pathname === item.href
                                                                ? 'bg-stone-50 dark:bg-stone-700 text-stone-900 dark:text-stone-100 font-medium'
                                                                : 'text-stone-700 dark:text-stone-300'
                                                        }`}
                                                    >
                                                        <item.icon className="h-4 w-4" />
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
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
                            
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default CompanyHeader