import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"

export default function KontakPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <PageHeader
        title="Hubungi Kecamatan"
        subtitle="Informasi alamat kantor, kontak WhatsApp center, dan jam pelayanan"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="font-serif font-bold text-hijau text-lg border-b pb-3 border-kuning-muda">
                Kantor Kecamatan Temiang Pesisir
              </h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-kuning shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-teks">Alamat Kantor</strong>
                    <span className="text-teks/70 leading-relaxed">
                      Jl. Raya Kantor Camat No. 1, Desa Penuba, Kecamatan Temiang Pesisir, Kabupaten Lingga, Kepulauan Riau (29871)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-kuning shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-teks">WhatsApp Center Pengaduan</strong>
                    <span className="text-teks/70">
                      +62 812-3456-7890 (Hanya melayani chat / pengiriman dokumen)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-kuning shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-teks">Email Resmi</strong>
                    <span className="text-teks/70">
                      kec.temiangpesisir@linggakah.go.id
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-kuning shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-teks">Jam Pelayanan Masyarakat</strong>
                    <span className="text-teks/70 leading-relaxed">
                      Senin — Kamis: 08.00 — 16.00 WIB <br />
                      Jumat: 08.00 — 11.30 WIB <br />
                      Sabtu — Minggu: Libur / Tutup
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded-lg shadow transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Hubungi via WhatsApp
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mapbox placeholder */}
        <div className="bg-white rounded-2xl border border-kuning-muda overflow-hidden shadow-sm flex flex-col h-full min-h-[300px]">
          <div className="bg-krem px-4 py-3 border-b border-kuning-muda text-xs font-bold uppercase tracking-wider">
            Peta Lokasi Kantor Camat
          </div>
          <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-kuning/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-kuning" />
            </div>
            <div>
              <p className="font-semibold text-sm text-teks">Kantor Camat Temiang Pesisir</p>
              <p className="text-xs text-teks/60 max-w-xs mx-auto mt-1">
                Kecamatan Temiang Pesisir, Kabupaten Lingga, Kepulauan Riau.
              </p>
            </div>
            {/* Styled Map frame placeholder */}
            <div className="w-full max-w-sm h-40 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-xs text-teks/40 italic">
              Peta Google Maps Embed akan disematkan di sini
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
