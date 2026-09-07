"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, Landmark } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/publik", label: "Beranda" },
  { href: "/publik/pengaduan/buat", label: "Buat Pengaduan" },
  { href: "/publik/pengaduan/cek", label: "Cek Status Laporan" },
  { href: "/publik/peta", label: "Peta Aduan" },
  { href: "/publik/informasi", label: "Informasi Publik" },
  { href: "/publik/transparansi", label: "Transparansi" },
  { href: "/publik/kontak", label: "Kontak" },
]

export default function PublikLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-krem text-teks font-sans">
      {/* Top golden ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-hijau via-kuning to-hijau" />

      {/* Main Navbar */}
      <header className="bg-white border-b border-kuning-muda sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="h-10 shrink-0 flex items-center justify-center">
                <img src="/logo-lingga.png" alt="Logo Lingga" className="h-full w-auto object-contain" />
              </div>
              <Link href="/publik" className="flex flex-col">
                <span className="font-serif font-bold text-hijau text-lg leading-none tracking-tight">
                  POPMI KTP
                </span>
                <span className="text-[10px] text-teks/50 tracking-wider font-semibold uppercase mt-0.5">
                  Kec. Temiang Pesisir
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/publik" && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors border-b-2 py-5 -mb-px",
                      isActive
                        ? "border-kuning text-hijau font-semibold"
                        : "border-transparent text-teks/70 hover:text-hijau hover:border-kuning-muda"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right section: CTA */}
            <div className="hidden md:block">
              <Link href="/publik/pengaduan/buat">
                <button className="bg-hijau hover:bg-hijau/90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors border border-kuning/30 shadow-sm uppercase tracking-wide">
                  Lapor Sekarang
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-teks/70 hover:text-hijau hover:bg-krem focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-kuning-muda px-4 pt-2 pb-4 space-y-1 shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                    isActive
                      ? "bg-kuning-muda text-hijau font-semibold"
                      : "text-teks/75 hover:bg-krem hover:text-hijau"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-gray-100">
              <Link href="/publik/pengaduan/buat" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full bg-hijau text-white text-center py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider">
                  Lapor Sekarang
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-hijau text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-white/10 pb-8">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-kuning rounded-lg flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-hijau" />
                </div>
                <h3 className="font-serif font-bold text-lg text-kuning uppercase tracking-wider">
                  POPMI KTP
                </h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed max-w-sm">
                Sistem Layanan Terpadu Kecamatan Temiang Pesisir, Kabupaten Lingga. Wadah transparansi aduan masyarakat dan informasi resmi pembangunan daerah.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-kuning mb-3">Tautan Cepat</h4>
              <ul className="grid grid-cols-2 gap-2 text-xs text-white/80">
                <li><Link href="/publik" className="hover:text-kuning">Beranda</Link></li>
                <li><Link href="/publik/pengaduan/buat" className="hover:text-kuning">Buat Pengaduan</Link></li>
                <li><Link href="/publik/pengaduan/cek" className="hover:text-kuning">Cek Status Laporan</Link></li>
                <li><Link href="/publik/informasi" className="hover:text-kuning">Informasi Publik</Link></li>
                <li><Link href="/publik/transparansi" className="hover:text-kuning">Transparansi</Link></li>
                <li><Link href="/internal/login" className="hover:text-kuning font-semibold">Portal Internal Staf</Link></li>
              </ul>
            </div>

            {/* Kontak */}
            <div className="text-xs space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-widest text-kuning mb-3">Hubungi Kami</h4>
              <p>📍 Kantor Camat Temiang Pesisir, Kabupaten Lingga, Kepulauan Riau</p>
              <p>📞 Phone: +62 812-XXXX-XXXX (WhatsApp Center)</p>
              <p>✉️ Email: kec.temiangpesisir@linggakah.go.id</p>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50">
            <p>© {new Date().getFullYear()} Kecamatan Temiang Pesisir. Hak Cipta Dilindungi.</p>
            <p className="mt-2 sm:mt-0 italic">Satu Sistem, Surat Tertib, Aduan Terpantau.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
