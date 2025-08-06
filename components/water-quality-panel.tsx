// //app/components/water-quality-panel.tsx

// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
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
//     if (data && data.length > 0) {
//       setIsLoading(true)

//       // Analyze data for statistics
//       const hasTemperature = data.some((item) => item.temp !== undefined && !isNaN(Number(item.temp)))
//       const hasPh = data.some((item) => item.ph !== undefined && !isNaN(Number(item.ph)))
//       const hasOrp = data.some((item) => item.orp !== undefined && !isNaN(Number(item.orp)))
//       const hasDo = data.some((item) => item.do !== undefined && !isNaN(Number(item.do)))
//       const hasSalinity = data.some((item) => item.sal !== undefined && !isNaN(Number(item.sal)))

//       // Get date range
//       const validDates = data
//         .map((item) => {
//           try {
//             const date = new Date(`${item.dates} ${item.times}`)
//             return isNaN(date.getTime()) ? null : date
//           } catch (e) {
//             return null
//           }
//         })
//         .filter((date) => date !== null)

//       let startDate = ""
//       let endDate = ""

//       if (validDates.length > 0) {
//         const sortedDates = validDates.sort((a, b) => a.getTime() - b.getTime())
//         startDate = formatDateForDisplay(sortedDates[0], false)
//         endDate = formatDateForDisplay(sortedDates[sortedDates.length - 1], false)
//       }

//       setDataStats({
//         totalRecords: data.length,
//         dateRange: { start: startDate, end: endDate },
//         hasTemperature,
//         hasPh,
//         hasOrp,
//         hasDo,
//         hasSalinity,
//       })

//       // Get filtered data based on time range
//       const filteredData = getFilteredData(data, timeRange, dateFilter)

//       // Process data for charts
//       const processedData = filteredData.map((item) => {
//         // Parse date and time
//         let dateObj = new Date()
//         let formattedTime = ""
//         let formattedDateTime = ""
//         let formattedDate = ""

//         try {
//           if (item.dates && item.times) {
//             dateObj = new Date(`${item.dates} ${item.times}`)
//             if (!isNaN(dateObj.getTime())) {
//               formattedTime = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//               formattedDate = dateObj.toLocaleDateString()
//               formattedDateTime = formatDateForDisplay(dateObj)
//             } else {
//               formattedTime = item.times || "00:00"
//               formattedDate = item.dates || "Unknown date"
//               formattedDateTime = `${formattedDate} ${formattedTime}`
//             }
//           } else {
//             formattedTime = item.times || "00:00"
//             formattedDate = item.dates || "Unknown date"
//             formattedDateTime = `${formattedDate} ${formattedTime}`
//           }
//         } catch (error) {
//           console.error("Error parsing date:", error)
//           formattedTime = item.times || "00:00"
//           formattedDate = item.dates || "Unknown date"
//           formattedDateTime = `${formattedDate} ${formattedTime}`
//         }

//         // Parse numeric values with validation
//         const parseNumeric = (value) => {
//           if (value === undefined || value === null) return 0
//           const parsed = Number.parseFloat(String(value))
//           return isNaN(parsed) ? 0 : parsed
//         }

//         const temp = parseNumeric(item.temp)
//         const ph = parseNumeric(item.ph)
//         const orp = parseNumeric(item.orp)
//         const dissolvedOxygen = parseNumeric(item.do)
//         const salinity = parseNumeric(item.sal)
//         const conductivity = parseNumeric(item.cond)
//         const speed = parseNumeric(item.spd)
//         const temp2 = parseNumeric(item.temp2)
//         const ph2 = parseNumeric(item.ph2)
//         const orp2 = parseNumeric(item.orp2)
//         const do2 = parseNumeric(item.do2)
//         const lat = parseNumeric(item.lat)
//         const lon = parseNumeric(item.lon)

//         // Calculate derived metrics
//         const waterQualityIndex = calculateWaterQualityIndex(dissolvedOxygen, ph, temp)
//         const doSaturation = calculateDOSaturation(dissolvedOxygen, temp)
//         const conductivityNormalized = normalizeCondutivity(conductivity, temp)
//         const trophicState = calculateTrophicState(dissolvedOxygen, ph)
//         const phDeviation = Math.abs(ph - 7)
//         const doDeficit = Math.max(0, 8 - dissolvedOxygen) // Deficit from ideal DO level (8 mg/L)

