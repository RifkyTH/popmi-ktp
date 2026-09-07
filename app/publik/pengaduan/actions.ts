"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/server"

export async function simpanPengaduan(data: {
  tiket: string
  nama: string
  kontak: string
  desa: string
  kategori: string
  judul: string
  deskripsi: string
  lokasi?: string
}) {
  const supabase = await createServiceClient()
  const now = new Date().toISOString()
  
  const { data: newPengaduan, error } = await supabase.from("pengaduan").insert({
    tiket: data.tiket,
    nama: data.nama,
    kontak: data.kontak,
    kategori: data.kategori,
    judul: data.judul,
    deskripsi: data.deskripsi,
    desa: data.desa,
    lokasi: data.lokasi || null,
    status: "masuk",
    tanggal_masuk: now,
    tanggal_update: now,
  }).select().single()

  if (error) {
    throw new Error(error.message)
  }

  await supabase.from("pengaduan_riwayat").insert({
    pengaduan_id: newPengaduan.id,
    status: "masuk",
    oleh: "Sistem",
    tanggal: now,
    catatan: "Laporan masuk dari portal publik",
  })

  revalidatePath("/publik/pengaduan/cek")
  revalidatePath("/publik")
  revalidatePath("/publik/petugas")
  
  return data.tiket
}

export async function cariPengaduan(query: string) {
  const supabase = await createServiceClient()
  const q = query.trim()
  
  if (!q) return []
  
  const { data } = await supabase
    .from("pengaduan")
    .select("*")
    .or(`tiket.ilike.%${q}%,kontak.eq.${q}`)
    .order("tanggal_masuk", { ascending: false })
    
  return data || []
}
