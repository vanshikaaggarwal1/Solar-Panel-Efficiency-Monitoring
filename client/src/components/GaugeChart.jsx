import React from 'react';

const GaugeChart = ({ percentage = 22.8, max = 30, title = 'Fleet Efficiency (%)' }) => {
  const normalizedPct = Math.min(100, Math.max(0, (percentage / max) * 100));

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative w-44 h-24 flex justify-center overflow-hidden">
        <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Semi-circle Arc */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
            className="dark:stroke-[#2A2A2A]"
            strokeDasharray="125.6"
            strokeDashoffset="0"
            strokeLinecap="round"
          />
          {/* Filled Arc in Forest Green */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#2E5E4E"
            strokeWidth="8"
            strokeDasharray="125.6"
            strokeDashoffset={125.6 - (125.6 * (percentage / max))}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Metric Text */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-2xl font-bold tracking-tight text-primaryText dark:text-white">
            {percentage}%
          </span>
          <span className="text-[10px] font-medium text-secondaryText">
            Target 22.0%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[11px] text-secondaryText mt-1">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> &lt;15%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-sand-400 inline-block"></span> 15-20%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-forest-500 inline-block"></span> Optimal &gt;20%
        </span>
      </div>
    </div>
  );
};

export default GaugeChart;
