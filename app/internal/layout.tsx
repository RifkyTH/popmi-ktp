import { cookies } from "next/headers"
import { getSessionFromCookie } from "@/lib/auth"
import { Sidebar } from "@/components/internal/sidebar"
import { TopBar } from "@/components/internal/topbar"
import { LayoutWrapper } from "@/components/internal/layout-wrapper"

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get("silat_session")?.value
  const user = getSessionFromCookie(sessionValue)

  return (
    <LayoutWrapper sidebar={<Sidebar user={user} />} topbar={<TopBar />}>
      {children}
    </LayoutWrapper>
  )
}
