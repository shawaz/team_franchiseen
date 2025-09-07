"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
// Removed CurrencyProvider - now using SolOnlyProvider
import ConvexClientProvider from "@/components/ConvexClientProvider";
import SolanaWalletProvider from "@/components/providers/SolanaWalletProvider";
import { ModalProvider } from "@/contexts/ModalContext";
import ModalManager from "@/components/modals/ModalManager";
import { SolOnlyProvider } from "@/contexts/SolOnlyContext";
import { GlobalCurrencyProvider } from "@/contexts/GlobalCurrencyContext";
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import PhantomConnectionHandler from "@/components/wallet/PhantomConnectionHandler";
import { Suspense } from 'react';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <GlobalCurrencyProvider>
          <SolanaWalletProvider>
            <SolOnlyProvider>
              <ModalProvider>
                <ConvexClientProvider>
                  <Suspense fallback={<FullScreenLoader />}>
                    {children}
                  </Suspense>
                  {/* Phantom Wallet Connection Handler */}
                  <PhantomConnectionHandler />
                  {/* Centralized Modal Manager */}
                  <ModalManager />
                </ConvexClientProvider>
              </ModalProvider>
            </SolOnlyProvider>
          </SolanaWalletProvider>
        </GlobalCurrencyProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}