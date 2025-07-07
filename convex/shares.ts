import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Query to get all franchisees for a specific franchise
export const getFranchiseesByFranchise = query({
  args: {
    franchiseId: v.id("franchise"),
  },
  returns: v.array(
    v.object({
      _id: v.id("shares"),
      _creationTime: v.number(),
      franchiseId: v.id("franchise"),
      userId: v.id("users"),
      userName: v.string(),
      userImage: v.string(),
      numberOfShares: v.number(),
      purchaseDate: v.number(),
      costPerShare: v.number(),
      user: v.object({
        first_name: v.optional(v.string()),
        family_name: v.optional(v.string()),
        avatar: v.optional(v.string()),
      }),
    })
  ),
  handler: async (ctx, args) => {
    const shares = await ctx.db
      .query("shares")
      .withIndex("by_franchise", (q) => q.eq("franchiseId", args.franchiseId))
      .collect();
    
    // Get user data for each share
    const sharesWithUserData = await Promise.all(shares.map(async (share) => {
      const user = await ctx.db.get(share.userId);
      return {
        ...share,
        user: {
          first_name: user?.first_name,
          family_name: user?.family_name,
          avatar: user?.avatar,
        },
      };
    }));
    
    return sharesWithUserData;
  },
});

// Query to get all franchises owned by a user
export const getFranchisesByUser = query({
  args: {
    userId: v.id("users"),
  },
  returns: v.array(
    v.object({
      _id: v.id("shares"),
      _creationTime: v.number(),
      franchiseId: v.id("franchise"),
      userId: v.id("users"),
      userName: v.string(),
      userImage: v.string(),
      numberOfShares: v.number(),
      purchaseDate: v.number(),
      costPerShare: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const shares = await ctx.db
      .query("shares")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    
    return shares;
  },
});

// Query to get total shares owned by a franchisee for a specific franchise
export const getUserFranchiseShares = query({
  args: {
    userId: v.id("users"),
    franchiseId: v.id("franchise"),
  },
  returns: v.number(),
  handler: async (ctx, args) => {
    const shares = await ctx.db
      .query("shares")
      .withIndex("by_franchise_and_user", (q) => 
        q.eq("franchiseId", args.franchiseId).eq("userId", args.userId)
      )
      .collect();
    
    return shares.reduce((total, share) => total + share.numberOfShares, 0);
  },
});

// Mutation to purchase franchise shares
export const purchaseFranchiseShares = mutation({
  args: {
    franchiseId: v.id("franchise"),
    userId: v.id("users"),
    userName: v.string(),
    userImage: v.string(),
    numberOfShares: v.number(),
    costPerShare: v.number(),
  },
  returns: v.id("shares"),
  handler: async (ctx, args) => {
    // Get the franchise to check available shares
    const franchise = await ctx.db.get(args.franchiseId);
    if (!franchise) {
      throw new Error("Franchise not found");
    }

    // Check if there are enough shares available
    const currentShares = franchise.selectedShares || 0;
    const totalShares = franchise.totalShares || 0;
    
    if (currentShares + args.numberOfShares > totalShares) {
      throw new Error("Not enough shares available");
    }

    // Verify user exists
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if user already owns shares in this franchise
    const existingShares = await ctx.db
      .query("shares")
      .withIndex("by_franchise_and_user", (q) => 
        q.eq("franchiseId", args.franchiseId).eq("userId", args.userId)
      )
      .first();

    // Update the franchise's selected shares count
    const newSelectedShares = currentShares + args.numberOfShares;
    await ctx.db.patch(args.franchiseId, {
      selectedShares: newSelectedShares,
    });

    // If all shares are sold and status is 'Funding', update to 'Launching'
    if (newSelectedShares === totalShares && franchise.status === 'Funding') {
      await ctx.db.patch(args.franchiseId, { status: 'Launching' });
    }

    let shareId;
    if (existingShares) {
      // Update existing share record
      await ctx.db.patch(existingShares._id, {
        numberOfShares: existingShares.numberOfShares + args.numberOfShares,
        userName: args.userName, // Update name in case it changed
        userImage: args.userImage, // Update image in case it changed
      });
      shareId = existingShares._id;
    } else {
      // Create new share record
      shareId = await ctx.db.insert("shares", {
        franchiseId: args.franchiseId,
        userId: args.userId,
        userName: args.userName,
        userImage: args.userImage,
        numberOfShares: args.numberOfShares,
        purchaseDate: Date.now(),
        costPerShare: args.costPerShare,
      });
    }

    return shareId;
  },
});

// Mutation to transfer franchise ownership
export const transferFranchiseShares = mutation({
  args: {
    shareId: v.id("shares"),
    newUserId: v.id("users"),
    newUserName: v.string(),
    newUserImage: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const share = await ctx.db.get(args.shareId);
    if (!share) {
      throw new Error("Share record not found");
    }

    // Verify new user exists
    const newUser = await ctx.db.get(args.newUserId);
    if (!newUser) {
      throw new Error("New user not found");
    }

    // Update the share record with new owner information
    await ctx.db.patch(args.shareId, {
      userId: args.newUserId,
      userName: args.newUserName,
      userImage: args.newUserImage,
    });

    return null;
  },
}); 