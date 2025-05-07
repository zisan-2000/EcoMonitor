"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Users,
  Server,
  Database,
  CloudRain,
  Droplet,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
} from "lucide-react";
import SummaryCards from "@/components/summary-cards";
import { fetchWeatherData, fetchWaterQualityData } from "@/lib/data";
import { DataTable } from "@/components/data-table";
import { getUser, getUserPermissions } from "@/lib/auth";
import { Overview } from "@/components/overview";
import { DataSummary } from "@/components/data-summary";
import { RecentActivity } from "@/components/recent-activity";
import { AllMetricsCharts } from "@/components/all-metrics-charts";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [weatherData, setWeatherData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [user, setUser] = useState<any>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    users: { total: 0, active: 0, new: 0 },
    sensors: { total: 0, online: 0, offline: 0, warning: 0 },
    storage: { used: 0, total: 0, percent: 0 },
    server: { status: "online", uptime: "99.9%", load: 0 },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get user and permissions
        const currentUser = getUser();
        setUser(currentUser);
        setPermissions(getUserPermissions());

        // Fetch data
        const weather = await fetchWeatherData();
        const water = await fetchWaterQualityData();

        setWeatherData(weather);
        setWaterData(water);

        // Set mock system status
        setSystemStatus({
          users: { total: 156, active: 42, new: 8 },
          sensors: { total: 24, online: 21, offline: 1, warning: 2 },
          storage: { used: 1.2, total: 5, percent: 24 },
          server: { status: "online", uptime: "99.9%", load: 32 },
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Define columns for the user table
  const userColumns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "lastActive", header: "Last Active" },
  ];

  // Mock user data
  const userData = [
    {
      id: 1,
      name: "Super Admin",
      email: "super@example.com",
      role: "Super Admin",
      status: "Active",
      lastActive: "Just now",
    },
    {
      id: 2,
      name: "Weather Admin",
      email: "weather@example.com",
      role: "Admin",
      status: "Active",
      lastActive: "5 minutes ago",
    },
    {
      id: 3,
      name: "Water Quality Admin",
      email: "water@example.com",
      role: "Admin",
      status: "Active",
      lastActive: "1 hour ago",
    },
    {
      id: 4,
      name: "System Admin",
      email: "system@example.com",
      role: "Admin",
      status: "Active",
      lastActive: "2 hours ago",
    },
    {
      id: 5,
      name: "Regular User",
      email: "user@example.com",
      role: "User",
      status: "Inactive",
      lastActive: "2 days ago",
    },
  ];

  // Check if user has permission for a specific feature
  const canAccess = (permission: string) => {
    if (user?.role === "super_admin") return true;
    return permissions.includes(permission);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <Activity className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={
              user?.role === "super_admin"
                ? "bg-primary/10 text-primary"
                : "bg-blue-500/10 text-blue-500"
            }
          >
            {user?.role === "super_admin"
              ? "Super Admin"
              : user?.name || "Admin"}
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* System Status Cards - Only visible to super admin and system admin */}
      {(user?.role === "super_admin" || permissions.includes("settings")) && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStatus.users.total}
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium">
                    {systemStatus.users.active}
                  </span>{" "}
                  active users
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="text-blue-500 font-medium">
                    +{systemStatus.users.new}
                  </span>{" "}
                  new this week
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sensors</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStatus.sensors.total}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="text-xs">
                  <span className="text-green-500 font-medium">
                    {systemStatus.sensors.online}
                  </span>
                  <p className="text-muted-foreground">Online</p>
                </div>
                <div className="text-xs">
                  <span className="text-amber-500 font-medium">
                    {systemStatus.sensors.warning}
                  </span>
                  <p className="text-muted-foreground">Warning</p>
                </div>
                <div className="text-xs">
                  <span className="text-red-500 font-medium">
                    {systemStatus.sensors.offline}
                  </span>
                  <p className="text-muted-foreground">Offline</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemStatus.storage.used} GB{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  / {systemStatus.storage.total} GB
                </span>
              </div>
              <div className="mt-2">
                <Progress
                  value={systemStatus.storage.percent}
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {systemStatus.storage.percent}% used
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Server Status
              </CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                <div className="text-2xl font-bold capitalize">
                  {systemStatus.server.status}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">
                    {systemStatus.server.uptime}
                  </span>{" "}
                  uptime
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">
                    {systemStatus.server.load}%
                  </span>{" "}
                  load
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Summary Cards */}
      <SummaryCards waterData={waterData} weatherData={weatherData} />

      {/* New Environmental Data Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="individual-charts">Individual Charts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Temperature
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-red-500"
                >
                  <path d="M14.5 4.5a3.5 3.5 0 0 0-7 0v9.5a5 5 0 1 0 7 0Z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.5°C</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-blue-500"
                >
                  <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2zM3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.389.389 0 0 0-.029-.518z" />
                  <path d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.945 11.945 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">
                  +5.4% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Air Quality
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-green-500"
                >
                  <path d="M12 3v19" />
                  <path d="M5 8c1.5 0 2.5-1.5 2.5-3S6.5 2 5 2 2.5 3.5 2.5 5 3.5 8 5 8Z" />
                  <path d="M5 16c1.5 0 2.5-1.5 2.5-3S6.5 10 5 10s-2.5 1.5-2.5 3 1 3 2.5 3Z" />
                  <path d="M19 8c1.5 0 2.5-1.5 2.5-3S20.5 2 19 2s-2.5 1.5-2.5 3 1 3 2.5 3Z" />
                  <path d="M19 16c1.5 0 2.5-1.5 2.5-3s-1-3-2.5-3-2.5 1.5-2.5 3 1 3 2.5 3Z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Good</div>
                <p className="text-xs text-muted-foreground">
                  AQI 42 (PM2.5: 12 μg/m³)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Wind Speed
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-slate-500"
                >
                  <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
                  <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
                  <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.3 km/h</div>
                <p className="text-xs text-muted-foreground">
                  -1.2% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Environmental Metrics Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Data Summary</CardTitle>
                <CardDescription>
                  Key metrics from the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataSummary />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="individual-charts" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Individual Metrics</CardTitle>
              <CardDescription>
                Detailed view of each environmental metric
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AllMetricsCharts />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Temperature Trends</CardTitle>
                <CardDescription>
                  Daily temperature readings over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview chartType="temperature" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Humidity vs Temperature</CardTitle>
                <CardDescription>Correlation analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Overview chartType="correlation" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Air Quality Distribution</CardTitle>
                <CardDescription>Distribution of AQI readings</CardDescription>
              </CardHeader>
              <CardContent>
                <Overview chartType="distribution" />
              </CardContent>
            </Card>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Wind Speed and Direction</CardTitle>
                <CardDescription>Wind patterns over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview chartType="wind" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Recent data collection and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Original System Management Tabs */}
      <Tabs defaultValue="overview" className="w-full mt-8">
        <TabsList
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${
              1 + // Overview tab
              (canAccess("users") ? 1 : 0) + // Users tab
              (canAccess("logs") ? 1 : 0) + // System tab
              (canAccess("logs") ? 1 : 0) // Logs tab
            }, minmax(0, 1fr))`,
          }}
        >
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          {canAccess("users") && (
            <TabsTrigger value="users">User Management</TabsTrigger>
          )}
          {canAccess("logs") && (
            <TabsTrigger value="system">System Status</TabsTrigger>
          )}
          {canAccess("logs") && (
            <TabsTrigger value="logs">System Logs</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {canAccess("weather") && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CloudRain className="h-5 w-5" />
                    Weather Data Overview
                  </CardTitle>
                  <CardDescription>
                    Summary of weather monitoring data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Data Points</h4>
                      <div className="text-2xl font-bold">
                        {weatherData.length.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        From{" "}
                        {weatherData.length > 0
                          ? new Date(
                              weatherData[0].date_time
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Latest Readings
                      </h4>
                      {weatherData.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Temperature
                            </p>
                            <p className="font-medium">
                              {weatherData[weatherData.length - 1].temp}°C
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Wind Speed
                            </p>
                            <p className="font-medium">
                              {weatherData[weatherData.length - 1].spd} km/h
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No data available
                        </p>
                      )}
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      View Full Weather Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {canAccess("water") && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplet className="h-5 w-5" />
                    Water Quality Overview
                  </CardTitle>
                  <CardDescription>
                    Summary of water quality monitoring data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Data Points</h4>
                      <div className="text-2xl font-bold">
                        {waterData.length.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        From{" "}
                        {waterData.length > 0
                          ? new Date(
                              waterData[0].date_time
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Latest Readings
                      </h4>
                      {waterData.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">pH</p>
                            <p className="font-medium">
                              {waterData[waterData.length - 1].ph}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">DO</p>
                            <p className="font-medium">
                              {waterData[waterData.length - 1].do} mg/L
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">ORP</p>
                            <p className="font-medium">
                              {waterData[waterData.length - 1].orp} mV
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No data available
                        </p>
                      )}
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      View Full Water Quality Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {(canAccess("logs") || user?.role === "super_admin") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  System Analytics
                </CardTitle>
                <CardDescription>
                  Overview of system performance and usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">API Requests</h4>
                    <div className="text-2xl font-bold">24.5k</div>
                    <p className="text-xs text-muted-foreground">
                      +12% from last week
                    </p>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Data Processing</h4>
                    <div className="text-2xl font-bold">3.2 GB</div>
                    <p className="text-xs text-muted-foreground">
                      +5% from last week
                    </p>
                    <Progress value={45} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Active Sessions</h4>
                    <div className="text-2xl font-bold">42</div>
                    <p className="text-xs text-muted-foreground">
                      -8% from last week
                    </p>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {canAccess("users") && (
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={userColumns}
                  data={userData}
                  searchColumn="name"
                  searchPlaceholder="Search users..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canAccess("logs") && (
          <TabsContent value="system" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  Monitor system health and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Server Status</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <h4 className="font-medium">API Server</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Uptime: 99.9%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Load: 32%
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <h4 className="font-medium">Database Server</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Uptime: 99.8%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Load: 45%
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                          <h4 className="font-medium">Storage Server</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Uptime: 98.5%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Load: 72%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Sensor Network</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Weather Sensors</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            Online:
                          </span>
                          <span className="font-medium">
                            {systemStatus.sensors.online} /{" "}
                            {systemStatus.sensors.total}
                          </span>
                        </div>
                        <Progress
                          value={
                            (systemStatus.sensors.online /
                              systemStatus.sensors.total) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">
                          Water Quality Sensors
                        </h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            Battery Status:
                          </span>
                          <span className="font-medium">75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      System Resources
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">CPU Usage</h4>
                        <div className="text-2xl font-bold mb-2">32%</div>
                        <Progress value={32} className="h-2" />
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Memory Usage</h4>
                        <div className="text-2xl font-bold mb-2">45%</div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Disk Usage</h4>
                        <div className="text-2xl font-bold mb-2">
                          {systemStatus.storage.percent}%
                        </div>
                        <Progress
                          value={systemStatus.storage.percent}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canAccess("logs") && (
          <TabsContent value="logs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>
                  View system events, warnings, and errors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Message
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Source
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="px-4 py-3 text-sm">
                          2023-05-07 14:32:10
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-500 border-green-500/20"
                            >
                              Success
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          System backup completed successfully
                        </td>
                        <td className="px-4 py-3 text-sm">Backup Service</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">
                          2023-05-07 13:45:22
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                            <Badge
                              variant="outline"
                              className="bg-amber-500/10 text-amber-500 border-amber-500/20"
                            >
                              Warning
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          High CPU usage detected
                        </td>
                        <td className="px-4 py-3 text-sm">
                          Monitoring Service
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">
                          2023-05-07 12:18:05
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-red-500 mr-2" />
                            <Badge variant="destructive">Error</Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          Failed to connect to sensor SN-1004
                        </td>
                        <td className="px-4 py-3 text-sm">Sensor Network</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">
                          2023-05-07 11:02:33
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-500 border-green-500/20"
                            >
                              Success
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          User 'admin@example.com' logged in
                        </td>
                        <td className="px-4 py-3 text-sm">
                          Authentication Service
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">
                          2023-05-07 10:45:12
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-500 border-green-500/20"
                            >
                              Success
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          Data synchronization completed
                        </td>
                        <td className="px-4 py-3 text-sm">Data Service</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing 5 of 256 logs
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </motion.div>
  );
}
