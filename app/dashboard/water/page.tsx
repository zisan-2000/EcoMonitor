// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { fetchWaterQualityData } from "@/lib/data"
// import WaterQualityPanel from "@/components/water-quality-panel"
// import { Activity } from "lucide-react"

// export default function WaterQualityPage() {
//   const [isLoading, setIsLoading] = useState(true)
//   const [waterData, setWaterData] = useState([])

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // Fetch data
//         const water = await fetchWaterQualityData()

//         setWaterData(water)
//         setIsLoading(false)
//       } catch (error) {
//         console.error("Error loading water quality data:", error)
//         setIsLoading(false)
//       }
//     }

//     loadData()
//   }, [])

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="flex flex-col items-center">
//           <Activity className="h-8 w-8 animate-spin text-primary mb-4" />
//           <p>Loading water quality data...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="p-6"
//     >
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold">Water Quality Monitoring</h1>
//         <p className="text-muted-foreground">Comprehensive water quality data analysis and visualization</p>
//       </div>

//       <WaterQualityPanel data={waterData} />
//     </motion.div>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import WaterQualityPanel from "@/components/water-quality-panel"
import { Activity } from "lucide-react"

export default function WaterQualityPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [waterData, setWaterData] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/water-data')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        setWaterData(data.data) // Assuming your API returns { data: [...] }
        setIsLoading(false)
      } catch (err) {
        console.error("Error loading water quality data:", err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <Activity className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Loading water quality data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center text-red-500">
          <p>Error loading data: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Water Quality Monitoring</h1>
        <p className="text-muted-foreground">Comprehensive water quality data analysis and visualization</p>
      </div>

      <WaterQualityPanel data={waterData} loading={isLoading} />
    </motion.div>
  )
}