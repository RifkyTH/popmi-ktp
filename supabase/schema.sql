-- ============================================================
-- POPMI KTP — Supabase Schema
-- Jalankan script ini di Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: pengguna
-- ============================================================
create table if not exists pengguna (
  id uuid primary key default uuid_generate_v4(),
  nama text not null,
  username text unique not null,
  password text not null,
  role text not null check (role in ('staf', 'kasi', 'camat', 'admin', 'operator_desa', 'petugas', 'super_admin')),
  jabatan text not null,
  desa text,
  aktif boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- TABLE: surat
-- ============================================================
create table if not exists surat (
  id text primary key,
  nomor text not null,
  jenis text not null check (jenis in (
    'dispensasi_nikah','bbm_jbkp','bbm_jbt',
    'rekomendasi_dd','rekomendasi_add','tunda_salur_add',
    'ahli_waris','pemberhentian_perangkat'
  )),
  judul text not null,
  pemohon text not null,
  desa text,
  tanggal_buat date not null default current_date,
  tanggal_terbit date,
  status text not null default 'draf' check (status in ('draf','verifikasi','menunggu_ttd','terbit','terkirim')),
  dibuat_oleh text,
  diverifikasi_oleh text,
  disetujui_oleh text,
  perihal text,
  data_form jsonb,
  created_at timestamptz default now()
);

-- ============================================================
-- TABLE: surat_riwayat
-- ============================================================
create table if not exists surat_riwayat (
  id uuid primary key default uuid_generate_v4(),
  surat_id text references surat(id) on delete cascade,
  status text not null,
  oleh text not null,
  tanggal timestamptz not null default now(),
  catatan text,
  created_at timestamptz default now()
);

-- ============================================================
-- TABLE: pengaduan
-- ============================================================
create table if not exists pengaduan (
  id uuid primary key default uuid_generate_v4(),
  tiket text unique not null,
  nama text not null,
  kontak text not null,
  kategori text not null check (kategori in (
    'infrastruktur','lingkungan','pelayanan','sosial','keamanan','lainnya'
  )),
  judul text not null,
  deskripsi text not null,
  desa text not null,
  lokasi text,
  foto text,
  status text not null default 'masuk' check (status in ('masuk','verifikasi','proses','selesai','ditolak')),
  petugas_terkait text,
  respon_petugas text,
  tanggal_masuk timestamptz default now(),
  tanggal_update timestamptz default now(),
  created_at timestamptz default now()
);

-- ============================================================
-- TABLE: pengaduan_riwayat
-- ============================================================
create table if not exists pengaduan_riwayat (
  id uuid primary key default uuid_generate_v4(),
  pengaduan_id uuid references pengaduan(id) on delete cascade,
  status text not null,
  oleh text not null default 'Sistem',
  tanggal timestamptz not null default now(),
  catatan text,
  created_at timestamptz default now()
);

-- ============================================================
-- TABLE: informasi
-- ============================================================
create table if not exists informasi (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  kategori text not null check (kategori in (
    'pengumuman','berita','program','jadwal','kesehatan','pendidikan'
  )),
  judul text not null,
  ringkasan text,
  isi text not null,
  tanggal date not null default current_date,
  penulis text not null default 'Admin Kecamatan',
  gambar text,
  published boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table pengguna enable row level security;
alter table surat enable row level security;
alter table surat_riwayat enable row level security;
alter table pengaduan enable row level security;
alter table pengaduan_riwayat enable row level security;
alter table informasi enable row level security;

-- Allow public read for informasi
create policy "informasi_public_read" on informasi for select using (published = true);

-- Allow all for service role (bypass RLS)
create policy "pengguna_service_all" on pengguna for all using (true);
create policy "surat_service_all" on surat for all using (true);
create policy "surat_riwayat_service_all" on surat_riwayat for all using (true);
create policy "pengaduan_service_all" on pengaduan for all using (true);
create policy "pengaduan_riwayat_service_all" on pengaduan_riwayat for all using (true);
create policy "informasi_service_all" on informasi for all using (true);

-- ============================================================
-- SEED DATA: pengguna
-- ============================================================
insert into pengguna (id, nama, username, password, role, jabatan) values
  ('00000001-0000-0000-0000-000000000001', 'Ahmad Fauzi', 'staf', 'staf123', 'staf', 'Staf Administrasi'),
  ('00000001-0000-0000-0000-000000000002', 'Hj. Siti Rahayu, S.Sos', 'kasi', 'kasi123', 'kasi', 'Kasi Pemerintahan'),
  ('00000001-0000-0000-0000-000000000003', 'Drs. Muhammad Rizal', 'camat', 'camat123', 'camat', 'Camat Temiang Pesisir'),
  ('00000001-0000-0000-0000-000000000004', 'Admin Sistem', 'admin', 'admin123', 'admin', 'Administrator'),
  ('00000001-0000-0000-0000-000000000005', 'Budi Santoso', 'desa_temiang', 'desa123', 'operator_desa', 'Operator Desa Temiang'),
  ('00000001-0000-0000-0000-000000000006', 'Reni Wulandari', 'petugas', 'petugas123', 'petugas', 'Petugas Pengaduan'),
  ('00000001-0000-0000-0000-000000000007', 'Super Admin', 'superadmin', 'super123', 'super_admin', 'Super Administrator')
on conflict (username) do nothing;

-- ============================================================
-- SEED DATA: surat
-- ============================================================
insert into surat (id, nomor, jenis, judul, pemohon, desa, tanggal_buat, tanggal_terbit, status, dibuat_oleh, diverifikasi_oleh, disetujui_oleh, perihal) values
  ('S001', '451.1/CMT-TP/001/2026', 'dispensasi_nikah', 'Dispensasi Nikah a.n. Ahmad Riyadi', 'Ahmad Riyadi', 'Temiang', '2026-08-10', '2026-08-12', 'terbit', 'Ahmad Fauzi', 'Hj. Siti Rahayu', 'Drs. Muhammad Rizal', 'Dispensasi Nikah'),
  ('S002', '142.1/CMT-TP/008/2026', 'rekomendasi_dd', 'Rekomendasi Pengajuan DD Desa Pasir Panjang Tahap II', 'Kepala Desa Pasir Panjang', 'Pasir Panjang', '2026-08-15', null, 'menunggu_ttd', 'Ahmad Fauzi', 'Hj. Siti Rahayu', null, 'Rekomendasi Pengajuan Dana Desa Tahap II Tahun 2026'),
  ('S003', '474.4/CMT-TP/003/2026', 'ahli_waris', 'Surat Keterangan Ahli Waris a.n. Hasan bin Umar', 'Fatimah binti Hasan', 'Duara', '2026-08-20', null, 'verifikasi', 'Ahmad Fauzi', null, null, 'Surat Keterangan Ahli Waris alm. Hasan bin Umar'),
  ('S004', 'TEMIANG PESISIR/004/TRANS/JBKP/2026', 'bbm_jbkp', 'Rekomendasi BBM JBKP a.n. Warung Pak Ali', 'Ali bin Ahmad', 'Sungai Buluh', '2026-08-22', null, 'draf', 'Ahmad Fauzi', null, null, 'Rekomendasi Pembelian BBM Bersubsidi Jenis JBKP'),
  ('S005', '142.1/CMT-TP/009/2026', 'rekomendasi_add', 'Rekomendasi ADD Bulanan Desa Penuba Agustus 2026', 'Kepala Desa Penuba', 'Penuba', '2026-08-18', '2026-08-20', 'terkirim', 'Ahmad Fauzi', 'Hj. Siti Rahayu', 'Drs. Muhammad Rizal', 'Rekomendasi Pengajuan Alokasi Dana Desa Bulan Agustus 2026')
on conflict (id) do nothing;

-- ============================================================
-- SEED DATA: surat_riwayat
-- ============================================================
insert into surat_riwayat (surat_id, status, oleh, tanggal, catatan) values
  ('S001', 'draf', 'Ahmad Fauzi', '2026-08-10 09:00:00+07', 'Surat dibuat'),
  ('S001', 'verifikasi', 'Hj. Siti Rahayu', '2026-08-11 10:30:00+07', 'Telah diverifikasi'),
  ('S001', 'menunggu_ttd', 'Hj. Siti Rahayu', '2026-08-11 10:31:00+07', 'Diteruskan ke Camat'),
  ('S001', 'terbit', 'Drs. Muhammad Rizal', '2026-08-12 08:45:00+07', 'Ditandatangani dan diterbitkan'),
  ('S002', 'draf', 'Ahmad Fauzi', '2026-08-15 11:00:00+07', 'Surat dibuat'),
  ('S002', 'verifikasi', 'Hj. Siti Rahayu', '2026-08-16 09:15:00+07', 'Dokumen lengkap, diverifikasi'),
  ('S002', 'menunggu_ttd', 'Hj. Siti Rahayu', '2026-08-16 09:16:00+07', 'Diteruskan ke Camat'),
  ('S003', 'draf', 'Ahmad Fauzi', '2026-08-20 10:00:00+07', 'Surat dibuat'),
  ('S003', 'verifikasi', 'Hj. Siti Rahayu', '2026-08-20 14:00:00+07', 'Sedang diperiksa'),
  ('S004', 'draf', 'Ahmad Fauzi', '2026-08-22 09:00:00+07', 'Surat dibuat, menunggu verifikasi'),
  ('S005', 'draf', 'Ahmad Fauzi', '2026-08-18 08:00:00+07', null),
  ('S005', 'verifikasi', 'Hj. Siti Rahayu', '2026-08-19 10:00:00+07', null),
  ('S005', 'menunggu_ttd', 'Hj. Siti Rahayu', '2026-08-19 10:01:00+07', null),
  ('S005', 'terbit', 'Drs. Muhammad Rizal', '2026-08-20 08:00:00+07', null),
  ('S005', 'terkirim', 'Ahmad Fauzi', '2026-08-20 13:00:00+07', 'Dikirim ke Dinas PMD');

-- ============================================================
-- SEED DATA: pengaduan
-- ============================================================
insert into pengaduan (tiket, nama, kontak, kategori, judul, deskripsi, desa, lokasi, status, petugas_terkait, respon_petugas, tanggal_masuk, tanggal_update) values
  ('TP-2026-00121', 'Budi Santoso', '08121234567', 'infrastruktur', 'Jalan Rusak di Depan SDN 01 Temiang', 'Jalan di depan SDN 01 Temiang sudah rusak parah sejak 3 bulan lalu. Banyak lubang besar yang membahayakan siswa dan pengendara.', 'Temiang', 'Jl. Pendidikan No. 1, depan SDN 01 Temiang', 'proses', 'Reni Wulandari', 'Laporan telah diterima dan diteruskan ke Dinas PU Kabupaten Lingga. Estimasi perbaikan 2 minggu.', now() - interval '5 days', now() - interval '2 days'),
  ('TP-2026-00118', 'Siti Aminah', '08129876543', 'pelayanan', 'Lambatnya Pengurusan Dokumen KTP', 'Saya sudah menunggu KTP selama 3 bulan sejak rekam data. Mohon dipercepat prosesnya.', 'Pasir Panjang', null, 'selesai', 'Reni Wulandari', 'KTP telah selesai diproses dan dapat diambil di kantor Disdukcapil Kab. Lingga.', now() - interval '10 days', now() - interval '1 day'),
  ('TP-2026-00115', 'Ahmad Yusuf', '08115556677', 'lingkungan', 'Tumpukan Sampah di Pinggir Sungai Duara', 'Terdapat tumpukan sampah yang sangat banyak di pinggir sungai dekat Desa Duara yang menimbulkan bau tidak sedap.', 'Duara', 'Pinggir Sungai Duara', 'verifikasi', null, null, now() - interval '15 days', now() - interval '15 days'),
  ('TP-2026-00109', 'Fatimah Zahra', '08123334444', 'sosial', 'Warga Kurang Mampu Belum Dapat Bantuan PKH', 'Ada beberapa warga di RT 03 yang memenuhi syarat PKH namun belum terdaftar sebagai penerima bantuan.', 'Sungai Buluh', 'RT 03 Desa Sungai Buluh', 'masuk', null, null, now() - interval '20 days', now() - interval '20 days')
on conflict (tiket) do nothing;

-- SEED riwayat pengaduan
insert into pengaduan_riwayat (pengaduan_id, status, oleh, tanggal, catatan)
select p.id, 'masuk', 'Sistem', p.tanggal_masuk, 'Laporan masuk dari portal publik'
from pengaduan p
where not exists (
  select 1 from pengaduan_riwayat pr where pr.pengaduan_id = p.id
);

-- ============================================================
-- SEED DATA: informasi
-- ============================================================
insert into informasi (slug, kategori, judul, ringkasan, isi, tanggal, penulis) values
  ('jadwal-pelayanan-agustus-2026', 'jadwal', 'Jadwal Pelayanan Kecamatan Agustus 2026', 'Informasi jadwal lengkap pelayanan di kantor kecamatan untuk bulan Agustus 2026.', 'Pelayanan administrasi kecamatan dibuka setiap hari Senin-Jumat pukul 08.00-15.00 WIB. Pelayanan meliputi: pengantar KTP, pengantar KK, surat keterangan domisili, dan berbagai rekomendasi administrasi.', '2026-08-01', 'Ahmad Fauzi'),
  ('musrenbang-2027', 'pengumuman', 'Musrenbang Tingkat Kecamatan 2027 Segera Digelar', 'Kecamatan Temiang Pesisir akan menggelar Musrenbang untuk perencanaan tahun 2027 pada bulan September 2026.', 'Dalam rangka penyusunan Rencana Kerja Pemerintah Daerah (RKPD) Tahun 2027, Kecamatan Temiang Pesisir akan menyelenggarakan Musyawarah Rencana Pembangunan (Musrenbang). Kegiatan ini akan diikuti oleh seluruh kepala desa, tokoh masyarakat, dan perwakilan warga dari 8 desa di wilayah Kecamatan Temiang Pesisir.', '2026-08-05', 'Hj. Siti Rahayu, S.Sos'),
  ('penyaluran-blt-agustus', 'program', 'Penyaluran BLT Dana Desa Agustus 2026', 'Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa untuk periode Agustus 2026 segera dilaksanakan.', 'Pemerintah Kecamatan Temiang Pesisir mengumumkan bahwa penyaluran BLT Dana Desa untuk bulan Agustus 2026 akan segera dilaksanakan di masing-masing desa. Warga yang terdaftar sebagai KPM (Keluarga Penerima Manfaat) diharapkan menyiapkan dokumen: KTP, KK, dan buku rekening.', '2026-08-12', 'Ahmad Fauzi'),
  ('posyandu-september', 'kesehatan', 'Jadwal Posyandu Serentak September 2026', 'Posyandu serentak di 8 desa se-Kecamatan Temiang Pesisir dijadwalkan minggu ke-2 September 2026.', 'Dalam rangka peningkatan layanan kesehatan masyarakat, Puskesmas Temiang Pesisir bekerja sama dengan Kecamatan akan menggelar Posyandu Serentak pada minggu ke-2 September 2026. Layanan mencakup: penimbangan balita, imunisasi, pemeriksaan ibu hamil, dan konsultasi gizi.', '2026-08-18', 'Admin Kecamatan'),
  ('beasiswa-sd-smp-2026', 'pendidikan', 'Pendaftaran Beasiswa Siswa Berprestasi 2026', 'Dinas Pendidikan Kabupaten Lingga membuka pendaftaran beasiswa untuk siswa SD dan SMP berprestasi di Kecamatan Temiang Pesisir.', 'Dinas Pendidikan Kabupaten Lingga kembali membuka program beasiswa untuk siswa SD dan SMP berprestasi. Persyaratan: nilai rapor rata-rata minimal 80, berasal dari keluarga kurang mampu, aktif bersekolah. Pendaftaran melalui kepala sekolah masing-masing hingga 30 September 2026.', '2026-08-20', 'Admin Kecamatan'),
  ('gotong-royong-nasional-2026', 'berita', 'Kecamatan Temiang Pesisir Ikuti Gotong Royong Nasional', 'Seluruh desa di Kecamatan Temiang Pesisir berpartisipasi dalam kegiatan Gotong Royong Nasional yang digelar serentak di seluruh Indonesia.', 'Pada tanggal 17 Agustus 2026, bertepatan dengan HUT Kemerdekaan RI ke-81, Kecamatan Temiang Pesisir menggelar kegiatan Gotong Royong Nasional secara serentak di 8 desa. Kegiatan ini melibatkan lebih dari 500 warga yang antusias membersihkan lingkungan dan memperbaiki fasilitas umum desa.', '2026-08-21', 'Hj. Siti Rahayu, S.Sos')
on conflict (slug) do nothing;
