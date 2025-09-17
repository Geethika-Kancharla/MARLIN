'use client'
import { useState } from 'react'

export default function Sidebar({ onFilterChange }) {
  const [parameters, setParameters] = useState({
    temperature: false,
    salinity: false,
    chlorophyll: false,
  })
  const [time, setTime] = useState('last7days')
  const [depth, setDepth] = useState('surface')

  const toggleParameter = (key) => {
    const newParams = { ...parameters, [key]: !parameters[key] }
    setParameters(newParams)
    onFilterChange({ parameters: newParams, time, depth })
  }

  const changeTime = (e) => {
    setTime(e.target.value)
    onFilterChange({ parameters, time: e.target.value, depth })
  }

  const changeDepth = (e) => {
    setDepth(e.target.value)
    onFilterChange({ parameters, time, depth: e.target.value })
  }

  return (
    <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white bg-opacity-80 backdrop-blur-md border-r border-blue-300 p-4 overflow-auto z-40">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Filters</h2>

      <div className="mb-4">
        <h3 className="font-medium mb-2 text-blue-600">Parameters</h3>
        {Object.keys(parameters).map((param) => (
          <label key={param} className="flex items-center space-x-2 mb-1 text-blue-800 cursor-pointer">
            <input 
              type="checkbox" 
              checked={parameters[param]} 
              onChange={() => toggleParameter(param)} 
              className="accent-blue-500"/>
            <span>{param.charAt(0).toUpperCase() + param.slice(1)}</span>
          </label>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-2 text-blue-600">Time Range</h3>
        <select 
          value={time} 
          onChange={changeTime} 
          className="w-full border border-blue-400 rounded px-2 py-1 text-blue-700">
          <option value="today">Today</option>
          <option value="last7days">Last 7 days</option>
          <option value="last30days">Last 30 days</option>
          <option value="lastyear">Last year</option>
        </select>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-2 text-blue-600">Depth</h3>
        <select 
          value={depth} 
          onChange={changeDepth} 
          className="w-full border border-blue-400 rounded px-2 py-1 text-blue-700">
          <option value="surface">Surface</option>
          <option value="midwater">Midwater</option>
          <option value="deepwater">Deepwater</option>
        </select>
      </div>
    </aside>
  )
}
