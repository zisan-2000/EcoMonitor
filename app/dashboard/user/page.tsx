"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, CloudRain, Droplet, AlertTriangle, Download, RefreshCw, Info } from "lucide-react"
import { fetchWeatherData, fetchWaterQualityData } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function UserDashboard() {
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

  // Get the latest data points
  const latestWeather = weatherData.length > 0 ? weatherData[weatherData.length - 1] : null
  const latestWater = waterData.length > 0 ? waterData[waterData.length - 1] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
            User
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Limited Access</AlertTitle>
        <AlertDescription>
          You have limited access to the dashboard. Please contact an administrator for full access.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudRain className="h-5 w-5" />
              Current Weather
            </CardTitle>
            <CardDescription>Latest weather monitoring data</CardDescription>
          </CardHeader>
          <CardContent>
            {latestWeather ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Temperature</p>
                    <p className="text-2xl font-bold">{latestWeather.temp}°C</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Wind Speed</p>
                    <p className="text-2xl font-bold">{latestWeather.spd} km/h</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{new Date(latestWeather.date_time).toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No weather data available</p>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Data from weather station at {latestWeather?.lat}, {latestWeather?.lon}
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5" />
              Water Quality
            </CardTitle>
            <CardDescription>Latest water quality measurements</CardDescription>
          </CardHeader>
          <CardContent>
            {latestWater ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">pH Level</p>
                    <p className="text-2xl font-bold">{latestWater.ph}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dissolved Oxygen</p>
                    <p className="text-2xl font-bold">{latestWater.do} mg/L</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ORP</p>
                    <p className="text-2xl font-bold">{latestWater.orp} mV</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{new Date(latestWater.date_time).toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No water quality data available</p>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Data from water quality sensor at {latestWater?.lat}, {latestWater?.lon}
            </p>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Measurements</CardTitle>
          <CardDescription>Latest 10 data points from our monitoring stations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Temperature (°C)</TableHead>
                  <TableHead>pH</TableHead>
                  <TableHead>DO (mg/L)</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waterData
                  .slice(-10)
                  .reverse()
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(item.date_time).toLocaleString()}</TableCell>
                      <TableCell>{item.temp}</TableCell>
                      <TableCell>{item.ph}</TableCell>
                      <TableCell>{item.do}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {item.lat}, {item.lon}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">Showing the 10 most recent measurements</p>
          <Button variant="outline" size="sm" disabled>
            <Download className="h-4 w-4 mr-2" />
            Export (Requires Admin Access)
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Current Alerts
          </CardTitle>
          <CardDescription>Active alerts from monitoring stations</CardDescription>
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
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Contact an administrator for detailed alert information</p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
