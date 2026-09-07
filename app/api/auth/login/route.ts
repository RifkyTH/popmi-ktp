import { NextRequest, NextResponse } from "next/server"
import { loginFromSupabase, createSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()

  const user = await loginFromSupabase(username, password)
  
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = createSessionToken(user)
  const response = NextResponse.json({ ok: true, role: user.role })
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: false, // Biarkan false sementara supaya gampang terbaca jika ada isu
    secure: false, // Nonaktifkan karena lokal IP belum HTTPS
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  })

  return response
}
