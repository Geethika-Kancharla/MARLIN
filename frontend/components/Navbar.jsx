'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-500 text-white sticky top-0 z-50 shadow">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <Link href="/" className="font-bold text-xl">
          Marlin
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-lg">
          <li><Link href="/" className="hover:text-cyan-300">Dashboard</Link></li>
          <li><Link href="/awareness" className="hover:text-cyan-300">Awareness</Link></li>
          <li><Link href="/dataapi" className="hover:text-cyan-300">Data API</Link></li>
          <li><Link href="/about" className="hover:text-cyan-300">About</Link></li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden px-4 pb-4 space-y-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white">
          <li><Link href="/" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
          <li><Link href="/awareness" onClick={() => setMenuOpen(false)}>Awareness</Link></li>
          <li><Link href="/dataapi" onClick={() => setMenuOpen(false)}>Data API</Link></li>
          <li><Link href="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
        </ul>
      )}
    </nav>
  )
}
