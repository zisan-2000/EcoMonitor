// components/landing-page/CtaSection.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Globe, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { WaveDivider } from "./WaveDivider";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Globe className="h-6 w-6 text-blue-500" />,
    text: "Global data coverage",
  },
  {
    icon: <Shield className="h-6 w-6 text-green-500" />,
    text: "Enterprise-grade security",
  },
  {
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    text: "Real-time updates",
  },
];

export const CtaSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:80px_80px]"></div>
      </div>

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
          >
            Ready to transform your environmental monitoring?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
          >
            Join thousands of organizations using our platform to make
            data-driven decisions about their environment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
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
              <Link href="#contact">
                Contact Sales <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="p-2 bg-white/10 rounded-full">
                  {feature.icon}
                </div>
                <span className="text-blue-100">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <WaveDivider color="#ffffff" type="default" flip />
    </section>
  );
};
