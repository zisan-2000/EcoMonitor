"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";

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

export default function MapComponent({ data }: Props) {
  const lat = data[0]?.["Latitude (DD)"] || 40.7128;
  const lon = data[0]?.["Longitude (DD)"] || -74.006;

  // Create custom icon with color coding based on water quality
  const createCustomIcon = (temp: number, ph: number, do_level: number) => {
    let color = "#10B981"; // Green for good quality

    if (ph < 6 || ph > 9 || do_level < 3 || temp > 30) {
      color = "#EF4444"; // Red for poor quality
    } else if (ph < 6.5 || ph > 8.5 || do_level < 5 || temp > 25) {
      color = "#F59E0B"; // Yellow for moderate quality
    }

    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: "custom-marker",
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  return (
    <div className="relative">
      <MapContainer
        center={[lat, lon]}
        zoom={12}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
        className="z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {data.map((d, i) =>
          d["Latitude (DD)"] && d["Longitude (DD)"] ? (
            <Marker
              key={i}
              position={[d["Latitude (DD)"], d["Longitude (DD)"]]}
              icon={createCustomIcon(
                d["Temp. (Deg.C)"],
                d["pH"],
                d["DO (mg/L)"]
              )}
            >
              <Popup className="custom-popup">
                <div className="p-3 space-y-3 min-w-[200px]">
                  <div className="border-b border-gray-200 pb-2">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Water Quality Data
                    </h3>
                    <p className="text-xs text-gray-500">{d.Time}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-blue-50 p-2 rounded">
                      <span className="font-medium text-blue-700">
                        Temperature
                      </span>
                      <p className="text-blue-900 font-bold">
                        {d["Temp. (Deg.C)"]}°C
                      </p>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <span className="font-medium text-green-700">
                        pH Level
                      </span>
                      <p className="text-green-900 font-bold">{d.pH}</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <span className="font-medium text-purple-700">DO</span>
                      <p className="text-purple-900 font-bold">
                        {d["DO (mg/L)"]} mg/L
                      </p>
                    </div>
                    <div className="bg-orange-50 p-2 rounded">
                      <span className="font-medium text-orange-700">
                        Salinity
                      </span>
                      <p className="text-orange-900 font-bold">
                        {d["Salinity (g/L)"]} g/L
                      </p>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg z-20">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">
          Water Quality
        </h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Good</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">Moderate</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Poor</span>
          </div>
        </div>
      </div>
    </div>
  );
}
