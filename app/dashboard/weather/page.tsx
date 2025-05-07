"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { fetchWeatherData, fetchWaterQualityData } from "@/lib/data"
import WeatherPanel from "@/components/weather-panel"
import { Activity } from "lucide-react"

export default function WeatherPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [weatherData, setWeatherData] = useState([])
  const [waterData, setWaterData] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch data
        const weather = await fetchWeatherData()
        const water = await fetchWaterQualityData()

        setWeatherData(weather)
        setWaterData(water)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading weather data:", error)
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

      <WeatherPanel data={weatherData} waterData={waterData} />
    </motion.div>
  )
}
