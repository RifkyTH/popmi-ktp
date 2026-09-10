import Link from "next/link"
import Image from "next/image"
import {
  MessageSquare,
  FileText,
  ArrowRight,
  ShieldCheck,
  Building2,
  Lock,
  Globe2,
  CheckCircle2,
  MapPin,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      {/* Top Bar Ornament */}
      <div>
        <div className="h-1.5 w-full bg-gradient-to-r from-[#2F4A3C] via-[#D9A400] to-[#10B981]" />
        <div className="bg-[#1F3328] text-white py-2 px-4 text-center text-[11px] tracking-widest uppercase font-semibold border-b border-[#D9A400]/20 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9A400] animate-pulse" />
          <span>Pemerintah Kabupaten Lingga &nbsp;·&nbsp; Kecamatan Temiang Pesisir</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16 max-w-5xl mx-auto w-full">
        {/* Brand Header */}
        <div className="mb-10 text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 sm:w-16 bg-[#D9A400]" />
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
              <Image
                src="/logo-lingga.png"
                alt="Logo Kabupaten Lingga"
                width={72}
                height={72}
                className="object-contain drop-shadow-xs"
                priority
              />
            </div>
            <div className="h-px w-12 sm:w-16 bg-[#D9A400]" />
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#2F4A3C] tracking-tight">
              POPMI KTP
            </h1>
            <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#D9A400]">
              Posko Pengaduan Masyarakat &amp; Informasi Kecamatan Temiang Pesisir
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto italic leading-relaxed">
            &ldquo;Satu Sistem, Surat Tertib, Aduan Terpantau.&rdquo;
          </p>
        </div>

        {/* Dual Gateways */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Card 1: Portal Publik (Masyarakat) */}
          <Link
            href="/publik"
            className="group bg-white rounded-3xl border-2 border-slate-200/90 hover:border-[#D9A400] p-7 sm:p-8 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#D9A400]" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200">
                  <Globe2 className="w-3.5 h-3.5 text-[#D9A400]" />
                  Akses Masyarakat
                </span>
                <span className="text-xs text-slate-400 font-medium">Terbuka &amp; Tanpa Login</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2F4A3C] group-hover:text-[#1F3328] transition-colors">
                  Posko Pengaduan &amp; Informasi
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Layanan pengaduan infrastruktur, lingkungan, bansos, dan fasilitas umum di Desa Temiang, Tajur Biru, dan Pulau Batang.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Kirim laporan lengkap dengan foto &amp; titik GPS
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Pantau tiket laporan &amp; tanggapan resmi petugas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Peta spasial sebaran keluhan &amp; transparansi KIP
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-4 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2F4A3C] group-hover:text-[#D9A400] transition-colors">
                Buka Portal Publik
              </span>
              <div className="w-8 h-8 rounded-full bg-[#2F4A3C] text-white flex items-center justify-center group-hover:bg-[#D9A400] group-hover:text-[#1F3328] transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 2: Portal Internal (Aparatur ASN) */}
          <Link
            href="/internal/login"
            className="group bg-white rounded-3xl border-2 border-slate-200/90 hover:border-[#2F4A3C] p-7 sm:p-8 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#2F4A3C]" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#2F4A3C]/10 text-[#2F4A3C] border border-[#2F4A3C]/20">
                  <Lock className="w-3.5 h-3.5 text-[#2F4A3C]" />
                  Akses Internal Aparatur
                </span>
                <span className="text-xs text-slate-400 font-medium">Khusus Staf &amp; Pejabat</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2F4A3C] group-hover:text-[#1F3328] transition-colors">
                  Administrasi Surat &amp; Arsip
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pengelolaan penerbitan surat rekomendasi, verifikasi bertingkat, disposisi aduan, dan tanda tangan digital Camat.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Alur Konseptor &rarr; Verifikator &rarr; Penandatangan
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Penandatanganan resmi elektronik Camat
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Database arsip digital &amp; dashboard rekapitulasi
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-4 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2F4A3C] group-hover:text-emerald-800 transition-colors">
                Login Sistem Internal
              </span>
              <div className="w-8 h-8 rounded-full bg-[#2F4A3C] text-white flex items-center justify-center group-hover:bg-[#1F3328] transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-5 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Gedung Sekretariat Kantor Camat Temiang Pesisir · Desa Tajur Biru, Kabupaten Lingga
          </span>
          <span className="text-slate-400">
            © {new Date().getFullYear()} POPMI KTP Lingga
          </span>
        </div>
      </footer>
    </div>
  )
}


