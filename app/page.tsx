import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-krem flex flex-col">
      {/* Header ornament */}
      <div className="h-1.5 w-full bg-gradient-to-r from-hijau via-kuning to-hijau" />

      {/* Decorative top bar */}
      <div className="bg-hijau text-white text-center py-2 px-4 text-xs tracking-widest uppercase">
        Pemerintah Kabupaten Lingga &nbsp;|&nbsp; Kecamatan Temiang Pesisir
      </div>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Logo area */}
        <div className="mb-8 flex flex-col items-center">
          {/* Logo Kabupaten Lingga */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-16 bg-kuning" />
            <div className="w-16 h-16 flex items-center justify-center">
              <Image src="/logo-lingga.png" alt="Logo Kabupaten Lingga" width={64} height={64} className="object-contain drop-shadow-sm" priority />
            </div>
            <div className="h-px w-16 bg-kuning" />
          </div>

          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-hijau tracking-tight">
              POPMI KTP
            </h1>
            <p className="text-kuning font-semibold text-sm tracking-widest uppercase mt-1">
              Sistem Layanan Terpadu Temiang Pesisir
            </p>
          </div>

          <p className="mt-4 text-center text-teks/70 text-sm max-w-md italic">
            &ldquo;Satu Sistem, Surat Tertib, Aduan Terpantau.&rdquo;
          </p>
        </div>

        {/* Two entry points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl mt-2">
          {/* Internal */}
          <Link
            href="/internal/login"
            className="group flex flex-col items-start gap-3 bg-white border-2 border-hijau/20 rounded-2xl p-7 shadow-sm hover:border-hijau hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between w-full">
              <span className="bg-hijau/10 text-hijau text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Internal
              </span>
              <span className="text-hijau opacity-0 group-hover:opacity-100 transition-opacity text-xl">→</span>
            </div>
            <div className="mt-1">
              <div className="w-10 h-10 bg-hijau/10 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-hijau" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold font-serif text-hijau">Sistem Administrasi & Surat</h2>
              <p className="text-sm text-teks/60 mt-1 leading-relaxed">
                Untuk staf, Kasi, Camat, dan operator desa. Pengelolaan surat rekomendasi, arsip digital, dan verifikasi dokumen.
              </p>
            </div>
            <span className="mt-2 text-xs text-teks/40 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
              Login wajib · Akun resmi kecamatan
            </span>
          </Link>

          {/* Publik */}
          <Link
            href="/publik"
            className="group flex flex-col items-start gap-3 bg-white border-2 border-kuning/30 rounded-2xl p-7 shadow-sm hover:border-kuning hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between w-full">
              <span className="bg-kuning/15 text-teks text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-kuning/30">
                Masyarakat
              </span>
              <span className="text-kuning opacity-0 group-hover:opacity-100 transition-opacity text-xl">→</span>
            </div>
            <div className="mt-1">
              <div className="w-10 h-10 bg-kuning/15 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-kuning" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold font-serif text-teks">Posko Pengaduan & Informasi</h2>
              <p className="text-sm text-teks/60 mt-1 leading-relaxed">
                Untuk warga. Sampaikan aduan, pantau tindak lanjut, dan akses informasi resmi kecamatan.
              </p>
            </div>
            <span className="mt-2 text-xs text-teks/40 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Akses terbuka · Tanpa login
            </span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-5 text-xs text-teks/40 border-t border-kuning-muda">
        <p>© {new Date().getFullYear()} Kecamatan Temiang Pesisir, Kabupaten Lingga, Kepulauan Riau</p>
      </footer>
    </div>
  )
}

