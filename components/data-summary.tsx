"use client";

export function DataSummary() {
  // Sample data for demonstration
  const summaryData = [
    {
      metric: "Average Temperature",
      value: "23.4°C",
      change: "+1.2°C",
      status: "up",
    },
    { metric: "Average Humidity", value: "65%", change: "+3%", status: "up" },
    {
      metric: "Average Air Quality",
      value: "42 AQI",
      change: "-5 AQI",
      status: "down",
    },
    {
      metric: "Max Wind Speed",
      value: "32 km/h",
      change: "+5 km/h",
      status: "up",
    },
    {
      metric: "Total Precipitation",
      value: "42 mm",
      change: "-8 mm",
      status: "down",
    },
    {
      metric: "Solar Radiation",
      value: "580 W/m²",
      change: "+20 W/m²",
      status: "up",
    },
  ];

  return (
    <div className="space-y-4">
      {summaryData.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{item.metric}</p>
            <p className="text-sm text-muted-foreground">{item.value}</p>
          </div>
          <div
            className={`flex items-center gap-1 ${
              item.status === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            {item.status === "up" ? (
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
                <path d="m6 9 6-6 6 6" />
                <path d="M6 12h12" />
                <path d="M12 3v18" />
              </svg>
            ) : (
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
                <path d="M6 15h12" />
                <path d="M12 3v18" />
                <path d="m6 9 6-6 6 6" />
              </svg>
            )}
            <span className="text-xs font-medium">{item.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
