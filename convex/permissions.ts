import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create or update user permissions
export const createOrUpdate = mutation({
  args: {
    userId: v.id("users"),
    section: v.union(
      v.literal("operations"), 
      v.literal("finance"), 
      v.literal("admin"), 
      v.literal("people"),
      v.literal("marketing"),
      v.literal("sales"),
      v.literal("support"),
      v.literal("software")
    ),
    actions: v.array(v.string()),
    franchiseId: v.optional(v.id("franchise")),
    businessId: v.optional(v.id("businesses")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) throw new Error("Not authenticated");

    // Get current user to verify admin permissions
    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .unique();

    if (!currentUser) throw new Error("User not found");

    // Check if permission already exists
    const existing = await ctx.db
      .query("permissions")
      .withIndex("by_user_section", (q) => 
        q.eq("userId", args.userId).eq("section", args.section)
      )
      .filter((q) => {
        let filter = q.eq(q.field("franchiseId"), args.franchiseId || null);
        if (args.businessId) {
          filter = q.and(filter, q.eq(q.field("businessId"), args.businessId));
        }
        return filter;
      })
      .unique();

    const permissionData = {
      userId: args.userId,
      section: args.section,
      actions: args.actions,
      franchiseId: args.franchiseId,
      businessId: args.businessId,
      createdBy: currentUser._id,
    };

    if (existing) {
      await ctx.db.patch(existing._id, {
        actions: args.actions,
        createdBy: currentUser._id,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("permissions", {
        ...permissionData,
        createdAt: Date.now(),
      });
    }
  },
});

// Get user permissions for a specific section
export const getUserPermissions = query({
  args: {
    userId: v.id("users"),
    section: v.optional(v.union(
      v.literal("operations"), 
      v.literal("finance"), 
      v.literal("admin"), 
      v.literal("people"),
      v.literal("marketing"),
      v.literal("sales"),
      v.literal("support"),
      v.literal("software")
    )),
    franchiseId: v.optional(v.id("franchise")),
    businessId: v.optional(v.id("businesses")),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("permissions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    const permissions = await query.collect();

    // Filter by section if provided
    let filtered = permissions;
    if (args.section) {
      filtered = permissions.filter(p => p.section === args.section);
    }

    // Filter by franchise/business if provided
    if (args.franchiseId) {
      filtered = filtered.filter(p => p.franchiseId === args.franchiseId);
    }
    if (args.businessId) {
      filtered = filtered.filter(p => p.businessId === args.businessId);
    }

    return filtered;
  },
});

// Check if user has specific permission
export const hasPermission = query({
  args: {
    userId: v.id("users"),
    section: v.union(
      v.literal("operations"), 
      v.literal("finance"), 
      v.literal("admin"), 
      v.literal("people"),
      v.literal("marketing"),
      v.literal("sales"),
      v.literal("support"),
      v.literal("software")
    ),
    action: v.string(),
    franchiseId: v.optional(v.id("franchise")),
    businessId: v.optional(v.id("businesses")),
  },
  handler: async (ctx, args) => {
    const permissions = await ctx.db
      .query("permissions")
      .withIndex("by_user_section", (q) => 
        q.eq("userId", args.userId).eq("section", args.section)
      )
      .collect();

    // Check for matching permission
    const hasPermission = permissions.some(permission => {
      // Check if actions include the required action
      if (!permission.actions.includes(args.action)) return false;

      // Check franchise-specific permission
      if (args.franchiseId && permission.franchiseId !== args.franchiseId) {
        return false;
      }

      // Check business-specific permission
      if (args.businessId && permission.businessId !== args.businessId) {
        return false;
      }

      return true;
    });

    return hasPermission;
  },
});

// Get current user's permissions (based on authenticated user)
export const getCurrentUserPermissions = query({
  args: {
    section: v.optional(v.union(
      v.literal("operations"), 
      v.literal("finance"), 
      v.literal("admin"), 
      v.literal("people"),
      v.literal("marketing"),
      v.literal("sales"),
      v.literal("support"),
      v.literal("software")
    )),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) return [];

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .unique();

    if (!user) return [];

    let query = ctx.db
      .query("permissions")
      .withIndex("by_user", (q) => q.eq("userId", user._id));

    const permissions = await query.collect();

    if (args.section) {
      return permissions.filter(p => p.section === args.section);
    }

    return permissions;
  },
});

// Check if current user has specific permission
export const currentUserHasPermission = query({
  args: {
    section: v.union(
      v.literal("operations"), 
      v.literal("finance"), 
      v.literal("admin"), 
      v.literal("people"),
      v.literal("marketing"),
      v.literal("sales"),
      v.literal("support"),
      v.literal("software")
    ),
    action: v.string(),
    franchiseId: v.optional(v.id("franchise")),
    businessId: v.optional(v.id("businesses")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) return false;

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .unique();

    if (!user) return false;

    const permissions = await ctx.db
      .query("permissions")
      .withIndex("by_user_section", (q) => 
        q.eq("userId", user._id).eq("section", args.section)
      )
      .collect();

    // Check for matching permission
    const hasPermission = permissions.some(permission => {
      // Check if actions include the required action
      if (!permission.actions.includes(args.action)) return false;

      // Check franchise-specific permission
      if (args.franchiseId && permission.franchiseId !== args.franchiseId) {
        return false;
      }

      // Check business-specific permission
      if (args.businessId && permission.businessId !== args.businessId) {
        return false;
      }

      return true;
    });

    return hasPermission;
  },
});

// Remove user permission
export const removePermission = mutation({
  args: {
    permissionId: v.id("permissions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) throw new Error("Not authenticated");

    await ctx.db.delete(args.permissionId);
    return true;
  },
});

// Get all permissions for admin management
export const listAll = query({
  args: {
    section: v.optional(v.union(
      v.literal("operations"), 
      v.literal("finance"), 
      v.literal("admin"), 
      v.literal("people"),
      v.literal("marketing"),
      v.literal("sales"),
      v.literal("support"),
      v.literal("software")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let permissions;

    if (args.section) {
      permissions = await ctx.db
        .query("permissions")
        .withIndex("by_section", (q) => q.eq("section", args.section!))
        .collect();
    } else {
      permissions = await ctx.db.query("permissions").collect();
    }

    if (args.limit) {
      permissions = permissions.slice(0, args.limit);
    }

    // Get user details for each permission
    const results = await Promise.all(
      permissions.map(async (permission) => {
        const user = await ctx.db.get(permission.userId);
        const franchise = permission.franchiseId ? await ctx.db.get(permission.franchiseId) : null;
        const business = permission.businessId ? await ctx.db.get(permission.businessId) : null;
        
        return {
          ...permission,
          user,
          franchise,
          business,
        };
      })
    );

    return results;
  },
});
