"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Expand, TableIcon, BarChartIcon } from "lucide-react";

interface OverviewProps {
  chartType?:
    | "default"
    | "temperature"
    | "correlation"
    | "distribution"
    | "wind";
}

export function Overview({ chartType = "default" }: OverviewProps) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fullScreenChart, setFullScreenChart] = useState<boolean>(false);

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      setIsLoading(true);

      // Generate sample data
      const sampleData = Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        const baseTemp = 20 + Math.sin(i / 3) * 5;
        const randomFactor = Math.random() * 2 - 1;

        return {
          time: `${hour.toString().padStart(2, "0")}:00`,
          temperature: +(baseTemp + randomFactor).toFixed(1),
          humidity: +(60 + Math.sin(i / 2) * 15 + Math.random() * 5).toFixed(1),
          airQuality: +(50 + Math.sin(i / 4) * 20 + Math.random() * 10).toFixed(
            1
          ),
          windSpeed: +(5 + Math.sin(i / 6) * 3 + Math.random() * 2).toFixed(1),
          windDirection: Math.floor(Math.random() * 360),
          precipitation:
            Math.random() > 0.8 ? +(Math.random() * 2).toFixed(1) : 0,
          solarRadiation:
            hour >= 6 && hour <= 18
              ? +(
                  Math.sin(((hour - 6) / 12) * Math.PI) * 800 +
                  Math.random() * 100
                ).toFixed(1)
              : 0,
        };
      });

      setData(sampleData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Format the X-axis tick values
  const formatXAxis = (value: string) => {
    return value;
  };

  // Get color for a column
  const getColorForColumn = (column: string) => {
    const lowerColumn = column.toLowerCase();
    if (lowerColumn.includes("temp")) return "#ef4444"; // red
    if (lowerColumn.includes("humid")) return "#3b82f6"; // blue
    if (lowerColumn.includes("wind")) return "#64748b"; // slate
    if (lowerColumn.includes("solar")) return "#eab308"; // yellow
    if (lowerColumn.includes("air")) return "#10b981"; // green
    if (lowerColumn.includes("precipitation")) return "#60a5fa"; // blue-400

    // Generate a color based on the column name for consistency
    const hash = column.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    return `hsl(${Math.abs(hash) % 360}, 70%, 50%)`;
  };

  // Get a friendly display name for a column
  const getDisplayName = (column: string) => {
    // Replace underscores with spaces and capitalize each word
    return column
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Prepare correlation data
  const correlationData = data.map((item) => ({
    x: item.temperature,
    y: item.humidity,
    z: item.airQuality,
  }));

  // Prepare distribution data
  const distributionData = [
    {
      name: "Good (0-50)",
      value: data.filter((d) => d.airQuality <= 50).length,
    },
    {
      name: "Moderate (51-100)",
      value: data.filter((d) => d.airQuality > 50 && d.airQuality <= 100)
        .length,
    },
    {
      name: "Unhealthy for Sensitive Groups (101-150)",
      value: data.filter((d) => d.airQuality > 100 && d.airQuality <= 150)
        .length,
    },
    {
      name: "Unhealthy (151-200)",
      value: data.filter((d) => d.airQuality > 150 && d.airQuality <= 200)
        .length,
    },
    {
      name: "Very Unhealthy (201-300)",
      value: data.filter((d) => d.airQuality > 200 && d.airQuality <= 300)
        .length,
    },
    {
      name: "Hazardous (301+)",
      value: data.filter((d) => d.airQuality > 300).length,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        Loading data...
      </div>
    );
  }

  // Render different chart types based on the chartType prop
  const renderChart = () => {
    switch (chartType) {
      case "temperature":
        return (
          <div className="h-80">
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
                <div className="relative h-80">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 z-10"
                    onClick={() => setFullScreenChart(true)}
                  >
                    <Expand className="h-4 w-4" />
                  </Button>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <XAxis dataKey="time" tickFormatter={formatXAxis} />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke={getColorForColumn("temperature")}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
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
                        <TableHead>Time</TableHead>
                        <TableHead>Temperature (°C)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.time}</TableCell>
                          <TableCell>{row.temperature}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case "correlation":
        return (
          <div className="h-80">
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
                <div className="relative h-80">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 z-10"
                    onClick={() => setFullScreenChart(true)}
                  >
                    <Expand className="h-4 w-4" />
                  </Button>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
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
                      <ZAxis
                        type="number"
                        dataKey="z"
                        range={[60, 400]}
                        name="Air Quality"
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        formatter={(value, name) => [value, name]}
                      />
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
                        <TableHead>Temperature (°C)</TableHead>
                        <TableHead>Humidity (%)</TableHead>
                        <TableHead>Air Quality</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {correlationData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.x}</TableCell>
                          <TableCell>{row.y}</TableCell>
                          <TableCell>{row.z}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case "distribution":
        return (
          <div className="h-80">
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
                <div className="relative h-80">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 z-10"
                    onClick={() => setFullScreenChart(true)}
                  >
                    <Expand className="h-4 w-4" />
                  </Button>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill={getColorForColumn("airQuality")}
                      />
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
                        <TableHead>Count</TableHead>
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
          </div>
        );

      case "wind":
        return (
          <div className="h-80">
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
                <div className="relative h-80">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 z-10"
                    onClick={() => setFullScreenChart(true)}
                  >
                    <Expand className="h-4 w-4" />
                  </Button>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <XAxis dataKey="time" tickFormatter={formatXAxis} />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="windSpeed"
                        stroke={getColorForColumn("windSpeed")}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
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
                        <TableHead>Time</TableHead>
                        <TableHead>Wind Speed (km/h)</TableHead>
                        <TableHead>Wind Direction (°)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.time}</TableCell>
                          <TableCell>{row.windSpeed}</TableCell>
                          <TableCell>{row.windDirection}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      default:
        return (
          <div className="h-80">
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
                <div className="relative h-80">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 z-10"
                    onClick={() => setFullScreenChart(true)}
                  >
                    <Expand className="h-4 w-4" />
                  </Button>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <XAxis dataKey="time" tickFormatter={formatXAxis} />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke={getColorForColumn("temperature")}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="humidity"
                        stroke={getColorForColumn("humidity")}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="airQuality"
                        stroke={getColorForColumn("airQuality")}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
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
                        <TableHead>Time</TableHead>
                        <TableHead>Temperature (°C)</TableHead>
                        <TableHead>Humidity (%)</TableHead>
                        <TableHead>Air Quality</TableHead>
                        <TableHead>Wind Speed (km/h)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.time}</TableCell>
                          <TableCell>{row.temperature}</TableCell>
                          <TableCell>{row.humidity}</TableCell>
                          <TableCell>{row.airQuality}</TableCell>
                          <TableCell>{row.windSpeed}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
    }
  };

  return (
    <>
      {renderChart()}

      {/* Full Screen Chart Dialog */}
      <Dialog open={fullScreenChart} onOpenChange={setFullScreenChart}>
        <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {chartType === "temperature" && "Temperature Trends"}
              {chartType === "correlation" && "Humidity vs Temperature"}
              {chartType === "distribution" && "Air Quality Distribution"}
              {chartType === "wind" && "Wind Speed and Direction"}
              {chartType === "default" && "Environmental Metrics Overview"}
            </DialogTitle>
          </DialogHeader>
          <div className="h-[70vh]">
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
                <div className="h-[70vh]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "temperature" && (
                      <LineChart data={data}>
                        <XAxis dataKey="time" tickFormatter={formatXAxis} />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke={getColorForColumn("temperature")}
                          strokeWidth={2}
                          dot={true}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    )}
                    {chartType === "correlation" && (
                      <ScatterChart>
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
                        <ZAxis
                          type="number"
                          dataKey="z"
                          range={[60, 400]}
                          name="Air Quality"
                        />
                        <Tooltip
                          cursor={{ strokeDasharray: "3 3" }}
                          formatter={(value, name) => [value, name]}
                        />
                        <Scatter
                          name="Temperature vs Humidity"
                          data={correlationData}
                          fill={getColorForColumn("temperature")}
                        />
                      </ScatterChart>
                    )}
                    {chartType === "distribution" && (
                      <BarChart data={distributionData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="value"
                          fill={getColorForColumn("airQuality")}
                        />
                      </BarChart>
                    )}
                    {chartType === "wind" && (
                      <LineChart data={data}>
                        <XAxis dataKey="time" tickFormatter={formatXAxis} />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="windSpeed"
                          stroke={getColorForColumn("windSpeed")}
                          strokeWidth={2}
                          dot={true}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    )}
                    {chartType === "default" && (
                      <LineChart data={data}>
                        <XAxis dataKey="time" tickFormatter={formatXAxis} />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke={getColorForColumn("temperature")}
                          strokeWidth={2}
                          dot={true}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="humidity"
                          stroke={getColorForColumn("humidity")}
                          strokeWidth={2}
                          dot={true}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="airQuality"
                          stroke={getColorForColumn("airQuality")}
                          strokeWidth={2}
                          dot={true}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="table">
                <div className="h-[70vh] overflow-auto border rounded-md">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background">
                      {(chartType === "temperature" ||
                        chartType === "default" ||
                        chartType === "wind") && (
                        <TableRow>
                          <TableHead>Time</TableHead>
                          {chartType === "temperature" && (
                            <TableHead>Temperature (°C)</TableHead>
                          )}
                          {chartType === "wind" && (
                            <>
                              <TableHead>Wind Speed (km/h)</TableHead>
                              <TableHead>Wind Direction (°)</TableHead>
                            </>
                          )}
                          {chartType === "default" && (
                            <>
                              <TableHead>Temperature (°C)</TableHead>
                              <TableHead>Humidity (%)</TableHead>
                              <TableHead>Air Quality</TableHead>
                              <TableHead>Wind Speed (km/h)</TableHead>
                            </>
                          )}
                        </TableRow>
                      )}
                      {chartType === "correlation" && (
                        <TableRow>
                          <TableHead>Temperature (°C)</TableHead>
                          <TableHead>Humidity (%)</TableHead>
                          <TableHead>Air Quality</TableHead>
                        </TableRow>
                      )}
                      {chartType === "distribution" && (
                        <TableRow>
                          <TableHead>AQI Category</TableHead>
                          <TableHead>Count</TableHead>
                        </TableRow>
                      )}
                    </TableHeader>
                    <TableBody>
                      {(chartType === "temperature" ||
                        chartType === "default" ||
                        chartType === "wind") &&
                        data.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.time}</TableCell>
                            {chartType === "temperature" && (
                              <TableCell>{row.temperature}</TableCell>
                            )}
                            {chartType === "wind" && (
                              <>
                                <TableCell>{row.windSpeed}</TableCell>
                                <TableCell>{row.windDirection}</TableCell>
                              </>
                            )}
                            {chartType === "default" && (
                              <>
                                <TableCell>{row.temperature}</TableCell>
                                <TableCell>{row.humidity}</TableCell>
                                <TableCell>{row.airQuality}</TableCell>
                                <TableCell>{row.windSpeed}</TableCell>
                              </>
                            )}
                          </TableRow>
                        ))}
                      {chartType === "correlation" &&
                        correlationData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.x}</TableCell>
                            <TableCell>{row.y}</TableCell>
                            <TableCell>{row.z}</TableCell>
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
    </>
  );
}
