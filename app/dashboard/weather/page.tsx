"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import WeatherPanel from "@/components/weather-panel"
import { Activity } from "lucide-react"

export default function WeatherPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [weatherData, setWeatherData] = useState([])
  const [waterData, setWaterData] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/fetch-csv")
        const result = await response.json()

        if (response.ok) {
          setWeatherData(result.data || [])
        } else {
          console.error("Failed to fetch weather data:", result.error)
        }

        // You can also fetch waterData here if needed
        setWaterData([]) // placeholder
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <Activity className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Loading weather data...</p>
        </div>
      </div>
    )
  }

  console.log("Weather Data:", weatherData);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Weather Monitoring</h1>
        <p className="text-muted-foreground">Comprehensive weather data analysis and visualization</p>
      </div>

      <WeatherPanel data={weatherData} />
    </motion.div>
  )
}
