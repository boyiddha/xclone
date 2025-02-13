//export { GET, POST } from "@/auth";

import NextAuth from "@/auth"; // import NextAuth with config

export const GET = NextAuth; // Use the NextAuth handler for GET requests
export const POST = NextAuth; // Use the NextAuth handler for POST requests
export const authOptions = NextAuth;
