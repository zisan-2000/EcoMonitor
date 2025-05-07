// components/landing-page/FeaturesSection.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CloudRain,
  Droplet,
  BarChart3,
  Gauge,
  Waves,
  Wind,
} from "lucide-react";
import { WaveDivider } from "./WaveDivider";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const features = [
  {
    icon: <CloudRain className="h-8 w-8 text-blue-500" />,
    title: "Weather Analytics",
    description:
      "Comprehensive weather tracking with real-time updates and historical data visualization.",
    chart: (
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={[
            { name: "Jan", value: 12 },
            { name: "Feb", value: 19 },
            { name: "Mar", value: 15 },
            { name: "Apr", value: 22 },
            { name: "May", value: 26 },
            { name: "Jun", value: 30 },
          ]}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    ),
    color: "bg-blue-50",
  },
  {
    icon: <Droplet className="h-8 w-8 text-teal-500" />,
    title: "Water Quality",
    description:
      "Monitor pH levels, dissolved oxygen, turbidity and other critical water parameters.",
    chart: (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={[
            { name: "pH", value: 7.4 },
            { name: "O₂", value: 8.2 },
            { name: "Turbidity", value: 5.1 },
            { name: "Salinity", value: 3.2 },
            { name: "Temp", value: 22.5 },
          ]}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    ),
    color: "bg-teal-50",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
    title: "Advanced Insights",
    description:
      "AI-powered analytics with predictive modeling and anomaly detection.",
    chart: (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={[
              { name: "Normal", value: 75 },
              { name: "Warning", value: 15 },
              { name: "Alert", value: 10 },
            ]}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            <Cell fill="#8884d8" />
            <Cell fill="#ffbb28" />
            <Cell fill="#ff8042" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    ),
    color: "bg-purple-50",
  },
];

const FeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card
        className={`h-full border-0 shadow-lg hover:shadow-xl transition-all ${feature.color}`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-white shadow-sm">
              {feature.icon}
            </div>
            <CardTitle className="text-xl">{feature.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{feature.description}</p>
          <div className="h-[200px]">{feature.chart}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const FeaturesSection = () => {
  return (
    <section className="relative bg-white">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Advanced Monitoring Features
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform provides comprehensive environmental analytics with
            beautiful visualizations and real-time data.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>

      <WaveDivider color="#ffffff" type="sharp" flip />
    </section>
  );
};
