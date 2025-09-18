"use client";
import Navbar from "../components/Navbar";
import { useState } from "react";
import Search from "../components/Search"; // Import the Search component

export default function LandingPage() {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen w-full bg-gradient-to-b from-cyan-100 via-blue-200 to-blue-700 flex flex-col">
        {/* HERO Section */}
        <section className="pt-28 pb-16 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-4 drop-shadow">
            Empowering Ocean Awareness
          </h1>
          <p className="text-lg sm:text-xl text-blue-800 mb-6 max-w-2xl bg-white bg-opacity-40 rounded-lg px-6 py-3 shadow-md">
            Harness technology and data to protect the marine ecosystem for
            future generations.
          </p>
          <button className="bg-blue-700 text-white py-3 px-8 rounded-full font-semibold shadow-lg hover:bg-blue-800 active:scale-95 transition mb-2">
            Explore Data
          </button>
        </section>

        {/* FEATURES */}
        <section className="py-12 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: "🌐",
              title: "Real-time Data",
              desc: "View current marine parameters and trends from trusted sources.",
              action: () => {},
            },
            {
              icon: "🧠",
              title: "AI Insights",
              desc: "Chat with AI or upload images for intelligent analysis.",
              action: () => setShowChatbot(true),
            },
            {
              icon: "📚",
              title: "Educational Resources",
              desc: "Learn about ocean ecosystems and actions for stewardship.",
              action: () => {},
            },
            {
              icon: "🤝",
              title: "Community Contribution",
              desc: "Join advocates and share your findings with others.",
              action: () => {},
            },
          ].map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center bg-white bg-opacity-90 rounded-lg shadow-lg p-6 cursor-pointer hover:scale-105 transition"
              onClick={f.action}
            >
              <div className="text-4xl mb-2">{f.icon}</div>
              <h3 className="text-xl font-semibold text-blue-800 mb-1">
                {f.title}
              </h3>
              <p className="text-blue-700 text-center">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* IMPACT / STATS */}
        <section className="py-8 px-4 flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          {[
            { stat: "60%+", label: "Earth's Oxygen from Oceans" },
            { stat: "20K+", label: "Marine Species Tracked" },
            { stat: "1M+", label: "Data Points Visualized" },
            { stat: "∞", label: "Actions for Conservation" },
          ].map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center bg-gradient-to-br from-blue-400 to-cyan-300 rounded-xl shadow-lg p-6 w-40"
            >
              <span className="text-3xl font-bold text-white drop-shadow">
                {s.stat}
              </span>
              <span className="text-md text-white">{s.label}</span>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-auto w-full py-8 bg-blue-800 bg-opacity-95 text-white text-center text-sm">
          <div>
            CMLRE Marine Data • Protecting Our Seas • Connect | Docs | Contact
          </div>
          <div className="mt-2">© 2025 Marine Awareness Project</div>
        </footer>

        {/* Chatbot Modal */}
        {showChatbot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
              <button
                onClick={() => setShowChatbot(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
              <h2 className="text-xl font-bold mb-4 text-blue-700">
                AI Ocean Insights
              </h2>
              <textarea
                className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={4}
                placeholder="Ask me anything about oceans..."
              />
              <input type="file" className="mb-4" />
              <button className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800">
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
