"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import dynamic from "next/dynamic";
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Thermometer,
  Droplets,
  Activity,
  Zap,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  Table,
  BarChart3,
  Map,
  Settings,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

const MapComponent = dynamic(() => import("@/components/charts/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

// Types
interface WaterData {
  Time: string;
  "Temp. (Deg.C)": number;
  "Temp. (Deg.C) at surface": number;
  pH: number;
  "pH at Surface": number;
  "DO (mg/L)": number;
  "DO (mg/L) at surface)": number;
  "Con. (mS/cm)": number;
  "Salinity (g/L)": number;
}

interface Alert {
  type: string;
  message: string;
  severity: "high" | "medium" | "low";
  timestamp: string;
  value: number;
  parameter: string;
}

interface Stats {
  min: string;
  max: string;
  avg: string;
  trend: number;
}

// Helper function to calculate summary stats
function getStats(data: WaterData[], key: keyof WaterData): Stats {
  const values = data
    .map((d) => d[key])
    .filter((v) => v !== null && v !== undefined && !isNaN(Number(v)))
    .map(Number);

  if (values.length === 0) return { min: "-", max: "-", avg: "-", trend: 0 };

  const min = Math.min(...values).toFixed(2);
  const max = Math.max(...values).toFixed(2);
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);

  // Calculate trend (last value vs first value)
  const trend =
    values.length > 1
      ? ((values[values.length - 1] - values[0]) / values[0]) * 100
      : 0;

  return { min, max, avg, trend };
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-200">
        <p className="font-semibold text-gray-800 mb-3 text-sm">{`Time: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between space-x-4 mb-1"
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-gray-600 font-medium">
                {entry.dataKey}:
              </span>
            </div>
            <span className="font-semibold text-gray-800 text-sm">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex justify-center items-center">
    <div className="text-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <div className="w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin absolute top-2 left-2"></div>
        <div className="w-12 h-12 border-4 border-transparent border-t-indigo-300 rounded-full animate-spin absolute top-4 left-4"></div>
      </div>
      <div className="mt-6 space-y-2">
        <p className="text-gray-700 font-semibold text-lg">
          Loading Water Quality Data
        </p>
        <p className="text-gray-500 text-sm">
          Fetching real-time monitoring information...
        </p>
      </div>
    </div>
  </div>
);

// Error component
const ErrorState = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex justify-center items-center">
    <div className="text-center max-w-md mx-auto p-8">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="w-10 h-10 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Data Unavailable
      </h3>
      <p className="text-gray-600 mb-6">
        Unable to load water quality data. Please check your connection and try
        again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
      >
        Retry
      </button>
    </div>
  </div>
);

export default function WaterDashboard() {
  const [data, setData] = useState<WaterData[]>([]);
  const [alertFilter, setAlertFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeView, setActiveView] = useState<"dashboard" | "table">(
    "dashboard"
  );
  const [sortConfig, setSortConfig] = useState<{
    key: keyof WaterData | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof WaterData>>(
    new Set([
      "Time",
      "Temp. (Deg.C)",
      "pH",
      "DO (mg/L)",
      "Con. (mS/cm)",
      "Salinity (g/L)",
    ])
  );

  const alertsPerPage = 8;
  const tableRowsPerPage = 10;

  // Alerts check with enhanced logic
  const getAlerts = useCallback((data: WaterData[]): Alert[] => {
    const alerts: Alert[] = [];

    data.forEach((d) => {
      if (d["DO (mg/L)"] !== undefined && d["DO (mg/L)"] < 4) {
        alerts.push({
          type: "oxygen",
          message: `Dissolved oxygen levels below optimal range`,
          severity:
            d["DO (mg/L)"] < 2 ? "high" : d["DO (mg/L)"] < 3 ? "medium" : "low",
          timestamp: d.Time,
          value: d["DO (mg/L)"],
          parameter: "DO (mg/L)",
        });
      }

      if (d["pH"] !== undefined && (d["pH"] < 6.5 || d["pH"] > 8.5)) {
        alerts.push({
          type: "ph",
          message: `pH levels outside safe range for aquatic life`,
          severity:
            d["pH"] < 5 || d["pH"] > 10
              ? "high"
              : d["pH"] < 6 || d["pH"] > 9
              ? "medium"
              : "low",
          timestamp: d.Time,
          value: d["pH"],
          parameter: "pH",
        });
      }

      if (d["Salinity (g/L)"] !== undefined && d["Salinity (g/L)"] > 1.5) {
        alerts.push({
          type: "salinity",
          message: `Elevated salinity levels detected`,
          severity:
            d["Salinity (g/L)"] > 3
              ? "high"
              : d["Salinity (g/L)"] > 2
              ? "medium"
              : "low",
          timestamp: d.Time,
          value: d["Salinity (g/L)"],
          parameter: "Salinity (g/L)",
        });
      }

      if (
        d["Temp. (Deg.C)"] !== undefined &&
        (d["Temp. (Deg.C)"] > 28 || d["Temp. (Deg.C)"] < 5)
      ) {
        alerts.push({
          type: "temperature",
          message: `Water temperature outside optimal range`,
          severity:
            d["Temp. (Deg.C)"] > 35 || d["Temp. (Deg.C)"] < 2
              ? "high"
              : "medium",
          timestamp: d.Time,
          value: d["Temp. (Deg.C)"],
          parameter: "Temperature",
        });
      }
    });

    return alerts.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }, []);

  // Fetch data with proper error handling
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(false);

      const response = await fetch("/api/water");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized calculations
  const allAlerts = useMemo(() => getAlerts(data), [data, getAlerts]);

  const filteredAlerts = useMemo(() => {
    return allAlerts.filter((alert) => {
      const matchesType = alertFilter === "all" || alert.type === alertFilter;
      const matchesSeverity =
        severityFilter === "all" || alert.severity === severityFilter;
      const matchesSearch =
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.parameter.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSeverity && matchesSearch;
    });
  }, [allAlerts, alertFilter, severityFilter, searchTerm]);

  // Table sorting and filtering
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key: keyof WaterData) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const toggleColumnVisibility = (column: keyof WaterData) => {
    const newVisible = new Set(visibleColumns);
    if (newVisible.has(column)) {
      newVisible.delete(column);
    } else {
      newVisible.add(column);
    }
    setVisibleColumns(newVisible);
  };

  // Pagination calculations
  const alertPagination = {
    indexOfLastAlert: currentPage * alertsPerPage,
    indexOfFirstAlert: (currentPage - 1) * alertsPerPage,
    totalPages: Math.ceil(filteredAlerts.length / alertsPerPage),
  };

  const currentAlerts = filteredAlerts.slice(
    alertPagination.indexOfFirstAlert,
    alertPagination.indexOfLastAlert
  );

  const tablePagination = {
    indexOfLastRow: currentPage * tableRowsPerPage,
    indexOfFirstRow: (currentPage - 1) * tableRowsPerPage,
    totalPages: Math.ceil(sortedData.length / tableRowsPerPage),
  };

  const currentTableData = sortedData.slice(
    tablePagination.indexOfFirstRow,
    tablePagination.indexOfLastRow
  );

  if (isLoading) return <LoadingSpinner />;
  if (error || !data.length) return <ErrorState />;

  return (
    <div className="min-h-screen ">
      <div className="p-6 space-y-8 ">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-6 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
              Water Quality Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Real-time monitoring and comprehensive analytics
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* View Toggle */}
            <div className="flex bg-white rounded-xl p-1 shadow-lg border border-gray-200">
              <button
                onClick={() => setActiveView("dashboard")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeView === "dashboard"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">Dashboard</span>
              </button>
              <button
                onClick={() => setActiveView("table")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeView === "table"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Table className="w-4 h-4" />
                <span className="font-medium">Table</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 text-gray-600 ${
                    isLoading ? "animate-spin" : ""
                  }`}
                />
                <span className="text-sm font-medium text-gray-700">
                  Refresh
                </span>
              </button>

              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>
        </div>

        {activeView === "dashboard" ? (
          <>
            {/* Enhanced Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Temperature Card */}
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-lg">
                      <Thermometer className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStats(data, "Temp. (Deg.C)").trend > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-xs font-medium text-gray-500">
                        {Math.abs(
                          getStats(data, "Temp. (Deg.C)").trend
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Temperature
                  </h3>
                  <div className="text-3xl font-bold text-blue-600 mb-3">
                    {getStats(data, "Temp. (Deg.C)").avg}°C
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Min: {getStats(data, "Temp. (Deg.C)").min}°C</span>
                    <span>Max: {getStats(data, "Temp. (Deg.C)").max}°C</span>
                  </div>
                </div>
              </div>

              {/* pH Card */}
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-lg">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStats(data, "pH").trend > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-xs font-medium text-gray-500">
                        {Math.abs(getStats(data, "pH").trend).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    pH Level
                  </h3>
                  <div className="text-3xl font-bold text-green-600 mb-3">
                    {getStats(data, "pH").avg}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Min: {getStats(data, "pH").min}</span>
                    <span>Max: {getStats(data, "pH").max}</span>
                  </div>
                </div>
              </div>

              {/* Dissolved Oxygen Card */}
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-lg">
                      <Droplets className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStats(data, "DO (mg/L)").trend > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-xs font-medium text-gray-500">
                        {Math.abs(getStats(data, "DO (mg/L)").trend).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Dissolved O₂
                  </h3>
                  <div className="text-3xl font-bold text-purple-600 mb-3">
                    {getStats(data, "DO (mg/L)").avg}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Min: {getStats(data, "DO (mg/L)").min}</span>
                    <span>Max: {getStats(data, "DO (mg/L)").max}</span>
                  </div>
                </div>
              </div>

              {/* Conductivity Card */}
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl shadow-lg">
                      <Zap className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStats(data, "Con. (mS/cm)").trend > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-xs font-medium text-gray-500">
                        {Math.abs(getStats(data, "Con. (mS/cm)").trend).toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Conductivity
                  </h3>
                  <div className="text-3xl font-bold text-orange-600 mb-3">
                    {getStats(data, "Con. (mS/cm)").avg}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Min: {getStats(data, "Con. (mS/cm)").min}</span>
                    <span>Max: {getStats(data, "Con. (mS/cm)").max}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Alerts Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-xl shadow-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Water Quality Alerts
                      </h2>
                      <p className="text-sm text-gray-500">
                        {filteredAlerts.length} alerts found •{" "}
                        {allAlerts.filter((a) => a.severity === "high").length}{" "}
                        high priority
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search alerts..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="pl-10 pr-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                      />
                    </div>

                    <select
                      value={alertFilter}
                      onChange={(e) => {
                        setAlertFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="oxygen">Oxygen</option>
                      <option value="ph">pH</option>
                      <option value="salinity">Salinity</option>
                      <option value="temperature">Temperature</option>
                    </select>

                    <select
                      value={severityFilter}
                      onChange={(e) => {
                        setSeverityFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="px-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    >
                      <option value="all">All Severities</option>
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                </div>
              </div>

              {allAlerts.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-6 shadow-lg">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    All Systems Normal!
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    No water quality issues detected. All parameters are within
                    safe ranges and monitoring is active.
                  </p>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-100">
                    {currentAlerts.map((alert, i) => (
                      <div
                        key={i}
                        className={`p-6 transition-all duration-200 hover:bg-gray-50/50 ${
                          alert.severity === "high"
                            ? "border-l-4 border-red-500 bg-red-50/30"
                            : alert.severity === "medium"
                            ? "border-l-4 border-yellow-500 bg-yellow-50/30"
                            : "border-l-4 border-blue-500 bg-blue-50/30"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div
                              className={`flex-shrink-0 p-3 rounded-xl shadow-lg ${
                                alert.severity === "high"
                                  ? "bg-gradient-to-br from-red-100 to-red-200"
                                  : alert.severity === "medium"
                                  ? "bg-gradient-to-br from-yellow-100 to-yellow-200"
                                  : "bg-gradient-to-br from-blue-100 to-blue-200"
                              }`}
                            >
                              <AlertTriangle
                                className={`w-5 h-5 ${
                                  alert.severity === "high"
                                    ? "text-red-600"
                                    : alert.severity === "medium"
                                    ? "text-yellow-600"
                                    : "text-blue-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 mb-2">
                                {alert.message}
                              </p>
                              <div className="flex items-center space-x-6 text-xs text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{alert.timestamp}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <span className="font-medium">
                                    {alert.parameter}:
                                  </span>
                                  <span className="font-semibold">
                                    {alert.value}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`px-4 py-2 rounded-full text-xs font-bold shadow-sm ${
                              alert.severity === "high"
                                ? "bg-red-100 text-red-800 border border-red-200"
                                : alert.severity === "medium"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {alert.severity.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Pagination */}
                  {filteredAlerts.length > alertsPerPage && (
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-semibold">
                          {alertPagination.indexOfFirstAlert + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold">
                          {Math.min(
                            alertPagination.indexOfLastAlert,
                            filteredAlerts.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold">
                          {filteredAlerts.length}
                        </span>{" "}
                        alerts
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                        >
                          Previous
                        </button>
                        <div className="flex space-x-1">
                          {Array.from(
                            { length: Math.min(5, alertPagination.totalPages) },
                            (_, i) => {
                              const page = i + 1;
                              return (
                                <button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${
                                    currentPage === page
                                      ? "bg-blue-600 text-white"
                                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            }
                          )}
                        </div>
                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, alertPagination.totalPages)
                            )
                          }
                          disabled={currentPage === alertPagination.totalPages}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Enhanced Charts Section */}
            <div className="space-y-8">
              {/* Temperature Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Temperature Trends
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Bottom and surface temperature monitoring
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                      <span className="font-medium">Bottom</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-cyan-500 rounded-full shadow-sm"></div>
                      <span className="font-medium">Surface</span>
                    </div>
                  </div>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient
                          id="tempGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                        <linearGradient
                          id="tempSurfaceGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#06B6D4"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#06B6D4"
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="Time" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="Temp. (Deg.C)"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        fill="url(#tempGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="Temp. (Deg.C) at surface"
                        stroke="#06B6D4"
                        strokeWidth={3}
                        fill="url(#tempSurfaceGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* pH Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      pH Level Analysis
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Acidity and alkalinity monitoring
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="px-4 py-2 bg-green-100 rounded-full text-green-700 font-medium border border-green-200">
                      Safe Range: 6.5 - 8.5
                    </div>
                  </div>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="Time" stroke="#6B7280" fontSize={12} />
                      <YAxis domain={[5, 10]} stroke="#6B7280" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="pH"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="pH at Surface"
                        stroke="#059669"
                        strokeWidth={3}
                        dot={{ fill: "#059669", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#059669", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Dissolved Oxygen Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Dissolved Oxygen Levels
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Critical for aquatic life health
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="px-4 py-2 bg-red-100 rounded-full text-red-700 font-medium border border-red-200">
                      Critical: &lt; 3 mg/L
                    </div>
                    <div className="px-4 py-2 bg-green-100 rounded-full text-green-700 font-medium border border-green-200">
                      Healthy: &gt; 5 mg/L
                    </div>
                  </div>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient
                          id="doGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8B5CF6"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8B5CF6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="Time" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="DO (mg/L)"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        fill="url(#doGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="DO (mg/L) at surface)"
                        stroke="#7C3AED"
                        strokeWidth={3}
                        fill="none"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Correlation Analysis */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Parameter Correlations
                  </h2>
                  <p className="text-gray-600">
                    Understanding relationships between water quality parameters
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Temperature vs Dissolved Oxygen
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#E5E7EB"
                          />
                          <XAxis
                            dataKey="Temp. (Deg.C)"
                            name="Temperature (°C)"
                            stroke="#6B7280"
                          />
                          <YAxis
                            dataKey="DO (mg/L)"
                            name="DO (mg/L)"
                            stroke="#6B7280"
                          />
                          <Tooltip
                            formatter={(value, name) => [value, name]}
                            labelFormatter={() => ""}
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              border: "none",
                              borderRadius: "12px",
                              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Scatter
                            name="Measurements"
                            data={data}
                            fill="#F59E0B"
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      pH vs Conductivity
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#E5E7EB"
                          />
                          <XAxis dataKey="pH" name="pH" stroke="#6B7280" />
                          <YAxis
                            dataKey="Con. (mS/cm)"
                            name="Conductivity"
                            stroke="#6B7280"
                          />
                          <Tooltip
                            formatter={(value, name) => [value, name]}
                            labelFormatter={() => ""}
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              border: "none",
                              borderRadius: "12px",
                              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Scatter
                            name="Measurements"
                            data={data}
                            fill="#EF4444"
                          />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Parameter Distribution Chart */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Recent Parameter Distribution
                  </h2>
                  <p className="text-gray-600">
                    Last 10 measurements across all parameters
                  </p>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.slice(-10)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="Time" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="Temp. (Deg.C)"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar dataKey="pH" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar
                        dataKey="DO (mg/L)"
                        fill="#8B5CF6"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="Salinity (g/L)"
                        fill="#F59E0B"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Enhanced Map Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Monitoring Locations
                  </h2>
                  <p className="text-gray-600">
                    Geographic distribution of water quality sensors
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Map className="w-4 h-4" />
                    <span className="font-medium">
                      {data.length} monitoring points
                    </span>
                  </div>
                </div>
              </div>
              <MapComponent data={data} />
            </div>
          </>
        ) : (
          /* Table View */
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Water Quality Data Table
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Detailed view of all monitoring data points
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Column Visibility Toggle */}
                  <div className="relative">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium">Columns</span>
                    </button>
                  </div>

                  <div className="text-sm text-gray-500">
                    {sortedData.length} total records
                  </div>
                </div>
              </div>

              {/* Column Visibility Controls */}
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.keys(data[0] || {}).map((column) => (
                  <button
                    key={column}
                    onClick={() =>
                      toggleColumnVisibility(column as keyof WaterData)
                    }
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                      visibleColumns.has(column as keyof WaterData)
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {visibleColumns.has(column as keyof WaterData) ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3" />
                    )}
                    <span>{column}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    {Array.from(visibleColumns).map((column) => (
                      <th
                        key={column}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100/50 transition-colors duration-200"
                        onClick={() => handleSort(column)}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{column}</span>
                          {sortConfig.key === column ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )
                          ) : (
                            <ArrowUpDown className="w-4 h-4 opacity-50" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentTableData.map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50/50 transition-colors duration-200"
                    >
                      {Array.from(visibleColumns).map((column) => (
                        <td
                          key={column}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {column === "Time" ? (
                            <div className="font-medium">{row[column]}</div>
                          ) : (
                            <div className="font-mono">
                              {typeof row[column] === "number"
                                ? row[column].toFixed(2)
                                : row[column]}
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Pagination */}
            {sortedData.length > tableRowsPerPage && (
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-semibold">
                    {tablePagination.indexOfFirstRow + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold">
                    {Math.min(
                      tablePagination.indexOfLastRow,
                      sortedData.length
                    )}
                  </span>{" "}
                  of <span className="font-semibold">{sortedData.length}</span>{" "}
                  records
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                  >
                    Previous
                  </button>
                  <div className="flex space-x-1">
                    {Array.from(
                      { length: Math.min(5, tablePagination.totalPages) },
                      (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, tablePagination.totalPages)
                      )
                    }
                    disabled={currentPage === tablePagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
