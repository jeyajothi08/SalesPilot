import React from 'react';
import { motion } from 'framer-motion';

export default function RevenueChart({ data }) {
  // SVG Chart dimensions
  const width = 800;
  const height = 300;
  const padding = 40;
  
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => Math.max(d.actual || 0, d.forecast || 0)));
  
  const getCoordinates = (val, index, totalPoints) => {
    const x = padding + (index * ((width - padding * 2) / (totalPoints - 1)));
    const y = height - padding - ((val / maxVal) * (height - padding * 2));
    return { x, y };
  };

  // Build path strings
  let actualPath = '';
  let forecastPath = '';
  let actualFillPath = '';
  
  data.forEach((d, i) => {
    const { x, y } = getCoordinates(d.actual || d.forecast, i, data.length);
    const { x: fx, y: fy } = getCoordinates(d.forecast, i, data.length);
    
    if (i === 0) {
      if (d.actual) actualPath += `M ${x},${y} `;
      forecastPath += `M ${fx},${fy} `;
      actualFillPath += `M ${x},${height - padding} L ${x},${y} `;
    } else {
      if (d.actual) {
         actualPath += `L ${x},${y} `;
         actualFillPath += `L ${x},${y} `;
      }
      forecastPath += `L ${fx},${fy} `;
    }
  });
  
  // Close the fill path
  const lastActualIndex = data.findIndex(d => d.actual === null) - 1;
  const validLastIndex = lastActualIndex >= 0 ? lastActualIndex : data.length - 1;
  const lastCoord = getCoordinates(data[validLastIndex].actual || 0, validLastIndex, data.length);
  actualFillPath += `L ${lastCoord.x},${height - padding} Z`;

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Revenue & AI Forecast</h2>
          <div className="flex gap-4 text-sm">
             <div className="flex items-center gap-2 text-gray-400">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                Actual Revenue
             </div>
             <div className="flex items-center gap-2 text-gray-400">
                <div className="w-3 h-3 rounded-full border-2 border-indigo-500/50 border-dashed" />
                AI Forecast
             </div>
          </div>
       </div>

       <div className="flex-1 w-full relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
             <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)" />
                   <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                </linearGradient>
             </defs>

             {/* Grid Lines */}
             {[0, 1, 2, 3, 4].map(i => {
                const y = padding + (i * ((height - padding * 2) / 4));
                const val = maxVal - (i * (maxVal / 4));
                return (
                   <g key={i}>
                      <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.05)" />
                      <text x={padding - 10} y={y + 4} fill="#6b7280" fontSize="12" textAnchor="end">
                         ${(val / 1000).toFixed(0)}k
                      </text>
                   </g>
                );
             })}

             {/* X Axis Labels */}
             {data.map((d, i) => {
                const { x } = getCoordinates(0, i, data.length);
                return (
                   <text key={i} x={x} y={height - 15} fill="#6b7280" fontSize="12" textAnchor="middle">
                      {d.month}
                   </text>
                );
             })}

             {/* Actual Revenue Fill */}
             <motion.path 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                d={actualFillPath} 
                fill="url(#revenueGradient)" 
             />

             {/* Forecast Line */}
             <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={forecastPath} 
                fill="none" 
                stroke="rgba(99, 102, 241, 0.5)" 
                strokeWidth="2" 
                strokeDasharray="6,6"
             />

             {/* Actual Revenue Line */}
             <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={actualPath} 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="3" 
             />
             
             {/* Data Points */}
             {data.map((d, i) => {
                if (!d.actual) return null;
                const { x, y } = getCoordinates(d.actual, i, data.length);
                return (
                   <motion.circle 
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5 + (i * 0.1) }}
                      cx={x} 
                      cy={y} 
                      r="4" 
                      fill="#18181b" 
                      stroke="#6366f1" 
                      strokeWidth="2" 
                   />
                );
             })}
          </svg>
       </div>
    </div>
  );
}
