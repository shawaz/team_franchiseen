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

// Define role permissions
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  // Platform-wide roles
  super_admin: ['*'], // All permissions
  platform_admin: [
    'admin.dashboard', 'admin.users', 'admin.business', 'admin.franchise',
    'admin.invoices', 'admin.earnings', 'admin.payouts', 'admin.settings',
    'admin.access-control',
    'home.*', 'admin.*', 'operations.*', 'finances.*', 'people.*',
    'marketing.*', 'sales.*', 'software.*', 'support.*'
  ],
  admin: [
    'admin.dashboard', 'admin.users', 'admin.business', 'admin.franchise',
    'admin.access-control',
    'home.*', 'admin.*', 'operations.*', 'finances.*', 'people.*'
  ],

  // Department-specific roles
  finance_manager: ['home.*', 'finances.*', 'operations.funding', 'operations.projects'],
  hr_manager: ['home.*', 'people.*'],
  marketing_manager: ['home.*', 'marketing.*', 'sales.leads', 'sales.clients'],
  sales_manager: ['home.*', 'sales.*', 'marketing.campaign'],
  operations_manager: ['home.*', 'operations.*'],
  support_manager: ['home.*', 'support.*'],
  developer: ['home.*', 'software.*'],

  // Basic roles
  employee: ['home.tasks', 'home.mail', 'home.calendar', 'home.docs', 'home.handbook'],
  user: ['home.tasks', 'home.mail', 'home.calendar']
};

// Check if current user has admin access
export const hasAdminAccess = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    // Super admin always has access
    if (identity.email === "shawaz@franchiseen.com") return true;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .unique();

    if (!user) return false;

    // Check if user has admin role or is a platform admin
    const adminRoles = ['admin', 'platform_admin', 'super_admin'];
    const hasRole = user.roles?.some(role => adminRoles.includes(role)) || false;

    // Also check if user is active platform team member
    if (!hasRole && user) {
      const platformMember = await ctx.db
        .query("platformTeamMembers")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .unique();

      return platformMember?.isActive || false;
    }

    return hasRole;
  },
});

// Check if current user has specific permission
export const hasPermission = query({
  args: { permission: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    // Super admin has all permissions
    if (identity.email === "shawaz@franchiseen.com") return true;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .unique();

    if (!user) return false;

    // Check platform team member permissions first
    const platformMember = await ctx.db
      .query("platformTeamMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (platformMember?.isActive) {
      const permissions = platformMember.permissions || [];

      // Check for wildcard permission
      if (permissions.includes('*')) return true;

      // Check for exact permission match
      if (permissions.includes(args.permission)) return true;

      // Check for wildcard section match
      const wildcardPermissions = permissions.filter(p => p.endsWith('.*'));
      for (const wildcardPerm of wildcardPermissions) {
        const section = wildcardPerm.replace('.*', '');
        if (args.permission.startsWith(section + '.')) return true;
      }
    }

    // Fallback to user roles
    if (!user.roles) return false;

    // Check each role for the permission
    for (const role of user.roles) {
      const permissions: string[] = ROLE_PERMISSIONS[role] || [];
      if (permissions.length === 0) continue;

      // Check for wildcard permission
      if (permissions.includes('*')) return true;

      // Check for exact permission match
      if (permissions.includes(args.permission)) return true;

      // Check for wildcard section match (e.g., 'home.*' matches 'home.tasks')
      const wildcardPermissions = permissions.filter(p => p.endsWith('.*'));
      for (const wildcardPerm of wildcardPermissions) {
        const section = wildcardPerm.replace('.*', '');
        if (args.permission.startsWith(section + '.')) return true;
      }
    }

    return false;
  },
});

// Get user permissions
export const getUserPermissions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .unique();

    if (!user || !user.roles) return [];

    const allPermissions = new Set<string>();

    // Collect all permissions from user roles
    for (const role of user.roles) {
      const permissions: string[] = ROLE_PERMISSIONS[role] || [];
      if (permissions.length > 0) {
        permissions.forEach(permission => allPermissions.add(permission));
      }
    }

    return Array.from(allPermissions);
  },
});

// Assign roles to a user (admin only)
export const assignUserRoles = mutation({
  args: {
    userId: v.id("users"),
    roles: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if current user has admin access
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .unique();

    if (!currentUser) throw new Error("Current user not found");

    const adminRoles = ['admin', 'platform_admin', 'super_admin'];
    const hasAdminAccess = currentUser.roles?.some(role => adminRoles.includes(role));

    if (!hasAdminAccess) throw new Error("Insufficient permissions");

    // Update user roles
    await ctx.db.patch(args.userId, {
      roles: args.roles,
      updated_at: Date.now(),
    });

    return true;
  },
});

// Get available roles and their permissions
export const getAvailableRoles = query({
  args: {},
  handler: async () => {
    return Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
      role,
      permissions,
      description: getRoleDescription(role)
    }));
  },
});

function getRoleDescription(role: string): string {
  const descriptions: Record<string, string> = {
    super_admin: 'Full system access with all permissions',
    platform_admin: 'Platform-wide administrative access',
    admin: 'Administrative access to core functions',
    finance_manager: 'Manage finances, funding, and financial operations',
    hr_manager: 'Manage people, teams, and HR processes',
    marketing_manager: 'Manage marketing campaigns and lead generation',
    sales_manager: 'Manage sales processes and client relationships',
    operations_manager: 'Manage operational processes and projects',
    support_manager: 'Manage support tickets and help desk',
    developer: 'Manage software features and technical aspects',
    employee: 'Basic employee access to essential tools',
    user: 'Basic user access to limited tools'
  };

  return descriptions[role] || 'Custom role';
}

// Create or update admin user (for development/testing)
export const createAdminUser = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) {
      // Update existing user to have admin role
      const currentRoles = existingUser.roles || [];
      if (!currentRoles.includes('admin')) {
        await ctx.db.patch(existingUser._id, {
          roles: [...currentRoles, 'admin'],
          updated_at: Date.now(),
        });
      }
      return existingUser._id;
    } else {
      // Create new admin user
      const userId = await ctx.db.insert("users", {
        email: args.email,
        roles: ['admin'],
        created_at: Date.now(),
        updated_at: Date.now(),
        verificationStatus: 'verified',
        isActivated: true,
      });
      return userId;
    }
  },
});
