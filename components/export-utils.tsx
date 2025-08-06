"use client";

import { Download, FileText, Table, Image } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface ExportUtilsProps {
  data: any[];
  alerts: any[];
  onExport: (type: string) => void;
}

export function ExportUtils({ data, alerts, onExport }: ExportUtilsProps) {
  const exportToCSV = () => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) =>
            typeof row[header] === "string" && row[header].includes(",")
              ? `"${row[header]}"`
              : row[header]
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `water_quality_data_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onExport("csv");
  };

  const exportToJSON = () => {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalRecords: data.length,
        totalAlerts: alerts.length,
        dateRange: {
          start: data[0]?.DateTime,
          end: data[data.length - 1]?.DateTime,
        },
      },
      data: data,
      alerts: alerts,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `water_quality_export_${new Date().toISOString().split("T")[0]}.json`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onExport("json");
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();

    // Title
    pdf.setFontSize(20);
    pdf.text("Water Quality Monitoring Report", 20, 20);

    // Date
    pdf.setFontSize(12);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35);

    // Summary
    pdf.setFontSize(14);
    pdf.text("Summary Statistics", 20, 50);

    const summaryData = [
      ["Total Records", data.length.toString()],
      ["Total Alerts", alerts.length.toString()],
      [
        "High Priority Alerts",
        alerts.filter((a) => a.severity === "high").length.toString(),
      ],
      ["Date Range", `${data[0]?.Date} to ${data[data.length - 1]?.Date}`],
    ];

    (pdf as any).autoTable({
      startY: 55,
      head: [["Metric", "Value"]],
      body: summaryData,
      theme: "grid",
    });

    // Recent data table
    pdf.text(
      "Recent Measurements (Last 10)",
      20,
      (pdf as any).lastAutoTable.finalY + 20
    );

    const recentData = data
      .slice(-10)
      .map((row) => [
        row.DateTime?.substring(0, 16) || "",
        row["Temp. (Deg.C)"]?.toFixed(2) || "",
        row.pH?.toFixed(2) || "",
        row["DO (mg/L)"]?.toFixed(2) || "",
        row["Redox (mV)"]?.toFixed(0) || "",
      ]);

    (pdf as any).autoTable({
      startY: (pdf as any).lastAutoTable.finalY + 25,
      head: [["Date/Time", "Temp (°C)", "pH", "DO (mg/L)", "Redox (mV)"]],
      body: recentData,
      theme: "striped",
    });

    pdf.save(
      `water_quality_report_${new Date().toISOString().split("T")[0]}.pdf`
    );
    onExport("pdf");
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={exportToCSV}
        className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm"
      >
        <Table className="w-4 h-4" />
        <span>CSV</span>
      </button>
      <button
        onClick={exportToJSON}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm"
      >
        <FileText className="w-4 h-4" />
        <span>JSON</span>
      </button>
      <button
        onClick={exportToPDF}
        className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm"
      >
        <Download className="w-4 h-4" />
        <span>PDF</span>
      </button>
    </div>
  );
}
