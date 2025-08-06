import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "RT_sensors_18242050_data.csv"
    );
    const fileData = fs.readFileSync(filePath, "utf8");
    const parsed = Papa.parse(fileData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    // Clean and format the data
    const cleanedData = parsed.data.map((row: any) => ({
      ...row,
      DateTime: `${row.Date} ${row.Time}`,
      "Temp. (Deg.C)": parseFloat(row["Temp. (Deg.C)"]) || 0,
      pH: parseFloat(row["pH"]) || 0,
      "Redox (mV)": parseFloat(row["Redox (mV)"]) || 0,
      "DO (mg/L)": parseFloat(row["DO (mg/L)"]) || 0,
      "Salinity (g/L)": parseFloat(row["Salinity (g/L)"]) || 0,
      "Con. (mS/cm)": parseFloat(row["Con. (mS/cm)"]) || 0,
      "Latitude (DD)": parseFloat(row["Latitude (DD)"]) || 0,
      "Longitude (DD)": parseFloat(row["Longitude (DD)"]) || 0,
      "Temp. (Deg.C) at surface":
        parseFloat(row["Temp. (Deg.C) at surface"]) || 0,
      "pH at Surface": parseFloat(row["pH at Surface"]) || 0,
      "Redox (mV) at surface": parseFloat(row["Redox (mV) at surface"]) || 0,
      "DO (mg/L) at surface)": parseFloat(row["DO (mg/L) at surface)"]) || 0,
    }));

    return NextResponse.json(cleanedData);
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}
