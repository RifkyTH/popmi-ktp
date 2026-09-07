import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-kuning text-teks hover:bg-kuning/80",
        secondary:
          "bg-hijau text-white hover:bg-hijau/80",
        destructive:
          "bg-merah text-white hover:bg-merah/80",
        outline: "text-teks border border-kuning",
        draf: "bg-gray-200 text-gray-800",
        verifikasi: "bg-blue-100 text-blue-800 border border-blue-200",
        ttd: "bg-orange-100 text-orange-800 border border-orange-200",
        terbit: "bg-green-100 text-green-800 border border-green-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
