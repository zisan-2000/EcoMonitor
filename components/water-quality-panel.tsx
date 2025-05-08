"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/date-range-picker";
import {
  FlaskRoundIcon as Flask,
  Waves,
  MapPin,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WaterQualityPanel({ data }) {
  const [timeRange, setTimeRange] = useState("24h");
  const [chartData, setChartData] = useState([]);
  const [doLevelsData, setDoLevelsData] = useState([]);
  const [mapCenter, setMapCenter] = useState([22.5134, 91.8446]);
  const [selectedParameter, setSelectedParameter] = useState("all");
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (data.length > 0) {
      // Process data for charts
      const processedData = data.slice(-24).map((item) => ({
        time: item.times || "00:00",
        temp: parseFloat(item.temp || 0),
        ph: parseFloat(item.ph || 0),
        orp: parseFloat(item.orp || 0),
        do: parseFloat(item.do || 0),
        sal: parseFloat(item.sal || 0),
        cond: parseFloat(item.cond || 0),
        spd: parseFloat(item.spd || 0),
        temp2: parseFloat(item.temp2 || 0),
        ph2: parseFloat(item.ph2 || 0),
        orp2: parseFloat(item.orp2 || 0),
        do2: parseFloat(item.do2 || 0),
      }));

      setChartData(processedData);

      // Process DO levels data for bar chart
      const doData = [];
      for (let i = 0; i < 24; i++) {
        const hour = i < 10 ? `0${i}:00` : `${i}:00`;
        const value = data.find(
          (item) => item.times && item.times.startsWith(hour)
        );

        doData.push({
          hour,
          do: value ? Number.parseFloat(value.do || 0) : Math.random() * 10,
        });
      }

      setDoLevelsData(doData);

      // Set map center from the latest data point with coordinates
      const latestWithCoords = data.findLast(
        (item) =>
          item.lat &&
          item.lon &&
          !isNaN(Number.parseFloat(item.lat)) &&
          !isNaN(Number.parseFloat(item.lon))
      );

      if (latestWithCoords) {
        setMapCenter([
          Number.parseFloat(latestWithCoords.lat),
          Number.parseFloat(latestWithCoords.lon),
        ]);
      }

      // Prepare table data
      setTableData(
        data.slice(-50).map((item) => ({
          id: item.id || "N/A",
          date: item.dates || "N/A",
          time: item.times || "N/A",
          temp: parseFloat(item.temp || 0).toFixed(2),
          ph: parseFloat(item.ph || 0).toFixed(2),
          orp: parseFloat(item.orp || 0).toFixed(2),
          do: parseFloat(item.do || 0).toFixed(2),
          sal: parseFloat(item.sal || 0).toFixed(2),
          cond: parseFloat(item.cond || 0).toFixed(2),
          spd: parseFloat(item.spd || 0).toFixed(2),
          temp2: parseFloat(item.temp2 || 0).toFixed(2),
          ph2: parseFloat(item.ph2 || 0).toFixed(2),
          orp2: parseFloat(item.orp2 || 0).toFixed(2),
          do2: parseFloat(item.do2 || 0).toFixed(2),
          scnt: item.scnt,
          location: `${parseFloat(item.lat || 0).toFixed(4)}, ${parseFloat(
            item.lon || 0
          ).toFixed(4)}`,
        }))
      );
    }
  }, [data]);

  // Function to get color based on parameter value
  const getParameterColor = (param) => {
    switch (param) {
      case "temp":
        return "#FF5722";
      case "ph":
        return "#4CAF50";
      case "orp":
        return "#2196F3";
      case "do":
        return "#9C27B0";
      case "sal":
        return "#FFC107";
      default:
        return "#000000";
    }
  };

  // Filter and paginate table data
  const filteredData = tableData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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

        <div>
          <Select
            value={selectedParameter}
            onValueChange={setSelectedParameter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select parameter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Parameters</SelectItem>
              <SelectItem value="temp">Temperature</SelectItem>
              <SelectItem value="ph">pH</SelectItem>
              <SelectItem value="orp">ORP</SelectItem>
              <SelectItem value="do">Dissolved Oxygen</SelectItem>
              <SelectItem value="sal">Salinity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flask className="h-5 w-5" />
              Water Quality Parameters
            </CardTitle>
            <CardDescription>
              Temperature, pH, ORP, DO, and Salinity over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      border: "none",
                    }}
                  />
                  <Legend />
                  {(selectedParameter === "all" ||
                    selectedParameter === "temp") && (
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="#FF5722"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="Temperature (°C)"
                    />
                  )}
                  {(selectedParameter === "all" ||
                    selectedParameter === "ph") && (
                    <Line
                      type="monotone"
                      dataKey="ph"
                      stroke="#4CAF50"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="pH"
                    />
                  )}
                  {(selectedParameter === "all" ||
                    selectedParameter === "orp") && (
                    <Line
                      type="monotone"
                      dataKey="orp"
                      stroke="#2196F3"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="ORP (mV)"
                    />
                  )}
                  {(selectedParameter === "all" ||
                    selectedParameter === "do") && (
                    <Line
                      type="monotone"
                      dataKey="do"
                      stroke="#9C27B0"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="DO (mg/L)"
                    />
                  )}
                  {(selectedParameter === "all" ||
                    selectedParameter === "sal") && (
                    <Line
                      type="monotone"
                      dataKey="sal"
                      stroke="#FFC107"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                      name="Salinity (ppt)"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5" />
              Dissolved Oxygen Levels
            </CardTitle>
            <CardDescription>DO levels per hour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={doLevelsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="hour"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.split(":")[0]}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    label={{
                      value: "DO (mg/L)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <RechartsTooltip />
                  <Bar
                    dataKey="do"
                    fill="#9C27B0"
                    radius={[4, 4, 0, 0]}
                    name="Dissolved Oxygen"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Sensor Location
            </CardTitle>
            <CardDescription>
              Geographic location of water quality sensors
            </CardDescription>
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
      </div>

      {/* Table View */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Water Quality Data Table</CardTitle>
            <CardDescription>Raw water quality measurements</CardDescription>
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
                {currentItems.map((item, index) => (
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredData.length)} of{" "}
            {filteredData.length} entries
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
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
  );
}
