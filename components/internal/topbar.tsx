import { cookies } from "next/headers"
import Link from "next/link"
import { getSessionFromCookie } from "@/lib/auth"

export async function TopBar() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get("silat_session")?.value
  const user = getSessionFromCookie(sessionValue)
  
  // Default values kalau user belum ada/login (fallback)
  const nama = user?.nama || "Ahmad Fauzi"
  const role = user?.role || "Staf"
  const fotoUrl = user?.foto_url
  const inisial = nama
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  return (
    <header className="bg-white border-b border-kuning-muda pl-12 lg:pl-6 pr-4 py-3.5 flex items-center justify-between">
      <div className="text-[10px] md:text-xs text-teks/50 font-medium tracking-wide leading-tight">
        Kecamatan Temiang Pesisir <span className="hidden sm:inline">&nbsp;·&nbsp; Kabupaten Lingga</span>
      </div>
      <Link href="/internal/profil" className="flex items-center gap-2 shrink-0 group hover:opacity-85 transition-opacity" title="Lihat Profil Saya">
        <div className="w-7 h-7 rounded-full bg-hijau flex items-center justify-center text-white text-xs font-bold overflow-hidden shadow-xs border border-white">
          {fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fotoUrl} alt={nama} className="w-full h-full object-cover" />
          ) : (
            <span>{inisial}</span>
          )}
        </div>
        <span className="text-sm font-medium text-teks group-hover:text-hijau transition-colors hidden sm:block">{nama}</span>
        <span className="text-xs bg-hijau/10 text-hijau px-2 py-0.5 rounded-full font-semibold hidden sm:block capitalize">
          {role.replace("_", " ")}
        </span>
      </Link>
    </header>
  )
}
