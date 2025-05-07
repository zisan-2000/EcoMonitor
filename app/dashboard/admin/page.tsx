"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, CloudRain, Droplet, BarChart3, AlertTriangle, Download, RefreshCw } from "lucide-react"
import SummaryCards from "@/components/summary-cards"
import WeatherPanel from "@/components/weather-panel"
import WaterQualityPanel from "@/components/water-quality-panel"
import { fetchWeatherData, fetchWaterQualityData } from "@/lib/data"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [weatherData, setWeatherData] = useState([])
  const [waterData, setWaterData] = useState([])
  const [activeTab, setActiveTab] = useState("overview")

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
        console.error("Error loading dashboard data:", error)
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
          <p>Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
            Admin
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Data Summary Cards */}
      <SummaryCards waterData={waterData} weatherData={weatherData} />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weather">Weather Data</TabsTrigger>
          <TabsTrigger value="water">Water Quality</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="h-5 w-5" />
                  Weather Data Overview
                </CardTitle>
                <CardDescription>Summary of weather monitoring data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Data Points</h4>
                    <div className="text-2xl font-bold">{weatherData.length.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      From {weatherData.length > 0 ? new Date(weatherData[0].date_time).toLocaleDateString() : "N/A"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Latest Readings</h4>
                    {weatherData.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Temperature</p>
                          <p className="font-medium">{weatherData[weatherData.length - 1].temp}°C</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Wind Speed</p>
                          <p className="font-medium">{weatherData[weatherData.length - 1].spd} km/h</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No data available</p>
                    )}
                  </div>

                  <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("weather")}>
                    View Full Weather Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5" />
                  Water Quality Overview
                </CardTitle>
                <CardDescription>Summary of water quality monitoring data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Data Points</h4>
                    <div className="text-2xl font-bold">{waterData.length.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      From {waterData.length > 0 ? new Date(waterData[0].date_time).toLocaleDateString() : "N/A"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Latest Readings</h4>
                    {waterData.length > 0 ? (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">pH</p>
                          <p className="font-medium">{waterData[waterData.length - 1].ph}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">DO</p>
                          <p className="font-medium">{waterData[waterData.length - 1].do} mg/L</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">ORP</p>
                          <p className="font-medium">{waterData[waterData.length - 1].orp} mV</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No data available</p>
                    )}
                  </div>

                  <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("water")}>
                    View Full Water Quality Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recent Alerts
              </CardTitle>
              <CardDescription>Recent system alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-700 dark:text-amber-400">High pH Level Detected</h4>
                    <p className="text-sm text-amber-600 dark:text-amber-500">
                      Sensor SN-1002 reported pH level of 8.7 at 10:45 AM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-700 dark:text-blue-400">Low Temperature Warning</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-500">
                      Temperature dropped below 15°C at Station 3 at 08:30 AM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <Activity className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-700 dark:text-green-400">System Maintenance Complete</h4>
                    <p className="text-sm text-green-600 dark:text-green-500">
                      Scheduled maintenance completed successfully at 02:15 AM
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weather" className="mt-6">
          <WeatherPanel data={weatherData} waterData={waterData} />
        </TabsContent>

        <TabsContent value="water" className="mt-6">
          <WaterQualityPanel data={waterData} />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
