"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Thermometer, Wind, FlaskRoundIcon as Flask, Waves, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SummaryCards({ waterData, weatherData }) {
  const [summaryData, setSummaryData] = useState({
    temperature: { value: 0, trend: "up" },
    windSpeed: { value: 0, trend: "up" },
    precipitation: { value: 0, trend: "down" },
    solarRadiation: { value: 0, trend: "up" },
    waterPh: { value: 0, trend: "neutral" },
    dissolvedOxygen: { value: 0, trend: "down" },
    windDirection: { value: "N", degrees: 0 },
  })

  useEffect(() => {
    if (waterData.length > 0) {
      // Get the latest data point
      const latestWaterData = waterData[waterData.length - 1]

      // Get previous data point for trend calculation
      const previousWaterData = waterData[waterData.length - 2] || latestWaterData

      // Calculate trends
      const tempTrend = latestWaterData.temp > previousWaterData.temp ? "up" : "down"
      const phTrend = latestWaterData.ph > previousWaterData.ph ? "up" : "down"
      const doTrend = latestWaterData.do > previousWaterData.do ? "up" : "down"
      const spdTrend = latestWaterData.spd > previousWaterData.spd ? "up" : "down"

      // Set summary data with actual values from the dataset
      setSummaryData({
        temperature: {
          value: Number.parseFloat(latestWaterData.temp || 0).toFixed(1),
          trend: tempTrend,
        },
        windSpeed: {
          value: Number.parseFloat(latestWaterData.spd || 0).toFixed(1),
          trend: spdTrend,
        },
        precipitation: {
          value: (Math.random() * 10).toFixed(1), // Simulated data
          trend: "down",
        },
        solarRadiation: {
          value: (Math.random() * 1000).toFixed(0), // Simulated data
          trend: "up",
        },
        waterPh: {
          value: Number.parseFloat(latestWaterData.ph || 7).toFixed(1),
          trend: phTrend,
        },
        dissolvedOxygen: {
          value: Number.parseFloat(latestWaterData.do || 0).toFixed(1),
          trend: doTrend,
        },
        windDirection: {
          value: getWindDirection(Math.random() * 360), // Simulated data
          degrees: Math.floor(Math.random() * 360), // Simulated data
        },
      })
    }
  }, [waterData, weatherData])

  // Helper function to convert degrees to cardinal direction
  function getWindDirection(degrees) {
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

  // Animation variants for the cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <TooltipProvider>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Temperature Card */}
        <motion.div variants={item}>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-orange-500/10 to-red-500/10">
              <CardTitle className="text-sm font-medium">Air Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{summaryData.temperature.value}°C</div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      {summaryData.temperature.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Today's high/low</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-xs text-muted-foreground mt-1">+2.5% from last reading</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wind Speed Card */}
        <motion.div variants={item}>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
              <Wind className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{summaryData.windSpeed.value} km/h</div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      {summaryData.windSpeed.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Average & max speed</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Gusts up to {(Number.parseFloat(summaryData.windSpeed.value) * 1.5).toFixed(1)} km/h
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Water pH Card */}
        <motion.div variants={item}>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
              <CardTitle className="text-sm font-medium">Water pH</CardTitle>
              <Flask className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{summaryData.waterPh.value}</div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      {summaryData.waterPh.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-amber-500" />
                      ) : summaryData.waterPh.trend === "down" ? (
                        <TrendingDown className="h-4 w-4 text-amber-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full bg-green-500" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ideal range: 6.5 - 8.5</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {summaryData.waterPh.value > 8.5 ? "Alkaline" : summaryData.waterPh.value < 6.5 ? "Acidic" : "Optimal"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dissolved Oxygen Card */}
        <motion.div variants={item}>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-sky-500/10 to-blue-500/10">
              <CardTitle className="text-sm font-medium">Dissolved Oxygen</CardTitle>
              <Waves className="h-4 w-4 text-sky-500" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{summaryData.dissolvedOxygen.value} mg/L</div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      {summaryData.dissolvedOxygen.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Water oxygen level</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {summaryData.dissolvedOxygen.value > 5 ? "Good" : "Low"} oxygen level
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  )
}
