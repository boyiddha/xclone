import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // Correct function to get session in middleware
import { PUBLIC_ROUTES, LOGIN, ROOT } from "@/utils/routes";

export async function middleware(request) {
  try {
    const { nextUrl } = request;

    // Retrieve token (session) from cookies
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const isAuthenticated = !!token; // If token exists, user is authenticated

    // console.log(
    //   "❌    Middleware: isAuthenticated = ",
    //   isAuthenticated,
    //   "🎯   Path: =============>>>>> : ",
    //   nextUrl.pathname
    // );
    // Case 1: If user is authenticated, prevent access to public routes and login

    //console.log("✅ token in middleware: ", token);

    if (
      isAuthenticated &&
      (nextUrl.pathname === ROOT ||
        nextUrl.pathname === LOGIN ||
        PUBLIC_ROUTES.includes(nextUrl.pathname))
    ) {
      return NextResponse.redirect(new URL("/home", request.url)); // Redirect authenticated users to "/home"
    }
    // Allow access to the root/ page if not authenticated
    if (!isAuthenticated && nextUrl.pathname === ROOT) {
      return NextResponse.next();
    }

    // Check if the route is public
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      nextUrl.pathname.startsWith(route)
    );

    // Allow access to public routes without redirection
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Redirect to login if trying to access a private route while not authenticated
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(LOGIN, request.url));
    }

    // Avoid redirect loop by checking if the user is already on /set-password
    const isOnSetNewUserPage = request.url.includes("/newUser");

    if (token?.isNewUser && !isOnSetNewUserPage) {
      return NextResponse.redirect(new URL("/newUser", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("❌ Middleware Error:", error);
    return NextResponse.next(); // Prevent crashes by allowing access
  }
}

export const config = {
  matcher: ["/(api|trpc)(.*)", "/((?!.+\\.[\\w]+$|_next).*)", "/"],
};
