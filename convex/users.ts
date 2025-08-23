import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Get all users for admin
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .order("desc")
      .collect();
  },
});

// Get user by ID
export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Update user verification status
export const updateVerificationStatus = mutation({
  args: {
    userId: v.id("users"),
    verificationStatus: v.string(), // "pending", "verified", "rejected"
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // TODO: Add admin role check here
    // For now, we'll allow any authenticated user (should be restricted to admins)
    
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const updateFields: any = {
      verificationStatus: args.verificationStatus,
      updated_at: Date.now(),
    };

    if (args.adminNotes) {
      updateFields.adminNotes = args.adminNotes;
    }

    await ctx.db.patch(args.userId, updateFields);
    return true;
  },
});

// Update document verification status
export const updateDocumentStatus = mutation({
  args: {
    userId: v.id("users"),
    documentType: v.string(), // "identityProof", "addressProof", "incomeProof"
    status: v.string(), // "pending", "approved", "rejected"
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const documents = user.documents || {};
    const document = documents[args.documentType as keyof typeof documents];
    
    if (!document) throw new Error("Document not found");

    const updatedDocument = {
      ...document,
      status: args.status,
      adminNotes: args.adminNotes,
    };

    const updatedDocuments = {
      ...documents,
      [args.documentType]: updatedDocument,
    };

    // Check if all documents are approved
    const allDocuments = Object.values(updatedDocuments);
    const allApproved = allDocuments.length >= 3 && allDocuments.every(doc => doc?.status === 'approved');

    const updateFields: any = {
      documents: updatedDocuments,
      updated_at: Date.now(),
    };

    // If all documents are approved and seed phrase is verified, update verification status
    if (allApproved && user.seedPhraseVerified) {
      updateFields.verificationStatus = 'verified';
    }

    await ctx.db.patch(args.userId, updateFields);
    return true;
  },
});

// Upload user document
export const uploadDocument = mutation({
  args: {
    documentType: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .unique();
    
    if (!user) throw new Error("User not found");

    const documents = user.documents || {};
    const newDocument = {
      url: args.url,
      status: 'pending',
      uploadedAt: Date.now(),
    };

    const updatedDocuments = {
      ...documents,
      [args.documentType]: newDocument,
    };

    await ctx.db.patch(user._id, {
      documents: updatedDocuments,
      updated_at: Date.now(),
    });

    return true;
  },
});

// Update wallet information
export const updateWallet = mutation({
  args: {
    walletAddress: v.string(),
    seedPhraseVerified: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Get current user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .unique();
    
    if (!user) throw new Error("User not found");

    const updateFields: any = {
      walletAddress: args.walletAddress,
      seedPhraseVerified: args.seedPhraseVerified,
      updated_at: Date.now(),
    };

    // Check if all documents are approved
    const documents = user.documents || {};
    const allDocuments = Object.values(documents);
    const allApproved = allDocuments.length >= 3 && allDocuments.every(doc => doc?.status === 'approved');

    // If all documents are approved and seed phrase is verified, update verification status
    if (allApproved && args.seedPhraseVerified) {
      updateFields.verificationStatus = 'verified';
    }

    await ctx.db.patch(user._id, updateFields);
    return true;
  },
});

// Get current user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .unique();
  },
});
