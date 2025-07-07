import Header from '@/components/Header';
import React from 'react'
import Footer from '@/components/Footer';

function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-stone-100 dark:bg-stone-900">
      <Header />
        <div className=' pt-[60px]'>
          {children}
        </div>
      <Footer />
    </main>
  ) 
}

export default MarketingLayout;