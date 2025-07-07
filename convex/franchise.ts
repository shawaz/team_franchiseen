import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";
import { api } from "./_generated/api";

export const create = mutation({
  args: {
    businessId: v.id("businesses"),
    locationAddress: v.string(),
    building: v.string(),
    carpetArea: v.number(),
    costPerArea: v.number(),
    totalInvestment: v.number(),
    totalShares: v.number(),
    selectedShares: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (!identity.email) {
      throw new Error("User email is required");
    }

    // Get or create user
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email as string))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const franchiseId = await ctx.db.insert("franchise", {
      ...args,
      selectedShares: 0,
      owner_id: user._id,
      createdAt: Date.now(),
      status: "Pending Approval",
    });

    // Remove automatic share allocation here. Shares will be allocated after payment.

    return franchiseId;
  },
});

export const createInvoice = mutation({
  args: {
    franchiseId: v.id("franchise"),
    serviceFee: v.number(),
    gst: v.number(),
    totalAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (!identity.email) {
      throw new Error("User email is required");
    }

    // Get or create user
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email as string))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const invoiceId = await ctx.db.insert("invoice", {
      ...args,
      userId: user._id,
      createdAt: Date.now(),
    });

    return invoiceId;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("franchise").collect();
  },
});

export const getById = query({
  args: { franchiseId: v.id("franchise") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.franchiseId);
  },
});

export const updateStatus = mutation({
  args: { franchiseId: v.id("franchise"), status: v.string() },
  handler: async (ctx, args) => {
    if (args.status === "Launching") {
      const now = Date.now();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      await ctx.db.patch(args.franchiseId, {
        status: args.status,
        launchStartDate: now,
        launchEndDate: now + thirtyDays,
      });
    } else {
    await ctx.db.patch(args.franchiseId, { status: args.status });
    }
    return true;
  },
});

export const getStatusCountsByBusiness = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const franchises = await ctx.db
      .query("franchise")
      .filter((q) => q.eq(q.field("businessId"), args.businessId))
      .collect();

    // Count by status
    const counts = { Funding: 0, Launching: 0, Active: 0 };
    for (const franchise of franchises) {
      if (franchise.status === "Funding") counts.Funding++;
      else if (franchise.status === "Launching") counts.Launching++;
      else if (franchise.status === "Active") counts.Active++;
    }
    return counts;
  },
});

export const getTotalAvailableSharesByBusiness = query({
  args: { businessId: v.id("businesses") },
  returns: v.number(),
  handler: async (ctx, args) => {
    const franchises = await ctx.db
      .query("franchise")
      .filter((q) => q.eq(q.field("businessId"), args.businessId))
      .collect();
    let totalAvailable = 0;
    for (const franchise of franchises) {
      const available = (franchise.totalShares || 0) - (franchise.selectedShares || 0);
      totalAvailable += available;
    }
    return totalAvailable;
  },
});

export const getTotalSharesByBusiness = query({
  args: { businessId: v.id("businesses") },
  returns: v.number(),
  handler: async (ctx, args) => {
    const franchises = await ctx.db
      .query("franchise")
      .filter((q) => q.eq(q.field("businessId"), args.businessId))
      .collect();
    return franchises.reduce((sum, f) => sum + (f.totalShares || 0), 0);
  },
});

export const listInvoicesByBusiness = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    // Get all franchises for the business
    const franchises = await ctx.db
      .query("franchise")
      .filter((q) => q.eq(q.field("businessId"), args.businessId))
      .collect();
    const franchiseIds = franchises.map((f) => f._id);
    if (franchiseIds.length === 0) return [];
    // Get all invoices for these franchises
    const invoices = await ctx.db
      .query("invoice")
      .filter((q) => q.or(...franchiseIds.map(id => q.eq(q.field("franchiseId"), id))))
      .order("desc")
      .collect();
    return invoices;
  },
});

export const getAvailableSharesForCrowdfunding = query({
  args: { businessId: v.id("businesses") },
  returns: v.number(),
  handler: async (ctx, args) => {
    const franchises = await ctx.db
      .query("franchise")
      .filter((q) => q.eq(q.field("businessId"), args.businessId))
      .filter((q) => q.eq(q.field("status"), "Funding"))
      .collect();
    let totalAvailable = 0;
    for (const franchise of franchises) {
      const available = (franchise.totalShares || 0) - (franchise.selectedShares || 0);
      totalAvailable += available;
    }
    return totalAvailable;
  },
});

export const getTotalIssuedSharesByBusiness = query({
  args: { businessId: v.id("businesses") },
  returns: v.number(),
  handler: async (ctx, args) => {
    const issuedStatuses = ["Funding", "Launching", "Active"];
    const franchises = await ctx.db
      .query("franchise")
      .filter((q) => q.eq(q.field("businessId"), args.businessId))
      .collect();
    return franchises
      .filter((f) => issuedStatuses.includes(f.status))
      .reduce((sum, f) => sum + (f.selectedShares || 0), 0);
  },
});

export const getSharesStatsByBusiness = query({
  args: { businessId: v.id("businesses") },
  returns: v.object({
    totalShares: v.number(),
    issuedShares: v.number(),
  }),
  handler: async (ctx, args) => {
    const statuses = ["Funding", "Launching", "Active"];
    const franchises = await ctx.db
      .query("franchise")
      .filter((q) => q.eq(q.field("businessId"), args.businessId))
      .collect();
    const filtered = franchises.filter((f) => statuses.includes(f.status));
    const totalShares = filtered.reduce((sum, f) => sum + (f.totalShares || 0), 0);
    const issuedShares = filtered.reduce((sum, f) => sum + (f.selectedShares || 0), 0);
    return { totalShares, issuedShares };
  },
}); 