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
  const urutManual = formData.nomorUrut ? formData.nomorUrut : null
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

  const updatePayload: Record<string, any> = {
    judul,
    pemohon,
    desa: formData.desa || formData.desaPengantar || null,
    perihal: judul,
    data_form: formData,
  }

  if (formData.nomorUrut) {
    updatePayload.nomor = generateNomorSurat(jenis, formData.nomorUrut, formData.nomorBulan, formData.nomorTahun)
  }

  const { error } = await supabase.from("surat").update(updatePayload).eq("id", suratId)

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
  const cookieStore = await cookies()
  const sessionUser = getSessionFromCookie(cookieStore.get("silat_session")?.value)
  const creatorName = sessionUser?.nama || "Sistem"
  
  // Ambil data surat sebelum dihapus untuk log
  const { data: surat } = await supabase.from("surat").select("judul").eq("id", suratId).single()

  // Hapus riwayat dulu karena ada foreign key constraint (jika ada)
  await supabase.from("surat_riwayat").delete().eq("surat_id", suratId)
  
  // Hapus surat utama
  const { error } = await supabase.from("surat").delete().eq("id", suratId)
  if (error) throw new Error(error.message)

  // Log ke sistem
  if (surat) {
    await supabase.from("log_sistem").insert({
      aksi: "hapus_surat",
      keterangan: `Menghapus surat: ${surat.judul}`,
      oleh: creatorName
    })
  }

  revalidatePath("/internal/surat")
  revalidatePath("/internal/beranda")
}

export async function hapusSemuaSurat() {
  const supabase = await createServiceClient()
  const cookieStore = await cookies()
  const sessionUser = getSessionFromCookie(cookieStore.get("silat_session")?.value)
  const creatorName = sessionUser?.nama || "Sistem"

  await supabase.from('surat_riwayat').delete().not('id', 'is', null)
  const { error } = await supabase.from('surat').delete().not('id', 'is', null)
  if (error) throw new Error(error.message)

  await supabase.from("log_sistem").insert({
    aksi: "hapus_semua_surat",
    keterangan: `Menghapus seluruh data surat secara massal`,
    oleh: creatorName
  })

  revalidatePath('/internal/surat')
}

