import Header from '@/components/Header';
import React from 'react'
import Footer from '@/components/Footer';
import FooterMobile from '@/components/FooterMobile';

function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-stone-100 dark:bg-stone-900">
      <Header />
      <div className="max-w-7xl min-h-[calc(100vh-320px)] mx-auto px-4 sm:px-6 lg:px-8 pt-[60px] pb-20 md:pb-0">
        {children}
      </div>
      <FooterMobile />
      <Footer />
    </main>
  )
}

export default PlatformLayout;