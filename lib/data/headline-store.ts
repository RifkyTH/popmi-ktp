import "server-only"
import fs from "fs"
import path from "path"

const HEADLINES_FILE_PATH = path.join(process.cwd(), "lib", "data", "headlines.json")

// Default headline slugs/ids if none saved
const DEFAULT_HEADLINES = [
  "musyawarah-perencanaan-pembangunan-2026",
  "program-bantuan-langsung-tunai-2026",
  "jadwal-pelayanan-kecamatan-2026",
  "kegiatan-gotong-royong-pantai-2026",
  "musrenbang-2027",
  "penyaluran-blt-agustus",
  "gotong-royong-nasional-2026",
]

export function getHeadlineIdentifiers(): Set<string> {
  try {
    if (fs.existsSync(HEADLINES_FILE_PATH)) {
      const data = JSON.parse(fs.readFileSync(HEADLINES_FILE_PATH, "utf-8"))
      if (Array.isArray(data)) {
        return new Set(data)
      }
    }
  } catch (err) {
    console.warn("Could not read headlines store, falling back to default:", err)
  }
  return new Set(DEFAULT_HEADLINES)
}

export function saveHeadlineIdentifier(identifier: string, isHeadline: boolean): void {
  if (!identifier) return
  try {
    const currentSet = getHeadlineIdentifiers()
    if (isHeadline) {
      currentSet.add(identifier)
    } else {
      currentSet.delete(identifier)
    }
    const dir = path.dirname(HEADLINES_FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(
      HEADLINES_FILE_PATH,
      JSON.stringify(Array.from(currentSet), null, 2),
      "utf-8"
    )
  } catch (err) {
    console.error("Failed to save headline identifier:", err)
  }
}

export function removeHeadlineIdentifier(identifier: string): void {
  if (!identifier) return
  try {
    const currentSet = getHeadlineIdentifiers()
    if (currentSet.has(identifier)) {
      currentSet.delete(identifier)
      fs.writeFileSync(
        HEADLINES_FILE_PATH,
        JSON.stringify(Array.from(currentSet), null, 2),
        "utf-8"
      )
    }
  } catch (err) {
    console.error("Failed to remove headline identifier:", err)
  }
}

export function isItemHeadline(item: { id?: string; slug?: string; is_headline?: boolean }): boolean {
  if (typeof item.is_headline === "boolean") {
    return item.is_headline
  }
  const headlines = getHeadlineIdentifiers()
  if (item.slug && headlines.has(item.slug)) return true
  if (item.id && headlines.has(item.id)) return true
  return false
}
