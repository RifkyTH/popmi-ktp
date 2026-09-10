export type StatusSurat = "draf" | "verifikasi" | "menunggu_ttd" | "terbit" | "terkirim"

export type JenisSurat =
  | "dispensasi_nikah"
  | "bbm_jbkp"
  | "bbm_jbt"
  | "rekomendasi_dd"
  | "rekomendasi_add"
  | "tunda_salur_add"
  | "ahli_waris"
  | "pemberhentian_perangkat"

export type Surat = {
  id: string
  nomor: string
  jenis: JenisSurat
  judul: string
  pemohon: string
  desa?: string
  tanggalBuat: string
  tanggalTerbit?: string
  status: StatusSurat
  dibuatOleh: string
  diverifikasiOleh?: string
  disetujuiOleh?: string
  perihal: string
  keterangan?: string
  data_form?: Record<string, string>
  riwayat: {
    status: StatusSurat
    oleh: string
    tanggal: string
    catatan?: string
  }[]
}

export const JENIS_SURAT_LABELS: Record<JenisSurat, string> = {
  dispensasi_nikah: "Dispensasi Nikah",
  bbm_jbkp: "Rekomendasi BBM JBKP (Pertalite)",
  bbm_jbt: "Rekomendasi BBM JBT (Minyak Tanah)",
  rekomendasi_dd: "Rekomendasi Pengajuan Dana Desa",
  rekomendasi_add: "Rekomendasi Pengajuan ADD Bulanan",
  tunda_salur_add: "Rekomendasi Tunda Salur ADD",
  ahli_waris: "Surat Keterangan Ahli Waris",
  pemberhentian_perangkat: "Rekomendasi Pemberhentian Perangkat Desa",
}

export const NOMOR_FORMAT: Record<JenisSurat, string> = {
  dispensasi_nikah: "451.1/CMT-TP",
  bbm_jbkp: "TEMIANG PESISIR",
  bbm_jbt: "TEMIANG PESISIR",
  rekomendasi_dd: "142.1/CMT-TP",
  rekomendasi_add: "142.1/CMT-TP",
  tunda_salur_add: "142.1/CMT-TP",
  ahli_waris: "474.4/CMT-TP",
  pemberhentian_perangkat: "140/CMT-TP",
}

export const ROMAN_MONTHS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

export function generateNomorSurat(jenis: JenisSurat, urut: number | string, customMonth?: string, customYear?: string): string {
  const urutLength = jenis === "bbm_jbt" ? 4 : 3;
  const urutStr = String(urut).padStart(urutLength, "0");
  const date = new Date();
  const year = customYear || date.getFullYear().toString();
  const month = customMonth || ROMAN_MONTHS[date.getMonth()];

  if (jenis === "bbm_jbkp") {
    return `${urutStr} / TEMIANG PESISIR / 21 / 21.04 / TRANS / JBKP / ${month} / ${year}`;
  } else if (jenis === "bbm_jbt") {
    return `${urutStr} / TEMIANG PESISIR / 21 / 21.04 / RT-MIKRO / JBT / ${month} / ${year}`;
  } else {
    // Format: template/template/bulan/tahun/urut
    // Contoh: 451.1/CMT-TP/III/2026/001
    const prefix = NOMOR_FORMAT[jenis] || "XXX";
    return `${prefix}/${month}/${year}/${urutStr}`;
  }
}

export const STATUS_LABELS: Record<StatusSurat, string> = {
  draf: "Draf",
  verifikasi: "Diverifikasi Kasi",
  menunggu_ttd: "Menunggu TTD Camat",
  terbit: "Terbit",
  terkirim: "Terkirim/Diarsipkan",
}

