import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/", "/api/webhook", "/api/create-chat"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};






// import { authMiddleware } from "@clerk/nextjs";
// import { NextResponse, NextRequest } from "next/server";

// // Function to handle CORS
// function handleCORS(req:NextRequest) {
//   if (req.method === "OPTIONS") {
//     const response = new NextResponse(null, { status: 204 }); // 204 No Content
//     response.headers.set("Access-Control-Allow-Credentials", "true");
//     response.headers.set("Access-Control-Allow-Origin", "*"); // Or specify your origin
//     response.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
//     response.headers.set("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
//     return response;
//   }
// }

// // Custom middleware that applies CORS and then the Clerk authMiddleware
// export default function middleware(req: NextRequest) {
//   // Apply CORS handling
//   const corsResponse = handleCORS(req);
//   if (corsResponse) return corsResponse;

//   // Apply Clerk's authMiddleware to the request
//   return authMiddleware({
//     publicRoutes: ["/", "/api/webhook"],
//   })(req);
// }

// // Configuration for the middleware to specify route matching patterns
// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };
