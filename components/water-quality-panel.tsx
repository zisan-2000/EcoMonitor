// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip as RechartsTooltip,
//   Legend,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
// } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { DatePickerWithRange } from "@/components/date-range-picker";
// import {
//   FlaskRoundIcon as Flask,
//   Waves,
//   MapPin,
//   Download,
//   RefreshCw,
// } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// export default function WaterQualityPanel({ data }) {
//   const [timeRange, setTimeRange] = useState("24h");
//   const [chartData, setChartData] = useState([]);
//   const [doLevelsData, setDoLevelsData] = useState([]);
//   const [mapCenter, setMapCenter] = useState([22.5134, 91.8446]);
//   const [selectedParameter, setSelectedParameter] = useState("all");
//   const [tableData, setTableData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   useEffect(() => {
//     if (data.length > 0) {
//       // Process data for charts
//       const processedData = data.slice(-24).map((item) => ({
//         time: item.times || "00:00",
//         temp: parseFloat(item.temp || 0),
//         ph: parseFloat(item.ph || 0),
//         orp: parseFloat(item.orp || 0),
//         do: parseFloat(item.do || 0),
//         sal: parseFloat(item.sal || 0),
//         cond: parseFloat(item.cond || 0),
//         spd: parseFloat(item.spd || 0),
//         temp2: parseFloat(item.temp2 || 0),
//         ph2: parseFloat(item.ph2 || 0),
//         orp2: parseFloat(item.orp2 || 0),
//         do2: parseFloat(item.do2 || 0),
//       }));

//       setChartData(processedData);

//       // Process DO levels data for bar chart
//       const doData = [];
//       for (let i = 0; i < 24; i++) {
//         const hour = i < 10 ? `0${i}:00` : `${i}:00`;
//         const value = data.find(
//           (item) => item.times && item.times.startsWith(hour)
//         );

//         doData.push({
//           hour,
//           do: value ? Number.parseFloat(value.do || 0) : Math.random() * 10,
//         });
//       }

//       setDoLevelsData(doData);

//       // Set map center from the latest data point with coordinates
//       const latestWithCoords = data.findLast(
//         (item) =>
//           item.lat &&
//           item.lon &&
//           !isNaN(Number.parseFloat(item.lat)) &&
//           !isNaN(Number.parseFloat(item.lon))
//       );

//       if (latestWithCoords) {
//         setMapCenter([
//           Number.parseFloat(latestWithCoords.lat),
//           Number.parseFloat(latestWithCoords.lon),
//         ]);
//       }

//       // Prepare table data
//       setTableData(
//         data.slice(-50).map((item) => ({
//           id: item.id || "N/A",
//           date: item.dates || "N/A",
//           time: item.times || "N/A",
//           temp: parseFloat(item.temp || 0).toFixed(2),
//           ph: parseFloat(item.ph || 0).toFixed(2),
//           orp: parseFloat(item.orp || 0).toFixed(2),
//           do: parseFloat(item.do || 0).toFixed(2),
//           sal: parseFloat(item.sal || 0).toFixed(2),
//           cond: parseFloat(item.cond || 0).toFixed(2),
//           spd: parseFloat(item.spd || 0).toFixed(2),
//           temp2: parseFloat(item.temp2 || 0).toFixed(2),
//           ph2: parseFloat(item.ph2 || 0).toFixed(2),
//           orp2: parseFloat(item.orp2 || 0).toFixed(2),
//           do2: parseFloat(item.do2 || 0).toFixed(2),
//           scnt: item.scnt,
//           location: `${parseFloat(item.lat || 0).toFixed(4)}, ${parseFloat(
//             item.lon || 0
//           ).toFixed(4)}`,
//         }))
//       );
//     }
//   }, [data]);

//   // Function to get color based on parameter value
//   const getParameterColor = (param) => {
//     switch (param) {
//       case "temp":
//         return "#FF5722";
//       case "ph":
//         return "#4CAF50";
//       case "orp":
//         return "#2196F3";
//       case "do":
//         return "#9C27B0";
//       case "sal":
//         return "#FFC107";
//       default:
//         return "#000000";
//     }
//   };

//   // Filter and paginate table data
//   const filteredData = tableData.filter((item) =>
//     Object.values(item).some((value) =>
//       value.toString().toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="space-y-6"
//     >
//       <div className="flex flex-col md:flex-row justify-between gap-4">
//         <div className="flex items-center space-x-4">
//           <Select value={timeRange} onValueChange={setTimeRange}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select time range" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="24h">Last 24 Hours</SelectItem>
//               <SelectItem value="7d">Last 7 Days</SelectItem>
//               <SelectItem value="30d">Last 30 Days</SelectItem>
//               <SelectItem value="custom">Custom Range</SelectItem>
//             </SelectContent>
//           </Select>

//           {timeRange === "custom" && <DatePickerWithRange className="w-auto" />}
//         </div>

