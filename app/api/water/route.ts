// app/api/water/route.ts

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "RT_sensors_18242050_data.csv"
  );
  const fileData = fs.readFileSync(filePath, "utf8");

  const parsed = Papa.parse(fileData, { header: true, dynamicTyping: true });
  return NextResponse.json(parsed.data);
}
