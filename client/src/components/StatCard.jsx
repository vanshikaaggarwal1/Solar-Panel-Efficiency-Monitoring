import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, unit = '', icon: Icon, trend, trendValue, subtext, statusPill }) => {
  return (
    <div className="saas-card p-4 flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-secondaryText truncate">
          {title}
        </span>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] flex items-center justify-center text-slate-600 dark:text-slate-300">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-primaryText dark:text-white">
            {value}
          </span>
          {unit && <span className="text-xs font-medium text-secondaryText">{unit}</span>}
        </div>

        <div className="flex items-center justify-between text-[11px]">
          {trend && (
            <div className={`flex items-center gap-1 font-semibold ${
              trend === 'up' ? 'text-forest-500' : trend === 'down' ? 'text-rose-600' : 'text-slate-400'
            }`}>
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trend === 'neutral' && <Minus className="w-3 h-3" />}
              <span>{trendValue}</span>
            </div>
          )}
          {subtext && <span className="text-secondaryText truncate text-[10px]">{subtext}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
