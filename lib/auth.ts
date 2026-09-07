import { createServiceClient } from "@/lib/supabase/server"

export type UserRole = "staf" | "kasi" | "camat" | "admin" | "operator_desa" | "petugas"
export type User = { id: string; nama: string; role: UserRole; jabatan: string; username: string }

export const AUTH_COOKIE_NAME = "silat_session"

export async function loginFromSupabase(username: string, password: string): Promise<User | null> {
  const supabase = await createServiceClient()
  const { data } = await supabase
    .from("pengguna")
    .select("id, nama, role, jabatan, username")
    .eq("username", username)
    .eq("password", password)
    .eq("aktif", true)
    .single()
  return data || null
}

export function createSessionToken(user: User): string {
  // Simpan data lengkap agar layout bisa baca tanpa query DB tambahan
  return btoa(JSON.stringify({ id: user.id, nama: user.nama, role: user.role, jabatan: user.jabatan, username: user.username }))
}

export function getSessionFromCookie(cookieValue: string | undefined): User | null {
  if (!cookieValue) return null
  try {
    const data = JSON.parse(atob(cookieValue))
    return data as User
  } catch {
    return null
  }
}
