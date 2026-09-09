"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { getSessionFromCookie } from "@/lib/auth"

async function getOperatorName(): Promise<string> {
  const cookieStore = await cookies()
  const sessionUser = getSessionFromCookie(cookieStore.get("silat_session")?.value)
  return sessionUser?.nama || sessionUser?.username || "Petugas"
}

export async function tambahPengaduan(data: {
  nama: string
  kontak: string
  desa: string
  kategori: string
  judul: string
  deskripsi: string
  lokasi?: string
  status?: string
}) {
  const supabase = await createServiceClient()
  const operatorName = await getOperatorName()
  const now = new Date().toISOString()
  const year = new Date().getFullYear()

  // Buat nomor tiket unik
  const { count } = await supabase.from("pengaduan").select("*", { count: "exact", head: true })
  const tiket = `TP-${year}-${String((count || 0) + 1).padStart(5, "0")}`

  const status = data.status || "masuk"

  const { data: newPengaduan, error } = await supabase.from("pengaduan").insert({
    tiket,
    nama: data.nama,
    kontak: data.kontak,
    kategori: data.kategori,
    judul: data.judul,
    deskripsi: data.deskripsi,
    desa: data.desa,
    lokasi: data.lokasi || null,
    status,
    petugas_terkait: operatorName,
    tanggal_masuk: now,
    tanggal_update: now,
  }).select().single()

  if (error) {
    throw new Error(error.message)
  }

  // Riwayat
  await supabase.from("pengaduan_riwayat").insert({
    pengaduan_id: newPengaduan.id,
    status,
    oleh: operatorName,
    tanggal: now,
    catatan: "Pengaduan dicatat melalui sistem internal",
  })

  // Log sistem
  await supabase.from("log_sistem").insert({
    aksi: "Tambah Pengaduan",
    keterangan: `Membuat aduan baru [${tiket}] "${data.judul}" pelapor ${data.nama}`,
    oleh: operatorName,
    tanggal: now,
  })

  revalidatePath(`/internal/aduan`)
  revalidatePath(`/internal/beranda`)
  revalidatePath(`/publik/pengaduan/cek`)

  return newPengaduan
}

export async function editPengaduan(
  id: string,
  data: {
    nama: string
    kontak: string
    desa: string
    kategori: string
    judul: string
    deskripsi: string
    lokasi?: string
    status?: string
  }
) {
  const supabase = await createServiceClient()
  const operatorName = await getOperatorName()
  const now = new Date().toISOString()

  const { data: oldData } = await supabase
    .from("pengaduan")
    .select("tiket, status")
    .eq("id", id)
    .single()

  const { error } = await supabase
    .from("pengaduan")
    .update({
      nama: data.nama,
      kontak: data.kontak,
      desa: data.desa,
      kategori: data.kategori,
      judul: data.judul,
      deskripsi: data.deskripsi,
      lokasi: data.lokasi || null,
      status: data.status || oldData?.status || "masuk",
      tanggal_update: now,
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  // Log sistem
  await supabase.from("log_sistem").insert({
    aksi: "Edit Pengaduan",
    keterangan: `Mengubah data aduan [${oldData?.tiket || id}] "${data.judul}"`,
    oleh: operatorName,
    tanggal: now,
  })

  revalidatePath(`/internal/aduan`)
  if (oldData?.tiket) {
    revalidatePath(`/internal/aduan/${oldData.tiket}`)
    revalidatePath(`/publik/pengaduan/${oldData.tiket}`)
  }
  revalidatePath(`/internal/beranda`)

  return true
}

export async function hapusPengaduan(id: string) {
  const supabase = await createServiceClient()
  const operatorName = await getOperatorName()

  const { data: pengaduan } = await supabase
    .from("pengaduan")
    .select("tiket, judul, nama")
    .eq("id", id)
    .single()

  // Log sistem sebelum delete agar tidak terhapus
  await supabase.from("log_sistem").insert({
    aksi: "Hapus Pengaduan",
    keterangan: `Menghapus aduan [${pengaduan?.tiket || id}] "${pengaduan?.judul || "-"}" pelapor ${pengaduan?.nama || "-"}`,
    oleh: operatorName,
    tanggal: new Date().toISOString(),
  })

  // Hapus riwayat aduan
  await supabase.from("pengaduan_riwayat").delete().eq("pengaduan_id", id)

  // Hapus pengaduan
  const { error } = await supabase.from("pengaduan").delete().eq("id", id)
  if (error) throw new Error(error.message)

  revalidatePath(`/internal/aduan`)
  revalidatePath(`/internal/beranda`)
  revalidatePath(`/publik/pengaduan/cek`)

  return true
}

export async function hapusSemuaPengaduan() {
  const supabase = await createServiceClient()
  const operatorName = await getOperatorName()

  await supabase.from("log_sistem").insert({
    aksi: "Hapus Pengaduan",
    keterangan: "Menghapus seluruh data pengaduan masyarakat",
    oleh: operatorName,
    tanggal: new Date().toISOString(),
  })

  await supabase.from("pengaduan_riwayat").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  await supabase.from("pengaduan").delete().neq("id", "00000000-0000-0000-0000-000000000000")

  revalidatePath(`/internal/aduan`)
  revalidatePath(`/internal/beranda`)

  return true
}

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
    .select("id, judul, nama")
    .eq("tiket", tiket)
    .single()
    
  if (!pengaduan) throw new Error("Aduan tidak ditemukan")

  const now = new Date().toISOString()

  // 2. Update status di tabel pengaduan
  await supabase
    .from("pengaduan")
    .update({ 
      status: statusBaru,
      respon_petugas: catatan,
      petugas_terkait: petugas,
      tanggal_update: now
    })
    .eq("id", pengaduan.id)

  // 3. Catat ke riwayat
  await supabase
    .from("pengaduan_riwayat")
    .insert({
      pengaduan_id: pengaduan.id,
      status: statusBaru,
      oleh: petugas,
      tanggal: now,
      catatan: catatan
    })

  // 4. Log ke log_sistem
  await supabase.from("log_sistem").insert({
    aksi: "Proses Pengaduan",
    keterangan: `Update status aduan [${tiket}] menjadi "${statusBaru}" - ${catatan}`,
    oleh: petugas,
    tanggal: now,
  })

  // 5. Refresh halaman yang terkait
  revalidatePath(`/internal/aduan`)
  revalidatePath(`/internal/aduan/${tiket}`)
  revalidatePath(`/publik/pengaduan/${tiket}`)
  revalidatePath(`/publik/pengaduan/cek`)
  revalidatePath(`/internal/beranda`)
  
  return true
}
