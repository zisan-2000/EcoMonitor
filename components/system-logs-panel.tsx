"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle, Info, XCircle, Download, RefreshCw, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

export default function SystemLogsPanel({ data }) {
  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sensorStatus, setSensorStatus] = useState({
    online: 4,
    warning: 1,
    offline: 0,
    total: 5,
  })
  const [sensorData, setSensorData] = useState([])

  useEffect(() => {
    if (data.length > 0) {
      // Generate simulated system logs
      generateLogs()

      // Generate sensor data
      generateSensorData()
    }
  }, [data])

  const generateLogs = () => {
    const logTypes = ["info", "warning", "error", "success"]
    const messages = [
      "System startup complete",
      "Sensor reading successful",
      "Data transmission complete",
      "Battery level low",
      "Connection timeout",
      "Sensor calibration required",
      "Temperature threshold exceeded",
      "pH level outside normal range",
      "System update available",
      "Memory usage high",
    ]

    const newLogs = []

    // Generate 20 random logs
    for (let i = 0; i < 20; i++) {
      const type = logTypes[Math.floor(Math.random() * logTypes.length)]
      const message = messages[Math.floor(Math.random() * messages.length)]
      const date = new Date()
      date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 60 * 24)) // Random time in last 24 hours

      newLogs.push({
        id: i + 1,
        timestamp: date,
        type,
        message,
        sensorId: `SN-${Math.floor(1000 + Math.random() * 9000)}`,
        code: type === "error" ? "ERR" : type === "warning" ? "WRN" : "INF",
      })
    }

    // Sort by timestamp (newest first)
    newLogs.sort((a, b) => b.timestamp - a.timestamp)

    setLogs(newLogs)
  }

  const generateSensorData = () => {
    const sensors = [
      {
        id: "SN-1001",
        name: "Temperature Sensor 1",
        type: "Temperature",
        status: "online",
        lastReading: "27.5°C",
        battery: 85,
      },
      { id: "SN-1002", name: "pH Sensor 1", type: "pH", status: "online", lastReading: "7.2", battery: 92 },
      {
        id: "SN-1003",
        name: "DO Sensor 1",
        type: "Dissolved Oxygen",
        status: "online",
        lastReading: "6.1 mg/L",
        battery: 78,
      },
      {
        id: "SN-1004",
        name: "Wind Sensor 1",
        type: "Wind Speed",
        status: "warning",
        lastReading: "15.3 km/h",
        battery: 42,
      },
      { id: "SN-1005", name: "ORP Sensor 1", type: "ORP", status: "online", lastReading: "196.8 mV", battery: 65 },
    ]

    setSensorData(sensors)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      generateLogs()
      setIsRefreshing(false)
    }, 1000)
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getTypeBadge = (type) => {
    switch (type) {
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "warning":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Warning
          </Badge>
        )
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Info
          </Badge>
        )
      case "success":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Success
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "online":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Online
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Warning
          </Badge>
        )
      case "offline":
        return <Badge variant="destructive">Offline</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Filter and paginate logs
  const filteredLogs = filter === "all" ? logs : logs.filter((log) => log.type === filter)

  const searchFilteredLogs = filteredLogs.filter(
    (log) =>
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.sensorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = searchFilteredLogs.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(searchFilteredLogs.length / itemsPerPage)

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
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sensors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sensorStatus.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Monitoring all connected devices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{sensorStatus.online}</div>
            <Progress
              value={(sensorStatus.online / sensorStatus.total) * 100}
              className="h-2 mt-2"
              indicatorClassName="bg-green-500"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{sensorStatus.warning}</div>
            <Progress
              value={(sensorStatus.warning / sensorStatus.total) * 100}
              className="h-2 mt-2"
              indicatorClassName="bg-amber-500"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{sensorStatus.offline}</div>
            <Progress
              value={(sensorStatus.offline / sensorStatus.total) * 100}
              className="h-2 mt-2"
              indicatorClassName="bg-red-500"
            />
          </CardContent>
        </Card>
      </div>

      {/* Sensor Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sensor Status</CardTitle>
          <CardDescription>Current status of all monitoring sensors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sensor ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Reading</TableHead>
                  <TableHead>Battery</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sensorData.map((sensor) => (
                  <TableRow key={sensor.id}>
                    <TableCell className="font-mono">{sensor.id}</TableCell>
                    <TableCell>{sensor.name}</TableCell>
                    <TableCell>{sensor.type}</TableCell>
                    <TableCell>{getStatusBadge(sensor.status)}</TableCell>
                    <TableCell>{sensor.lastReading}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={sensor.battery}
                          className="h-2 w-24"
                          indicatorClassName={
                            sensor.battery > 70 ? "bg-green-500" : sensor.battery > 30 ? "bg-amber-500" : "bg-red-500"
                          }
                        />
                        <span className="text-xs">{sensor.battery}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>System Logs & Alerts</CardTitle>
              <CardDescription>Monitor system events, warnings, and errors</CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter logs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Logs</SelectItem>
                  <SelectItem value="error">Errors</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[200px]"
                />
              </div>

              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Time</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[100px]">Code</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[150px]">Sensor ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((log) => (
                  <TableRow key={log.id} className={log.type === "error" ? "bg-red-500/5" : ""}>
                    <TableCell className="font-mono text-xs">{log.timestamp.toLocaleTimeString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(log.type)}
                        <span className="sr-only">{log.type}</span>
                        {getTypeBadge(log.type)}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{log.code}</TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell className="font-mono text-xs">{log.sensorId}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No logs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {searchFilteredLogs.length > 0 ? indexOfFirstItem + 1 : 0}-
            {Math.min(indexOfLastItem, searchFilteredLogs.length)} of {searchFilteredLogs.length} logs
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
