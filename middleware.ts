import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the path
  const path = request.nextUrl.pathname

  // Check if the path is for the dashboard
  const isDashboardPath = path.startsWith("/dashboard")

  // Get the auth cookie
  const userJson = request.cookies.get("eco_monitor_user")?.value

  // If no user is logged in and trying to access dashboard, redirect to login
  if (isDashboardPath && !userJson) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If user exists, parse it
  if (userJson) {
    try {
      const user = JSON.parse(userJson)

      // If regular user or null role tries to access dashboard, redirect to landing page
      if (isDashboardPath && (user.role === "user" || user.role === null)) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (error) {
      // If there's an error parsing the user, clear the cookie and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("eco_monitor_user")
      return response
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
