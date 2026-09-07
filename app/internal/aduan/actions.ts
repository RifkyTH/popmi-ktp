"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/server"

export async function updateStatusAduan(
  tiket: string, 
  statusBaru: string, 
  catatan: string, 
  petugas: string
) {
  const supabase = await createServiceClient()
  
  // 1. Ambil ID pengaduan berdasarkan tiket
  const { data: pengaduan } = await supabase
    .from("pengaduan")
    .select("id")
    .eq("tiket", tiket)
    .single()
    
  if (!pengaduan) throw new Error("Aduan tidak ditemukan")

  // 2. Update status di tabel pengaduan
  await supabase
    .from("pengaduan")
    .update({ 
      status: statusBaru,
      respon_petugas: catatan,
      petugas_terkait: petugas,
      tanggal_update: new Date().toISOString()
    })
    .eq("id", pengaduan.id)

  // 3. Catat ke riwayat
  await supabase
    .from("pengaduan_riwayat")
    .insert({
      pengaduan_id: pengaduan.id,
      status: statusBaru,
      oleh: petugas,
      tanggal: new Date().toISOString(),
      catatan: catatan
    })

  // 4. Refresh halaman yang terkait
  revalidatePath(`/internal/aduan`)
  revalidatePath(`/internal/aduan/${tiket}`)
  revalidatePath(`/publik/pengaduan/${tiket}`)
  revalidatePath(`/publik/pengaduan/cek`)
  revalidatePath(`/internal/beranda`)
  
  return true
}
