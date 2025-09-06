import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Add a new financial transaction
export const addTransaction = mutation({
  args: {
    franchiseId: v.id("franchise"),
    type: v.string(), // "income" or "expense"
    category: v.string(),
    description: v.string(),
    amount: v.number(),
    currency: v.string(),
    transactionDate: v.number(),
    verificationMethod: v.optional(v.string()),
    receiptUrl: v.optional(v.string()),
    attachments: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
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

    const now = Date.now();

    // Create transaction record
    const transactionId = await ctx.db.insert("financialTransactions", {
      franchiseId: args.franchiseId,
      businessId: franchise.businessId,
      userId: user._id,
      
      type: args.type,
      category: args.category,
      description: args.description,
      amount: args.amount,
      currency: args.currency,
      
      transactionDate: args.transactionDate,
      recordedAt: now,
      
      isVerified: false, // Will be verified later
      verificationMethod: args.verificationMethod,
      
      receiptUrl: args.receiptUrl,
      attachments: args.attachments,
      
      status: "pending", // Requires approval
      
      tags: args.tags,
      notes: args.notes,
    });

    // Calculate FRC tokens to issue (if income transaction)
    if (args.type === "income") {
      // Get FRC token for this franchise
      const frcToken = await ctx.db
        .query("frcTokens")
        .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId))
        .unique();

      if (frcToken) {
        // Issue FRC tokens based on revenue (1 token per $100 revenue)
        const tokensToIssue = Math.floor(args.amount / 100);
        
        if (tokensToIssue > 0) {
          await ctx.db.patch(transactionId, {
            frcTokensIssued: tokensToIssue,
          });
        }
      }
    }

    return transactionId;
  },
});

// Get transactions for a franchise
export const getTransactions = query({
  args: {
    franchiseId: v.id("franchise"),
    type: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("financialTransactions")
      .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId));

    if (args.type) {
      query = query.filter((q) => q.eq(q.field("type"), args.type));
    }

    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    const transactions = await query
      .order("desc")
      .take(args.limit || 50);

    // Get user details for each transaction
    const transactionsWithUsers = await Promise.all(
      transactions.map(async (transaction) => {
        const user = await ctx.db.get(transaction.userId);
        return {
          ...transaction,
          user: user ? {
            _id: user._id,
            name: user.first_name && user.family_name ? `${user.first_name} ${user.family_name}` : user.email,
            imageUrl: user.avatar || "",
          } : null,
        };
      })
    );

    return transactionsWithUsers;
  },
});

// Approve or reject a transaction
export const updateTransactionStatus = mutation({
  args: {
    transactionId: v.id("financialTransactions"),
    status: v.string(), // "approved" or "rejected"
    rejectionReason: v.optional(v.string()),
    blockchainSignature: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();

    if (!user) throw new Error("User not found");

    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) throw new Error("Transaction not found");

    const now = Date.now();

    // Update transaction status
    await ctx.db.patch(args.transactionId, {
      status: args.status,
      approvedBy: user._id,
      approvedAt: now,
      rejectionReason: args.rejectionReason,
      blockchainSignature: args.blockchainSignature,
      isVerified: args.status === "approved",
    });

    // If approved and has FRC tokens, distribute them
    if (args.status === "approved" && transaction.frcTokensIssued && transaction.frcTokensIssued > 0) {
      // Get FRC token holders for this franchise
      const holders = await ctx.db
        .query("frcHolders")
        .withIndex("by_franchise", (q) => q.eq("franchiseId", transaction.franchiseId))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();

      if (holders.length > 0) {
        const tokensPerHolder = Math.floor(transaction.frcTokensIssued / holders.length);
        
        for (const holder of holders) {
          await ctx.db.patch(holder._id, {
            tokenBalance: holder.tokenBalance + tokensPerHolder,
            totalEarned: holder.totalEarned + tokensPerHolder,
            performanceTokens: holder.performanceTokens + tokensPerHolder,
            updatedAt: now,
          });
        }

        // Update FRC token supply
        const frcToken = await ctx.db
          .query("frcTokens")
          .withIndex("by_franchise", (q) => q.eq("franchiseId", transaction.franchiseId))
          .unique();

        if (frcToken) {
          await ctx.db.patch(frcToken._id, {
            circulatingSupply: frcToken.circulatingSupply + transaction.frcTokensIssued,
            reserveSupply: frcToken.reserveSupply - transaction.frcTokensIssued,
            updatedAt: now,
          });
        }
      }
    }

    return {
      success: true,
      status: args.status,
      tokensDistributed: transaction.frcTokensIssued || 0,
    };
  },
});

