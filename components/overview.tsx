// // "use client";

// // import { useEffect, useState } from "react";
// // import {
// //   Bar,
// //   BarChart,
// //   Line,
// //   LineChart,
// //   ResponsiveContainer,
// //   Scatter,
// //   ScatterChart,
// //   Tooltip,
// //   XAxis,
// //   YAxis,
// //   ZAxis,
// // } from "recharts";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import { Expand, TableIcon, BarChartIcon } from "lucide-react";

// // interface OverviewProps {
// //   chartType?:
// //     | "default"
// //     | "temperature"
// //     | "correlation"
// //     | "distribution"
// //     | "wind";
// // }

// // export function Overview({ chartType = "default" }: OverviewProps) {
// //   const [data, setData] = useState<any[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [fullScreenChart, setFullScreenChart] = useState<boolean>(false);

// //   useEffect(() => {
// //     // Simulate data fetching
// //     const fetchData = async () => {
// //       setIsLoading(true);

// //       // Generate sample data
// //       const sampleData = Array.from({ length: 24 }, (_, i) => {
// //         const hour = i;
// //         const baseTemp = 20 + Math.sin(i / 3) * 5;
// //         const randomFactor = Math.random() * 2 - 1;

// //         return {
// //           time: `${hour.toString().padStart(2, "0")}:00`,
// //           temperature: +(baseTemp + randomFactor).toFixed(1),
// //           humidity: +(60 + Math.sin(i / 2) * 15 + Math.random() * 5).toFixed(1),
// //           airQuality: +(50 + Math.sin(i / 4) * 20 + Math.random() * 10).toFixed(
// //             1
// //           ),
// //           windSpeed: +(5 + Math.sin(i / 6) * 3 + Math.random() * 2).toFixed(1),
// //           windDirection: Math.floor(Math.random() * 360),
// //           precipitation:
// //             Math.random() > 0.8 ? +(Math.random() * 2).toFixed(1) : 0,
// //           solarRadiation:
// //             hour >= 6 && hour <= 18
// //               ? +(
// //                   Math.sin(((hour - 6) / 12) * Math.PI) * 800 +
// //                   Math.random() * 100
// //                 ).toFixed(1)
// //               : 0,
// //         };
// //       });

// //       setData(sampleData);
// //       setIsLoading(false);
// //     };

// //     fetchData();
// //   }, []);

// //   // Format the X-axis tick values
// //   const formatXAxis = (value: string) => {
// //     return value;
// //   };

// //   // Get color for a column
// //   const getColorForColumn = (column: string) => {
// //     const lowerColumn = column.toLowerCase();
// //     if (lowerColumn.includes("temp")) return "#ef4444"; // red
// //     if (lowerColumn.includes("humid")) return "#3b82f6"; // blue
// //     if (lowerColumn.includes("wind")) return "#64748b"; // slate
// //     if (lowerColumn.includes("solar")) return "#eab308"; // yellow
// //     if (lowerColumn.includes("air")) return "#10b981"; // green
// //     if (lowerColumn.includes("precipitation")) return "#60a5fa"; // blue-400

// //     // Generate a color based on the column name for consistency
// //     const hash = column.split("").reduce((acc, char) => {
// //       return char.charCodeAt(0) + ((acc << 5) - acc);
// //     }, 0);

// //     return `hsl(${Math.abs(hash) % 360}, 70%, 50%)`;
// //   };

// //   // Get a friendly display name for a column
// //   const getDisplayName = (column: string) => {
// //     // Replace underscores with spaces and capitalize each word
// //     return column
// //       .replace(/_/g, " ")
// //       .replace(/([A-Z])/g, " $1")
// //       .replace(/^./, (str) => str.toUpperCase())
// //       .trim();
// //   };

// //   // Prepare correlation data
// //   const correlationData = data.map((item) => ({
// //     x: item.temperature,
// //     y: item.humidity,
// //     z: item.airQuality,
// //   }));

// //   // Prepare distribution data
// //   const distributionData = [
// //     {
// //       name: "Good (0-50)",
// //       value: data.filter((d) => d.airQuality <= 50).length,
// //     },
// //     {
// //       name: "Moderate (51-100)",
// //       value: data.filter((d) => d.airQuality > 50 && d.airQuality <= 100)
// //         .length,
// //     },
// //     {
// //       name: "Unhealthy for Sensitive Groups (101-150)",
// //       value: data.filter((d) => d.airQuality > 100 && d.airQuality <= 150)
// //         .length,
// //     },
// //     {
// //       name: "Unhealthy (151-200)",
// //       value: data.filter((d) => d.airQuality > 150 && d.airQuality <= 200)
// //         .length,
// //     },
// //     {
// //       name: "Very Unhealthy (201-300)",
// //       value: data.filter((d) => d.airQuality > 200 && d.airQuality <= 300)
// //         .length,
// //     },
// //     {
// //       name: "Hazardous (301+)",
// //       value: data.filter((d) => d.airQuality > 300).length,
// //     },
// //   ];

// //   if (isLoading) {
// //     return (
// //       <div className="flex items-center justify-center h-80">
// //         Loading data...
// //       </div>
// //     );
// //   }

// //   // Render different chart types based on the chartType prop
// //   const renderChart = () => {
// //     switch (chartType) {
// //       case "temperature":
// //         return (
// //           <div className="h-80">
// //             <Tabs defaultValue="chart">
// //               <TabsList className="mb-4">
// //                 <TabsTrigger value="chart">
// //                   <BarChartIcon className="h-4 w-4 mr-2" />
// //                   Chart
// //                 </TabsTrigger>
// //                 <TabsTrigger value="table">
// //                   <TableIcon className="h-4 w-4 mr-2" />
// //                   Table
// //                 </TabsTrigger>
// //               </TabsList>

// //               <TabsContent value="chart">
// //                 <div className="relative h-80">
// //                   <Button
// //                     variant="ghost"
// //                     size="icon"
// //                     className="absolute top-0 right-0 z-10"
// //                     onClick={() => setFullScreenChart(true)}
// //                   >
// //                     <Expand className="h-4 w-4" />
// //                   </Button>
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     <LineChart data={data}>
// //                       <XAxis dataKey="time" tickFormatter={formatXAxis} />
// //                       <YAxis />
// //                       <Tooltip />
// //                       <Line
// //                         type="monotone"
// //                         dataKey="temperature"
// //                         stroke={getColorForColumn("temperature")}
// //                         strokeWidth={2}
// //                         dot={false}
// //                         activeDot={{ r: 6 }}
// //                       />
// //                     </LineChart>
// //                   </ResponsiveContainer>
// //                 </div>
// //               </TabsContent>

// //               <TabsContent value="table">
// //                 <div className="max-h-80 overflow-auto border rounded-md">
// //                   <Table>
// //                     <TableHeader>
// //                       <TableRow>
// //                         <TableHead>Time</TableHead>
// //                         <TableHead>Temperature (°C)</TableHead>
// //                       </TableRow>
// //                     </TableHeader>
// //                     <TableBody>
// //                       {data.map((row, index) => (
// //                         <TableRow key={index}>
// //                           <TableCell>{row.time}</TableCell>
// //                           <TableCell>{row.temperature}</TableCell>
// //                         </TableRow>
// //                       ))}
// //                     </TableBody>
// //                   </Table>
// //                 </div>
// //               </TabsContent>
// //             </Tabs>
// //           </div>
// //         );

// //       case "correlation":
// //         return (
// //           <div className="h-80">
// //             <Tabs defaultValue="chart">
// //               <TabsList className="mb-4">
// //                 <TabsTrigger value="chart">
// //                   <BarChartIcon className="h-4 w-4 mr-2" />
// //                   Chart
// //                 </TabsTrigger>
// //                 <TabsTrigger value="table">
// //                   <TableIcon className="h-4 w-4 mr-2" />
// //                   Table
// //                 </TabsTrigger>
// //               </TabsList>

// //               <TabsContent value="chart">
// //                 <div className="relative h-80">
// //                   <Button
// //                     variant="ghost"
// //                     size="icon"
// //                     className="absolute top-0 right-0 z-10"
// //                     onClick={() => setFullScreenChart(true)}
// //                   >
// //                     <Expand className="h-4 w-4" />
// //                   </Button>
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     <ScatterChart>
// //                       <XAxis
// //                         type="number"
// //                         dataKey="x"
// //                         name="Temperature"
// //                         unit="°C"
// //                         domain={["dataMin - 1", "dataMax + 1"]}
// //                       />
// //                       <YAxis
// //                         type="number"
// //                         dataKey="y"
// //                         name="Humidity"
// //                         unit="%"
// //                         domain={["dataMin - 5", "dataMax + 5"]}
// //                       />
// //                       <ZAxis
// //                         type="number"
// //                         dataKey="z"
// //                         range={[60, 400]}
// //                         name="Air Quality"
// //                       />
// //                       <Tooltip
// //                         cursor={{ strokeDasharray: "3 3" }}
// //                         formatter={(value, name) => [value, name]}
// //                       />
// //                       <Scatter
// //                         name="Temperature vs Humidity"
// //                         data={correlationData}
// //                         fill={getColorForColumn("temperature")}
// //                       />
// //                     </ScatterChart>
// //                   </ResponsiveContainer>
// //                 </div>
// //               </TabsContent>

// //               <TabsContent value="table">
// //                 <div className="max-h-80 overflow-auto border rounded-md">
// //                   <Table>
// //                     <TableHeader>
// //                       <TableRow>
// //                         <TableHead>Temperature (°C)</TableHead>
// //                         <TableHead>Humidity (%)</TableHead>
// //                         <TableHead>Air Quality</TableHead>
// //                       </TableRow>
// //                     </TableHeader>
// //                     <TableBody>
// //                       {correlationData.map((row, index) => (
// //                         <TableRow key={index}>
// //                           <TableCell>{row.x}</TableCell>
// //                           <TableCell>{row.y}</TableCell>
// //                           <TableCell>{row.z}</TableCell>
// //                         </TableRow>
// //                       ))}
// //                     </TableBody>
// //                   </Table>
// //                 </div>
// //               </TabsContent>
// //             </Tabs>
// //           </div>
// //         );

// //       case "distribution":
// //         return (
// //           <div className="h-80">
// //             <Tabs defaultValue="chart">
// //               <TabsList className="mb-4">
// //                 <TabsTrigger value="chart">
// //                   <BarChartIcon className="h-4 w-4 mr-2" />
// //                   Chart
// //                 </TabsTrigger>
// //                 <TabsTrigger value="table">
// //                   <TableIcon className="h-4 w-4 mr-2" />
// //                   Table
// //                 </TabsTrigger>
// //               </TabsList>

// //               <TabsContent value="chart">
// //                 <div className="relative h-80">
// //                   <Button
// //                     variant="ghost"
// //                     size="icon"
// //                     className="absolute top-0 right-0 z-10"
// //                     onClick={() => setFullScreenChart(true)}
// //                   >
// //                     <Expand className="h-4 w-4" />
// //                   </Button>
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     <BarChart data={distributionData}>
// //                       <XAxis dataKey="name" />
// //                       <YAxis />
// //                       <Tooltip />
// //                       <Bar
// //                         dataKey="value"
// //                         fill={getColorForColumn("airQuality")}
// //                       />
// //                     </BarChart>
// //                   </ResponsiveContainer>
// //                 </div>
// //               </TabsContent>

// //               <TabsContent value="table">
// //                 <div className="max-h-80 overflow-auto border rounded-md">
// //                   <Table>
// //                     <TableHeader>
// //                       <TableRow>
// //                         <TableHead>AQI Category</TableHead>
// //                         <TableHead>Count</TableHead>
// //                       </TableRow>
// //                     </TableHeader>
// //                     <TableBody>
// //                       {distributionData.map((row, index) => (
// //                         <TableRow key={index}>
// //                           <TableCell>{row.name}</TableCell>
// //                           <TableCell>{row.value}</TableCell>
// //                         </TableRow>
// //                       ))}
// //                     </TableBody>
// //                   </Table>
// //                 </div>
// //               </TabsContent>
// //             </Tabs>
// //           </div>
// //         );

// //       case "wind":
// //         return (
// //           <div className="h-80">
// //             <Tabs defaultValue="chart">
// //               <TabsList className="mb-4">
// //                 <TabsTrigger value="chart">
// //                   <BarChartIcon className="h-4 w-4 mr-2" />
// //                   Chart
// //                 </TabsTrigger>
// //                 <TabsTrigger value="table">
// //                   <TableIcon className="h-4 w-4 mr-2" />
// //                   Table
// //                 </TabsTrigger>
// //               </TabsList>

// //               <TabsContent value="chart">
// //                 <div className="relative h-80">
// //                   <Button
// //                     variant="ghost"
// //                     size="icon"
// //                     className="absolute top-0 right-0 z-10"
// //                     onClick={() => setFullScreenChart(true)}
// //                   >
// //                     <Expand className="h-4 w-4" />
// //                   </Button>
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     <LineChart data={data}>
// //                       <XAxis dataKey="time" tickFormatter={formatXAxis} />
// //                       <YAxis />
// //                       <Tooltip />
// //                       <Line
// //                         type="monotone"
// //                         dataKey="windSpeed"
// //                         stroke={getColorForColumn("windSpeed")}
// //                         strokeWidth={2}
// //                         dot={false}
// //                         activeDot={{ r: 6 }}
// //                       />
// //                     </LineChart>
// //                   </ResponsiveContainer>
// //                 </div>
// //               </TabsContent>

// //               <TabsContent value="table">
// //                 <div className="max-h-80 overflow-auto border rounded-md">
// //                   <Table>
// //                     <TableHeader>
// //                       <TableRow>
// //                         <TableHead>Time</TableHead>
// //                         <TableHead>Wind Speed (km/h)</TableHead>
// //                         <TableHead>Wind Direction (°)</TableHead>
// //                       </TableRow>
// //                     </TableHeader>
// //                     <TableBody>
// //                       {data.map((row, index) => (
// //                         <TableRow key={index}>
// //                           <TableCell>{row.time}</TableCell>
// //                           <TableCell>{row.windSpeed}</TableCell>
// //                           <TableCell>{row.windDirection}</TableCell>
// //                         </TableRow>
// //                       ))}
// //                     </TableBody>
// //                   </Table>
// //                 </div>
// //               </TabsContent>
// //             </Tabs>
// //           </div>
// //         );

// //       default:
// //         return (
// //           <div className="h-80">
// //             <Tabs defaultValue="chart">
// //               <TabsList className="mb-4">
// //                 <TabsTrigger value="chart">
// //                   <BarChartIcon className="h-4 w-4 mr-2" />
// //                   Chart
// //                 </TabsTrigger>
// //                 <TabsTrigger value="table">
// //                   <TableIcon className="h-4 w-4 mr-2" />
// //                   Table
// //                 </TabsTrigger>
// //               </TabsList>

// //               <TabsContent value="chart">
// //                 <div className="relative h-80">
// //                   <Button
// //                     variant="ghost"
// //                     size="icon"
// //                     className="absolute top-0 right-0 z-10"
// //                     onClick={() => setFullScreenChart(true)}
// //                   >
// //                     <Expand className="h-4 w-4" />
// //                   </Button>
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     <LineChart data={data}>
// //                       <XAxis dataKey="time" tickFormatter={formatXAxis} />
// //                       <YAxis />
// //                       <Tooltip />
// //                       <Line
// //                         type="monotone"
// //                         dataKey="temperature"
// //                         stroke={getColorForColumn("temperature")}
// //                         strokeWidth={2}
// //                         dot={false}
// //                         activeDot={{ r: 6 }}
// //                       />
// //                       <Line
// //                         type="monotone"
// //                         dataKey="humidity"
// //                         stroke={getColorForColumn("humidity")}
// //                         strokeWidth={2}
// //                         dot={false}
// //                         activeDot={{ r: 6 }}
// //                       />
// //                       <Line
// //                         type="monotone"
// //                         dataKey="airQuality"
// //                         stroke={getColorForColumn("airQuality")}
// //                         strokeWidth={2}
// //                         dot={false}
// //                         activeDot={{ r: 6 }}
// //                       />
// //                     </LineChart>
// //                   </ResponsiveContainer>
// //                 </div>
// //               </TabsContent>

// //               <TabsContent value="table">
// //                 <div className="max-h-80 overflow-auto border rounded-md">
// //                   <Table>
// //                     <TableHeader>
// //                       <TableRow>
// //                         <TableHead>Time</TableHead>
// //                         <TableHead>Temperature (°C)</TableHead>
// //                         <TableHead>Humidity (%)</TableHead>
// //                         <TableHead>Air Quality</TableHead>
// //                         <TableHead>Wind Speed (km/h)</TableHead>
// //                       </TableRow>
// //                     </TableHeader>
// //                     <TableBody>
// //                       {data.map((row, index) => (
// //                         <TableRow key={index}>
// //                           <TableCell>{row.time}</TableCell>
// //                           <TableCell>{row.temperature}</TableCell>
// //                           <TableCell>{row.humidity}</TableCell>
// //                           <TableCell>{row.airQuality}</TableCell>
// //                           <TableCell>{row.windSpeed}</TableCell>
// //                         </TableRow>
// //                       ))}
// //                     </TableBody>
// //                   </Table>
// //                 </div>
// //               </TabsContent>
// //             </Tabs>
// //           </div>
// //         );
// //     }
// //   };

// //   return (
// //     <>
// //       {renderChart()}

// //       {/* Full Screen Chart Dialog */}
// //       <Dialog open={fullScreenChart} onOpenChange={setFullScreenChart}>
// //         <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh]">
// //           <DialogHeader>
// //             <DialogTitle>
// //               {chartType === "temperature" && "Temperature Trends"}
// //               {chartType === "correlation" && "Humidity vs Temperature"}
// //               {chartType === "distribution" && "Air Quality Distribution"}
// //               {chartType === "wind" && "Wind Speed and Direction"}
// //               {chartType === "default" && "Environmental Metrics Overview"}
// //             </DialogTitle>
// //           </DialogHeader>
// //           <div className="h-[70vh]">
// //             <Tabs defaultValue="chart">
// //               <TabsList className="mb-4">
// //                 <TabsTrigger value="chart">
// //                   <BarChartIcon className="h-4 w-4 mr-2" />
// //                   Chart
// //                 </TabsTrigger>
// //                 <TabsTrigger value="table">
// //                   <TableIcon className="h-4 w-4 mr-2" />
// //                   Table
// //                 </TabsTrigger>
// //               </TabsList>

