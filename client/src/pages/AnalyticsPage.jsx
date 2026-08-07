import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Toast from '../components/Toast';
import { fetchAnalyticsApi } from '../services/api';
import {
  BarChart3,
  Calendar,
  Zap,
  TrendingUp,
  Award,
  Sun,
  Activity
} from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState('30d'); // 24h, 7d, 30d, YTD
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetchAnalyticsApi({ timeframe });
      if (res.data.success) {
        setAnalyticsData(res.data.analytics);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setToast({ message: 'Failed to fetch database analytics.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeframe]);

  // Color Constants
  const colorForest = '#2E5E4E';
  const colorOlive = '#6B8E23';
  const colorCopper = '#B87333';

  if (loading || !analyticsData) {
    return (
      <div className="flex h-screen bg-warmBg dark:bg-[#121212]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-forest-500">
            <div className="w-10 h-10 border-3 border-forest-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-secondaryText">Computing MongoDB Analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  const {
    performanceRatio,
    inverterEfficiency,
    degradationRate,
    specificYield,
    productionData: prod,
    degradationData: deg,
    heatmap
  } = analyticsData;

  // Monthly Production Chart Data
  const productionChartData = {
    labels: prod.labels,
    datasets: [
      {
        type: 'bar',
        label: 'Actual Yield (MWh)',
        data: prod.actualYieldMWh,
        backgroundColor: colorForest,
        borderRadius: 4
      },
      {
        type: 'line',
        label: 'Target Benchmark (MWh)',
        data: prod.targetBenchmarkMWh,
        borderColor: colorOlive,
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3
      }
    ]
  };

  const productionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', align: 'end', labels: { color: '#6B7280', font: { family: 'Inter', size: 11 } } },
      tooltip: { backgroundColor: '#1F1F1F', titleColor: '#F3F4F6', bodyColor: '#D1D5DB', padding: 10 }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9CA3AF', font: { size: 10 } } },
      y: { grid: { color: 'rgba(229, 231, 235, 0.4)' }, ticks: { color: '#9CA3AF', font: { size: 10 } } }
    }
  };

  // Efficiency & Degradation Curve Data
  const degradationChartData = {
    labels: deg.labels,
    datasets: [
      {
        label: 'Monocrystalline Fleet (%)',
        data: deg.fleetDegradationPct,
        borderColor: colorForest,
        backgroundColor: 'rgba(46, 94, 78, 0.08)',
        fill: true,
        borderWidth: 2,
        tension: 0.2
      },
      {
        label: 'Manufacturer Limit (%)',
        data: deg.guaranteeLimitPct,
        borderColor: colorCopper,
        borderDash: [4, 4],
        fill: false,
        borderWidth: 2,
        tension: 0.2
      }
    ]
  };

  const degradationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', align: 'end', labels: { color: '#6B7280', font: { family: 'Inter', size: 11 } } }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9CA3AF', font: { size: 10 } } },
      y: { min: 90, max: 100, grid: { color: 'rgba(229, 231, 235, 0.4)' }, ticks: { color: '#9CA3AF', font: { size: 10 } } }
    }
  };

  const getHeatmapColor = (val) => {
    if (val > 90) return 'bg-forest-500 text-white font-bold';
    if (val > 70) return 'bg-forest-500/70 text-white font-semibold';
    if (val > 40) return 'bg-olive-500/40 text-primaryText dark:text-white font-medium';
    if (val > 20) return 'bg-sand-400/30 text-secondaryText';
    return 'bg-slate-100 dark:bg-neutral-800 text-slate-400';
  };

  return (
    <div className="flex min-h-screen bg-warmBg dark:bg-[#121212] text-primaryText dark:text-neutral-100 transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderNeutral dark:border-[#262626]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primaryText dark:text-white">
              Executive Solar Analytics & Performance Ratio
            </h1>
            <p className="text-xs text-secondaryText mt-0.5">
              Deep-dive operational efficiency metrics, thermal loss correlation, and asset degradation derived from MongoDB
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-[#1A1A1A] p-1 rounded-xl border border-borderNeutral dark:border-[#262626]">
            {['24h', '7d', '30d', 'YTD'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-colors ${
                  timeframe === t
                    ? 'bg-forest-500 text-white'
                    : 'text-secondaryText hover:text-primaryText'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Executive Performance Trend Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Performance Ratio (PR)"
            value={`${performanceRatio}%`}
            unit="PR"
            icon={Award}
            trend="up"
            trendValue="+1.2% benchmark"
            subtext="IEC 61724 Standard"
          />
          <StatCard
            title="Inverter Efficiency"
            value={`${inverterEfficiency}%`}
            unit="ETA"
            icon={Zap}
            trend="neutral"
            trendValue="Nominal 98.5%"
            subtext="3-Phase String Inverter"
          />
          <StatCard
            title="Degradation Rate"
            value={`${degradationRate}%`}
            unit="/ Year"
            icon={TrendingUp}
            trend="up"
            trendValue="Optimal (<0.5%)"
            subtext="25-Yr Linear Guarantee"
          />
          <StatCard
            title="Specific Energy Yield"
            value={specificYield ? specificYield.toLocaleString() : '1,480'}
            unit="kWh/kWp"
            icon={Sun}
            trend="up"
            trendValue="+4.5% vs Last Year"
            subtext="Annual Cumulative"
          />
        </div>

        {/* Deep Dive Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Monthly Production vs Target */}
          <div className="saas-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-primaryText dark:text-white">
                  Monthly Energy Yield vs Target Benchmark
                </h3>
                <p className="text-[11px] text-secondaryText">
                  Comparative analysis of actual generation against meteorological forecast models
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-forest-500/10 text-forest-500">
                Monthly MWh
              </span>
            </div>
            <div className="h-64">
              <Bar data={productionChartData} options={productionOptions} />
            </div>
          </div>

          {/* Degradation & Efficiency Curve */}
          <div className="saas-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-primaryText dark:text-white">
                  Photovoltaic Module Degradation Curve
                </h3>
                <p className="text-[11px] text-secondaryText">
                  Multi-year power retention trajectory benchmarked against manufacturer guarantee
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-copper-500/10 text-copper-600">
                Retention %
              </span>
            </div>
            <div className="h-64">
              <Line data={degradationChartData} options={degradationOptions} />
            </div>
          </div>

        </div>

        {/* Performance Heatmap Grid */}
        <div className="saas-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-primaryText dark:text-white">
                Diurnal Generation Heatmap Grid (7 Days × Diurnal Windows)
              </h3>
              <p className="text-[11px] text-secondaryText">
                Photovoltaic output intensity (%) mapped by day of week and 2-hour diurnal solar windows from MongoDB
              </p>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-secondaryText">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-neutral-800"></span> Low (&lt;20%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-olive-500/40"></span> Moderate (40-70%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-forest-500"></span> Peak (&gt;90%)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-borderNeutral dark:border-[#262626]">
            <table className="w-full text-center text-xs">
              <thead className="bg-slate-50 dark:bg-[#1A1A1A] border-b border-borderNeutral dark:border-[#262626] text-secondaryText font-semibold">
                <tr>
                  <th className="py-2.5 px-3 text-left">Day / Slot</th>
                  {heatmap.timeSlots.map((slot) => (
                    <th key={slot} className="py-2.5 px-3">{slot}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-borderNeutral dark:divide-[#262626]">
                {heatmap.days.map((day, dIdx) => (
                  <tr key={day}>
                    <td className="py-2.5 px-3 font-semibold text-left text-primaryText dark:text-white bg-slate-50/50 dark:bg-[#181818]">
                      {day}
                    </td>
                    {heatmap.heatmapMatrix[dIdx].map((val, tIdx) => (
                      <td key={tIdx} className="py-2.5 px-2">
                        <div className={`py-1.5 rounded-lg text-[11px] ${getHeatmapColor(val)}`}>
                          {val}%
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default AnalyticsPage;
