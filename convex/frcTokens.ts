import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create FRC token for a franchise
export const createFranchiseToken = mutation({
  args: {
    franchiseId: v.id("franchise"),
    tokenMint: v.string(),
    tokenSymbol: v.string(),
    tokenName: v.string(),
    totalSupply: v.number(),
    contractAddress: v.optional(v.string()),
    creationSignature: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();

    if (!user) throw new Error("User not found");

    // Get franchise details
    const franchise = await ctx.db.get(args.franchiseId);
    if (!franchise) throw new Error("Franchise not found");

    // Check if token already exists for this franchise
    const existingToken = await ctx.db
      .query("frcTokens")
      .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId))
      .unique();

    if (existingToken) {
      throw new Error("FRC token already exists for this franchise");
    }

    const now = Date.now();

    // Create FRC token record
    const tokenId = await ctx.db.insert("frcTokens", {
      franchiseId: args.franchiseId,
      businessId: franchise.businessId,
      tokenMint: args.tokenMint,
      tokenSymbol: args.tokenSymbol,
      tokenName: args.tokenName,
      totalSupply: args.totalSupply,
      circulatingSupply: 0,
      reserveSupply: args.totalSupply,
      
      // Initialize financial metrics
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      monthlyRevenue: 0,
      monthlyExpenses: 0,
      
      // Initialize token economics
      tokenPrice: 1.0, // Start at $1 per token
      marketCap: args.totalSupply,
      lastPayoutAmount: 0,
      
      // Blockchain data
      contractAddress: args.contractAddress,
      creationSignature: args.creationSignature,
      
      // Status
      status: "active",
      createdAt: now,
      updatedAt: now,
      createdBy: user._id,
    });

    // Create initial token holder records for franchise investors
    const shares = await ctx.db
      .query("shares")
      .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId))
      .collect();

    for (const share of shares) {
      // Calculate FRC tokens based on investment percentage
      const investmentPercentage = (share.numberOfShares * share.costPerShare) / franchise.totalInvestment;
      const frcTokens = Math.floor(args.totalSupply * investmentPercentage);

      await ctx.db.insert("frcHolders", {
        franchiseId: args.franchiseId,
        userId: share.userId,
        walletAddress: "", // Wallet address not stored in shares table
        
        tokenBalance: frcTokens,
        totalEarned: frcTokens,
        totalRedeemed: 0,
        
        investmentTokens: frcTokens,
        performanceTokens: 0,
        bonusTokens: 0,
        
        totalPayouts: 0,
        lastPayoutAmount: 0,
        
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    return tokenId;
  },
});

// Get FRC token data for a franchise
export const getFranchiseToken = query({
  args: { franchiseId: v.id("franchise") },
  handler: async (ctx, args) => {
    const token = await ctx.db
      .query("frcTokens")
      .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId))
      .unique();

    if (!token) return null;

    // Get token holders
    const holders = await ctx.db
      .query("frcHolders")
      .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId))
      .collect();

    // Get recent financial transactions
    const recentTransactions = await ctx.db
      .query("financialTransactions")
      .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId))
      .order("desc")
      .take(10);

    // Calculate metrics
    const totalHolders = holders.length;
    const activeHolders = holders.filter(h => h.isActive).length;
    const totalTokensHeld = holders.reduce((sum, h) => sum + h.tokenBalance, 0);

    return {
      ...token,
      holders: {
        total: totalHolders,
        active: activeHolders,
        totalTokensHeld,
        list: holders,
      },
      recentTransactions,
    };
  },
});

