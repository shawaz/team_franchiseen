// import { httpRouter } from "convex/server";
// import { httpAction } from "./_generated/server";

// // define the webhook handler
// const handleClerkWebhook = httpAction(async (ctx, request) => {
//     const event = await request.json();
//     if (!event) {
//       return new Response('Error occured', { status: 400 })
//     }
//     switch (event.type) { /* ... */ }
//     return new Response(null, { status: 200 })
//   });
  
//   // define the http router
//   const http = httpRouter()
  
//   // define the webhook route
//   http.route({
//     path: '/clerk-users-webhook',
//     method: 'POST',
//     handler: handleClerkWebhook,
//   })