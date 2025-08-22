import { 
  Connection, 
  PublicKey, 
  SystemProgram, 
  SYSVAR_RENT_PUBKEY,
  Transaction,
  sendAndConfirmTransaction,
  Keypair
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createTransferInstruction,
  getAccount
} from '@solana/spl-token';
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { toast } from 'sonner';

export interface FranchiseTokenData {
  franchiseId: string;
  tokenMint: PublicKey;
  totalSupply: number;
  circulatingSupply: number;
  reserveFund: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  lastPayoutDate: number;
  shareholders: Array<{
    wallet: PublicKey;
    shares: number;
    percentage: number;
  }>;
}

export interface ExpenseRecord {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: number;
  approvedBy: PublicKey;
}

export interface IncomeRecord {
  id: string;
  amount: number;
  source: 'pos' | 'delivery' | 'catering' | 'other';
  date: number;
  recordedBy: PublicKey;
}

export class GillFranchiseToken {
  private connection: Connection;
  private provider: AnchorProvider;
  private program: Program;

  constructor(connection: Connection, provider: AnchorProvider, program: Program) {
    this.connection = connection;
    this.provider = provider;
    this.program = program;
  }

  // Create new franchise token
  async createFranchiseToken(
    franchiseId: string,
    totalShares: number,
    initialPrice: number
  ): Promise<{ tokenMint: PublicKey; signature: string }> {
    try {
      const [franchiseTokenMintPDA] = this.findFranchiseTokenMintPDA(franchiseId);
      const [franchiseVaultPDA] = this.findFranchiseVaultPDA(franchiseId);
      const [reserveFundPDA] = this.findReserveFundPDA(franchiseId);

      const tx = await this.program.methods
        .createFranchiseToken(
          franchiseId,
          new BN(totalShares),
          new BN(initialPrice * 1000000) // Convert to lamports
        )
        .accounts({
          franchiseTokenMint: franchiseTokenMintPDA,
          franchiseVault: franchiseVaultPDA,
          reserveFund: reserveFundPDA,
          owner: this.provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      toast.success('Franchise token created successfully!');
      return { tokenMint: franchiseTokenMintPDA, signature: tx };
    } catch (error) {
      console.error('Error creating franchise token:', error);
      toast.error('Failed to create franchise token');
      throw error;
    }
  }

  // Buy franchise shares
  async buyFranchiseShares(
    franchiseId: string,
    sharesToBuy: number,
    pricePerShare: number
  ): Promise<string> {
    try {
      const [franchiseTokenMintPDA] = this.findFranchiseTokenMintPDA(franchiseId);
      const [franchiseVaultPDA] = this.findFranchiseVaultPDA(franchiseId);
      
      // Get buyer's associated token account
      const buyerTokenAccount = await getAssociatedTokenAddress(
        franchiseTokenMintPDA,
        this.provider.wallet.publicKey
      );

      const totalCost = sharesToBuy * pricePerShare * 1000000; // Convert to lamports

      const tx = await this.program.methods
        .buyFranchiseShares(
          franchiseId,
          new BN(sharesToBuy),
          new BN(totalCost)
        )
        .accounts({
          franchiseTokenMint: franchiseTokenMintPDA,
          buyerTokenAccount: buyerTokenAccount,
          franchiseVault: franchiseVaultPDA,
          buyer: this.provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      toast.success(`Successfully purchased ${sharesToBuy} shares!`);
      return tx;
    } catch (error) {
      console.error('Error buying franchise shares:', error);
      toast.error('Failed to purchase shares');
      throw error;
    }
  }

  // Record franchise income
  async recordIncome(
    franchiseId: string,
    amount: number,
    source: 'pos' | 'delivery' | 'catering' | 'other',
    description: string
  ): Promise<string> {
    try {
      const [franchiseVaultPDA] = this.findFranchiseVaultPDA(franchiseId);
      const [incomeRecordPDA] = this.findIncomeRecordPDA(franchiseId, Date.now());

      const tx = await this.program.methods
        .recordIncome(
          franchiseId,
          new BN(amount * 1000000), // Convert to lamports
          source,
          description
        )
        .accounts({
          incomeRecord: incomeRecordPDA,
          franchiseVault: franchiseVaultPDA,
          recorder: this.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      toast.success('Income recorded successfully!');
      return tx;
    } catch (error) {
      console.error('Error recording income:', error);
      toast.error('Failed to record income');
      throw error;
    }
  }

  // Record franchise expense
  async recordExpense(
    franchiseId: string,
    amount: number,
    category: string,
    description: string
  ): Promise<string> {
    try {
      const [franchiseVaultPDA] = this.findFranchiseVaultPDA(franchiseId);
      const [expenseRecordPDA] = this.findExpenseRecordPDA(franchiseId, Date.now());

      const tx = await this.program.methods
        .recordExpense(
          franchiseId,
          new BN(amount * 1000000), // Convert to lamports
          category,
          description
        )
        .accounts({
          expenseRecord: expenseRecordPDA,
          franchiseVault: franchiseVaultPDA,
          recorder: this.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      toast.success('Expense recorded successfully!');
      return tx;
    } catch (error) {
      console.error('Error recording expense:', error);
      toast.error('Failed to record expense');
      throw error;
    }
  }

  // Process monthly payouts
  async processMonthlyPayouts(franchiseId: string): Promise<string> {
    try {
      const [franchiseVaultPDA] = this.findFranchiseVaultPDA(franchiseId);
      const [reserveFundPDA] = this.findReserveFundPDA(franchiseId);
      const [franchiseTokenMintPDA] = this.findFranchiseTokenMintPDA(franchiseId);

      const tx = await this.program.methods
        .processMonthlyPayouts(franchiseId)
        .accounts({
          franchiseTokenMint: franchiseTokenMintPDA,
          franchiseVault: franchiseVaultPDA,
          reserveFund: reserveFundPDA,
          processor: this.provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      toast.success('Monthly payouts processed successfully!');
      return tx;
    } catch (error) {
      console.error('Error processing monthly payouts:', error);
      toast.error('Failed to process monthly payouts');
      throw error;
    }
  }

  // Get franchise token data (mock implementation)
  async getFranchiseTokenData(franchiseId: string): Promise<FranchiseTokenData | null> {
    try {
      // Mock implementation - will be replaced with actual Solana program
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        franchiseId,
        tokenMint: new PublicKey("11111111111111111111111111111112"),
        totalSupply: 10000,
        circulatingSupply: 7500,
        reserveFund: 25000,
        monthlyRevenue: 15000,
        monthlyExpenses: 8000,
        lastPayoutDate: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
        shareholders: [
          {
            wallet: new PublicKey("11111111111111111111111111111112"),
            shares: 5000,
            percentage: 50
          },
          {
            wallet: new PublicKey("11111111111111111111111111111113"),
            shares: 2500,
            percentage: 25
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching franchise token data:', error);
      return null;
    }
  }

  // Helper methods for PDA derivation
  private findFranchiseTokenMintPDA(franchiseId: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("franchise_token"), Buffer.from(franchiseId)],
      this.program.programId
    );
  }

  private findFranchiseVaultPDA(franchiseId: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("franchise_vault"), Buffer.from(franchiseId)],
      this.program.programId
    );
  }

  private findReserveFundPDA(franchiseId: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("reserve_fund"), Buffer.from(franchiseId)],
      this.program.programId
    );
  }

  private findIncomeRecordPDA(franchiseId: string, timestamp: number): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("income_record"), Buffer.from(franchiseId), Buffer.from(timestamp.toString())],
      this.program.programId
    );
  }

  private findExpenseRecordPDA(franchiseId: string, timestamp: number): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("expense_record"), Buffer.from(franchiseId), Buffer.from(timestamp.toString())],
      this.program.programId
    );
  }
}
