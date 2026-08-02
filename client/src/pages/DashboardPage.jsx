import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import GaugeChart from '../components/GaugeChart';
import Toast from '../components/Toast';
import { fetchDashboardStatsApi, pushTelemetryTickApi } from '../services/api';
import {
  Zap,
  Sun,
  Activity,
  Thermometer,
  ZapOff,
  BatteryCharging,
  Eye,
  RefreshCw,
  TrendingUp,
  Globe,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Radio
} from 'lucide-react';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetchDashboardStatsApi();
      if (res.data.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setToast({ message: 'Failed to synchronize live telemetry.', type: 'error' });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData(true);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSimulation = async () => {
    setSimulating(true);
    try {
      await pushTelemetryTickApi({
        panelId: 'SP-104',
        powerOutputKW: (4.1 + Math.random() * 0.4).toFixed(2),
        voltageV: (51 + Math.random() * 2).toFixed(1),
        currentA: (82 + Math.random() * 4).toFixed(1),
        temperatureC: (36 + Math.random() * 4).toFixed(1),
        irradianceWM2: Math.round(960 + Math.random() * 30),
        efficiencyPct: (23.2 + Math.random() * 0.5).toFixed(1)
      });
      setToast({ message: 'Sensor pulse received! Real-time dashboard updated.', type: 'success' });
      loadData(true);
    } catch (err) {
      setToast({ message: 'Simulation tick error.', type: 'error' });
    } finally {
      setSimulating(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex h-screen bg-lightBg dark:bg-navy-950">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-solar-500">
            <div className="w-12 h-12 border-4 border-solar-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-semibold text-sm text-slate-500 dark:text-slate-400">Loading Industrial IoT Analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  const { stats, charts } = dashboardData;

  // Line Chart Config - Energy Generation vs Irradiance
  const lineChartData = {
    labels: charts.hourlyLabels,
    datasets: [
      {
        label: 'Energy Output (kW)',
        data: charts.lineChartEnergy,
        borderColor: '#38BDF8',
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#38BDF8'
      },
      {
        label: 'Irradiance (W/m² ÷ 20)',
        data: charts.lineChartIrradiance.map(val => parseFloat((val / 20).toFixed(1))),
        borderColor: '#2E8B57',
        backgroundColor: 'rgba(46, 139, 87, 0.05)',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#94a3b8', font: { family: 'Inter' } } },
      tooltip: { backgroundColor: '#0B1F33', titleColor: '#38BDF8', bodyColor: '#fff', padding: 10 }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
    }
  };

  // Bar Chart Config - Daily Output Comparison
  const barChartData = {
    labels: charts.barChartDailyOutput.labels,
    datasets: [
      {
        label: 'Rooftop Sector',
        data: charts.barChartDailyOutput.datasets[0].data,
        backgroundColor: '#2E8B57',
        borderRadius: 6
      },
      {
        label: 'Ground Array',
        data: charts.barChartDailyOutput.datasets[1].data,
        backgroundColor: '#38BDF8',
        borderRadius: 6
      },
      {
        label: 'Carport East',
        data: charts.barChartDailyOutput.datasets[2].data,
        backgroundColor: '#F59E0B',
        borderRadius: 6
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#94a3b8', font: { family: 'Inter' } } }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
    }
  };

  // Pie Chart Config - Energy Utilization
  const pieChartData = {
    labels: charts.pieChartUtilization.labels,
    datasets: [
      {
        data: charts.pieChartUtilization.data,
        backgroundColor: ['#2E8B57', '#38BDF8', '#F59E0B', '#F43F5E'],
        borderWidth: 2,
        borderColor: 'transparent'
      }
    ]
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } }
    }
  };

  return (
    <div className="flex min-h-screen bg-lightBg dark:bg-navy-950 transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8">
        
        {/* Top Header & Real-time Live Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-solar-500 uppercase tracking-wider mb-1">
              <Radio className="w-4 h-4 text-emerald-500 animate-ping" /> Live Telemetry Operating Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
              Solar Fleet Performance Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Monitored Array Hub: Bay Area Substation Sector 4
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualSimulation}
              disabled={simulating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-skyAccent-500 to-solar-500 hover:from-skyAccent-600 hover:to-solar-600 text-white font-bold text-xs shadow-md shadow-skyAccent-400/20 transition-all hover:scale-105"
            >
              <RefreshCw className={`w-4 h-4 ${simulating ? 'animate-spin' : ''}`} />
              <span>Simulate Telemetry Tick</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: Prompt Required Primary Sensor Cards (8 Cards) */}
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-solar-500" /> Real-Time Telemetry Gauges
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* 1. Current Power Output (kW) */}
            <StatCard
              title="Current Power Output"
              value={stats.currentPowerKW}
              unit="kW"
              icon={Zap}
              color="solar"
              trend="up"
              trendValue="+4.2%"
              subtext="Rated capacity: 27.9 kW"
            />

            {/* 2. Energy Generated Today (kWh) */}
            <StatCard
              title="Energy Generated Today"
              value={stats.energyTodayKWh}
              unit="kWh"
              icon={Sun}
              color="amber"
              trend="up"
              trendValue="+8.1%"
              subtext="Solar hours active: 6.2 hrs"
            />

            {/* 3. Panel Efficiency (%) */}
            <StatCard
              title="Panel Efficiency"
              value={stats.avgEfficiency}
              unit="%"
              icon={TrendingUp}
              color="sky"
              trend="neutral"
              trendValue="Target 22.0%"
              subtext="Peak panel SP-104: 23.5%"
            />

            {/* 4. Temperature (°C) */}
            <StatCard
              title="Avg Temperature"
              value={stats.temperatureC || stats.avgTemperature}
              unit="°C"
              icon={Thermometer}
              color={stats.avgTemperature > 45 ? "rose" : "emerald"}
              trend={stats.avgTemperature > 45 ? "down" : "up"}
              trendValue={stats.avgTemperature > 45 ? "Elevated" : "Optimal"}
              subtext="Safety threshold: 55°C"
            />

            {/* 5. Voltage (V) */}
            <StatCard
              title="Terminal Voltage"
              value={stats.avgVoltage}
              unit="V"
              icon={Zap}
              color="purple"
              trend="neutral"
              trendValue="Stable"
              subtext="DC Bus Voltage"
            />

            {/* 6. Current (A) */}
            <StatCard
              title="Total Array Current"
              value={stats.totalCurrentA}
              unit="A"
              icon={Activity}
              color="sky"
              trend="up"
              trendValue="+2.1 A"
              subtext="String Combiner Current"
            />

            {/* 7. Irradiance (W/m²) */}
            <StatCard
              title="Solar Irradiance"
              value={stats.avgIrradiance}
              unit="W/m²"
              icon={Eye}
              color="amber"
              trend="up"
              trendValue="Clear Sky"
              subtext="Peak noon spectrum"
            />

            {/* 8. Battery Status (%) */}
            <StatCard
              title="Battery Storage Status"
              value={stats.avgBatteryPct}
              unit="%"
              icon={BatteryCharging}
              color="emerald"
              trend="up"
              trendValue="Charging"
              subtext="ESS Capacity: 100 kWh"
            />

          </div>
        </div>

        {/* SECTION 2: Dashboard Widgets Summary Grid (8 Widgets) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="glass-panel p-3.5 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Panels</span>
            <span className="text-lg font-bold text-navy-900 dark:text-white block">{stats.totalPanels}</span>
          </div>

          <div className="glass-panel p-3.5 rounded-xl text-center bg-emerald-500/10 border-emerald-500/20">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Active Panels</span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 block">{stats.activePanels}</span>
          </div>

          <div className="glass-panel p-3.5 rounded-xl text-center bg-amber-500/10 border-amber-500/20">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Degraded</span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400 block">{stats.degradedPanels}</span>
          </div>

          <div className="glass-panel p-3.5 rounded-xl text-center bg-rose-500/10 border-rose-500/20">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">Offline</span>
            <span className="text-lg font-bold text-rose-600 dark:text-rose-400 block">{stats.offlinePanels}</span>
          </div>

          <div className="glass-panel p-3.5 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Efficiency</span>
            <span className="text-lg font-bold text-skyAccent-400 block">{stats.avgEfficiency}%</span>
          </div>

          <div className="glass-panel p-3.5 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly Energy</span>
            <span className="text-lg font-bold text-solar-500 block">{stats.monthlyEnergyKWh} kWh</span>
          </div>

          <div className="glass-panel p-3.5 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">CO₂ Offset</span>
            <span className="text-lg font-bold text-emerald-500 block">{stats.carbonSavedKg} kg</span>
          </div>

          <div className="glass-panel p-3.5 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Revenue Est.</span>
            <span className="text-lg font-bold text-amber-400 block">${stats.revenueEstimateUsd}</span>
          </div>
        </div>

        {/* SECTION 3: Prompt Required 4 Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 1. Line Chart: Energy Generation over Time */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-900 dark:text-white">
                  Energy Generation vs Solar Irradiance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Diurnal output curve tracked across 2-hour sensor sampling windows
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-skyAccent-400/10 text-skyAccent-400 font-semibold">
                Live Line Chart
              </span>
            </div>
            <div className="h-64">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          {/* 2. Bar Chart: Daily Output Comparison */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-900 dark:text-white">
                  Daily Generation Comparison by Field Sector
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  7-Day output comparison (kWh) between Rooftop, Ground & Carport arrays
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-solar-500/10 text-solar-500 font-semibold">
                Bar Chart
              </span>
            </div>
            <div className="h-64">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>

          {/* 3. Pie Chart: Energy Utilization */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-900 dark:text-white">
                  Energy Utilization & Load Breakdown
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Direct load vs battery charge vs grid export breakdown (%)
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 font-semibold">
                Pie Chart
              </span>
            </div>
            <div className="h-64">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>

          {/* 4. Gauge Chart: Efficiency Percentage */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-900 dark:text-white">
                  Fleet Efficiency Gauge (%)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Overall photovoltaic conversion efficiency against benchmark target
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
                Gauge Chart
              </span>
            </div>
            <GaugeChart percentage={stats.avgEfficiency} max={30} title="Photovoltaic Efficiency" />
          </div>

        </div>

      </main>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default DashboardPage;
