import { action } from "./_generated/server";
import { v } from "convex/values";

// Action to generate an upload URL for logo images
export const generateLogoUploadUrl = action({
  args: {},
  handler: async (ctx) => {
    const uploadUrl = await ctx.storage.generateUploadUrl();
    return uploadUrl;
  },
}); 