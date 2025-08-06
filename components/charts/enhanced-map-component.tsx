"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { useTheme } from "next-themes";

interface Props {
  data: any[];
}

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function EnhancedMapComponent({ data }: Props) {
  const { theme } = useTheme();
  const lat = data[0]?.["Latitude (DD)"] || 22.443547;
  const lon = data[0]?.["Longitude (DD)"] || 91.865282;

  // Create custom icon with color coding based on water quality
  const createCustomIcon = (
    temp: number,
    ph: number,
    do_level: number,
    redox: number
  ) => {
    let color = "#10B981"; // Green for good quality
    let quality = "Good";

    if (
      ph < 6 ||
      ph > 9 ||
      do_level < 3 ||
      temp > 30 ||
      redox < 100 ||
      redox > 400
    ) {
      color = "#EF4444"; // Red for poor quality
      quality = "Poor";
    } else if (
      ph < 6.5 ||
      ph > 8.5 ||
      do_level < 5 ||
      temp > 25 ||
      redox < 150 ||
      redox > 350
    ) {
      color = "#F59E0B"; // Yellow for moderate quality
      quality = "Moderate";
    }

    return {
      icon: L.divIcon({
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
        </div>`,
        className: "custom-marker",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      }),
      quality,
    };
  };

  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div className="relative">
      <MapContainer
        center={[lat, lon]}
        zoom={13}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
        className="z-10"
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {data.slice(0, 50).map((d, i) => {
          if (!d["Latitude (DD)"] || !d["Longitude (DD)"]) return null;

          const { icon, quality } = createCustomIcon(
            d["Temp. (Deg.C)"],
            d["pH"],
            d["DO (mg/L)"],
            d["Redox (mV)"]
          );

          return (
            <Marker
              key={i}
              position={[d["Latitude (DD)"], d["Longitude (DD)"]]}
              icon={icon}
            >
              <Popup className="custom-popup">
                <div className="p-4 space-y-4 min-w-[280px]">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-base">
                      Water Quality Station
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {d.DateTime}
                    </p>
                    <div
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                        quality === "Good"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : quality === "Moderate"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {quality} Quality
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                      <span className="font-medium text-blue-700 dark:text-blue-300 block">
                        Temperature
                      </span>
                      <p className="text-blue-900 dark:text-blue-100 font-bold text-lg">
                        {d["Temp. (Deg.C)"]}°C
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                      <span className="font-medium text-green-700 dark:text-green-300 block">
                        pH Level
                      </span>
                      <p className="text-green-900 dark:text-green-100 font-bold text-lg">
                        {d.pH}
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg">
                      <span className="font-medium text-purple-700 dark:text-purple-300 block">
                        Dissolved O₂
                      </span>
                      <p className="text-purple-900 dark:text-purple-100 font-bold text-lg">
                        {d["DO (mg/L)"]} mg/L
                      </p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-lg">
                      <span className="font-medium text-orange-700 dark:text-orange-300 block">
                        Redox
                      </span>
                      <p className="text-orange-900 dark:text-orange-100 font-bold text-lg">
                        {d["Redox (mV)"]} mV
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <div>Salinity: {d["Salinity (g/L)"]} g/L</div>
                      <div>Conductivity: {d["Con. (mS/cm)"]} mS/cm</div>
                      <div>
                        Location: {d["Latitude (DD)"]}, {d["Longitude (DD)"]}
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Enhanced Legend */}
      <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 rounded-xl shadow-lg z-20 border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Water Quality Index
        </h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
            <span className="text-gray-600 dark:text-gray-400">
              Excellent (Good)
            </span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
            <span className="text-gray-600 dark:text-gray-400">
              Fair (Moderate)
            </span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
            <span className="text-gray-600 dark:text-gray-400">
              Poor (Critical)
            </span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          Showing {Math.min(50, data.length)} of {data.length} points
        </div>
      </div>
    </div>
  );
}
