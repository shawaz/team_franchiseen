import { query } from "./_generated/server";

export const listIndustries = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("industries").collect();
  },
});
