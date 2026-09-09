import { NextRequest, NextResponse } from "next/server"
import { loginFromSupabase, createSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()

  const user = await loginFromSupabase(username, password)
  
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  // Log to system
  try {
    const supabase = await createServiceClient()
    await supabase.from("log_sistem").insert({
      aksi: "login",
      keterangan: `Berhasil login ke sistem`,
      oleh: user.nama
    })
  } catch (e) {
    // ignore logging errors to not break login
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