// Update FRC token financial metrics
export const updateTokenFinancials = mutation({
  args: {
    franchiseId: v.id("franchise"),
    monthlyRevenue: v.number(),
    monthlyExpenses: v.number(),
    blockchainSignature: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const token = await ctx.db
      .query("frcTokens")
      .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId))
      .unique();

    if (!token) throw new Error("FRC token not found");

    const now = Date.now();
    const netProfit = args.monthlyRevenue - args.monthlyExpenses;

    // Update token financials
    await ctx.db.patch(token._id, {
      totalRevenue: token.totalRevenue + args.monthlyRevenue,
      totalExpenses: token.totalExpenses + args.monthlyExpenses,
      netProfit: token.netProfit + netProfit,
      monthlyRevenue: args.monthlyRevenue,
      monthlyExpenses: args.monthlyExpenses,
      lastUpdateSignature: args.blockchainSignature,
      updatedAt: now,
    });

    // Calculate new token price based on performance
    const performanceMultiplier = netProfit > 0 ? 1 + (netProfit / token.totalRevenue) : 0.95;
    const newTokenPrice = Math.max(0.1, token.tokenPrice * performanceMultiplier);

    await ctx.db.patch(token._id, {
      tokenPrice: newTokenPrice,
      marketCap: newTokenPrice * token.totalSupply,
    });

    return {
      success: true,
      newTokenPrice,
      netProfit,
      performanceMultiplier,
    };
  },
});

// Distribute FRC tokens to holders based on performance
export const distributePerformanceTokens = mutation({
  args: {
    franchiseId: v.id("franchise"),
    totalTokensToDistribute: v.number(),
    distributionReason: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const token = await ctx.db
      .query("frcTokens")
      .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId))
      .unique();

    if (!token) throw new Error("FRC token not found");

    const holders = await ctx.db
      .query("frcHolders")
      .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    if (holders.length === 0) return { success: false, message: "No active holders found" };

    const totalCurrentTokens = holders.reduce((sum, h) => sum + h.tokenBalance, 0);
    const now = Date.now();

    // Distribute tokens proportionally to current holdings
    for (const holder of holders) {
      const proportion = holder.tokenBalance / totalCurrentTokens;
      const tokensToAdd = Math.floor(args.totalTokensToDistribute * proportion);

      if (tokensToAdd > 0) {
        await ctx.db.patch(holder._id, {
          tokenBalance: holder.tokenBalance + tokensToAdd,
          totalEarned: holder.totalEarned + tokensToAdd,
          performanceTokens: holder.performanceTokens + tokensToAdd,
          updatedAt: now,
        });
      }
    }

    // Update token supply
    await ctx.db.patch(token._id, {
      circulatingSupply: token.circulatingSupply + args.totalTokensToDistribute,
      reserveSupply: token.reserveSupply - args.totalTokensToDistribute,
      updatedAt: now,
    });

    return {
      success: true,
      tokensDistributed: args.totalTokensToDistribute,
      holdersUpdated: holders.length,
    };
  },
});

// Get FRC token analytics
export const getTokenAnalytics = query({
  args: { franchiseId: v.id("franchise") },
  handler: async (ctx, args) => {
    const token = await ctx.db
      .query("frcTokens")
      .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId))
      .unique();

    if (!token) return null;

    // Get financial transactions for the last 12 months
    const twelveMonthsAgo = Date.now() - (12 * 30 * 24 * 60 * 60 * 1000);
    const transactions = await ctx.db
      .query("financialTransactions")
      .withIndex("by_franchise_date", (q) => 
        q.eq("franchiseId", args.franchiseId).gte("transactionDate", twelveMonthsAgo)
      )
      .collect();

    // Calculate monthly performance
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = Date.now() - (i * 30 * 24 * 60 * 60 * 1000);
      const monthEnd = Date.now() - ((i - 1) * 30 * 24 * 60 * 60 * 1000);
      
      const monthTransactions = transactions.filter(t => 
        t.transactionDate >= monthStart && t.transactionDate < monthEnd
      );

      const revenue = monthTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month: new Date(monthStart).toISOString().slice(0, 7), // YYYY-MM format
        revenue,
        expenses,
        profit: revenue - expenses,
        transactionCount: monthTransactions.length,
      });
    }

    return {
      token,
      monthlyPerformance: monthlyData,
      totalTransactions: transactions.length,
      averageMonthlyRevenue: monthlyData.reduce((sum, m) => sum + m.revenue, 0) / 12,
      averageMonthlyExpenses: monthlyData.reduce((sum, m) => sum + m.expenses, 0) / 12,
      averageMonthlyProfit: monthlyData.reduce((sum, m) => sum + m.profit, 0) / 12,
    };
  },
});
