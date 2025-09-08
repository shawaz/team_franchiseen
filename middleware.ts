import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Define protected routes - all routes under (platform) group
const isProtectedRoute = createRouteMatcher([
  "/home(.*)",
  "/admin(.*)",
  "/businesses(.*)",
  "/dashboard(.*)",
  "/operations(.*)",
  "/payouts(.*)",
  "/property(.*)",
  "/software(.*)",
  "/teams(.*)",
  "/users(.*)"
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (!req) {
    console.error("Request object is undefined");
    return;
  }

  try {
    // Check if the route is protected
    if (isProtectedRoute(req)) {
      const { userId } = await auth();

      // If user is not authenticated, redirect to root (login page)
      if (!userId) {
        const url = new URL("/", req.url);
        return NextResponse.redirect(url);
      }
    }

    // If user is authenticated and trying to access root, redirect to home
    if (req.nextUrl.pathname === "/") {
      const { userId } = await auth();
      if (userId) {
        const url = new URL("/home", req.url);
        return NextResponse.redirect(url);
      }
    }
  } catch (error) {
    console.error("Error in middleware:", error);
    // On error, redirect to root
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
