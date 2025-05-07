import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date)
}

export function formatNumber(value: number, precision = 2): string {
  return value.toFixed(precision)
}

export function getWindDirection(degrees: number): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ]
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "online":
      return "text-green-500"
    case "warning":
      return "text-amber-500"
    case "error":
    case "offline":
      return "text-red-500"
    default:
      return "text-muted-foreground"
  }
}

export function downloadCSV(data: any[], filename = "export.csv"): void {
  if (!data.length) return

  // Get headers from first object
  const headers = Object.keys(data[0])

  // Convert data to CSV format
  const csvRows = []
  csvRows.push(headers.join(","))

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
      // Handle strings with commas by wrapping in quotes
      return typeof value === "string" && value.includes(",") ? `"${value}"` : value
    })
    csvRows.push(values.join(","))
  }

  // Create and download the file
  const csvString = csvRows.join("\n")
  const blob = new Blob([csvString], { type: "text/csv" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.setAttribute("hidden", "")
  a.setAttribute("href", url)
  a.setAttribute("download", filename)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