//         return {
//           time: item.times || "00:00",
//           temp: Number.parseFloat(item.temp || 0),
//           ph: Number.parseFloat(item.ph || 7),
//           orp: Number.parseFloat(item.orp || 0),
//           do: Number.parseFloat(item.do || 0),
//           sal: Number.parseFloat(item.sal || 0),
//         };
//       });

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
//           temp: Number.parseFloat(item.temp || 0).toFixed(2),
//           ph: Number.parseFloat(item.ph || 0).toFixed(2),
//           orp: Number.parseFloat(item.orp || 0).toFixed(2),
//           do: Number.parseFloat(item.do || 0).toFixed(2),
//           sal: Number.parseFloat(item.sal || 0).toFixed(2),
//           location: `${Number.parseFloat(item.lat || 0).toFixed(
//             4
//           )}, ${Number.parseFloat(item.lon || 0).toFixed(4)}`,
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
//         <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
//           <Select value={timeRange} onValueChange={setTimeRange}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select time range" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Data</SelectItem>
//               <SelectItem value="24h">Last 24 Hours</SelectItem>
//               <SelectItem value="7d">Last 7 Days</SelectItem>
//               <SelectItem value="30d">Last 30 Days</SelectItem>
//               <SelectItem value="custom">Custom Range</SelectItem>
//             </SelectContent>
//           </Select>

//           {timeRange === "custom" && <DatePickerWithRange className="w-auto" onChange={handleDateRangeChange} />}

//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-muted-foreground hidden md:inline">Animation Speed:</span>
//                   <Slider
//                     className="w-[100px]"
//                     defaultValue={[1500]}
//                     max={3000}
//                     min={500}
//                     step={100}
//                     onValueChange={(value) => setAnimationSpeed(value[0])}
//                   />
//                 </div>
//               </TooltipTrigger>
//               <TooltipContent>
//                 <p>Adjust chart animation speed</p>
//               </TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
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
//                       animationDuration={animationSpeed}
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
//                       animationDuration={animationSpeed}
//                     />
//                   )}
//                   {(selectedParameter === "all" ||
//                     selectedParameter === "orp") && (
//                     <Line
//                       yAxisId="right"
//                       type="monotone"
//                       dataKey="orp"
//                       stroke={COLORS.orp}
//                       strokeWidth={2}
//                       dot={false}
//                       activeDot={{ r: 6 }}
//                       name="ORP (mV)"
//                       animationDuration={animationSpeed}
//                     />
//                   )}
//                   {(selectedParameter === "all" ||
//                     selectedParameter === "do") && (
//                     <Line
//                       type="monotone"
//                       dataKey="do"
//                       stroke={COLORS.do}
//                       fill="url(#doGradient2)"
//                       fillOpacity={0.3}
//                       name="DO (mg/L)"
//                       animationDuration={animationSpeed}
//                     />
//                     <ReferenceLine
//                       y={7}
//                       yAxisId="left"
//                       stroke="#666"
//                       strokeDasharray="3 3"
//                       label={{ value: "Neutral pH", position: "insideBottomRight", fill: "#666", fontSize: 12 }}
//                     />
//                     <ReferenceLine
//                       y={5}
//                       yAxisId="left"
//                       stroke="#F44336"
//                       strokeDasharray="3 3"
//                       label={{ value: "Min DO", position: "insideTopRight", fill: "#F44336", fontSize: 12 }}
//                     />
//                     <Brush
//                       dataKey="formattedDateTime"
//                       height={30}
//                       stroke="#8884d8"
//                       startIndex={0}
//                       endIndex={Math.min(chartData.length - 1, 50)}
//                     />
//                   </ComposedChart>
//                 </ResponsiveContainer>
//               </div>
//             </TabsContent>

//             <TabsContent value="derived" className="mt-0">
//               <div className="h-[400px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//                     <defs>
//                       <linearGradient id="wqiGradient" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor={GRADIENTS.wqi[0]} stopOpacity={0.8} />
//                         <stop offset="95%" stopColor={GRADIENTS.wqi[1]} stopOpacity={0.1} />
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
//                     <XAxis
//                       dataKey="formattedDateTime"
//                       tick={{ fontSize: 12 }}
//                       angle={-45}
//                       textAnchor="end"
//                       height={70}
//                     />
//                     <YAxis yAxisId="left" tick={{ fontSize: 12 }} domain={[0, 100]} />
//                     <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
//                     <RechartsTooltip content={<CustomTooltip />} />
//                     <Legend />
//                     <Area
//                       yAxisId="left"
//                       type="monotone"
//                       dataKey="waterQualityIndex"
//                       stroke={COLORS.wqi}
//                       fill="url(#wqiGradient)"
//                       fillOpacity={0.3}
//                       name="Water Quality Index"
//                       animationDuration={animationSpeed}
//                     />
//                     <Line
//                       yAxisId="left"
//                       type="monotone"
//                       dataKey="doSaturation"
//                       stroke={COLORS.doSat}
//                       strokeWidth={2}
//                       dot={false}
//                       activeDot={{ r: 6 }}
//                       name="DO Saturation (%)"
//                       animationDuration={animationSpeed}
//                     />
//                   )}
//                   {(selectedParameter === "all" ||
//                     selectedParameter === "sal") && (
//                     <Line
//                       yAxisId="right"
//                       type="monotone"
//                       dataKey="conductivityNormalized"
//                       stroke={COLORS.condNorm}
//                       strokeWidth={2}
//                       dot={false}
//                       activeDot={{ r: 6 }}
//                       name="Normalized Conductivity (μS/cm)"
//                       animationDuration={animationSpeed}
//                     />
//                     <ReferenceLine
//                       y={70}
//                       yAxisId="left"
//                       stroke="#4CAF50"
//                       strokeDasharray="3 3"
//                       label={{ value: "Good Quality", position: "insideBottomRight", fill: "#4CAF50", fontSize: 12 }}
//                     />
//                     <Brush
//                       dataKey="formattedDateTime"
//                       height={30}
//                       stroke="#8884d8"
//                       startIndex={0}
//                       endIndex={Math.min(chartData.length - 1, 50)}
//                     />
//                   </ComposedChart>
//                 </ResponsiveContainer>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>

