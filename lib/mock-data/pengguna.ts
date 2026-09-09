export type UserRole = "staf" | "kasi" | "camat" | "admin" | "petugas"

export type User = {
  id: string
  nama: string
  role: UserRole
  jabatan: string
  desa?: string
  username: string
  password: string
}

export const USERS: User[] = [
  {
    id: "U001",
    nama: "Ahmad Fauzi",
    role: "staf",
    jabatan: "Staf Administrasi",
    username: "staf",
    password: "staf123",
  },
  {
    id: "U002",
    nama: "Hj. Siti Rahayu, S.Sos",
    role: "kasi",
    jabatan: "Kasi Pemerintahan",
    username: "kasi",
    password: "kasi123",
  },
  {
    id: "U003",
    nama: "Drs. Muhammad Rizal",
    role: "camat",
    jabatan: "Camat Temiang Pesisir",
    username: "camat",
    password: "camat123",
  },
  {
    id: "U004",
    nama: "Admin Sistem",
    role: "admin",
    jabatan: "Administrator",
    username: "admin",
    password: "admin123",
  },
  {
    id: "U005",
    nama: "Budi Santoso",
    role: "operator_desa",
    jabatan: "Operator Desa Temiang",
    desa: "Temiang",
    username: "desa_temiang",
    password: "desa123",
  },
  {
    id: "U006",
    nama: "Reni Wulandari",
    role: "petugas",
    jabatan: "Petugas Pengaduan",
    username: "petugas",
    password: "petugas123",
  },
]