export const SURAT_DATA: Surat[] = [
  {
    id: "S001",
    nomor: "451.1/CMT-TP/001/2026",
    jenis: "dispensasi_nikah",
    judul: "Dispensasi Nikah a.n. Ahmad Riyadi",
    pemohon: "Ahmad Riyadi",
    desa: "Temiang",
    tanggalBuat: "2026-08-10",
    tanggalTerbit: "2026-08-12",
    status: "terbit",
    dibuatOleh: "Ahmad Fauzi",
    diverifikasiOleh: "Hj. Siti Rahayu",
    disetujuiOleh: "Drs. Muhammad Rizal",
    perihal: "Dispensasi Nikah",
    riwayat: [
      { status: "draf", oleh: "Ahmad Fauzi", tanggal: "2026-08-10 09:00", catatan: "Surat dibuat" },
      { status: "verifikasi", oleh: "Hj. Siti Rahayu", tanggal: "2026-08-11 10:30", catatan: "Telah diverifikasi" },
      { status: "menunggu_ttd", oleh: "Hj. Siti Rahayu", tanggal: "2026-08-11 10:31", catatan: "Diteruskan ke Camat" },
      { status: "terbit", oleh: "Drs. Muhammad Rizal", tanggal: "2026-08-12 08:45", catatan: "Ditandatangani dan diterbitkan" },
    ],
  },
  {
    id: "S002",
    nomor: "142.1/CMT-TP/008/2026",
    jenis: "rekomendasi_dd",
    judul: "Rekomendasi Pengajuan DD Desa Pasir Panjang Tahap II",
    pemohon: "Kepala Desa Pasir Panjang",
    desa: "Pasir Panjang",
    tanggalBuat: "2026-08-15",
    status: "menunggu_ttd",
    dibuatOleh: "Ahmad Fauzi",
    diverifikasiOleh: "Hj. Siti Rahayu",
    perihal: "Rekomendasi Pengajuan Dana Desa Tahap II Tahun 2026",
    riwayat: [
      { status: "draf", oleh: "Ahmad Fauzi", tanggal: "2026-08-15 11:00", catatan: "Surat dibuat" },
      { status: "verifikasi", oleh: "Hj. Siti Rahayu", tanggal: "2026-08-16 09:15", catatan: "Dokumen lengkap, diverifikasi" },
      { status: "menunggu_ttd", oleh: "Hj. Siti Rahayu", tanggal: "2026-08-16 09:16", catatan: "Diteruskan ke Camat" },
    ],
  },
  {
    id: "S003",
    nomor: "474.4/CMT-TP/003/2026",
    jenis: "ahli_waris",
    judul: "Surat Keterangan Ahli Waris a.n. Hasan bin Umar",
    pemohon: "Fatimah binti Hasan",
    desa: "Duara",
    tanggalBuat: "2026-08-20",
    status: "verifikasi",
    dibuatOleh: "Ahmad Fauzi",
    perihal: "Surat Keterangan Ahli Waris alm. Hasan bin Umar",
    riwayat: [
      { status: "draf", oleh: "Ahmad Fauzi", tanggal: "2026-08-20 10:00", catatan: "Surat dibuat" },
      { status: "verifikasi", oleh: "Hj. Siti Rahayu", tanggal: "2026-08-20 14:00", catatan: "Sedang diperiksa" },
    ],
  },
  {
    id: "S004",
    nomor: "TEMIANG PESISIR/004/TRANS/JBKP/2026",
    jenis: "bbm_jbkp",
    judul: "Rekomendasi BBM JBKP a.n. Warung Pak Ali",
    pemohon: "Ali bin Ahmad",
    desa: "Sungai Buluh",
    tanggalBuat: "2026-08-22",
    status: "draf",
    dibuatOleh: "Ahmad Fauzi",
    perihal: "Rekomendasi Pembelian BBM Bersubsidi Jenis JBKP (Pertalite)",
    riwayat: [
      { status: "draf", oleh: "Ahmad Fauzi", tanggal: "2026-08-22 09:00", catatan: "Surat dibuat, menunggu verifikasi" },
    ],
  },
  {
    id: "S005",
    nomor: "142.1/CMT-TP/009/2026",
    jenis: "rekomendasi_add",
    judul: "Rekomendasi ADD Bulanan Desa Penuba Agustus 2026",
    pemohon: "Kepala Desa Penuba",
    desa: "Penuba",
    tanggalBuat: "2026-08-18",
    tanggalTerbit: "2026-08-20",
    status: "terkirim",
    dibuatOleh: "Ahmad Fauzi",
    diverifikasiOleh: "Hj. Siti Rahayu",
    disetujuiOleh: "Drs. Muhammad Rizal",
    perihal: "Rekomendasi Pengajuan Alokasi Dana Desa Bulan Agustus 2026",
    riwayat: [
      { status: "draf", oleh: "Ahmad Fauzi", tanggal: "2026-08-18 08:00" },
      { status: "verifikasi", oleh: "Hj. Siti Rahayu", tanggal: "2026-08-19 10:00" },
      { status: "menunggu_ttd", oleh: "Hj. Siti Rahayu", tanggal: "2026-08-19 10:01" },
      { status: "terbit", oleh: "Drs. Muhammad Rizal", tanggal: "2026-08-20 08:00" },
      { status: "terkirim", oleh: "Ahmad Fauzi", tanggal: "2026-08-20 13:00", catatan: "Dikirim ke Dinas PMD" },
    ],
  },
]
