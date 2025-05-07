"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Activity, Download, FileText, BarChart3, PieChart, LineChart } from "lucide-react"
import { fetchWeatherData, fetchWaterQualityData } from "@/lib/data"

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [weatherData, setWeatherData] = useState([])
  const [waterData, setWaterData] = useState([])
  const [reportType, setReportType] = useState("weather")
  const [timeRange, setTimeRange] = useState("7d")

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
        console.error("Error loading reports data:", error)
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
          <p>Loading reports data...</p>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and export data reports</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weather">Weather Report</SelectItem>
              <SelectItem value="water">Water Quality Report</SelectItem>
              <SelectItem value="system">System Status Report</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {timeRange === "custom" && <DatePickerWithRange className="w-auto" />}
        </div>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="export">Export Options</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {reportType === "weather" ? (
                  <LineChart className="h-5 w-5" />
                ) : reportType === "water" ? (
                  <BarChart3 className="h-5 w-5" />
                ) : (
                  <PieChart className="h-5 w-5" />
                )}
                {reportType === "weather"
                  ? "Weather Report"
                  : reportType === "water"
                    ? "Water Quality Report"
                    : "System Status Report"}
              </CardTitle>
              <CardDescription>
                {timeRange === "24h"
                  ? "Last 24 Hours"
                  : timeRange === "7d"
                    ? "Last 7 Days"
                    : timeRange === "30d"
                      ? "Last 30 Days"
                      : "Custom Date Range"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/20">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Report Preview</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    This is where the report preview would be displayed. In a real application, this would show charts,
                    tables, and other visualizations based on the selected report type and time range.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                {reportType === "weather"
                  ? `${weatherData.length} data points`
                  : reportType === "water"
                    ? `${waterData.length} data points`
                    : "System status data"}
              </div>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Configure and download reports in various formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center text-center">
                    <FileText className="h-8 w-8 mb-2" />
                    <h3 className="font-medium">PDF Report</h3>
                    <p className="text-xs text-muted-foreground">Complete formatted report with charts and analysis</p>
                  </div>
                </Card>
                <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center text-center">
                    <FileText className="h-8 w-8 mb-2" />
                    <h3 className="font-medium">CSV Export</h3>
                    <p className="text-xs text-muted-foreground">Raw data export for further analysis</p>
                  </div>
                </Card>
                <Card className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center text-center">
                    <FileText className="h-8 w-8 mb-2" />
                    <h3 className="font-medium">Excel Report</h3>
                    <p className="text-xs text-muted-foreground">Formatted spreadsheet with data and charts</p>
                  </div>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Export Settings</h3>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Include Charts</label>
                      <Select defaultValue="yes">
                        <SelectTrigger>
                          <SelectValue placeholder="Include charts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Include Raw Data</label>
                      <Select defaultValue="yes">
                        <SelectTrigger>
                          <SelectValue placeholder="Include raw data" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Generate and Download Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Set up automated report generation and delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Report Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Frequency
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Recipients
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Last Sent
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 text-sm">Weekly Weather Summary</td>
                      <td className="px-4 py-3 text-sm">Weekly (Monday)</td>
                      <td className="px-4 py-3 text-sm">3 recipients</td>
                      <td className="px-4 py-3 text-sm">May 1, 2023</td>
                      <td className="px-4 py-3 text-sm">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm">Monthly Water Quality Report</td>
                      <td className="px-4 py-3 text-sm">Monthly (1st)</td>
                      <td className="px-4 py-3 text-sm">5 recipients</td>
                      <td className="px-4 py-3 text-sm">Apr 1, 2023</td>
                      <td className="px-4 py-3 text-sm">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm">Daily System Status</td>
                      <td className="px-4 py-3 text-sm">Daily (8:00 AM)</td>
                      <td className="px-4 py-3 text-sm">2 recipients</td>
                      <td className="px-4 py-3 text-sm">Today</td>
                      <td className="px-4 py-3 text-sm">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Create New Scheduled Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
