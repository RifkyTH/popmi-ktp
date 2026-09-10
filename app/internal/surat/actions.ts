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

export async function terbitkanSurat(suratId: string, namaCamat?: string) {
  const supabase = await createServiceClient()
  
  // Ambil data Camat definitif dari tabel pengguna
  const { data: camatUser } = await supabase
    .from("pengguna")
    .select("id, nama, jabatan, ttd_url")
    .eq("role", "camat")
    .maybeSingle()

  const officialCamatNama = camatUser?.nama || "HENDRA, S.STP"
  const camatTtdUrl = camatUser?.ttd_url || "/ttd-camat.jpeg"

  // Update data_form jika ada ttd_url resmi Camat
  const { data: currentSurat } = await supabase.from("surat").select("data_form, tanggal_terbit").eq("id", suratId).single()
  const currentDataForm = (currentSurat?.data_form || {}) as Record<string, any>
  currentDataForm.ttd_camat_url = camatTtdUrl

  const cookieStore = await cookies()
  const sessionUser = getSessionFromCookie(cookieStore.get("silat_session")?.value)

  const { error } = await supabase
    .from("surat")
    .update({ 
      status: "terbit",
      disetujui_oleh: officialCamatNama,
      tanggal_terbit: currentSurat?.tanggal_terbit || new Date().toISOString().split("T")[0],
      data_form: currentDataForm,
    })
    .eq("id", suratId)

  if (error) throw new Error(error.message)

  await supabase.from("surat_riwayat").insert({
    surat_id: suratId,
    status: "terbit",
    oleh: officialCamatNama,
    tanggal: new Date().toISOString(),
    catatan: sessionUser?.role === "super_admin" && sessionUser.nama !== officialCamatNama
      ? `Ditandatangani dan diterbitkan atas nama Camat (${officialCamatNama}) oleh Super Admin`
      : "Ditandatangani dan diterbitkan oleh Camat",
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

  // Cek override penandatangan oleh superadmin
  const overrideKey = verifikatorKey === "jubir" ? "penandatangan_jubir" : "penandatangan_zakaria"
  const overrideUser = currentDataForm[overrideKey] as { userId: string; nama: string; ttd_url: string | null } | undefined

  // Ambil ttd_url: prioritaskan dari user yang di-override, lalu fallback ke user default
  let signerTtdUrl: string | null = null

  if (overrideUser?.userId) {
    // Ada override — ambil TTD terbaru dari DB untuk user yang dipilih superadmin
    const { data: u } = await supabase
      .from("pengguna")
      .select("ttd_url, nama")
      .eq("id", overrideUser.userId)
      .single()
    signerTtdUrl = u?.ttd_url || null
  } else if (verifikatorKey === "jubir") {
    const { data: u } = await supabase
      .from("pengguna")
      .select("ttd_url")
      .eq("username", "jubir")
      .not("ttd_url", "is", null)
      .maybeSingle()
    signerTtdUrl = u?.ttd_url || null
    // fallback ke role sekretaris jika tidak ada
    if (!signerTtdUrl) {
      const { data: u2 } = await supabase
        .from("pengguna")
        .select("ttd_url")
        .eq("role", "sekretaris")
        .not("ttd_url", "is", null)
        .maybeSingle()
      signerTtdUrl = u2?.ttd_url || null
    }
  } else {
    const { data: u } = await supabase
      .from("pengguna")
      .select("ttd_url")
      .eq("username", "zakaria")
      .not("ttd_url", "is", null)
      .maybeSingle()
    signerTtdUrl = u?.ttd_url || null
    if (!signerTtdUrl) {
      const { data: u2 } = await supabase
        .from("pengguna")
        .select("ttd_url")
        .eq("role", "kasi_kesos")
        .not("ttd_url", "is", null)
        .maybeSingle()
      signerTtdUrl = u2?.ttd_url || null
    }
  }

  // Nama efektif penandatangan (dari override jika ada)
  const namaEfektif = overrideUser?.nama || namaVerifikator

  const updatedDataForm = {
    ...currentDataForm,
    [`ttd_${verifikatorKey}`]: true,
    [`ttd_${verifikatorKey}_oleh`]: namaEfektif,
    [`ttd_${verifikatorKey}_tanggal`]: new Date().toISOString(),
  }

  // PENTING: Jika verifikator sudah mengupload TTD di profilnya, simpan URL-nya.
  // Jika verifikator BELUM upload TTD, WAJIB hapus field URL TTD agar kosong!
  if (signerTtdUrl) {
    updatedDataForm[`ttd_${verifikatorKey}_url`] = signerTtdUrl
  } else {
    delete updatedDataForm[`ttd_${verifikatorKey}_url`]
  }

  // Nama efektif kedua verifikator untuk catatan diverifikasi_oleh
  const namaJubir = (currentDataForm.penandatangan_jubir as { nama: string } | undefined)?.nama 
    || currentDataForm.verifikator_1_nama 
    || (verifikatorKey === "jubir" ? namaEfektif : "JUBIR, S.Pd.SD")
  const namaZakaria = (currentDataForm.penandatangan_zakaria as { nama: string } | undefined)?.nama 
    || currentDataForm.verifikator_2_nama 
    || (verifikatorKey === "zakaria" ? namaEfektif : "ZAKARIA, A.Ma.Pd")

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
      diverifikasi_oleh: bothSigned ? `${namaJubir} & ${namaZakaria}` : namaEfektif
    })
    .eq("id", suratId)

  if (updateError) throw new Error(updateError.message)

  // Riwayat verifikasi individual
  await supabase.from("surat_riwayat").insert({
    surat_id: suratId,
    status: "verifikasi",
    oleh: namaEfektif,
    tanggal: new Date().toISOString(),
    catatan: `Berita Acara diverifikasi dan ditandatangani oleh ${namaEfektif}`,
  })

  // Jika keduanya lengkap, otomatis teruskan ke Camat
  if (bothSigned) {
    await supabase.from("surat_riwayat").insert({
      surat_id: suratId,
      status: "menunggu_ttd",
      oleh: "Sistem (Tim Verifikasi Lengkap)",
      tanggal: new Date().toISOString(),
      catatan: `Verifikasi Berita Acara lengkap oleh ${namaJubir} & ${namaZakaria}. Otomatis diteruskan ke Camat untuk TTD.`,
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

/**
 * Ubah penandatangan slot verifikasi (jubir/zakaria) — hanya superadmin
 * Jika user baru belum upload TTD, ttd_url akan null → slot gambar kosong
 */
export async function ubahVerifikator(
  suratId: string,
  slot: "jubir" | "zakaria",
  userId: string // id user baru yang dipilih superadmin
) {
  const supabase = await createServiceClient()

  // Verifikasi akses
  const cookieStore = await cookies()
  const sessionUser = getSessionFromCookie(cookieStore.get("silat_session")?.value)
  if (!sessionUser || (sessionUser.role !== "super_admin" && sessionUser.role !== "admin")) {
    throw new Error("Akses ditolak")
  }

  // Ambil data user baru yang dipilih
  const { data: targetUser } = await supabase
    .from("pengguna")
    .select("id, nama, jabatan, ttd_url")
    .eq("id", userId)
    .single()

  if (!targetUser) throw new Error("Pengguna tidak ditemukan")

  // Ambil data surat sekarang
  const { data: surat } = await supabase
    .from("surat")
    .select("data_form, status, diverifikasi_oleh")
    .eq("id", suratId)
    .single()

  if (!surat) throw new Error("Surat tidak ditemukan")

  const currentDataForm = { ...((surat.data_form || {}) as Record<string, any>) }

  // Simpan override penandatangan: nama user baru + ttd_url mereka (bisa null)
  currentDataForm[`penandatangan_${slot}`] = {
    userId: targetUser.id,
    nama: targetUser.nama,
    jabatan: targetUser.jabatan,
    ttd_url: targetUser.ttd_url || null,
  }

  // Simpan juga nama untuk PDF (verifikator_1_nama / verifikator_2_nama)
  const pdfNamaKey = slot === "jubir" ? "verifikator_1_nama" : "verifikator_2_nama"
  currentDataForm[pdfNamaKey] = targetUser.nama

  // Reset TTD dan URL TTD lama pada slot ini karena orangnya diganti
  delete currentDataForm[`ttd_${slot}`]
  delete currentDataForm[`ttd_${slot}_oleh`]
  delete currentDataForm[`ttd_${slot}_tanggal`]
  delete currentDataForm[`ttd_${slot}_url`]

  // Perbarui status jika perlu: jika sebelumnya menunggu_ttd, kembalikan ke verifikasi
  let newStatus = surat.status
  if (surat.status === "menunggu_ttd") {
    newStatus = "verifikasi"
  }

  await supabase.from("surat").update({
    data_form: currentDataForm,
    status: newStatus,
  }).eq("id", suratId)

  await supabase.from("surat_riwayat").insert({
    surat_id: suratId,
    status: newStatus,
    oleh: sessionUser.nama,
    tanggal: new Date().toISOString(),
    catatan: `Penandatangan slot ${slot === "jubir" ? "1" : "2"} diubah menjadi ${targetUser.nama} oleh ${sessionUser.nama}`,
  })

  revalidatePath("/internal/surat")
  revalidatePath(`/internal/surat/${suratId}`)
  revalidatePath(`/internal/surat/${suratId}/cetak`)
  revalidatePath("/internal/beranda")
}
