import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all franchise categories
 */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

/**
 * Get category by slug
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

/**
 * Get categories for a specific industry
 */
export const getByIndustry = query({
  args: { industryId: v.id("industries") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_industry", (q) => q.eq("industry_id", args.industryId))
      .collect();
  },
});

/**
 * Get categories for a specific industry by industry slug
 */
export const getByIndustrySlug = query({
  args: { industrySlug: v.string() },
  handler: async (ctx, args) => {
    // First get the industry
    const industry = await ctx.db
      .query("industries")
      .withIndex("by_slug", (q) => q.eq("slug", args.industrySlug))
      .first();
    
    if (!industry) {
      return [];
    }
    
    // Then get categories for that industry
    return await ctx.db
      .query("categories")
      .withIndex("by_industry", (q) => q.eq("industry_id", industry._id))
      .collect();
  },
});

/**
 * Get all categories with their industry information
 */
export const getAllWithIndustry = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    
    const categoriesWithIndustry = await Promise.all(
      categories.map(async (category) => {
        const industry = await ctx.db.get(category.industry_id);
        return {
          ...category,
          industry: industry,
        };
      })
    );
    
    return categoriesWithIndustry;
  },
});
