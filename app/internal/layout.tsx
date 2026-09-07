import { Sidebar } from "@/components/internal/sidebar"
import { TopBar } from "@/components/internal/topbar"
import { LayoutWrapper } from "@/components/internal/layout-wrapper"

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutWrapper sidebar={<Sidebar />} topbar={<TopBar />}>
      {children}
    </LayoutWrapper>
  )
}

