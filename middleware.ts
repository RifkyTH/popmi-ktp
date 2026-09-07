import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect internal routes (except login and cetak)
  if (
    pathname.startsWith("/internal") &&
    !pathname.startsWith("/internal/login") &&
    !pathname.includes("/cetak")
  ) {
    const session = request.cookies.get("silat_session")
    if (!session) {
      const loginUrl = new URL("/internal/login", request.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/internal/:path*"],
}
