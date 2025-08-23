import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";
import { api } from "./_generated/api";

// Helper function to generate slug from building name and location
function generateFranchiseSlug(building: string, locationAddress: string): string {
  const combined = `${building} ${locationAddress}`;
  return combined
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

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
    slug: v.optional(v.string()),
  },
  returns: v.object({
    franchiseId: v.id("franchise"),
    slug: v.string(),
  }),
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
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Generate slug if not provided
    let slug = args.slug || generateFranchiseSlug(args.building, args.locationAddress);

    // Ensure slug is unique
    let counter = 1;
    let originalSlug = slug;
    while (true) {
      const existingFranchise = await ctx.db
        .query("franchise")
        .filter((q) => q.eq(q.field("slug"), slug))
        .unique();

      if (!existingFranchise) break;

      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    const franchiseId = await ctx.db.insert("franchise", {
      ...args,
      slug: slug,
      selectedShares: 0,
      owner_id: user._id,
      createdAt: Date.now(),
      status: "Pending Approval",
    });

    // Remove automatic share allocation here. Shares will be allocated after payment.

    return { franchiseId, slug };
  },
});

export const getBySlug = query({
  args: {
    businessSlug: v.string(),
    franchiseSlug: v.string(),
  },
  handler: async (ctx, args) => {
    // First get business by slug
    const business = await ctx.db
      .query("businesses")
      .filter((q) => q.eq(q.field("slug"), args.businessSlug))
      .unique();

    if (!business) return null;

    // Then get franchise by slug within that business
    const franchise = await ctx.db
      .query("franchise")
      .filter((q) =>
        q.and(
          q.eq(q.field("businessId"), business._id),
          q.eq(q.field("slug"), args.franchiseSlug)
        )
      )
      .unique();

    return franchise;
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
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
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

export const updateSlug = mutation({
  args: {
    franchiseId: v.id("franchise"),
    newSlug: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const franchise = await ctx.db.get(args.franchiseId);
    if (!franchise) {
      throw new Error("Franchise not found");
    }

    // Generate new slug if not provided
    let slug = args.newSlug || generateFranchiseSlug(franchise.building, franchise.locationAddress);

    // Ensure slug is unique
    let counter = 1;
    let originalSlug = slug;
    while (true) {
      const existingFranchise = await ctx.db
        .query("franchise")
        .filter((q) =>
          q.and(
            q.eq(q.field("slug"), slug),
            q.neq(q.field("_id"), args.franchiseId)
          )
        )
        .unique();

      if (!existingFranchise) break;

      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    await ctx.db.patch(args.franchiseId, { slug });
    return slug;
  },
});

export const listByBusiness = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("franchise")
      .filter((q) => q.eq(q.field("businessId"), args.businessId))
      .collect();
  },
});

// Get franchises by business with location data for map display
export const getLocationsByBusiness = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const franchises = await ctx.db
      .query("franchise")
      .filter((q) => q.eq(q.field("businessId"), args.businessId))
      .filter((q) => q.neq(q.field("status"), "Rejected"))
      .collect();

    return franchises.map(franchise => ({
      _id: franchise._id,
      slug: franchise.slug,
      locationAddress: franchise.locationAddress,
      building: franchise.building,
      status: franchise.status,
      totalShares: franchise.totalShares,
      selectedShares: franchise.selectedShares,
      createdAt: franchise.createdAt,
    }));
  },
});

// Get pending franchise proposals for approval
export const getPendingByBusiness = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("franchise")
      .filter((q) =>
        q.and(
          q.eq(q.field("businessId"), args.businessId),
          q.or(
            q.eq(q.field("status"), "Pending Approval"),
            q.eq(q.field("status"), "Under Review")
          )
        )
      )
      .collect();
  },
});

// Approve a franchise proposal and create token
export const approveFranchise = mutation({
  args: {
    franchiseId: v.id("franchise"),
    tokenMint: v.string(),
    transactionSignature: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the franchise
    const franchise = await ctx.db.get(args.franchiseId);
    if (!franchise) {
      throw new Error("Franchise not found");
    }

    // Get the business to verify ownership
    const business = await ctx.db.get(franchise.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    // Get the current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .unique();

    if (!user || business.owner_id !== user._id) {
      throw new Error("Not authorized to approve this franchise");
    }

    // Update franchise status and add token information
    await ctx.db.patch(args.franchiseId, {
      status: "Approved",
      tokenMint: args.tokenMint,
      transactionSignature: args.transactionSignature,
      approvedAt: Date.now(),
      approvedBy: user._id,
    });

    return { success: true };
  },
});

// Reject a franchise proposal
export const rejectFranchise = mutation({
  args: {
    franchiseId: v.id("franchise"),
    rejectionReason: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the franchise
    const franchise = await ctx.db.get(args.franchiseId);
    if (!franchise) {
      throw new Error("Franchise not found");
    }

    // Get the business to verify ownership
    const business = await ctx.db.get(franchise.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    // Get the current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .unique();

    if (!user || business.owner_id !== user._id) {
      throw new Error("Not authorized to reject this franchise");
    }

    // Update franchise status
    await ctx.db.patch(args.franchiseId, {
      status: "Rejected",
      rejectionReason: args.rejectionReason,
      rejectedAt: Date.now(),
      rejectedBy: user._id,
    });

    // TODO: Implement refund logic here
    // This would involve returning the investment to the franchise proposer

    return { success: true };
  },
});