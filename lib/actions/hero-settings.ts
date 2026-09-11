"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { getSessionFromCookie } from "@/lib/auth"
import {
  HeroBackgroundSettings,
  getHeroBackgroundSettings,
  saveHeroBackgroundSettings,
  DEFAULT_HERO_SETTINGS,
} from "@/lib/data/hero-settings"
import fs from "fs"
import path from "path"

export async function fetchHeroSettings(): Promise<HeroBackgroundSettings> {
  return getHeroBackgroundSettings()
}

export async function updateHeroSettings(newSettings: Partial<HeroBackgroundSettings>) {
  const cookieStore = await cookies()
  const user = getSessionFromCookie(cookieStore.get("silat_session")?.value)

  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    throw new Error("Akses ditolak: Hanya Super Administrator atau Admin yang dapat mengubah background animasi.")
  }

  const current = getHeroBackgroundSettings()
  const updated: HeroBackgroundSettings = {
    ...current,
    ...newSettings,
    updatedAt: new Date().toISOString(),
    updatedBy: user.nama || user.username || "Super Administrator",
  }

  saveHeroBackgroundSettings(updated)

  revalidatePath("/publik")
  revalidatePath("/")
  revalidatePath("/internal/pengaturan")

  return { success: true, settings: updated }
}

export async function uploadHeroMedia(formData: FormData) {
  const cookieStore = await cookies()
  const user = getSessionFromCookie(cookieStore.get("silat_session")?.value)

  if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
    throw new Error("Akses ditolak: Hanya Super Administrator atau Admin yang dapat mengupload background animasi.")
  }

  const file = formData.get("file") as File | null
  if (!file) {
    throw new Error("Tidak ada file yang diunggah.")
  }

  const allowedTypes = [
    "video/mp4",
    "video/webm",
    "image/gif",
    "image/webp",
    "image/jpeg",
    "image/png",
  ]

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Format file tidak didukung. Harap unggah video MP4/WebM atau gambar animasi GIF/WebP/PNG/JPG."
    )
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = path.join(process.cwd(), "public", "uploads", "hero")
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const ext = path.extname(file.name) || (file.type.includes("video") ? ".mp4" : ".gif")
  const cleanName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "")
  const filename = `hero-${Date.now()}-${cleanName}${ext}`
  const filePath = path.join(uploadDir, filename)

  fs.writeFileSync(filePath, buffer)

  const isVideo = file.type.startsWith("video/")
  const publicUrl = `/uploads/hero/${filename}`

  // Automatically update settings with the uploaded file
  const current = getHeroBackgroundSettings()
  const updated: HeroBackgroundSettings = {
    ...current,
    enabled: true,
    type: isVideo ? "video" : "image",
    url: publicUrl,
    title: file.name,
    updatedAt: new Date().toISOString(),
    updatedBy: user.nama || user.username || "Super Administrator",
  }

  saveHeroBackgroundSettings(updated)

  revalidatePath("/publik")
  revalidatePath("/")
  revalidatePath("/internal/pengaturan")

  return {
    success: true,
    url: publicUrl,
    type: isVideo ? ("video" as const) : ("image" as const),
    settings: updated,
  }
}
