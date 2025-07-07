"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { Suspense } from 'react';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <CurrencyProvider>
          <ConvexClientProvider>
            <Suspense fallback={<FullScreenLoader />}>
              {children}
            </Suspense>
          </ConvexClientProvider>
        </CurrencyProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
} 