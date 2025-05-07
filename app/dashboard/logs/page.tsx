"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { fetchWeatherData, fetchWaterQualityData } from "@/lib/data"
import SystemLogsPanel from "@/components/system-logs-panel"
import { Activity } from "lucide-react"

export default function SystemLogsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch data for logs
        const weather = await fetchWeatherData()
        const water = await fetchWaterQualityData()

        // Combine data for system logs
        setData([...weather, ...water])
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading system logs data:", error)
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
          <p>Loading system logs data...</p>
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
        <h1 className="text-3xl font-bold">System Logs</h1>
        <p className="text-muted-foreground">Monitor system events, warnings, and errors</p>
      </div>

      <SystemLogsPanel data={data} />
    </motion.div>
  )
}
