"use client"

import { useState } from "react"
import { DESA_LIST } from "@/lib/mock-data/desa"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { generateTiketPengaduan } from "@/lib/nomor-surat"
import { CheckCircle2, Copy, FileText, ClipboardCheck } from "lucide-react"
import Link from "next/link"
import { simpanPengaduan } from "../actions"

export default function BuatPengaduanPage() {
  const [nama, setNama] = useState("")
  const [kontak, setKontak] = useState("")
  const [desa, setDesa] = useState("")
  const [kategori, setKategori] = useState("")
  const [judul, setJudul] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [lokasi, setLokasi] = useState("")
  
  const [ticket, setTicket] = useState("")
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Generate nomor tiket
    const generatedTicket = generateTiketPengaduan()

    // Simpan ke server (in-memory PENGADUAN_DATA)
    await simpanPengaduan({
      tiket: generatedTicket,
      nama,
      kontak,
      desa,
      kategori,
      judul,
      deskripsi,
      lokasi,
    })

    setTicket(generatedTicket)
  }

  function handleCopy() {
    navigator.clipboard.writeText(ticket)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (ticket) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-bold text-hijau">Laporan Berhasil Terkirim</h1>
          <p className="text-sm text-teks/70">
            Terima kasih atas laporan Anda. Laporan Anda telah tersimpan dengan nomor tiket berikut:
          </p>
        </div>

        <div className="bg-white border-2 border-kuning rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 shadow-md max-w-sm mx-auto">
          <span className="text-xs uppercase tracking-widest font-bold text-teks/50">Nomor Tiket Anda</span>
          <span className="text-3xl font-mono font-bold text-hijau tracking-wider">{ticket}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-kuning font-bold hover:underline"
          >
            {copied ? (
              <>
                <ClipboardCheck className="w-3.5 h-3.5" /> Disalin ke clipboard
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Salin Tiket
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-teks/50 max-w-sm mx-auto">
          Simpan baik-baik nomor tiket ini. Anda dapat menggunakannya untuk memantau proses tindak lanjut dari petugas kami pada halaman pantau aduan.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Link href={`/publik/pengaduan/${ticket}`}>
            <Button>
              Pantau Detail Laporan
            </Button>
          </Link>
          <Link href="/publik">
            <Button variant="outline">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader
        title="Buat Pengaduan Masyarakat"
        subtitle="Laporkan permasalahan di sekitar Anda agar segera ditindaklanjuti"
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-kuning-muda p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nama */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
            />
          </div>

          {/* Nomor HP */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
              Nomor WhatsApp / HP
            </label>
            <input
              type="tel"
              required
              value={kontak}
              onChange={(e) => setKontak(e.target.value)}
              placeholder="Contoh: 0812xxxxxxxx"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
            />
          </div>

          {/* Desa */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
              Lokasi Desa
            </label>
            <select
              required
              value={desa}
              onChange={(e) => setDesa(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
            >
              <option value="">Pilih Desa...</option>
              {DESA_LIST.map((d) => (
                <option key={d} value={d}>Desa {d}</option>
              ))}
            </select>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
              Kategori Permasalahan
            </label>
            <select
              required
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
            >
              <option value="">Pilih Kategori...</option>
              <option value="infrastruktur">Infrastruktur (Jalan, Jembatan, Lampu)</option>
              <option value="lingkungan">Lingkungan (Sampah, Sungai, Pantai)</option>
              <option value="pelayanan">Pelayanan Publik (KTP, Dokumen)</option>
              <option value="sosial">Bantuan Sosial (PKH, BLT)</option>
              <option value="keamanan">Keamanan & Ketertiban</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        {/* Judul */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
            Judul Singkat Laporan
          </label>
          <input
            type="text"
            required
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="Tuliskan inti masalah secara singkat"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
            Rincian Deskripsi Pengaduan
          </label>
          <textarea
            required
            rows={5}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Tuliskan secara lengkap detail kejadian, kondisi, dan keluhan Anda"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning resize-none"
          />
        </div>

        {/* Detail Lokasi */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
            Detail Lokasi Fisik / Landmark (Opsional)
          </label>
          <input
            type="text"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            placeholder="Contoh: Depan SD, Sebelah mushola..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-kuning"
          />
        </div>

        {/* Foto */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-teks/60 mb-1.5">
            Lampirkan Foto Bukti Fisik (Opsional)
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-teks/50 focus:outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-kuning-muda file:text-teks cursor-pointer"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full py-3.5 text-xs font-bold tracking-wider uppercase">
            Kirim Pengaduan Sekarang
          </Button>
        </div>
      </form>
    </div>
  )
}
