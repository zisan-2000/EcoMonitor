"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Bar,
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  Brush,
  ReferenceLine,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Download, RefreshCw, Activity, Cloud, Droplets, Sun, Wind, Thermometer, Gauge, CloudRain, CloudSnow, CloudFog, CloudDrizzle, Info } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WeatherPanelProps {
  data: Array<{
    timestamp: string
    airTemperature?: number
    windSpeed?: number
    humidity?: number
    solar?: number
    precipitation?: number
    gustWindSpeed?: number
    vaporPressure?: number
    atmosphericPressure?: number
    compassHeading?: number
    [key: string]: any
  }>
  waterData?: any
}

export default function WeatherPanel({ data }: WeatherPanelProps) {
  const [timeRange, setTimeRange] = useState("all")
  const [dateFilter, setDateFilter] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })
  const [chartData, setChartData] = useState<
    Array<{
      time: string
      formattedTime: string
      formattedDateTime: string
      date: string
      timestamp: string
      dateObj: Date
      temperature: number
      windSpeed: number
      humidity: number
      solar: number
      precipitation: number
      gustWindSpeed: number
      vaporPressure: number
      atmosphericPressure: number
      compassHeading: number
      windDirection: string
      dewPoint: number
      heatIndex: number
      windChill: number
      uvIndex: number
    }>
  >([])
  const [windDirectionData, setWindDirectionData] = useState<Array<{ name: string; value: number }>>([])
  const [temperatureGaugeData, setTemperatureGaugeData] = useState<
    Array<{ name: string; value: number; fill: string }>
  >([])
  const [activeTab, setActiveTab] = useState("overview")
  const [animationSpeed, setAnimationSpeed] = useState(1500)
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dataStats, setDataStats] = useState({
    totalRecords: 0,
    dateRange: { start: "", end: "" },
    hasTemperature: false,
    hasWindSpeed: false,
    hasHumidity: false,
    hasSolar: false,
    hasPrecipitation: false,
  })
  const [showFullTimespan, setShowFullTimespan] = useState(true)

  interface TableDataItem {
    id: number
    date: string
    time: string
    solar: number
    precipitation: number
    strikes: number
    strikeDistance: number
    windSpeed: number
    windDirection: string
    gustWindSpeed: number
    airTemperature: number
    vaporPressure: number
    atmosphericPressure: number
    humidity: number
    sensorTemp: number
    xOrientation: number
    yOrientation: number
    compassHeading: number
    sysCode: string
    sysMessage: string
  }

  const [tableData, setTableData] = useState<TableDataItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Calculate derived weather metrics
  const calculateDewPoint = (temp: number, humidity: number) => {
    if (isNaN(temp) || isNaN(humidity) || humidity <= 0) return 0
    // Magnus formula for dew point calculation
    const a = 17.27
    const b = 237.7
    const alpha = (a * temp) / (b + temp) + Math.log(humidity / 100)
    return (b * alpha) / (a - alpha)
  }

  const calculateHeatIndex = (temp: number, humidity: number) => {
    if (isNaN(temp) || isNaN(humidity)) return temp
    // Simplified heat index calculation
    if (temp < 27) return temp
    return (
      -8.784695 +
      1.61139411 * temp +
      2.338549 * humidity -
      0.14611605 * temp * humidity -
      0.012308094 * temp * temp -
      0.016424828 * humidity * humidity +
      0.002211732 * temp * temp * humidity +
      0.00072546 * temp * humidity * humidity -
      0.000003582 * temp * temp * humidity * humidity
    )
  }

  const calculateWindChill = (temp: number, windSpeed: number) => {
    if (isNaN(temp) || isNaN(windSpeed)) return temp
    // Wind chill calculation
    if (temp > 10 || windSpeed < 4.8) return temp
    return 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temp * Math.pow(windSpeed, 0.16)
  }

  const calculateUVIndex = (solar: number) => {
    if (isNaN(solar)) return 0
    // Simplified UV index calculation based on solar radiation
    return Math.min(11, Math.max(0, Math.floor(solar / 25)))
  }

  const getWindDirection = (degrees: number) => {
    if (isNaN(degrees)) return "N/A"
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

  // Function to filter data based on time range
  const getFilteredData = (data: any[], timeRange: string, dateFilter: { start: Date | null; end: Date | null }) => {
    if (!data || data.length === 0) return []

    // Sort data by timestamp, handling invalid dates
    const sortedData = [...data].sort((a, b) => {
      try {
        const dateA = new Date(a.timestamp)
        const dateB = new Date(b.timestamp)

        // Check if dates are valid
        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0
        if (isNaN(dateA.getTime())) return 1 // Invalid dates go to the end
        if (isNaN(dateB.getTime())) return -1

        return dateA.getTime() - dateB.getTime()
      } catch (e) {
        return 0 // If comparison fails, keep original order
      }
    })

    // Apply time range filter
    if (timeRange === "all" || showFullTimespan) {
      return sortedData
    } else if (timeRange === "24h") {
      const now = new Date()
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      return sortedData.filter((item) => {
        try {
          const itemDate = new Date(item.timestamp)
          return !isNaN(itemDate.getTime()) && itemDate >= oneDayAgo
        } catch (e) {
          return false
        }
      })
    } else if (timeRange === "7d") {
      const now = new Date()
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return sortedData.filter((item) => {
        try {
          const itemDate = new Date(item.timestamp)
          return !isNaN(itemDate.getTime()) && itemDate >= sevenDaysAgo
        } catch (e) {
          return false
        }
      })
    } else if (timeRange === "30d") {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return sortedData.filter((item) => {
        try {
          const itemDate = new Date(item.timestamp)
          return !isNaN(itemDate.getTime()) && itemDate >= thirtyDaysAgo
        } catch (e) {
          return false
        }
      })
    } else if (timeRange === "custom" && dateFilter.start && dateFilter.end) {
      return sortedData.filter((item) => {
        try {
          const itemDate = new Date(item.timestamp)
          return !isNaN(itemDate.getTime()) && itemDate >= dateFilter.start! && itemDate <= dateFilter.end!
        } catch (e) {
          return false
        }
      })
    }

    return sortedData
  }

  // Format date for display based on timespan
  const formatDateForDisplay = (date: Date, showTime: boolean = true): string => {
    if (!date || isNaN(date.getTime())) return "Invalid date"
    
    const dateOptions: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }
    
    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit'
    }
    
    if (showTime) {
      return date.toLocaleDateString(undefined, dateOptions) + ' ' + 
             date.toLocaleTimeString(undefined, timeOptions)
    } else {
      return date.toLocaleDateString(undefined, dateOptions)
    }
  }

  useEffect(() => {
    if (data.length > 0) {
      setIsLoading(true)

      // Analyze data for statistics
      const hasTemperature = data.some(
        (item) => item.airTemperature !== undefined && !isNaN(Number(item.airTemperature)),
      )
      const hasWindSpeed = data.some((item) => item.windSpeed !== undefined && !isNaN(Number(item.windSpeed)))
      const hasHumidity = data.some((item) => item.humidity !== undefined && !isNaN(Number(item.humidity)))
      const hasSolar = data.some((item) => item.solar !== undefined && !isNaN(Number(item.solar)))
      const hasPrecipitation = data.some(
        (item) => item.precipitation !== undefined && !isNaN(Number(item.precipitation)),
      )

      // Get date range
      const validDates = data
        .map((item) => {
          try {
            const date = new Date(item.timestamp)
            return isNaN(date.getTime()) ? null : date
          } catch (e) {
            return null
          }
        })
        .filter((date) => date !== null) as Date[]

      let startDate = ""
      let endDate = ""

      if (validDates.length > 0) {
        const sortedDates = validDates.sort((a, b) => a.getTime() - b.getTime())
        startDate = formatDateForDisplay(sortedDates[0], false)
        endDate = formatDateForDisplay(sortedDates[sortedDates.length - 1], false)
      }

      setDataStats({
        totalRecords: data.length,
        dateRange: { start: startDate, end: endDate },
        hasTemperature,
        hasWindSpeed,
        hasHumidity,
        hasSolar,
        hasPrecipitation,
      })

      // Get filtered data based on time range
      const filteredData = getFilteredData(data, timeRange, dateFilter)

      // Process data for charts
      const processedData = filteredData.map((item, index) => {
        // Improved date parsing to handle various formats
        let timestamp: Date | null = null
        let formattedTime = ""
        let formattedDateTime = ""
        let date = ""
        let dateObj = new Date()

        try {
          // Try to parse the timestamp
          if (item.timestamp) {
            // Check if timestamp is already a Date object
            if (item.timestamp instanceof Date) {
              timestamp = item.timestamp
              if (isNaN(timestamp.getTime())) {
                console.warn(`Invalid Date object for item ${index}`)
                timestamp = null
              }
            }
            // Check if timestamp is in ISO format (YYYY-MM-DDTHH:MM:SS)
            else if (typeof item.timestamp === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(item.timestamp)) {
              timestamp = new Date(item.timestamp)
              if (isNaN(timestamp.getTime())) {
                console.warn(`Invalid ISO timestamp for item ${index}: ${item.timestamp}`)
                timestamp = null
              }
            }
            // Check if timestamp is in format "YYYY-MM-DD HH:MM:SS"
            else if (typeof item.timestamp === "string" && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(item.timestamp)) {
              const [datePart, timePart] = item.timestamp.split(" ")
              timestamp = new Date(`${datePart}T${timePart}`)
              if (isNaN(timestamp.getTime())) {
                console.warn(`Invalid date-time format for item ${index}: ${item.timestamp}`)
                timestamp = null
              }
            }
            // Check if we have separate date and time fields
            else if (item.date && item.time) {
              timestamp = new Date(`${item.date}T${item.time}`)
              if (isNaN(timestamp.getTime())) {
                console.warn(`Invalid date+time fields for item ${index}: ${item.date} ${item.time}`)
                timestamp = null
              }
            }
            // Try direct parsing as a last resort
            else if (typeof item.timestamp === "string") {
              timestamp = new Date(item.timestamp)
              if (isNaN(timestamp.getTime())) {
                console.warn(`Failed to parse timestamp for item ${index}: ${item.timestamp}`)
                timestamp = null
              }
            }

            // Format the time and date if we have a valid timestamp
            if (timestamp && !isNaN(timestamp.getTime())) {
              formattedTime = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              date = timestamp.toLocaleDateString()
              formattedDateTime = formatDateForDisplay(timestamp)
              dateObj = timestamp
            } else {
              formattedTime = `Item ${index}`
              date = "Unknown date"
              formattedDateTime = `Item ${index}`
              dateObj = new Date() // Fallback
            }
          } else {
            // No timestamp provided
            console.warn(`No timestamp for item ${index}`)
            formattedTime = `Item ${index}`
            date = "Unknown date"
            formattedDateTime = `Item ${index}`
            dateObj = new Date() // Fallback
          }
        } catch (error) {
          console.error(`Error parsing date for item ${index}:`, error)
          formattedTime = `Item ${index}`
          date = "Unknown date"
          formattedDateTime = `Item ${index}`
          dateObj = new Date() // Fallback
          timestamp = null
        }

        // Parse numeric values with validation
        const parseNumeric = (value: any) => {
          if (value === undefined || value === null) return 0
          const parsed = Number.parseFloat(String(value))
          return isNaN(parsed) ? 0 : parsed
        }

        const temperature = parseNumeric(item.airTemperature)
        const windSpeed = parseNumeric(item.windSpeed)
        const humidity = parseNumeric(item.humidity)
        const solar = parseNumeric(item.solar)
        const precipitation = parseNumeric(item.precipitation)
        const gustWindSpeed = parseNumeric(item.gustWindSpeed)
        const vaporPressure = parseNumeric(item.vaporPressure)
        const atmosphericPressure = parseNumeric(item.atmosphericPressure)
        const compassHeading = parseNumeric(item.compassHeading)

        return {
          time: formattedTime,
          formattedTime,
          formattedDateTime,
          date,
          timestamp: timestamp && !isNaN(timestamp.getTime()) ? timestamp.toISOString() : new Date().toISOString(),
          dateObj: dateObj,
          temperature,
          windSpeed,
          humidity,
          solar,
          precipitation,
          gustWindSpeed,
          vaporPressure,
          atmosphericPressure,
          compassHeading,
          windDirection: getWindDirection(compassHeading),
          dewPoint: calculateDewPoint(temperature, humidity),
          heatIndex: calculateHeatIndex(temperature, humidity),
          windChill: calculateWindChill(temperature, windSpeed),
          uvIndex: calculateUVIndex(solar),
        }
      })

      setChartData(processedData)

      // Generate wind direction data from actual data, not random values
      const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
      const windDirCounts: Record<string, number> = {}

      // Count occurrences of each wind direction
      processedData.forEach((item) => {
        if (item.windDirection && item.windDirection !== "N/A") {
          // Get the first two characters of the wind direction
          const dir = item.windDirection.substring(0, 2)
          // Find the closest cardinal direction
          const closestDir = directions.find((d) => dir.startsWith(d)) || directions[0]
          windDirCounts[closestDir] = (windDirCounts[closestDir] || 0) + 1
        }
      })

      // Create wind direction data with actual counts
      const windDirData = directions.map((dir) => ({
        name: dir,
        value: windDirCounts[dir] || 0, // Use 0 instead of random if no data
      }))

      // Only include directions that have data
      const filteredWindDirData = windDirData.filter((item) => item.value > 0)

      // If no wind direction data, add a placeholder
      if (filteredWindDirData.length === 0) {
        filteredWindDirData.push({
          name: "No Data",
          value: 1,
        })
      }

      setWindDirectionData(filteredWindDirData)

      // Generate temperature gauge data from actual data
      const temperatures = processedData.map((item) => item.temperature).filter((temp) => !isNaN(temp) && temp !== 0)

      let minTemp = 0
      let maxTemp = 0
      let currentTemp = 0

      if (temperatures.length > 0) {
        minTemp = Math.min(...temperatures)
        maxTemp = Math.max(...temperatures)
        currentTemp = temperatures[temperatures.length - 1]
      }

      const tempData = [
        {
          name: "Current",
          value: currentTemp,
          fill: "#FF5722",
        },
        {
          name: "Min",
          value: minTemp,
          fill: "#2196F3",
        },
        {
          name: "Max",
          value: maxTemp,
          fill: "#E91E63",
        },
      ]

      setTemperatureGaugeData(tempData)

      // Prepare table data
      setTableData(
        filteredData.map((item, index) => {
          let dateStr = "N/A"
          let timeStr = "N/A"

          try {
            if (item.timestamp) {
              // Try to parse the timestamp
              let timestamp

              // Check if timestamp is already a Date object
              if (item.timestamp instanceof Date) {
                timestamp = item.timestamp
                if (isNaN(timestamp.getTime())) {
                  timestamp = null
                }
              }
              // Check if timestamp is in ISO format (YYYY-MM-DDTHH:MM:SS)
              else if (typeof item.timestamp === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(item.timestamp)) {
                timestamp = new Date(item.timestamp)
                if (isNaN(timestamp.getTime())) {
                  timestamp = null
                }
              }
              // Check if timestamp is in format "YYYY-MM-DD HH:MM:SS"
              else if (typeof item.timestamp === "string" && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(item.timestamp)) {
                const [datePart, timePart] = item.timestamp.split(" ")
                timestamp = new Date(`${datePart}T${timePart}`)
                if (isNaN(timestamp.getTime())) {
                  timestamp = null
                }
              } else {
                try {
                  timestamp = new Date(item.timestamp)
                  if (isNaN(timestamp.getTime())) {
                    timestamp = null
                  }
                } catch (e) {
                  timestamp = null
                }
              }

              if (timestamp && !isNaN(timestamp.getTime())) {
                dateStr = timestamp.toLocaleDateString()
                timeStr = timestamp.toLocaleTimeString()
              } else if (typeof item.timestamp === "string") {
                // Try to extract date and time from string
                const parts = item.timestamp.split(/[T ]/)
                if (parts.length >= 2) {
                  dateStr = parts[0]
                  timeStr = parts[1]
                }
              }
            } else if (item.date) {
              dateStr = item.date
              timeStr = item.time || "N/A"
            }
          } catch (error) {
            console.error(`Error parsing date for table item ${index}:`, error)
          }

          // Parse numeric values with validation
          const parseNumeric = (value: any) => {
            if (value === undefined || value === null) return "N/A"
            const parsed = Number.parseFloat(String(value))
            return isNaN(parsed) ? "N/A" : parsed
          }

          return {
            id: index + 1,
            date: dateStr,
            time: timeStr,
            solar: parseNumeric(item.solar),
            precipitation: parseNumeric(item.precipitation),
            strikes: parseNumeric(item.strikes),
            strikeDistance: parseNumeric(item.strikeDistance),
            windSpeed: parseNumeric(item.windSpeed),
            windDirection: item.compassHeading ? getWindDirection(parseNumeric(item.compassHeading)) : "N/A",
            gustWindSpeed: parseNumeric(item.gustWindSpeed),
            airTemperature: parseNumeric(item.airTemperature),
            vaporPressure: parseNumeric(item.vaporPressure),
            atmosphericPressure: parseNumeric(item.atmosphericPressure),
            humidity: parseNumeric(item.humidity),
            sensorTemp: parseNumeric(item.sensorTemp),
            xOrientation: parseNumeric(item.xOrientation),
            yOrientation: parseNumeric(item.yOrientation),
            compassHeading: parseNumeric(item.compassHeading),
            sysCode: item.sysCode || "N/A",
            sysMessage: item.sysMessage || "N/A",
          }
        }),
      )

      // Simulate loading for animation effect
      setTimeout(() => {
        setIsLoading(false)
      }, 800)
    }
  }, [data, timeRange, dateFilter, showFullTimespan])

  // Color palettes for different chart types - using meteorological standard colors
  const COLORS = {
    temperature: "#FF5722", // Orange-red for temperature
    windSpeed: "#2196F3", // Blue for wind
    humidity: "#9C27B0", // Purple for humidity
    solar: "#FFC107", // Yellow for solar
    precipitation: "#4CAF50", // Green for precipitation
    gustWindSpeed: "#3F51B5", // Indigo for gust
    vaporPressure: "#E91E63", // Pink for vapor pressure
    atmosphericPressure: "#009688", // Teal for atmospheric pressure
    compassHeading: "#795548", // Brown for compass heading
    dewPoint: "#00BCD4", // Cyan for dew point
    heatIndex: "#F44336", // Red for heat index
    windChill: "#03A9F4", // Light blue for wind chill
    uvIndex: "#FF9800", // Amber for UV index
  }

  const WIND_COLORS = [
    "#64B5F6", // Light blue
    "#42A5F5",
    "#2196F3",
    "#1E88E5",
    "#1976D2",
    "#1565C0",
    "#0D47A1",
    "#0D47A1", // Dark blue
  ]

  const TEMP_GRADIENT = [
    { temp: -10, color: "#9FC5E8" }, // Cold blue
    { temp: 0, color: "#B6D7A8" }, // Cool green
    { temp: 10, color: "#FFE599" }, // Mild yellow
    { temp: 20, color: "#F9CB9C" }, // Warm orange
    { temp: 30, color: "#EA9999" }, // Hot red
    { temp: 40, color: "#CC0000" }, // Very hot deep red
  ]

  const getTemperatureColor = (temp: number) => {
    for (let i = TEMP_GRADIENT.length - 1; i >= 0; i--) {
      if (temp >= TEMP_GRADIENT[i].temp) {
        return TEMP_GRADIENT[i].color
      }
    }
    return TEMP_GRADIENT[0].color
  }

  // Filter and paginate table data
  const filteredData = tableData.filter((item) =>
    Object.values(item).some(
      (value) =>
        value !== undefined && value !== null && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Handle date range change
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateFilter({
      start: range.from || null,
      end: range.to || null,
    })
  }

  // Get X-axis formatter based on data timespan
  const getXAxisFormatter = () => {
    // Determine if we need to show dates based on the timespan
    const needsDateDisplay = chartData.length > 24 || 
                            (chartData.length > 0 && 
                             chartData[chartData.length-1].dateObj.getTime() - 
                             chartData[0].dateObj.getTime() > 24 * 60 * 60 * 1000);
    
    return (value: string, index: number) => {
      // For dense data, show fewer ticks
      const showTick = index % Math.ceil(chartData.length / 10) === 0;
      
      if (!showTick) return '';
      
      if (needsDateDisplay) {
        // Show date and time for longer timespans
        return chartData[index].date + ' ' + value;
      }
      
      // Just show time for shorter timespans
      return value;
    };
  };

  // Get weather condition icon based on data
  const getWeatherIcon = (data: (typeof chartData)[0]) => {
    if (!data) return <CloudFog className="h-8 w-8 text-gray-400" />

    if (data.precipitation > 5) {
      return <CloudRain className="h-8 w-8 text-blue-500" />
    } else if (data.humidity > 80 && data.temperature < 5) {
      return <CloudSnow className="h-8 w-8 text-blue-200" />
    } else if (data.windSpeed > 20) {
      return <Wind className="h-8 w-8 text-blue-400" />
    } else if (data.solar > 600) {
      return <Sun className="h-8 w-8 text-yellow-500" />
    } else if (data.humidity > 80) {
      return <CloudDrizzle className="h-8 w-8 text-blue-300" />
    } else {
      return <Cloud className="h-8 w-8 text-gray-400" />
    }
  }

  // Add this helper function before the getCurrentWeather useMemo
  const formatDateSafely = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        return date.toLocaleString()
      }
      return dateString
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Unknown date"
    }
  }

  // Get current weather conditions summary
  const getCurrentWeather = useMemo(() => {
    if (chartData.length === 0) return null

    const current = chartData[chartData.length - 1]
    return {
      temperature: current.temperature.toFixed(1),
      feelsLike: current.temperature > 25 ? current.heatIndex.toFixed(1) : current.windChill.toFixed(1),
      condition:
        current.precipitation > 5
          ? "Rainy"
          : current.humidity > 80 && current.temperature < 5
            ? "Snow"
            : current.windSpeed > 20
              ? "Windy"
              : current.solar > 600
                ? "Sunny"
                : current.humidity > 80
                  ? "Cloudy"
                  : "Clear",
      humidity: current.humidity.toFixed(0),
      windSpeed: current.windSpeed.toFixed(1),
      windDirection: current.windDirection,
      pressure: current.atmosphericPressure.toFixed(0),
      dewPoint: current.dewPoint.toFixed(1),
      uvIndex: current.uvIndex,
      icon: getWeatherIcon(current),
      timestamp: formatDateSafely(current.timestamp),
    }
  }, [chartData])

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-gray-800/90 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="font-medium text-sm">{label}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`tooltip-${index}`} className="flex items-center gap-2 text-xs">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="font-medium">{entry.name}:</span>
                <span>
                  {typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value} {entry.unit || ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  // Weather metrics for radar chart
  const radarMetrics = useMemo(() => {
    if (chartData.length === 0) return []

    const current = chartData[chartData.length - 1]
    return [
      { subject: "Temperature", A: current.temperature, fullMark: 40 },
      { subject: "Humidity", A: current.humidity, fullMark: 100 },
      { subject: "Wind Speed", A: current.windSpeed, fullMark: 30 },
      { subject: "Solar", A: current.solar / 10, fullMark: 100 },
      { subject: "Pressure", A: (current.atmosphericPressure - 980) / 5, fullMark: 10 },
      { subject: "UV Index", A: current.uvIndex, fullMark: 11 },
    ]
  }, [chartData])

  // Get weather alerts based on data
  const getWeatherAlerts = useMemo(() => {
    if (chartData.length === 0) return []

    const alerts = []
    const current = chartData[chartData.length - 1]

    if (current.temperature > 30) {
      alerts.push({
        type: "High Temperature",
        message: "Heat advisory: Temperature exceeds 30°C",
        severity: "warning",
        icon: <Thermometer className="h-4 w-4" />,
      })
    }

    if (current.windSpeed > 20) {
      alerts.push({
        type: "High Wind",
        message: "Wind advisory: Wind speeds exceed 20 km/h",
        severity: "warning",
        icon: <Wind className="h-4 w-4" />,
      })
    }

    if (current.precipitation > 10) {
      alerts.push({
        type: "Heavy Rain",
        message: "Flood watch: Heavy precipitation detected",
        severity: "warning",
        icon: <CloudRain className="h-4 w-4" />,
      })
    }

    if (current.uvIndex > 7) {
      alerts.push({
        type: "High UV",
        message: "UV warning: Very high UV index detected",
        severity: "warning",
        icon: <Sun className="h-4 w-4" />,
      })
    }

    return alerts
  }, [chartData])

  // Generate correlation data for scatter plot
  const correlationData = chartData.map((item) => ({
    temperature: item.temperature,
    humidity: item.humidity,
    windSpeed: item.windSpeed,
    precipitation: item.precipitation,
    z: 1, // Size of the dot
  }))

  // Function to get weather condition description
  const getWeatherDescription = (data: (typeof chartData)[0]) => {
    if (!data) return "No data available"

    let description = ""

    if (data.temperature > 30) {
      description += "Very hot. "
    } else if (data.temperature > 25) {
      description += "Hot. "
    } else if (data.temperature > 15) {
      description += "Warm. "
    } else if (data.temperature > 5) {
      description += "Cool. "
    } else {
      description += "Cold. "
    }

    if (data.precipitation > 5) {
      description += "Rainy with "
    } else if (data.humidity > 80) {
      description += "Humid with "
    }

    description += `${data.windSpeed.toFixed(1)} km/h winds from the ${data.windDirection}.`

    return description
  }

  // Function to export data as CSV
  const exportCSV = () => {
    if (tableData.length === 0) return

    // Create CSV header
    const headers = Object.keys(tableData[0]).join(",")

    // Create CSV rows
    const rows = tableData
      .map((item) =>
        Object.values(item)
          .map((value) => (typeof value === "string" && value.includes(",") ? `"${value}"` : value))
          .join(","),
      )
      .join("\n")

    // Combine header and rows
    const csv = `${headers}\n${rows}`

    // Create download link
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `weather_data_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading weather data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Data Summary */}
      <Card className="bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="text-sm font-medium">Data Summary</h3>
                <p className="text-xs text-muted-foreground">
                  {dataStats.totalRecords} records from {dataStats.dateRange.start} to {dataStats.dateRange.end}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {dataStats.hasTemperature && (
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30">
                  Temperature
                </Badge>
              )}
              {dataStats.hasWindSpeed && (
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30">
                  Wind
                </Badge>
              )}
              {dataStats.hasHumidity && (
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30">
                  Humidity
                </Badge>
              )}
              {dataStats.hasSolar && (
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30">
                  Solar
                </Badge>
              )}
              {dataStats.hasPrecipitation && (
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30">
                  Precipitation
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Weather Summary */}
      {getCurrentWeather && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="col-span-1 md:col-span-2 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-md">{getCurrentWeather.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold">{getCurrentWeather.temperature}°C</h2>
                    <p className="text-sm text-muted-foreground">Feels like {getCurrentWeather.feelsLike}°C</p>
                    <p className="text-sm font-medium mt-1">{getCurrentWeather.condition}</p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Humidity: {getCurrentWeather.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">
                      Wind: {getCurrentWeather.windSpeed} km/h {getCurrentWeather.windDirection}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Pressure: {getCurrentWeather.pressure} hPa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Dew Point: {getCurrentWeather.dewPoint}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">UV Index: {getCurrentWeather.uvIndex}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                <p>{getWeatherDescription(chartData[chartData.length - 1])}</p>
                <p className="mt-1 text-xs">Last updated: {getCurrentWeather.timestamp}</p>
              </div>

              {getWeatherAlerts.length > 0 && (
                <div className="mt-4 space-y-2">
                  {getWeatherAlerts.map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm"
                    >
                      <div className="text-yellow-600 dark:text-yellow-400">{alert.icon}</div>
                      <div>
                        <p className="font-medium">{alert.type}</p>
                        <p className="text-xs text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Current Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={radarMetrics}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
                    <Radar
                      name="Current"
                      dataKey="A"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      animationDuration={animationSpeed}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Data</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {timeRange === "custom" && <DatePickerWithRange className="w-auto" onChange={handleDateRangeChange} />}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden md:inline">Animation Speed:</span>
                  <Slider
                    className="w-[100px]"
                    defaultValue={[1500]}
                    max={3000}
                    min={500}
                    step={100}
                    onValueChange={(value) => setAnimationSpeed(value[0])}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Adjust chart animation speed</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1 bg-[#FF5722]/10">
            <div className="h-3 w-3 rounded-full bg-[#FF5722]" />
            <span className="text-xs">Temperature</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 bg-[#2196F3]/10">
            <div className="h-3 w-3 rounded-full bg-[#2196F3]" />
            <span className="text-xs">Wind Speed</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 bg-[#9C27B0]/10">
            <div className="h-3 w-3 rounded-full bg-[#9C27B0]" />
            <span className="text-xs">Humidity</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 bg-[#FFC107]/10">
            <div className="h-3 w-3 rounded-full bg-[#FFC107]" />
            <span className="text-xs">Solar</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 bg-[#4CAF50]/10">
            <div className="h-3 w-3 rounded-full bg-[#4CAF50]" />
            <span className="text-xs">Precipitation</span>
          </Badge>
        </div>
      </div>

      <Card className="col-span-2 overflow-hidden">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Weather Trends</CardTitle>
              <CardDescription>Visualize weather data with professional meteorological charts</CardDescription>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-5 w-full sm:w-auto">
                <TabsTrigger value="overview" className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="temperature" className="flex items-center gap-1">
                  <Thermometer className="h-4 w-4" />
                  <span className="hidden sm:inline">Temperature</span>
                </TabsTrigger>
                <TabsTrigger value="precipitation" className="flex items-center gap-1">
                  <CloudRain className="h-4 w-4" />
                  <span className="hidden sm:inline">Precipitation</span>
                </TabsTrigger>
                <TabsTrigger value="wind" className="flex items-center gap-1">
                  <Wind className="h-4 w-4" />
                  <span className="hidden sm:inline">Wind</span>
                </TabsTrigger>
                <TabsTrigger value="atmospheric" className="flex items-center gap-1">
                  <Gauge className="h-4 w-4" />
                  <span className="hidden sm:inline">Atmospheric</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="overview" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    onMouseMove={(e) => {
                      if (e.activeTooltipIndex !== undefined) {
                        setHoveredPoint(e.activeTooltipIndex)
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="formattedDateTime"
                      tick={{ fontSize: 12 }}
                      tickFormatter={getXAxisFormatter()}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="solar"
                      fill="url(#solarGradient)"
                      stroke={COLORS.solar}
                      fillOpacity={0.3}
                      name="Solar Radiation (W/m²)"
                      animationDuration={animationSpeed}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="precipitation"
                      fill={COLORS.precipitation}
                      name="Precipitation (mm)"
                      animationDuration={animationSpeed}
                      radius={[4, 4, 0, 0]}
                      barSize={6}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperature"
                      stroke={COLORS.temperature}
                      strokeWidth={3}
                      dot={(props) => {
                        const { cx, cy, index } = props
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={index === hoveredPoint ? 6 : 4}
                            fill={getTemperatureColor(chartData[index]?.temperature || 0)}
                            stroke={COLORS.temperature}
                            strokeWidth={index === hoveredPoint ? 2 : 1}
                            className="transition-all duration-300"
                          />
                        )
                      }}
                      activeDot={{ r: 8, strokeWidth: 2 }}
                      name="Temperature (°C)"
                      animationDuration={animationSpeed}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="humidity"
                      stroke={COLORS.humidity}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="Humidity (%)"
                      animationDuration={animationSpeed}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="windSpeed"
                      stroke={COLORS.windSpeed}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="Wind Speed (km/h)"
                      animationDuration={animationSpeed}
                    />
                    <Brush
                      dataKey="formattedDateTime"
                      height={30}
                      stroke="#8884d8"
                      startIndex={0}
                      endIndex={Math.min(chartData.length - 1, 50)}
                    />
                    <defs>
                      <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.solar} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={COLORS.solar} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="temperature" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="formattedDateTime"
                      tick={{ fontSize: 12 }}
                      tickFormatter={getXAxisFormatter()}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.temperature} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={COLORS.temperature} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="dewGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.dewPoint} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={COLORS.dewPoint} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="temperature"
                      stroke={COLORS.temperature}
                      fill="url(#tempGradient)"
                      fillOpacity={0.3}
                      name="Temperature (°C)"
                      animationDuration={animationSpeed}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="dewPoint"
                      stroke={COLORS.dewPoint}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="Dew Point (°C)"
                      animationDuration={animationSpeed}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="heatIndex"
                      stroke={COLORS.heatIndex}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="Heat Index (°C)"
                      animationDuration={animationSpeed}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="windChill"
                      stroke={COLORS.windChill}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="Wind Chill (°C)"
                      animationDuration={animationSpeed}
                    />
                    <ReferenceLine
                      y={0}
                      yAxisId="left"
                      stroke="#666"
                      strokeDasharray="3 3"
                      label={{ value: "Freezing", position: "insideBottomRight", fill: "#666", fontSize: 12 }}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="uvIndex"
                      fill={COLORS.uvIndex}
                      name="UV Index"
                      animationDuration={animationSpeed}
                      radius={[4, 4, 0, 0]}
                      barSize={6}
                    />
                    <Brush
                      dataKey="formattedDateTime"
                      height={30}
                      stroke="#8884d8"
                      startIndex={0}
                      endIndex={Math.min(chartData.length - 1, 50)}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="precipitation" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="formattedDateTime"
                      tick={{ fontSize: 12 }}
                      tickFormatter={getXAxisFormatter()}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <defs>
                      <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.precipitation} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={COLORS.precipitation} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.humidity} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={COLORS.humidity} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Bar
                      yAxisId="left"
                      dataKey="precipitation"
                      fill={COLORS.precipitation}
                      name="Precipitation (mm)"
                      animationDuration={animationSpeed}
                      radius={[4, 4, 0, 0]}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="humidity"
                      stroke={COLORS.humidity}
                      fill="url(#humidityGradient)"
                      fillOpacity={0.3}
                      name="Humidity (%)"
                      animationDuration={animationSpeed}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="dewPoint"
                      stroke={COLORS.dewPoint}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="Dew Point (°C)"
                      animationDuration={animationSpeed}
                    />
                    <Brush
                      dataKey="formattedDateTime"
                      height={30}
                      stroke="#8884d8"
                      startIndex={0}
                      endIndex={Math.min(chartData.length - 1, 50)}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="wind" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis
                        dataKey="formattedDateTime"
                        tick={{ fontSize: 12 }}
                        tickFormatter={getXAxisFormatter()}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="windSpeed"
                        fill={COLORS.windSpeed}
                        name="Wind Speed (km/h)"
                        animationDuration={animationSpeed}
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        type="monotone"
                        dataKey="gustWindSpeed"
                        stroke={COLORS.gustWindSpeed}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                        name="Gust Speed (km/h)"
                        animationDuration={animationSpeed}
                      />
                      <Brush
                        dataKey="formattedDateTime"
                        height={30}
                        stroke="#8884d8"
                        startIndex={0}
                        endIndex={Math.min(chartData.length - 1, 50)}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-2 font-medium text-sm">Wind Speed and Gusts</div>
                </div>

                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={windDirectionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        animationDuration={animationSpeed}
                      >
                        {windDirectionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={WIND_COLORS[index % WIND_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-2 font-medium text-sm">Wind Direction Distribution</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="atmospheric" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="formattedDateTime"
                      tick={{ fontSize: 12 }}
                      tickFormatter={getXAxisFormatter()}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 12 }}
                      domain={[
                        (dataMin: number) => Math.floor(dataMin - 5),
                        (dataMax: number) => Math.ceil(dataMax + 5),
                      ]}
                    />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="atmosphericPressure"
                      stroke={COLORS.atmosphericPressure}
                      strokeWidth={3}
                      dot={{ r: 3, fill: COLORS.atmosphericPressure }}
                      activeDot={{ r: 6 }}
                      name="Atmospheric Pressure (hPa)"
                      animationDuration={animationSpeed}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="vaporPressure"
                      stroke={COLORS.vaporPressure}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="Vapor Pressure (hPa)"
                      animationDuration={animationSpeed}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="solar"
                      fill="url(#solarGradient)"
                      stroke={COLORS.solar}
                      fillOpacity={0.3}
                      name="Solar Radiation (W/m²)"
                      animationDuration={animationSpeed}
                    />
                    <Brush
                      dataKey="formattedDateTime"
                      height={30}
                      stroke="#8884d8"
                      startIndex={0}
                      endIndex={Math.min(chartData.length - 1, 50)}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Droplets className="h-5 w-5 text-[#4CAF50]" />
              Temperature-Humidity Relationship
            </CardTitle>
            <CardDescription>Correlation between temperature and humidity levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    type="number"
                    dataKey="temperature"
                    name="Temperature"
                    unit="°C"
                    label={{ value: "Temperature (°C)", position: "insideBottomRight", offset: -5 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="humidity"
                    name="Humidity"
                    unit="%"
                    label={{ value: "Humidity (%)", angle: -90, position: "insideLeft" }}
                  />
                  <ZAxis type="number" dataKey="z" range={[60, 400]} />
                  <RechartsTooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
                  <Legend />
                  <Scatter
                    name="Temperature vs. Humidity"
                    data={correlationData}
                    fill={COLORS.temperature}
                    animationDuration={animationSpeed}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sun className="h-5 w-5 text-[#FFC107]" />
              Solar Radiation Impact
            </CardTitle>
            <CardDescription>Effect of solar radiation on temperature</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="formattedDateTime"
                    tick={{ fontSize: 12 }}
                    tickFormatter={getXAxisFormatter()}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                  <defs>
                    <linearGradient id="solarGradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.solar} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={COLORS.solar} stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="solar"
                    stroke={COLORS.solar}
                    fill="url(#solarGradient2)"
                    fillOpacity={0.3}
                    name="Solar Radiation (W/m²)"
                    animationDuration={animationSpeed}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temperature"
                    stroke={COLORS.temperature}
                    strokeWidth={2}
                    dot={{ r: 3, fill: COLORS.temperature }}
                    activeDot={{ r: 6 }}
                    name="Temperature (°C)"
                    animationDuration={animationSpeed}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="uvIndex"
                    stroke={COLORS.uvIndex}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="UV Index"
                    animationDuration={animationSpeed}
                  />
                  <Brush
                    dataKey="formattedDateTime"
                    height={30}
                    stroke="#8884d8"
                    startIndex={0}
                    endIndex={Math.min(chartData.length - 1, 50)}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table View */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Weather Data Table</CardTitle>
            <CardDescription>Raw weather data records</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Solar</TableHead>
                  <TableHead>Precipitation</TableHead>
                  <TableHead>Strikes</TableHead>
                  <TableHead>Strike Dist.</TableHead>
                  <TableHead>Wind Speed</TableHead>
                  <TableHead>Wind Dir</TableHead>
                  <TableHead>Gust</TableHead>
                  <TableHead>Temp (°C)</TableHead>
                  <TableHead>Vapor Press.</TableHead>
                  <TableHead>Pressure</TableHead>
                  <TableHead>Humidity</TableHead>
                  <TableHead>Sensor Temp</TableHead>
                  <TableHead>X Orient</TableHead>
                  <TableHead>Y Orient</TableHead>
                  <TableHead>Heading</TableHead>
                  <TableHead>Sys Code</TableHead>
                  <TableHead>Sys Msg</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.time}</TableCell>
                      <TableCell>{item.solar}</TableCell>
                      <TableCell>{item.precipitation}</TableCell>
                      <TableCell>{item.strikes}</TableCell>
                      <TableCell>{item.strikeDistance}</TableCell>
                      <TableCell>{item.windSpeed}</TableCell>
                      <TableCell>{item.windDirection}</TableCell>
                      <TableCell>{item.gustWindSpeed}</TableCell>
                      <TableCell>{item.airTemperature}</TableCell>
                      <TableCell>{item.vaporPressure}</TableCell>
                      <TableCell>{item.atmosphericPressure}</TableCell>
                      <TableCell>{item.humidity}</TableCell>
                      <TableCell>{item.sensorTemp}</TableCell>
                      <TableCell>{item.xOrientation}</TableCell>
                      <TableCell>{item.yOrientation}</TableCell>
                      <TableCell>{item.compassHeading}</TableCell>
                      <TableCell>{item.sysCode}</TableCell>
                      <TableCell>{item.sysMessage}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={20} className="text-center py-4">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length}{" "}
            entries
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
