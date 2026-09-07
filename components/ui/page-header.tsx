import * as React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
  ornament?: boolean
}

export function PageHeader({ title, subtitle, children, className, ornament = true }: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      {ornament && (
        <div className="flex items-center gap-2 mb-2">
          <div className="h-0.5 w-8 bg-kuning rounded-full" />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-kuning">
            <path d="M8 2L9.5 6H14L10.5 8.5L12 12.5L8 10L4 12.5L5.5 8.5L2 6H6.5L8 2Z" fill="currentColor"/>
          </svg>
          <div className="h-0.5 w-8 bg-kuning rounded-full" />
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-serif text-hijau leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-teks/60 mt-1">{subtitle}</p>}
        </div>
        {children && <div className="flex gap-2 shrink-0">{children}</div>}
      </div>
    </div>
  )
}