// //               <TabsContent value="chart">
// //                 <div className="h-[70vh]">
// //                   <ResponsiveContainer width="100%" height="100%">
// //                     {chartType === "temperature" && (
// //                       <LineChart data={data}>
// //                         <XAxis dataKey="time" tickFormatter={formatXAxis} />
// //                         <YAxis />
// //                         <Tooltip />
// //                         <Line
// //                           type="monotone"
// //                           dataKey="temperature"
// //                           stroke={getColorForColumn("temperature")}
// //                           strokeWidth={2}
// //                           dot={true}
// //                           activeDot={{ r: 8 }}
// //                         />
// //                       </LineChart>
// //                     )}
// //                     {chartType === "correlation" && (
// //                       <ScatterChart>
// //                         <XAxis
// //                           type="number"
// //                           dataKey="x"
// //                           name="Temperature"
// //                           unit="°C"
// //                           domain={["dataMin - 1", "dataMax + 1"]}
// //                         />
// //                         <YAxis
// //                           type="number"
// //                           dataKey="y"
// //                           name="Humidity"
// //                           unit="%"
// //                           domain={["dataMin - 5", "dataMax + 5"]}
// //                         />
// //                         <ZAxis
// //                           type="number"
// //                           dataKey="z"
// //                           range={[60, 400]}
// //                           name="Air Quality"
// //                         />
// //                         <Tooltip
// //                           cursor={{ strokeDasharray: "3 3" }}
// //                           formatter={(value, name) => [value, name]}
// //                         />
// //                         <Scatter
// //                           name="Temperature vs Humidity"
// //                           data={correlationData}
// //                           fill={getColorForColumn("temperature")}
// //                         />
// //                       </ScatterChart>
// //                     )}
// //                     {chartType === "distribution" && (
// //                       <BarChart data={distributionData}>
// //                         <XAxis dataKey="name" />
// //                         <YAxis />
// //                         <Tooltip />
// //                         <Bar
// //                           dataKey="value"
// //                           fill={getColorForColumn("airQuality")}
// //                         />
// //                       </BarChart>
// //                     )}
// //                     {chartType === "wind" && (
// //                       <LineChart data={data}>
// //                         <XAxis dataKey="time" tickFormatter={formatXAxis} />
// //                         <YAxis />
// //                         <Tooltip />
// //                         <Line
// //                           type="monotone"
// //                           dataKey="windSpeed"
// //                           stroke={getColorForColumn("windSpeed")}
// //                           strokeWidth={2}
// //                           dot={true}
// //                           activeDot={{ r: 8 }}
// //                         />
// //                       </LineChart>
// //                     )}
// //                     {chartType === "default" && (
// //                       <LineChart data={data}>
// //                         <XAxis dataKey="time" tickFormatter={formatXAxis} />
// //                         <YAxis />
// //                         <Tooltip />
// //                         <Line
// //                           type="monotone"
// //                           dataKey="temperature"
// //                           stroke={getColorForColumn("temperature")}
// //                           strokeWidth={2}
// //                           dot={true}
// //                           activeDot={{ r: 8 }}
// //                         />
// //                         <Line
// //                           type="monotone"
// //                           dataKey="humidity"
// //                           stroke={getColorForColumn("humidity")}
// //                           strokeWidth={2}
// //                           dot={true}
// //                           activeDot={{ r: 8 }}
// //                         />
// //                         <Line
// //                           type="monotone"
// //                           dataKey="airQuality"
// //                           stroke={getColorForColumn("airQuality")}
// //                           strokeWidth={2}
// //                           dot={true}
// //                           activeDot={{ r: 8 }}
// //                         />
// //                       </LineChart>
// //                     )}
// //                   </ResponsiveContainer>
// //                 </div>
// //               </TabsContent>

// //               <TabsContent value="table">
// //                 <div className="h-[70vh] overflow-auto border rounded-md">
// //                   <Table>
// //                     <TableHeader className="sticky top-0 bg-background">
// //                       {(chartType === "temperature" ||
// //                         chartType === "default" ||
// //                         chartType === "wind") && (
// //                         <TableRow>
// //                           <TableHead>Time</TableHead>
// //                           {chartType === "temperature" && (
// //                             <TableHead>Temperature (°C)</TableHead>
// //                           )}
// //                           {chartType === "wind" && (
// //                             <>
// //                               <TableHead>Wind Speed (km/h)</TableHead>
// //                               <TableHead>Wind Direction (°)</TableHead>
// //                             </>
// //                           )}
// //                           {chartType === "default" && (
// //                             <>
// //                               <TableHead>Temperature (°C)</TableHead>
// //                               <TableHead>Humidity (%)</TableHead>
// //                               <TableHead>Air Quality</TableHead>
// //                               <TableHead>Wind Speed (km/h)</TableHead>
// //                             </>
// //                           )}
// //                         </TableRow>
// //                       )}
// //                       {chartType === "correlation" && (
// //                         <TableRow>
// //                           <TableHead>Temperature (°C)</TableHead>
// //                           <TableHead>Humidity (%)</TableHead>
// //                           <TableHead>Air Quality</TableHead>
// //                         </TableRow>
// //                       )}
// //                       {chartType === "distribution" && (
// //                         <TableRow>
// //                           <TableHead>AQI Category</TableHead>
// //                           <TableHead>Count</TableHead>
// //                         </TableRow>
// //                       )}
// //                     </TableHeader>
// //                     <TableBody>
// //                       {(chartType === "temperature" ||
// //                         chartType === "default" ||
// //                         chartType === "wind") &&
// //                         data.map((row, index) => (
// //                           <TableRow key={index}>
// //                             <TableCell>{row.time}</TableCell>
// //                             {chartType === "temperature" && (
// //                               <TableCell>{row.temperature}</TableCell>
// //                             )}
// //                             {chartType === "wind" && (
// //                               <>
// //                                 <TableCell>{row.windSpeed}</TableCell>
// //                                 <TableCell>{row.windDirection}</TableCell>
// //                               </>
// //                             )}
// //                             {chartType === "default" && (
// //                               <>
// //                                 <TableCell>{row.temperature}</TableCell>
// //                                 <TableCell>{row.humidity}</TableCell>
// //                                 <TableCell>{row.airQuality}</TableCell>
// //                                 <TableCell>{row.windSpeed}</TableCell>
// //                               </>
// //                             )}
// //                           </TableRow>
// //                         ))}
// //                       {chartType === "correlation" &&
// //                         correlationData.map((row, index) => (
// //                           <TableRow key={index}>
// //                             <TableCell>{row.x}</TableCell>
// //                             <TableCell>{row.y}</TableCell>
// //                             <TableCell>{row.z}</TableCell>
// //                           </TableRow>
// //                         ))}
// //                       {chartType === "distribution" &&
// //                         distributionData.map((row, index) => (
// //                           <TableRow key={index}>
// //                             <TableCell>{row.name}</TableCell>
// //                             <TableCell>{row.value}</TableCell>
// //                           </TableRow>
// //                         ))}
// //                     </TableBody>
// //                   </Table>
// //                 </div>
// //               </TabsContent>
// //             </Tabs>
// //           </div>
// //         </DialogContent>
// //       </Dialog>
// //     </>
// //   );
// // }

















// "use client"

// import { useEffect, useState } from "react"
// import {
//   Bar,
//   BarChart,
//   Line,
//   LineChart,
//   ResponsiveContainer,
//   Scatter,
//   ScatterChart,
//   Tooltip,
//   XAxis,
//   YAxis,
//   ZAxis,
// } from "recharts"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Expand, TableIcon, BarChartIcon } from "lucide-react"

// interface OverviewProps {
//   chartType?: "default" | "temperature" | "correlation" | "distribution" | "wind"
// }

// interface WeatherData {
//   timestamp: string
//   temperature: number | null
//   humidity: number | null
//   air_quality: number | null
//   wind_speed: number | null
//   wind_direction: number | null
//   precipitation: number | null
//   solar_radiation: number | null
//   pressure: number | null
// }

// export function Overview({ chartType = "default" }: OverviewProps) {
//   const [data, setData] = useState<WeatherData[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [fullScreenChart, setFullScreenChart] = useState<boolean>(false)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true)
//       setError(null)

//       try {
//         const response = await fetch("/api/csv-data")

//         if (!response.ok) {
//           throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
//         }

//         const result = await response.json()

//         if (result.data && Array.isArray(result.data)) {
//           // Format the data for display
//           const formattedData = result.data.map((item: WeatherData) => ({
//             ...item,
//             // Extract time from timestamp for display
//             time: new Date(item.timestamp).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//             // Ensure all values are properly formatted
//             temperature: item.temperature !== null ? Number(item.temperature) : null,
//             humidity: item.humidity !== null ? Number(item.humidity) : null,
//             air_quality: item.air_quality !== null ? Number(item.air_quality) : null,
//             windSpeed: item.wind_speed !== null ? Number(item.wind_speed) : null,
//             windDirection: item.wind_direction !== null ? Number(item.wind_direction) : null,
//             precipitation: item.precipitation !== null ? Number(item.precipitation) : null,
//             solarRadiation: item.solar_radiation !== null ? Number(item.solar_radiation) : null,
//             pressure: item.pressure !== null ? Number(item.pressure) : null,
//           }))

//           setData(formattedData)
//         } else {
//           throw new Error("Invalid data format received from API")
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err)
//         setError(err instanceof Error ? err.message : "Failed to fetch data")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   // Format the X-axis tick values
//   const formatXAxis = (value: string) => {
//     return value
//   }

//   // Get color for a column
//   const getColorForColumn = (column: string) => {
//     const lowerColumn = column.toLowerCase()
//     if (lowerColumn.includes("temp")) return "#ef4444" // red
//     if (lowerColumn.includes("humid")) return "#3b82f6" // blue
//     if (lowerColumn.includes("wind")) return "#64748b" // slate
//     if (lowerColumn.includes("solar")) return "#eab308" // yellow
//     if (lowerColumn.includes("air")) return "#10b981" // green
//     if (lowerColumn.includes("precipitation")) return "#60a5fa" // blue-400
//     if (lowerColumn.includes("pressure")) return "#8b5cf6" // purple

//     // Generate a color based on the column name for consistency
//     const hash = column.split("").reduce((acc, char) => {
//       return char.charCodeAt(0) + ((acc << 5) - acc)
//     }, 0)

//     return `hsl(${Math.abs(hash) % 360}, 70%, 50%)`
//   }

//   // Get a friendly display name for a column
//   const getDisplayName = (column: string) => {
//     // Replace underscores with spaces and capitalize each word
//     return column
//       .replace(/_/g, " ")
//       .replace(/([A-Z])/g, " $1")
//       .replace(/^./, (str) => str.toUpperCase())
//       .trim()
//   }

//   // Prepare correlation data
//   const correlationData = data
//     .filter((item) => item.temperature !== null && item.humidity !== null && item.air_quality !== null)
//     .map((item) => ({
//       x: item.temperature,
//       y: item.humidity,
//       z: item.air_quality,
//     }))

//   // Prepare distribution data for air quality
//   const prepareDistributionData = () => {
//     const categories = [
//       { name: "Good (0-50)", min: 0, max: 50 },
//       { name: "Moderate (51-100)", min: 51, max: 100 },
//       { name: "Unhealthy for Sensitive Groups (101-150)", min: 101, max: 150 },
//       { name: "Unhealthy (151-200)", min: 151, max: 200 },
//       { name: "Very Unhealthy (201-300)", min: 201, max: 300 },
//       { name: "Hazardous (301+)", min: 301, max: Number.POSITIVE_INFINITY },
//     ]

//     return categories.map((category) => ({
//       name: category.name,
//       value: data.filter(
//         (d) => d.air_quality !== null && d.air_quality >= category.min && d.air_quality <= category.max,
//       ).length,
//     }))
//   }

//   const distributionData = prepareDistributionData()

//   if (isLoading) {
//     return <div className="flex items-center justify-center h-80">Loading data...</div>
//   }

//   if (error) {
//     return <div className="flex items-center justify-center h-80 text-red-500">Error: {error}</div>
//   }

//   if (data.length === 0) {
//     return <div className="flex items-center justify-center h-80">No data available. Please check your CSV file.</div>
//   }

//   // Render different chart types based on the chartType prop
//   const renderChart = () => {
//     switch (chartType) {
//       case "temperature":
//         return (
//           <div className="h-80">
//             <Tabs defaultValue="chart">
//               <TabsList className="mb-4">
//                 <TabsTrigger value="chart">
//                   <BarChartIcon className="h-4 w-4 mr-2" />
//                   Chart
//                 </TabsTrigger>
//                 <TabsTrigger value="table">
//                   <TableIcon className="h-4 w-4 mr-2" />
//                   Table
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="chart">
//                 <div className="relative h-80">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="absolute top-0 right-0 z-10"
//                     onClick={() => setFullScreenChart(true)}
//                   >
//                     <Expand className="h-4 w-4" />
//                   </Button>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={data}>
//                       <XAxis dataKey="time" tickFormatter={formatXAxis} />
//                       <YAxis />
//                       <Tooltip />
//                       <Line
//                         type="monotone"
//                         dataKey="temperature"
//                         stroke={getColorForColumn("temperature")}
//                         strokeWidth={2}
//                         dot={false}
//                         activeDot={{ r: 6 }}
//                         connectNulls={true}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </TabsContent>

//               <TabsContent value="table">
//                 <div className="max-h-80 overflow-auto border rounded-md">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Time</TableHead>
//                         <TableHead>Temperature (°C)</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {data.map((row, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{row.time}</TableCell>
//                           <TableCell>{row.temperature !== null ? row.temperature : "N/A"}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         )

//       case "correlation":
//         return (
//           <div className="h-80">
//             <Tabs defaultValue="chart">
//               <TabsList className="mb-4">
//                 <TabsTrigger value="chart">
//                   <BarChartIcon className="h-4 w-4 mr-2" />
//                   Chart
//                 </TabsTrigger>
//                 <TabsTrigger value="table">
//                   <TableIcon className="h-4 w-4 mr-2" />
//                   Table
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="chart">
//                 <div className="relative h-80">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="absolute top-0 right-0 z-10"
//                     onClick={() => setFullScreenChart(true)}
//                   >
//                     <Expand className="h-4 w-4" />
//                   </Button>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <ScatterChart>
//                       <XAxis
//                         type="number"
//                         dataKey="x"
//                         name="Temperature"
//                         unit="°C"
//                         domain={["dataMin - 1", "dataMax + 1"]}
//                       />
//                       <YAxis
//                         type="number"
//                         dataKey="y"
//                         name="Humidity"
//                         unit="%"
//                         domain={["dataMin - 5", "dataMax + 5"]}
//                       />
//                       <ZAxis type="number" dataKey="z" range={[60, 400]} name="Air Quality" />
//                       <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value, name) => [value, name]} />
//                       <Scatter
//                         name="Temperature vs Humidity"
//                         data={correlationData}
//                         fill={getColorForColumn("temperature")}
//                       />
//                     </ScatterChart>
//                   </ResponsiveContainer>
//                 </div>
//               </TabsContent>

//               <TabsContent value="table">
//                 <div className="max-h-80 overflow-auto border rounded-md">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Temperature (°C)</TableHead>
//                         <TableHead>Humidity (%)</TableHead>
//                         <TableHead>Air Quality</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {correlationData.map((row, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{row.x}</TableCell>
//                           <TableCell>{row.y}</TableCell>
//                           <TableCell>{row.z}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         )

//       case "distribution":
//         return (
//           <div className="h-80">
//             <Tabs defaultValue="chart">
//               <TabsList className="mb-4">
//                 <TabsTrigger value="chart">
//                   <BarChartIcon className="h-4 w-4 mr-2" />
//                   Chart
//                 </TabsTrigger>
//                 <TabsTrigger value="table">
//                   <TableIcon className="h-4 w-4 mr-2" />
//                   Table
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="chart">
//                 <div className="relative h-80">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="absolute top-0 right-0 z-10"
//                     onClick={() => setFullScreenChart(true)}
//                   >
//                     <Expand className="h-4 w-4" />
//                   </Button>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={distributionData}>
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip />
//                       <Bar dataKey="value" fill={getColorForColumn("airQuality")} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </TabsContent>

//               <TabsContent value="table">
//                 <div className="max-h-80 overflow-auto border rounded-md">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>AQI Category</TableHead>
//                         <TableHead>Count</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {distributionData.map((row, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{row.name}</TableCell>
//                           <TableCell>{row.value}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         )

//       case "wind":
//         return (
//           <div className="h-80">
//             <Tabs defaultValue="chart">
//               <TabsList className="mb-4">
//                 <TabsTrigger value="chart">
//                   <BarChartIcon className="h-4 w-4 mr-2" />
//                   Chart
//                 </TabsTrigger>
//                 <TabsTrigger value="table">
//                   <TableIcon className="h-4 w-4 mr-2" />
//                   Table
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="chart">
//                 <div className="relative h-80">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="absolute top-0 right-0 z-10"
//                     onClick={() => setFullScreenChart(true)}
//                   >
//                     <Expand className="h-4 w-4" />
//                   </Button>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={data}>
//                       <XAxis dataKey="time" tickFormatter={formatXAxis} />
//                       <YAxis />
//                       <Tooltip />
//                       <Line
//                         type="monotone"
//                         dataKey="windSpeed"
//                         stroke={getColorForColumn("windSpeed")}
//                         strokeWidth={2}
//                         dot={false}
//                         activeDot={{ r: 6 }}
//                         connectNulls={true}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </TabsContent>

