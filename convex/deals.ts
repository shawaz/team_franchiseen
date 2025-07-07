import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Query to get all deals for a user (both as buyer and seller)
export const getUserDeals = query({
  args: {
    userId: v.id("users"),
  },

  handler: async (ctx, args) => {
    // Get deals where user is either buyer or seller
    const deals = await ctx.db
      .query("deals")
      .filter((q) =>
        q.or(
          q.eq(q.field("buyerId"), args.userId),
          q.eq(q.field("sellerId"), args.userId),
        ),
      )
      .order("desc")
      .collect();

    // Fetch related franchise and business data
    const dealsWithRelations = await Promise.all(
      deals.map(async (deal) => {
        const franchise = await ctx.db.get(deal.franchiseId);
        if (!franchise) throw new Error("Franchise not found");

        const business = await ctx.db.get(franchise.businessId);
        if (!business) throw new Error("Business not found");

        return {
          ...deal,
          franchise: {
            building: franchise.building,
            locationAddress: franchise.locationAddress,
            businessId: franchise.businessId,
          },
          business: {
            name: business.name,
            logoUrl: business.logoUrl,
          },
        };
      }),
    );

    return dealsWithRelations;
  },
});

// Query to get all active deals (marketplace view)
export const getActiveDeals = query({
  args: {},
  handler: async (ctx) => {
    // Get all pending deals
    const deals = await ctx.db
      .query("deals")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .collect();

    // Fetch related franchise and business data
    const dealsWithRelations = await Promise.all(
      deals.map(async (deal) => {
        const franchise = await ctx.db.get(deal.franchiseId);
        if (!franchise) throw new Error("Franchise not found");

        const business = await ctx.db.get(franchise.businessId);
        if (!business) throw new Error("Business not found");

        // Get industry and category
        let industry = null;
        let category = null;

        if (business.industry_id) {
          industry = await ctx.db
            .query("industries")
            .filter((q) => q.eq(q.field("_id"), business.industry_id))
            .unique();
        }

        if (business.category_id) {
          category = await ctx.db
            .query("categories")
            .filter((q) => q.eq(q.field("_id"), business.category_id))
            .unique();
        }

        return {
          ...deal,
          franchise: {
            building: franchise.building,
            locationAddress: franchise.locationAddress,
            businessId: franchise.businessId,
            status: franchise.status,
            totalShares: franchise.totalShares,
            selectedShares: franchise.selectedShares,
          },
          business: {
            name: business.name,
            logoUrl: business.logoUrl,
            industry,
            category,
          },
        };
      }),
    );

    return dealsWithRelations;
  },
});

// Query to get deal by ID
export const getDealById = query({
  args: { dealId: v.id("deals") },
  handler: async (ctx, args) => {
    const deal = await ctx.db.get(args.dealId);
    if (!deal) return null;

    const franchise = await ctx.db.get(deal.franchiseId);
    if (!franchise) throw new Error("Franchise not found");

    const business = await ctx.db.get(franchise.businessId);
    if (!business) throw new Error("Business not found");

    // Get industry and category
    let industry = null;
    let category = null;

    if (business.industry_id) {
      industry = await ctx.db
        .query("industries")
        .filter((q) => q.eq(q.field("_id"), business.industry_id))
        .unique();
    }

    if (business.category_id) {
      category = await ctx.db
        .query("categories")
        .filter((q) => q.eq(q.field("_id"), business.category_id))
        .unique();
    }

    return {
      ...deal,
      franchise: {
        ...franchise,
      },
      business: {
        ...business,
        industry,
        category,
      },
    };
  },
});

// Mutation to create a direct purchase deal
export const createDirectPurchaseDeal = mutation({
  args: {
    franchiseId: v.id("franchise"),
    numberOfShares: v.number(),
    pricePerShare: v.number(),
    message: v.optional(v.string()),
  },
  returns: v.id("deals"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email as string))
      .unique();
    if (!user) throw new Error("User not found");

    // Verify franchise exists and has available shares
    const franchise = await ctx.db.get(args.franchiseId);
    if (!franchise) throw new Error("Franchise not found");

    const availableShares = franchise.totalShares - franchise.selectedShares;
    if (args.numberOfShares > availableShares) {
      throw new Error("Not enough shares available");
    }

    const totalAmount = args.numberOfShares * args.pricePerShare;
    const now = Date.now();

    const dealId = await ctx.db.insert("deals", {
      type: "direct_purchase",
      franchiseId: args.franchiseId,
      buyerId: user._id,
      buyerName:
        `${user.first_name || ""} ${user.family_name || ""}`.trim() ||
        user.email,
      buyerImage: user.avatar || "",
      sellerId: undefined,
      sellerName: undefined,
      sellerImage: undefined,
      numberOfShares: args.numberOfShares,
      pricePerShare: args.pricePerShare,
      totalAmount,
      status: "pending",
      message: args.message,
      createdAt: now,
      updatedAt: now,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return dealId;
  },
});

