import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Define agenda item schema
export const createAgendaItem = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    period: v.union(v.literal("today"), v.literal("week"), v.literal("month"), v.literal("quarter")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    status: v.union(v.literal("pending"), v.literal("in-progress"), v.literal("completed")),
    dueDate: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("agendaItems", {
      ...args,
      userId: identity.subject,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Get agenda items by period
export const getAgendaItems = query({
  args: {
    period: v.union(v.literal("today"), v.literal("week"), v.literal("month"), v.literal("quarter")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.db
      .query("agendaItems")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), identity.subject),
          q.eq(q.field("period"), args.period)
        )
      )
      .order("desc")
      .collect();
  },
});

// Update agenda item
export const updateAgendaItem = mutation({
  args: {
    id: v.id("agendaItems"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    status: v.optional(v.union(v.literal("pending"), v.literal("in-progress"), v.literal("completed"))),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { id, ...updates } = args;
    
    // Verify ownership
    const item = await ctx.db.get(id);
    if (!item || item.userId !== identity.subject) {
      throw new Error("Not authorized to update this item");
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete agenda item
export const deleteAgendaItem = mutation({
  args: {
    id: v.id("agendaItems"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify ownership
    const item = await ctx.db.get(args.id);
    if (!item || item.userId !== identity.subject) {
      throw new Error("Not authorized to delete this item");
    }

    return await ctx.db.delete(args.id);
  },
});

// Get agenda summary stats
export const getAgendaSummary = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        today: { total: 0, completed: 0, pending: 0, inProgress: 0 },
        week: { total: 0, completed: 0, pending: 0, inProgress: 0 },
        month: { total: 0, completed: 0, pending: 0, inProgress: 0 },
        quarter: { total: 0, completed: 0, pending: 0, inProgress: 0 },
      };
    }

    const allItems = await ctx.db
      .query("agendaItems")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    const summary = {
      today: { total: 0, completed: 0, pending: 0, inProgress: 0 },
      week: { total: 0, completed: 0, pending: 0, inProgress: 0 },
      month: { total: 0, completed: 0, pending: 0, inProgress: 0 },
      quarter: { total: 0, completed: 0, pending: 0, inProgress: 0 },
    };

    allItems.forEach(item => {
      const period = item.period as keyof typeof summary;
      summary[period].total++;
      
      if (item.status === 'completed') {
        summary[period].completed++;
      } else if (item.status === 'in-progress') {
        summary[period].inProgress++;
      } else {
        summary[period].pending++;
      }
    });

    return summary;
  },
});
