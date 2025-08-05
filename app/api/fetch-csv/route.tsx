// import { NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";
// import { parse } from "csv-parse/sync";

// export async function GET() {
//   try {
//     const csvFilePath = path.join(process.cwd(), "data", "cvs-data.csv");
//     const fileContent = fs.readFileSync(csvFilePath, "utf8");

//     // Parse CSV with relaxed column count to avoid errors
//     const records = parse(fileContent, {
//       columns: true,
//       skip_empty_lines: true,
//       relax_column_count: true, // Allow inconsistent rows
//       on_record: (record) => {
//         // Filter out rows with invalid SysCode or missing required fields
//         if (
//           ["ERR", "WDT", "CFG_MENU"].includes(record.SysCode) ||
//           !record.Date || !record.Time
//         ) return null;
//         return record;
//       },
//     }).filter(Boolean); // Remove nulls

//     const data = records.map((record) => ({
//       timestamp: `${record.Date}T${record.Time}`,
//       temperature: parseFloat(record["airTemperature"]) || null,
//       humidity: Math.round(parseFloat(record["R.Humidity"]) * 100) || null,
//       air_quality: 50, // Placeholder
//       wind_speed: parseFloat(record["windSpeed"]) || null,
//       wind_direction: parseFloat(record["windDirection"]) || null,
//       precipitation: parseFloat(record["precipitation"]) || null,
//       solar_radiation: parseFloat(record["solar"]) || null,
//       pressure: parseFloat(record["atmosphericPressure"]) || null,
//     }));

//     return NextResponse.json({
//       data,
//       columns: [
//         "timestamp",
//         "temperature",
//         "humidity",
//         "air_quality",
//         "wind_speed",
//         "wind_direction",
//         "precipitation",
//         "solar_radiation",
//         "pressure",
//       ],
//       timeColumn: "timestamp",
//     });
//   } catch (error) {
//     console.error("Error reading CSV data:", error);
//     return NextResponse.json({ error: "Failed to read CSV file" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export async function GET() {
  try {
    const csvFilePath = path.join(process.cwd(), "data", "cvs-data.csv");
    const fileContent = fs.readFileSync(csvFilePath, "utf8");

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      on_record: (record) => {
        if (
          ["ERR", "WDT", "CFG_MENU"].includes(record.SysCode) ||
          !record.Date || !record.Time
        ) return null;
        return record;
      },
    }).filter(Boolean);

    const data = records.map((record) => ({
      timestamp: `${record.Date}T${record.Time}`,
      solar: parseFloat(record.solar) || null,
      precipitation: parseFloat(record.precipitation) || null,
      strikes: parseInt(record.strikes) || 0,
      strikeDistance: parseFloat(record.strikeDistance) || null,
      windSpeed: parseFloat(record.windSpeed) || null,
      windDirection: parseFloat(record.windDirection) || null,
      gustWindSpeed: parseFloat(record.gustWindSpeed) || null,
      airTemperature: parseFloat(record.airTemperature) || null,
      vaporPressure: parseFloat(record["Vapor pressure"]) || null,
      atmosphericPressure: parseFloat(record.atmosphericPressure) || null,
      humidity: parseFloat(record["R.Humidity"]) || null,
      sensorTemp: parseFloat(record.sensorTemp) || null,
      xOrientation: parseFloat(record["X orintation"]) || null,
      yOrientation: parseFloat(record["Y orintation"]) || null,
      compassHeading: parseFloat(record.compassHeading) || null,
      sysCode: record.SysCode || null,
      sysMessage: record.SysMessage || null,
    }));

    return NextResponse.json({
      data,
      columns: Object.keys(data[0]),
      timeColumn: "timestamp",
    });
  } catch (error) {
    console.error("Error reading CSV data:", error);
    return NextResponse.json({ error: "Failed to read CSV file" }, { status: 500 });
  }
}