//               <TabsContent value="table">
//                 <div className="max-h-80 overflow-auto border rounded-md">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Time</TableHead>
//                         <TableHead>Wind Speed (km/h)</TableHead>
//                         <TableHead>Wind Direction (°)</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {data.map((row, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{row.time}</TableCell>
//                           <TableCell>{row.windSpeed !== null ? row.windSpeed : "N/A"}</TableCell>
//                           <TableCell>{row.windDirection !== null ? row.windDirection : "N/A"}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         )

//       default:
//         return (
//           <div className="h-80">
//             <Tabs defaultValue="chart">
//               <TabsList className="mb-4">
//                 <TabsTrigger value="chart">
//                   <BarChartIcon className="h-4 w-4 mr-2" />
//                   Chart
//                 </TabsTrigger>
//                 <TabsTrigger value="table">
//                   <TableIcon className="h-4 w-4 mr-2" />
//                   Table
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="chart">
//                 <div className="relative h-80">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="absolute top-0 right-0 z-10"
//                     onClick={() => setFullScreenChart(true)}
//                   >
//                     <Expand className="h-4 w-4" />
//                   </Button>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={data}>
//                       <XAxis dataKey="time" tickFormatter={formatXAxis} />
//                       <YAxis />
//                       <Tooltip />
//                       <Line
//                         type="monotone"
//                         dataKey="temperature"
//                         stroke={getColorForColumn("temperature")}
//                         strokeWidth={2}
//                         dot={false}
//                         activeDot={{ r: 6 }}
//                         connectNulls={true}
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="humidity"
//                         stroke={getColorForColumn("humidity")}
//                         strokeWidth={2}
//                         dot={false}
//                         activeDot={{ r: 6 }}
//                         connectNulls={true}
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="air_quality"
//                         stroke={getColorForColumn("air_quality")}
//                         strokeWidth={2}
//                         dot={false}
//                         activeDot={{ r: 6 }}
//                         connectNulls={true}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </TabsContent>

//               <TabsContent value="table">
//                 <div className="max-h-80 overflow-auto border rounded-md">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Time</TableHead>
//                         <TableHead>Temperature (°C)</TableHead>
//                         <TableHead>Humidity (%)</TableHead>
//                         <TableHead>Air Quality</TableHead>
//                         <TableHead>Wind Speed (km/h)</TableHead>
//                         <TableHead>Pressure (hPa)</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {data.map((row, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{row.time}</TableCell>
//                           <TableCell>{row.temperature !== null ? row.temperature : "N/A"}</TableCell>
//                           <TableCell>{row.humidity !== null ? row.humidity : "N/A"}</TableCell>
//                           <TableCell>{row.air_quality !== null ? row.air_quality : "N/A"}</TableCell>
//                           <TableCell>{row.windSpeed !== null ? row.windSpeed : "N/A"}</TableCell>
//                           <TableCell>{row.pressure !== null ? row.pressure : "N/A"}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         )
//     }
//   }

//   return (
//     <>
//       {renderChart()}

//       {/* Full Screen Chart Dialog */}
//       <Dialog open={fullScreenChart} onOpenChange={setFullScreenChart}>
//         <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh]">
//           <DialogHeader>
//             <DialogTitle>
//               {chartType === "temperature" && "Temperature Trends"}
//               {chartType === "correlation" && "Humidity vs Temperature"}
//               {chartType === "distribution" && "Air Quality Distribution"}
//               {chartType === "wind" && "Wind Speed and Direction"}
//               {chartType === "default" && "Environmental Metrics Overview"}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="h-[70vh]">
//             <Tabs defaultValue="chart">
//               <TabsList className="mb-4">
//                 <TabsTrigger value="chart">
//                   <BarChartIcon className="h-4 w-4 mr-2" />
//                   Chart
//                 </TabsTrigger>
//                 <TabsTrigger value="table">
//                   <TableIcon className="h-4 w-4 mr-2" />
//                   Table
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="chart">
//                 <div className="h-[70vh]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     {chartType === "temperature" && (
//                       <LineChart data={data}>
//                         <XAxis dataKey="time" tickFormatter={formatXAxis} />
//                         <YAxis />
//                         <Tooltip />
//                         <Line
//                           type="monotone"
//                           dataKey="temperature"
//                           stroke={getColorForColumn("temperature")}
//                           strokeWidth={2}
//                           dot={true}
//                           activeDot={{ r: 8 }}
//                           connectNulls={true}
//                         />
//                       </LineChart>
//                     )}
//                     {chartType === "correlation" && (
//                       <ScatterChart>
//                         <XAxis
//                           type="number"
//                           dataKey="x"
//                           name="Temperature"
//                           unit="°C"
//                           domain={["dataMin - 1", "dataMax + 1"]}
//                         />
//                         <YAxis
//                           type="number"
//                           dataKey="y"
//                           name="Humidity"
//                           unit="%"
//                           domain={["dataMin - 5", "dataMax + 5"]}
//                         />
//                         <ZAxis type="number" dataKey="z" range={[60, 400]} name="Air Quality" />
//                         <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value, name) => [value, name]} />
//                         <Scatter
//                           name="Temperature vs Humidity"
//                           data={correlationData}
//                           fill={getColorForColumn("temperature")}
//                         />
//                       </ScatterChart>
//                     )}
//                     {chartType === "distribution" && (
//                       <BarChart data={distributionData}>
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip />
//                         <Bar dataKey="value" fill={getColorForColumn("airQuality")} />
//                       </BarChart>
//                     )}
//                     {chartType === "wind" && (
//                       <LineChart data={data}>
//                         <XAxis dataKey="time" tickFormatter={formatXAxis} />
//                         <YAxis />
//                         <Tooltip />
//                         <Line
//                           type="monotone"
//                           dataKey="windSpeed"
//                           stroke={getColorForColumn("windSpeed")}
//                           strokeWidth={2}
//                           dot={true}
//                           activeDot={{ r: 8 }}
//                           connectNulls={true}
//                         />
//                       </LineChart>
//                     )}
//                     {chartType === "default" && (
//                       <LineChart data={data}>
//                         <XAxis dataKey="time" tickFormatter={formatXAxis} />
//                         <YAxis />
//                         <Tooltip />
//                         <Line
//                           type="monotone"
//                           dataKey="temperature"
//                           stroke={getColorForColumn("temperature")}
//                           strokeWidth={2}
//                           dot={true}
//                           activeDot={{ r: 8 }}
//                           connectNulls={true}
//                         />
//                         <Line
//                           type="monotone"
//                           dataKey="humidity"
//                           stroke={getColorForColumn("humidity")}
//                           strokeWidth={2}
//                           dot={true}
//                           activeDot={{ r: 8 }}
//                           connectNulls={true}
//                         />
//                         <Line
//                           type="monotone"
//                           dataKey="air_quality"
//                           stroke={getColorForColumn("air_quality")}
//                           strokeWidth={2}
//                           dot={true}
//                           activeDot={{ r: 8 }}
//                           connectNulls={true}
//                         />
//                       </LineChart>
//                     )}
//                   </ResponsiveContainer>
//                 </div>
//               </TabsContent>

//               <TabsContent value="table">
//                 <div className="h-[70vh] overflow-auto border rounded-md">
//                   <Table>
//                     <TableHeader className="sticky top-0 bg-background">
//                       {(chartType === "temperature" || chartType === "default" || chartType === "wind") && (
//                         <TableRow>
//                           <TableHead>Time</TableHead>
//                           {chartType === "temperature" && <TableHead>Temperature (°C)</TableHead>}
//                           {chartType === "wind" && (
//                             <>
//                               <TableHead>Wind Speed (km/h)</TableHead>
//                               <TableHead>Wind Direction (°)</TableHead>
//                             </>
//                           )}
//                           {chartType === "default" && (
//                             <>
//                               <TableHead>Temperature (°C)</TableHead>
//                               <TableHead>Humidity (%)</TableHead>
//                               <TableHead>Air Quality</TableHead>
//                               <TableHead>Wind Speed (km/h)</TableHead>
//                               <TableHead>Pressure (hPa)</TableHead>
//                             </>
//                           )}
//                         </TableRow>
//                       )}
//                       {chartType === "correlation" && (
//                         <TableRow>
//                           <TableHead>Temperature (°C)</TableHead>
//                           <TableHead>Humidity (%)</TableHead>
//                           <TableHead>Air Quality</TableHead>
//                         </TableRow>
//                       )}
//                       {chartType === "distribution" && (
//                         <TableRow>
//                           <TableHead>AQI Category</TableHead>
//                           <TableHead>Count</TableHead>
//                         </TableRow>
//                       )}
//                     </TableHeader>
//                     <TableBody>
//                       {(chartType === "temperature" || chartType === "default" || chartType === "wind") &&
//                         data.map((row, index) => (
//                           <TableRow key={index}>
//                             <TableCell>{row.time}</TableCell>
//                             {chartType === "temperature" && (
//                               <TableCell>{row.temperature !== null ? row.temperature : "N/A"}</TableCell>
//                             )}
//                             {chartType === "wind" && (
//                               <>
//                                 <TableCell>{row.windSpeed !== null ? row.windSpeed : "N/A"}</TableCell>
//                                 <TableCell>{row.windDirection !== null ? row.windDirection : "N/A"}</TableCell>
//                               </>
//                             )}
//                             {chartType === "default" && (
//                               <>
//                                 <TableCell>{row.temperature !== null ? row.temperature : "N/A"}</TableCell>
//                                 <TableCell>{row.humidity !== null ? row.humidity : "N/A"}</TableCell>
//                                 <TableCell>{row.air_quality !== null ? row.air_quality : "N/A"}</TableCell>
//                                 <TableCell>{row.windSpeed !== null ? row.windSpeed : "N/A"}</TableCell>
//                                 <TableCell>{row.pressure !== null ? row.pressure : "N/A"}</TableCell>
//                               </>
//                             )}
//                           </TableRow>
//                         ))}
//                       {chartType === "correlation" &&
//                         correlationData.map((row, index) => (
//                           <TableRow key={index}>
//                             <TableCell>{row.x}</TableCell>
//                             <TableCell>{row.y}</TableCell>
//                             <TableCell>{row.z}</TableCell>
//                           </TableRow>
//                         ))}
//                       {chartType === "distribution" &&
//                         distributionData.map((row, index) => (
//                           <TableRow key={index}>
//                             <TableCell>{row.name}</TableCell>
//                             <TableCell>{row.value}</TableCell>
//                           </TableRow>
//                         ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }





// "use client"

// import { useEffect, useState } from "react"
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Legend,
//   Line,
//   LineChart,
//   ResponsiveContainer,
//   Scatter,
//   ScatterChart,
//   Tooltip,
//   XAxis,
//   YAxis,
//   ZAxis,
// } from "recharts"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Expand, TableIcon, BarChartIcon, RefreshCw, Calendar, Download } from "lucide-react"
// import { Slider } from "@/components/ui/slider"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Checkbox } from "@/components/ui/checkbox"

// interface OverviewProps {
//   chartType?: "default" | "temperature" | "correlation" | "distribution" | "wind"
// }

// interface WeatherData {
//   timestamp: string
//   temperature: number | null
//   humidity: number | null
//   air_quality: number | null
//   wind_speed: number | null
//   wind_direction: number | null
//   precipitation: number | null
//   solar_radiation: number | null
//   pressure: number | null
// }

// interface FormattedWeatherData extends WeatherData {
//   time: string
//   date: string
//   dateObj: Date
//   windSpeed: number | null
//   windDirection: number | null
//   solarRadiation: number | null
//   precipitation: number | null
//   pressure: number | null
//   formattedTimestamp: string
// }

// export function Overview({ chartType = "default" }: OverviewProps) {
//   const [allData, setAllData] = useState<FormattedWeatherData[]>([])
//   const [filteredData, setFilteredData] = useState<FormattedWeatherData[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [fullScreenChart, setFullScreenChart] = useState<boolean>(false)
//   const [error, setError] = useState<string | null>(null)
//   const [timeRange, setTimeRange] = useState<[Date, Date] | null>(null)
//   const [timeRangeType, setTimeRangeType] = useState<"all" | "day" | "week" | "custom">("all")
//   const [dateFilterOpen, setDateFilterOpen] = useState(false)
//   const [visibleColumns, setVisibleColumns] = useState<string[]>([
//     "temperature",
//     "humidity",
//     "air_quality",
//     "windSpeed",
//     "windDirection",
//     "precipitation",
//     "solarRadiation",
//     "pressure",
//   ])

//   // All available columns for selection
//   const allColumns = [
//     { key: "temperature", label: "Temperature (°C)" },
//     { key: "humidity", label: "Humidity (%)" },
//     { key: "air_quality", label: "Air Quality" },
//     { key: "windSpeed", label: "Wind Speed (km/h)" },
//     { key: "windDirection", label: "Wind Direction (°)" },
//     { key: "precipitation", label: "Precipitation (mm)" },
//     { key: "solarRadiation", label: "Solar Radiation (W/m²)" },
//     { key: "pressure", label: "Pressure (hPa)" },
//   ]

//   const fetchData = async () => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       const response = await fetch("/api/cvs-data")

//       if (!response.ok) {
//         throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
//       }

//       // Check if the response is JSON
//       const contentType = response.headers.get("content-type")
//       if (!contentType || !contentType.includes("application/json")) {
//         throw new Error(`Expected JSON response but got ${contentType}`)
//       }

//       const result = await response.json()

//       if (result.error) {
//         throw new Error(`API error: ${result.error}${result.details ? ` - ${result.details}` : ""}`)
//       }

//       if (result.data && Array.isArray(result.data)) {
//         // Format the data for display
//         const formattedData = result.data.map((item: WeatherData) => {
//           let dateObj: Date
//           try {
//             dateObj = new Date(item.timestamp)
//             // Check if date is valid
//             if (isNaN(dateObj.getTime())) {
//               throw new Error("Invalid date")
//             }
//           } catch (e) {
//             // Fallback to current date if timestamp is invalid
//             console.warn(`Invalid timestamp: ${item.timestamp}, using current date as fallback`)
//             dateObj = new Date()
//           }

//           return {
//             ...item,
//             dateObj,
//             // Extract time from timestamp for display
//             time: dateObj.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//             date: dateObj.toLocaleDateString(),
//             // Add a formatted timestamp for chart display
//             formattedTimestamp:
//               dateObj.toLocaleDateString() +
//               " " +
//               dateObj.toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               }),
//             // Ensure all values are properly formatted
//             temperature: item.temperature !== null ? Number(item.temperature) : null,
//             humidity: item.humidity !== null ? Number(item.humidity) : null,
//             air_quality: item.air_quality !== null ? Number(item.air_quality) : null,
//             windSpeed: item.wind_speed !== null ? Number(item.wind_speed) : null,
//             windDirection: item.wind_direction !== null ? Number(item.wind_direction) : null,
//             precipitation: item.precipitation !== null ? Number(item.precipitation) : null,
//             solarRadiation: item.solar_radiation !== null ? Number(item.solar_radiation) : null,
//             pressure: item.pressure !== null ? Number(item.pressure) : null,
//           }
//         })

//         // Sort data by timestamp
//         formattedData.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())

//         setAllData(formattedData)
//         setFilteredData(formattedData)

//         // Set initial time range if we have data
//         if (formattedData.length > 0) {
//           const minDate = formattedData[0].dateObj
//           const maxDate = formattedData[formattedData.length - 1].dateObj
//           setTimeRange([minDate, maxDate])
//         }
//       } else {
//         throw new Error("Invalid data format received from API")
//       }
//     } catch (err) {
//       console.error("Error fetching data:", err)
//       setError(err instanceof Error ? err.message : "Failed to fetch data")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchData()
//   }, [])

//   // Apply time range filter
//   useEffect(() => {
//     if (!allData.length) return

//     let filtered = [...allData]

//     if (timeRangeType === "day") {
//       // Last 24 hours
//       const now = new Date()
//       const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
//       filtered = allData.filter((item) => item.dateObj >= oneDayAgo)
//       // Only set timeRange if it's not already set to avoid infinite loops
//       if (!timeRange || timeRange[0].getTime() !== oneDayAgo.getTime() || timeRange[1].getTime() !== now.getTime()) {
//         setTimeRange([oneDayAgo, now])
//       }
//     } else if (timeRangeType === "week") {
//       // Last 7 days
//       const now = new Date()
//       const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
//       filtered = allData.filter((item) => item.dateObj >= oneWeekAgo)
//       // Only set timeRange if it's not already set to avoid infinite loops
//       if (!timeRange || timeRange[0].getTime() !== oneWeekAgo.getTime() || timeRange[1].getTime() !== now.getTime()) {
//         setTimeRange([oneWeekAgo, now])
//       }
//     } else if (timeRangeType === "custom" && timeRange) {
//       // Custom time range
//       filtered = allData.filter((item) => item.dateObj >= timeRange[0] && item.dateObj <= timeRange[1])
//     } else if (timeRangeType === "all") {
//       // All data
//       if (allData.length > 0) {
//         const minDate = allData[0].dateObj
//         const maxDate = allData[allData.length - 1].dateObj
//         // Only set timeRange if it's not already set to avoid infinite loops
//         if (
//           !timeRange ||
//           timeRange[0].getTime() !== minDate.getTime() ||
//           timeRange[1].getTime() !== maxDate.getTime()
//         ) {
//           setTimeRange([minDate, maxDate])
//         }
//       }
//     }

//     setFilteredData(filtered)
//   }, [allData, timeRange, timeRangeType])

//   // Handle time range selection
//   const handleTimeRangeChange = (type: "all" | "day" | "week" | "custom") => {
//     if (type === timeRangeType) return // Prevent unnecessary updates

//     setTimeRangeType(type)

//     if (type === "all" && allData.length > 0) {
//       const minDate = allData[0].dateObj
//       const maxDate = allData[allData.length - 1].dateObj
//       setTimeRange([minDate, maxDate])
//     } else if (type === "day") {
//       const now = new Date()
//       const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
//       setTimeRange([oneDayAgo, now])
//     } else if (type === "week") {
//       const now = new Date()
//       const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
//       setTimeRange([oneWeekAgo, now])
//     }
//     // For custom, we don't set the time range here - it will be set by the slider
//   }

