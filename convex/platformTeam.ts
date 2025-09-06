// TEMPORARILY DISABLED DUE TO TYPESCRIPT ERRORS
// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";
// import { Id } from "./_generated/dataModel";

// TEMPORARILY DISABLED - WILL RE-ENABLE AFTER ESCROW SYSTEM IS WORKING
/*
// Super admin email - hardcoded for security
const SUPER_ADMIN_EMAIL = "shawaz@franchiseen.com";

// Define platform roles and their permissions
export const PLATFORM_ROLES = {
  super_admin: {
    name: "Super Admin",
    permissions: ["*"], // All permissions
    department: "executive",
    description: "Full platform access and control"
  },
  platform_admin: {
    name: "Platform Admin", 
    permissions: [
      "admin.*", "operations.*", "finances.*", "people.*", 
      "marketing.*", "sales.*", "software.*", "support.*"
    ],
    department: "operations",
    description: "Full administrative access"
  },
  admin: {
    name: "Admin",
    permissions: ["admin.*", "operations.*", "people.*", "support.*"],
    department: "operations", 
    description: "General administrative access"
  },
  developer: {
    name: "Developer",
    permissions: ["software.*", "admin.resources", "operations.projects"],
    department: "engineering",
    description: "Software development and technical resources"
  },
  support: {
    name: "Support Specialist",
    permissions: ["support.*", "people.users", "operations.ongoing"],
    department: "support",
    description: "Customer and user support"
  },
  marketing: {
    name: "Marketing Manager", 
    permissions: ["marketing.*", "sales.leads", "people.users"],
    department: "marketing",
    description: "Marketing campaigns and content"
  },
  sales: {
    name: "Sales Manager",
    permissions: ["sales.*", "marketing.leads", "people.users"],
    department: "sales", 
    description: "Sales operations and client management"
  }
};

// Get current user with platform team info
export const getCurrentPlatformUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) return null;

    // Get user from database
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .unique();

    if (!user) return null;

    // Check if user is platform team member
    const platformMember = await ctx.db
      .query("platformTeamMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    return {
      ...user,
      platformMember,
    };
  },
});

// Auto-grant super admin access (mutation)
export const grantSuperAdminAccess = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email || identity.email !== SUPER_ADMIN_EMAIL) {
      throw new Error("Unauthorized");
    }

    // Get user from database
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .unique();

    if (!user) throw new Error("User not found");

    // Check if user is already platform team member
    const platformMember = await ctx.db
      .query("platformTeamMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!platformMember) {
      const superAdminMember = await ctx.db.insert("platformTeamMembers", {
        userId: user._id,
        role: "super_admin",
        department: "executive",
        position: "Chief Technology Officer",
        joinedAt: Date.now(),
        invitedBy: user._id, // Self-invited
        permissions: ["*"],
        isActive: true,
        lastActiveAt: Date.now(),
      });

      // Also update user roles
      await ctx.db.patch(user._id, {
        roles: ["super_admin"],
        updated_at: Date.now(),
      });

      return { success: true, memberId: superAdminMember };
    }

    return { success: true, memberId: platformMember._id };
  },
});

// Check if user has platform admin access
export const hasPlatformAccess = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) return false;

    // Super admin always has access
    if (identity.email === SUPER_ADMIN_EMAIL) return true;

    // Check if user is active platform team member
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .unique();

    if (!user) return false;

    const platformMember = await ctx.db
      .query("platformTeamMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    return platformMember?.isActive || false;
  },
});

// Get all platform team members
export const listPlatformTeamMembers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) throw new Error("Not authenticated");

    // Super admin always has access
    if (identity.email !== SUPER_ADMIN_EMAIL) {
      // Check if user is active platform team member
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", identity.email as string))
        .unique();

      if (!user) throw new Error("Not authorized");

      const platformMember = await ctx.db
        .query("platformTeamMembers")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .unique();

      if (!platformMember?.isActive) throw new Error("Not authorized");
    }

    const members = await ctx.db
      .query("platformTeamMembers")
      .collect();

    // Get user details for each member
    const membersWithUsers = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        const invitedByUser = await ctx.db.get(member.invitedBy);
        return {
          ...member,
          user,
          invitedBy: invitedByUser,
        };
      })
    );

    return membersWithUsers;
  },
});

// Invite new platform team member
export const invitePlatformTeamMember = mutation({
  args: {
    email: v.string(),
    role: v.string(),
    department: v.string(),
    position: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) throw new Error("Not authenticated");

    // Super admin always has access
    if (identity.email !== SUPER_ADMIN_EMAIL) {
      // Check if user is active platform team member
      const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", identity.email as string))
        .unique();

      if (!user) throw new Error("Not authorized to invite team members");

      const platformMember = await ctx.db
        .query("platformTeamMembers")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .unique();

      if (!platformMember?.isActive) throw new Error("Not authorized to invite team members");
    }

    // Get current user
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .unique();

    if (!currentUser) throw new Error("Current user not found");

    // Validate role
    if (!PLATFORM_ROLES[args.role as keyof typeof PLATFORM_ROLES]) {
      throw new Error("Invalid role specified");
    }

    // Check if invitation already exists
    const existingInvite = await ctx.db
      .query("platformTeamInvitations")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .unique();

    if (existingInvite) {
      throw new Error("Invitation already sent to this email");
    }

    // Check if user is already a team member
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingUser) {
      const existingMember = await ctx.db
        .query("platformTeamMembers")
        .withIndex("by_user", (q) => q.eq("userId", existingUser._id))
        .unique();

      if (existingMember) {
        throw new Error("User is already a platform team member");
      }
    }

    // Generate invite token
    const inviteToken = crypto.randomUUID();
    const roleConfig = PLATFORM_ROLES[args.role as keyof typeof PLATFORM_ROLES];

    // Create invitation
    const invitationId = await ctx.db.insert("platformTeamInvitations", {
      email: args.email,
      role: args.role,
      department: args.department,
      position: args.position,
      permissions: roleConfig.permissions,
      invitedBy: currentUser._id,
      status: "pending",
      inviteToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      message: args.message,
    });

    // TODO: Send email invitation
    // This would integrate with your email service (SendGrid, etc.)
    
    return { invitationId, inviteToken };
  },
});

// Accept platform team invitation
export const acceptPlatformInvitation = mutation({
  args: {
    inviteToken: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) throw new Error("Not authenticated");

    // Find invitation
    const invitation = await ctx.db
      .query("platformTeamInvitations")
      .withIndex("by_token", (q) => q.eq("inviteToken", args.inviteToken))
      .unique();

    if (!invitation) {
      throw new Error("Invalid invitation token");
    }

    if (invitation.status !== "pending") {
      throw new Error("Invitation is no longer valid");
    }

    if (invitation.expiresAt < Date.now()) {
      throw new Error("Invitation has expired");
    }

    if (invitation.email !== identity.email) {
      throw new Error("Invitation email does not match current user");
    }

    // Get or create user
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .unique();

    if (!user) {
      // Create user if doesn't exist
      const userId = await ctx.db.insert("users", {
        email: identity.email as string,
        created_at: Date.now(),
        roles: [invitation.role],
        isActivated: true,
      });
      user = await ctx.db.get(userId);
    } else {
      // Update user roles
      const currentRoles = user.roles || [];
      if (!currentRoles.includes(invitation.role)) {
        await ctx.db.patch(user._id, {
          roles: [...currentRoles, invitation.role],
          updated_at: Date.now(),
        });
      }
    }

    if (!user) throw new Error("Failed to create/update user");

    // Create platform team member
    await ctx.db.insert("platformTeamMembers", {
      userId: user._id,
      role: invitation.role,
      department: invitation.department,
      position: invitation.position,
      joinedAt: Date.now(),
      invitedBy: invitation.invitedBy,
      permissions: invitation.permissions,
      isActive: true,
      lastActiveAt: Date.now(),
    });

    // Update invitation status
    await ctx.db.patch(invitation._id, {
      status: "accepted",
      acceptedAt: Date.now(),
    });

    return { success: true };
  },
});
*/
