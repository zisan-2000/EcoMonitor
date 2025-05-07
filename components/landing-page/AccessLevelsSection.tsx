// components/landing-page/AccessLevelsSection.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShieldCheck,
  LockKeyhole,
  User,
  Settings,
  Database,
  BarChart2,
} from "lucide-react";
import { WaveDivider } from "./WaveDivider";
import { motion } from "framer-motion";

const accessLevels = [
  {
    title: "Super Admin",
    icon: <Settings className="h-6 w-6 text-purple-600" />,
    features: [
      "Full system configuration",
      "User management",
      "API access",
      "Data export/import",
      "Advanced analytics",
    ],
    color: "bg-purple-50",
    price: "Custom",
  },
  {
    title: "Organization Admin",
    icon: <Database className="h-6 w-6 text-blue-600" />,
    features: [
      "Team management",
      "Data visualization",
      "Report generation",
      "Alert configuration",
      "Basic analytics",
    ],
    color: "bg-blue-50",
    price: "$99/month",
  },
  {
    title: "Standard User",
    icon: <User className="h-6 w-6 text-teal-600" />,
    features: [
      "Dashboard access",
      "Real-time monitoring",
      "Basic reports",
      "Notification settings",
      "Limited history",
    ],
    color: "bg-teal-50",
    price: "$29/month",
  },
];

const AccessCard = ({
  level,
  index,
}: {
  level: (typeof accessLevels)[0];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <Card
        className={`h-full border-0 shadow-lg hover:shadow-xl transition-all ${level.color}`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{level.title}</CardTitle>
            <div className="p-3 rounded-lg bg-white shadow-sm">
              {level.icon}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <span className="text-3xl font-bold">{level.price}</span>
          </div>
          <ul className="space-y-3">
            {level.features.map((feature) => (
              <li key={feature} className="flex items-center">
                <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          <button className="mt-6 w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium hover:bg-gray-50 transition-colors">
            Choose Plan
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const AccessLevelsSection = () => {
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
          <div className="inline-flex items-center justify-center bg-gray-100 px-4 py-2 rounded-full mb-4">
            <LockKeyhole className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-gray-700 font-medium">Access Levels</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select the access level that fits your needs, from basic monitoring
            to full administrative control.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {accessLevels.map((level, index) => (
            <AccessCard key={level.title} level={level} index={index} />
          ))}
        </div>
      </div>

      <WaveDivider color="#ffffff" type="rounded" flip />
    </section>
  );
};
