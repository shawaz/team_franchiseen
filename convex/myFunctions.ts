import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

export const listAllUsers = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("users"),
    _creationTime: v.number(),
    email: v.string(),
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
    created_at: v.number(),
    updated_at: v.optional(v.number()),
  })),
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Helper function to get random avatar based on gender
function getRandomAvatar(gender: 'male' | 'female'): string {
  const prefix = gender === 'male' ? 'avatar-m-' : 'avatar-f-';
  const count = gender === 'male' ? 6 : 6; // We have 6 avatars for each gender
  const randomNum = Math.floor(Math.random() * count) + 1;
  return `/avatar/${prefix}${randomNum}.png`;
}

export const createUser = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Check if user exists
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();
    if (existing) return existing._id;
    const id = await ctx.db.insert("users", {
      email: args.email,
      created_at: Date.now(),
    });
    return id;
  },
});

export const listCategories = query({
  args: { industry_id: v.string() },
  handler: async (ctx, args) => {
    const categories = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("industry_id"), args.industry_id))
      .order("asc")
      .collect();
    return categories;
  },
});

export const upsertUserProfile = mutation({
  args: {
    gender: v.union(v.literal("male"), v.literal("female")),
    first_name: v.string(),
    family_name: v.string(),
    location: v.string(),
    formatted_address: v.string(),
    area: v.string(),
    district: v.string(),
    state: v.string(),
    country: v.string(),
    pincode: v.string(),
    monthly_income: v.string(),
    investment_budget: v.string(),
    phone: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Use provided avatar or get random avatar based on gender
    const avatar = args.avatar || getRandomAvatar(args.gender);

    // Check if user exists by email
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Update existing user
      await ctx.db.patch(existing._id, {
        avatar,
        first_name: args.first_name,
        family_name: args.family_name,
        location: args.location,
        formatted_address: args.formatted_address,
        area: args.area,
        district: args.district,
        state: args.state,
        country: args.country,
        pincode: args.pincode,
        monthly_income: args.monthly_income,
        investment_budget: args.investment_budget,
        phone: args.phone,
        updated_at: Date.now(),
      });
      return existing._id;
    } else {
      // Create new user
      const id = await ctx.db.insert("users", {
        email: args.email,
        avatar,
        first_name: args.first_name,
        family_name: args.family_name,
        location: args.location,
        formatted_address: args.formatted_address,
        area: args.area,
        district: args.district,
        state: args.state,
        country: args.country,
        pincode: args.pincode,
        monthly_income: args.monthly_income,
        investment_budget: args.investment_budget,
        phone: args.phone,
        created_at: Date.now(),
        updated_at: Date.now(),
      });
      return id;
    }
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const updateUserProfile = mutation({
  args: {
    avatar: v.optional(v.string()),
    first_name: v.optional(v.string()),
    family_name: v.optional(v.string()),
    email: v.string(),
    investment_budget: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists by email
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (!existing) {
      throw new Error("User not found");
    }

    // Update user profile
    await ctx.db.patch(existing._id, {
      ...(args.avatar && { avatar: args.avatar }),
      ...(args.first_name && { first_name: args.first_name }),
      ...(args.family_name && { family_name: args.family_name }),
      ...(args.investment_budget && { investment_budget: args.investment_budget }),
      updated_at: Date.now(),
    });

    return existing._id;
  },
});

export const setStripeCardholderId = mutation({
  args: { userId: v.id("users"), stripeCardholderId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { stripeCardholderId: args.stripeCardholderId });
    return true;
  },
});

export const activateUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { isActivated: true });
    return true;
  },
});
