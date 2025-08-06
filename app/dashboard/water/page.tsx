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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from "recharts";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
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
  Sun,
  Moon,
  Beaker,
  Waves,
  MapPin,
  Clock,
  AlertCircle,
  Info,
} from "lucide-react";
import { ExportDropdown } from "@/components/export-dropdown";

const EnhancedMapComponent = dynamic(
  () => import("@/components/charts/enhanced-map-component"),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
      </div>
    ),
  }
);

// Enhanced Types
interface WaterData {
  Date: string;
  Time: string;
  DateTime: string;
  "Temp. (Deg.C)": number;
  "Temp. (Deg.C) at surface": number;
  pH: number;
  "pH at Surface": number;
  "Redox (mV)": number;
  "Redox (mV) at surface": number;
  "DO (mg/L)": number;
  "DO (mg/L) at surface)": number;
  "Con. (mS/cm)": number;
  "Salinity (g/L)": number;
  "Latitude (DD)": number;
  "Longitude (DD)": number;
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

// Enhanced Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  const { theme } = useTheme();

  if (active && payload && payload.length) {
    return (
      <div
        className={`backdrop-blur-sm p-4 rounded-xl shadow-2xl border ${
          theme === "dark"
            ? "bg-gray-800/95 border-gray-700"
            : "bg-white/95 border-gray-200"
        }`}
      >
        <p
          className={`font-semibold mb-3 text-sm ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          {`Time: ${label}`}
        </p>
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
              <span
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {entry.dataKey}:
              </span>
            </div>
            <span
              className={`font-semibold text-sm ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {typeof entry.value === "number"
                ? entry.value.toFixed(2)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Loading component
const LoadingSpinner = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex justify-center items-center ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-white"
      }`}
    >
      <div className="text-center">
        <div className="relative">
          <div
            className={`w-20 h-20 border-4 rounded-full  ${
              theme === "dark"
                ? "border-gray-700 border-t-blue-400"
                : "border-blue-200 border-t-blue-600"
            }`}
          ></div>
          <div
            className={`w-16 h-16 border-4 border-transparent rounded-full animate-spin absolute top-2 left-2 ${
              theme === "dark" ? "border-t-cyan-300" : "border-t-cyan-400"
            }`}
          ></div>
          <div
            className={`w-12 h-12 border-4 border-transparent rounded-full animate-spin absolute top-4 left-4 ${
              theme === "dark" ? "border-t-indigo-200" : "border-t-indigo-300"
            }`}
          ></div>
        </div>
        <div className="mt-6 space-y-2">
          <p
            className={`font-semibold text-lg ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Loading Water Quality Data
          </p>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Fetching real-time monitoring information...
          </p>
        </div>
      </div>
    </div>
  );
};

// Error component
const ErrorState = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex justify-center items-center ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-white"
      }`}
    >
      <div className="text-center max-w-md mx-auto p-8">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            theme === "dark" ? "bg-red-900/30" : "bg-red-100"
          }`}
        >
          <AlertTriangle
            className={`w-10 h-10 ${
              theme === "dark" ? "text-red-400" : "text-red-600"
            }`}
          />
        </div>
        <h3
          className={`text-xl font-semibold mb-2 ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Data Unavailable
        </h3>
        <p
          className={`mb-6 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Unable to load water quality data. Please check your connection and
          try again.
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
};

