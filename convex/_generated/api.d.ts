/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as businesses from "../businesses.js";
import type * as deals from "../deals.js";
import type * as franchise from "../franchise.js";
import type * as industries from "../industries.js";
import type * as myFunctions from "../myFunctions.js";
import type * as shares from "../shares.js";
import type * as uploadLogo from "../uploadLogo.js";
import type * as uploadcare from "../uploadcare.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  businesses: typeof businesses;
  deals: typeof deals;
  franchise: typeof franchise;
  industries: typeof industries;
  myFunctions: typeof myFunctions;
  shares: typeof shares;
  uploadLogo: typeof uploadLogo;
  uploadcare: typeof uploadcare;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