//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Waves className="h-5 w-5 text-[#9C27B0]" />
//               Dissolved Oxygen Levels
//             </CardTitle>
//             <CardDescription>Complete DO measurements over time</CardDescription>
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
//                     label={{
//                       value: "DO (mg/L)",
//                       angle: -90,
//                       position: "insideLeft",
//                       style: { textAnchor: "middle" },
//                     }}
//                   />
//                   <RechartsTooltip content={<CustomTooltip />} />
//                   <Area
//                     type="monotone"
//                     dataKey="do"
//                     stroke="#9C27B0"
//                     fill="url(#doAreaGradient)"
//                     name="Dissolved Oxygen"
//                     animationDuration={animationSpeed}
//                   />
//                   <ReferenceLine y={5} stroke="#FF5722" strokeDasharray="3 3" label="Minimum for aquatic life" />
//                   <Brush
//                     dataKey="formattedDateTime"
//                     height={30}
//                     stroke="#9C27B0"
//                     startIndex={0}
//                     endIndex={Math.min(doLevelsData.length - 1, 50)}
//                   />
//                 </ComposedChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="h-5 w-5 text-[#E91E63]" />
//               Water Quality Distribution
//             </CardTitle>
//             <CardDescription>Distribution of water quality measurements</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={parameterDistribution}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     outerRadius={100}
//                     fill="#8884d8"
//                     dataKey="value"
//                     nameKey="name"
//                     label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     animationDuration={animationSpeed}
//                   >
//                     {parameterDistribution.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
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
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <MapPin className="h-5 w-5 text-blue-500" />
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

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <AlertTriangle className="h-5 w-5 text-amber-500" />
//               Parameter Correlations
//             </CardTitle>
//             <CardDescription>Relationship between key water quality parameters</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
//                   <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
//                   <XAxis
//                     type="number"
//                     dataKey="ph"
//                     name="pH"
//                     domain={[5, 9]}
//                     label={{ value: "pH", position: "bottom" }}
//                   />
//                   <YAxis
//                     type="number"
//                     dataKey="do"
//                     name="DO"
//                     unit="mg/L"
//                     label={{ value: "DO (mg/L)", angle: -90, position: "left" }}
//                   />
//                   <ZAxis type="number" dataKey="temp" range={[50, 200]} name="Temperature" unit="°C" />
//                   <RechartsTooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
//                   <Legend />
//                   <Scatter name="Water Parameters" data={chartData} fill="#8884d8" animationDuration={animationSpeed} />
//                 </ScatterChart>
//               </ResponsiveContainer>
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
//             <Button variant="outline" size="sm" onClick={exportCSV}>
//               <Download className="h-4 w-4 mr-2" />
//               Export CSV
//             </Button>
//             <Button variant="outline" size="sm">
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Refresh
//             </Button>
//             <Button variant="outline" size="sm">
//               <FileText className="h-4 w-4 mr-2" />
//               Report
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
//                 {currentItems.length > 0 ? (
//                   currentItems.map((item, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{item.id}</TableCell>
//                       <TableCell>{item.date}</TableCell>
//                       <TableCell>{item.time}</TableCell>
//                       <TableCell>{item.temp}</TableCell>
//                       <TableCell>{item.ph}</TableCell>
//                       <TableCell>{item.orp}</TableCell>
//                       <TableCell>{item.do}</TableCell>
//                       <TableCell>{item.sal}</TableCell>
//                       <TableCell className="font-mono text-xs">
//                         {item.location}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={15} className="text-center py-4">
//                       No data found
//                     </TableCell>
//                   </TableRow>
//                 )}
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
