import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create or update franchise operations data
export const createOrUpdate = mutation({
  args: {
    franchiseId: v.id("franchise"),
    operationalStatus: v.optional(v.union(
      v.literal("setup"), 
      v.literal("training"), 
      v.literal("operational"), 
      v.literal("maintenance"), 
      v.literal("suspended")
    )),
    complianceScore: v.optional(v.number()),
    lastInspection: v.optional(v.number()),
    nextInspectionDue: v.optional(v.number()),
    supportTickets: v.optional(v.number()),
    performanceMetrics: v.optional(v.object({
      monthlyRevenue: v.number(),
      monthlyExpenses: v.number(),
      customerSatisfaction: v.number(),
      staffCount: v.number(),
      operationalEfficiency: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) throw new Error("Not authenticated");

    // Check if franchise exists
    const franchise = await ctx.db.get(args.franchiseId);
    if (!franchise) throw new Error("Franchise not found");

    // Check if operations record already exists
    const existing = await ctx.db
      .query("franchiseOperations")
      .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId))
      .unique();

    const now = Date.now();
    const operationsData = {
      franchiseId: args.franchiseId,
      operationalStatus: args.operationalStatus || "setup",
      complianceScore: args.complianceScore || 0,
      lastInspection: args.lastInspection,
      nextInspectionDue: args.nextInspectionDue,
      supportTickets: args.supportTickets || 0,
      performanceMetrics: args.performanceMetrics || {
        monthlyRevenue: 0,
        monthlyExpenses: 0,
        customerSatisfaction: 0,
        staffCount: 0,
        operationalEfficiency: 0,
      },
      certifications: existing?.certifications || [],
      inspectionHistory: existing?.inspectionHistory || [],
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, operationsData);
      return existing._id;
    } else {
      return await ctx.db.insert("franchiseOperations", {
        ...operationsData,
        createdAt: now,
      });
    }
  },
});

// Get franchise operations data
export const getByFranchiseId = query({
  args: { franchiseId: v.id("franchise") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("franchiseOperations")
      .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId))
      .unique();
  },
});

// Get all franchise operations with franchise details
export const listWithFranchiseDetails = query({
  args: {
    limit: v.optional(v.number()),
    operationalStatus: v.optional(v.string()),
    complianceScoreMin: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let operations;

    if (args.operationalStatus) {
      operations = await ctx.db
        .query("franchiseOperations")
        .withIndex("by_operational_status", (q) =>
          q.eq("operationalStatus", args.operationalStatus as any)
        )
        .collect();
    } else {
      operations = await ctx.db.query("franchiseOperations").collect();
    }

    // Filter by compliance score if provided
    if (args.complianceScoreMin !== undefined) {
      operations = operations.filter(op => op.complianceScore >= args.complianceScoreMin!);
    }

    // Limit results
    if (args.limit) {
      operations = operations.slice(0, args.limit);
    }

    // Get franchise details for each operation
    const results = await Promise.all(
      operations.map(async (operation) => {
        const franchise = await ctx.db.get(operation.franchiseId);
        const business = franchise ? await ctx.db.get(franchise.businessId) : null;
        
        return {
          ...operation,
          franchise,
          business,
        };
      })
    );

    return results.filter(result => result.franchise && result.business);
  },
});

// Update performance metrics
export const updatePerformanceMetrics = mutation({
  args: {
    franchiseId: v.id("franchise"),
    monthlyRevenue: v.number(),
    monthlyExpenses: v.number(),
    customerSatisfaction: v.number(),
    staffCount: v.number(),
    operationalEfficiency: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) throw new Error("Not authenticated");

    const operations = await ctx.db
      .query("franchiseOperations")
      .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId))
      .unique();

    if (!operations) {
      throw new Error("Franchise operations not found");
    }

    await ctx.db.patch(operations._id, {
      performanceMetrics: {
        monthlyRevenue: args.monthlyRevenue,
        monthlyExpenses: args.monthlyExpenses,
        customerSatisfaction: args.customerSatisfaction,
        staffCount: args.staffCount,
        operationalEfficiency: args.operationalEfficiency,
      },
      updatedAt: Date.now(),
    });

    return operations._id;
  },
});

