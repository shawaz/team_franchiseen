"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

// Vibe logs: Confirm Convex URL at runtime (replaced at build time)
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
console.log("[ConvexClientProvider] NEXT_PUBLIC_CONVEX_URL:", convexUrl);
if (!convexUrl) {
  console.warn("[ConvexClientProvider] Missing NEXT_PUBLIC_CONVEX_URL. Convex client will fail to connect.");
}
const convex = new ConvexReactClient(convexUrl || "");

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
