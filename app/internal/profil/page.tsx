import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getSessionFromCookie, AUTH_COOKIE_NAME, User } from "@/lib/auth"
import { createServiceClient } from "@/lib/supabase/server"
import { ProfilClient } from "./profil-client"

export default async function ProfilPage() {
  const cookieStore = await cookies()
  const sessionUser = getSessionFromCookie(cookieStore.get(AUTH_COOKIE_NAME)?.value)

  if (!sessionUser) {
    redirect("/internal/login")
  }

  const supabase = await createServiceClient()
  
  // Ambil data user paling baru dari tabel pengguna
  const { data: dbUser } = await supabase
    .from("pengguna")
    .select("id, nama, role, jabatan, username, desa, foto_url, ttd_url")
    .eq("id", sessionUser.id)
    .single()

  const user: User = dbUser ? {
    id: dbUser.id,
    nama: dbUser.nama,
    role: dbUser.role,
    jabatan: dbUser.jabatan,
    username: dbUser.username,
    desa: dbUser.desa,
    foto_url: dbUser.foto_url,
    ttd_url: dbUser.ttd_url,
  } : sessionUser

  return <ProfilClient user={user} />
}