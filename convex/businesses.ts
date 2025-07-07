import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    industry_id: v.optional(v.string()),
    category_id: v.optional(v.string()),
    costPerArea: v.optional(v.number()),
    min_area: v.optional(v.number()),
    serviceable_countries: v.optional(v.array(v.string())),
    currency: v.optional(v.string()),
  },
  returns: v.object({
    businessId: v.id("businesses"),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (!identity.email) {
      throw new Error("User email is required");
    }

    const email = identity.email;

    // Get or create user
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .unique();

    let userId: Id<"users">;
    if (!user) {
      userId = await ctx.db.insert("users", {
        email,
        created_at: Date.now(),
      });
    } else {
      userId = user._id;
    }

    const now = Date.now();
    const businessData: any = {
      name: args.name,
      logoUrl: args.logoUrl,
      owner_id: userId,
      createdAt: now,
      updatedAt: now,
    };
    if (args.slug) businessData.slug = args.slug;
    if (args.industry_id) businessData.industry_id = args.industry_id;
    if (args.category_id) businessData.category_id = args.category_id;
    if (args.costPerArea !== undefined) businessData.costPerArea = args.costPerArea;
    if (args.min_area !== undefined) businessData.min_area = args.min_area;
    if (args.serviceable_countries) businessData.serviceable_countries = args.serviceable_countries;
    if (args.currency) businessData.currency = args.currency;

    const businessId = await ctx.db.insert("businesses", businessData);

    return { businessId };
  },
});

export const listByOwner = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("businesses")
      .filter((q) => q.eq(q.field("owner_id"), args.ownerId))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) return null;
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
      ...business,
      industry,
      category,
    };
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const businesses = await ctx.db
      .query("businesses")
      .order("desc")
      .collect();

    // Fetch related data for each business
    const businessesWithRelations = await Promise.all(
      businesses.map(async (business) => {
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
          ...business,
          industry,
          category,
        };
      })
    );

    return businessesWithRelations;
  },
});

export const searchByName = query({
  args: { searchQuery: v.string() },
  handler: async (ctx, args) => {
    const searchLower = args.searchQuery.toLowerCase();
    const businesses = await ctx.db
      .query("businesses")
      .filter((q) => true)  // We'll filter in memory since Convex doesn't have direct string contains
      .order("desc")
      .collect();

    // Filter businesses that contain the search query
    const filteredBusinesses = businesses.filter(business => 
      business.name.toLowerCase().includes(searchLower)
    );

    // Fetch related data for filtered businesses
    const businessesWithRelations = await Promise.all(
      filteredBusinesses.map(async (business) => {
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
          ...business,
          industry,
          category,
        };
      })
    );

    return businessesWithRelations;
  },
});

export const update = mutation({
  args: {
    businessId: v.id("businesses"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    industry_id: v.optional(v.string()),
    category_id: v.optional(v.string()),
    costPerArea: v.optional(v.number()),
    min_area: v.optional(v.number()),
    serviceable_countries: v.optional(v.array(v.string())),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const business = await ctx.db.get(args.businessId);
    if (!business) throw new Error("Business not found");
    // Only owner can update
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email as string))
      .unique();
    if (!user || String(user._id) !== String(business.owner_id)) {
      throw new Error("Not authorized");
    }
    const updateFields: any = { updatedAt: Date.now() };
    if (args.name !== undefined) updateFields.name = args.name;
    if (args.slug !== undefined) updateFields.slug = args.slug;
    if (args.logoUrl !== undefined) updateFields.logoUrl = args.logoUrl;
    if (args.industry_id !== undefined) updateFields.industry_id = args.industry_id;
    if (args.category_id !== undefined) updateFields.category_id = args.category_id;
    if (args.costPerArea !== undefined) updateFields.costPerArea = args.costPerArea;
    if (args.min_area !== undefined) updateFields.min_area = args.min_area;
    if (args.serviceable_countries !== undefined) updateFields.serviceable_countries = args.serviceable_countries;
    if (args.currency !== undefined) updateFields.currency = args.currency;
    await ctx.db.patch(args.businessId, updateFields);
    return true;
  },
});

export const deleteBusiness = mutation({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const business = await ctx.db.get(args.businessId);
    if (!business) throw new Error("Business not found");
    // Only owner can delete
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email as string))
      .unique();
    if (!user || String(user._id) !== String(business.owner_id)) {
      throw new Error("Not authorized");
    }
    // Check all franchises are closed
    const franchises = await ctx.db
      .query("franchise")
      .filter((q) => q.eq(q.field("businessId"), args.businessId))
      .collect();
    const allClosed = franchises.every(f => f.status === "Closed");
    if (!allClosed) {
      throw new Error("All franchises must be closed before deleting the business.");
    }
    await ctx.db.delete(args.businessId);
    return true;
  },
}); 