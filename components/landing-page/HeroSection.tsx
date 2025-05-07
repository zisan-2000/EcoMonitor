// components/landing-page/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { WaveDivider } from "./WaveDivider";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";

const data = [
  { name: "Jan", temp: 12, rainfall: 40, quality: 80 },
  { name: "Feb", temp: 15, rainfall: 30, quality: 85 },
  { name: "Mar", temp: 18, rainfall: 20, quality: 82 },
  { name: "Apr", temp: 22, rainfall: 25, quality: 88 },
  { name: "May", temp: 26, rainfall: 15, quality: 90 },
  { name: "Jun", temp: 30, rainfall: 5, quality: 87 },
  { name: "Jul", temp: 32, rainfall: 10, quality: 85 },
  { name: "Aug", temp: 31, rainfall: 8, quality: 89 },
  { name: "Sep", temp: 28, rainfall: 18, quality: 91 },
  { name: "Oct", temp: 24, rainfall: 35, quality: 88 },
  { name: "Nov", temp: 18, rainfall: 45, quality: 86 },
  { name: "Dec", temp: 14, rainfall: 50, quality: 84 },
];

const Particle = ({
  x,
  y,
  size,
  delay,
}: {
  x: string;
  y: string;
  size: number;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: [0, 1, 0], y: [0, -40, -80] }}
    transition={{ duration: 6, delay, repeat: Infinity, repeatDelay: 2 }}
    className="absolute rounded-full bg-white/20"
    style={{
      left: x,
      top: y,
      width: `${size}px`,
      height: `${size}px`,
    }}
  />
);

export const HeroSection = () => {
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: Math.random() * 10 + 5,
    delay: Math.random() * 3,
  }));

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500 text-white overflow-hidden">
      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <Particle key={i} {...p} />
        ))}
      </div>

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 space-y-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Advanced <span className="text-teal-200">Environmental</span>{" "}
              Monitoring
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-lg">
              Real-time weather and water quality analytics with AI-powered
              insights and predictive modeling.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
              >
                <Link href="/login">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 hover:text-white shadow-lg"
              >
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 relative h-[400px]"
          >
            <div className="absolute -inset-4 bg-white/10 rounded-2xl blur-xl"></div>
            <div className="relative rounded-xl shadow-2xl border-4 border-white/20 w-full h-full bg-white/10 p-4 backdrop-blur-sm">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorQuality"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.2)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.6)"
                    tick={{ fill: "white" }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.6)"
                    tick={{ fill: "white" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(0,0,0,0.7)",
                      borderColor: "rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                  <ReferenceLine
                    y={50}
                    stroke="rgba(255,255,255,0.3)"
                    strokeDasharray="3 3"
                  >
                    <Label
                      value="Safety Level"
                      position="insideBottomLeft"
                      fill="rgba(255,255,255,0.6)"
                    />
                  </ReferenceLine>
                  <Area
                    type="monotone"
                    dataKey="temp"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorTemp)"
                    animationDuration={2000}
                    animationEasing="ease-out"
                  />
                  <Area
                    type="monotone"
                    dataKey="rainfall"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorRain)"
                    animationDuration={2000}
                    animationEasing="ease-out"
                    animationBegin={300}
                  />
                  <Area
                    type="monotone"
                    dataKey="quality"
                    stroke="#ffc658"
                    fillOpacity={1}
                    fill="url(#colorQuality)"
                    animationDuration={2000}
                    animationEasing="ease-out"
                    animationBegin={600}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      <WaveDivider color="#f8fafc" type="rounded" />
    </section>
  );
};