export default function WaterDashboard() {
  const { theme, setTheme } = useTheme();
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
      "DateTime",
      "Temp. (Deg.C)",
      "pH",
      "DO (mg/L)",
      "Redox (mV)",
      "Con. (mS/cm)",
      "Salinity (g/L)",
    ])
  );

  const alertsPerPage = 8;
  const tableRowsPerPage = 10;

  // Enhanced alerts check with redox monitoring
  const getAlerts = useCallback((data: WaterData[]): Alert[] => {
    const alerts: Alert[] = [];

    data.forEach((d) => {
      // Dissolved Oxygen alerts
      if (d["DO (mg/L)"] !== undefined && d["DO (mg/L)"] < 4) {
        alerts.push({
          type: "oxygen",
          message: `Dissolved oxygen levels below optimal range`,
          severity:
            d["DO (mg/L)"] < 2 ? "high" : d["DO (mg/L)"] < 3 ? "medium" : "low",
          timestamp: d.DateTime,
          value: d["DO (mg/L)"],
          parameter: "DO (mg/L)",
        });
      }

      // pH alerts
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
          timestamp: d.DateTime,
          value: d["pH"],
          parameter: "pH",
        });
      }

      // Redox alerts
      if (
        d["Redox (mV)"] !== undefined &&
        (d["Redox (mV)"] < 100 || d["Redox (mV)"] > 400)
      ) {
        alerts.push({
          type: "redox",
          message: `Redox potential indicates water quality concerns`,
          severity:
            d["Redox (mV)"] < 50 || d["Redox (mV)"] > 500 ? "high" : "medium",
          timestamp: d.DateTime,
          value: d["Redox (mV)"],
          parameter: "Redox (mV)",
        });
      }

      // Salinity alerts
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
          timestamp: d.DateTime,
          value: d["Salinity (g/L)"],
          parameter: "Salinity (g/L)",
        });
      }

      // Temperature alerts
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
          timestamp: d.DateTime,
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

  // Prepare radar chart data
  const radarData = useMemo(() => {
    if (data.length === 0) return [];

    const latest = data[data.length - 1];
    return [
      {
        parameter: "Temperature",
        value: Math.min((latest["Temp. (Deg.C)"] / 35) * 100, 100),
        fullMark: 100,
      },
      {
        parameter: "pH",
        value: Math.min((latest.pH / 14) * 100, 100),
        fullMark: 100,
      },
      {
        parameter: "DO",
        value: Math.min((latest["DO (mg/L)"] / 15) * 100, 100),
        fullMark: 100,
      },
      {
        parameter: "Redox",
        value: Math.min((latest["Redox (mV)"] / 500) * 100, 100),
        fullMark: 100,
      },
      {
        parameter: "Conductivity",
        value: Math.min((latest["Con. (mS/cm)"] / 2) * 100, 100),
        fullMark: 100,
      },
      {
        parameter: "Salinity",
        value: Math.min((latest["Salinity (g/L)"] / 5) * 100, 100),
        fullMark: 100,
      },
    ];
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error || !data.length) return <ErrorState />;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-white"
      }`}
    >
      <div className=" px-4 py-6 space-y-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-6 lg:space-y-0">
          <div className="space-y-2">
            <h1
              className={`text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                theme === "dark"
                  ? "from-blue-400 via-cyan-400 to-indigo-400"
                  : "from-blue-600 via-cyan-600 to-indigo-600"
              }`}
            >
              Water Quality Dashboard
            </h1>
            <p
              className={`text-lg ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Real-time monitoring and comprehensive analytics
            </p>
            <div
              className={`flex items-center space-x-4 text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{data.length} monitoring points</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Theme Toggle */}
            {/* <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg transition-all duration-200 border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200"
                  : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {theme === "dark" ? "Light" : "Dark"}
              </span>
            </button> */}

            {/* View Toggle */}
            <div
              className={`flex rounded-xl p-1 shadow-lg border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <button
                onClick={() => setActiveView("dashboard")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeView === "dashboard"
                    ? "bg-blue-600 text-white shadow-md"
                    : theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700"
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
                    : theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700"
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
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border disabled:opacity-50 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200"
                    : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="text-sm font-medium">Refresh</span>
              </button>

              <ExportDropdown
                data={data}
                alerts={allAlerts}
                onExport={(type) => console.log(`Exported as ${type}`)}
              />
            </div>
          </div>
        </div>

        {activeView === "dashboard" ? (
          <>
            {/* Enhanced Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Temperature Card */}
              <div
                className={`group relative rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border overflow-hidden ${
                  theme === "dark"
                    ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border-white/50 backdrop-blur-sm"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl shadow-lg">
                      <Thermometer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStats(data, "Temp. (Deg.C)").trend > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {Math.abs(
                          getStats(data, "Temp. (Deg.C)").trend
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Temperature
                  </h3>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                    {getStats(data, "Temp. (Deg.C)").avg}°C
                  </div>
                  <div
                    className={`flex justify-between text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <span>Min: {getStats(data, "Temp. (Deg.C)").min}°C</span>
                    <span>Max: {getStats(data, "Temp. (Deg.C)").max}°C</span>
                  </div>
                </div>
              </div>

              {/* pH Card */}
              <div
                className={`group relative rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border overflow-hidden ${
                  theme === "dark"
                    ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border-white/50 backdrop-blur-sm"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-xl shadow-lg">
                      <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStats(data, "pH").trend > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {Math.abs(getStats(data, "pH").trend).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    pH Level
                  </h3>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-3">
                    {getStats(data, "pH").avg}
                  </div>
                  <div
                    className={`flex justify-between text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <span>Min: {getStats(data, "pH").min}</span>
                    <span>Max: {getStats(data, "pH").max}</span>
                  </div>
                </div>
              </div>

              {/* Dissolved Oxygen Card */}
              <div
                className={`group relative rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border overflow-hidden ${
                  theme === "dark"
                    ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border-white/50 backdrop-blur-sm"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-xl shadow-lg">
                      <Droplets className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStats(data, "DO (mg/L)").trend > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {Math.abs(getStats(data, "DO (mg/L)").trend).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Dissolved O₂
                  </h3>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                    {getStats(data, "DO (mg/L)").avg}
                  </div>
                  <div
                    className={`flex justify-between text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <span>Min: {getStats(data, "DO (mg/L)").min}</span>
                    <span>Max: {getStats(data, "DO (mg/L)").max}</span>
                  </div>
                </div>
              </div>

              {/* Redox Card */}
              <div
                className={`group relative rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border overflow-hidden ${
                  theme === "dark"
                    ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border-white/50 backdrop-blur-sm"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 rounded-xl shadow-lg">
                      <Beaker className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStats(data, "Redox (mV)").trend > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {Math.abs(getStats(data, "Redox (mV)").trend).toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Redox Potential
                  </h3>
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">
                    {getStats(data, "Redox (mV)").avg}
                  </div>
                  <div
                    className={`flex justify-between text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <span>Min: {getStats(data, "Redox (mV)").min}</span>
                    <span>Max: {getStats(data, "Redox (mV)").max}</span>
                  </div>
                </div>
              </div>

              {/* Conductivity Card */}
              <div
                className={`group relative rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border overflow-hidden ${
                  theme === "dark"
                    ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border-white/50 backdrop-blur-sm"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-xl shadow-lg">
                      <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex items-center space-x-1">
                      {getStats(data, "Con. (mS/cm)").trend > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {Math.abs(getStats(data, "Con. (mS/cm)").trend).toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Conductivity
                  </h3>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-3">
                    {getStats(data, "Con. (mS/cm)").avg}
                  </div>
                  <div
                    className={`flex justify-between text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <span>Min: {getStats(data, "Con. (mS/cm)").min}</span>
                    <span>Max: {getStats(data, "Con. (mS/cm)").max}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Water Quality Overview with Radar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div
                className={`lg:col-span-2 rounded-2xl shadow-xl p-8 border ${
                  theme === "dark"
                    ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border-white/50 backdrop-blur-sm"
                }`}
              >
                <div className="mb-8">
                  <h2
                    className={`text-2xl font-bold mb-2 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Multi-Parameter Trends
                  </h2>
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Comprehensive view of all water quality parameters over time
                  </p>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={data.slice(-50)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                      />
                      <XAxis
                        dataKey="Time"
                        stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                        fontSize={12}
                      />
                      <YAxis
                        stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                        fontSize={12}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="Temp. (Deg.C)"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                        stroke="#3B82F6"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="pH"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="DO (mg/L)"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Bar dataKey="Redox (mV)" fill="#6366F1" opacity={0.6} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Water Quality Radar Chart */}
              <div
                className={`rounded-2xl shadow-xl p-8 border ${
                  theme === "dark"
                    ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border-white/50 backdrop-blur-sm"
                }`}
              >
                <div className="mb-8">
                  <h2
                    className={`text-2xl font-bold mb-2 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Current Status
                  </h2>
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Latest parameter readings
                  </p>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid
                        stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                      />
                      <PolarAngleAxis
                        dataKey="parameter"
                        tick={{
                          fill: theme === "dark" ? "#9CA3AF" : "#6B7280",
                          fontSize: 12,
                        }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{
                          fill: theme === "dark" ? "#9CA3AF" : "#6B7280",
                          fontSize: 10,
                        }}
                      />
                      <Radar
                        name="Current Values"
                        dataKey="value"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Enhanced Alerts Section */}
            <div
              className={`rounded-2xl shadow-xl border overflow-hidden ${
                theme === "dark"
                  ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-sm"
                  : "bg-white/80 border-white/50 backdrop-blur-sm"
              }`}
            >
              <div
                className={`p-6 border-b ${
                  theme === "dark" ? "border-gray-700" : "border-gray-100"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-xl shadow-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h2
                        className={`text-2xl font-bold ${
                          theme === "dark" ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        Water Quality Alerts
                      </h2>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {filteredAlerts.length} alerts found •{" "}
                        {allAlerts.filter((a) => a.severity === "high").length}{" "}
                        high priority
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="relative">
                      <Search
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                          theme === "dark" ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="Search alerts..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        className={`pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm ${
                          theme === "dark"
                            ? "bg-gray-700/90 border-gray-600 text-gray-200 placeholder-gray-400"
                            : "bg-white/90 border-gray-200 text-gray-900 placeholder-gray-500"
                        }`}
                      />
                    </div>
                    <select
                      value={alertFilter}
                      onChange={(e) => {
                        setAlertFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm ${
                        theme === "dark"
                          ? "bg-gray-700/90 border-gray-600 text-gray-200"
                          : "bg-white/90 border-gray-200 text-gray-900"
                      }`}
                    >
                      <option value="all">All Types</option>
                      <option value="oxygen">Oxygen</option>
                      <option value="ph">pH</option>
                      <option value="redox">Redox</option>
                      <option value="salinity">Salinity</option>
                      <option value="temperature">Temperature</option>
                    </select>
                    <select
                      value={severityFilter}
                      onChange={(e) => {
                        setSeverityFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm ${
                        theme === "dark"
                          ? "bg-gray-700/90 border-gray-600 text-gray-200"
                          : "bg-white/90 border-gray-200 text-gray-900"
                      }`}
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
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-full mb-6 shadow-lg">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3
                    className={`text-xl font-semibold mb-3 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    All Systems Normal!
                  </h3>
                  <p
                    className={`max-w-md mx-auto ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    No water quality issues detected. All parameters are within
                    safe ranges and monitoring is active.
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className={`divide-y ${
                      theme === "dark" ? "divide-gray-700" : "divide-gray-100"
                    }`}
                  >
                    {currentAlerts.map((alert, i) => (
                      <div
                        key={i}
                        className={`p-6 transition-all duration-200 ${
                          theme === "dark"
                            ? "hover:bg-gray-700/50"
                            : "hover:bg-gray-50/50"
                        } ${
                          alert.severity === "high"
                            ? `border-l-4 border-red-500 ${
                                theme === "dark"
                                  ? "bg-red-900/20"
                                  : "bg-red-50/30"
                              }`
                            : alert.severity === "medium"
                            ? `border-l-4 border-yellow-500 ${
                                theme === "dark"
                                  ? "bg-yellow-900/20"
                                  : "bg-yellow-50/30"
                              }`
                            : `border-l-4 border-blue-500 ${
                                theme === "dark"
                                  ? "bg-blue-900/20"
                                  : "bg-blue-50/30"
                              }`
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div
                              className={`flex-shrink-0 p-3 rounded-xl shadow-lg ${
                                alert.severity === "high"
                                  ? "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50"
                                  : alert.severity === "medium"
                                  ? "bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/50 dark:to-yellow-800/50"
                                  : "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50"
                              }`}
                            >
                              <AlertTriangle
                                className={`w-5 h-5 ${
                                  alert.severity === "high"
                                    ? "text-red-600 dark:text-red-400"
                                    : alert.severity === "medium"
                                    ? "text-yellow-600 dark:text-yellow-400"
                                    : "text-blue-600 dark:text-blue-400"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-semibold mb-2 ${
                                  theme === "dark"
                                    ? "text-gray-200"
                                    : "text-gray-800"
                                }`}
                              >
                                {alert.message}
                              </p>
                              <div
                                className={`flex items-center space-x-6 text-xs ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
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
                                ? "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
                                : alert.severity === "medium"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700"
                                : "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700"
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
                    <div
                      className={`px-6 py-4 border-t flex items-center justify-between ${
                        theme === "dark"
                          ? "bg-gray-700/50 border-gray-700"
                          : "bg-gray-50/50 border-gray-100"
                      }`}
                    >
                      <div
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
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
                          className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                            theme === "dark"
                              ? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
                              : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                          }`}
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
                                      : theme === "dark"
                                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
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
                          className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                            theme === "dark"
                              ? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
                              : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                          }`}
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
              <div
                className={`rounded-2xl shadow-xl p-8 border ${
                  theme === "dark"
                    ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border-white/50 backdrop-blur-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2
                      className={`text-2xl font-bold ${
                        theme === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      Temperature Trends
                    </h2>
                    <p
                      className={`mt-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Bottom and surface temperature monitoring
                    </p>
                  </div>
                  <div
                    className={`flex items-center space-x-4 text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
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
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                      />
                      <XAxis
                        dataKey="Time"
                        stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                        fontSize={12}
                      />
                      <YAxis
                        stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                        fontSize={12}
                      />
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

              {/* Redox Potential Chart */}
              <div
                className={`rounded-2xl shadow-xl p-8 border ${
                  theme === "dark"
                    ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border-white/50 backdrop-blur-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2
                      className={`text-2xl font-bold ${
                        theme === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      Redox Potential Analysis
                    </h2>
                    <p
                      className={`mt-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Oxidation-reduction potential monitoring
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div
                      className={`px-4 py-2 rounded-full font-medium border ${
                        theme === "dark"
                          ? "bg-green-900/30 text-green-300 border-green-700"
                          : "bg-green-100 text-green-700 border-green-200"
                      }`}
                    >
                      Optimal: 150-350 mV
                    </div>
                  </div>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                      />
                      <XAxis
                        dataKey="Time"
                        stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                        fontSize={12}
                      />
                      <YAxis
                        stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                        fontSize={12}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="Redox (mV)"
                        stroke="#6366F1"
                        strokeWidth={3}
                        dot={{ fill: "#6366F1", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#6366F1", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Redox (mV) at surface"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* pH Chart */}
              <div
                className={`rounded-2xl shadow-xl p-8 border ${
                  theme === "dark"
                    ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border-white/50 backdrop-blur-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2
                      className={`text-2xl font-bold ${
                        theme === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      pH Level Analysis
                    </h2>
                    <p
                      className={`mt-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Acidity and alkalinity monitoring
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div
                      className={`px-4 py-2 rounded-full font-medium border ${
                        theme === "dark"
                          ? "bg-green-900/30 text-green-300 border-green-700"
                          : "bg-green-100 text-green-700 border-green-200"
                      }`}
                    >
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
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                      />
                      <XAxis
                        dataKey="Time"
                        stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                        fontSize={12}
                      />
                      <YAxis
                        domain={[5, 10]}
                        stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                        fontSize={12}
                      />
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
              <div
                className={`rounded-2xl shadow-xl p-8 border ${
                  theme === "dark"
                    ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border-white/50 backdrop-blur-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2
                      className={`text-2xl font-bold ${
                        theme === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      Dissolved Oxygen Levels
                    </h2>
                    <p
                      className={`mt-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Critical for aquatic life health
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div
                      className={`px-4 py-2 rounded-full font-medium border ${
                        theme === "dark"
                          ? "bg-red-900/30 text-red-300 border-red-700"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      Critical: &lt; 3 mg/L
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full font-medium border ${
                        theme === "dark"
                          ? "bg-green-900/30 text-green-300 border-green-700"
                          : "bg-green-100 text-green-700 border-green-200"
                      }`}
                    >
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
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                      />
                      <XAxis
                        dataKey="Time"
                        stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                        fontSize={12}
                      />
                      <YAxis
                        stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                        fontSize={12}
                      />
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
              <div
                className={`rounded-2xl shadow-xl p-8 border ${
                  theme === "dark"
                    ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border-white/50 backdrop-blur-sm"
                }`}
              >
                <div className="mb-8">
                  <h2
                    className={`text-2xl font-bold mb-2 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Parameter Correlations
                  </h2>
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Understanding relationships between water quality parameters
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-4 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Temperature vs Dissolved Oxygen
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                          />
                          <XAxis
                            dataKey="Temp. (Deg.C)"
                            name="Temperature (°C)"
                            stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                          />
                          <YAxis
                            dataKey="DO (mg/L)"
                            name="DO (mg/L)"
                            stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                          />
                          <Tooltip
                            formatter={(value, name) => [value, name]}
                            labelFormatter={() => ""}
                            contentStyle={{
                              backgroundColor:
                                theme === "dark"
                                  ? "rgba(31, 41, 55, 0.95)"
                                  : "rgba(255, 255, 255, 0.95)",
                              border: "none",
                              borderRadius: "12px",
                              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                              color: theme === "dark" ? "#F3F4F6" : "#111827",
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
                    <h3
                      className={`text-lg font-semibold mb-4 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      pH vs Redox Potential
                    </h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                          />
                          <XAxis
                            dataKey="pH"
                            name="pH"
                            stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                          />
                          <YAxis
                            dataKey="Redox (mV)"
                            name="Redox (mV)"
                            stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                          />
                          <Tooltip
                            formatter={(value, name) => [value, name]}
                            labelFormatter={() => ""}
                            contentStyle={{
                              backgroundColor:
                                theme === "dark"
                                  ? "rgba(31, 41, 55, 0.95)"
                                  : "rgba(255, 255, 255, 0.95)",
                              border: "none",
                              borderRadius: "12px",
                              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                              color: theme === "dark" ? "#F3F4F6" : "#111827",
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
              <div
                className={`rounded-2xl shadow-xl p-8 border ${
                  theme === "dark"
                    ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-sm"
                    : "bg-white/80 border-white/50 backdrop-blur-sm"
                }`}
              >
                <div className="mb-8">
                  <h2
                    className={`text-2xl font-bold mb-2 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Recent Parameter Distribution
                  </h2>
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Last 10 measurements across all parameters
                  </p>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.slice(-10)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === "dark" ? "#374151" : "#E5E7EB"}
                      />
                      <XAxis
                        dataKey="Time"
                        stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                        fontSize={12}
                      />
                      <YAxis
                        stroke={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                        fontSize={12}
                      />
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
                        dataKey="Redox (mV)"
                        fill="#6366F1"
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
            <div
              className={`rounded-2xl shadow-xl p-8 border ${
                theme === "dark"
                  ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-sm"
                  : "bg-white/80 border-white/50 backdrop-blur-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2
                    className={`text-2xl font-bold mb-2 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Monitoring Locations
                  </h2>
                  <p
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Geographic distribution of water quality sensors
                  </p>
                </div>
                <div
                  className={`flex items-center space-x-4 text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Map className="w-4 h-4" />
                    <span className="font-medium">
                      {data.length} monitoring points
                    </span>
                  </div>
                </div>
              </div>
              <EnhancedMapComponent data={data} />
            </div>
          </>
        ) : (
          /* Table View */
          <div
            className={`rounded-2xl shadow-xl border overflow-hidden ${
              theme === "dark"
                ? "bg-gray-800/80 border-gray-700/50 backdrop-blur-sm"
                : "bg-white/80 border-white/50 backdrop-blur-sm"
            }`}
          >
            <div
              className={`p-6 border-b ${
                theme === "dark" ? "border-gray-700" : "border-gray-100"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h2
                    className={`text-2xl font-bold ${
                      theme === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Water Quality Data Table
                  </h2>
                  <p
                    className={`mt-1 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Detailed view of all monitoring data points
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button
                      className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors duration-200 ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200"
                          : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium">Columns</span>
                    </button>
                  </div>
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
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
                        ? "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700"
                        : theme === "dark"
                        ? "bg-gray-700 text-gray-300 border border-gray-600"
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
                <thead
                  className={`${
                    theme === "dark" ? "bg-gray-700/50" : "bg-gray-50/50"
                  }`}
                >
                  <tr>
                    {Array.from(visibleColumns).map((column) => (
                      <th
                        key={column}
                        className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors duration-200 ${
                          theme === "dark"
                            ? "text-gray-300 hover:bg-gray-600/50"
                            : "text-gray-600 hover:bg-gray-100/50"
                        }`}
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
                <tbody
                  className={`divide-y ${
                    theme === "dark" ? "divide-gray-700" : "divide-gray-100"
                  }`}
                >
                  {currentTableData.map((row, index) => (
                    <tr
                      key={index}
                      className={`transition-colors duration-200 ${
                        theme === "dark"
                          ? "hover:bg-gray-700/50"
                          : "hover:bg-gray-50/50"
                      }`}
                    >
                      {Array.from(visibleColumns).map((column) => (
                        <td
                          key={column}
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            theme === "dark" ? "text-gray-200" : "text-gray-900"
                          }`}
                        >
                          {column === "DateTime" ||
                          column === "Date" ||
                          column === "Time" ? (
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
              <div
                className={`px-6 py-4 border-t flex items-center justify-between ${
                  theme === "dark"
                    ? "bg-gray-700/50 border-gray-700"
                    : "bg-gray-50/50 border-gray-100"
                }`}
              >
                <div
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
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
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                      theme === "dark"
                        ? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                    }`}
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
                                : theme === "dark"
                                ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
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
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                      theme === "dark"
                        ? "border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                    }`}
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
