import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export async function GET() {
  try {
    const csvFilePath = path.join(process.cwd(), "data", "readings.csv");
    const fileContent = fs.readFileSync(csvFilePath, "utf8");

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    });

    const data = records.map((record) => ({
      id: record.id,
      dates: record.dates,
      times: record.times,
      date_time: record.date_time,
      temp: parseFloat(record.temp),
      ph: parseFloat(record.ph),
      orp: parseFloat(record.orp),
      do: parseFloat(record.do),
      sal: parseFloat(record.sal),
      cond: parseFloat(record.cond),
      lat: parseFloat(record.lat),
      lon: parseFloat(record.lon),
      spd: parseFloat(record.spd),
      temp2: parseFloat(record.temp2),
      ph2: parseFloat(record.ph2),
      orp2: parseFloat(record.orp2),
      do2: parseFloat(record.do2),
      scnt: parseInt(record.scnt),
      created: record.created,
    }));

    return NextResponse.json({
      data,
      columns: Object.keys(data[0]),
      timeColumn: "date_time",
    });
  } catch (error) {
    console.error("Error reading CSV data:", error);
    return NextResponse.json({ error: "Failed to read CSV file" }, { status: 500 });
  }
}
