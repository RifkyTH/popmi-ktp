"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServiceClient } from "@/lib/supabase/server"
import { AUTH_COOKIE_NAME, getSessionFromCookie, createSessionToken } from "@/lib/auth"

export async function simpanFotoProfil(userId: string, fotoUrl: string) {
  const supabase = await createServiceClient()
  
  const { error } = await supabase
    .from("pengguna")
    .update({ foto_url: fotoUrl })
    .eq("id", userId)

  if (error) throw new Error(error.message)

  const cookieStore = await cookies()
  const currentSession = getSessionFromCookie(cookieStore.get(AUTH_COOKIE_NAME)?.value)
  if (currentSession && currentSession.id === userId) {
    const updatedUser = { ...currentSession, foto_url: fotoUrl }
    cookieStore.set(AUTH_COOKIE_NAME, createSessionToken(updatedUser), {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    })
  }

  revalidatePath("/internal")
  revalidatePath("/internal/profil")
}

export async function hapusFotoProfil(userId: string) {
  const supabase = await createServiceClient()

  const { error } = await supabase
    .from("pengguna")
    .update({ foto_url: null })
    .eq("id", userId)

  if (error) throw new Error(error.message)

  const cookieStore = await cookies()
  const currentSession = getSessionFromCookie(cookieStore.get(AUTH_COOKIE_NAME)?.value)
  if (currentSession && currentSession.id === userId) {
    const updatedUser = { ...currentSession, foto_url: null }
    cookieStore.set(AUTH_COOKIE_NAME, createSessionToken(updatedUser), {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    })
  }

  revalidatePath("/internal")
  revalidatePath("/internal/profil")
}

export async function simpanTtdProfil(userId: string, ttdUrl: string) {
  const supabase = await createServiceClient()

  const { error } = await supabase
    .from("pengguna")
    .update({ ttd_url: ttdUrl })
    .eq("id", userId)

  if (error) throw new Error(error.message)

  const cookieStore = await cookies()
  const currentSession = getSessionFromCookie(cookieStore.get(AUTH_COOKIE_NAME)?.value)
  if (currentSession && currentSession.id === userId) {
    const updatedUser = { ...currentSession, ttd_url: ttdUrl }
    cookieStore.set(AUTH_COOKIE_NAME, createSessionToken(updatedUser), {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    })
  }

  revalidatePath("/internal")
  revalidatePath("/internal/profil")
  revalidatePath("/internal/surat")
  revalidatePath("/internal/surat/[id]", "page")
  revalidatePath("/internal/surat/[id]/cetak", "page")
}

export async function hapusTtdProfil(userId: string) {
  const supabase = await createServiceClient()

  const { error } = await supabase
    .from("pengguna")
    .update({ ttd_url: null })
    .eq("id", userId)

  if (error) throw new Error(error.message)

  const cookieStore = await cookies()
  const currentSession = getSessionFromCookie(cookieStore.get(AUTH_COOKIE_NAME)?.value)
  if (currentSession && currentSession.id === userId) {
    const updatedUser = { ...currentSession, ttd_url: null }
    cookieStore.set(AUTH_COOKIE_NAME, createSessionToken(updatedUser), {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    })
  }

  revalidatePath("/internal")
  revalidatePath("/internal/profil")
  revalidatePath("/internal/surat")
  revalidatePath("/internal/surat/[id]", "page")
  revalidatePath("/internal/surat/[id]/cetak", "page")
}