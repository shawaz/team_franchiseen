"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import crypto from "crypto";

export const getUploadSignature = action({
  args: {},
  returns: v.object({
    signature: v.string(),
    expire: v.string(),
    publicKey: v.string(),
  }),
  handler: async (ctx) => {
    const secretKey = "419a1bc8f14196938f79";
    const publicKey = "3b1f1c32502a35fc73cc";

    if (!secretKey || !publicKey) {
      throw new Error("Uploadcare credentials not configured");
    }

    const expire = (Math.floor(Date.now() / 1000) + 3600).toString(); // 1 hour from now
    const toSign = secretKey + expire;
    
    // Use Node.js crypto module instead of Web Crypto API
    const hash = crypto.createHash('sha256');
    hash.update(toSign);
    const signature = hash.digest('hex');

    return {
      signature,
      expire,
      publicKey,
    };
  },
}); 