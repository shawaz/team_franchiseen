import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

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
      .withIndex("by_email", (q) => q.eq("email", args.email))
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
      .withIndex("by_email", (q) => q.eq("email", args.email))
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
      // Determine roles based on email domain
      let roles: string[] = ['user']; // Default role

      if (args.email === 'shawaz@franchiseen.com') {
        roles = ['super_admin'];
      } else if (args.email.endsWith('@franchiseen.com')) {
        roles = ['admin'];
      }

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
        roles: roles,
        isActivated: true,
        verificationStatus: 'verified',
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
      .withIndex("by_email", (q) => q.eq("email", args.email))
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
      .withIndex("by_email", (q) => q.eq("email", args.email))
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

// Onboarding Functions
export const createUserOnboardingProfile = mutation({
  args: {
    personalInfo: v.object({
      firstName: v.string(),
      lastName: v.string(),
      email: v.string(),
      phone: v.string(),
      dateOfBirth: v.string(),
      nationality: v.string(),
      address: v.object({
        street: v.string(),
        city: v.string(),
        state: v.string(),
        country: v.string(),
        postalCode: v.string(),
      }),
    }),
    kyc: v.object({
      identityDocument: v.object({
        type: v.union(v.literal("passport"), v.literal("national_id"), v.literal("drivers_license")),
        number: v.string(),
        fileUrl: v.optional(v.string()),
      }),
      addressProof: v.object({
        type: v.union(v.literal("utility_bill"), v.literal("bank_statement"), v.literal("rental_agreement")),
        fileUrl: v.optional(v.string()),
      }),
      incomeProof: v.optional(v.object({
        type: v.union(v.literal("salary_slip"), v.literal("tax_return"), v.literal("bank_statement")),
        fileUrl: v.optional(v.string()),
      })),
      verificationStatus: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    }),
    investment: v.object({
      monthlyBudget: v.number(),
      currency: v.string(),
      riskTolerance: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
      investmentGoals: v.array(v.string()),
    }),
    wallet: v.object({
      address: v.string(),
      seedPhraseVerified: v.boolean(),
      backupConfirmed: v.boolean(),
    }),
    userType: v.union(v.literal("investor"), v.literal("brand_owner")),
    completedAt: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user exists by email
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.personalInfo.email))
      .first();

    const userData = {
      email: args.personalInfo.email,
      first_name: args.personalInfo.firstName,
      family_name: args.personalInfo.lastName,
      phone: args.personalInfo.phone,
      formatted_address: `${args.personalInfo.address.street}, ${args.personalInfo.address.city}, ${args.personalInfo.address.state}, ${args.personalInfo.address.country}`,
      area: args.personalInfo.address.city,
      district: args.personalInfo.address.city,
      state: args.personalInfo.address.state,
      country: args.personalInfo.address.country,
      pincode: args.personalInfo.address.postalCode,
      investment_budget: args.investment.monthlyBudget.toString(),
      walletAddress: args.wallet.address,
      seedPhraseVerified: args.wallet.seedPhraseVerified,
      verificationStatus: "pending",
      roles: [args.userType],
      documents: {
        identityProof: args.kyc.identityDocument.fileUrl ? {
          url: args.kyc.identityDocument.fileUrl,
          status: "pending",
          uploadedAt: Date.now(),
        } : undefined,
        addressProof: args.kyc.addressProof.fileUrl ? {
          url: args.kyc.addressProof.fileUrl,
          status: "pending",
          uploadedAt: Date.now(),
        } : undefined,
        incomeProof: args.kyc.incomeProof?.fileUrl ? {
          url: args.kyc.incomeProof.fileUrl,
          status: "pending",
          uploadedAt: Date.now(),
        } : undefined,
      },
      updated_at: Date.now(),
    };

    if (existing) {
      // Update existing user
      await ctx.db.patch(existing._id, userData);
      return existing._id;
    } else {
      // Create new user
      const id = await ctx.db.insert("users", {
        ...userData,
        avatar: getRandomAvatar('male'), // Default avatar, can be updated later
        created_at: Date.now(),
      });
      return id;
    }
  },
});

export const updateKYCStatus = mutation({
  args: {
    userId: v.id("users"),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      verificationStatus: args.status,
      ...(args.adminNotes && { adminNotes: args.adminNotes }),
      updated_at: Date.now(),
    });
    return true;
  },
});

export const updateWallet = mutation({
  args: {
    walletAddress: v.string(),
    seedPhraseVerified: v.boolean(),
  },
  handler: async (ctx, args) => {
    // This is a simplified version - in a real app you'd want to identify the user properly
    // For now, we'll assume this is called in the context of the current user
    const users = await ctx.db.query("users").collect();
    const user = users[users.length - 1]; // Get the most recent user for demo purposes

    if (user) {
      await ctx.db.patch(user._id, {
        walletAddress: args.walletAddress,
        seedPhraseVerified: args.seedPhraseVerified,
        updated_at: Date.now(),
      });
      return user._id;
    }

    throw new Error("User not found");
  },
});
