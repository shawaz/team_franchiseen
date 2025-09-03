import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AnchorProvider } from '@coral-xyz/anchor';
import { useMemo, useCallback } from 'react';
import { FranchiseProgram, createFranchiseProgram, FranchiseAccount, BusinessAccount } from '@/lib/anchor/franchise-program';
import { PublicKey } from '@solana/web3.js';
import { toast } from 'sonner';

export function useFranchiseProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction || !connection) {
      return null;
    }

    try {
      return new AnchorProvider(
        connection,
        {
          publicKey: wallet.publicKey,
          signTransaction: wallet.signTransaction,
          signAllTransactions: wallet.signAllTransactions || (async (txs) => {
            const signedTxs = [];
            for (const tx of txs) {
              signedTxs.push(await wallet.signTransaction!(tx));
            }
            return signedTxs;
          }),
        },
        { commitment: 'confirmed' }
      );
    } catch (error) {
      console.error('Error creating AnchorProvider:', error);
      return null;
    }
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;

    try {
      console.log('Attempting to create franchise program...');
      const franchiseProgram = createFranchiseProgram(provider);

      if (!franchiseProgram) {
        console.warn('Franchise program creation returned null - blockchain features will be disabled');
        return null;
      }

      console.log('Franchise program created successfully');
      return franchiseProgram;
    } catch (error) {
      console.error('Error creating franchise program:', error);
      console.warn('Blockchain features will be disabled due to program initialization failure');
      return null;
    }
  }, [provider]);

  // Initialize platform (admin only)
  const initializePlatform = useCallback(async (platformFeeBps: number) => {
    if (!program) {
      toast.error('Blockchain program not available. Please check your wallet connection.');
      return null;
    }

    try {
      const tx = await program.initializePlatform(platformFeeBps);
      toast.success('Platform initialized successfully');
      return tx;
    } catch (error) {
      console.error('Error initializing platform:', error);
      toast.error('Failed to initialize platform');
      return null;
    }
  }, [program]);

  // Create business
  const createBusiness = useCallback(async (
    name: string,
    slug: string,
    industry: string,
    category: string
  ) => {
    if (!program) {
      toast.error('Wallet not connected');
      return null;
    }

    try {
      const tx = await program.createBusiness(name, slug, industry, category);
      toast.success('Business created successfully');
      return tx;
    } catch (error) {
      console.error('Error creating business:', error);
      toast.error('Failed to create business');
      return null;
    }
  }, [program]);

  // Create franchise
  const createFranchise = useCallback(async (
    businessSlug: string,
    franchiseSlug: string,
    locationAddress: string,
    buildingName: string,
    carpetArea: number,
    costPerArea: number,
    totalShares: number
  ) => {
    if (!program) {
      toast.error('Wallet not connected');
      return null;
    }

    try {
      const tx = await program.createFranchise(
        businessSlug,
        franchiseSlug,
        locationAddress,
        buildingName,
        carpetArea,
        costPerArea,
        totalShares
      );
      toast.success('Franchise created successfully');
      return tx;
    } catch (error) {
      console.error('Error creating franchise:', error);
      toast.error('Failed to create franchise');
      return null;
    }
  }, [program]);

  // Invest in franchise
  const investInFranchise = useCallback(async (
    businessSlug: string,
    franchiseSlug: string,
    sharesToBuy: number
  ) => {
    if (!program) {
      toast.error('Wallet not connected');
      return null;
    }

    try {
      const tx = await program.investInFranchise(businessSlug, franchiseSlug, sharesToBuy);
      toast.success('Investment successful');
      return tx;
    } catch (error) {
      console.error('Error investing in franchise:', error);
      toast.error('Failed to invest in franchise');
      return null;
    }
  }, [program]);

  // Distribute revenue
  const distributeRevenue = useCallback(async (
    businessSlug: string,
    franchiseSlug: string,
    totalRevenue: number
  ) => {
    if (!program) {
      toast.error('Wallet not connected');
      return null;
    }

    try {
      const tx = await program.distributeRevenue(businessSlug, franchiseSlug, totalRevenue);
      toast.success('Revenue distributed successfully');
      return tx;
    } catch (error) {
      console.error('Error distributing revenue:', error);
      toast.error('Failed to distribute revenue');
      return null;
    }
  }, [program]);

  // Claim dividends
  const claimDividends = useCallback(async (
    businessSlug: string,
    franchiseSlug: string
  ) => {
    if (!program) {
      toast.error('Wallet not connected');
      return null;
    }

    try {
      const tx = await program.claimDividends(businessSlug, franchiseSlug);
      toast.success('Dividends claimed successfully');
      return tx;
    } catch (error) {
      console.error('Error claiming dividends:', error);
      toast.error('Failed to claim dividends');
      return null;
    }
  }, [program]);

  // Get franchise data
  const getFranchise = useCallback(async (
    businessSlug: string,
    franchiseSlug: string
  ): Promise<FranchiseAccount | null> => {
    if (!program) return null;

    try {
      return await program.getFranchise(businessSlug, franchiseSlug);
    } catch (error) {
      console.error('Error fetching franchise:', error);
      return null;
    }
  }, [program]);

  // Get business data
  const getBusiness = useCallback(async (
    businessSlug: string
  ): Promise<BusinessAccount | null> => {
    if (!program) return null;

    try {
      return await program.getBusiness(businessSlug);
    } catch (error) {
      console.error('Error fetching business:', error);
      return null;
    }
  }, [program]);

  // Get investor token balance
  const getInvestorTokenBalance = useCallback(async (
    businessSlug: string,
    franchiseSlug: string,
    investorPubkey?: PublicKey
  ): Promise<number> => {
    if (!program) return 0;

    const pubkey = investorPubkey || wallet.publicKey;
    if (!pubkey) return 0;

    try {
      return await program.getInvestorTokenBalance(businessSlug, franchiseSlug, pubkey);
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return 0;
    }
  }, [program, wallet.publicKey]);

  // Get platform data
  const getPlatform = useCallback(async () => {
    if (!program) return null;

    try {
      return await program.getPlatform();
    } catch (error) {
      console.error('Error fetching platform:', error);
      return null;
    }
  }, [program]);

  return {
    program,
    connected: !!program,
    
    // Actions
    initializePlatform,
    createBusiness,
    createFranchise,
    investInFranchise,
    distributeRevenue,
    claimDividends,
    
    // Queries
    getFranchise,
    getBusiness,
    getInvestorTokenBalance,
    getPlatform,
    
    // Helper functions
    findBusinessPDA: FranchiseProgram.findBusinessPDA,
    findFranchisePDA: FranchiseProgram.findFranchisePDA,
    findFranchiseTokenMintPDA: FranchiseProgram.findFranchiseTokenMintPDA,
  };
}
