import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns"
import type { Severity } from "@/types/domain"
import {
  SEVERITY_COLORS,
  SEVERITY_BG_CLASSES,
  SEVERITY_TEXT_CLASSES,
  SEVERITY_BORDER_CLASSES,
} from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSeverityColor(severity: Severity): string {
  return SEVERITY_COLORS[severity]
}

export function getSeverityBgClass(severity: Severity): string {
  return SEVERITY_BG_CLASSES[severity]
}

export function getSeverityTextClass(severity: Severity): string {
  return SEVERITY_TEXT_CLASSES[severity]
}

export function getSeverityBorderClass(severity: Severity): string {
  return SEVERITY_BORDER_CLASSES[severity]
}

export function formatTimestamp(timestamp: string): string {
  try {
    return format(new Date(timestamp), "dd MMM yyyy, HH:mm")
  } catch {
    return "Unknown"
  }
}

export function formatTimeAgo(timestamp: string): string {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  } catch {
    return "Unknown"
  }
}

export function severityOrder(severity: Severity): number {
  const order: Record<Severity, number> = {
    severe: 0,
    warning: 1,
    alert: 2,
    normal: 3,
  }
  return order[severity]
}
