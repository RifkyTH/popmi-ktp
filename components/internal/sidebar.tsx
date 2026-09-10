"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { User, UserRole } from "@/lib/auth"
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  Archive,
  BarChart3,
  Settings,
  Building2,
  LogOut,
  ChevronRight,
  Users,
  MessageSquareWarning,
} from "lucide-react"

type NavItem = { href: string; label: string; icon: React.ElementType }
type NavGroup = { group: string; items: NavItem[] }

function getNavItems(role: UserRole): NavGroup[] {
  const beranda: NavItem = { href: "/internal/beranda", label: "Beranda", icon: LayoutDashboard }
  const daftarSurat: NavItem = { href: "/internal/surat", label: "Daftar Surat", icon: FileText }
  const buatSurat: NavItem = { href: "/internal/surat/baru", label: "Buat Surat Baru", icon: FilePlus }
  const arsip: NavItem = { href: "/internal/arsip", label: "Arsip Surat", icon: Archive }
  const pengajuanDesa: NavItem = { href: "/internal/pengajuan-desa", label: "Pengajuan Desa", icon: Building2 }
  const aduan: NavItem = { href: "/internal/aduan", label: "Aduan Masyarakat", icon: MessageSquareWarning }
  const rekap: NavItem = { href: "/internal/rekap", label: "Rekap & Statistik", icon: BarChart3 }
  const pengaturan: NavItem = { href: "/internal/pengaturan", label: "Pengaturan", icon: Settings }
  const pengguna: NavItem = { href: "/internal/pengguna", label: "Manajemen User", icon: Users }

  switch (role) {
    case "super_admin":
      return [
        { group: "Utama", items: [beranda] },
        { group: "Surat & Rekomendasi", items: [daftarSurat, buatSurat, arsip] },
        { group: "Desa & Laporan", items: [aduan, rekap] },
        { group: "Sistem", items: [pengguna, pengaturan] },
      ]

    case "admin":
      return [
        { group: "Utama", items: [beranda] },
        { group: "Surat & Rekomendasi", items: [daftarSurat, buatSurat, arsip] },
        { group: "Desa & Laporan", items: [aduan, rekap] },
        { group: "Sistem", items: [pengaturan] },
      ]

    case "camat":
      return [
        { group: "Utama", items: [beranda] },
        { group: "Surat & Rekomendasi", items: [daftarSurat, arsip] },
        { group: "Laporan", items: [rekap] },
      ]

    case "sekretaris":
      return [
        { group: "Utama", items: [beranda] },
        { group: "Surat & Rekomendasi", items: [daftarSurat, buatSurat, arsip] },
        { group: "Desa & Laporan", items: [aduan, rekap] },
      ]

    case "kasi":
    case "kasi_pem":
    case "kasi_ekbang":
    case "kasi_kesos":
    case "kasi_ekobang":
    case "kasi_kessos":
      return [
        { group: "Utama", items: [beranda] },
        { group: "Surat & Rekomendasi", items: [daftarSurat, buatSurat, arsip] },
        { group: "Desa & Laporan", items: [aduan, rekap] },
      ]

    case "staf":
      return [
        { group: "Utama", items: [beranda] },
        { group: "Surat & Rekomendasi", items: [buatSurat, daftarSurat] },
      ]

    case "petugas":
      return [
        { group: "Utama", items: [beranda] },
        { group: "Pengaduan", items: [aduan] },
      ]

    default:
      return [{ group: "Utama", items: [beranda] }]
  }
}

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  camat: "Camat",
  sekretaris: "Sekretaris",
  kasi_pem: "Kasi Pem",
  kasi_ekbang: "Kasi Ekbang",
  kasi_kesos: "Kasi Kesos",
  kasi: "Kasi Pem",
  kasi_ekobang: "Kasi Ekbang",
  kasi_kessos: "Kasi Kesos",
  staf: "Staf",
  petugas: "Petugas",
}

export function Sidebar({ user }: { user: User | null }) {
  const pathname = usePathname()
  const role = user?.role ?? "staf"
  const navItems = getNavItems(role)

  return (
    <aside className="w-64 shrink-0 bg-hijau h-full flex-1 flex flex-col shadow-xl lg:shadow-none">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/internal/beranda" className="flex items-center gap-2.5">
          <div className="h-10 shrink-0 flex items-center justify-center">
            <img src="/logo-lingga.png" alt="Logo Lingga" className="h-full w-auto object-contain" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">POPMI KTP</p>
            <p className="text-white/50 text-xs mt-0.5">Internal Kecamatan</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-kuning flex items-center justify-center text-teks text-xs font-bold shrink-0">
            {user.nama.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate leading-tight">{user.nama}</p>
            <p className="text-white/50 text-[10px] mt-0.5">{ROLE_LABELS[role]}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navItems.map((group) => (
          <div key={group.group} className="mb-5">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest px-2 mb-1.5">
              {group.group}
            </p>
            {group.items.map((item) => {
              const isActive = (() => {
                if (pathname === item.href) return true
                if (item.href === "/internal/surat") {
                  return pathname.startsWith("/internal/surat/") && !pathname.startsWith("/internal/surat/baru")
                }
                return pathname.startsWith(item.href + "/")
              })()

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium mb-0.5 transition-colors",
                    isActive
                      ? "bg-kuning text-teks"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          href="/internal/login"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </Link>
      </div>
    </aside>
  )
}