//   // Format the X-axis tick values
//   const formatXAxis = (value: string, index: number, data: any[]) => {
//     // If we're looking at data spanning multiple days, show date and time
//     if (timeRangeType !== "day" && filteredData.length > 0) {
//       const item = filteredData.find((d) => d.formattedTimestamp === value)
//       if (item) {
//         // For data spanning multiple days, show date and time
//         // But don't show every tick to avoid overcrowding
//         if (index % Math.ceil(filteredData.length / 10) === 0) {
//           return `${item.date} ${item.time}`
//         }
//         return ""
//       }
//     }
//     return value
//   }

//   // Get color for a column
//   const getColorForColumn = (column: string) => {
//     const lowerColumn = column.toLowerCase()
//     if (lowerColumn.includes("temp")) return "#ef4444" // red
//     if (lowerColumn.includes("humid")) return "#3b82f6" // blue
//     if (lowerColumn.includes("wind") && lowerColumn.includes("speed")) return "#64748b" // slate
//     if (lowerColumn.includes("wind") && lowerColumn.includes("direction")) return "#94a3b8" // slate-400
//     if (lowerColumn.includes("solar")) return "#eab308" // yellow
//     if (lowerColumn.includes("air")) return "#10b981" // green
//     if (lowerColumn.includes("precipitation")) return "#60a5fa" // blue-400
//     if (lowerColumn.includes("pressure")) return "#8b5cf6" // purple

//     // Generate a color based on the column name for consistency
//     const hash = column.split("").reduce((acc, char) => {
//       return char.charCodeAt(0) + ((acc << 5) - acc)
//     }, 0)

//     return `hsl(${Math.abs(hash) % 360}, 70%, 50%)`
//   }

//   // Get a friendly display name for a column
//   const getDisplayName = (column: string) => {
//     // Replace underscores with spaces and capitalize each word
//     return column
//       .replace(/_/g, " ")
//       .replace(/([A-Z])/g, " $1")
//       .replace(/^./, (str) => str.toUpperCase())
//       .trim()
//   }

//   // Prepare correlation data
//   const correlationData = filteredData
//     .filter((item) => item.temperature !== null && item.humidity !== null && item.air_quality !== null)
//     .map((item) => ({
//       x: item.temperature,
//       y: item.humidity,
//       z: item.air_quality,
//     }))

//   // Prepare distribution data for air quality
//   const prepareDistributionData = () => {
//     const categories = [
//       { name: "Good (0-50)", min: 0, max: 50 },
//       { name: "Moderate (51-100)", min: 51, max: 100 },
//       { name: "Unhealthy for Sensitive Groups (101-150)", min: 101, max: 150 },
//       { name: "Unhealthy (151-200)", min: 151, max: 200 },
//       { name: "Very Unhealthy (201-300)", min: 201, max: 300 },
//       { name: "Hazardous (301+)", min: 301, max: Number.POSITIVE_INFINITY },
//     ]

//     return categories.map((category) => ({
//       name: category.name,
//       value: filteredData.filter(
//         (d) => d.air_quality !== null && d.air_quality >= category.min && d.air_quality <= category.max,
//       ).length,
//     }))
//   }

//   const distributionData = prepareDistributionData()

//   // Handle custom time range slider
//   const handleSliderChange = (values: number[]) => {
//     if (allData.length === 0 || values.length < 2) return

//     const minIndex = Math.floor((values[0] * (allData.length - 1)) / 100)
//     const maxIndex = Math.floor((values[1] * (allData.length - 1)) / 100)

//     setTimeRange([allData[minIndex].dateObj, allData[maxIndex].dateObj])
//   }

//   // Format date for display
//   const formatDate = (date: Date | null) => {
//     if (!date || isNaN(date.getTime())) {
//       return "Invalid Date"
//     }
//     return date.toLocaleString([], {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   // Toggle column visibility
//   const toggleColumnVisibility = (column: string) => {
//     if (visibleColumns.includes(column)) {
//       setVisibleColumns(visibleColumns.filter((c) => c !== column))
//     } else {
//       setVisibleColumns([...visibleColumns, column])
//     }
//   }

//   // Export data as CSV
//   const exportCSV = () => {
//     if (filteredData.length === 0) return

//     // Create CSV header
//     const headers = [
//       "Date",
//       "Time",
//       "Temperature (°C)",
//       "Humidity (%)",
//       "Air Quality",
//       "Wind Speed (km/h)",
//       "Wind Direction (°)",
//       "Precipitation (mm)",
//       "Solar Radiation (W/m²)",
//       "Pressure (hPa)",
//     ]

//     // Create CSV rows
//     const rows = filteredData.map((row) => [
//       row.date,
//       row.time,
//       row.temperature !== null ? row.temperature : "",
//       row.humidity !== null ? row.humidity : "",
//       row.air_quality !== null ? row.air_quality : "",
//       row.windSpeed !== null ? row.windSpeed : "",
//       row.windDirection !== null ? row.windDirection : "",
//       row.precipitation !== null ? row.precipitation : "",
//       row.solarRadiation !== null ? row.solarRadiation : "",
//       row.pressure !== null ? row.pressure : "",
//     ])

//     // Combine header and rows
//     const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

