import Header from '@/components/Header';
import React from 'react'
import Footer from '@/components/Footer';

function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-stone-100 dark:bg-stone-900">
      <Header />
        {children}
      <Footer />
    </main>
  ) 
}

export default PlatformLayout;