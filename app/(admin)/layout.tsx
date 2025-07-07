import CompanyHeader from '@/components/CompanyHeader';
function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-stone-100 dark:bg-stone-900">
      <CompanyHeader />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[85px]'>
        {children}
      </div>
      {/* <Footer /> */}
    </main>
  ) 
}

export default PlatformLayout;