//     // Create a blob and download
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
//     const url = URL.createObjectURL(blob)
//     const link = document.createElement("a")
//     link.setAttribute("href", url)
//     link.setAttribute("download", `weather_data_${new Date().toISOString().split("T")[0]}.csv`)
//     link.style.visibility = "hidden"
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   if (isLoading) {
//     return <div className="flex items-center justify-center h-80">Loading data...</div>
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-80 gap-4">
//         <div className="text-red-500">Error: {error}</div>
//         <Button onClick={fetchData} variant="outline" size="sm">
//           <RefreshCw className="h-4 w-4 mr-2" />
//           Retry
//         </Button>
//       </div>
//     )
//   }

//   if (allData.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-80 gap-4">
//         <div>No data available. Please check your CSV file.</div>
//         <Button onClick={fetchData} variant="outline" size="sm">
//           <RefreshCw className="h-4 w-4 mr-2" />
//           Retry
//         </Button>
//       </div>
//     )
//   }

//   // Time range filter UI
//   const timeRangeFilter = (
//     <div className="mb-4 flex flex-col space-y-2">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <Label>Time Range:</Label>
//           <Select value={timeRangeType} onValueChange={(value) => handleTimeRangeChange(value as any)}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select time range" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Data</SelectItem>
//               <SelectItem value="day">Last 24 Hours</SelectItem>
//               <SelectItem value="week">Last 7 Days</SelectItem>
//               <SelectItem value="custom">Custom Range</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="flex items-center gap-2">
//           <Popover open={dateFilterOpen && timeRangeType === "custom"} onOpenChange={setDateFilterOpen}>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => timeRangeType === "custom" && setDateFilterOpen(true)}
//                 disabled={timeRangeType !== "custom"}
//               >
//                 <Calendar className="h-4 w-4 mr-2" />
//                 {timeRange ? (
//                   <>
//                     {formatDate(timeRange[0])} - {formatDate(timeRange[1])}
//                   </>
//                 ) : (
//                   "Select Range"
//                 )}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-4" align="end">
//               <div className="space-y-4">
//                 <div className="text-sm font-medium">Adjust Time Range</div>
//                 <div className="pt-4">
//                   <Slider defaultValue={[0, 100]} max={100} step={1} onValueChange={handleSliderChange} />
//                 </div>
//                 <div className="flex justify-between text-xs text-muted-foreground">
//                   <div>{timeRange ? formatDate(timeRange[0]) : "Start"}</div>
//                   <div>{timeRange ? formatDate(timeRange[1]) : "End"}</div>
//                 </div>
//                 <div className="flex justify-end">
//                   <Button size="sm" onClick={() => setDateFilterOpen(false)}>
//                     Apply
//                   </Button>
//                 </div>
//               </div>
//             </PopoverContent>
//           </Popover>

//           <Button variant="outline" size="sm" onClick={exportCSV}>
//             <Download className="h-4 w-4 mr-2" />
//             Export CSV
//           </Button>
//         </div>
//       </div>

//       {timeRange && (
//         <div className="text-xs text-muted-foreground">
//           Showing data from {formatDate(timeRange[0])} to {formatDate(timeRange[1])}
//           {filteredData.length < allData.length && ` (${filteredData.length} of ${allData.length} records)`}
//         </div>
//       )}
//     </div>
//   )

//   // Column selector UI
//   const columnSelector = (
//     <div className="mb-4 border p-3 rounded-md">
//       <div className="font-medium mb-2">Select Columns to Display:</div>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//         {allColumns.map((column) => (
//           <div key={column.key} className="flex items-center space-x-2">
//             <Checkbox
//               id={`column-${column.key}`}
//               checked={visibleColumns.includes(column.key)}
//               onCheckedChange={() => toggleColumnVisibility(column.key)}
//             />
//             <Label htmlFor={`column-${column.key}`} className="text-sm">
//               {column.label}
//             </Label>
//           </div>
//         ))}
//       </div>
//     </div>
//   )

//   // Render different chart types based on the chartType prop
//   const renderChart = () => {
//     switch (chartType) {
//       case "temperature":
//         return (
//           <div className="h-80">
//             {timeRangeFilter}
//             <Tabs defaultValue="chart">
//               <TabsList className="mb-4">
//                 <TabsTrigger value="chart">
//                   <BarChartIcon className="h-4 w-4 mr-2" />
//                   Chart
//                 </TabsTrigger>
//                 <TabsTrigger value="table">
//                   <TableIcon className="h-4 w-4 mr-2" />
//                   Table
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="chart">
//                 <div className="relative h-80">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="absolute top-0 right-0 z-10"
//                     onClick={() => setFullScreenChart(true)}
//                   >
//                     <Expand className="h-4 w-4" />
//                   </Button>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={filteredData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis
//                         dataKey="formattedTimestamp"
//                         angle={-45}
//                         textAnchor="end"
//                         height={60}
//                         interval="preserveStartEnd"
//                         tick={{ fontSize: 10 }}
//                       />
//                       <YAxis />
//                       <Tooltip
//                         labelFormatter={(label) => {
//                           const item = filteredData.find((d) => d.formattedTimestamp === label)
//                           return item ? `${item.date} ${item.time}` : label
//                         }}
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="temperature"
//                         stroke={getColorForColumn("temperature")}
//                         strokeWidth={2}
//                         dot={false}
//                         activeDot={{ r: 6 }}
//                         connectNulls={true}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </TabsContent>

//               <TabsContent value="table">
//                 <div className="max-h-80 overflow-auto border rounded-md">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Date</TableHead>
//                         <TableHead>Time</TableHead>
//                         <TableHead>Temperature (°C)</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {filteredData.map((row, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{row.date}</TableCell>
//                           <TableCell>{row.time}</TableCell>
//                           <TableCell>{row.temperature !== null ? row.temperature : "N/A"}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         )

//       case "correlation":
//         return (
//           <div className="h-80">
//             {timeRangeFilter}
//             <Tabs defaultValue="chart">
//               <TabsList className="mb-4">
//                 <TabsTrigger value="chart">
//                   <BarChartIcon className="h-4 w-4 mr-2" />
//                   Chart
//                 </TabsTrigger>
//                 <TabsTrigger value="table">
//                   <TableIcon className="h-4 w-4 mr-2" />
//                   Table
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="chart">
//                 <div className="relative h-80">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="absolute top-0 right-0 z-10"
//                     onClick={() => setFullScreenChart(true)}
//                   >
//                     <Expand className="h-4 w-4" />
//                   </Button>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <ScatterChart>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis
//                         type="number"
//                         dataKey="x"
//                         name="Temperature"
//                         unit="°C"
//                         domain={["dataMin - 1", "dataMax + 1"]}
//                       />
//                       <YAxis
//                         type="number"
//                         dataKey="y"
//                         name="Humidity"
//                         unit="%"
//                         domain={["dataMin - 5", "dataMax + 5"]}
//                       />
//                       <ZAxis type="number" dataKey="z" range={[60, 400]} name="Air Quality" />
//                       <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value, name) => [value, name]} />
//                       <Scatter
//                         name="Temperature vs Humidity"
//                         data={correlationData}
//                         fill={getColorForColumn("temperature")}
//                       />
//                     </ScatterChart>
//                   </ResponsiveContainer>
//                 </div>
//               </TabsContent>

//               <TabsContent value="table">
//                 <div className="max-h-80 overflow-auto border rounded-md">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Temperature (°C)</TableHead>
//                         <TableHead>Humidity (%)</TableHead>
//                         <TableHead>Air Quality</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {correlationData.map((row, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{row.x}</TableCell>
//                           <TableCell>{row.y}</TableCell>
//                           <TableCell>{row.z}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         )

//       case "distribution":
//         return (
//           <div className="h-80">
//             {timeRangeFilter}
//             <Tabs defaultValue="chart">
//               <TabsList className="mb-4">
//                 <TabsTrigger value="chart">
//                   <BarChartIcon className="h-4 w-4 mr-2" />
//                   Chart
//                 </TabsTrigger>
//                 <TabsTrigger value="table">
//                   <TableIcon className="h-4 w-4 mr-2" />
//                   Table
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="chart">
//                 <div className="relative h-80">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="absolute top-0 right-0 z-10"
//                     onClick={() => setFullScreenChart(true)}
//                   >
//                     <Expand className="h-4 w-4" />
//                   </Button>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={distributionData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip />
//                       <Bar dataKey="value" fill={getColorForColumn("airQuality")} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </TabsContent>

//               <TabsContent value="table">
//                 <div className="max-h-80 overflow-auto border rounded-md">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>AQI Category</TableHead>
//                         <TableHead>Count</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {distributionData.map((row, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{row.name}</TableCell>
//                           <TableCell>{row.value}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         )

//       case "wind":
//         return (
//           <div className="h-80">
//             {timeRangeFilter}
//             <Tabs defaultValue="chart">
//               <TabsList className="mb-4">
//                 <TabsTrigger value="chart">
//                   <BarChartIcon className="h-4 w-4 mr-2" />
//                   Chart
//                 </TabsTrigger>
//                 <TabsTrigger value="table">
//                   <TableIcon className="h-4 w-4 mr-2" />
//                   Table
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="chart">
//                 <div className="relative h-80">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="absolute top-0 right-0 z-10"
//                     onClick={() => setFullScreenChart(true)}
//                   >
//                     <Expand className="h-4 w-4" />
//                   </Button>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={filteredData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis
//                         dataKey="formattedTimestamp"
//                         angle={-45}
//                         textAnchor="end"
//                         height={60}
//                         interval="preserveStartEnd"
//                         tick={{ fontSize: 10 }}
//                       />
//                       <YAxis />
//                       <Tooltip
//                         labelFormatter={(label) => {
//                           const item = filteredData.find((d) => d.formattedTimestamp === label)
//                           return item ? `${item.date} ${item.time}` : label
//                         }}
//                       />
//                       <Legend />
//                       <Line
//                         type="monotone"
//                         dataKey="windSpeed"
//                         stroke={getColorForColumn("windSpeed")}
//                         strokeWidth={2}
//                         dot={false}
//                         activeDot={{ r: 6 }}
//                         connectNulls={true}
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="windDirection"
//                         stroke={getColorForColumn("windDirection")}
//                         strokeWidth={2}
//                         dot={false}
//                         activeDot={{ r: 6 }}
//                         connectNulls={true}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </TabsContent>

//               <TabsContent value="table">
//                 <div className="max-h-80 overflow-auto border rounded-md">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Date</TableHead>
//                         <TableHead>Time</TableHead>
//                         <TableHead>Wind Speed (km/h)</TableHead>
//                         <TableHead>Wind Direction (°)</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {filteredData.map((row, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{row.date}</TableCell>
//                           <TableCell>{row.time}</TableCell>
//                           <TableCell>{row.windSpeed !== null ? row.windSpeed : "N/A"}</TableCell>
//                           <TableCell>{row.windDirection !== null ? row.windDirection : "N/A"}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         )

//       default:
//         return (
//           <div className="h-80">
//             {timeRangeFilter}
//             {columnSelector}
//             <Tabs defaultValue="chart">
//               <TabsList className="mb-4">
//                 <TabsTrigger value="chart">
//                   <BarChartIcon className="h-4 w-4 mr-2" />
//                   Chart
//                 </TabsTrigger>
//                 <TabsTrigger value="table">
//                   <TableIcon className="h-4 w-4 mr-2" />
//                   Table
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="chart">
//                 <div className="relative h-80">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="absolute top-0 right-0 z-10"
//                     onClick={() => setFullScreenChart(true)}
//                   >
//                     <Expand className="h-4 w-4" />
//                   </Button>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={filteredData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis
//                         dataKey="formattedTimestamp"
//                         angle={-45}
//                         textAnchor="end"
//                         height={60}
//                         interval="preserveStartEnd"
//                         tick={{ fontSize: 10 }}
//                       />
//                       <YAxis />
//                       <Tooltip
//                         labelFormatter={(label) => {
//                           const item = filteredData.find((d) => d.formattedTimestamp === label)
//                           return item ? `${item.date} ${item.time}` : label
//                         }}
//                       />
//                       <Legend />
//                       {visibleColumns.includes("temperature") && (
//                         <Line
//                           type="monotone"
//                           dataKey="temperature"
//                           name="Temperature (°C)"
//                           stroke={getColorForColumn("temperature")}
//                           strokeWidth={2}
//                           dot={false}
//                           activeDot={{ r: 6 }}
//                           connectNulls={true}
//                         />
//                       )}
//                       {visibleColumns.includes("humidity") && (
//                         <Line
//                           type="monotone"
//                           dataKey="humidity"
//                           name="Humidity (%)"
//                           stroke={getColorForColumn("humidity")}
//                           strokeWidth={2}
//                           dot={false}
//                           activeDot={{ r: 6 }}
//                           connectNulls={true}
//                         />
//                       )}
//                       {visibleColumns.includes("air_quality") && (
//                         <Line
//                           type="monotone"
//                           dataKey="air_quality"
//                           name="Air Quality"
//                           stroke={getColorForColumn("air_quality")}
//                           strokeWidth={2}
//                           dot={false}
//                           activeDot={{ r: 6 }}
//                           connectNulls={true}
//                         />
//                       )}
//                       {visibleColumns.includes("windSpeed") && (
//                         <Line
//                           type="monotone"
//                           dataKey="windSpeed"
//                           name="Wind Speed (km/h)"
//                           stroke={getColorForColumn("windSpeed")}
//                           strokeWidth={2}
//                           dot={false}
//                           activeDot={{ r: 6 }}
//                           connectNulls={true}
//                         />
//                       )}
//                       {visibleColumns.includes("windDirection") && (
//                         <Line
//                           type="monotone"
//                           dataKey="windDirection"
//                           name="Wind Direction (°)"
//                           stroke={getColorForColumn("windDirection")}
//                           strokeWidth={2}
//                           dot={false}
//                           activeDot={{ r: 6 }}
//                           connectNulls={true}
//                         />
//                       )}
//                       {visibleColumns.includes("precipitation") && (
//                         <Line
//                           type="monotone"
//                           dataKey="precipitation"
//                           name="Precipitation (mm)"
//                           stroke={getColorForColumn("precipitation")}
//                           strokeWidth={2}
//                           dot={false}
//                           activeDot={{ r: 6 }}
//                           connectNulls={true}
//                         />
//                       )}
//                       {visibleColumns.includes("solarRadiation") && (
//                         <Line
//                           type="monotone"
//                           dataKey="solarRadiation"
//                           name="Solar Radiation (W/m²)"
//                           stroke={getColorForColumn("solarRadiation")}
//                           strokeWidth={2}
//                           dot={false}
//                           activeDot={{ r: 6 }}
//                           connectNulls={true}
//                         />
//                       )}
//                       {visibleColumns.includes("pressure") && (
//                         <Line
//                           type="monotone"
//                           dataKey="pressure"
//                           name="Pressure (hPa)"
//                           stroke={getColorForColumn("pressure")}
//                           strokeWidth={2}
//                           dot={false}
//                           activeDot={{ r: 6 }}
//                           connectNulls={true}
//                         />
//                       )}
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </TabsContent>

//               <TabsContent value="table">
//                 <div className="max-h-80 overflow-auto border rounded-md">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Date</TableHead>
//                         <TableHead>Time</TableHead>
//                         <TableHead>Temperature (°C)</TableHead>
//                         <TableHead>Humidity (%)</TableHead>
//                         <TableHead>Air Quality</TableHead>
//                         <TableHead>Wind Speed (km/h)</TableHead>
//                         <TableHead>Wind Direction (°)</TableHead>
//                         <TableHead>Precipitation (mm)</TableHead>
//                         <TableHead>Solar Radiation (W/m²)</TableHead>
//                         <TableHead>Pressure (hPa)</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {filteredData.map((row, index) => (
//                         <TableRow key={index}>
//                           <TableCell>{row.date}</TableCell>
//                           <TableCell>{row.time}</TableCell>
//                           <TableCell>{row.temperature !== null ? row.temperature : "N/A"}</TableCell>
//                           <TableCell>{row.humidity !== null ? row.humidity : "N/A"}</TableCell>
//                           <TableCell>{row.air_quality !== null ? row.air_quality : "N/A"}</TableCell>
//                           <TableCell>{row.windSpeed !== null ? row.windSpeed : "N/A"}</TableCell>
//                           <TableCell>{row.windDirection !== null ? row.windDirection : "N/A"}</TableCell>
//                           <TableCell>{row.precipitation !== null ? row.precipitation : "N/A"}</TableCell>
//                           <TableCell>{row.solarRadiation !== null ? row.solarRadiation : "N/A"}</TableCell>
//                           <TableCell>{row.pressure !== null ? row.pressure : "N/A"}</TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         )
//     }
//   }

//   return (
//     <>
//       {renderChart()}

//       {/* Full Screen Chart Dialog */}
//       <Dialog open={fullScreenChart} onOpenChange={setFullScreenChart}>
//         <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh]">
//           <DialogHeader>
//             <DialogTitle>
//               {chartType === "temperature" && "Temperature Trends"}
//               {chartType === "correlation" && "Humidity vs Temperature"}
//               {chartType === "distribution" && "Air Quality Distribution"}
//               {chartType === "wind" && "Wind Speed and Direction"}
//               {chartType === "default" && "Environmental Metrics Overview"}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="h-[70vh]">
//             {timeRangeFilter}
//             {chartType === "default" && columnSelector}
//             <Tabs defaultValue="chart">
//               <TabsList className="mb-4">
//                 <TabsTrigger value="chart">
//                   <BarChartIcon className="h-4 w-4 mr-2" />
//                   Chart
//                 </TabsTrigger>
//                 <TabsTrigger value="table">
//                   <TableIcon className="h-4 w-4 mr-2" />
//                   Table
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="chart">
//                 <div className="h-[60vh]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     {chartType === "temperature" && (
//                       <LineChart data={filteredData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                           dataKey="formattedTimestamp"
//                           angle={-45}
//                           textAnchor="end"
//                           height={60}
//                           interval="preserveStartEnd"
//                           tick={{ fontSize: 10 }}
//                         />
//                         <YAxis />
//                         <Tooltip
//                           labelFormatter={(label) => {
//                             const item = filteredData.find((d) => d.formattedTimestamp === label)
//                             return item ? `${item.date} ${item.time}` : label
//                           }}
//                         />
//                         <Legend />
//                         <Line
//                           type="monotone"
//                           dataKey="temperature"
//                           name="Temperature (°C)"
//                           stroke={getColorForColumn("temperature")}
//                           strokeWidth={2}
//                           dot={true}
//                           activeDot={{ r: 8 }}
//                           connectNulls={true}
//                         />
//                       </LineChart>
//                     )}
//                     {chartType === "correlation" && (
//                       <ScatterChart>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                           type="number"
//                           dataKey="x"
//                           name="Temperature"
//                           unit="°C"
//                           domain={["dataMin - 1", "dataMax + 1"]}
//                         />
//                         <YAxis
//                           type="number"
//                           dataKey="y"
//                           name="Humidity"
//                           unit="%"
//                           domain={["dataMin - 5", "dataMax + 5"]}
//                         />
//                         <ZAxis type="number" dataKey="z" range={[60, 400]} name="Air Quality" />
//                         <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value, name) => [value, name]} />
//                         <Legend />
//                         <Scatter
//                           name="Temperature vs Humidity"
//                           data={correlationData}
//                           fill={getColorForColumn("temperature")}
//                         />
//                       </ScatterChart>
//                     )}
//                     {chartType === "distribution" && (
//                       <BarChart data={distributionData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Bar dataKey="value" name="Count" fill={getColorForColumn("airQuality")} />
//                       </BarChart>
//                     )}
//                     {chartType === "wind" && (
//                       <LineChart data={filteredData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                           dataKey="formattedTimestamp"
//                           angle={-45}
//                           textAnchor="end"
//                           height={60}
//                           interval="preserveStartEnd"
//                           tick={{ fontSize: 10 }}
//                         />
//                         <YAxis />
//                         <Tooltip
//                           labelFormatter={(label) => {
//                             const item = filteredData.find((d) => d.formattedTimestamp === label)
//                             return item ? `${item.date} ${item.time}` : label
//                           }}
//                         />
//                         <Legend />
//                         <Line
//                           type="monotone"
//                           dataKey="windSpeed"
//                           name="Wind Speed (km/h)"
//                           stroke={getColorForColumn("windSpeed")}
//                           strokeWidth={2}
//                           dot={true}
//                           activeDot={{ r: 8 }}
//                           connectNulls={true}
//                         />
//                         <Line
//                           type="monotone"
//                           dataKey="windDirection"
//                           name="Wind Direction (°)"
//                           stroke={getColorForColumn("windDirection")}
//                           strokeWidth={2}
//                           dot={true}
//                           activeDot={{ r: 8 }}
//                           connectNulls={true}
//                         />
//                       </LineChart>
//                     )}
//                     {chartType === "default" && (
//                       <LineChart data={filteredData}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                           dataKey="formattedTimestamp"
//                           angle={-45}
//                           textAnchor="end"
//                           height={60}
//                           interval="preserveStartEnd"
//                           tick={{ fontSize: 10 }}
//                         />
//                         <YAxis />
//                         <Tooltip
//                           labelFormatter={(label) => {
//                             const item = filteredData.find((d) => d.formattedTimestamp === label)
//                             return item ? `${item.date} ${item.time}` : label
//                           }}
//                         />
//                         <Legend />
//                         {visibleColumns.includes("temperature") && (
//                           <Line
//                             type="monotone"
//                             dataKey="temperature"
//                             name="Temperature (°C)"
//                             stroke={getColorForColumn("temperature")}
//                             strokeWidth={2}
//                             dot={true}
//                             activeDot={{ r: 8 }}
//                             connectNulls={true}
//                           />
//                         )}
//                         {visibleColumns.includes("humidity") && (
//                           <Line
//                             type="monotone"
//                             dataKey="humidity"
//                             name="Humidity (%)"
//                             stroke={getColorForColumn("humidity")}
//                             strokeWidth={2}
//                             dot={true}
//                             activeDot={{ r: 8 }}
//                             connectNulls={true}
//                           />
//                         )}
//                         {visibleColumns.includes("air_quality") && (
//                           <Line
//                             type="monotone"
//                             dataKey="air_quality"
//                             name="Air Quality"
//                             stroke={getColorForColumn("air_quality")}
//                             strokeWidth={2}
//                             dot={true}
//                             activeDot={{ r: 8 }}
//                             connectNulls={true}
//                           />
//                         )}
//                         {visibleColumns.includes("windSpeed") && (
//                           <Line
//                             type="monotone"
//                             dataKey="windSpeed"
//                             name="Wind Speed (km/h)"
//                             stroke={getColorForColumn("windSpeed")}
//                             strokeWidth={2}
//                             dot={true}
//                             activeDot={{ r: 8 }}
//                             connectNulls={true}
//                           />
//                         )}
//                         {visibleColumns.includes("windDirection") && (
//                           <Line
//                             type="monotone"
//                             dataKey="windDirection"
//                             name="Wind Direction (°)"
//                             stroke={getColorForColumn("windDirection")}
//                             strokeWidth={2}
//                             dot={true}
//                             activeDot={{ r: 8 }}
//                             connectNulls={true}
//                           />
//                         )}
//                         {visibleColumns.includes("precipitation") && (
//                           <Line
//                             type="monotone"
//                             dataKey="precipitation"
//                             name="Precipitation (mm)"
//                             stroke={getColorForColumn("precipitation")}
//                             strokeWidth={2}
//                             dot={true}
//                             activeDot={{ r: 8 }}
//                             connectNulls={true}
//                           />
//                         )}
//                         {visibleColumns.includes("solarRadiation") && (
//                           <Line
//                             type="monotone"
//                             dataKey="solarRadiation"
//                             name="Solar Radiation (W/m²)"
//                             stroke={getColorForColumn("solarRadiation")}
//                             strokeWidth={2}
//                             dot={true}
//                             activeDot={{ r: 8 }}
//                             connectNulls={true}
//                           />
//                         )}
//                         {visibleColumns.includes("pressure") && (
//                           <Line
//                             type="monotone"
//                             dataKey="pressure"
//                             name="Pressure (hPa)"
//                             stroke={getColorForColumn("pressure")}
//                             strokeWidth={2}
//                             dot={true}
//                             activeDot={{ r: 8 }}
//                             connectNulls={true}
//                           />
//                         )}
//                       </LineChart>
//                     )}
//                   </ResponsiveContainer>
//                 </div>
//               </TabsContent>

//               <TabsContent value="table">
//                 <div className="h-[60vh] overflow-auto border rounded-md">
//                   <Table>
//                     <TableHeader className="sticky top-0 bg-background">
//                       {(chartType === "temperature" || chartType === "default" || chartType === "wind") && (
//                         <TableRow>
//                           <TableHead>Date</TableHead>
//                           <TableHead>Time</TableHead>
//                           {chartType === "temperature" && <TableHead>Temperature (°C)</TableHead>}
//                           {chartType === "wind" && (
//                             <>
//                               <TableHead>Wind Speed (km/h)</TableHead>
//                               <TableHead>Wind Direction (°)</TableHead>
//                             </>
//                           )}
//                           {chartType === "default" && (
//                             <>
//                               <TableHead>Temperature (°C)</TableHead>
//                               <TableHead>Humidity (%)</TableHead>
//                               <TableHead>Air Quality</TableHead>
//                               <TableHead>Wind Speed (km/h)</TableHead>
//                               <TableHead>Wind Direction (°)</TableHead>
//                               <TableHead>Precipitation (mm)</TableHead>
//                               <TableHead>Solar Radiation (W/m²)</TableHead>
//                               <TableHead>Pressure (hPa)</TableHead>
//                             </>
//                           )}
//                         </TableRow>
//                       )}
//                       {chartType === "correlation" && (
//                         <TableRow>
//                           <TableHead>Temperature (°C)</TableHead>
//                           <TableHead>Humidity (%)</TableHead>
//                           <TableHead>Air Quality</TableHead>
//                         </TableRow>
//                       )}
//                       {chartType === "distribution" && (
//                         <TableRow>
//                           <TableHead>AQI Category</TableHead>
//                           <TableHead>Count</TableHead>
//                         </TableRow>
//                       )}
//                     </TableHeader>
//                     <TableBody>
//                       {(chartType === "temperature" || chartType === "default" || chartType === "wind") &&
//                         filteredData.map((row, index) => (
//                           <TableRow key={index}>
//                             <TableCell>{row.date}</TableCell>
//                             <TableCell>{row.time}</TableCell>
//                             {chartType === "temperature" && (
//                               <TableCell>{row.temperature !== null ? row.temperature : "N/A"}</TableCell>
//                             )}
//                             {chartType === "wind" && (
//                               <>
//                                 <TableCell>{row.windSpeed !== null ? row.windSpeed : "N/A"}</TableCell>
//                                 <TableCell>{row.windDirection !== null ? row.windDirection : "N/A"}</TableCell>
//                               </>
//                             )}
//                             {chartType === "default" && (
//                               <>
//                                 <TableCell>{row.temperature !== null ? row.temperature : "N/A"}</TableCell>
//                                 <TableCell>{row.humidity !== null ? row.humidity : "N/A"}</TableCell>
//                                 <TableCell>{row.air_quality !== null ? row.air_quality : "N/A"}</TableCell>
//                                 <TableCell>{row.windSpeed !== null ? row.windSpeed : "N/A"}</TableCell>
//                                 <TableCell>{row.windDirection !== null ? row.windDirection : "N/A"}</TableCell>
//                                 <TableCell>{row.precipitation !== null ? row.precipitation : "N/A"}</TableCell>
//                                 <TableCell>{row.solarRadiation !== null ? row.solarRadiation : "N/A"}</TableCell>
//                                 <TableCell>{row.pressure !== null ? row.pressure : "N/A"}</TableCell>
//                               </>
//                             )}
//                           </TableRow>
//                         ))}
//                       {chartType === "correlation" &&
//                         correlationData.map((row, index) => (
//                           <TableRow key={index}>
//                             <TableCell>{row.x}</TableCell>
//                             <TableCell>{row.y}</TableCell>
//                             <TableCell>{row.z}</TableCell>
//                           </TableRow>
//                         ))}
//                       {chartType === "distribution" &&
//                         distributionData.map((row, index) => (
//                           <TableRow key={index}>
//                             <TableCell>{row.name}</TableCell>
//                             <TableCell>{row.value}</TableCell>
//                           </TableRow>
//                         ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }

















"use client"

import { useEffect, useState, useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Expand,
  TableIcon,
  BarChartIcon,
  RefreshCw,
  Calendar,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"

interface OverviewProps {
  chartType?: "default" | "temperature" | "correlation" | "distribution" | "wind"
}

interface WeatherData {
  timestamp: string
  temperature: number | null
  humidity: number | null
  air_quality: number | null
  wind_speed: number | null
  wind_direction: number | null
  precipitation: number | null
  solar_radiation: number | null
  pressure: number | null
}

interface FormattedWeatherData extends WeatherData {
  time: string
  date: string
  dateObj: Date
  windSpeed: number | null
  windDirection: number | null
  solarRadiation: number | null
  precipitation: number | null
  pressure: number | null
  formattedTimestamp: string
}

interface DataStats {
  min: number | null
  max: number | null
  avg: number | null
  count: number
}

type ChartViewType = "line" | "area" | "bar" | "composed"
type SortDirection = "asc" | "desc" | null

export function Overview({ chartType = "default" }: OverviewProps) {
  const [allData, setAllData] = useState<FormattedWeatherData[]>([])
  const [filteredData, setFilteredData] = useState<FormattedWeatherData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fullScreenChart, setFullScreenChart] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<[Date, Date] | null>(null)
  const [timeRangeType, setTimeRangeType] = useState<"all" | "day" | "week" | "month" | "custom">("all")
  const [dateFilterOpen, setDateFilterOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "temperature",
    "humidity",
    "air_quality",
    "windSpeed",
    "windDirection",
    "precipitation",
    "solarRadiation",
    "pressure",
  ])
  const [chartView, setChartView] = useState<ChartViewType>("line")
  const [showGridLines, setShowGridLines] = useState(true)
  const [showDataPoints, setShowDataPoints] = useState(false)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [smoothData, setSmoothData] = useState(false)
  const [smoothingWindow, setSmoothingWindow] = useState(5)
  const [infoDialogOpen, setInfoDialogOpen] = useState(false)

  // All available columns for selection
  const allColumns = [
    { key: "temperature", label: "Temperature (°C)" },
    { key: "humidity", label: "Humidity (%)" },
    { key: "air_quality", label: "Air Quality" },
    { key: "windSpeed", label: "Wind Speed (km/h)" },
    { key: "windDirection", label: "Wind Direction (°)" },
    { key: "precipitation", label: "Precipitation (mm)" },
    { key: "solarRadiation", label: "Solar Radiation (W/m²)" },
    { key: "pressure", label: "Pressure (hPa)" },
  ]

  // Calculate statistics for each metric
  const dataStats = useMemo(() => {
    const stats: Record<string, DataStats> = {}

    allColumns.forEach((column) => {
      const values = filteredData
        .map((item) => item[column.key as keyof FormattedWeatherData] as number | null)
        .filter((val): val is number => val !== null && !isNaN(val))

      if (values.length > 0) {
        stats[column.key] = {
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((sum, val) => sum + val, 0) / values.length,
          count: values.length,
        }
      } else {
        stats[column.key] = { min: null, max: null, avg: null, count: 0 }
      }
    })

    return stats
  }, [filteredData, allColumns])

  // Apply smoothing to data if enabled
  const displayData = useMemo(() => {
    if (!smoothData || filteredData.length === 0) return filteredData

    const smoothed = [...filteredData]

    // Apply moving average to each numeric column
    allColumns.forEach((column) => {
      const key = column.key as keyof FormattedWeatherData

      // Create array of values for this column
      const values = filteredData.map((item) => item[key] as number | null)

      // Apply moving average
      for (let i = 0; i < values.length; i++) {
        let windowSum = 0
        let windowCount = 0

        // Look at window centered on current point
        const halfWindow = Math.floor(smoothingWindow / 2)
        for (let j = Math.max(0, i - halfWindow); j <= Math.min(values.length - 1, i + halfWindow); j++) {
          if (values[j] !== null && !isNaN(values[j] as number)) {
            windowSum += values[j] as number
            windowCount++
          }
        }

        // Update the value if we have data points in the window
        if (windowCount > 0) {
          smoothed[i] = {
            ...smoothed[i],
            [key]: windowSum / windowCount,
          }
        }
      }
    })

    return smoothed
  }, [filteredData, smoothData, smoothingWindow, allColumns])

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/cvs-data")

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
      }

      // Check if the response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Expected JSON response but got ${contentType}`)
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(`API error: ${result.error}${result.details ? ` - ${result.details}` : ""}`)
      }

      if (result.data && Array.isArray(result.data)) {
        // Format the data for display
        const formattedData = result.data.map((item: WeatherData) => {
          let dateObj: Date
          try {
            dateObj = new Date(item.timestamp)
            // Check if date is valid
            if (isNaN(dateObj.getTime())) {
              throw new Error("Invalid date")
            }
          } catch (e) {
            // Fallback to current date if timestamp is invalid
            console.warn(`Invalid timestamp: ${item.timestamp}, using current date as fallback`)
            dateObj = new Date()
          }

          return {
            ...item,
            dateObj,
            // Extract time from timestamp for display
            time: dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            date: dateObj.toLocaleDateString(),
            // Add a formatted timestamp for chart display
            formattedTimestamp:
              dateObj.toLocaleDateString() +
              " " +
              dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            // Ensure all values are properly formatted
            temperature: item.temperature !== null ? Number(item.temperature) : null,
            humidity: item.humidity !== null ? Number(item.humidity) : null,
            air_quality: item.air_quality !== null ? Number(item.air_quality) : null,
            windSpeed: item.wind_speed !== null ? Number(item.wind_speed) : null,
            windDirection: item.wind_direction !== null ? Number(item.wind_direction) : null,
            precipitation: item.precipitation !== null ? Number(item.precipitation) : null,
            solarRadiation: item.solar_radiation !== null ? Number(item.solar_radiation) : null,
            pressure: item.pressure !== null ? Number(item.pressure) : null,
          }
        })

        // Sort data by timestamp
        formattedData.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())

        setAllData(formattedData)
        setFilteredData(formattedData)

        // Set initial time range if we have data
        if (formattedData.length > 0) {
          const minDate = formattedData[0].dateObj
          const maxDate = formattedData[formattedData.length - 1].dateObj
          setTimeRange([minDate, maxDate])
        }
      } else {
        throw new Error("Invalid data format received from API")
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Apply time range filter
  useEffect(() => {
    if (!allData.length) return

    let filtered = [...allData]

    if (timeRangeType === "day") {
      // Last 24 hours
      const now = new Date()
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      filtered = allData.filter((item) => item.dateObj >= oneDayAgo)
      // Only set timeRange if it's not already set to avoid infinite loops
      if (!timeRange || timeRange[0].getTime() !== oneDayAgo.getTime() || timeRange[1].getTime() !== now.getTime()) {
        setTimeRange([oneDayAgo, now])
      }
    } else if (timeRangeType === "week") {
      // Last 7 days
      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = allData.filter((item) => item.dateObj >= oneWeekAgo)
      // Only set timeRange if it's not already set to avoid infinite loops
      if (!timeRange || timeRange[0].getTime() !== oneWeekAgo.getTime() || timeRange[1].getTime() !== now.getTime()) {
        setTimeRange([oneWeekAgo, now])
      }
    } else if (timeRangeType === "month") {
      // Last 30 days
      const now = new Date()
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filtered = allData.filter((item) => item.dateObj >= oneMonthAgo)
      // Only set timeRange if it's not already set to avoid infinite loops
      if (!timeRange || timeRange[0].getTime() !== oneMonthAgo.getTime() || timeRange[1].getTime() !== now.getTime()) {
        setTimeRange([oneMonthAgo, now])
      }
    } else if (timeRangeType === "custom" && timeRange) {
      // Custom time range
      filtered = allData.filter((item) => item.dateObj >= timeRange[0] && item.dateObj <= timeRange[1])
    } else if (timeRangeType === "all") {
      // All data
      if (allData.length > 0) {
        const minDate = allData[0].dateObj
        const maxDate = allData[allData.length - 1].dateObj
        // Only set timeRange if it's not already set to avoid infinite loops
        if (
          !timeRange ||
          timeRange[0].getTime() !== minDate.getTime() ||
          timeRange[1].getTime() !== maxDate.getTime()
        ) {
          setTimeRange([minDate, maxDate])
        }
      }
    }

    // Apply sorting if needed
    if (sortColumn && sortDirection) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn as keyof FormattedWeatherData]
        const bValue = b[sortColumn as keyof FormattedWeatherData]

        // Handle null values
        if (aValue === null && bValue === null) return 0
        if (aValue === null) return sortDirection === "asc" ? -1 : 1
        if (bValue === null) return sortDirection === "asc" ? 1 : -1

        // Sort numbers or strings
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue
        }

        // Convert to string for comparison
        const aStr = String(aValue)
        const bStr = String(bValue)
        return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
      })
    }

    setFilteredData(filtered)
  }, [allData, timeRange, timeRangeType, sortColumn, sortDirection])

  // Handle time range selection
  const handleTimeRangeChange = (type: "all" | "day" | "week" | "month" | "custom") => {
    if (type === timeRangeType) return // Prevent unnecessary updates

    setTimeRangeType(type)

    if (type === "all" && allData.length > 0) {
      const minDate = allData[0].dateObj
      const maxDate = allData[allData.length - 1].dateObj
      setTimeRange([minDate, maxDate])
    } else if (type === "day") {
      const now = new Date()
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      setTimeRange([oneDayAgo, now])
    } else if (type === "week") {
      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      setTimeRange([oneWeekAgo, now])
    } else if (type === "month") {
      const now = new Date()
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      setTimeRange([oneMonthAgo, now])
    }
    // For custom, we don't set the time range here - it will be set by the slider
  }

  // Format the X-axis tick values
  const formatXAxis = (value: string, index: number, data: any[]) => {
    // If we're looking at data spanning multiple days, show date and time
    if (timeRangeType !== "day" && filteredData.length > 0) {
      const item = filteredData.find((d) => d.formattedTimestamp === value)
      if (item) {
        // For data spanning multiple days, show date and time
        // But don't show every tick to avoid overcrowding
        if (index % Math.ceil(filteredData.length / 10) === 0) {
          return `${item.date} ${item.time}`
        }
        return ""
      }
    }
    return value
  }

  // Get color for a column
  const getColorForColumn = (column: string) => {
    const lowerColumn = column.toLowerCase()
    if (lowerColumn.includes("temp")) return "#ef4444" // red
    if (lowerColumn.includes("humid")) return "#3b82f6" // blue
    if (lowerColumn.includes("wind") && lowerColumn.includes("speed")) return "#64748b" // slate
    if (lowerColumn.includes("wind") && lowerColumn.includes("direction")) return "#94a3b8" // slate-400
    if (lowerColumn.includes("solar")) return "#eab308" // yellow
    if (lowerColumn.includes("air")) return "#10b981" // green
    if (lowerColumn.includes("precipitation")) return "#60a5fa" // blue-400
    if (lowerColumn.includes("pressure")) return "#8b5cf6" // purple

    // Generate a color based on the column name for consistency
    const hash = column.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc)
    }, 0)

    return `hsl(${Math.abs(hash) % 360}, 70%, 50%)`
  }

  // Get a friendly display name for a column
  const getDisplayName = (column: string) => {
    // Replace underscores with spaces and capitalize each word
    return column
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  // Prepare correlation data
  const correlationData = filteredData
    .filter((item) => item.temperature !== null && item.humidity !== null && item.air_quality !== null)
    .map((item) => ({
      x: item.temperature,
      y: item.humidity,
      z: item.air_quality,
    }))

  // Prepare distribution data for air quality
  const prepareDistributionData = () => {
    const categories = [
      { name: "Good (0-50)", min: 0, max: 50 },
      { name: "Moderate (51-100)", min: 51, max: 100 },
      { name: "Unhealthy for Sensitive Groups (101-150)", min: 101, max: 150 },
      { name: "Unhealthy (151-200)", min: 151, max: 200 },
      { name: "Very Unhealthy (201-300)", min: 201, max: 300 },
      { name: "Hazardous (301+)", min: 301, max: Number.POSITIVE_INFINITY },
    ]

    return categories.map((category) => ({
      name: category.name,
      value: filteredData.filter(
        (d) => d.air_quality !== null && d.air_quality >= category.min && d.air_quality <= category.max,
      ).length,
    }))
  }

  const distributionData = prepareDistributionData()

  // Handle custom time range slider
  const handleSliderChange = (values: number[]) => {
    if (allData.length === 0 || values.length < 2) return

    const minIndex = Math.floor((values[0] * (allData.length - 1)) / 100)
    const maxIndex = Math.floor((values[1] * (allData.length - 1)) / 100)

    setTimeRange([allData[minIndex].dateObj, allData[maxIndex].dateObj])
  }

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date || isNaN(date.getTime())) {
      return "Invalid Date"
    }
    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Toggle column visibility
  const toggleColumnVisibility = (column: string) => {
    if (visibleColumns.includes(column)) {
      setVisibleColumns(visibleColumns.filter((c) => c !== column))
    } else {
      setVisibleColumns([...visibleColumns, column])
    }
  }

  // Handle column sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortDirection(null)
        setSortColumn(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      // New column, set to ascending
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Export data as CSV
  const exportCSV = () => {
    if (filteredData.length === 0) return

    // Create CSV header
    const headers = [
      "Date",
      "Time",
      "Temperature (°C)",
      "Humidity (%)",
      "Air Quality",
      "Wind Speed (km/h)",
      "Wind Direction (°)",
      "Precipitation (mm)",
      "Solar Radiation (W/m²)",
      "Pressure (hPa)",
    ]

    // Create CSV rows
    const rows = filteredData.map((row) => [
      row.date,
      row.time,
      row.temperature !== null ? row.temperature : "",
      row.humidity !== null ? row.humidity : "",
      row.air_quality !== null ? row.air_quality : "",
      row.windSpeed !== null ? row.windSpeed : "",
      row.windDirection !== null ? row.windDirection : "",
      row.precipitation !== null ? row.precipitation : "",
      row.solarRadiation !== null ? row.solarRadiation : "",
      row.pressure !== null ? row.pressure : "",
    ])

    // Combine header and rows
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `weather_data_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Weather Data Dashboard</h2>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Data</CardTitle>
          <CardDescription>There was a problem fetching the weather data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 mb-4">{error}</div>
          <Button onClick={fetchData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (allData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
          <CardDescription>No weather data could be found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">Please check your CSV file or try again later.</div>
          <Button onClick={fetchData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Time range filter UI
  const timeRangeFilter = (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Time Range
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Select value={timeRangeType} onValueChange={(value) => handleTimeRangeChange(value as any)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Data</SelectItem>
                  <SelectItem value="day">Last 24 Hours</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Popover open={dateFilterOpen && timeRangeType === "custom"} onOpenChange={setDateFilterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => timeRangeType === "custom" && setDateFilterOpen(true)}
                    disabled={timeRangeType !== "custom"}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {timeRange ? (
                      <>
                        {formatDate(timeRange[0])} - {formatDate(timeRange[1])}
                      </>
                    ) : (
                      "Select Range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4" align="end">
                  <div className="space-y-4">
                    <div className="text-sm font-medium">Adjust Time Range</div>
                    <div className="pt-4">
                      <Slider defaultValue={[0, 100]} max={100} step={1} onValueChange={handleSliderChange} />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div>{timeRange ? formatDate(timeRange[0]) : "Start"}</div>
                      <div>{timeRange ? formatDate(timeRange[1]) : "End"}</div>
                    </div>
                    <div className="flex justify-end">
                      <Button size="sm" onClick={() => setDateFilterOpen(false)}>
                        Apply
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button variant="outline" size="sm" onClick={exportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>

              <Button variant="ghost" size="icon" onClick={() => setInfoDialogOpen(true)}>
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {timeRange && (
            <div className="text-sm text-muted-foreground">
              <Badge variant="outline" className="mr-2">
                Showing data from {formatDate(timeRange[0])} to {formatDate(timeRange[1])}
              </Badge>
              {filteredData.length < allData.length && (
                <Badge variant="secondary">
                  {filteredData.length} of {allData.length} records
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  // Chart options UI
  const chartOptions = (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BarChartIcon className="h-5 w-5 mr-2" />
          Chart Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Chart Type</Label>
            <Select value={chartView} onValueChange={(value) => setChartView(value as ChartViewType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="composed">Composed Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Display Options</Label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-grid"
                  checked={showGridLines}
                  onCheckedChange={(checked) => setShowGridLines(checked as boolean)}
                />
                <Label htmlFor="show-grid" className="text-sm">
                  Show Grid Lines
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-points"
                  checked={showDataPoints}
                  onCheckedChange={(checked) => setShowDataPoints(checked as boolean)}
                />
                <Label htmlFor="show-points" className="text-sm">
                  Show Data Points
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data Smoothing</Label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="smooth-data" checked={smoothData} onCheckedChange={setSmoothData} />
                <Label htmlFor="smooth-data" className="text-sm">
                  Enable Smoothing
                </Label>
              </div>
              {smoothData && (
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label htmlFor="window-size" className="text-xs">
                      Window Size: {smoothingWindow}
                    </Label>
                  </div>
                  <Slider
                    id="window-size"
                    min={3}
                    max={15}
                    step={2}
                    value={[smoothingWindow]}
                    onValueChange={(value) => setSmoothingWindow(value[0])}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Column selector UI
  const columnSelector = (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Data Columns
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allColumns.map((column) => (
            <div key={column.key} className="flex items-center space-x-2">
              <Checkbox
                id={`column-${column.key}`}
                checked={visibleColumns.includes(column.key)}
                onCheckedChange={() => toggleColumnVisibility(column.key)}
              />
              <div>
                <Label htmlFor={`column-${column.key}`} className="text-sm font-medium">
                  {column.label}
                </Label>
                {dataStats[column.key] && dataStats[column.key].count > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Range: {dataStats[column.key].min?.toFixed(1)} - {dataStats[column.key].max?.toFixed(1)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  // Render different chart types based on the chartType prop
  const renderChart = () => {
    switch (chartType) {
      case "temperature":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Temperature Trends</span>
                <Button variant="ghost" size="icon" onClick={() => setFullScreenChart(true)}>
                  <Expand className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>Temperature measurements over time</CardDescription>
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
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={displayData}>
                        {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                        <XAxis
                          dataKey="formattedTimestamp"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          interval="preserveStartEnd"
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(label) => {
                            const item = displayData.find((d) => d.formattedTimestamp === label)
                            return item ? `${item.date} ${item.time}` : label
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke={getColorForColumn("temperature")}
                          strokeWidth={2}
                          dot={showDataPoints}
                          activeDot={{ r: 6 }}
                          connectNulls={true}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="table">
                  <div className="max-h-80 overflow-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                            Date
                            {sortColumn === "date" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("time")}>
                            Time
                            {sortColumn === "time" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("temperature")}>
                            Temperature (°C)
                            {sortColumn === "temperature" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.time}</TableCell>
                            <TableCell>{row.temperature !== null ? row.temperature.toFixed(1) : "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )

      case "correlation":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Temperature vs Humidity Correlation</span>
                <Button variant="ghost" size="icon" onClick={() => setFullScreenChart(true)}>
                  <Expand className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>Relationship between temperature and humidity</CardDescription>
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
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                        <XAxis
                          type="number"
                          dataKey="x"
                          name="Temperature"
                          unit="°C"
                          domain={["dataMin - 1", "dataMax + 1"]}
                        />
                        <YAxis
                          type="number"
                          dataKey="y"
                          name="Humidity"
                          unit="%"
                          domain={["dataMin - 5", "dataMax + 5"]}
                        />
                        <ZAxis type="number" dataKey="z" range={[60, 400]} name="Air Quality" />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value, name) => [value, name]} />
                        <Scatter
                          name="Temperature vs Humidity"
                          data={correlationData}
                          fill={getColorForColumn("temperature")}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="table">
                  <div className="max-h-80 overflow-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("temperature")}>
                            Temperature (°C)
                            {sortColumn === "temperature" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("humidity")}>
                            Humidity (%)
                            {sortColumn === "humidity" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("air_quality")}>
                            Air Quality
                            {sortColumn === "air_quality" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {correlationData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.x !== null ? row.x.toFixed(1) : "N/A"}</TableCell>
                            <TableCell>{row.y !== null ? row.y.toFixed(1) : "N/A"}</TableCell>
                            <TableCell>{row.z !== null ? row.z.toFixed(1) : "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )

      case "distribution":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Air Quality Distribution</span>
                <Button variant="ghost" size="icon" onClick={() => setFullScreenChart(true)}>
                  <Expand className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>Distribution of air quality measurements</CardDescription>
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
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={distributionData}>
                        {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill={getColorForColumn("airQuality")} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="table">
                  <div className="max-h-80 overflow-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>AQI Category</TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("value")}>
                            Count
                            {sortColumn === "value" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {distributionData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )

      case "wind":
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Wind Speed and Direction</span>
                <Button variant="ghost" size="icon" onClick={() => setFullScreenChart(true)}>
                  <Expand className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>Wind measurements over time</CardDescription>
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
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={displayData}>
                        {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                        <XAxis
                          dataKey="formattedTimestamp"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          interval="preserveStartEnd"
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(label) => {
                            const item = displayData.find((d) => d.formattedTimestamp === label)
                            return item ? `${item.date} ${item.time}` : label
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="windSpeed"
                          stroke={getColorForColumn("windSpeed")}
                          strokeWidth={2}
                          dot={showDataPoints}
                          activeDot={{ r: 6 }}
                          connectNulls={true}
                        />
                        <Line
                          type="monotone"
                          dataKey="windDirection"
                          stroke={getColorForColumn("windDirection")}
                          strokeWidth={2}
                          dot={showDataPoints}
                          activeDot={{ r: 6 }}
                          connectNulls={true}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="table">
                  <div className="max-h-80 overflow-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                            Date
                            {sortColumn === "date" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("time")}>
                            Time
                            {sortColumn === "time" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("windSpeed")}>
                            Wind Speed (km/h)
                            {sortColumn === "windSpeed" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("windDirection")}>
                            Wind Direction (°)
                            {sortColumn === "windDirection" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.time}</TableCell>
                            <TableCell>{row.windSpeed !== null ? row.windSpeed.toFixed(1) : "N/A"}</TableCell>
                            <TableCell>{row.windDirection !== null ? row.windDirection.toFixed(1) : "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Environmental Metrics Overview</span>
                <Button variant="ghost" size="icon" onClick={() => setFullScreenChart(true)}>
                  <Expand className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>Comprehensive view of all weather metrics</CardDescription>
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
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartView === "line" && (
                        <LineChart data={displayData}>
                          {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                          <XAxis
                            dataKey="formattedTimestamp"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(label) => {
                              const item = displayData.find((d) => d.formattedTimestamp === label)
                              return item ? `${item.date} ${item.time}` : label
                            }}
                          />
                          <Legend />
                          {visibleColumns.includes("temperature") && (
                            <Line
                              type="monotone"
                              dataKey="temperature"
                              name="Temperature (°C)"
                              stroke={getColorForColumn("temperature")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("humidity") && (
                            <Line
                              type="monotone"
                              dataKey="humidity"
                              name="Humidity (%)"
                              stroke={getColorForColumn("humidity")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("air_quality") && (
                            <Line
                              type="monotone"
                              dataKey="air_quality"
                              name="Air Quality"
                              stroke={getColorForColumn("air_quality")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("windSpeed") && (
                            <Line
                              type="monotone"
                              dataKey="windSpeed"
                              name="Wind Speed (km/h)"
                              stroke={getColorForColumn("windSpeed")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("windDirection") && (
                            <Line
                              type="monotone"
                              dataKey="windDirection"
                              name="Wind Direction (°)"
                              stroke={getColorForColumn("windDirection")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("precipitation") && (
                            <Line
                              type="monotone"
                              dataKey="precipitation"
                              name="Precipitation (mm)"
                              stroke={getColorForColumn("precipitation")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("solarRadiation") && (
                            <Line
                              type="monotone"
                              dataKey="solarRadiation"
                              name="Solar Radiation (W/m²)"
                              stroke={getColorForColumn("solarRadiation")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("pressure") && (
                            <Line
                              type="monotone"
                              dataKey="pressure"
                              name="Pressure (hPa)"
                              stroke={getColorForColumn("pressure")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                        </LineChart>
                      )}

                      {chartView === "area" && (
                        <AreaChart data={displayData}>
                          {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                          <XAxis
                            dataKey="formattedTimestamp"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(label) => {
                              const item = displayData.find((d) => d.formattedTimestamp === label)
                              return item ? `${item.date} ${item.time}` : label
                            }}
                          />
                          <Legend />
                          {visibleColumns.includes("temperature") && (
                            <Area
                              type="monotone"
                              dataKey="temperature"
                              name="Temperature (°C)"
                              fill={getColorForColumn("temperature")}
                              stroke={getColorForColumn("temperature")}
                              fillOpacity={0.3}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("humidity") && (
                            <Area
                              type="monotone"
                              dataKey="humidity"
                              name="Humidity (%)"
                              fill={getColorForColumn("humidity")}
                              stroke={getColorForColumn("humidity")}
                              fillOpacity={0.3}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("air_quality") && (
                            <Area
                              type="monotone"
                              dataKey="air_quality"
                              name="Air Quality"
                              fill={getColorForColumn("air_quality")}
                              stroke={getColorForColumn("air_quality")}
                              fillOpacity={0.3}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("windSpeed") && (
                            <Area
                              type="monotone"
                              dataKey="windSpeed"
                              name="Wind Speed (km/h)"
                              fill={getColorForColumn("windSpeed")}
                              stroke={getColorForColumn("windSpeed")}
                              fillOpacity={0.3}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("windDirection") && (
                            <Area
                              type="monotone"
                              dataKey="windDirection"
                              name="Wind Direction (°)"
                              fill={getColorForColumn("windDirection")}
                              stroke={getColorForColumn("windDirection")}
                              fillOpacity={0.3}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("precipitation") && (
                            <Area
                              type="monotone"
                              dataKey="precipitation"
                              name="Precipitation (mm)"
                              fill={getColorForColumn("precipitation")}
                              stroke={getColorForColumn("precipitation")}
                              fillOpacity={0.3}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("solarRadiation") && (
                            <Area
                              type="monotone"
                              dataKey="solarRadiation"
                              name="Solar Radiation (W/m²)"
                              fill={getColorForColumn("solarRadiation")}
                              stroke={getColorForColumn("solarRadiation")}
                              fillOpacity={0.3}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("pressure") && (
                            <Area
                              type="monotone"
                              dataKey="pressure"
                              name="Pressure (hPa)"
                              fill={getColorForColumn("pressure")}
                              stroke={getColorForColumn("pressure")}
                              fillOpacity={0.3}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                        </AreaChart>
                      )}

                      {chartView === "bar" && (
                        <BarChart data={displayData}>
                          {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                          <XAxis
                            dataKey="formattedTimestamp"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(label) => {
                              const item = displayData.find((d) => d.formattedTimestamp === label)
                              return item ? `${item.date} ${item.time}` : label
                            }}
                          />
                          <Legend />
                          {visibleColumns.includes("temperature") && (
                            <Bar
                              dataKey="temperature"
                              name="Temperature (°C)"
                              fill={getColorForColumn("temperature")}
                            />
                          )}
                          {visibleColumns.includes("humidity") && (
                            <Bar dataKey="humidity" name="Humidity (%)" fill={getColorForColumn("humidity")} />
                          )}
                          {visibleColumns.includes("air_quality") && (
                            <Bar dataKey="air_quality" name="Air Quality" fill={getColorForColumn("air_quality")} />
                          )}
                          {visibleColumns.includes("windSpeed") && (
                            <Bar dataKey="windSpeed" name="Wind Speed (km/h)" fill={getColorForColumn("windSpeed")} />
                          )}
                          {visibleColumns.includes("windDirection") && (
                            <Bar
                              dataKey="windDirection"
                              name="Wind Direction (°)"
                              fill={getColorForColumn("windDirection")}
                            />
                          )}
                          {visibleColumns.includes("precipitation") && (
                            <Bar
                              dataKey="precipitation"
                              name="Precipitation (mm)"
                              fill={getColorForColumn("precipitation")}
                            />
                          )}
                          {visibleColumns.includes("solarRadiation") && (
                            <Bar
                              dataKey="solarRadiation"
                              name="Solar Radiation (W/m²)"
                              fill={getColorForColumn("solarRadiation")}
                            />
                          )}
                          {visibleColumns.includes("pressure") && (
                            <Bar dataKey="pressure" name="Pressure (hPa)" fill={getColorForColumn("pressure")} />
                          )}
                        </BarChart>
                      )}

                      {chartView === "composed" && (
                        <ComposedChart data={displayData}>
                          {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                          <XAxis
                            dataKey="formattedTimestamp"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(label) => {
                              const item = displayData.find((d) => d.formattedTimestamp === label)
                              return item ? `${item.date} ${item.time}` : label
                            }}
                          />
                          <Legend />
                          {visibleColumns.includes("temperature") && (
                            <Line
                              type="monotone"
                              dataKey="temperature"
                              name="Temperature (°C)"
                              stroke={getColorForColumn("temperature")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("humidity") && (
                            <Area
                              type="monotone"
                              dataKey="humidity"
                              name="Humidity (%)"
                              fill={getColorForColumn("humidity")}
                              stroke={getColorForColumn("humidity")}
                              fillOpacity={0.3}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("air_quality") && (
                            <Line
                              type="monotone"
                              dataKey="air_quality"
                              name="Air Quality"
                              stroke={getColorForColumn("air_quality")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("windSpeed") && (
                            <Bar dataKey="windSpeed" name="Wind Speed (km/h)" fill={getColorForColumn("windSpeed")} />
                          )}
                          {visibleColumns.includes("windDirection") && (
                            <Line
                              type="monotone"
                              dataKey="windDirection"
                              name="Wind Direction (°)"
                              stroke={getColorForColumn("windDirection")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("precipitation") && (
                            <Bar
                              dataKey="precipitation"
                              name="Precipitation (mm)"
                              fill={getColorForColumn("precipitation")}
                            />
                          )}
                          {visibleColumns.includes("solarRadiation") && (
                            <Area
                              type="monotone"
                              dataKey="solarRadiation"
                              name="Solar Radiation (W/m²)"
                              fill={getColorForColumn("solarRadiation")}
                              stroke={getColorForColumn("solarRadiation")}
                              fillOpacity={0.3}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("pressure") && (
                            <Line
                              type="monotone"
                              dataKey="pressure"
                              name="Pressure (hPa)"
                              stroke={getColorForColumn("pressure")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 6 }}
                              connectNulls={true}
                            />
                          )}
                        </ComposedChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="table">
                  <div className="max-h-80 overflow-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                            Date
                            {sortColumn === "date" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("time")}>
                            Time
                            {sortColumn === "time" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("temperature")}>
                            Temperature (°C)
                            {sortColumn === "temperature" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("humidity")}>
                            Humidity (%)
                            {sortColumn === "humidity" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("air_quality")}>
                            Air Quality
                            {sortColumn === "air_quality" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("windSpeed")}>
                            Wind Speed (km/h)
                            {sortColumn === "windSpeed" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("windDirection")}>
                            Wind Direction (°)
                            {sortColumn === "windDirection" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("precipitation")}>
                            Precipitation (mm)
                            {sortColumn === "precipitation" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("solarRadiation")}>
                            Solar Radiation (W/m²)
                            {sortColumn === "solarRadiation" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("pressure")}>
                            Pressure (hPa)
                            {sortColumn === "pressure" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.time}</TableCell>
                            <TableCell>{row.temperature !== null ? row.temperature.toFixed(1) : "N/A"}</TableCell>
                            <TableCell>{row.humidity !== null ? row.humidity.toFixed(1) : "N/A"}</TableCell>
                            <TableCell>{row.air_quality !== null ? row.air_quality.toFixed(1) : "N/A"}</TableCell>
                            <TableCell>{row.windSpeed !== null ? row.windSpeed.toFixed(1) : "N/A"}</TableCell>
                            <TableCell>{row.windDirection !== null ? row.windDirection.toFixed(1) : "N/A"}</TableCell>
                            <TableCell>{row.precipitation !== null ? row.precipitation.toFixed(1) : "N/A"}</TableCell>
                            <TableCell>{row.solarRadiation !== null ? row.solarRadiation.toFixed(1) : "N/A"}</TableCell>
                            <TableCell>{row.pressure !== null ? row.pressure.toFixed(1) : "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Weather Data Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="default" size="sm" onClick={() => setFullScreenChart(true)}>
            <Expand className="h-4 w-4 mr-2" />
            Full Screen
          </Button>
        </div>
      </div>

      {timeRangeFilter}
      {chartOptions}
      {chartType === "default" && columnSelector}
      {renderChart()}

      {/* Full Screen Chart Dialog */}
      <Dialog open={fullScreenChart} onOpenChange={setFullScreenChart}>
        <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh]">
          <DialogHeader>
            <DialogTitle>
              {chartType === "temperature" && "Temperature Trends"}
              {chartType === "correlation" && "Humidity vs Temperature"}
              {chartType === "distribution" && "Air Quality Distribution"}
              {chartType === "wind" && "Wind Speed and Direction"}
              {chartType === "default" && "Environmental Metrics Overview"}
            </DialogTitle>
            <DialogDescription>
              {timeRange && `Data from ${formatDate(timeRange[0])} to ${formatDate(timeRange[1])}`}
            </DialogDescription>
          </DialogHeader>
          <div className="h-[75vh] space-y-4">
            <div className="flex flex-wrap gap-2">
              <Select value={chartView} onValueChange={(value) => setChartView(value as ChartViewType)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="composed">Composed Chart</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fs-show-grid"
                  checked={showGridLines}
                  onCheckedChange={(checked) => setShowGridLines(checked as boolean)}
                />
                <Label htmlFor="fs-show-grid" className="text-sm">
                  Grid Lines
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fs-show-points"
                  checked={showDataPoints}
                  onCheckedChange={(checked) => setShowDataPoints(checked as boolean)}
                />
                <Label htmlFor="fs-show-points" className="text-sm">
                  Data Points
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="fs-smooth-data" checked={smoothData} onCheckedChange={setSmoothData} />
                <Label htmlFor="fs-smooth-data" className="text-sm">
                  Smoothing
                </Label>
              </div>

              {smoothData && (
                <div className="flex items-center space-x-2">
                  <Label htmlFor="fs-window-size" className="text-sm">
                    Window: {smoothingWindow}
                  </Label>
                  <Slider
                    id="fs-window-size"
                    className="w-24"
                    min={3}
                    max={15}
                    step={2}
                    value={[smoothingWindow]}
                    onValueChange={(value) => setSmoothingWindow(value[0])}
                  />
                </div>
              )}

              <Button variant="outline" size="sm" onClick={exportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {chartType === "default" && (
              <div className="flex flex-wrap gap-2">
                {allColumns.map((column) => (
                  <div key={column.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`fs-column-${column.key}`}
                      checked={visibleColumns.includes(column.key)}
                      onCheckedChange={() => toggleColumnVisibility(column.key)}
                    />
                    <Label htmlFor={`fs-column-${column.key}`} className="text-sm">
                      {column.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            <Tabs defaultValue="chart" className="h-[calc(100%-80px)]">
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

              <TabsContent value="chart" className="h-full">
                <div className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "temperature" &&
                      (chartView === "line" ? (
                        <LineChart data={displayData}>
                          {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                          <XAxis
                            dataKey="formattedTimestamp"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(label) => {
                              const item = displayData.find((d) => d.formattedTimestamp === label)
                              return item ? `${item.date} ${item.time}` : label
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="temperature"
                            name="Temperature (°C)"
                            stroke={getColorForColumn("temperature")}
                            strokeWidth={2}
                            dot={showDataPoints}
                            activeDot={{ r: 8 }}
                            connectNulls={true}
                          />
                        </LineChart>
                      ) : chartView === "area" ? (
                        <AreaChart data={displayData}>
                          {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                          <XAxis
                            dataKey="formattedTimestamp"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(label) => {
                              const item = displayData.find((d) => d.formattedTimestamp === label)
                              return item ? `${item.date} ${item.time}` : label
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="temperature"
                            name="Temperature (°C)"
                            fill={getColorForColumn("temperature")}
                            stroke={getColorForColumn("temperature")}
                            fillOpacity={0.3}
                            connectNulls={true}
                          />
                        </AreaChart>
                      ) : (
                        <BarChart data={displayData}>
                          {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                          <XAxis
                            dataKey="formattedTimestamp"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(label) => {
                              const item = displayData.find((d) => d.formattedTimestamp === label)
                              return item ? `${item.date} ${item.time}` : label
                            }}
                          />
                          <Legend />
                          <Bar dataKey="temperature" name="Temperature (°C)" fill={getColorForColumn("temperature")} />
                        </BarChart>
                      ))}
                    {chartType === "correlation" && (
                      <ScatterChart>
                        {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                        <XAxis
                          type="number"
                          dataKey="x"
                          name="Temperature"
                          unit="°C"
                          domain={["dataMin - 1", "dataMax + 1"]}
                        />
                        <YAxis
                          type="number"
                          dataKey="y"
                          name="Humidity"
                          unit="%"
                          domain={["dataMin - 5", "dataMax + 5"]}
                        />
                        <ZAxis type="number" dataKey="z" range={[60, 400]} name="Air Quality" />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value, name) => [value, name]} />
                        <Legend />
                        <Scatter
                          name="Temperature vs Humidity"
                          data={correlationData}
                          fill={getColorForColumn("temperature")}
                        />
                      </ScatterChart>
                    )}
                    {chartType === "distribution" && (
                      <BarChart data={distributionData}>
                        {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Count" fill={getColorForColumn("airQuality")} />
                      </BarChart>
                    )}
                    {chartType === "wind" &&
                      (chartView === "line" ? (
                        <LineChart data={displayData}>
                          {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                          <XAxis
                            dataKey="formattedTimestamp"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(label) => {
                              const item = displayData.find((d) => d.formattedTimestamp === label)
                              return item ? `${item.date} ${item.time}` : label
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="windSpeed"
                            name="Wind Speed (km/h)"
                            stroke={getColorForColumn("windSpeed")}
                            strokeWidth={2}
                            dot={showDataPoints}
                            activeDot={{ r: 8 }}
                            connectNulls={true}
                          />
                          <Line
                            type="monotone"
                            dataKey="windDirection"
                            name="Wind Direction (°)"
                            stroke={getColorForColumn("windDirection")}
                            strokeWidth={2}
                            dot={showDataPoints}
                            activeDot={{ r: 8 }}
                            connectNulls={true}
                          />
                        </LineChart>
                      ) : chartView === "area" ? (
                        <AreaChart data={displayData}>
                          {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                          <XAxis
                            dataKey="formattedTimestamp"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(label) => {
                              const item = displayData.find((d) => d.formattedTimestamp === label)
                              return item ? `${item.date} ${item.time}` : label
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="windSpeed"
                            name="Wind Speed (km/h)"
                            fill={getColorForColumn("windSpeed")}
                            stroke={getColorForColumn("windSpeed")}
                            fillOpacity={0.3}
                            connectNulls={true}
                          />
                          <Area
                            type="monotone"
                            dataKey="windDirection"
                            name="Wind Direction (°)"
                            fill={getColorForColumn("windDirection")}
                            stroke={getColorForColumn("windDirection")}
                            fillOpacity={0.3}
                            connectNulls={true}
                          />
                        </AreaChart>
                      ) : (
                        <BarChart data={displayData}>
                          {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                          <XAxis
                            dataKey="formattedTimestamp"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(label) => {
                              const item = displayData.find((d) => d.formattedTimestamp === label)
                              return item ? `${item.date} ${item.time}` : label
                            }}
                          />
                          <Legend />
                          <Bar dataKey="windSpeed" name="Wind Speed (km/h)" fill={getColorForColumn("windSpeed")} />
                          <Bar
                            dataKey="windDirection"
                            name="Wind Direction (°)"
                            fill={getColorForColumn("windDirection")}
                          />
                        </BarChart>
                      ))}
                    {chartType === "default" &&
                      (chartView === "line" ? (
                        <LineChart data={displayData}>
                          {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                          <XAxis
                            dataKey="formattedTimestamp"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(label) => {
                              const item = displayData.find((d) => d.formattedTimestamp === label)
                              return item ? `${item.date} ${item.time}` : label
                            }}
                          />
                          <Legend />
                          {visibleColumns.includes("temperature") && (
                            <Line
                              type="monotone"
                              dataKey="temperature"
                              name="Temperature (°C)"
                              stroke={getColorForColumn("temperature")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 8 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("humidity") && (
                            <Line
                              type="monotone"
                              dataKey="humidity"
                              name="Humidity (%)"
                              stroke={getColorForColumn("humidity")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 8 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("air_quality") && (
                            <Line
                              type="monotone"
                              dataKey="air_quality"
                              name="Air Quality"
                              stroke={getColorForColumn("air_quality")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 8 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("windSpeed") && (
                            <Line
                              type="monotone"
                              dataKey="windSpeed"
                              name="Wind Speed (km/h)"
                              stroke={getColorForColumn("windSpeed")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 8 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("windDirection") && (
                            <Line
                              type="monotone"
                              dataKey="windDirection"
                              name="Wind Direction (°)"
                              stroke={getColorForColumn("windDirection")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 8 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("precipitation") && (
                            <Line
                              type="monotone"
                              dataKey="precipitation"
                              name="Precipitation (mm)"
                              stroke={getColorForColumn("precipitation")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 8 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("solarRadiation") && (
                            <Line
                              type="monotone"
                              dataKey="solarRadiation"
                              name="Solar Radiation (W/m²)"
                              stroke={getColorForColumn("solarRadiation")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 8 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("pressure") && (
                            <Line
                              type="monotone"
                              dataKey="pressure"
                              name="Pressure (hPa)"
                              stroke={getColorForColumn("pressure")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 8 }}
                              connectNulls={true}
                            />
                          )}
                        </LineChart>
                      ) : chartView === "area" ? (
                        <AreaChart data={displayData}>
                          {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                          <XAxis
                            dataKey="formattedTimestamp"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(label) => {
                              const item = displayData.find((d) => d.formattedTimestamp === label)
                              return item ? `${item.date} ${item.time}` : label
                            }}
                          />
                          <Legend />
                          {visibleColumns.includes("temperature") && (
                            <Area
                              type="monotone"
                              dataKey="temperature"
                              name="Temperature (°C)"
                              fill={getColorForColumn("temperature")}
                              stroke={getColorForColumn("temperature")}
                              fillOpacity={0.3}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("humidity") && (
                            <Area
                              type="monotone"
                              dataKey="humidity"
                              name="Humidity (%)"
                              fill={getColorForColumn("humidity")}
                              stroke={getColorForColumn("humidity")}
                              fillOpacity={0.3}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("air_quality") && (
                            <Area
                              type="monotone"
                              dataKey="air_quality"
                              name="Air Quality"
                              fill={getColorForColumn("air_quality")}
                              stroke={getColorForColumn("air_quality")}
                              fillOpacity={0.3}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("windSpeed") && (
                            <Area
                              type="monotone"
                              dataKey="windSpeed"
                              name="Wind Speed (km/h)"
                              fill={getColorForColumn("windSpeed")}
                              stroke={getColorForColumn("windSpeed")}
                              fillOpacity={0.3}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("windDirection") && (
                            <Area
                              type="monotone"
                              dataKey="windDirection"
                              name="Wind Direction (°)"
                              fill={getColorForColumn("windDirection")}
                              stroke={getColorForColumn("windDirection")}
                              fillOpacity={0.3}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("precipitation") && (
                            <Area
                              type="monotone"
                              dataKey="precipitation"
                              name="Precipitation (mm)"
                              fill={getColorForColumn("precipitation")}
                              stroke={getColorForColumn("precipitation")}
                              fillOpacity={0.3}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("solarRadiation") && (
                            <Area
                              type="monotone"
                              dataKey="solarRadiation"
                              name="Solar Radiation (W/m²)"
                              fill={getColorForColumn("solarRadiation")}
                              stroke={getColorForColumn("solarRadiation")}
                              fillOpacity={0.3}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("pressure") && (
                            <Area
                              type="monotone"
                              dataKey="pressure"
                              name="Pressure (hPa)"
                              fill={getColorForColumn("pressure")}
                              stroke={getColorForColumn("pressure")}
                              fillOpacity={0.3}
                              connectNulls={true}
                            />
                          )}
                        </AreaChart>
                      ) : chartView === "bar" ? (
                        <BarChart data={displayData}>
                          {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                          <XAxis
                            dataKey="formattedTimestamp"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(label) => {
                              const item = displayData.find((d) => d.formattedTimestamp === label)
                              return item ? `${item.date} ${item.time}` : label
                            }}
                          />
                          <Legend />
                          {visibleColumns.includes("temperature") && (
                            <Bar
                              dataKey="temperature"
                              name="Temperature (°C)"
                              fill={getColorForColumn("temperature")}
                            />
                          )}
                          {visibleColumns.includes("humidity") && (
                            <Bar dataKey="humidity" name="Humidity (%)" fill={getColorForColumn("humidity")} />
                          )}
                          {visibleColumns.includes("air_quality") && (
                            <Bar dataKey="air_quality" name="Air Quality" fill={getColorForColumn("air_quality")} />
                          )}
                          {visibleColumns.includes("windSpeed") && (
                            <Bar dataKey="windSpeed" name="Wind Speed (km/h)" fill={getColorForColumn("windSpeed")} />
                          )}
                          {visibleColumns.includes("windDirection") && (
                            <Bar
                              dataKey="windDirection"
                              name="Wind Direction (°)"
                              fill={getColorForColumn("windDirection")}
                            />
                          )}
                          {visibleColumns.includes("precipitation") && (
                            <Bar
                              dataKey="precipitation"
                              name="Precipitation (mm)"
                              fill={getColorForColumn("precipitation")}
                            />
                          )}
                          {visibleColumns.includes("solarRadiation") && (
                            <Bar
                              dataKey="solarRadiation"
                              name="Solar Radiation (W/m²)"
                              fill={getColorForColumn("solarRadiation")}
                            />
                          )}
                          {visibleColumns.includes("pressure") && (
                            <Bar dataKey="pressure" name="Pressure (hPa)" fill={getColorForColumn("pressure")} />
                          )}
                        </BarChart>
                      ) : (
                        <ComposedChart data={displayData}>
                          {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
                          <XAxis
                            dataKey="formattedTimestamp"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis />
                          <Tooltip
                            labelFormatter={(label) => {
                              const item = displayData.find((d) => d.formattedTimestamp === label)
                              return item ? `${item.date} ${item.time}` : label
                            }}
                          />
                          <Legend />
                          {visibleColumns.includes("temperature") && (
                            <Line
                              type="monotone"
                              dataKey="temperature"
                              name="Temperature (°C)"
                              stroke={getColorForColumn("temperature")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 8 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("humidity") && (
                            <Area
                              type="monotone"
                              dataKey="humidity"
                              name="Humidity (%)"
                              fill={getColorForColumn("humidity")}
                              stroke={getColorForColumn("humidity")}
                              fillOpacity={0.3}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("air_quality") && (
                            <Line
                              type="monotone"
                              dataKey="air_quality"
                              name="Air Quality"
                              stroke={getColorForColumn("air_quality")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 8 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("windSpeed") && (
                            <Bar dataKey="windSpeed" name="Wind Speed (km/h)" fill={getColorForColumn("windSpeed")} />
                          )}
                          {visibleColumns.includes("windDirection") && (
                            <Line
                              type="monotone"
                              dataKey="windDirection"
                              name="Wind Direction (°)"
                              stroke={getColorForColumn("windDirection")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 8 }}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("precipitation") && (
                            <Bar
                              dataKey="precipitation"
                              name="Precipitation (mm)"
                              fill={getColorForColumn("precipitation")}
                            />
                          )}
                          {visibleColumns.includes("solarRadiation") && (
                            <Area
                              type="monotone"
                              dataKey="solarRadiation"
                              name="Solar Radiation (W/m²)"
                              fill={getColorForColumn("solarRadiation")}
                              stroke={getColorForColumn("solarRadiation")}
                              fillOpacity={0.3}
                              connectNulls={true}
                            />
                          )}
                          {visibleColumns.includes("pressure") && (
                            <Line
                              type="monotone"
                              dataKey="pressure"
                              name="Pressure (hPa)"
                              stroke={getColorForColumn("pressure")}
                              strokeWidth={2}
                              dot={showDataPoints}
                              activeDot={{ r: 8 }}
                              connectNulls={true}
                            />
                          )}
                        </ComposedChart>
                      ))}
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="table" className="h-full">
                <div className="h-full overflow-auto border rounded-md">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background">
                      {(chartType === "temperature" || chartType === "default" || chartType === "wind") && (
                        <TableRow>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                            Date
                            {sortColumn === "date" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("time")}>
                            Time
                            {sortColumn === "time" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          {chartType === "temperature" && (
                            <TableHead className="cursor-pointer" onClick={() => handleSort("temperature")}>
                              Temperature (°C)
                              {sortColumn === "temperature" && (
                                <span className="ml-1">
                                  {sortDirection === "asc" ? (
                                    <ChevronUp className="inline h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="inline h-4 w-4" />
                                  )}
                                </span>
                              )}
                            </TableHead>
                          )}
                          {chartType === "wind" && (
                            <>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("windSpeed")}>
                                Wind Speed (km/h)
                                {sortColumn === "windSpeed" && (
                                  <span className="ml-1">
                                    {sortDirection === "asc" ? (
                                      <ChevronUp className="inline h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="inline h-4 w-4" />
                                    )}
                                  </span>
                                )}
                              </TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("windDirection")}>
                                Wind Direction (°)
                                {sortColumn === "windDirection" && (
                                  <span className="ml-1">
                                    {sortDirection === "asc" ? (
                                      <ChevronUp className="inline h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="inline h-4 w-4" />
                                    )}
                                  </span>
                                )}
                              </TableHead>
                            </>
                          )}
                          {chartType === "default" && (
                            <>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("temperature")}>
                                Temperature (°C)
                                {sortColumn === "temperature" && (
                                  <span className="ml-1">
                                    {sortDirection === "asc" ? (
                                      <ChevronUp className="inline h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="inline h-4 w-4" />
                                    )}
                                  </span>
                                )}
                              </TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("humidity")}>
                                Humidity (%)
                                {sortColumn === "humidity" && (
                                  <span className="ml-1">
                                    {sortDirection === "asc" ? (
                                      <ChevronUp className="inline h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="inline h-4 w-4" />
                                    )}
                                  </span>
                                )}
                              </TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("air_quality")}>
                                Air Quality
                                {sortColumn === "air_quality" && (
                                  <span className="ml-1">
                                    {sortDirection === "asc" ? (
                                      <ChevronUp className="inline h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="inline h-4 w-4" />
                                    )}
                                  </span>
                                )}
                              </TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("windSpeed")}>
                                Wind Speed (km/h)
                                {sortColumn === "windSpeed" && (
                                  <span className="ml-1">
                                    {sortDirection === "asc" ? (
                                      <ChevronUp className="inline h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="inline h-4 w-4" />
                                    )}
                                  </span>
                                )}
                              </TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("windDirection")}>
                                Wind Direction (°)
                                {sortColumn === "windDirection" && (
                                  <span className="ml-1">
                                    {sortDirection === "asc" ? (
                                      <ChevronUp className="inline h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="inline h-4 w-4" />
                                    )}
                                  </span>
                                )}
                              </TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("precipitation")}>
                                Precipitation (mm)
                                {sortColumn === "precipitation" && (
                                  <span className="ml-1">
                                    {sortDirection === "asc" ? (
                                      <ChevronUp className="inline h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="inline h-4 w-4" />
                                    )}
                                  </span>
                                )}
                              </TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("solarRadiation")}>
                                Solar Radiation (W/m²)
                                {sortColumn === "solarRadiation" && (
                                  <span className="ml-1">
                                    {sortDirection === "asc" ? (
                                      <ChevronUp className="inline h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="inline h-4 w-4" />
                                    )}
                                  </span>
                                )}
                              </TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("pressure")}>
                                Pressure (hPa)
                                {sortColumn === "pressure" && (
                                  <span className="ml-1">
                                    {sortDirection === "asc" ? (
                                      <ChevronUp className="inline h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="inline h-4 w-4" />
                                    )}
                                  </span>
                                )}
                              </TableHead>
                            </>
                          )}
                        </TableRow>
                      )}
                      {chartType === "correlation" && (
                        <TableRow>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("temperature")}>
                            Temperature (°C)
                            {sortColumn === "temperature" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("humidity")}>
                            Humidity (%)
                            {sortColumn === "humidity" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("air_quality")}>
                            Air Quality
                            {sortColumn === "air_quality" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                        </TableRow>
                      )}
                      {chartType === "distribution" && (
                        <TableRow>
                          <TableHead>AQI Category</TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("value")}>
                            Count
                            {sortColumn === "value" && (
                              <span className="ml-1">
                                {sortDirection === "asc" ? (
                                  <ChevronUp className="inline h-4 w-4" />
                                ) : (
                                  <ChevronDown className="inline h-4 w-4" />
                                )}
                              </span>
                            )}
                          </TableHead>
                        </TableRow>
                      )}
                    </TableHeader>
                    <TableBody>
                      {(chartType === "temperature" || chartType === "default" || chartType === "wind") &&
                        displayData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.time}</TableCell>
                            {chartType === "temperature" && (
                              <TableCell>{row.temperature !== null ? row.temperature.toFixed(1) : "N/A"}</TableCell>
                            )}
                            {chartType === "wind" && (
                              <>
                                <TableCell>{row.windSpeed !== null ? row.windSpeed.toFixed(1) : "N/A"}</TableCell>
                                <TableCell>
                                  {row.windDirection !== null ? row.windDirection.toFixed(1) : "N/A"}
                                </TableCell>
                              </>
                            )}
                            {chartType === "default" && (
                              <>
                                <TableCell>{row.temperature !== null ? row.temperature.toFixed(1) : "N/A"}</TableCell>
                                <TableCell>{row.humidity !== null ? row.humidity.toFixed(1) : "N/A"}</TableCell>
                                <TableCell>{row.air_quality !== null ? row.air_quality.toFixed(1) : "N/A"}</TableCell>
                                <TableCell>{row.windSpeed !== null ? row.windSpeed.toFixed(1) : "N/A"}</TableCell>
                                <TableCell>
                                  {row.windDirection !== null ? row.windDirection.toFixed(1) : "N/A"}
                                </TableCell>
                                <TableCell>
                                  {row.precipitation !== null ? row.precipitation.toFixed(1) : "N/A"}
                                </TableCell>
                                <TableCell>
                                  {row.solarRadiation !== null ? row.solarRadiation.toFixed(1) : "N/A"}
                                </TableCell>
                                <TableCell>{row.pressure !== null ? row.pressure.toFixed(1) : "N/A"}</TableCell>
                              </>
                            )}
                          </TableRow>
                        ))}
                      {chartType === "correlation" &&
                        correlationData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.x !== null ? row.x.toFixed(1) : "N/A"}</TableCell>
                            <TableCell>{row.y !== null ? row.y.toFixed(1) : "N/A"}</TableCell>
                            <TableCell>{row.z !== null ? row.z.toFixed(1) : "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      {chartType === "distribution" &&
                        distributionData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.value}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Dialog */}
      <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Weather Dashboard Information</DialogTitle>
            <DialogDescription>This dashboard displays weather data from the CSV file.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Data Source</h3>
              <p className="text-sm text-muted-foreground">
                Data is loaded from:{" "}
                <code className="text-xs bg-muted p-1 rounded">
                  https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cvs-data-kbqX9LxVfhj4yaph2DY1NBQ96wVuHL.csv
                </code>
              </p>
            </div>
            <div>
              <h3 className="font-medium">Available Metrics</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                {allColumns.map((column) => (
                  <li key={column.key}>{column.label}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Features</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Time range filtering</li>
                <li>Multiple chart types</li>
                <li>Data smoothing</li>
                <li>Sortable tables</li>
                <li>CSV export</li>
                <li>Full-screen view</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
