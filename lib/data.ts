// This file contains functions for fetching and processing data

/**
 * Parse CSV data
 * @param text CSV text content
 * @returns Array of objects representing the CSV data
 */
function parseCSV(text: string): any[] {
  const lines = text.split("\n")
  if (lines.length <= 1) return []

  const headers = lines[0].split(",").map((h) => h.trim())

  return lines
    .slice(1)
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const values = line.split(",")
      const entry: Record<string, any> = {}

      headers.forEach((header, i) => {
        if (i < values.length) {
          const value = values[i].trim()
          // Try to convert numeric values
          if (!isNaN(Number.parseFloat(value)) && isFinite(Number(value))) {
            entry[header] = Number.parseFloat(value)
          } else {
            entry[header] = value
          }
        } else {
          entry[header] = null
        }
      })

      // Add date_time field for convenience if dates and times exist
      if (entry.dates && entry.times) {
        entry.date_time = `${entry.dates} ${entry.times}`
      }

      return entry
    })
}

/**
 * Fetch weather data from the CSV file
 * @returns Promise that resolves to an array of weather data objects
 */
export async function fetchWeatherData(): Promise<any[]> {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ML-417ADS_125416523_3%20%281%29-9P2dYYqz1hyBOddyEOwn1qBPy3MBbf.csv",
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`)
    }

    const text = await response.text()
    return parseCSV(text)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return []
  }
}

/**
 * Fetch water quality data from the CSV file
 * @returns Promise that resolves to an array of water quality data objects
 */
export async function fetchWaterQualityData(): Promise<any[]> {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/readings-wYZqTTEfvKuQeW4zmoPJFguthNbtJj.csv",
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch water quality data: ${response.status} ${response.statusText}`)
    }

    const text = await response.text()
    return parseCSV(text)
  } catch (error) {
    console.error("Error fetching water quality data:", error)
    return []
  }
}

/**
 * Process data for charts
 * @param data Raw data array
 * @param limit Number of items to include
 * @returns Processed data for charts
 */
export function processChartData(data: any[], limit = 24): any[] {
  if (!data || data.length === 0) return []

  return data.slice(-limit).map((item, index) => {
    return {
      time: item.times || `${index}:00`,
      temperature: Number.parseFloat(item.temp || 0),
      windSpeed: Number.parseFloat(item.spd || 0),
      humidity: item.humidity || Math.random() * 100, // Use real data if available, otherwise simulate
      solar: item.solar || Math.random() * 1000, // Use real data if available, otherwise simulate
      ph: Number.parseFloat(item.ph || 0),
      do: Number.parseFloat(item.do || 0),
      orp: Number.parseFloat(item.orp || 0),
    }
  })
}
