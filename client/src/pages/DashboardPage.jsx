import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import GaugeChart from '../components/GaugeChart';
import Toast from '../components/Toast';
import { fetchDashboardStatsApi, fetchPanelsApi, pushTelemetryTickApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Zap,
  Sun,
  Activity,
  Grid,
  DollarSign,
  Globe,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Eye,
  Calendar,
  ArrowUpRight
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
import { Line, Bar, Doughnut } from 'react-chartjs-2';

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
  const registrationData = JSON.parse(
    localStorage.getItem('solarixRegistration') || '{}'
  );
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [panels, setPanels] = useState([]);
  const [simulating, setSimulating] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Table filtering & pagination state
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [dashRes, panelRes] = await Promise.all([
        fetchDashboardStatsApi(),
        fetchPanelsApi()
      ]);

      if (dashRes.data.success) {
        setDashboardData(dashRes.data);
      }
      if (panelRes.data.success) {
        setPanels(panelRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load telemetry:', err);
      setToast({ message: 'Failed to synchronize live telemetry.', type: 'error' });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData(true);
    }, 8000);
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
      setToast({ message: 'Sensor pulse received. Real-time telemetry updated.', type: 'success' });
      loadData(true);
    } catch (err) {
      setToast({ message: 'Telemetry sync error.', type: 'error' });
    } finally {
      setSimulating(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex h-screen bg-warmBg dark:bg-[#121212]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-forest-500">
            <div className="w-10 h-10 border-3 border-forest-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-secondaryText">Synchronizing Industrial Telemetry...</p>
          </div>
        </div>
      </div>
    );
  }

  const { stats, charts } = dashboardData;

  // Filtered Panels for Enterprise Table
  const filteredPanels = panels.filter((panel) => {
    const matchesSearch =
      panel.panelId.toLowerCase().includes(tableSearch.toLowerCase()) ||
      panel.location.toLowerCase().includes(tableSearch.toLowerCase()) ||
      panel.model.toLowerCase().includes(tableSearch.toLowerCase());
    const matchesStatus = statusFilter === 'All' || panel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPanels.length / itemsPerPage) || 1;
  const paginatedPanels = filteredPanels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Muted Palette Colors for Enterprise SaaS Charts
  const colorForest = '#2E5E4E';
  const colorOlive = '#6B8E23';
  const colorCopper = '#B87333';
  const colorSand = '#D8C3A5';
  const colorGray = '#8E9AAF';

  // 1. Line Chart: Energy Generation vs Solar Irradiance
  const lineChartData = {
    labels: charts.hourlyLabels,
    datasets: [
      {
        label: 'Energy Output (kW)',
        data: charts.lineChartEnergy,
        borderColor: colorForest,
        backgroundColor: 'rgba(46, 94, 78, 0.08)',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: colorForest,
        pointRadius: 3
      },
      {
        label: 'Solar Irradiance (W/m² ÷ 20)',
        data: charts.lineChartIrradiance.map((val) => parseFloat((val / 20).toFixed(1))),
        borderColor: colorOlive,
        backgroundColor: 'transparent',
        borderDash: [4, 4],
        fill: false,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 2
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: { color: '#6B7280', font: { family: 'Inter', size: 11 }, boxWidth: 12 }
      },
      tooltip: {
        backgroundColor: '#1F1F1F',
        titleColor: '#F3F4F6',
        bodyColor: '#D1D5DB',
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: { grid: { color: 'rgba(229, 231, 235, 0.4)' }, ticks: { color: '#9CA3AF', font: { size: 10 } } },
      y: { grid: { color: 'rgba(229, 231, 235, 0.4)' }, ticks: { color: '#9CA3AF', font: { size: 10 } } }
    }
  };

  // 2. Bar Chart: Daily Generation Comparison across Sectors
  const barChartData = {
    labels: charts.barChartDailyOutput.labels,
    datasets: [
      {
        label: 'Rooftop Array',
        data: charts.barChartDailyOutput.datasets[0].data,
        backgroundColor: colorForest,
        borderRadius: 4
      },
      {
        label: 'Ground Sector',
        data: charts.barChartDailyOutput.datasets[1].data,
        backgroundColor: colorOlive,
        borderRadius: 4
      },
      {
        label: 'Carport East',
        data: charts.barChartDailyOutput.datasets[2].data,
        backgroundColor: colorCopper,
        borderRadius: 4
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: { color: '#6B7280', font: { family: 'Inter', size: 11 }, boxWidth: 12 }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9CA3AF', font: { size: 10 } } },
      y: { grid: { color: 'rgba(229, 231, 235, 0.4)' }, ticks: { color: '#9CA3AF', font: { size: 10 } } }
    }
  };

  // 3. Donut Chart: Energy Utilization
  const donutChartData = {
    labels: charts.pieChartUtilization.labels,
    datasets: [
      {
        data: charts.pieChartUtilization.data,
        backgroundColor: [colorForest, colorOlive, colorCopper, colorGray],
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }
    ]
  };

  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#6B7280', font: { family: 'Inter', size: 11 }, boxWidth: 10 }
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-forest-500/10 text-forest-500 border border-forest-500/20">
            Online
          </span>
        );
      case 'Degraded':
      case 'Warning':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            Warning
          </span>
        );
      case 'Maintenance':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sand-400/20 text-copper-600 border border-sand-400/40">
            Maintenance
          </span>
        );
      case 'Offline':
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            Offline
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-warmBg dark:bg-[#121212] text-primaryText dark:text-neutral-100 transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">

        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderNeutral dark:border-[#262626]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-forest-500 mb-1">
              <Radio className="w-3.5 h-3.5 text-forest-500 animate-pulse" />
              <span>Substation Telemetry Operating Console</span>
            </div>
            <h1 className="text-xl font-bold text-primaryText dark:text-white">
              {registrationData.accountType === 'personal'
                ? 'Residential Solar Overview'
                : registrationData.accountType === 'business'
                  ? 'Commercial Solar Overview'
                  : 'Enterprise Solar Overview'}
            </h1>
            <p className="text-xs text-secondaryText mt-0.5">
              Welcome back, {user?.name || 'Operator'}. 
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A1A1A] border border-borderNeutral dark:border-[#262626] text-xs text-secondaryText">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentDate}</span>
            </div>

            <button
              onClick={handleManualSimulation}
              disabled={simulating}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-xs transition-colors shadow-subtle"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
              <span>Sync Sensor Pulse</span>
            </button>
          </div>
        </div>

        {/* 6 Core KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 2xl:grid-cols-6 gap-4">

          {/* 1. Total Energy (MWh) */}
          <StatCard
            title="Total Energy"
            value={stats.monthlyEnergyKWh ? (stats.monthlyEnergyKWh / 1000).toFixed(1) : '428.5'}
            unit="MWh"
            icon={Zap}
            trend="up"
            trendValue="+4.2%"
            subtext="Rated: 500 MWh"
          />

          {/* 2. Today's Production (kWh) */}
          <StatCard
            title="Today's Production"
            value={stats.energyTodayKWh || '1,420'}
            unit="kWh"
            icon={Sun}
            trend="up"
            trendValue="+8.1%"
            subtext="6.2 Active Hrs"
          />

          {/* 3. Average Efficiency (%) */}
          <StatCard
            title="Average Efficiency"
            value={stats.avgEfficiency || '21.8'}
            unit="%"
            icon={Activity}
            trend="neutral"
            trendValue="Target 22%"
            subtext="Peak: 23.5%"
          />

          {/* 4. Active Panels */}
          <StatCard
            title="Active Panels"
            value={`${stats.activePanels} / ${stats.totalPanels}`}
            unit="Operational"
            icon={Grid}
            trend="up"
            trendValue="96.8% Active"
            subtext={`${stats.offlinePanels} Offline`}
          />

          {/* 5. Revenue Estimate ($) */}
          <StatCard
            title="Revenue Estimate"
            value={`$${stats.revenueEstimateUsd ? stats.revenueEstimateUsd.toLocaleString() : '18,450'}`}
            unit="USD"
            icon={DollarSign}
            trend="up"
            trendValue="+5.4% MTD"
            subtext="Rate $0.12/kWh"
          />

          {/* 6. Carbon Offset (Tons) */}
          <StatCard
            title="Carbon Offset"
            value={stats.carbonSavedKg ? (stats.carbonSavedKg / 1000).toFixed(1) : '14.2'}
            unit="Tons CO₂"
            icon={Globe}
            trend="up"
            trendValue="-14.2t CO₂"
            subtext="Equiv 680 trees"
          />

        </div>

        {/* 4 Enterprise Chart Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Chart 1: Line Chart */}
          <div className="saas-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-primaryText dark:text-white">
                  Generation vs Solar Irradiance
                </h3>
                <p className="text-[11px] text-secondaryText">
                  2-Hour sensor sampling windows across active daytime spectrum
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-forest-500/10 text-forest-500">
                Live Line Chart
              </span>
            </div>
            <div className="h-64">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          {/* Chart 2: Bar Chart */}
          <div className="saas-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-primaryText dark:text-white">
                  Daily Generation Comparison
                </h3>
                <p className="text-[11px] text-secondaryText">
                  7-Day output comparison (kWh) between Rooftop, Ground & Carport arrays
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-olive-500/10 text-olive-600">
                Bar Chart
              </span>
            </div>
            <div className="h-64">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>

          {/* Chart 3: Donut Chart */}
          <div className="saas-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-primaryText dark:text-white">
                  Energy Utilization & Load Breakdown
                </h3>
                <p className="text-[11px] text-secondaryText">
                  Direct load vs battery ESS charge vs grid export breakdown (%)
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-copper-500/10 text-copper-600">
                Donut Chart
              </span>
            </div>
            <div className="h-64">
              <Doughnut data={donutChartData} options={donutChartOptions} />
            </div>
          </div>

          {/* Chart 4: Efficiency Gauge */}
          <div className="saas-card p-5 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-primaryText dark:text-white">
                  Photovoltaic Fleet Conversion Rate
                </h3>
                <p className="text-[11px] text-secondaryText">
                  Overall photovoltaic conversion efficiency against benchmark target
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sand-400/20 text-copper-600">
                Efficiency Gauge
              </span>
            </div>
            <GaugeChart percentage={stats.avgEfficiency} max={30} title="Photovoltaic Efficiency" />
          </div>

        </div>

        {/* Enterprise Telemetry Data Table */}
        <div className="saas-card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-primaryText dark:text-white">
                Live Substation Array Telemetry
              </h3>
              <p className="text-[11px] text-secondaryText">
                Real-time panel array status, voltage output, and efficiency scores
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative w-48 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search panel ID or location..."
                  value={tableSearch}
                  onChange={(e) => { setTableSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-3 py-1.5 text-xs rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Online</option>
                <option value="Degraded">Warning</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-borderNeutral dark:border-[#262626]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#1A1A1A] border-b border-borderNeutral dark:border-[#262626] text-secondaryText font-semibold sticky top-0">
                <tr>
                  <th className="py-3 px-4">Panel ID</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Power Output</th>
                  <th className="py-3 px-4">Voltage</th>
                  <th className="py-3 px-4">Temp</th>
                  <th className="py-3 px-4">Efficiency</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderNeutral dark:divide-[#262626]">
                {paginatedPanels.length > 0 ? (
                  paginatedPanels.map((panel) => (
                    <tr
                      key={panel.panelId}
                      className="hover:bg-slate-50/60 dark:hover:bg-[#222] transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-primaryText dark:text-white">
                        {panel.panelId}
                      </td>
                      <td className="py-3 px-4 text-secondaryText">{panel.location}</td>
                      <td className="py-3 px-4 font-medium text-primaryText dark:text-slate-200">
                        {panel.currentPowerKW} kW
                      </td>
                      <td className="py-3 px-4 text-secondaryText">{panel.voltageV} V</td>
                      <td className="py-3 px-4 text-secondaryText">{panel.temperatureC}°C</td>
                      <td className="py-3 px-4 font-medium text-forest-500">
                        {panel.efficiencyPct}%
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(panel.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-secondaryText text-xs">
                      No array panels found matching current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between text-xs text-secondaryText pt-2">
            <span>
              Showing {paginatedPanels.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredPanels.length)} of {filteredPanels.length} panels
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-borderNeutral dark:border-[#333] hover:bg-slate-100 dark:hover:bg-[#2A2A2A] disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-semibold text-primaryText dark:text-white">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-borderNeutral dark:border-[#333] hover:bg-slate-100 dark:hover:bg-[#2A2A2A] disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </main>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default DashboardPage;
