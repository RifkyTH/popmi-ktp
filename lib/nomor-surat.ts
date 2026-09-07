import { JenisSurat, NOMOR_FORMAT } from "@/lib/mock-data/surat"

// Simple in-memory counter (resets on server restart — will be replaced with DB sequence)
const counters: Record<string, number> = {}

export function generateNomorSurat(jenis: JenisSurat, tahun = new Date().getFullYear()): string {
  const key = `${jenis}-${tahun}`
  if (!counters[key]) counters[key] = 0
  counters[key]++

  const seq = String(counters[key]).padStart(3, "0")
  const prefix = NOMOR_FORMAT[jenis]

  switch (jenis) {
    case "bbm_jbkp":
      return `${seq}/${prefix}/TRANS/JBKP/${tahun}`
    case "bbm_jbt":
      return `${seq}/${prefix}/RT-MIKRO/JBT/${tahun}`
    default:
      return `${prefix}/${seq}/${tahun}`
  }
}

export function generateTiketPengaduan(): string {
  const year = new Date().getFullYear()
  const num = Math.floor(Math.random() * 900 + 100)
  return `TP-${year}-${String(num).padStart(5, "0")}`
}
