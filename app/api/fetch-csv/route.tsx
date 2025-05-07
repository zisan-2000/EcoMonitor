import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Generate sample data for demonstration
    const sampleData = Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const baseTemp = 20 + Math.sin(i / 3) * 5;
      const randomFactor = Math.random() * 2 - 1;

      return {
        timestamp: `${hour.toString().padStart(2, "0")}:00`,
        temperature: +(baseTemp + randomFactor).toFixed(1),
        humidity: +(60 + Math.sin(i / 2) * 15 + Math.random() * 5).toFixed(1),
        air_quality: +(50 + Math.sin(i / 4) * 20 + Math.random() * 10).toFixed(
          1
        ),
        wind_speed: +(5 + Math.sin(i / 6) * 3 + Math.random() * 2).toFixed(1),
        wind_direction: Math.floor(Math.random() * 360),
        precipitation:
          Math.random() > 0.8 ? +(Math.random() * 2).toFixed(1) : 0,
        solar_radiation:
          hour >= 6 && hour <= 18
            ? +(
                Math.sin(((hour - 6) / 12) * Math.PI) * 800 +
                Math.random() * 100
              ).toFixed(1)
            : 0,
        pressure: +(1013 + Math.sin(i / 8) * 5 + Math.random() * 2).toFixed(1),
      };
    });

    return NextResponse.json({
      data: sampleData,
      columns: [
        "timestamp",
        "temperature",
        "humidity",
        "air_quality",
        "wind_speed",
        "wind_direction",
        "precipitation",
        "solar_radiation",
        "pressure",
      ],
      timeColumn: "timestamp",
    });
  } catch (error) {
    console.error("Error generating data:", error);
    return NextResponse.json(
      { error: "Failed to generate data" },
      { status: 500 }
    );
  }
}