// Mutation to create a secondary offer deal
export const createSecondaryOfferDeal = mutation({
  args: {
    franchiseId: v.id("franchise"),
    sellerId: v.id("users"),
    numberOfShares: v.number(),
    pricePerShare: v.number(),
    message: v.optional(v.string()),
  },
  returns: v.id("deals"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const buyer = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email as string))
      .unique();
    if (!buyer) throw new Error("Buyer not found");

    // Verify seller exists and owns shares in this franchise
    const seller = await ctx.db.get(args.sellerId);
    if (!seller) throw new Error("Seller not found");

    const sellerShares = await ctx.db
      .query("shares")
      .withIndex("by_franchise_and_user", (q) =>
        q.eq("franchiseId", args.franchiseId).eq("userId", args.sellerId),
      )
      .first();

    if (!sellerShares || sellerShares.numberOfShares < args.numberOfShares) {
      throw new Error("Seller doesn't have enough shares");
    }

    const totalAmount = args.numberOfShares * args.pricePerShare;
    const now = Date.now();

    const dealId = await ctx.db.insert("deals", {
      type: "secondary_offer",
      franchiseId: args.franchiseId,
      buyerId: buyer._id,
      buyerName:
        `${buyer.first_name || ""} ${buyer.family_name || ""}`.trim() ||
        buyer.email,
      buyerImage: buyer.avatar || "",
      sellerId: args.sellerId,
      sellerName:
        `${seller.first_name || ""} ${seller.family_name || ""}`.trim() ||
        seller.email,
      sellerImage: seller.avatar || "",
      numberOfShares: args.numberOfShares,
      pricePerShare: args.pricePerShare,
      totalAmount,
      status: "pending",
      message: args.message,
      createdAt: now,
      updatedAt: now,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return dealId;
  },
});

// Mutation to accept a deal
export const acceptDeal = mutation({
  args: { dealId: v.id("deals") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email as string))
      .unique();
    if (!user) throw new Error("User not found");

    const deal = await ctx.db.get(args.dealId);
    if (!deal) throw new Error("Deal not found");

    // Only seller can accept secondary offers, anyone can accept direct purchases
    if (deal.type === "secondary_offer" && deal.sellerId !== user._id) {
      throw new Error("Only the seller can accept this offer");
    }

    if (deal.status !== "pending") {
      throw new Error("Deal is not pending");
    }

    await ctx.db.patch(args.dealId, {
      status: "accepted",
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Mutation to reject a deal
export const rejectDeal = mutation({
  args: { dealId: v.id("deals") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email as string))
      .unique();
    if (!user) throw new Error("User not found");

    const deal = await ctx.db.get(args.dealId);
    if (!deal) throw new Error("Deal not found");

    // Only seller can reject secondary offers, franchise owner can reject direct purchases
    if (deal.type === "secondary_offer" && deal.sellerId !== user._id) {
      throw new Error("Only the seller can reject this offer");
    }

    if (deal.status !== "pending") {
      throw new Error("Deal is not pending");
    }

    await ctx.db.patch(args.dealId, {
      status: "rejected",
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Mutation to cancel a deal (by buyer)
export const cancelDeal = mutation({
  args: { dealId: v.id("deals") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email as string))
      .unique();
    if (!user) throw new Error("User not found");

    const deal = await ctx.db.get(args.dealId);
    if (!deal) throw new Error("Deal not found");

    // Only buyer can cancel
    if (deal.buyerId !== user._id) {
      throw new Error("Only the buyer can cancel this deal");
    }

    if (deal.status !== "pending") {
      throw new Error("Deal is not pending");
    }

    await ctx.db.patch(args.dealId, {
      status: "cancelled",
      updatedAt: Date.now(),
    });

    return null;
  },
});

// Test function to create sample deals (for development only)
export const createTestDeal = mutation({
  args: {
    franchiseId: v.id("franchise"),
    type: v.union(v.literal("direct_purchase"), v.literal("secondary_offer")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email as string))
      .unique();
    if (!user) throw new Error("User not found");

    const now = Date.now();

    const dealId = await ctx.db.insert("deals", {
      type: args.type,
      franchiseId: args.franchiseId,
      buyerId: user._id,
      buyerName:
        `${user.first_name || ""} ${user.family_name || ""}`.trim() ||
        user.email,
      buyerImage: user.avatar || "",
      sellerId: args.type === "secondary_offer" ? user._id : undefined,
      sellerName: args.type === "secondary_offer" ? "Test Seller" : undefined,
      sellerImage: args.type === "secondary_offer" ? "" : undefined,
      numberOfShares: 10,
      pricePerShare: 50000,
      totalAmount: 500000,
      status: "pending",
      message: "Test deal for demonstration purposes",
      createdAt: now,
      updatedAt: now,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return dealId;
  },
});
