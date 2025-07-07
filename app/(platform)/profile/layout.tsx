import ProfileSideNav from '@/components/franchisee/ProfileSideNav';
import React from 'react'

function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-[50px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <ProfileSideNav />
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessLayout;