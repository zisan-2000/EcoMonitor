"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  LineChart,
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
  RadialBarChart,
  RadialBar,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Compass, Thermometer, Download, RefreshCw } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function WeatherPanel({ data, waterData }) {
  const [timeRange, setTimeRange] = useState("24h")
  const [chartData, setChartData] = useState([])
  const [windDirectionData, setWindDirectionData] = useState([])
  const [temperatureGaugeData, setTemperatureGaugeData] = useState([])
  const [tableData, setTableData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    if (data.length > 0) {
      // Process data for charts
      const processedData = data.slice(-24).map((item, index) => {
        return {
          time: item.times || `${index}:00`,
          temperature: Number.parseFloat(item.temp || 0),
          windSpeed: Number.parseFloat(item.spd || 0),
          humidity: Math.random() * 100, // Simulated data
          solar: Math.random() * 1000, // Simulated data
        }
      })

      setChartData(processedData)

      // Generate wind direction data
      const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
      const windDirData = directions.map((dir) => ({
        name: dir,
        value: Math.floor(Math.random() * 100) + 10,
      }))

      setWindDirectionData(windDirData)

      // Generate temperature gauge data
      const tempData = [
        {
          name: "Current",
          value: Number.parseFloat(data[data.length - 1]?.temp || 25),
          fill: "#FF5722",
        },
        {
          name: "Min",
          value: 15,
          fill: "#2196F3",
        },
        {
          name: "Max",
          value: 40,
          fill: "#E91E63",
        },
      ]

      setTemperatureGaugeData(tempData)

      // Prepare table data
      setTableData(
        data.slice(-50).map((item) => ({
          id: item.id || "N/A",
          date: item.dates || "N/A",
          time: item.times || "N/A",
          temperature: Number.parseFloat(item.temp || 0).toFixed(2),
          windSpeed: Number.parseFloat(item.spd || 0).toFixed(2),
          location: `${Number.parseFloat(item.lat || 0).toFixed(4)}, ${Number.parseFloat(item.lon || 0).toFixed(4)}`,
        })),
      )
    }
  }, [data])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#FF5722", "#4CAF50", "#9C27B0"]

  // Filter and paginate table data
  const filteredData = tableData.filter((item) =>
    Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
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

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-sm">Temperature</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-sm">Wind Speed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-full bg-purple-500" />
            <span className="text-sm">Humidity</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-sm">Solar</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Weather Trends</CardTitle>
            <CardDescription>Temperature, wind speed, humidity, and solar radiation over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} tickFormatter={(value) => value.split(":")[0]} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      border: "none",
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Temperature (°C)"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="windSpeed"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Wind Speed (km/h)"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="humidity"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Humidity (%)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="solar"
                    stroke="#eab308"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Solar (W/m²)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Compass className="h-5 w-5" />
              Wind Direction Distribution
            </CardTitle>
            <CardDescription>Frequency of wind direction over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {windDirectionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Temperature Range
            </CardTitle>
            <CardDescription>Current temperature relative to daily min/max</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="80%"
                  barSize={20}
                  data={temperatureGaugeData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    minAngle={15}
                    background
                    clockWise={true}
                    dataKey="value"
                    cornerRadius={10}
                    label={{ position: "insideStart", fill: "#fff", fontWeight: "bold" }}
                  />
                  <RechartsTooltip />
                </RadialBarChart>
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
            <Button variant="outline" size="sm">
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
                  <TableHead>Temperature (°C)</TableHead>
                  <TableHead>Wind Speed (km/h)</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.time}</TableCell>
                      <TableCell>{item.temperature}</TableCell>
                      <TableCell>{item.windSpeed}</TableCell>
                      <TableCell className="font-mono text-xs">{item.location}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
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
    </motion.div>
  )
}
