"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
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
  CreditCard,
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
  X,
  Factory,
  Timer,
  RefreshCw
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuStructure = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    permission: 'home.tasks',
    items: [
      { href: '/admin/home/tasks', label: 'Tasks', icon: FileCheck, permission: 'home.tasks' },
      { href: '/admin/home/mail', label: 'Mail', icon: Mail, permission: 'home.mail' },
      { href: '/admin/home/calendar', label: 'Calendar', icon: Calendar, permission: 'home.calendar' },
      { href: '/admin/home/docs', label: 'Docs', icon: FileText, permission: 'home.docs' },
      { href: '/admin/home/travels', label: 'Travels', icon: Plane, permission: 'home.travels' },
      { href: '/admin/home/handbook', label: 'Handbook', icon: BookOpen, permission: 'home.handbook' },
    ]
  },
  {
    id: 'admin',
    label: 'Administrator',
    icon: Building,
    permission: 'admin.plan',
    items: [
      { href: '/admin/admin/plan', label: 'Plan', icon: Target, permission: 'admin.plan' },
      { href: '/admin/admin/strategy', label: 'Strategy', icon: Activity, permission: 'admin.strategy' },
      { href: '/admin/admin/activities', label: 'Activities', icon: Activity, permission: 'admin.activities' },
      { href: '/admin/admin/channels', label: 'Channels', icon: Radio, permission: 'admin.channels' },
      { href: '/admin/admin/partners', label: 'Partners', icon: Handshake, permission: 'admin.partners' },
      { href: '/admin/admin/resources', label: 'Resources', icon: Database, permission: 'admin.resources' },
      { href: '/admin/admin/relations', label: 'Relations', icon: UserCheck, permission: 'admin.relations' },
      { href: '/admin/access-control', label: 'Access Control', icon: Shield, permission: 'admin.access-control' },
    ]
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: Factory,
    permission: 'operations.office',
    items: [
      { href: '/admin/operations/office', label: 'Brands', icon: Building2, permission: 'operations.office' },
      { href: '/admin/operations/funding', label: 'Funding', icon: DollarSign, permission: 'operations.funding' },
      { href: '/admin/operations/projects', label: 'Projects', icon: Briefcase, permission: 'operations.projects' },
      { href: '/admin/operations/ongoing', label: 'Ongoing', icon: Activity, permission: 'operations.ongoing' },
      { href: '/admin/operations/closed', label: 'Closed', icon: FileCheck, permission: 'operations.closed' },
    ]
  },
  {
    id: 'finances',
    label: 'Finances',
    icon: DollarSign,
    permission: 'finances.wallets',
    items: [
      { href: '/admin/finances/wallets', label: 'Wallets', icon: Wallet, permission: 'finances.wallets' },
      { href: '/admin/finances/banks', label: 'Banks', icon: Building2, permission: 'finances.banks' },
      { href: '/admin/finances/budget', label: 'Budget', icon: BarChart3, permission: 'finances.budget' },
      { href: '/admin/finances/invoices', label: 'Invoices', icon: Receipt, permission: 'finances.invoices' },
      { href: '/admin/finances/payee', label: 'Payee', icon: UserCheck, permission: 'finances.payee' },
      { href: '/admin/finances/transactions', label: 'Transactions', icon: CreditCard, permission: 'finances.transactions' },
      { href: '/admin/escrow', label: 'Escrow', icon: Shield, permission: 'finances.escrow' },
      { href: '/admin/funding', label: 'Funding Timer', icon: Timer, permission: 'finances.funding' },
      { href: '/admin/investments', label: 'Investments', icon: TrendingUp, permission: 'finances.investments' },
      { href: '/admin/refunds', label: 'Refunds', icon: RefreshCw, permission: 'finances.refunds' },
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
      { href: '/admin/people/openings', label: 'Openings', icon: MapPin, permission: 'people.openings' },
      { href: '/admin/people/applications', label: 'Applications', icon: FileText, permission: 'people.applications' },
      { href: '/admin/people/onboarding', label: 'Onboarding', icon: UserPlus, permission: 'people.onboarding' },
      { href: '/admin/people/training', label: 'Training', icon: GraduationCap, permission: 'people.training' },
      { href: '/admin/people/offboarding', label: 'Offboarding', icon: UserMinus, permission: 'people.offboarding' },
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: Megaphone,
    permission: 'marketing.market',
    items: [
      { href: '/admin/marketing/market', label: 'Market', icon: BarChart3, permission: 'marketing.market' },
      { href: '/admin/marketing/content', label: 'Content', icon: FileText, permission: 'marketing.content' },
      { href: '/admin/marketing/campaign', label: 'Campaign', icon: Megaphone, permission: 'marketing.campaign' },
    ]
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: TrendingUp,
    permission: 'sales.leads',
    items: [
      { href: '/admin/sales/leads', label: 'Leads', icon: UserPlus, permission: 'sales.leads' },
      { href: '/admin/sales/clients', label: 'Clients', icon: Users2, permission: 'sales.clients' },
      { href: '/admin/sales/company', label: 'Company', icon: Building, permission: 'sales.company' },
      { href: '/admin/sales/competitions', label: 'Competitions', icon: TrendingUp, permission: 'sales.competitions' },
    ]
  },
  {
    id: 'software',
    label: 'Software',
    icon: Code,
    permission: 'software.features',
    items: [
      { href: '/admin/software/features', label: 'Features', icon: Zap, permission: 'software.features' },
      { href: '/admin/software/bugs', label: 'Bugs', icon: Bug, permission: 'software.bugs' },
      { href: '/admin/software/databases', label: 'Databases', icon: Database, permission: 'software.databases' },
    ]
  },
  {
    id: 'support',
    label: 'Support',
    icon: HelpCircle,
    permission: 'support.tickets',
    items: [
      { href: '/admin/support/tickets', label: 'Tickets', icon: Ticket, permission: 'support.tickets' },
      { href: '/admin/support/help-desk', label: 'Help Desk', icon: HelpCircle, permission: 'support.help-desk' },
    ]
  }
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { hasPermission, hasDepartmentAccess, departmentAccess } = usePermissions();

  // Map menu sections to departments
  const menuToDepartment: Record<string, string> = {
    'home': 'home',
    'admin': 'administration',
    'finances': 'finances',
    'operations': 'operations',
    'people': 'people',
    'marketing': 'marketing',
    'sales': 'sales',
    'software': 'software',
    'support': 'support'
  };

  // Filter menu structure based on department access and permissions
  const filteredMenuStructure = menuStructure.filter(menu => {
    const department = menuToDepartment[menu.id];

    // Check department access first
    if (department && !hasDepartmentAccess(department)) return false;

    // Then check individual permissions
    if (!hasPermission(menu.permission)) return false;

    const filteredItems = menu.items.filter(item => hasPermission(item.permission));
    return filteredItems.length > 0;
  }).map(menu => ({
    ...menu,
    items: menu.items.filter(item => hasPermission(item.permission))
  }));

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:dark:bg-stone-800 lg:border-r lg:border-stone-200 lg:dark:border-stone-700">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex flex-col p-3 gap-4 w-full">
            <Link href="/home" className="flex items-center cursor-pointer ">
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
           <Link href="/home">
                <button
                    className="cursor-pointer px-4 py-2 w-full text-sm font-medium bg-stone-100 hover:bg-stone-200 text-stone-900 dark:text-stone-100 dark:bg-stone-700 dark:hover:bg-stone-600 transition-colors duration-200"
                    aria-label="Exit Dashboard"
                >
                    Exit Dashboard
                </button>
              </Link>

          </div>
                
          <div className="flex-1 flex flex-col pb-4 overflow-y-auto">
           
            <nav className="mb-5 flex-1 px-3 space-y-6 pt-4 py-12">
              
              {filteredMenuStructure.map((section) => (
                <div key={section.id} className="space-y-1">
                  <div className="px-2 py-2">
                    <div className="flex items-center text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                      <section.icon className="mr-2 h-4 w-4" />
                      {section.label}
                    </div>
                  </div>
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                          : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-stone-100'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 flex z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-gray-600 transition-opacity duration-300 ease-in-out ${
            isOpen ? 'opacity-75' : 'opacity-0'
          }`}
          onClick={onClose}
        />

        {/* Sidebar */}
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-stone-800 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          {/* Header */}
          <div className="flex flex-col p-3 gap-4 w-full border-b border-stone-200 dark:border-stone-700">
            <Link href="/home" className="flex items-center cursor-pointer" onClick={onClose}>
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
            <Link href="/home" onClick={onClose}>
              <button className="cursor-pointer px-4 py-2 w-full text-sm font-medium bg-stone-100 hover:bg-stone-200 text-stone-900 dark:text-stone-100 dark:bg-stone-700 dark:hover:bg-stone-600 transition-colors duration-200">
                Exit Dashboard
              </button>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <nav className="px-3 space-y-6">
              {filteredMenuStructure.map((section) => (
                <div key={section.id} className="space-y-1">
                  <div className="px-2 py-2">
                    <div className="flex items-center text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                      <section.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{section.label}</span>
                    </div>
                  </div>
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors ${
                        pathname === item.href
                          ? 'bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                          : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-stone-100'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
