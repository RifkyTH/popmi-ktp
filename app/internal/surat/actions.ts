"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/server"
import { JenisSurat, NOMOR_FORMAT, generateNomorSurat } from "@/lib/mock-data/surat"

import { cookies } from "next/headers"
import { getSessionFromCookie } from "@/lib/auth"

export async function buatSuratBaru(jenis: JenisSurat, formData: Record<string, string>) {
  const supabase = await createServiceClient()
  const cookieStore = await cookies()
  const sessionUser = getSessionFromCookie(cookieStore.get("silat_session")?.value)
  const creatorName = sessionUser?.nama || "Sistem"

  const today = new Date()
  const dateStr = today.toISOString().split("T")[0]
  
  let pemohon = formData.pemohon || (formData.desa ? `Kepala Desa ${formData.desa}` : "Warga")
  
  if (jenis === "dispensasi_nikah") {
    pemohon = formData.namaSuami ? `${formData.namaSuami} & ${formData.namaIstri}` : pemohon
  }

  let judul = pemohon
  
  if (jenis === "dispensasi_nikah") judul = `Dispensasi Nikah a.n. ${pemohon}`
  else if (jenis === "ahli_waris") judul = `Surat Keterangan Ahli Waris a.n. ${pemohon}`
  else if (jenis === "bbm_jbkp" || jenis === "bbm_jbt") judul = `Rekomendasi BBM a.n. ${pemohon}`
  else if (jenis.startsWith("rekomendasi_")) judul = `Rekomendasi Desa ${formData.desa || ""}`
  else if (jenis === "pemberhentian_perangkat") judul = `Pemberhentian Perangkat Desa ${formData.desa || ""}`

  // Count total surat to generate unique number
  const { count } = await supabase.from("surat").select("*", { count: "exact", head: true })
  
  const newId = `S${String((count || 0) + 1).padStart(3, "0")}-${Date.now()}`
  const urutManual = formData.nomorUrut ? parseInt(formData.nomorUrut, 10) : null
  const nomor = generateNomorSurat(jenis, urutManual || ((count || 0) + 1), formData.nomorBulan, formData.nomorTahun)

  const { data: newSurat, error } = await supabase.from("surat").insert({
    id: newId,
    nomor,
    jenis,
    judul,
    pemohon,
    desa: formData.desa || formData.desaPengantar || null,
    tanggal_buat: dateStr,
    status: "draf",
    dibuat_oleh: creatorName,
    perihal: judul,
    data_form: formData,
  }).select().single()

  if (error) {
    throw new Error(error.message)
  }

  // Record history
  await supabase.from("surat_riwayat").insert({
    surat_id: newId,
    status: "draf",
    oleh: creatorName,
    tanggal: new Date().toISOString(),
    catatan: "Surat dibuat dari sistem",
  })

  revalidatePath("/internal/surat")
  revalidatePath("/internal/beranda")

  return newId
}

export async function editSurat(suratId: string, formData: Record<string, string>) {
  const supabase = await createServiceClient()

  const { data: existing } = await supabase.from("surat").select("jenis").eq("id", suratId).single()
  if (!existing) throw new Error("Surat tidak ditemukan")

  const jenis = existing.jenis as JenisSurat
  let pemohon = formData.pemohon || (formData.desa ? `Kepala Desa ${formData.desa}` : "Warga")
  if (jenis === "dispensasi_nikah") {
    pemohon = formData.namaSuami ? `${formData.namaSuami} & ${formData.namaIstri}` : pemohon
  }

  let judul = pemohon
  if (jenis === "dispensasi_nikah") judul = `Dispensasi Nikah a.n. ${pemohon}`
  else if (jenis === "ahli_waris") judul = `Surat Keterangan Ahli Waris a.n. ${pemohon}`
  else if (jenis === "bbm_jbkp" || jenis === "bbm_jbt") judul = `Rekomendasi BBM a.n. ${pemohon}`
  else if (jenis.startsWith("rekomendasi_")) judul = `Rekomendasi Desa ${formData.desa || ""}`
  else if (jenis === "pemberhentian_perangkat") judul = `Pemberhentian Perangkat Desa ${formData.desa || ""}`

  const { error } = await supabase.from("surat").update({
    judul,
    pemohon,
    desa: formData.desa || formData.desaPengantar || null,
    perihal: judul,
    data_form: formData,
  }).eq("id", suratId)

  if (error) throw new Error(error.message)

  revalidatePath("/internal/surat")
  revalidatePath(`/internal/surat/${suratId}`)
}

export async function verifikasiKasi(suratId: string, namaKasi: string) {
  const supabase = await createServiceClient()
  
  const { error } = await supabase
    .from("surat")
    .update({ 
      status: "verifikasi",
      diverifikasi_oleh: namaKasi
    })
    .eq("id", suratId)

  if (error) throw new Error(error.message)

  await supabase.from("surat_riwayat").insert({
    surat_id: suratId,
    status: "verifikasi",
    oleh: namaKasi,
    tanggal: new Date().toISOString(),
    catatan: "Diverifikasi oleh Kasi",
  })

  revalidatePath("/internal/surat")
  revalidatePath(`/internal/surat/${suratId}`)
}

export async function hapusSurat(suratId: string) {
  const supabase = await createServiceClient()
  
  // Hapus riwayat dulu karena ada foreign key constraint (jika ada)
  await supabase.from("surat_riwayat").delete().eq("surat_id", suratId)
  
  // Hapus surat utama
  const { error } = await supabase.from("surat").delete().eq("id", suratId)
  if (error) throw new Error(error.message)

  revalidatePath("/internal/surat")
  revalidatePath("/internal/beranda")
}

export async function hapusSemuaSurat() {
  const supabase = await createServiceClient()
  await supabase.from('surat_riwayat').delete().not('id', 'is', null)
  const { error } = await supabase.from('surat').delete().not('id', 'is', null)
  if (error) throw new Error(error.message)
  revalidatePath('/internal/surat')
}

export async function terbitkanSurat(suratId: string, namaCamat: string) {
  const supabase = await createServiceClient()
  
  const { error } = await supabase
    .from("surat")
    .update({ 
      status: "terbit",
      disetujui_oleh: namaCamat
    })
    .eq("id", suratId)

  if (error) throw new Error(error.message)

  await supabase.from("surat_riwayat").insert({
    surat_id: suratId,
    status: "terbit",
    oleh: namaCamat,
    tanggal: new Date().toISOString(),
    catatan: "Ditandatangani dan diterbitkan oleh Camat",
  })

  revalidatePath("/internal/surat")
  revalidatePath(`/internal/surat/${suratId}`)
}

export async function teruskanKeCamat(suratId: string, namaStaf: string) {
  const supabase = await createServiceClient()
  
  const { error } = await supabase
    .from("surat")
    .update({ 
      status: "menunggu_ttd"
    })
    .eq("id", suratId)

  if (error) throw new Error(error.message)

  await supabase.from("surat_riwayat").insert({
    surat_id: suratId,
    status: "menunggu_ttd",
    oleh: namaStaf,
    tanggal: new Date().toISOString(),
    catatan: "Diteruskan ke Camat untuk TTD",
  })

  revalidatePath("/internal/surat")
  revalidatePath(`/internal/surat/${suratId}`)
}
