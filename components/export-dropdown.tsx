"use client";

import { useState } from "react";
import { Download, FileText, Table, ChevronDown } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface ExportDropdownProps {
  data: any[];
  alerts: any[];
  onExport: (type: string) => void;
}

export function ExportDropdown({
  data,
  alerts,
  onExport,
}: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false);
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
    setIsOpen(false);
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
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">Export</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            <button
              onClick={exportToCSV}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Table className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Export as CSV
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Raw data format
                </div>
              </div>
            </button>

            <button
              onClick={exportToJSON}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Export as JSON
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  With metadata & alerts
                </div>
              </div>
            </button>

            <button
              onClick={exportToPDF}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4 text-red-600" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Export as PDF
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Professional report
                </div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
