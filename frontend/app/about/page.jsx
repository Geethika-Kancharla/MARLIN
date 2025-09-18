"use client";
import Navbar from "../../components/Navbar";
import Wave from "react-wavify";
import { FaFish, FaDatabase } from "react-icons/fa";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="relative w-full h-screen bg-gradient-to-b from-blue-200 via-cyan-200 to-blue-700 flex flex-col items-center justify-center overflow-hidden">
        <section className="z-10 w-full max-w-6xl mx-auto px-4 py-6 flex flex-col items-center text-center space-y-6">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 drop-shadow-lg">
            About the Project
          </h1>

          {/* Intro */}
          <p className="text-base md:text-lg lg:text-xl text-blue-900/90 bg-white/80 rounded-lg px-4 py-4 shadow-md leading-relaxed max-w-4xl">
            <span className="font-semibold">CMLRE, Kochi</span>, under the
            Ministry of Earth Sciences, leads India’s marine data research. Our
            project is building an{" "}
            <span className="font-semibold">
              AI-enabled marine data platform
            </span>
            to integrate, visualize, and analyze diverse datasets — from
            oceanography and fisheries to taxonomy, otolith morphology, and
            molecular biology. This platform transforms raw data into actionable
            insights for sustainable ocean management and India’s blue economy
            growth.
          </p>

          {/* Mission Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
            {/* Why Important */}
            <div className="bg-white rounded-xl shadow-lg p-4 text-left border-l-8 border-blue-500">
              <h2 className="text-lg md:text-xl font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <FaFish className="text-blue-600" /> Why is this important?
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-blue-700 text-sm md:text-base">
                <li>
                  India’s vast coastline faces threats from climate change,
                  overfishing, and pollution.
                </li>
                <li>
                  Marine datasets are fragmented across silos, limiting
                  real-time insights.
                </li>
                <li>
                  Sustainable fisheries and conservation require integrated,
                  science-driven tools.
                </li>
              </ul>
            </div>

            {/* What Project Does */}
            <div className="bg-white rounded-xl shadow-lg p-4 text-left border-l-8 border-cyan-500">
              <h2 className="text-lg md:text-xl font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <FaDatabase className="text-cyan-600" /> What does this project
                do?
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-blue-700 text-sm md:text-base">
                <li>
                  🌊 Integrates datasets: oceanography, fisheries, taxonomy,
                  eDNA, otoliths.
                </li>
                <li>
                  📊 Visualizes real-time ocean health with dashboards, maps,
                  and charts.
                </li>
                <li>
                  🔬 AI-powered tools: fish recognition, eDNA analysis,
                  predictive modeling.
                </li>
                <li>
                  🤖 Supports policy & communities with reports, decision tools,
                  and mobile apps.
                </li>
              </ul>
            </div>
          </div>

          {/* Vision / Call to Action */}
          <div className="py-4 px-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 rounded-lg shadow-md w-full max-w-3xl text-white font-bold text-lg md:text-2xl">
            Empowering India’s Ocean Research with AI & Open Data 🌊
          </div>
        </section>

        {/* Decorative bottom wave */}
        <Wave
          fill="#01579B"
          className="absolute bottom-0 left-0 w-full h-20"
          options={{
            height: 20,
            amplitude: 15,
            speed: 0.18,
            points: 5,
          }}
        />

        {/* Footer on top of wave */}
        <footer className="absolute bottom-0 w-full text-center pb-2">
          <p className="text-white/80 text-sm sm:text-base bg-black/30 px-4 py-2 rounded-md inline-block">
            © {new Date().getFullYear()} CMLRE Marine Intelligence Platform. All
            Rights Reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