export async function terbitkanSurat(suratId: string, namaCamat: string) {
  const supabase = await createServiceClient()
  
  // Ambil TTD Camat jika ada di profil
  const cookieStore = await cookies()
  const sessionUser = getSessionFromCookie(cookieStore.get("silat_session")?.value)
  let camatTtdUrl = sessionUser?.ttd_url || null
  if (!camatTtdUrl) {
    const { data: u } = await supabase.from("pengguna").select("ttd_url").eq("role", "camat").not("ttd_url", "is", null).maybeSingle()
    camatTtdUrl = u?.ttd_url || null
  }

  // Update data_form jika ada ttd_url
  const { data: currentSurat } = await supabase.from("surat").select("data_form").eq("id", suratId).single()
  const currentDataForm = (currentSurat?.data_form || {}) as Record<string, any>
  if (camatTtdUrl) {
    currentDataForm.ttd_camat_url = camatTtdUrl
  }

  const { error } = await supabase
    .from("surat")
    .update({ 
      status: "terbit",
      disetujui_oleh: namaCamat,
      data_form: currentDataForm,
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
  revalidatePath(`/internal/surat/${suratId}/cetak`)
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

export async function arsipkanSurat(suratId: string, namaStaf: string) {
  const supabase = await createServiceClient()
  
  const { error } = await supabase
    .from("surat")
    .update({ 
      status: "terkirim"
    })
    .eq("id", suratId)

  if (error) throw new Error(error.message)

  await supabase.from("surat_riwayat").insert({
    surat_id: suratId,
    status: "terkirim",
    oleh: namaStaf,
    tanggal: new Date().toISOString(),
    catatan: "Surat telah diserahkan/dikirim dan diarsipkan",
  })

  revalidatePath("/internal/surat")
  revalidatePath(`/internal/surat/${suratId}`)
  revalidatePath("/internal/arsip")
}

export async function tandaTanganiVerifikasi(
  suratId: string,
  verifikatorKey: "jubir" | "zakaria",
  namaVerifikator: string
) {
  const supabase = await createServiceClient()

  const { data: surat, error: fetchError } = await supabase
    .from("surat")
    .select("data_form, judul, status")
    .eq("id", suratId)
    .single()

  if (fetchError || !surat) throw new Error("Surat tidak ditemukan")

  const currentDataForm = (surat.data_form || {}) as Record<string, any>

  // Ambil ttd_url dari profil signer jika ada
  const cookieStore = await cookies()
  const sessionUser = getSessionFromCookie(cookieStore.get("silat_session")?.value)
  let signerTtdUrl = sessionUser?.ttd_url || null
  if (!signerTtdUrl) {
    const { data: u } = await supabase
      .from("pengguna")
      .select("ttd_url")
      .ilike("nama", `%${verifikatorKey}%`)
      .not("ttd_url", "is", null)
      .maybeSingle()
    signerTtdUrl = u?.ttd_url || null
  }

  const updatedDataForm = {
    ...currentDataForm,
    [`ttd_${verifikatorKey}`]: true,
    [`ttd_${verifikatorKey}_oleh`]: namaVerifikator,
    [`ttd_${verifikatorKey}_tanggal`]: new Date().toISOString(),
    ...(signerTtdUrl ? { [`ttd_${verifikatorKey}_url`]: signerTtdUrl } : {}),
  }

  // Cek apakah kedua verifikator sudah menandatangani
  const isJubirSigned = verifikatorKey === "jubir" ? true : Boolean(currentDataForm.ttd_jubir && currentDataForm.ttd_jubir !== "false")
  const isZakariaSigned = verifikatorKey === "zakaria" ? true : Boolean(currentDataForm.ttd_zakaria && currentDataForm.ttd_zakaria !== "false")
  const bothSigned = isJubirSigned && isZakariaSigned

  // Jika kedua verifikator sudah TTD, otomatis ubah status ke 'menunggu_ttd' (diteruskan ke Camat)
  let newStatus = surat.status
  if (bothSigned) {
    newStatus = "menunggu_ttd"
  } else if (surat.status === "draf") {
    newStatus = "verifikasi"
  }

  const { error: updateError } = await supabase
    .from("surat")
    .update({ 
      data_form: updatedDataForm,
      status: newStatus,
      diverifikasi_oleh: bothSigned ? "Jubir, S.Pd.SD & Zakaria, A.Ma.Pd" : namaVerifikator
    })
    .eq("id", suratId)

  if (updateError) throw new Error(updateError.message)

  // Riwayat verifikasi individual
  await supabase.from("surat_riwayat").insert({
    surat_id: suratId,
    status: "verifikasi",
    oleh: namaVerifikator,
    tanggal: new Date().toISOString(),
    catatan: `Berita Acara diverifikasi dan ditandatangani oleh ${namaVerifikator}`,
  })

  // Jika keduanya lengkap, otomatis teruskan ke Camat
  if (bothSigned) {
    await supabase.from("surat_riwayat").insert({
      surat_id: suratId,
      status: "menunggu_ttd",
      oleh: "Sistem (Tim Verifikasi Lengkap)",
      tanggal: new Date().toISOString(),
      catatan: "Verifikasi Berita Acara lengkap oleh Jubir & Zakaria. Otomatis diteruskan ke Camat untuk TTD.",
    })
  }

  revalidatePath("/internal/surat")
  revalidatePath(`/internal/surat/${suratId}`)
  revalidatePath(`/internal/surat/${suratId}/cetak`)
  revalidatePath("/internal/beranda")
}

export async function batalkanTandaTanganiVerifikasi(
  suratId: string,
  verifikatorKey: "jubir" | "zakaria",
  namaUser: string
) {
  const supabase = await createServiceClient()
  const { data: surat } = await supabase.from("surat").select("data_form, status").eq("id", suratId).single()
  if (!surat) throw new Error("Surat tidak ditemukan")

  const currentDataForm = { ...((surat.data_form || {}) as Record<string, any>) }
  delete currentDataForm[`ttd_${verifikatorKey}`]
  delete currentDataForm[`ttd_${verifikatorKey}_oleh`]
  delete currentDataForm[`ttd_${verifikatorKey}_tanggal`]

  // Jika status sebelumnya menunggu_ttd, kembalikan ke verifikasi atau draf
  let newStatus = surat.status
  if (surat.status === "menunggu_ttd") {
    const remainingSigned = verifikatorKey === "jubir" 
      ? Boolean(currentDataForm.ttd_zakaria && currentDataForm.ttd_zakaria !== "false")
      : Boolean(currentDataForm.ttd_jubir && currentDataForm.ttd_jubir !== "false")
    newStatus = remainingSigned ? "verifikasi" : "draf"
  }

  await supabase.from("surat").update({ 
    data_form: currentDataForm,
    status: newStatus
  }).eq("id", suratId)

  await supabase.from("surat_riwayat").insert({
    surat_id: suratId,
    status: newStatus,
    oleh: namaUser,
    tanggal: new Date().toISOString(),
    catatan: `Tanda tangan verifikasi ${verifikatorKey === "jubir" ? "Jubir" : "Zakaria"} dibatalkan oleh ${namaUser}`,
  })

  revalidatePath("/internal/surat")
  revalidatePath(`/internal/surat/${suratId}`)
  revalidatePath(`/internal/surat/${suratId}/cetak`)
  revalidatePath("/internal/beranda")
}
