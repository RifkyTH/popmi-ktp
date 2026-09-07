"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export function LayoutWrapper({
  sidebar,
  topbar,
  children,
}: {
  sidebar: React.ReactNode
  topbar: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthOrPrint = pathname === "/internal/login" || pathname.endsWith("/cetak")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Auto close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  if (isAuthOrPrint) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-krem relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-auto ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {sidebar}
        {/* Close Button on Mobile */}
        {isMobileMenuOpen && (
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden absolute top-4 -right-14 w-10 h-10 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
        {/* Topbar Wrapper for Mobile Menu Button */}
        <div className="relative">
           {topbar}
           <button
             onClick={() => setIsMobileMenuOpen(true)}
             className="lg:hidden absolute left-4 top-1/2 -translate-y-1/2 p-1.5 text-hijau hover:bg-hijau/10 rounded-md transition-colors"
           >
             <Menu className="w-5 h-5" />
           </button>
        </div>
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}

