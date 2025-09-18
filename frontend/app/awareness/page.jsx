"use client";
import Navbar from "../../components/Navbar";
import { useEffect, useRef, useState } from "react";
import Wave from "react-wavify";

export default function AwarenessPage() {
  const [fishes, setFishes] = useState([]);
  const fishCount = 10; // Number of fishes on screen
  const animationRef = useRef();

  // Initialize fishes
  useEffect(() => {
    const newFishes = Array.from({ length: fishCount }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
      scale: 0.5 + Math.random() * 0.8,
      color: `hsl(${Math.random() * 200 + 180}, 80%, 50%)`,
    }));
    setFishes(newFishes);
  }, []);

  // Animate fishes
  useEffect(() => {
    const animate = () => {
      setFishes((prev) =>
        prev.map((f) => {
          let newX = f.x + f.dx;
          let newY = f.y + f.dy;

          // Wrap around screen
          if (newX > window.innerWidth) newX = -50;
          if (newX < -50) newX = window.innerWidth;
          if (newY > window.innerHeight) newY = 0;
          if (newY < 0) newY = window.innerHeight;

          return { ...f, x: newX, y: newY };
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  // Content cards
  const cards = [
    {
      title: "Ocean Oxygen Provider",
      content:
        "Over half of the world's oxygen is produced by oceanic phytoplankton.",
    },
    {
      title: "Climate Regulator",
      content:
        "Oceans absorb carbon dioxide, helping to mitigate climate change.",
    },
    {
      title: "Marine Biodiversity",
      content:
        "Millions of species, including fish, mammals, and corals, thrive in marine ecosystems.",
    },
    {
      title: "Plastic Pollution",
      content:
        "Reduce plastic waste to prevent harmful effects on marine life.",
    },
    {
      title: "Coral Reef Conservation",
      content:
        "Protect coral reefs which provide habitat and shield coastlines from storms.",
    },
    {
      title: "Sustainable Fishing",
      content:
        "Support sustainable fishing practices to keep fish populations healthy.",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="relative w-full h-screen bg-gradient-to-b from-cyan-100 to-blue-600 overflow-hidden flex flex-col items-center">
        {/* Responsive Heading */}
        <h1
          className="z-10 mt-6 mb-6 px-4 text-center font-extrabold text-white drop-shadow-lg tracking-wide
                       text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Marine Awareness
        </h1>

        {/* Content Grid that fills screen height */}
        <main className="z-10 flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-20 place-items-center">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 w-full max-w-sm text-center hover:scale-105 transform transition"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-2">
                {card.title}
              </h2>
              <p className="text-base sm:text-lg text-blue-700">
                {card.content}
              </p>
            </div>
          ))}
        </main>

        {/* Wave at bottom */}
        <Wave
          fill="#01579B"
          paused={false}
          className="absolute bottom-0 left-0 w-full h-20 z-0"
          options={{
            height: 20,
            amplitude: 15,
            speed: 0.18,
            points: 5,
          }}
        />
        <footer className="absolute bottom-0 w-full text-center pb-2">
          <p className="text-white/80 text-sm sm:text-base bg-black/30 px-4 py-2 rounded-md inline-block">
            © {new Date().getFullYear()} CMLRE Marine Intelligence Platform. All
            Rights Reserved.
          </p>
        </footer>

        {/* Fish Layer */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
          {fishes.map((f, i) => (
            <svg
              key={i}
              className="absolute"
              style={{
                left: f.x,
                top: f.y,
                transform: `scale(${f.scale})`,
                width: 40,
                height: 20,
              }}
              viewBox="0 0 64 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="20" cy="16" rx="20" ry="12" fill={f.color} />
              <polygon points="0,16 16,4 16,28" fill="#026ca0" />
              <circle cx="10" cy="16" r="2" fill="#003f5c" />
            </svg>
          ))}
        </div>
      </div>
    </>
  );
}
