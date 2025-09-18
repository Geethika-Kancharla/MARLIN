"use client";
import Navbar from "../components/Navbar";
import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, ResponsiveContainer
} from "recharts";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type TemperatureData = { day: string; temp: number };
type ChlorophyllData = { zone: string; value: number };
type SalinityData = { name: string; value: number };
type WaveHeightData = { time: string; height: number };
type FishDistributionData = { species: string; value: number };
type FishTypesData = { type: string; count: number };
type FishHotspotData = { lat: number; lng: number; density: number };

type OceanData = {
  temperature: TemperatureData[];
  chlorophyll: ChlorophyllData[];
  salinity: SalinityData[];
  waveHeight: WaveHeightData[];
  fishDistribution: FishDistributionData[];
  fishTypes: FishTypesData[];
  fishHotspots: FishHotspotData[];
};

type Oceans = {
  arabian: OceanData;
  bay: OceanData;
  indian: OceanData;
};

export default function LandingPage() {
  // 🌊 Ocean Data
  const oceans: Oceans = {
    arabian: {
      temperature: [
        { day: "Mon", temp: 27 },
        { day: "Tue", temp: 28 },
        { day: "Wed", temp: 29 },
        { day: "Thu", temp: 30 },
        { day: "Fri", temp: 31 },
      ],
      chlorophyll: [{ zone: "Arabian Sea", value: 2.1 }],
      salinity: [
        { name: "Normal", value: 60 },
        { name: "Low", value: 25 },
        { name: "High", value: 15 },
      ],
      waveHeight: [
        { time: "6AM", height: 1.2 },
        { time: "12PM", height: 1.8 },
        { time: "6PM", height: 1.5 },
      ],
      fishDistribution: [
        { species: "Tuna", value: 45 },
        { species: "Mackerel", value: 30 },
        { species: "Sardine", value: 25 },
      ],
      fishTypes: [
        { type: "Pelagic", count: 120 },
        { type: "Demersal", count: 80 },
        { type: "Reef Fish", count: 60 },
      ],
      fishHotspots: [
        { lat: 15.3, lng: 72.5, density: 300 }, // off Goa
        { lat: 18.9, lng: 72.8, density: 450 }, // Mumbai coast
        { lat: 9.9, lng: 75.3, density: 500 },  // Kochi
      ]
    },
    bay: {
      temperature: [
        { day: "Mon", temp: 26 },
        { day: "Tue", temp: 27 },
        { day: "Wed", temp: 28 },
        { day: "Thu", temp: 27 },
        { day: "Fri", temp: 29 },
      ],
      chlorophyll: [{ zone: "Bay of Bengal", value: 1.7 }],
      salinity: [
        { name: "Normal", value: 70 },
        { name: "Low", value: 20 },
        { name: "High", value: 10 },
      ],
      waveHeight: [
        { time: "6AM", height: 1.4 },
        { time: "12PM", height: 1.9 },
        { time: "6PM", height: 1.3 },
      ],
      fishDistribution: [
        { species: "Hilsa", value: 50 },
        { species: "Shrimp", value: 30 },
        { species: "Pomfret", value: 20 },
      ],
      fishTypes: [
        { type: "Estuarine", count: 140 },
        { type: "Deep Sea", count: 60 },
        { type: "Reef Fish", count: 40 },
      ],
      fishHotspots: [
        { lat: 21.9, lng: 89.1, density: 400 }, // Sundarbans
        { lat: 17.7, lng: 83.3, density: 350 }, // Vizag
        { lat: 13.1, lng: 80.3, density: 420 }, // Chennai
      ]
    },
    indian: {
      temperature: [
        { day: "Mon", temp: 28 },
        { day: "Tue", temp: 29 },
        { day: "Wed", temp: 30 },
        { day: "Thu", temp: 31 },
        { day: "Fri", temp: 32 },
      ],
      chlorophyll: [{ zone: "Indian Ocean", value: 2.8 }],
      salinity: [
        { name: "Normal", value: 65 },
        { name: "Low", value: 15 },
        { name: "High", value: 20 },
      ],
      waveHeight: [
        { time: "6AM", height: 1.5 },
        { time: "12PM", height: 2.0 },
        { time: "6PM", height: 1.7 },
      ],
      fishDistribution: [
        { species: "Yellowfin Tuna", value: 40 },
        { species: "Swordfish", value: 35 },
        { species: "Sharks", value: 25 },
      ],
      fishTypes: [
        { type: "Deep Sea", count: 150 },
        { type: "Pelagic", count: 90 },
        { type: "Reef Fish", count: 50 },
      ],
      fishHotspots: [
        { lat: -5.0, lng: 77.0, density: 300 }, // Lakshadweep
        { lat: -1.5, lng: 73.0, density: 350 }, // Maldives area
        { lat: 0.5, lng: 78.0, density: 400 },  // Equatorial IO
      ]
    }
  };

  const COLORS = ["#0288D1", "#26C6DA", "#FF7043", "#66BB6A"];
  // Restrict selectedOcean to keys of oceans object
  const [selectedOcean, setSelectedOcean] = useState<keyof Oceans>("arabian");
  const currentData = oceans[selectedOcean];

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 via-cyan-100 to-blue-300 flex flex-col">

        {/* 🌍 Dropdown */}
        <section className="flex justify-center mt-20 mb-10">
          <select
            value={selectedOcean}
            onChange={(e) => setSelectedOcean(e.target.value as keyof Oceans)}
            className="px-8 py-3 rounded-2xl shadow-lg border border-blue-400 text-blue-900 font-semibold bg-white hover:bg-blue-50 transition duration-300 ease-in-out"
          >
            <option value="arabian">Arabian Sea</option>
            <option value="bay">Bay of Bengal</option>
            <option value="indian">Indian Ocean</option>
          </select>
        </section>

        {/* 📊 Graphs */}
        <section className="py-8 px-4 w-full max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Cards */}
          {[
            {
              title: "Sea Surface Temp (°C)",
              chart: (
                <LineChart data={currentData.temperature}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" stroke="#0288D1" strokeWidth={3} />
                </LineChart>
              )
            },
            {
              title: "Chlorophyll (mg/m³)",
              chart: (
                <BarChart data={currentData.chlorophyll}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="zone" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#26C6DA" radius={[8, 8, 0, 0]} />
                </BarChart>
              )
            },
            {
              title: "Salinity Levels",
              chart: (
                <PieChart>
                  <Pie
                    data={currentData.salinity}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                    label
                  >
                    {currentData.salinity.map((entry: SalinityData, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              )
            },
            {
              title: "Wave Height (m)",
              chart: (
                <LineChart data={currentData.waveHeight}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="height" stroke="#FF7043" strokeWidth={3} />
                </LineChart>
              )
            },
            {
              title: "Fish Distribution (%)",
              chart: (
                <PieChart>
                  <Pie
                    data={currentData.fishDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                    label
                  >
                    {currentData.fishDistribution.map((entry: FishDistributionData, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              )
            },
            {
              title: "Types of Fish (Count)",
              chart: (
                <BarChart data={currentData.fishTypes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#66BB6A" radius={[8, 8, 0, 0]} />
                </BarChart>
              )
            }
          ].map(({ title, chart }, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col w-full"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-4">{title}</h3>
              <ResponsiveContainer width="100%" height={220}>
                {chart}
              </ResponsiveContainer>
            </div>
          ))}

          {/* 🗺️ Fish Population Map */}
          <div className="bg-white rounded-3xl shadow-lg p-6 col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-3 w-full">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Fish Population Hotspots</h3>
            <MapContainer
              center={[15, 75]}
              zoom={4}
              className="h-96 w-full rounded-3xl shadow-md"
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {currentData.fishHotspots.map((spot: FishHotspotData, i: number) => (
                <CircleMarker
                  key={i}
                  center={[spot.lat, spot.lng]}
                  radius={Math.sqrt(spot.density) / 2}
                  color="#0288D1"
                  fillColor="#26C6DA"
                  fillOpacity={0.6}
                >
                  <LeafletTooltip>{`Density: ${spot.density}`}</LeafletTooltip>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto w-full py-6 bg-blue-900 text-white text-center text-sm shadow-inner">
          © 2025 Marine Awareness Project • Demo Visualization
        </footer>
      </div>
    </>
  );
}
