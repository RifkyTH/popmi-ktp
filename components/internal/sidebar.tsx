"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
} from "lucide-react"

const navItems = [
  {
    group: "Utama",
    items: [
      { href: "/internal/beranda", label: "Beranda", icon: LayoutDashboard },
    ],
  },
  {
    group: "Surat & Rekomendasi",
    items: [
      { href: "/internal/surat", label: "Daftar Surat", icon: FileText },
      { href: "/internal/surat/baru", label: "Buat Surat Baru", icon: FilePlus },
      { href: "/internal/arsip", label: "Arsip Surat", icon: Archive },
    ],
  },
  {
    group: "Desa & Laporan",
    items: [
      { href: "/internal/pengajuan-desa", label: "Pengajuan Desa", icon: Building2 },
      { href: "/internal/aduan", label: "Aduan Masyarakat", icon: FileText },
      { href: "/internal/rekap", label: "Rekap & Statistik", icon: BarChart3 },
    ],
  },
  {
    group: "Sistem",
    items: [
      { href: "/internal/pengaturan", label: "Pengaturan", icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

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
                // For /internal/surat, only active on /internal/surat/[id] (not /baru)
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
