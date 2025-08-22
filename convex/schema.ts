import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  users: defineTable({
    email: v.string(),
    created_at: v.number(),
    updated_at: v.optional(v.number()),
    avatar: v.optional(v.string()),
    first_name: v.optional(v.string()),
    family_name: v.optional(v.string()),
    location: v.optional(v.string()),
    formatted_address: v.optional(v.string()),
    area: v.optional(v.string()),
    district: v.optional(v.string()),
    state: v.optional(v.string()),
    country: v.optional(v.string()),
    pincode: v.optional(v.string()),
    monthly_income: v.optional(v.string()),
    investment_budget: v.optional(v.string()),
    phone: v.optional(v.string()),
    stripeCardholderId: v.optional(v.string()),
    roles: v.optional(v.array(v.string())),
    isActivated: v.optional(v.boolean()),
  })
    .index("by_email", ["email"]),
  industries: defineTable({
    name: v.string(),
    slug: v.string(),
  }),
  categories: defineTable({
    name: v.string(),
    industry_id: v.string(),
    slug: v.string(),
  }),
  businesses: defineTable({
    name: v.string(),
    slug: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    owner_id: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
    industry_id: v.optional(v.string()),
    category_id: v.optional(v.string()),
    costPerArea: v.optional(v.number()),
    min_area: v.optional(v.number()),
    serviceable_countries: v.optional(v.array(v.string())),
    currency: v.optional(v.string()),
  }),
  franchise: defineTable({
    businessId: v.id("businesses"),
    owner_id: v.id("users"),
    slug: v.optional(v.string()),
    locationAddress: v.string(),
    building: v.string(),
    carpetArea: v.number(),
    costPerArea: v.number(),
    totalInvestment: v.number(),
    totalShares: v.number(),
    selectedShares: v.number(),
    createdAt: v.number(),
    status: v.string(),
    launchStartDate: v.optional(v.number()),
    launchEndDate: v.optional(v.number()),
    // Approval fields
    tokenMint: v.optional(v.string()),
    transactionSignature: v.optional(v.string()),
    approvedAt: v.optional(v.number()),
    approvedBy: v.optional(v.id("users")),
    rejectedAt: v.optional(v.number()),
    rejectedBy: v.optional(v.id("users")),
    rejectionReason: v.optional(v.string()),
  }),
  invoice: defineTable({
    franchiseId: v.id("franchise"),
    userId: v.id("users"),
    serviceFee: v.number(),
    gst: v.number(),
    totalAmount: v.number(),
    createdAt: v.number(),
  }),
  shares: defineTable({
    franchiseId: v.id("franchise"),
    userId: v.id("users"),
    userName: v.string(),
    userImage: v.string(),
    numberOfShares: v.number(),
    purchaseDate: v.number(),
    costPerShare: v.number(),
  })
    .index("by_franchise", ["franchiseId"])
    .index("by_user", ["userId"])
    .index("by_franchise_and_user", ["franchiseId", "userId"]),
  deals: defineTable({
    type: v.union(v.literal("direct_purchase"), v.literal("secondary_offer")),
    franchiseId: v.id("franchise"),
    buyerId: v.id("users"),
    buyerName: v.string(),
    buyerImage: v.string(),
    sellerId: v.optional(v.id("users")), // null for direct purchases
    sellerName: v.optional(v.string()),
    sellerImage: v.optional(v.string()),
    numberOfShares: v.number(),
    pricePerShare: v.number(),
    totalAmount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
    message: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    expiresAt: v.optional(v.number()),
  })
    .index("by_franchise", ["franchiseId"])
    .index("by_buyer", ["buyerId"])
    .index("by_seller", ["sellerId"])
    .index("by_status", ["status"])
    .index("by_type", ["type"]),

  // Team management tables
  teamInvitations: defineTable({
    businessId: v.id("businesses"),
    franchiseId: v.optional(v.id("franchise")),
    invitedEmail: v.string(),
    role: v.string(), // brand_manager, franchise_manager, franchise_cashier
    invitedBy: v.id("users"),
    status: v.string(), // pending, accepted, declined, cancelled, expired
    createdAt: v.number(),
    expiresAt: v.number(),
    acceptedAt: v.optional(v.number()),
    cancelledAt: v.optional(v.number()),
  })
    .index("by_business", ["businessId"])
    .index("by_business_email", ["businessId", "invitedEmail"])
    .index("by_email", ["invitedEmail"])
    .index("by_status", ["status"]),

  teamMembers: defineTable({
    businessId: v.id("businesses"),
    franchiseId: v.optional(v.id("franchise")),
    userId: v.id("users"),
    role: v.string(), // brand_manager, franchise_manager, franchise_cashier
    joinedAt: v.number(),
    invitedBy: v.id("users"),
    permissions: v.optional(v.array(v.string())),
  })
    .index("by_business", ["businessId"])
    .index("by_user", ["userId"])
    .index("by_franchise", ["franchiseId"])
    .index("by_role", ["role"]),
});
