"use client"

import * as React from "react"
import {
  Archive,
  AudioWaveform,
  Banknote,
  Book,
  BookOpen,
  Bot,
  Building,
  Calendar,
  Car,
  Command,
  CreditCard,
  Factory,
  Frame,
  GalleryVerticalEnd,
  Laptop,
  LifeBuoy,
  Map,
  Newspaper,
  PieChart,
  Settings2,
  SquareTerminal,
  Tv,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { NavApp } from "./nav-app"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Administration",
      url: "/admin",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Plan",
          url: "/admin/plan",
        },
        {
          title: "Strategy",
          url: "/admin/strategy",
        },
        {
          title: "Activities",
          url: "/admin/activities",
        },
        {
          title: "Channels",
          url: "/admin/channels",
        },
        {
          title: "Partners",
          url: "/admin/partners",
        },
        {
          title: "Resources",
          url: "/admin/resources",
        },
        {
          title: "Relations",
          url: "/admin/relations",
        },
      ],
    },
    {
      title: "Operations",
      url: "/operations",
      icon: Factory,
      items: [
        {
          title: "Franchise",
          url: "/operations/franchise",
        },
        {
          title: "Properties",
          url: "/operations/properties",
        },
        {
          title: "Departments",
          url: "/operations/departments",
        },
        {
          title: "Area",
          url: "/operations/area",
        },
        {
          title: "Branch",
          url: "/operations/branch",
        },
        {
          title: "Office",
          url: "/operations/office",
        },
        {
          title: "Brands",
          url: "/operations/brands",
        },
      ],
    },
     {
      title: "Marketing",
      url: "/marketing",
      icon: Tv,
      items: [
        {
          title: "Market",
          url: "/marketing/market",
        },
        {
          title: "Campaign",
          url: "/marketing/campaign",
        },
        {
          title: "Content",
          url: "/marketing/content",
        },
      ],
    },
    {
      title: "Finance",
      url: "/finance",
      icon: CreditCard,
      items: [
        {
          title: "Transactions",
          url: "/finance/transactions",
        },
        {
          title: "Investors",
          url: "/finance/investors",
        },
        {
          title: "Invoices",
          url: "/finance/invoices",
        },
         {
          title: "Payee",
          url: "/finance/payee",
        },
        {
          title: "Wallets",
          url: "/finance/wallets",
        },
        {
          title: "Budgets",
          url: "/finance/budgets",
        },
        {
          title: "Shareholders",
          url: "/finance/shareholders",
        },
      ],
    },
    {
      title: "People",
      url: "/people",
      icon: Users,
      items: [
        {
          title: "Attendance",
          url: "/people/attendance",
        },
        {
          title: "Applications",
          url: "/people/applications",
        },
        {
          title: "Positions",
          url: "/people/positions",
        },
        {
          title: "Team",
          url: "/people/team",
        },
        {
          title: "Employees",
          url: "/people/employees",
        },
        {
          title: "Onboarding",
          url: "/people/onboarding",
        },
        {
          title: "Training",
          url: "/people/training",
        },
        {
          title: "Offboarding",
          url: "/people/offboarding",
        },
      ],
    },
   
    {
      title: "Sales",
      url: "/sales",
      icon: Banknote,
      items: [
        {
          title: "Leads",
          url: "/sales/leads",
        },
        {
          title: "Clients",
          url: "/sales/clients",
        },
        {
          title: "Competitors",
          url: "/sales/competitors",
        },
      ],
    },
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
      items: [
        {
          title: "Help Desk",
          url: "/support/help-desk",
        },
        {
          title: "Tickets",
          url: "/support/tickets",
        },
      ],
    },
    {
      title: "Software",
      url: "/software",
      icon: Laptop,
      items: [
        {
          title: "Features",
          url: "/software/features",
        },
        {
          title: "Bugs",
          url: "/software/bugs",
        },
        {
          title: "Database",
          url: "/software/databases",
        },
      ],
    },
    
  ],
  apps: [
    {
      name: "Franny",
      url: "/home",
      icon: Bot,
    },
    {
      name: "News",
      url: "/home/news",
      icon: Newspaper,
    },
    {
      name: "Events",
      url: "/home/events",
      icon: Calendar,
    },
    {
      name: "Travels",
      url: "/home/travels",
      icon: Car,
    },
    {
      name: "Docs",
      url: "/home/docs",
      icon: Archive,
    },
    {
      name: "Handbook",
      url: "/home/handbooks",
      icon: Book,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/home" className="flex items-center cursor-pointer p-3">
          <div className="flex items-center cursor-pointer">
            <Image
              src="/logo.svg"
              alt="logo"
              width={24}
              height={24}
              className="z-0"
            />
            <span className="text-lg ml-4 font-bold">FRANCHISEEN</span>
            
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavApp apps={data.apps} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