// Add inspection record
export const addInspection = mutation({
  args: {
    franchiseId: v.id("franchise"),
    inspector: v.string(),
    score: v.number(),
    notes: v.string(),
    issues: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) throw new Error("Not authenticated");

    const operations = await ctx.db
      .query("franchiseOperations")
      .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId))
      .unique();

    if (!operations) {
      throw new Error("Franchise operations not found");
    }

    const newInspection = {
      date: Date.now(),
      inspector: args.inspector,
      score: args.score,
      notes: args.notes,
      issues: args.issues,
    };

    const updatedHistory = [...operations.inspectionHistory, newInspection];

    await ctx.db.patch(operations._id, {
      inspectionHistory: updatedHistory,
      lastInspection: Date.now(),
      complianceScore: args.score, // Update compliance score with latest inspection
      updatedAt: Date.now(),
    });

    return operations._id;
  },
});

// Update operational status
export const updateOperationalStatus = mutation({
  args: {
    franchiseId: v.id("franchise"),
    operationalStatus: v.union(
      v.literal("setup"), 
      v.literal("training"), 
      v.literal("operational"), 
      v.literal("maintenance"), 
      v.literal("suspended")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) throw new Error("Not authenticated");

    const operations = await ctx.db
      .query("franchiseOperations")
      .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId))
      .unique();

    if (!operations) {
      throw new Error("Franchise operations not found");
    }

    await ctx.db.patch(operations._id, {
      operationalStatus: args.operationalStatus,
      updatedAt: Date.now(),
    });

    // Log the status change in audit log
    await ctx.db.insert("auditLog", {
      userId: (await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), identity.email!))
        .unique())!._id,
      action: "update",
      section: "franchise_operations",
      entityType: "franchise",
      entityId: args.franchiseId,
      changes: {
        operationalStatus: {
          from: operations.operationalStatus,
          to: args.operationalStatus,
        },
        notes: args.notes,
      },
      timestamp: Date.now(),
    });

    return operations._id;
  },
});

// Get franchise operations statistics
export const getStatistics = query({
  args: {},
  handler: async (ctx) => {
    const operations = await ctx.db.query("franchiseOperations").collect();
    
    const stats = {
      total: operations.length,
      byStatus: {} as Record<string, number>,
      averageComplianceScore: 0,
      totalRevenue: 0,
      totalExpenses: 0,
      averageCustomerSatisfaction: 0,
      totalStaff: 0,
      upcomingInspections: 0,
    };

    let totalCompliance = 0;
    let totalCustomerSat = 0;
    const now = Date.now();
    const thirtyDaysFromNow = now + (30 * 24 * 60 * 60 * 1000);

    operations.forEach(op => {
      // Count by status
      stats.byStatus[op.operationalStatus] = (stats.byStatus[op.operationalStatus] || 0) + 1;
      
      // Sum metrics
      totalCompliance += op.complianceScore;
      stats.totalRevenue += op.performanceMetrics.monthlyRevenue;
      stats.totalExpenses += op.performanceMetrics.monthlyExpenses;
      totalCustomerSat += op.performanceMetrics.customerSatisfaction;
      stats.totalStaff += op.performanceMetrics.staffCount;
      
      // Count upcoming inspections
      if (op.nextInspectionDue && op.nextInspectionDue <= thirtyDaysFromNow) {
        stats.upcomingInspections++;
      }
    });

    if (operations.length > 0) {
      stats.averageComplianceScore = totalCompliance / operations.length;
      stats.averageCustomerSatisfaction = totalCustomerSat / operations.length;
    }

    return stats;
  },
});
