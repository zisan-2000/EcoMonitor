"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentActivity() {
  // Sample data for demonstration
  const activities = [
    {
      id: 1,
      type: "data_collection",
      description: "Sensor data collected from Station #12",
      timestamp: "2 minutes ago",
      user: { name: "System", avatar: "S" },
    },
    {
      id: 2,
      type: "alert",
      description: "High temperature alert triggered (28.5°C)",
      timestamp: "15 minutes ago",
      user: { name: "System", avatar: "S" },
    },
    {
      id: 3,
      type: "user_action",
      description: "Data export completed",
      timestamp: "1 hour ago",
      user: { name: "Admin", avatar: "A" },
    },
    {
      id: 4,
      type: "system",
      description: "System maintenance completed",
      timestamp: "3 hours ago",
      user: { name: "System", avatar: "S" },
    },
    {
      id: 5,
      type: "data_collection",
      description: "Sensor data collected from Station #08",
      timestamp: "4 hours ago",
      user: { name: "System", avatar: "S" },
    },
    {
      id: 6,
      type: "user_action",
      description: "New alert threshold set for humidity",
      timestamp: "5 hours ago",
      user: { name: "Admin", avatar: "A" },
    },
    {
      id: 7,
      type: "alert",
      description: "Low air quality alert triggered (AQI: 120)",
      timestamp: "6 hours ago",
      user: { name: "System", avatar: "S" },
    },
    {
      id: 8,
      type: "system",
      description: "Automatic data backup completed",
      timestamp: "12 hours ago",
      user: { name: "System", avatar: "S" },
    },
  ]

  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "data_collection":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M21 15V6" />
              <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              <path d="M12 12H3" />
              <path d="M16 6H3" />
              <path d="M12 18H3" />
            </svg>
          </div>
        )
      case "alert":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        )
      case "user_action":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        )
      case "system":
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
              <line x1="6" y1="6" x2="6.01" y2="6" />
              <line x1="6" y1="18" x2="6.01" y2="18" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        )
    }
  }

  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          {getActivityIcon(activity.type)}
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.description}</p>
            <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback>{activity.user.avatar}</AvatarFallback>
          </Avatar>
        </div>
      ))}
    </div>
  )
}
