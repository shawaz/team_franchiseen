import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
// Super admin email - hardcoded for security
const SUPER_ADMIN_EMAIL = "shawaz@franchiseen.com";

// Define departments and their access levels
export const DEPARTMENTS = {
  home: {
    name: "Home",
    description: "Open to all Franchiseen members",
    accessLevel: "open",
    permissions: ["home.*"]
  },
  administration: {
    name: "Administration",
    description: "Closed Department - Admin access only",
    accessLevel: "closed",
    permissions: ["admin.*"]
  },
  finances: {
    name: "Finances",
    description: "Closed Department - Finance team access only",
    accessLevel: "closed",
    permissions: ["finances.*"]
  },
  operations: {
    name: "Operations",
    description: "Closed Department - Operations team access only",
    accessLevel: "closed",
    permissions: ["operations.*"]
  },
  people: {
    name: "People (HR)",
    description: "Closed Department - HR team access only",
    accessLevel: "closed",
    permissions: ["people.*"]
  },
  marketing: {
    name: "Marketing",
    description: "Closed Department - Marketing team access only",
    accessLevel: "closed",
    permissions: ["marketing.*"]
  },
  sales: {
    name: "Sales",
    description: "Closed Department - Sales team access only",
    accessLevel: "closed",
    permissions: ["sales.*"]
  },
  support: {
    name: "Support",
    description: "Closed Department - Support team access only",
    accessLevel: "closed",
    permissions: ["support.*"]
  },
  software: {
    name: "Software",
    description: "Closed Department - Development team access only",
    accessLevel: "closed",
    permissions: ["software.*"]
  }
};

// Define platform roles with flexible department access
export const PLATFORM_ROLES = {
  super_admin: {
    name: "Super Admin",
    permissions: ["*"], // All permissions
    defaultDepartments: Object.keys(DEPARTMENTS),
    description: "Full platform access and control"
  },
  platform_admin: {
    name: "Platform Admin",
    permissions: [
      "home.*", "admin.*", "operations.*", "finances.*", "people.*",
      "marketing.*", "sales.*", "software.*", "support.*"
    ],
    defaultDepartments: Object.keys(DEPARTMENTS),
    description: "Full administrative access to all departments"
  },
  department_manager: {
    name: "Department Manager",
    permissions: ["home.*", "admin.*", "people.*"],
    defaultDepartments: ["home"],
    description: "Can manage multiple departments - departments assigned during invitation"
  },
  senior_specialist: {
    name: "Senior Specialist",
    permissions: ["home.*"],
    defaultDepartments: ["home"],
    description: "Senior team member - can have access to multiple departments"
  },
  specialist: {
    name: "Specialist",
    permissions: ["home.*"],
    defaultDepartments: ["home"],
    description: "Team specialist - can have access to specific departments"
  },
  team_member: {
    name: "Team Member",
    permissions: ["home.*"],
    defaultDepartments: ["home"],
    description: "Basic team member - can be granted additional department access"
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

    // Get user's department access
    let departmentAccess: string[] = ["home"]; // Everyone gets home access
    if (platformMember?.isActive) {
      // Use the departments assigned to the user (supports multiple departments)
      departmentAccess = platformMember.departments || ["home"];
    }

    return {
      ...user,
      platformMember,
      departmentAccess,
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
        departments: Object.keys(DEPARTMENTS), // Super admin has access to all departments
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

    // All @franchiseen.com emails have basic platform access (home section)
    if (identity.email.endsWith('@franchiseen.com')) return true;

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

// Check if user has access to specific department
export const hasDepartmentAccess = query({
  args: { department: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) return false;

    // Super admin always has access
    if (identity.email === SUPER_ADMIN_EMAIL) return true;

    // Home department is open to all Franchiseen members
    if (args.department === "home" && identity.email.endsWith('@franchiseen.com')) {
      return true;
    }

    // Check if user is active platform team member with department access
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email as string))
      .unique();

    if (!user) return false;

    const platformMember = await ctx.db
      .query("platformTeamMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!platformMember?.isActive) return false;

    // Check if user has access to this department (supports multiple departments)
    return platformMember.departments?.includes(args.department) || false;
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
      // Check if user is active platform team member with admin permissions
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

      // Only admins and managers can view team members
      const role = PLATFORM_ROLES[platformMember.role as keyof typeof PLATFORM_ROLES];
      const hasAdminAccess = role?.permissions.includes("*") ||
                           role?.permissions.includes("admin.*") ||
                           role?.permissions.includes("people.*");

      if (!hasAdminAccess) throw new Error("Not authorized to view team members");
    }

    const members = await ctx.db
      .query("platformTeamMembers")
      .collect();

    // Get user details for each member
    const membersWithUsers = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        const invitedByUser = await ctx.db.get(member.invitedBy);
        const role = PLATFORM_ROLES[member.role as keyof typeof PLATFORM_ROLES];
        return {
          ...member,
          user,
          invitedBy: invitedByUser,
          roleInfo: role,
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
    departments: v.array(v.string()), // Support multiple departments
    position: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) throw new Error("Not authenticated");

    // Super admin always has access
    if (identity.email !== SUPER_ADMIN_EMAIL) {
      // Check if user is active platform team member with admin permissions
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

      // Only admins and managers can invite team members
      const role = PLATFORM_ROLES[platformMember.role as keyof typeof PLATFORM_ROLES];
      const hasInviteAccess = role?.permissions.includes("*") ||
                             role?.permissions.includes("admin.*") ||
                             role?.permissions.includes("people.*");

      if (!hasInviteAccess) throw new Error("Not authorized to invite team members");
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

    // Validate departments
    for (const dept of args.departments) {
      if (!DEPARTMENTS[dept as keyof typeof DEPARTMENTS]) {
        throw new Error(`Invalid department specified: ${dept}`);
      }
    }

    // Ensure at least one department is specified
    if (args.departments.length === 0) {
      throw new Error("At least one department must be specified");
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
      departments: args.departments,
      position: args.position,
      permissions: roleConfig.permissions,
      invitedBy: currentUser._id,
      status: "pending",
      inviteToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      message: args.message,
    });

    // TODO: Integrate with Clerk to send team invitation
    // This would use Clerk's team invitation API

    return {
      invitationId,
      inviteToken,
      inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL}/admin/invite/${inviteToken}`
    };
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

    // Handle migration: convert old department field to departments array
    let departments: string[] = [];
    if (invitation.departments) {
      departments = invitation.departments;
    } else if (invitation.department) {
      // Migration: convert single department to array
      departments = [invitation.department];
    } else {
      // Fallback to home if no departments specified
      departments = ["home"];
    }

    // Create platform team member
    await ctx.db.insert("platformTeamMembers", {
      userId: user._id,
      role: invitation.role,
      departments: departments,
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

// Get available roles for invitation
export const getAvailableRoles = query({
  args: {},
  handler: async (ctx) => {
    return Object.entries(PLATFORM_ROLES).map(([key, role]) => ({
      id: key,
      name: role.name,
      description: role.description,
      departments: role.defaultDepartments,
      permissions: role.permissions,
    }));
  },
});

// Get available departments
export const getAvailableDepartments = query({
  args: {},
  handler: async (ctx) => {
    return Object.entries(DEPARTMENTS).map(([key, dept]) => ({
      id: key,
      name: dept.name,
      description: dept.description,
      accessLevel: dept.accessLevel,
      permissions: dept.permissions,
    }));
  },
});
