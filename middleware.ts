import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionFromCookie } from "@/lib/auth"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect internal routes (except login and cetak)
  if (
    pathname.startsWith("/internal") &&
    !pathname.startsWith("/internal/login") &&
    !pathname.includes("/cetak")
  ) {
    const sessionCookie = request.cookies.get("silat_session")
    if (!sessionCookie) {
      const loginUrl = new URL("/internal/login", request.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Guard: /internal/pengguna hanya untuk super_admin
    if (pathname.startsWith("/internal/pengguna")) {
      const user = getSessionFromCookie(sessionCookie.value)
      if (!user || user.role !== "super_admin") {
        return NextResponse.redirect(new URL("/internal/beranda", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/internal/:path*"],
}
