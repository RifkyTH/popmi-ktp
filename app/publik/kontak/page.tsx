import { MapPin, Phone, Mail, Clock, MessageCircle, Building2, ShieldCheck, ExternalLink, Navigation } from "lucide-react"

export default function KontakPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D9A400]/40 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A400]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F4A3C]">
              Layanan Komunikasi &amp; Pengaduan
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2F4A3C]">
            Hubungi Kantor Kecamatan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
            Informasi alamat kantor, kanal hotline WhatsApp aduan masyarakat, dan jam operasional pelayanan publik.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs shrink-0 flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-[#D9A400]" />
          <span>Ibu Kota Kecamatan: Desa Tajur Biru</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contact Info (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card Kantor Camat */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9A400]">
                  Pusat Pemerintahan Wilayah
                </span>
                <h2 className="font-serif font-bold text-[#2F4A3C] text-lg sm:text-xl">
                  Kantor Camat Temiang Pesisir
                </h2>
              </div>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                Layanan Aktif
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Alamat */}
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#2F4A3C]/10 text-[#2F4A3C] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-800 text-xs font-bold uppercase tracking-wider mb-0.5">
                    Alamat Gedung Sekretariat
                  </strong>
                  <p className="text-slate-600 leading-relaxed">
                    Gedung Sekretariat Kantor Camat Temiang Pesisir, Jl. Utama No. 01, Desa Tajur Biru, Kecamatan Temiang Pesisir, Kabupaten Lingga, Provinsi Kepulauan Riau (Kode Pos 29871).
                  </p>
                </div>
              </div>

              {/* WhatsApp Center */}
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-800 text-xs font-bold uppercase tracking-wider mb-0.5">
                    WhatsApp Center Pengaduan Warga
                  </strong>
                  <p className="text-slate-600">
                    +62 812-3456-7890 <span className="text-slate-400 text-xs">(Layanan chat aspirasi &amp; penerimaan berkas)</span>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-800 text-xs font-bold uppercase tracking-wider mb-0.5">
                    Surat Elektronik Resmi
                  </strong>
                  <p className="text-slate-600 font-mono text-xs">
                    kec.temiangpesisir@linggakab.go.id
                  </p>
                </div>
              </div>

              {/* Jam Operasional */}
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-800 text-xs font-bold uppercase tracking-wider mb-0.5">
                    Waktu Pelayanan Tatap Muka
                  </strong>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    Senin – Kamis : 08.00 – 16.00 WIB <br />
                    Jumat : 08.00 – 11.30 WIB (Istirahat Shalat Jumat) <br />
                    Sabtu, Minggu &amp; Hari Libur Nasional : Tutup
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-3">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#2F4A3C] hover:bg-[#23382D] text-white font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-xl shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#D9A400]" />
                Hubungi via WhatsApp Center
              </a>
            </div>
          </div>

          {/* Pos Koordinasi 3 Desa */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-3">
            <h3 className="font-serif font-bold text-[#2F4A3C] text-sm">
              Pos Pelayanan di Seluruh Wilayah Desa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <strong className="text-slate-800 block">Desa Tajur Biru</strong>
                <span className="text-slate-500 text-[11px]">Pusat Pelayanan Kantor Camat</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <strong className="text-slate-800 block">Desa Temiang</strong>
                <span className="text-slate-500 text-[11px]">Posko Perangkat Desa</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <strong className="text-slate-800 block">Desa Pulau Batang</strong>
                <span className="text-slate-500 text-[11px]">Posko Perangkat Desa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mapbox / Location Frame (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs flex flex-col h-full">
            <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-[#2F4A3C] flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#D9A400]" /> Titik Koordinat Kantor
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Tajur Biru, Lingga
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 min-h-[280px] bg-gradient-to-b from-white to-slate-50/50">
              <div className="w-14 h-14 rounded-2xl bg-[#2F4A3C]/10 border border-[#2F4A3C]/20 flex items-center justify-center text-[#2F4A3C] shadow-2xs">
                <MapPin className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-[#2F4A3C]">
                  Kantor Camat Temiang Pesisir
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Desa Tajur Biru, Kecamatan Temiang Pesisir, Kabupaten Lingga, Kepulauan Riau.
                </p>
                <span className="text-[11px] font-mono text-slate-400 block pt-1">
                  Koordinat: 0°14&apos;42.0&quot;S 104°23&apos;06.0&quot;E
                </span>
              </div>

              {/* Styled Interactive frame container */}
              <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-2xs bg-slate-100 h-44 relative flex items-center justify-center">
                <iframe
                  title="Peta Kantor Camat Temiang Pesisir"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=104.37%2C-0.26%2C104.40%2C-0.23&amp;layer=mapnik&amp;marker=-0.245%2C104.385"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Tajur+Biru+Temiang+Pesisir+Lingga"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F4A3C] hover:text-[#D9A400] underline transition-colors"
              >
                Buka di Google Maps Navigasi <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

