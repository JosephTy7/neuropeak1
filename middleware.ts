import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Check if user is authenticated
  const isAuthenticated = req.cookies.has("isAuthenticated")
  const userRole = req.cookies.get("userRole")?.value

  // Check if the path is for authentication pages
  const isAuthPage = req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register"

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && isAuthPage) {
    const redirectUrl = new URL("/dashboard", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is not authenticated and trying to access protected pages, redirect to login
  if (!isAuthenticated && req.nextUrl.pathname.startsWith("/dashboard")) {
    const redirectUrl = new URL("/login", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Role-based access control for authenticated users
  if (isAuthenticated) {
    // Check if trying to access teacher-specific pages
    const isTeacherPath = req.nextUrl.pathname.startsWith("/dashboard/teacher")

    // If it's a teacher path and user is not a teacher or admin, redirect
    if (isTeacherPath && userRole !== "teacher" && userRole !== "admin") {
      const redirectUrl = new URL("/dashboard", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if trying to access admin-specific pages
    const isAdminPath = req.nextUrl.pathname.startsWith("/dashboard/admin")

    // If it's an admin path and user is not an admin, redirect
    if (isAdminPath && userRole !== "admin") {
      const redirectUrl = new URL("/dashboard", req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