//         <div>
//           <Select
//             value={selectedParameter}
//             onValueChange={setSelectedParameter}
//           >
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select parameter" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Parameters</SelectItem>
//               <SelectItem value="temp">Temperature</SelectItem>
//               <SelectItem value="ph">pH</SelectItem>
//               <SelectItem value="orp">ORP</SelectItem>
//               <SelectItem value="do">Dissolved Oxygen</SelectItem>
//               <SelectItem value="sal">Salinity</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <Card className="col-span-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Flask className="h-5 w-5" />
//               Water Quality Parameters
//             </CardTitle>
//             <CardDescription>
//               Temperature, pH, ORP, DO, and Salinity over time
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[400px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart
//                   data={chartData}
//                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
//                   <XAxis dataKey="time" tick={{ fontSize: 12 }} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <RechartsTooltip
//                     contentStyle={{
//                       backgroundColor: "rgba(255, 255, 255, 0.8)",
//                       borderRadius: "8px",
//                       boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//                       border: "none",
//                     }}
//                   />
//                   <Legend />
//                   {(selectedParameter === "all" ||
//                     selectedParameter === "temp") && (
//                     <Line
//                       type="monotone"
//                       dataKey="temp"
//                       stroke="#FF5722"
//                       strokeWidth={2}
//                       dot={false}
//                       activeDot={{ r: 6 }}
//                       name="Temperature (°C)"
//                     />
//                   )}
//                   {(selectedParameter === "all" ||
//                     selectedParameter === "ph") && (
//                     <Line
//                       type="monotone"
//                       dataKey="ph"
//                       stroke="#4CAF50"
//                       strokeWidth={2}
//                       dot={false}
//                       activeDot={{ r: 6 }}
//                       name="pH"
//                     />
//                   )}
//                   {(selectedParameter === "all" ||
//                     selectedParameter === "orp") && (
//                     <Line
//                       type="monotone"
//                       dataKey="orp"
//                       stroke="#2196F3"
//                       strokeWidth={2}
//                       dot={false}
//                       activeDot={{ r: 6 }}
//                       name="ORP (mV)"
//                     />
//                   )}
//                   {(selectedParameter === "all" ||
//                     selectedParameter === "do") && (
//                     <Line
//                       type="monotone"
//                       dataKey="do"
//                       stroke="#9C27B0"
//                       strokeWidth={2}
//                       dot={false}
//                       activeDot={{ r: 6 }}
//                       name="DO (mg/L)"
//                     />
//                   )}
//                   {(selectedParameter === "all" ||
//                     selectedParameter === "sal") && (
//                     <Line
//                       type="monotone"
//                       dataKey="sal"
//                       stroke="#FFC107"
//                       strokeWidth={2}
//                       dot={false}
//                       activeDot={{ r: 6 }}
//                       name="Salinity (ppt)"
//                     />
//                   )}
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Waves className="h-5 w-5" />
//               Dissolved Oxygen Levels
//             </CardTitle>
//             <CardDescription>DO levels per hour</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={doLevelsData}
//                   margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
//                   <XAxis
//                     dataKey="hour"
//                     tick={{ fontSize: 12 }}
//                     tickFormatter={(value) => value.split(":")[0]}
//                   />
//                   <YAxis
//                     tick={{ fontSize: 12 }}
//                     label={{
//                       value: "DO (mg/L)",
//                       angle: -90,
//                       position: "insideLeft",
//                       style: { textAnchor: "middle" },
//                     }}
//                   />
//                   <RechartsTooltip />
//                   <Bar
//                     dataKey="do"
//                     fill="#9C27B0"
//                     radius={[4, 4, 0, 0]}
//                     name="Dissolved Oxygen"
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <MapPin className="h-5 w-5" />
//               Sensor Location
//             </CardTitle>
//             <CardDescription>
//               Geographic location of water quality sensors
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[300px] rounded-md overflow-hidden">
//               {typeof window !== "undefined" && (
//                 <div className="h-full w-full">
//                   <iframe
//                     src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${mapCenter[0]},${mapCenter[1]}&zoom=14`}
//                     width="100%"
//                     height="100%"
//                     style={{ border: 0 }}
//                     allowFullScreen=""
//                     loading="lazy"
//                     referrerPolicy="no-referrer-when-downgrade"
//                   ></iframe>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Table View */}
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <div>
//             <CardTitle>Water Quality Data Table</CardTitle>
//             <CardDescription>Raw water quality measurements</CardDescription>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button variant="outline" size="sm">
//               <Download className="h-4 w-4 mr-2" />
//               Export CSV
//             </Button>
//             <Button variant="outline" size="sm">
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Refresh
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="mb-4">
//             <Input
//               placeholder="Search data..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="max-w-sm"
//             />
//           </div>
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>ID</TableHead>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Time</TableHead>
//                   <TableHead>Temp</TableHead>
//                   <TableHead>pH</TableHead>
//                   <TableHead>ORP</TableHead>
//                   <TableHead>DO</TableHead>
//                   <TableHead>Salinity</TableHead>
//                   <TableHead>Cond</TableHead>
//                   <TableHead>Spd</TableHead>
//                   <TableHead>Temp2</TableHead>
//                   <TableHead>pH2</TableHead>
//                   <TableHead>ORP2</TableHead>
//                   <TableHead>DO2</TableHead>
//                   <TableHead>Location</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {currentItems.map((item, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{item.id}</TableCell>
//                     <TableCell>{item.date}</TableCell>
//                     <TableCell>{item.time}</TableCell>
//                     <TableCell>{item.temp}</TableCell>
//                     <TableCell>{item.ph}</TableCell>
//                     <TableCell>{item.orp}</TableCell>
//                     <TableCell>{item.do}</TableCell>
//                     <TableCell>{item.sal}</TableCell>
//                     <TableCell>{item.cond}</TableCell>
//                     <TableCell>{item.spd}</TableCell>
//                     <TableCell>{item.temp2}</TableCell>
//                     <TableCell>{item.ph2}</TableCell>
//                     <TableCell>{item.orp2}</TableCell>
//                     <TableCell>{item.do2}</TableCell>
//                     <TableCell>{item.location}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//         <CardFooter className="flex justify-between">
//           <div className="text-sm text-muted-foreground">
//             Showing {indexOfFirstItem + 1}-
//             {Math.min(indexOfLastItem, filteredData.length)} of{" "}
//             {filteredData.length} entries
//           </div>
//           <div className="flex gap-1">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handlePrevPage}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleNextPage}
//               disabled={currentPage === totalPages || totalPages === 0}
//             >
//               Next
//             </Button>
//           </div>
//         </CardFooter>
//       </Card>
//     </motion.div>
//   );
// }



"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Scatter,
  ScatterChart,
  ZAxis,
  Brush,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import {
  FlaskRoundIcon as Flask,
  Waves,
  MapPin,
  Download,
  RefreshCw,
  Info,
  Droplets,
  Thermometer,
  Activity,
  Gauge,
  BarChart2,
  Layers,
  AlertTriangle,
  TrendingUp,
  Zap,
  Leaf,
  FileText,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WaterQualityPanel({ data }) {
  const [timeRange, setTimeRange] = useState("all")
  const [dateFilter, setDateFilter] = useState({ start: null, end: null })
  const [chartData, setChartData] = useState([])
  const [doLevelsData, setDoLevelsData] = useState([])
  const [mapCenter, setMapCenter] = useState([22.5134, 91.8446])
  const [selectedParameter, setSelectedParameter] = useState("all")
  const [tableData, setTableData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState("overview")
  const [animationSpeed, setAnimationSpeed] = useState(1500)
  const [isLoading, setIsLoading] = useState(true)
  const [showFullTimespan, setShowFullTimespan] = useState(true)
  const [dataStats, setDataStats] = useState({
    totalRecords: 0,
    dateRange: { start: "", end: "" },
    hasTemperature: false,
    hasPh: false,
    hasOrp: false,
    hasDo: false,
    hasSalinity: false,
  })
  const [parameterDistribution, setParameterDistribution] = useState([])
  const [qualityScores, setQualityScores] = useState([])

  // Function to filter data based on time range
  const getFilteredData = (data, timeRange, dateFilter) => {
    if (!data || data.length === 0) return []

    // Sort data by timestamp, handling invalid dates
    const sortedData = [...data].sort((a, b) => {
      try {
        const dateA = new Date(`${a.dates} ${a.times}`)
        const dateB = new Date(`${b.dates} ${b.times}`)

        // Check if dates are valid
        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0
        if (isNaN(dateA.getTime())) return 1 // Invalid dates go to the end
        if (isNaN(dateB.getTime())) return -1

        return dateA.getTime() - dateB.getTime()
      } catch (e) {
        return 0 // If comparison fails, keep original order
      }
    })

    // Apply time range filter
    if (timeRange === "all" || showFullTimespan) {
      return sortedData
    } else if (timeRange === "24h") {
      const now = new Date()
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      return sortedData.filter((item) => {
        try {
          const itemDate = new Date(`${item.dates} ${item.times}`)
          return !isNaN(itemDate.getTime()) && itemDate >= oneDayAgo
        } catch (e) {
          return false
        }
      })
    } else if (timeRange === "7d") {
      const now = new Date()
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return sortedData.filter((item) => {
        try {
          const itemDate = new Date(`${item.dates} ${item.times}`)
          return !isNaN(itemDate.getTime()) && itemDate >= sevenDaysAgo
        } catch (e) {
          return false
        }
      })
    } else if (timeRange === "30d") {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return sortedData.filter((item) => {
        try {
          const itemDate = new Date(`${item.dates} ${item.times}`)
          return !isNaN(itemDate.getTime()) && itemDate >= thirtyDaysAgo
        } catch (e) {
          return false
        }
      })
    } else if (timeRange === "custom" && dateFilter.start && dateFilter.end) {
      return sortedData.filter((item) => {
        try {
          const itemDate = new Date(`${item.dates} ${item.times}`)
          return !isNaN(itemDate.getTime()) && itemDate >= dateFilter.start && itemDate <= dateFilter.end
        } catch (e) {
          return false
        }
      })
    }

    return sortedData
  }

  // Format date for display based on timespan
  const formatDateForDisplay = (date, showTime = true) => {
    if (!date || isNaN(date.getTime())) return "Invalid date"

    const dateOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
    }

    if (showTime) {
      return date.toLocaleDateString(undefined, dateOptions) + " " + date.toLocaleTimeString(undefined, timeOptions)
    } else {
      return date.toLocaleDateString(undefined, dateOptions)
    }
  }

  useEffect(() => {
    if (data && data.length > 0) {
      setIsLoading(true)

      // Analyze data for statistics
      const hasTemperature = data.some((item) => item.temp !== undefined && !isNaN(Number(item.temp)))
      const hasPh = data.some((item) => item.ph !== undefined && !isNaN(Number(item.ph)))
      const hasOrp = data.some((item) => item.orp !== undefined && !isNaN(Number(item.orp)))
      const hasDo = data.some((item) => item.do !== undefined && !isNaN(Number(item.do)))
      const hasSalinity = data.some((item) => item.sal !== undefined && !isNaN(Number(item.sal)))

      // Get date range
      const validDates = data
        .map((item) => {
          try {
            const date = new Date(`${item.dates} ${item.times}`)
            return isNaN(date.getTime()) ? null : date
          } catch (e) {
            return null
          }
        })
        .filter((date) => date !== null)

      let startDate = ""
      let endDate = ""

      if (validDates.length > 0) {
        const sortedDates = validDates.sort((a, b) => a.getTime() - b.getTime())
        startDate = formatDateForDisplay(sortedDates[0], false)
        endDate = formatDateForDisplay(sortedDates[sortedDates.length - 1], false)
      }

      setDataStats({
        totalRecords: data.length,
        dateRange: { start: startDate, end: endDate },
        hasTemperature,
        hasPh,
        hasOrp,
        hasDo,
        hasSalinity,
      })

      // Get filtered data based on time range
      const filteredData = getFilteredData(data, timeRange, dateFilter)

      // Process data for charts
      const processedData = filteredData.map((item) => {
        // Parse date and time
        let dateObj = new Date()
        let formattedTime = ""
        let formattedDateTime = ""
        let formattedDate = ""

        try {
          if (item.dates && item.times) {
            dateObj = new Date(`${item.dates} ${item.times}`)
            if (!isNaN(dateObj.getTime())) {
              formattedTime = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              formattedDate = dateObj.toLocaleDateString()
              formattedDateTime = formatDateForDisplay(dateObj)
            } else {
              formattedTime = item.times || "00:00"
              formattedDate = item.dates || "Unknown date"
              formattedDateTime = `${formattedDate} ${formattedTime}`
            }
          } else {
            formattedTime = item.times || "00:00"
            formattedDate = item.dates || "Unknown date"
            formattedDateTime = `${formattedDate} ${formattedTime}`
          }
        } catch (error) {
          console.error("Error parsing date:", error)
          formattedTime = item.times || "00:00"
          formattedDate = item.dates || "Unknown date"
          formattedDateTime = `${formattedDate} ${formattedTime}`
        }

        // Parse numeric values with validation
        const parseNumeric = (value) => {
          if (value === undefined || value === null) return 0
          const parsed = Number.parseFloat(String(value))
          return isNaN(parsed) ? 0 : parsed
        }

        const temp = parseNumeric(item.temp)
        const ph = parseNumeric(item.ph)
        const orp = parseNumeric(item.orp)
        const dissolvedOxygen = parseNumeric(item.do)
        const salinity = parseNumeric(item.sal)
        const conductivity = parseNumeric(item.cond)
        const speed = parseNumeric(item.spd)
        const temp2 = parseNumeric(item.temp2)
        const ph2 = parseNumeric(item.ph2)
        const orp2 = parseNumeric(item.orp2)
        const do2 = parseNumeric(item.do2)
        const lat = parseNumeric(item.lat)
        const lon = parseNumeric(item.lon)

        // Calculate derived metrics
        const waterQualityIndex = calculateWaterQualityIndex(dissolvedOxygen, ph, temp)
        const doSaturation = calculateDOSaturation(dissolvedOxygen, temp)
        const conductivityNormalized = normalizeCondutivity(conductivity, temp)
        const trophicState = calculateTrophicState(dissolvedOxygen, ph)
        const phDeviation = Math.abs(ph - 7)
        const doDeficit = Math.max(0, 8 - dissolvedOxygen) // Deficit from ideal DO level (8 mg/L)

        return {
          time: formattedTime,
          date: formattedDate,
          formattedDateTime,
          dateObj,
          temp,
          ph,
          orp,
          do: dissolvedOxygen,
          sal: salinity,
          cond: conductivity,
          spd: speed,
          temp2,
          ph2,
          orp2,
          do2,
          lat,
          lon,
          waterQualityIndex,
          doSaturation,
          conductivityNormalized,
          trophicState,
          phDeviation,
          doDeficit,
        }
      })

      setChartData(processedData)

      // Process DO levels data for all data points
      setDoLevelsData(processedData)

      // Calculate parameter distribution for pie chart
      const paramDistribution = [
        { name: "Excellent", value: 0, color: "#4CAF50" },
        { name: "Good", value: 0, color: "#8BC34A" },
        { name: "Fair", value: 0, color: "#FFC107" },
        { name: "Poor", value: 0, color: "#FF9800" },
        { name: "Critical", value: 0, color: "#F44336" },
      ]

      processedData.forEach((item) => {
        if (item.waterQualityIndex >= 90) paramDistribution[0].value++
        else if (item.waterQualityIndex >= 70) paramDistribution[1].value++
        else if (item.waterQualityIndex >= 50) paramDistribution[2].value++
        else if (item.waterQualityIndex >= 25) paramDistribution[3].value++
        else paramDistribution[4].value++
      })

      setParameterDistribution(paramDistribution)

      // Calculate quality scores for radar chart
      const calculateAverageScore = (data, parameter, maxValue) => {
        const values = data.map((item) => item[parameter]).filter((val) => !isNaN(val) && val !== 0)
        if (values.length === 0) return 0
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length
        return (avg / maxValue) * 100
      }

      const scores = [
        {
          parameter: "DO",
          score: calculateAverageScore(processedData, "do", 10),
          fullMark: 100,
        },
        {
          parameter: "pH Balance",
          score: 100 - calculateAverageScore(processedData, "phDeviation", 7) * 14,
          fullMark: 100,
        },
        {
          parameter: "Temperature",
          score: calculateAverageScore(processedData, "temp", 30),
          fullMark: 100,
        },
        {
          parameter: "ORP",
          score: calculateAverageScore(processedData, "orp", 500),
          fullMark: 100,
        },
        {
          parameter: "Salinity",
          score: 100 - calculateAverageScore(processedData, "sal", 5) * 20,
          fullMark: 100,
        },
      ]

      setQualityScores(scores)

      // Set map center from the latest data point with coordinates
      const latestWithCoords = processedData.findLast(
        (item) => item.lat && item.lon && !isNaN(item.lat) && !isNaN(item.lon),
      )

      if (latestWithCoords) {
        setMapCenter([latestWithCoords.lat, latestWithCoords.lon])
      }

      // Prepare table data
      setTableData(
        filteredData.map((item, index) => {
          // Parse numeric values with validation
          const parseNumeric = (value) => {
            if (value === undefined || value === null) return "N/A"
            const parsed = Number.parseFloat(String(value))
            return isNaN(parsed) ? "N/A" : parsed.toFixed(2)
          }

          return {
            id: item.id || index + 1,
            date: item.dates || "N/A",
            time: item.times || "N/A",
            temp: parseNumeric(item.temp),
            ph: parseNumeric(item.ph),
            orp: parseNumeric(item.orp),
            do: parseNumeric(item.do),
            sal: parseNumeric(item.sal),
            cond: parseNumeric(item.cond),
            spd: parseNumeric(item.spd),
            temp2: parseNumeric(item.temp2),
            ph2: parseNumeric(item.ph2),
            orp2: parseNumeric(item.orp2),
            do2: parseNumeric(item.do2),
            scnt: item.scnt || "N/A",
            location: `${parseNumeric(item.lat)}, ${parseNumeric(item.lon)}`,
          }
        }),
      )

      // Simulate loading for animation effect
      setTimeout(() => {
        setIsLoading(false)
      }, 800)
    }
  }, [data, timeRange, dateFilter, showFullTimespan])

  // Calculate Water Quality Index (simplified version)
  const calculateWaterQualityIndex = (dissolvedOxygen, ph, temperature) => {
    if (isNaN(dissolvedOxygen) || isNaN(ph) || isNaN(temperature)) return 0

    // Simplified WQI calculation
    // DO score (0-100)
    const doScore = Math.min(100, Math.max(0, dissolvedOxygen * 10))

    // pH score (0-100)
    const phScore = Math.min(100, Math.max(0, 100 - Math.abs(ph - 7) * 15))

    // Temperature score (0-100)
    const tempScore = Math.min(100, Math.max(0, 100 - Math.abs(temperature - 20) * 3))

    // Weighted average
    return doScore * 0.4 + phScore * 0.35 + tempScore * 0.25
  }

  // Calculate DO Saturation percentage
  const calculateDOSaturation = (dissolvedOxygen, temperature) => {
    if (isNaN(dissolvedOxygen) || isNaN(temperature)) return 0

    // Simplified calculation of DO saturation
    // At 20°C, 100% saturation is approximately 9.1 mg/L
    const saturationAt20C = 9.1

    // Adjust for temperature (simplified)
    const tempFactor = 1 - (temperature - 20) * 0.02
    const saturationAtTemp = saturationAt20C * tempFactor

    return (dissolvedOxygen / saturationAtTemp) * 100
  }

  // Normalize conductivity to 25°C
  const normalizeCondutivity = (conductivity, temperature) => {
    if (isNaN(conductivity) || isNaN(temperature)) return conductivity

    // Standard formula to normalize conductivity to 25°C
    return conductivity / (1 + 0.02 * (temperature - 25))
  }

  // Calculate trophic state (simplified)
  const calculateTrophicState = (dissolvedOxygen, ph) => {
    if (isNaN(dissolvedOxygen) || isNaN(ph)) return 0

    // Simplified trophic state calculation
    // Higher values indicate more eutrophic conditions
    const doFactor = Math.max(0, 10 - dissolvedOxygen) * 10 // Lower DO = higher trophic state
    const phFactor = Math.max(0, ph - 7) * 10 // Higher pH = higher trophic state

    return (doFactor + phFactor) / 2
  }

  // Color palettes for different parameters
  const COLORS = {
    temp: "#FF5722", // Orange-red for temperature
    ph: "#4CAF50", // Green for pH
    orp: "#2196F3", // Blue for ORP
    do: "#9C27B0", // Purple for DO
    sal: "#FFC107", // Yellow for salinity
    cond: "#795548", // Brown for conductivity
    spd: "#607D8B", // Blue-grey for speed
    wqi: "#E91E63", // Pink for water quality index
    doSat: "#00BCD4", // Cyan for DO saturation
    condNorm: "#FF9800", // Amber for normalized conductivity
    trophic: "#673AB7", // Deep purple for trophic state
    phDev: "#F44336", // Red for pH deviation
    doDef: "#3F51B5", // Indigo for DO deficit
  }

  // Gradient definitions for charts
  const GRADIENTS = {
    temp: ["#FF5722", "#FFCCBC"],
    ph: ["#4CAF50", "#C8E6C9"],
    orp: ["#2196F3", "#BBDEFB"],
    do: ["#9C27B0", "#E1BEE7"],
    sal: ["#FFC107", "#FFECB3"],
    wqi: ["#E91E63", "#F8BBD0"],
  }

  // Get X-axis formatter based on data timespan
  const getXAxisFormatter = () => {
    // Determine if we need to show dates based on the timespan
    const needsDateDisplay =
      chartData.length > 24 ||
      (chartData.length > 0 &&
        chartData[chartData.length - 1].dateObj.getTime() - chartData[0].dateObj.getTime() > 24 * 60 * 60 * 1000)

    return (value, index) => {
      // For dense data, show fewer ticks
      const showTick = index % Math.ceil(chartData.length / 10) === 0

      if (!showTick) return ""

      if (needsDateDisplay) {
        // Show date and time for longer timespans
        return chartData[index].date + " " + value
      }

      // Just show time for shorter timespans
      return value
    }
  }

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-gray-800/90 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="font-medium text-sm">{label}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry, index) => (
              <div key={`tooltip-${index}`} className="flex items-center gap-2 text-xs">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="font-medium">{entry.name}:</span>
                <span>
                  {typeof entry.value === "number" ? entry.value.toFixed(2) : entry.value} {entry.unit || ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  // Get water quality status based on WQI
  const getWaterQualityStatus = (wqi) => {
    if (wqi >= 90) return { status: "Excellent", color: "#4CAF50" }
    if (wqi >= 70) return { status: "Good", color: "#8BC34A" }
    if (wqi >= 50) return { status: "Fair", color: "#FFC107" }
    if (wqi >= 25) return { status: "Poor", color: "#FF9800" }
    return { status: "Critical", color: "#F44336" }
  }

  // Get current water quality summary
  const getCurrentWaterQuality = useMemo(() => {
    if (chartData.length === 0) return null

    const current = chartData[chartData.length - 1]
    const wqiStatus = getWaterQualityStatus(current.waterQualityIndex)

    return {
      temperature: current.temp.toFixed(1),
      ph: current.ph.toFixed(2),
      orp: current.orp.toFixed(0),
      do: current.do.toFixed(2),
      salinity: current.sal.toFixed(2),
      conductivity: current.cond.toFixed(0),
      waterQualityIndex: current.waterQualityIndex.toFixed(0),
      doSaturation: current.doSaturation.toFixed(0),
      status: wqiStatus.status,
      statusColor: wqiStatus.color,
      location: current.lat && current.lon ? `${current.lat.toFixed(4)}, ${current.lon.toFixed(4)}` : "Unknown",
      timestamp: formatDateForDisplay(current.dateObj),
      trophicState: current.trophicState.toFixed(1),
    }
  }, [chartData])

  // Get water quality alerts
  const getWaterQualityAlerts = useMemo(() => {
    if (chartData.length === 0) return []

    const alerts = []
    const current = chartData[chartData.length - 1]

    if (current.do < 5) {
      alerts.push({
        type: "Low Dissolved Oxygen",
        message: "DO levels below 5 mg/L may stress aquatic organisms",
        severity: "warning",
        icon: <Droplets className="h-4 w-4" />,
      })
    }

    if (current.ph < 6.5 || current.ph > 8.5) {
      alerts.push({
        type: "pH Out of Range",
        message: `pH value of ${current.ph.toFixed(2)} is outside optimal range (6.5-8.5)`,
        severity: "warning",
        icon: <Activity className="h-4 w-4" />,
      })
    }

    if (current.temp > 30) {
      alerts.push({
        type: "High Temperature",
        message: "Water temperature exceeds 30°C, may reduce oxygen solubility",
        severity: "warning",
        icon: <Thermometer className="h-4 w-4" />,
      })
    }

    if (current.orp < 200) {
      alerts.push({
        type: "Low ORP",
        message: "Oxidation-Reduction Potential below optimal range",
        severity: "warning",
        icon: <Zap className="h-4 w-4" />,
      })
    }

    if (current.trophicState > 7) {
      alerts.push({
        type: "Eutrophication Risk",
        message: "Indicators suggest potential eutrophication conditions",
        severity: "warning",
        icon: <Leaf className="h-4 w-4" />,
      })
    }

    return alerts
  }, [chartData])

  // Filter and paginate table data
  const filteredData = tableData.filter((item) =>
    Object.values(item).some(
      (value) =>
        value !== undefined && value !== null && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    ),
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

  // Handle date range change
  const handleDateRangeChange = (range) => {
    setDateFilter({
      start: range.from || null,
      end: range.to || null,
    })
  }

  // Function to export data as CSV
  const exportCSV = () => {
    if (tableData.length === 0) return

    // Create CSV header
    const headers = Object.keys(tableData[0]).join(",")

    // Create CSV rows
    const rows = tableData
      .map((item) =>
        Object.values(item)
          .map((value) => (typeof value === "string" && value.includes(",") ? `"${value}"` : value))
          .join(","),
      )
      .join("\n")

    // Combine header and rows
    const csv = `${headers}\n${rows}`

    // Create download link
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `water_quality_data_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading water quality data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Data Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Water Quality Data Summary</h3>
                <p className="text-xs text-muted-foreground">
                  {dataStats.totalRecords} records from {dataStats.dateRange.start} to {dataStats.dateRange.end}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {dataStats.hasTemperature && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                >
                  <div className="h-2 w-2 rounded-full bg-[#FF5722] mr-1"></div>
                  Temperature
                </Badge>
              )}
              {dataStats.hasPh && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                >
                  <div className="h-2 w-2 rounded-full bg-[#4CAF50] mr-1"></div>
                  pH
                </Badge>
              )}
              {dataStats.hasOrp && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                >
                  <div className="h-2 w-2 rounded-full bg-[#2196F3] mr-1"></div>
                  ORP
                </Badge>
              )}
              {dataStats.hasDo && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                >
                  <div className="h-2 w-2 rounded-full bg-[#9C27B0] mr-1"></div>
                  DO
                </Badge>
              )}
              {dataStats.hasSalinity && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                >
                  <div className="h-2 w-2 rounded-full bg-[#FFC107] mr-1"></div>
                  Salinity
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Water Quality Summary */}
      {getCurrentWaterQuality && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="col-span-1 md:col-span-2 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-md">
                    <Flask className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">WQI: {getCurrentWaterQuality.waterQualityIndex}</h2>
                    <p className="text-sm font-medium mt-1" style={{ color: getCurrentWaterQuality.statusColor }}>
                      {getCurrentWaterQuality.status} Quality
                    </p>
                    <p className="text-sm text-muted-foreground">
                      DO Saturation: {getCurrentWaterQuality.doSaturation}%
                    </p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-[#FF5722]" />
                    <span className="text-sm">Temp: {getCurrentWaterQuality.temperature}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#4CAF50]" />
                    <span className="text-sm">pH: {getCurrentWaterQuality.ph}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-[#2196F3]" />
                    <span className="text-sm">ORP: {getCurrentWaterQuality.orp} mV</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-[#9C27B0]" />
                    <span className="text-sm">DO: {getCurrentWaterQuality.do} mg/L</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Waves className="h-4 w-4 text-[#FFC107]" />
                    <span className="text-sm">Salinity: {getCurrentWaterQuality.salinity} ppt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-[#795548]" />
                    <span className="text-sm">Cond: {getCurrentWaterQuality.conductivity} μS/cm</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  Current water quality is{" "}
                  <span style={{ color: getCurrentWaterQuality.statusColor }}>
                    {getCurrentWaterQuality.status.toLowerCase()}
                  </span>{" "}
                  with dissolved oxygen at {getCurrentWaterQuality.do} mg/L ({getCurrentWaterQuality.doSaturation}%
                  saturation) and pH at {getCurrentWaterQuality.ph}.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span>Location: {getCurrentWaterQuality.location}</span>
                  <span>Last updated: {getCurrentWaterQuality.timestamp}</span>
                </div>
              </div>

              {getWaterQualityAlerts.length > 0 && (
                <div className="mt-4 space-y-2">
                  {getWaterQualityAlerts.map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm"
                    >
                      <div className="text-yellow-600 dark:text-yellow-400">{alert.icon}</div>
                      <div>
                        <p className="font-medium">{alert.type}</p>
                        <p className="text-xs text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Quality Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={qualityScores}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="parameter" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Water Quality"
                      dataKey="score"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      animationDuration={animationSpeed}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Data</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {timeRange === "custom" && <DatePickerWithRange className="w-auto" onChange={handleDateRangeChange} />}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden md:inline">Animation Speed:</span>
                  <Slider
                    className="w-[100px]"
                    defaultValue={[1500]}
                    max={3000}
                    min={500}
                    step={100}
                    onValueChange={(value) => setAnimationSpeed(value[0])}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Adjust chart animation speed</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1 bg-[#FF5722]/10">
            <div className="h-3 w-3 rounded-full bg-[#FF5722]" />
            <span className="text-xs">Temperature</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 bg-[#4CAF50]/10">
            <div className="h-3 w-3 rounded-full bg-[#4CAF50]" />
            <span className="text-xs">pH</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 bg-[#2196F3]/10">
            <div className="h-3 w-3 rounded-full bg-[#2196F3]" />
            <span className="text-xs">ORP</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 bg-[#9C27B0]/10">
            <div className="h-3 w-3 rounded-full bg-[#9C27B0]" />
            <span className="text-xs">DO</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 bg-[#FFC107]/10">
            <div className="h-3 w-3 rounded-full bg-[#FFC107]" />
            <span className="text-xs">Salinity</span>
          </Badge>
        </div>
      </div>

      <Card className="col-span-2 overflow-hidden">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Water Quality Trends</CardTitle>
              <CardDescription>Visualize water quality parameters over time</CardDescription>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="overview" className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="physical" className="flex items-center gap-1">
                  <Thermometer className="h-4 w-4" />
                  <span className="hidden sm:inline">Physical</span>
                </TabsTrigger>
                <TabsTrigger value="chemical" className="flex items-center gap-1">
                  <Flask className="h-4 w-4" />
                  <span className="hidden sm:inline">Chemical</span>
                </TabsTrigger>
                <TabsTrigger value="derived" className="flex items-center gap-1">
                  <Layers className="h-4 w-4" />
                  <span className="hidden sm:inline">Derived</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="overview" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GRADIENTS.temp[0]} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={GRADIENTS.temp[1]} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="phGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GRADIENTS.ph[0]} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={GRADIENTS.ph[1]} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="doGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GRADIENTS.do[0]} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={GRADIENTS.do[1]} stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="salGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GRADIENTS.sal[0]} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={GRADIENTS.sal[1]} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="formattedDateTime"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="temp"
                      stroke={COLORS.temp}
                      fill="url(#tempGradient)"
                      fillOpacity={0.3}
                      name="Temperature (°C)"
                      animationDuration={animationSpeed}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="ph"
                      stroke={COLORS.ph}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="pH"
                      animationDuration={animationSpeed}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="do"
                      stroke={COLORS.do}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="DO (mg/L)"
                      animationDuration={animationSpeed}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="sal"
                      stroke={COLORS.sal}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="Salinity (ppt)"
                      animationDuration={animationSpeed}
                    />
                    <Brush
                      dataKey="formattedDateTime"
                      height={30}
                      stroke="#8884d8"
                      startIndex={0}
                      endIndex={Math.min(chartData.length - 1, 50)}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="physical" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="tempGradient2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GRADIENTS.temp[0]} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={GRADIENTS.temp[1]} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="formattedDateTime"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="temp"
                      stroke={COLORS.temp}
                      fill="url(#tempGradient2)"
                      fillOpacity={0.3}
                      name="Temperature (°C)"
                      animationDuration={animationSpeed}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="cond"
                      stroke={COLORS.cond}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="Conductivity (μS/cm)"
                      animationDuration={animationSpeed}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="spd"
                      stroke={COLORS.spd}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="Speed (m/s)"
                      animationDuration={animationSpeed}
                    />
                    <Brush
                      dataKey="formattedDateTime"
                      height={30}
                      stroke="#8884d8"
                      startIndex={0}
                      endIndex={Math.min(chartData.length - 1, 50)}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="chemical" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="doGradient2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GRADIENTS.do[0]} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={GRADIENTS.do[1]} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="formattedDateTime"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="ph"
                      stroke={COLORS.ph}
                      strokeWidth={2}
                      dot={{ r: 3, fill: COLORS.ph }}
                      activeDot={{ r: 6 }}
                      name="pH"
                      animationDuration={animationSpeed}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orp"
                      stroke={COLORS.orp}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="ORP (mV)"
                      animationDuration={animationSpeed}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="do"
                      stroke={COLORS.do}
                      fill="url(#doGradient2)"
                      fillOpacity={0.3}
                      name="DO (mg/L)"
                      animationDuration={animationSpeed}
                    />
                    <ReferenceLine
                      y={7}
                      yAxisId="left"
                      stroke="#666"
                      strokeDasharray="3 3"
                      label={{ value: "Neutral pH", position: "insideBottomRight", fill: "#666", fontSize: 12 }}
                    />
                    <ReferenceLine
                      y={5}
                      yAxisId="left"
                      stroke="#F44336"
                      strokeDasharray="3 3"
                      label={{ value: "Min DO", position: "insideTopRight", fill: "#F44336", fontSize: 12 }}
                    />
                    <Brush
                      dataKey="formattedDateTime"
                      height={30}
                      stroke="#8884d8"
                      startIndex={0}
                      endIndex={Math.min(chartData.length - 1, 50)}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="derived" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="wqiGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GRADIENTS.wqi[0]} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={GRADIENTS.wqi[1]} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="formattedDateTime"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="waterQualityIndex"
                      stroke={COLORS.wqi}
                      fill="url(#wqiGradient)"
                      fillOpacity={0.3}
                      name="Water Quality Index"
                      animationDuration={animationSpeed}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="doSaturation"
                      stroke={COLORS.doSat}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="DO Saturation (%)"
                      animationDuration={animationSpeed}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="conductivityNormalized"
                      stroke={COLORS.condNorm}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="Normalized Conductivity (μS/cm)"
                      animationDuration={animationSpeed}
                    />
                    <ReferenceLine
                      y={70}
                      yAxisId="left"
                      stroke="#4CAF50"
                      strokeDasharray="3 3"
                      label={{ value: "Good Quality", position: "insideBottomRight", fill: "#4CAF50", fontSize: 12 }}
                    />
                    <Brush
                      dataKey="formattedDateTime"
                      height={30}
                      stroke="#8884d8"
                      startIndex={0}
                      endIndex={Math.min(chartData.length - 1, 50)}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-[#9C27B0]" />
              Dissolved Oxygen Levels
            </CardTitle>
            <CardDescription>Complete DO measurements over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={doLevelsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="doAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9C27B0" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#9C27B0" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="formattedDateTime" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={70} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "DO (mg/L)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="do"
                    stroke="#9C27B0"
                    fill="url(#doAreaGradient)"
                    name="Dissolved Oxygen"
                    animationDuration={animationSpeed}
                  />
                  <ReferenceLine y={5} stroke="#FF5722" strokeDasharray="3 3" label="Minimum for aquatic life" />
                  <Brush
                    dataKey="formattedDateTime"
                    height={30}
                    stroke="#9C27B0"
                    startIndex={0}
                    endIndex={Math.min(doLevelsData.length - 1, 50)}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#E91E63]" />
              Water Quality Distribution
            </CardTitle>
            <CardDescription>Distribution of water quality measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={parameterDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    animationDuration={animationSpeed}
                  >
                    {parameterDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Sensor Location
            </CardTitle>
            <CardDescription>Geographic location of water quality sensors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] rounded-md overflow-hidden">
              {typeof window !== "undefined" && (
                <div className="h-full w-full">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${mapCenter[0]},${mapCenter[1]}&zoom=14`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Parameter Correlations
            </CardTitle>
            <CardDescription>Relationship between key water quality parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    type="number"
                    dataKey="ph"
                    name="pH"
                    domain={[5, 9]}
                    label={{ value: "pH", position: "bottom" }}
                  />
                  <YAxis
                    type="number"
                    dataKey="do"
                    name="DO"
                    unit="mg/L"
                    label={{ value: "DO (mg/L)", angle: -90, position: "left" }}
                  />
                  <ZAxis type="number" dataKey="temp" range={[50, 200]} name="Temperature" unit="°C" />
                  <RechartsTooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
                  <Legend />
                  <Scatter name="Water Parameters" data={chartData} fill="#8884d8" animationDuration={animationSpeed} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table View */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Water Quality Data Table</CardTitle>
            <CardDescription>Raw water quality measurements</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Report
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
                  <TableHead>Temp</TableHead>
                  <TableHead>pH</TableHead>
                  <TableHead>ORP</TableHead>
                  <TableHead>DO</TableHead>
                  <TableHead>Salinity</TableHead>
                  <TableHead>Cond</TableHead>
                  <TableHead>Spd</TableHead>
                  <TableHead>Temp2</TableHead>
                  <TableHead>pH2</TableHead>
                  <TableHead>ORP2</TableHead>
                  <TableHead>DO2</TableHead>
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
                      <TableCell>{item.temp}</TableCell>
                      <TableCell>{item.ph}</TableCell>
                      <TableCell>{item.orp}</TableCell>
                      <TableCell>{item.do}</TableCell>
                      <TableCell>{item.sal}</TableCell>
                      <TableCell>{item.cond}</TableCell>
                      <TableCell>{item.spd}</TableCell>
                      <TableCell>{item.temp2}</TableCell>
                      <TableCell>{item.ph2}</TableCell>
                      <TableCell>{item.orp2}</TableCell>
                      <TableCell>{item.do2}</TableCell>
                      <TableCell>{item.location}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={15} className="text-center py-4">
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
    </div>
  )
}

