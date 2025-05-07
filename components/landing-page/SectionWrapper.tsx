// components/landing-page/SectionWrapper.tsx
"use client";

import { motion } from "framer-motion";
import { WaveDivider } from "./WaveDivider";

export const SectionWrapper = ({
  children,
  waveColor = "#ffffff",
  waveFlip = false,
  bgColor = "bg-white",
  id = "",
}: {
  children: React.ReactNode;
  waveColor?: string;
  waveFlip?: boolean;
  bgColor?: string;
  id?: string;
}) => {
  return (
    <section id={id} className={`relative ${bgColor}`}>
      <WaveDivider flip={waveFlip} color={waveColor} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-16"
      >
        {children}
      </motion.div>
    </section>
  );
};
