"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, Landmark, MessageSquare, ShieldCheck, MapPin, Phone, Mail, Clock, Lock, ExternalLink, ChevronRight, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/publik", label: "Beranda" },
  { href: "/publik/pengaduan/cek", label: "Lacak Laporan" },
  { href: "/publik/peta", label: "Peta Sebaran" },
  { href: "/publik/informasi", label: "Informasi" },
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
    <div className="flex flex-col min-h-screen bg-slate-50/50 text-gray-900 font-sans antialiased">
      {/* Executive GovTech Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Identity */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link href="/publik" className="flex items-center gap-3 group">
                <img
                  src="/logo-lingga.png"
                  alt="Lambang Kabupaten Lingga"
                  className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
                />
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-[#2F4A3C] text-lg leading-tight tracking-tight">
                    POPMI KTP
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-0.5 whitespace-nowrap">
                    Kecamatan Temiang Pesisir
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Clean Institutional Baseline Indicator */}
            <nav className="hidden lg:flex items-center h-full">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/publik"
                    ? pathname === "/publik"
                    : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative h-16 inline-flex items-center px-3.5 text-[13px] font-medium tracking-normal transition-colors whitespace-nowrap border-b-2 -mb-px",
                      isActive
                        ? "border-[#2F4A3C] text-[#2F4A3C] font-semibold"
                        : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right section: Akses ASN & CTA Buat Pengaduan */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <Link
                href="/internal/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-md hover:bg-slate-100/80 transition-colors whitespace-nowrap"
                title="Akses Internal Aparatur Sipil Negara"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Akses ASN</span>
              </Link>

              <div className="h-4 w-px bg-slate-200" />

              <Link
                href="/publik/pengaduan/buat"
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all whitespace-nowrap shadow-xs active:scale-[0.98]",
                  pathname.startsWith("/publik/pengaduan/buat")
                    ? "bg-[#23382D] text-white ring-2 ring-[#2F4A3C]/30"
                    : "bg-[#2F4A3C] hover:bg-[#23382D] text-white"
                )}
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#D9A400]" />
                <span>Buat Pengaduan</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-[#2F4A3C] hover:bg-slate-100 focus:outline-none"
                aria-label="Buka Menu Navigasi"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-0.5">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/publik"
                    ? pathname === "/publik"
                    : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-slate-100 text-[#2F4A3C] font-semibold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-[#2F4A3C]"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/publik/pengaduan/buat" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full bg-[#2F4A3C] hover:bg-[#23382D] text-white text-center py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors">
                  <MessageSquare className="w-4 h-4 text-[#D9A400]" /> Buat Pengaduan Warga
                </button>
              </Link>
              <Link href="/internal/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-center py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Login Aparatur ASN (SILAT-TP)
                </button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Executive GovTech Footer */}
      <footer className="bg-[#1f3328] text-white mt-auto border-t-4 border-[#D9A400]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
            {/* Kolom 1: Profil & Identitas */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 flex items-center justify-center bg-white/10 rounded-xl p-1 border border-white/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-lingga.png" alt="Logo Lingga" className="h-full w-auto object-contain" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white leading-tight">
                    POPMI KTP
                  </h3>
                  <p className="text-[10px] text-[#D9A400] font-semibold uppercase tracking-wider">
                    Kecamatan Temiang Pesisir
                  </p>
                </div>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Portal Pelayanan Aspirasi Warga dan Transparansi Administrasi Resmi Pemerintah Kecamatan Temiang Pesisir, Kabupaten Lingga, Kepulauan Riau.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D9A400] text-[11px] font-semibold border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5" /> Terintegrasi e-TEPI
              </div>
            </div>

            {/* Kolom 2: Wilayah Pemerintahan (3 Desa Otentik) */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-widest text-[#D9A400]">
                Wilayah Desa
              </h4>
              <p className="text-xs text-white/60 mb-2">Wilayah administrasi sah binaan Kecamatan Temiang Pesisir:</p>
              <ul className="space-y-2 text-xs text-white/80">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D9A400]" />
                  <span>Desa Tajur Biru <strong className="text-[10px] text-[#D9A400] font-normal">(Ibu Kota Kec.)</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D9A400]" />
                  <span>Desa Temiang</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D9A400]" />
                  <span>Desa Pulau Batang</span>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Layanan Publik & Navigasi Cepat */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-widest text-[#D9A400]">
                Akses Layanan
              </h4>
              <ul className="space-y-2 text-xs text-white/80">
                <li><Link href="/publik/pengaduan/buat" className="hover:text-[#D9A400] transition-colors">Buat Pengaduan Warga</Link></li>
                <li><Link href="/publik/pengaduan/cek" className="hover:text-[#D9A400] transition-colors">Lacak Status Tiket</Link></li>
                <li><Link href="/publik/peta" className="hover:text-[#D9A400] transition-colors">Peta Sebaran Laporan</Link></li>
                <li><Link href="/publik/informasi" className="hover:text-[#D9A400] transition-colors">Pusat Berita &amp; Informasi</Link></li>
                <li><Link href="/publik/transparansi" className="hover:text-[#D9A400] transition-colors">Statistik &amp; Transparansi</Link></li>
                <li><Link href="/internal/login" className="hover:text-[#D9A400] font-semibold text-[#D9A400]">Login Aparatur (SILAT-TP)</Link></li>
              </ul>
            </div>

            {/* Kolom 4: Alamat & Kontak Resmi */}
            <div className="space-y-3 text-xs text-white/80">
              <h4 className="font-bold text-xs uppercase tracking-widest text-[#D9A400]">
                Sekretariat Kantor
              </h4>
              <div className="space-y-2.5">
                <p className="flex items-start gap-2 leading-relaxed">
                  <MapPin className="w-4 h-4 text-[#D9A400] shrink-0 mt-0.5" />
                  <span>Jl. Kantor Camat, Desa Tajur Biru, Kec. Temiang Pesisir, Kab. Lingga, Kepulauan Riau (29871)</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#D9A400] shrink-0" />
                  <span>+62 812-3456-7890 (WhatsApp Pengaduan)</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#D9A400] shrink-0" />
                  <span>kec.temiangpesisir@linggakab.go.id</span>
                </p>
                <p className="flex items-center gap-2 text-[11px] text-white/60">
                  <Clock className="w-4 h-4 text-[#D9A400] shrink-0" />
                  <span>Senin — Jumat: 08.00 — 16.00 WIB</span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-3">
            <p>© {new Date().getFullYear()} Pemerintah Kecamatan Temiang Pesisir, Kabupaten Lingga. Seluruh hak cipta dilindungi.</p>
            <p className="italic text-[#D9A400]/90">Satu Sistem, Surat Tertib, Aduan Terpantau.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
