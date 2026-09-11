"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/server"
import { INFORMASI_DATA, type Informasi, type KategoriInfo } from "@/lib/mock-data/informasi"
import { cookies } from "next/headers"
import { getSessionFromCookie } from "@/lib/auth"
import {
  isItemHeadline,
  saveHeadlineIdentifier,
  removeHeadlineIdentifier,
} from "@/lib/data/headline-store"

export async function getInformasiList(options?: {
  publishedOnly?: boolean
  kategori?: string
  onlyHeadline?: boolean
}): Promise<Informasi[]> {
  try {
    const supabase = await createServiceClient()
    let query = supabase.from("informasi").select("*").order("tanggal", { ascending: false })

    if (options?.publishedOnly) {
      query = query.eq("published", true)
    }
    if (options?.kategori && options.kategori !== "semua") {
      query = query.eq("kategori", options.kategori)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      // Fallback to rich mock data if empty or error
      let list = INFORMASI_DATA.map((item) => ({
        ...item,
        is_headline: isItemHeadline(item),
      }))
      if (options?.publishedOnly) {
        list = list.filter((item) => item.published !== false)
      }
      if (options?.kategori && options.kategori !== "semua") {
        list = list.filter((item) => item.kategori === options.kategori)
      }
      if (options?.onlyHeadline) {
        list = list.filter((item) => item.is_headline)
      }
      return list
    }

    let result = (data as Informasi[]).map((item) => ({
      ...item,
      is_headline: isItemHeadline(item),
    }))

    if (options?.onlyHeadline) {
      result = result.filter((item) => item.is_headline)
    }
    return result
  } catch {
    // If Supabase is unreachable, fallback safely to initial data
    let list = INFORMASI_DATA.map((item) => ({
      ...item,
      is_headline: isItemHeadline(item),
    }))
    if (options?.publishedOnly) {
      list = list.filter((item) => item.published !== false)
    }
    if (options?.kategori && options.kategori !== "semua") {
      list = list.filter((item) => item.kategori === options.kategori)
    }
    if (options?.onlyHeadline) {
      list = list.filter((item) => item.is_headline)
    }
    return list
  }
}

export async function getInformasiBySlug(slug: string): Promise<Informasi | null> {
  try {
    const supabase = await createServiceClient()
    const { data, error } = await supabase
      .from("informasi")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error || !data) {
      const mock = INFORMASI_DATA.find((item) => item.slug === slug)
      if (!mock) return null
      return {
        ...mock,
        is_headline: isItemHeadline(mock),
      }
    }

    const item = data as Informasi
    return {
      ...item,
      is_headline: isItemHeadline(item),
    }
  } catch {
    const mock = INFORMASI_DATA.find((item) => item.slug === slug)
    if (!mock) return null
    return {
      ...mock,
      is_headline: isItemHeadline(mock),
    }
  }
}

export async function simpanInformasi(data: {
  id?: string
  judul: string
  kategori: KategoriInfo
  ringkasan: string
  isi: string
  tanggal?: string
  penulis?: string
  gambar?: string
  published?: boolean
  is_headline?: boolean
}) {
  const supabase = await createServiceClient()

  // Get logged-in author
  let defaultAuthor = "Admin Kecamatan"
  try {
    const cookieStore = await cookies()
    const sessionUser = getSessionFromCookie(cookieStore.get("silat_session")?.value)
    if (sessionUser?.nama) {
      defaultAuthor = `${sessionUser.nama} (${sessionUser.jabatan || "Aparatur"})`
    }
  } catch {}

  const tanggal = data.tanggal || new Date().toISOString().split("T")[0]
  const penulis = data.penulis?.trim() || defaultAuthor
  const published = data.published ?? true
  const is_headline = data.is_headline ?? false

  // Generate clean slug
  const baseSlug = data.judul
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80)

  if (data.id) {
    // 1. Update existing
    let updateRes = await supabase
      .from("informasi")
      .update({
        judul: data.judul,
        kategori: data.kategori,
        ringkasan: data.ringkasan,
        isi: data.isi,
        tanggal,
        penulis,
        gambar: data.gambar || null,
        published,
        is_headline,
      })
      .eq("id", data.id)

    // Fallback: If 'is_headline' column doesn't exist in Supabase schema cache, retry without it
    if (updateRes.error && updateRes.error.message.includes("is_headline")) {
      updateRes = await supabase
        .from("informasi")
        .update({
          judul: data.judul,
          kategori: data.kategori,
          ringkasan: data.ringkasan,
          isi: data.isi,
          tanggal,
          penulis,
          gambar: data.gambar || null,
          published,
        })
        .eq("id", data.id)
    }

    if (updateRes.error) {
      throw new Error(`Gagal memperbarui informasi: ${updateRes.error.message}`)
    }

    // Persist headline state in store
    saveHeadlineIdentifier(data.id, is_headline)
  } else {
    // 2. Create new
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`
    let insertRes = await supabase
      .from("informasi")
      .insert({
        slug,
        judul: data.judul,
        kategori: data.kategori,
        ringkasan: data.ringkasan,
        isi: data.isi,
        tanggal,
        penulis,
        gambar: data.gambar || null,
        published,
        is_headline,
      })
      .select()
      .single()

    // Fallback: If 'is_headline' column doesn't exist in Supabase schema cache, retry without it
    if (insertRes.error && insertRes.error.message.includes("is_headline")) {
      insertRes = await supabase
        .from("informasi")
        .insert({
          slug,
          judul: data.judul,
          kategori: data.kategori,
          ringkasan: data.ringkasan,
          isi: data.isi,
          tanggal,
          penulis,
          gambar: data.gambar || null,
          published,
        })
        .select()
        .single()
    }

    if (insertRes.error) {
      throw new Error(`Gagal menambahkan informasi: ${insertRes.error.message}`)
    }

    // Persist headline state in store
    saveHeadlineIdentifier(slug, is_headline)
    if (insertRes.data?.id) {
      saveHeadlineIdentifier(insertRes.data.id, is_headline)
    }
  }

  revalidatePath("/publik")
  revalidatePath("/publik/informasi")
  revalidatePath("/internal/informasi")
  return { success: true }
}

export async function hapusInformasi(id: string) {
  const supabase = await createServiceClient()
  const { error } = await supabase.from("informasi").delete().eq("id", id)

  if (error) {
    throw new Error(`Gagal menghapus informasi: ${error.message}`)
  }

  removeHeadlineIdentifier(id)

  revalidatePath("/publik")
  revalidatePath("/publik/informasi")
  revalidatePath("/internal/informasi")
  return { success: true }
}

export async function toggleStatusPublikasi(id: string, newStatus: boolean) {
  const supabase = await createServiceClient()
  const { error } = await supabase
    .from("informasi")
    .update({ published: newStatus })
    .eq("id", id)

  if (error) {
    throw new Error(`Gagal mengubah status publikasi: ${error.message}`)
  }

  revalidatePath("/publik")
  revalidatePath("/publik/informasi")
  revalidatePath("/internal/informasi")
  return { success: true }
}

export async function toggleStatusHeadline(id: string, newHeadline: boolean) {
  const supabase = await createServiceClient()
  const { error } = await supabase
    .from("informasi")
    .update({ is_headline: newHeadline })
    .eq("id", id)

  if (error && !error.message.includes("is_headline")) {
    throw new Error(`Gagal mengubah status slide show: ${error.message}`)
  }

  saveHeadlineIdentifier(id, newHeadline)

  revalidatePath("/publik")
  revalidatePath("/publik/informasi")
  revalidatePath("/internal/informasi")
  return { success: true }
}
