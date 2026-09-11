import { Metadata } from "next"
import { PanduanClient } from "./panduan-client"

export const metadata: Metadata = {
  title: "Panduan Sistem & SOP - POPMI KTP Temiang Pesisir",
  description:
    "Buku panduan operasional lengkap tata kelola surat dinas, aduan masyarakat, publikasi berita, dan pengaturan sistem Kecamatan Temiang Pesisir.",
}

export default function PanduanPage() {
  return <PanduanClient />
}
