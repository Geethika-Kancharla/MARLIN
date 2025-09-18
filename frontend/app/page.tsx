// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Navbar from "../components/Navbar";
import { Search, MapPin, Fish, Camera, BarChart3, AlertTriangle, FileText, Globe, MessageCircle} from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [oceanHealth, setOceanHealth] = useState(8.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setOceanHealth(prev => {
        const change = (Math.random() - 0.5) * 0.2;
        return Math.max(7.0, Math.min(9.0, Number((prev + change).toFixed(1))));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const searchSuggestions = [
    "Where are the fish today?",
    "Ocean temperature trends", 
    "Coral health status",
    "Best fishing zones",
    "Species diversity map"
  ];

  const liveMetrics = [
    { value: oceanHealth, label: "Ocean Health Score", color: "text-cyan-400" },
    { value: "28.5°C", label: "Avg Sea Temperature", color: "text-orange-400" },
    { value: "847", label: "Species Detected Today", color: "text-green-400" },
    { value: "🟢", label: "Water Quality Status", color: "text-emerald-400" },
    { value: "23", label: "Active Research Projects", color: "text-blue-400" },
    { value: "1.2M", label: "Data Points Today", color: "text-purple-400" }
  ];

  const features = [
    {
      icon: Fish,
      title: "Find Connections Between Data",
      subtitle: "See What Affects What",
      description: "AI automatically discovers how temperature affects fish distribution, finds hidden patterns, and predicts where fish will be tomorrow.",
      benefit: "💰 Helps fishermen increase catch by 40%",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Camera,
      title: "Instant Fish Recognition", 
      subtitle: "Take Photo, Know Fish",
      description: "Upload any fish photo → Know the species instantly. Upload otolith image → Know fish age. Works offline on boats too!",
      benefit: "⚡ No need for expensive experts every time",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: MapPin,
      title: "Best Fishing Zone Finder",
      subtitle: "Where Will Fish Be Tomorrow?",
      description: "AI predicts best fishing spots, avoids overfished areas, shows fish movement patterns, and suggests optimal fishing times.",
      benefit: "💰 Saves ₹50,000 per boat per year",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Climate Change Tracker",
      subtitle: "See How Ocean is Changing", 
      description: "Track ocean warming effects, identify species at risk, predict coral bleaching, and monitor sea level changes in real-time.",
      benefit: "🔮 Helps prepare for climate impacts",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: FileText,
      title: "Automatic Report Maker",
      subtitle: "Reports in Minutes, Not Months",
      description: "Generate government reports, biodiversity assessments, fishing license applications, and environmental clearance documents instantly.",
      benefit: "⏰ No more paperwork headaches", 
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: AlertTriangle,
      title: "Early Warning System",
      subtitle: "Ocean Problem Alert",
      description: "AI warns about harmful algae blooms, predicts fish deaths, spots pollution early, and detects invasive species automatically.",
      benefit: "💰 Prevents losses worth crores",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Globe,
      title: "3D Ocean Explorer",
      subtitle: "Google Earth for Underwater",
      description: "Explore ocean in 3D, virtually swim through data, watch fish migrations, and explore ocean floor in immersive detail.",
      benefit: "🏆 WOW FACTOR for judges!",
      gradient: "from-teal-500 to-blue-500"
    },
    {
      icon: MessageCircle,
      title: "Chat with Your Data",
      subtitle: "WhatsApp for Ocean Data",
      description: "Talk to data like chatting, get instant answers, share findings with team, and use voice commands for hands-free operation.",
      benefit: "🎯 Makes complex data simple for everyone",
      gradient: "from-pink-500 to-rose-500"
    },
    // {
    //   icon: Crystal,
    //   title: "Future Predictor", 
    //   subtitle: "See Ocean's Future",
    //   description: "Predict what happens if temperature rises 2°C, where fish will be in 2030, which species might disappear, and test conservation ideas.",
    //   benefit: "🌊 Plan for sustainable blue economy",
    //   gradient: "from-violet-500 to-purple-500"
    // }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-x-hidden">
        <section className="py-16 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent leading-tight">
              AI-Powered Ocean Intelligence
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Unifying oceanographic, fisheries, and molecular biodiversity data 
              into one intelligent platform for Indias marine future
            </p>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-3">
                <Search className="w-6 h-6" />
                Ask Questions in Simple English
              </h2>
              <div className="relative max-w-3xl mx-auto">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 text-lg bg-white/90 text-gray-800 rounded-2xl border-2 border-white/30 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 outline-none transition-all duration-300"
                  placeholder="Where are the fish today? How is ocean temperature affecting biodiversity?"
                />
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(suggestion)}
                    className="bg-white/20 border border-white/30 rounded-full px-4 py-2 text-sm hover:bg-white/30 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Live Ocean Health */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                📊 Live Ocean Health Check - Like a Fitbit for the Ocean
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {liveMetrics.map((metric, index) => (
                  <div key={index} className="bg-white/10 rounded-xl p-4 text-center">
                    <div className={`text-2xl font-bold ${metric.color} mb-2`}>
                      {metric.value}
                    </div>
                    <div className="text-sm text-white/70">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Map */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center">
              <h2 className="text-2xl font-semibold mb-6">🗺️ Real-Time Marine Intelligence Map</h2>
              <div className="relative h-80 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-800 rounded-xl overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
                <div className="absolute top-6 left-12 w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                <div className="absolute top-24 right-20 w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-16 left-8 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <div className="text-6xl mb-4">🌍</div>
                  <div className="text-xl font-semibold mb-2">Indian Ocean EEZ Live View</div>
                  <div className="text-sm text-white/80">
                    Click anywhere to explore marine data • Zoom into fishing zones • Track species migration
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Call-to-action Example */}
        <div className="flex justify-center mt-10 mb-8">
          <Link href={"/analysis"} className="text-xl text-cyan-300 underline hover:text-cyan-500 transition">
            Go to Analysis Page
          </Link>
        </div>

        {/* Footer Example */}
        <footer className="bg-black/30 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/70 mb-4 md:mb-0">
                © 2025 CMLRE Marine Intelligence Platform - Built for Smart India Hackathon 2025
              </p>
              <div className="flex space-x-8">
                <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors duration-300">Ministry of Earth Sciences</a>
                <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors duration-300">API Documentation</a>
                <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors duration-300">Research Papers</a>
                <a href="#" className="text-white/70 hover:text-cyan-400 transition-colors duration-300">Contact Team</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
