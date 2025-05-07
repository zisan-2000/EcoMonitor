"use client"

import { motion } from "framer-motion"
import { Activity } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(30)
    }, 300)

    const timer2 = setTimeout(() => {
      setProgress(60)
    }, 600)

    const timer3 = setTimeout(() => {
      setProgress(90)
    }, 900)

    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center gap-2 mb-8">
          <Activity className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-bold">EcoMonitor</h1>
        </div>

        <div className="w-[300px] mb-4">
          <Progress value={progress} className="h-2" />
        </div>

        <p className="text-muted-foreground animate-pulse">Loading dashboard data...</p>
      </motion.div>
    </div>
  )
}
