import * as React from "react"
import { Check, Clock, FileCheck, FileText, Send } from "lucide-react"
import { cn } from "@/lib/utils"

type StatusStep = {
  label: string
  description?: string
  timestamp?: string
  done: boolean
  active?: boolean
}

const STATUS_SURAT: StatusStep[] = []

interface StatusTimelineProps {
  steps: StatusStep[]
  className?: string
}

export function StatusTimeline({ steps, className }: StatusTimelineProps) {
  return (
    <ol className={cn("relative border-l border-kuning-muda ml-3", className)}>
      {steps.map((step, i) => (
        <li key={i} className="mb-6 ml-6">
          <span
            className={cn(
              "absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ring-krem text-xs font-bold",
              step.done
                ? "bg-hijau text-white"
                : step.active
                ? "bg-kuning text-teks"
                : "bg-gray-200 text-gray-500"
            )}
          >
            {step.done ? <Check className="w-3 h-3" /> : i + 1}
          </span>
          <h3
            className={cn(
              "flex items-center mb-0.5 text-sm font-semibold",
              step.done ? "text-hijau" : step.active ? "text-teks" : "text-gray-400"
            )}
          >
            {step.label}
          </h3>
          {step.description && (
            <p className="text-xs text-teks/60">{step.description}</p>
          )}
          {step.timestamp && (
            <time className="block text-xs font-normal leading-none text-teks/50 mt-0.5">
              {step.timestamp}
            </time>
          )}
        </li>
      ))}
    </ol>
  )
}
