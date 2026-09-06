import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, unit = '', icon: Icon, trend, trendValue, subtext }) => {
  return (
    <div className="saas-card p-4 flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B7280] dark:text-slate-300 truncate">
          {title}
        </span>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] dark:bg-[#121212] border border-[#E5E7EB] dark:border-[#283038] flex items-center justify-center text-[#1B3D3D] dark:text-[#D5E5F2]">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-[#111827] dark:text-white">
            {value}
          </span>
          {unit && <span className="text-xs font-medium text-[#6B7280] dark:text-slate-400">{unit}</span>}
        </div>

        <div className="flex items-center justify-between text-[11px]">
          {trend && (
            <div className={`flex items-center gap-1 font-semibold text-[#1B3D3D] dark:text-[#D5E5F2]`}>
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trend === 'neutral' && <Minus className="w-3 h-3" />}
              <span>{trendValue}</span>
            </div>
          )}
          {subtext && <span className="text-[#6B7280] dark:text-slate-400 truncate text-[10px]">{subtext}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
