"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { getSessionFromCookie } from "@/lib/auth"
import type { UserRole } from "@/lib/auth"

async function checkSuperAdmin() {
  const cookieStore = await cookies()
  const user = getSessionFromCookie(cookieStore.get("silat_session")?.value)
  if (!user || user.role !== "super_admin") {
    throw new Error("Akses ditolak: hanya Super Admin yang dapat mengelola pengguna.")
  }
  return user
}

async function logSistem(supabase: any, aksi: string, keterangan: string, oleh: string) {
  await supabase.from("log_sistem").insert({ aksi, keterangan, oleh }).select()
}

export async function getPengguna() {
  await checkSuperAdmin()
  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from("pengguna")
    .select("id, nama, username, role, jabatan, desa, aktif, created_at")
    .order("created_at", { ascending: true })
  if (error) throw new Error(error.message)
  return data || []
}

export async function tambahPengguna(form: {
  nama: string
  username: string
  password: string
  role: UserRole
  jabatan: string
  desa?: string
}) {
  const admin = await checkSuperAdmin()
  const supabase = await createServiceClient()

  // Cek username sudah ada
  const { data: existing } = await supabase
    .from("pengguna")
    .select("id")
    .eq("username", form.username)
    .single()

  if (existing) throw new Error("Username sudah digunakan.")

  const { error } = await supabase.from("pengguna").insert({
    nama: form.nama,
    username: form.username,
    password: form.password,
    role: form.role,
    jabatan: form.jabatan,
    desa: form.desa || null,
    aktif: true,
  })

  if (error) throw new Error(error.message)
  
  await logSistem(supabase, "tambah_pengguna", `Menambahkan akun baru: ${form.nama} (${form.role})`, admin.nama)
  
  revalidatePath("/internal/pengguna")
}

export async function editPengguna(
  id: string,
  form: {
    nama: string
    role: UserRole
    jabatan: string
    desa?: string
    password?: string
  }
) {
  const admin = await checkSuperAdmin()
  const supabase = await createServiceClient()

  const updates: Record<string, string | null> = {
    nama: form.nama,
    role: form.role,
    jabatan: form.jabatan,
    desa: form.desa || null,
  }
  if (form.password && form.password.trim() !== "") {
    updates.password = form.password
  }

  const { error } = await supabase.from("pengguna").update(updates).eq("id", id)
  if (error) throw new Error(error.message)
    
  await logSistem(supabase, "edit_pengguna", `Mengubah data akun: ${form.nama}`, admin.nama)

  revalidatePath("/internal/pengguna")
}

export async function toggleAktifPengguna(id: string, aktif: boolean) {
  const admin = await checkSuperAdmin()
  const supabase = await createServiceClient()
  
  const { data: user } = await supabase.from("pengguna").select("nama").eq("id", id).single()
  
  const { error } = await supabase.from("pengguna").update({ aktif }).eq("id", id)
  if (error) throw new Error(error.message)
    
  await logSistem(supabase, "status_pengguna", `${aktif ? 'Mengaktifkan' : 'Menonaktifkan'} akun: ${user?.nama || id}`, admin.nama)

  revalidatePath("/internal/pengguna")
}

export async function hapusPengguna(id: string) {
  const admin = await checkSuperAdmin()
  const supabase = await createServiceClient()
  
  const { data: user } = await supabase.from("pengguna").select("nama").eq("id", id).single()
  
  const { error } = await supabase.from("pengguna").delete().eq("id", id)
  if (error) throw new Error(error.message)
    
  await logSistem(supabase, "hapus_pengguna", `Menghapus akun secara permanen: ${user?.nama || id}`, admin.nama)

  revalidatePath("/internal/pengguna")
}
