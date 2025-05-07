// components/landing-page/DataVisualizationSection.tsx
"use client";

import { motion } from "framer-motion";
import { WaveDivider } from "./WaveDivider";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Scatter,
} from "recharts";

const temperatureData = [
  { month: "Jan", temp: 12, rainfall: 120 },
  { month: "Feb", temp: 15, rainfall: 90 },
  { month: "Mar", temp: 18, rainfall: 80 },
  { month: "Apr", temp: 22, rainfall: 70 },
  { month: "May", temp: 26, rainfall: 60 },
  { month: "Jun", temp: 30, rainfall: 40 },
];

const waterQualityData = [
  { parameter: "pH", value: 7.4, optimalMin: 6.5, optimalMax: 8.5 },
  { parameter: "DO", value: 8.2, optimalMin: 6, optimalMax: 9 },
  { parameter: "Turbidity", value: 5.1, optimalMin: 0, optimalMax: 10 },
  { parameter: "Salinity", value: 3.2, optimalMin: 0, optimalMax: 5 },
  { parameter: "Temp", value: 22.5, optimalMin: 18, optimalMax: 25 },
];

const anomalyData = [
  { day: 1, value: 12, anomaly: false },
  { day: 2, value: 14, anomaly: false },
  { day: 3, value: 11, anomaly: false },
  { day: 4, value: 18, anomaly: true },
  { day: 5, value: 13, anomaly: false },
  { day: 6, value: 15, anomaly: false },
  { day: 7, value: 9, anomaly: true },
];

export const DataVisualizationSection = () => {
  return (
    <section className="relative bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Interactive Data Visualizations
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore your environmental data through beautiful, interactive
            charts and graphs.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Temperature and Rainfall Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Temperature & Rainfall Trends
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#14b8a6" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temp"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Temperature (°C)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rainfall"
                    stroke="#14b8a6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Rainfall (mm)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Water Quality Chart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Water Quality Parameters
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={waterQualityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="parameter" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="optimalMax"
                    fill="#d1fae5"
                    name="Optimal Max"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="optimalMin"
                    fill="#ecfdf5"
                    name="Optimal Min"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="value"
                    fill="#10b981"
                    name="Current Value"
                    radius={[4, 4, 0, 0]}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Anomaly Detection Chart */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Anomaly Detection
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={anomalyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={({ key, ...props }) => {
                      const isAnomaly = anomalyData[props.index].anomaly;
                      return (
                        <circle
                          {...props}
                          r={isAnomaly ? 6 : 4}
                          fill={isAnomaly ? "#ef4444" : "#3b82f6"}
                          stroke={isAnomaly ? "#b91c1c" : "#1d4ed8"}
                          strokeWidth={isAnomaly ? 2 : 1}
                        />
                      );
                    }}
                    name="Value"
                  />
                  <Scatter
                    data={anomalyData.filter((d) => d.anomaly)}
                    dataKey="value"
                    fill="#ef4444"
                    name="Anomaly"
                    shape="diamond"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      <WaveDivider color="#f8fafc" type="double" />
    </section>
  );
};
