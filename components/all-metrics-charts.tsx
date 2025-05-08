"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Expand, TableIcon, BarChartIcon } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function AllMetricsCharts() {
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [timeColumn, setTimeColumn] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [fullScreenChart, setFullScreenChart] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/fetch-csv")
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`)
        }

        const result = await response.json()
        if (!result.data || !Array.isArray(result.data) || result.data.length === 0) {
          throw new Error("No data received from the server")
        }

        setData(result.data)
        setColumns(result.columns)
        setTimeColumn(result.timeColumn || result.columns[0])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get numeric columns
  const numericColumns = columns.filter((column) => {
    // Skip the time column
    if (column === timeColumn) return false

    // Check if the column contains numeric values
    return data.some((row) => typeof row[column] === "number" && !isNaN(row[column]))
  })

  // Get a friendly display name for a column
  const getDisplayName = (column: string) => {
    // Replace underscores with spaces and capitalize each word
    return column
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  // Get color for a column
  const getColorForColumn = (column: string) => {
    const lowerColumn = column.toLowerCase()
    if (lowerColumn.includes("temp")) return "#ef4444" // red
    if (lowerColumn.includes("humid")) return "#3b82f6" // blue
    if (lowerColumn.includes("wind")) return "#64748b" // slate
    if (lowerColumn.includes("solar")) return "#eab308" // yellow
    if (lowerColumn.includes("air") || lowerColumn.includes("quality")) return "#10b981" // green
    if (lowerColumn.includes("precipitation")) return "#60a5fa" // blue-400
    if (lowerColumn.includes("pressure")) return "#8b5cf6" // purple

    // Generate a color based on the column name for consistency
    const hash = column.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)

    return `hsl(${Math.abs(hash) % 360}, 70%, 50%)`
  }

  // Format the X-axis tick values
  const formatXAxis = (value: any) => {
    if (value === undefined || value === null) return ""

    // If it's a date string, format it
    if (typeof value === "string" && value.includes("-") && value.includes(":")) {
      try {
        const date = new Date(value)
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      } catch (e) {
        // If parsing fails, just return the original value
        return String(value).substring(0, 10)
      }
    }

    // For other types, convert to string and truncate
    return String(value).substring(0, 10)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-80">Loading data...</div>
  }

  if (data.length === 0) {
    return <div className="text-center py-8">No data available. Please check your data source.</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {numericColumns.map((column) => (
          <Card key={column}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{getDisplayName(column)}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setFullScreenChart(column)} title="View Full Screen">
                <Expand className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="chart">
                <TabsList className="mb-4">
                  <TabsTrigger value="chart">
                    <BarChartIcon className="h-4 w-4 mr-2" />
                    Chart
                  </TabsTrigger>
                  <TabsTrigger value="table">
                    <TableIcon className="h-4 w-4 mr-2" />
                    Table
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chart">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={data}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey={timeColumn} tickFormatter={formatXAxis} minTickGap={30} />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [value, getDisplayName(column)]}
                          labelFormatter={(label) => `Time: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey={column}
                          stroke={getColorForColumn(column)}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                          connectNulls={true}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="table">
                  <div className="max-h-64 overflow-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{getDisplayName(timeColumn)}</TableHead>
                          <TableHead>{getDisplayName(column)}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row[timeColumn]}</TableCell>
                            <TableCell>
                              {row[column] !== null
                                ? typeof row[column] === "number"
                                  ? row[column].toFixed(2)
                                  : row[column]
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Screen Chart Dialog */}
      <Dialog open={fullScreenChart !== null} onOpenChange={(open) => !open && setFullScreenChart(null)}>
        <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{fullScreenChart ? getDisplayName(fullScreenChart) : ""}</DialogTitle>
          </DialogHeader>
          {fullScreenChart && (
            <div className="flex-1 min-h-[500px]">
              <Tabs defaultValue="chart" className="h-full flex flex-col">
                <TabsList>
                  <TabsTrigger value="chart">
                    <BarChartIcon className="h-4 w-4 mr-2" />
                    Chart
                  </TabsTrigger>
                  <TabsTrigger value="table">
                    <TableIcon className="h-4 w-4 mr-2" />
                    Table
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chart" className="flex-1">
                  <div className="h-[60vh]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={data}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey={timeColumn} tickFormatter={formatXAxis} />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [value, getDisplayName(fullScreenChart)]}
                          labelFormatter={(label) => `Time: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey={fullScreenChart}
                          stroke={getColorForColumn(fullScreenChart)}
                          strokeWidth={2}
                          dot={true}
                          activeDot={{ r: 8 }}
                          connectNulls={true}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="table" className="flex-1">
                  <div className="h-[60vh] overflow-auto border rounded-md">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                          <TableHead>{getDisplayName(timeColumn)}</TableHead>
                          <TableHead>{getDisplayName(fullScreenChart)}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row[timeColumn]}</TableCell>
                            <TableCell>
                              {row[fullScreenChart] !== null
                                ? typeof row[fullScreenChart] === "number"
                                  ? row[fullScreenChart].toFixed(2)
                                  : row[fullScreenChart]
                                : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