// Get financial summary for a franchise
export const getFinancialSummary = query({
  args: {
    franchiseId: v.id("franchise"),
    period: v.optional(v.string()), // "month", "quarter", "year", "all"
  },
  handler: async (ctx, args) => {
    const period = args.period || "month";
    let startDate = 0;

    const now = Date.now();
    switch (period) {
      case "month":
        startDate = now - (30 * 24 * 60 * 60 * 1000);
        break;
      case "quarter":
        startDate = now - (90 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        startDate = now - (365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = 0;
    }

    // Get approved transactions within the period
    const transactions = await ctx.db
      .query("financialTransactions")
      .withIndex("by_franchise_date", (q) => 
        q.eq("franchiseId", args.franchiseId).gte("transactionDate", startDate)
      )
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    // Calculate totals
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = income - expenses;

    // Category breakdown
    const incomeByCategory = transactions
      .filter(t => t.type === "income")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const expensesByCategory = transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // FRC tokens issued
    const totalFrcTokensIssued = transactions
      .reduce((sum, t) => sum + (t.frcTokensIssued || 0), 0);

    return {
      period,
      startDate,
      endDate: now,
      summary: {
        totalIncome: income,
        totalExpenses: expenses,
        netProfit,
        transactionCount: transactions.length,
        frcTokensIssued: totalFrcTokensIssued,
      },
      breakdown: {
        incomeByCategory,
        expensesByCategory,
      },
      recentTransactions: transactions
        .sort((a, b) => b.transactionDate - a.transactionDate)
        .slice(0, 10),
    };
  },
});

// Get transaction categories
export const getTransactionCategories = query({
  args: {},
  handler: async () => {
    return {
      income: [
        "sales",
        "services",
        "commissions",
        "royalties",
        "interest",
        "other_income",
      ],
      expense: [
        "rent",
        "utilities",
        "supplies",
        "equipment",
        "marketing",
        "salaries",
        "insurance",
        "maintenance",
        "taxes",
        "professional_services",
        "travel",
        "other_expenses",
      ],
    };
  },
});

// Bulk import transactions
export const bulkImportTransactions = mutation({
  args: {
    franchiseId: v.id("franchise"),
    transactions: v.array(v.object({
      type: v.string(),
      category: v.string(),
      description: v.string(),
      amount: v.number(),
      currency: v.string(),
      transactionDate: v.number(),
      verificationMethod: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
    })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .unique();

    if (!user) throw new Error("User not found");

    const franchise = await ctx.db.get(args.franchiseId);
    if (!franchise) throw new Error("Franchise not found");

    const now = Date.now();
    const createdTransactions = [];

    for (const transaction of args.transactions) {
      const transactionId = await ctx.db.insert("financialTransactions", {
        franchiseId: args.franchiseId,
        businessId: franchise.businessId,
        userId: user._id,
        
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        amount: transaction.amount,
        currency: transaction.currency,
        
        transactionDate: transaction.transactionDate,
        recordedAt: now,
        
        isVerified: false,
        verificationMethod: transaction.verificationMethod,
        
        status: "pending",
        tags: transaction.tags,
      });

      createdTransactions.push(transactionId);
    }

    return {
      success: true,
      transactionsCreated: createdTransactions.length,
      transactionIds: createdTransactions,
    };
  },
});
