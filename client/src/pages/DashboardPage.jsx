import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import GaugeChart from '../components/GaugeChart';
import Toast from '../components/Toast';
import { fetchDashboardStatsApi, fetchPanelsApi, pushTelemetryTickApi, fetchLatestTelemetryApi } from '../services/api';
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
  ChevronLeft,
  ChevronRight,
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

  const panelIds = ['SP-101', 'SP-102', 'SP-103', 'SP-104', 'SP-105'];
  const randomPanelId = panelIds[Math.floor(Math.random() * panelIds.length)];

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [dashRes, panelRes, telemetryRes] = await Promise.all([
        fetchDashboardStatsApi(),
        fetchPanelsApi(),
        fetchLatestTelemetryApi()
      ]);

      if (dashRes.data.success) {
        setDashboardData(dashRes.data);
      }

      let fetchedPanels = panelRes.data.success ? panelRes.data.data : [];

      if (telemetryRes.data?.success && telemetryRes.data.data.length > 0) {
        const telemetryMap = {};
        telemetryRes.data.data.forEach(t => {
          telemetryMap[t.panelId] = t;
        });

        fetchedPanels = fetchedPanels.map(p => {
          const t = telemetryMap[p.panelId];
          if (t) {
            return {
              ...p,
              currentPowerKW: t.power,
              voltageV: t.voltage,
              currentA: t.current,
              temperatureC: t.temperature,
              efficiency: t.efficiency,
              efficiencyPct: t.efficiency,
              irradianceWM2: t.irradiance,
              status: t.status === 'Online' ? 'Active' : t.status === 'Fault' ? 'Degraded' : t.status
            };
          }
          return p;
        });
      }

      setPanels(fetchedPanels);
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
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSimulation = async () => {
    setSimulating(true);
    try {
      await pushTelemetryTickApi({ panelId: randomPanelId });
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
      <div className="flex h-screen bg-white dark:bg-[#121212]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-[#1B3D3D] dark:text-[#D5E5F2]">
            <div className="w-10 h-10 border-3 border-current border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-[#6B7280] dark:text-slate-300">Synchronizing Solarix Telemetry...</p>
          </div>
        </div>
      </div>
    );
  }

  const { stats, charts } = dashboardData;

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

  // Minimal Chart Colors
  const mainColor = '#1B3D3D';
  const accentColor = '#D5E5F2';
  const borderGrey = '#E5E7EB';
  const textGrey = '#6B7280';

  // 1. Line Chart
  const lineChartData = {
    labels: charts.hourlyLabels,
    datasets: [
      {
        label: 'Energy Output (kW)',
        data: charts.lineChartEnergy,
        borderColor: mainColor,
        backgroundColor: 'rgba(27, 61, 61, 0.08)',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: mainColor,
        pointRadius: 3
      },
      {
        label: 'Solar Irradiance (W/m² ÷ 20)',
        data: charts.lineChartIrradiance.map((val) => parseFloat((val / 20).toFixed(1))),
        borderColor: textGrey,
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
        labels: { color: textGrey, font: { family: 'Inter', size: 11 }, boxWidth: 12 }
      },
      tooltip: {
        backgroundColor: '#121212',
        titleColor: '#FFFFFF',
        bodyColor: '#E5E7EB',
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: { grid: { color: borderGrey }, ticks: { color: textGrey, font: { size: 10 } } },
      y: { grid: { color: borderGrey }, ticks: { color: textGrey, font: { size: 10 } } }
    }
  };

  // 2. Bar Chart
  const barChartData = {
    labels: charts.barChartDailyOutput.labels,
    datasets: [
      {
        label: 'Rooftop Array',
        data: charts.barChartDailyOutput.datasets[0].data,
        backgroundColor: mainColor,
        borderRadius: 4
      },
      {
        label: 'Ground Sector',
        data: charts.barChartDailyOutput.datasets[1].data,
        backgroundColor: textGrey,
        borderRadius: 4
      },
      {
        label: 'Carport East',
        data: charts.barChartDailyOutput.datasets[2].data,
        backgroundColor: '#9CA3AF',
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
        labels: { color: textGrey, font: { family: 'Inter', size: 11 }, boxWidth: 12 }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: textGrey, font: { size: 10 } } },
      y: { grid: { color: borderGrey }, ticks: { color: textGrey, font: { size: 10 } } }
    }
  };

  // 3. Donut Chart
  const donutChartData = {
    labels: charts.pieChartUtilization.labels,
    datasets: [
      {
        data: charts.pieChartUtilization.data,
        backgroundColor: [mainColor, textGrey, '#9CA3AF', '#D1D5DB'],
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
        labels: { color: textGrey, font: { family: 'Inter', size: 11 }, boxWidth: 10 }
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#1B3D3D]/10 text-[#1B3D3D] dark:bg-[#D5E5F2]/20 dark:text-[#D5E5F2] border border-[#1B3D3D]/20 dark:border-[#D5E5F2]/30">
            Online
          </span>
        );
      case 'Degraded':
      case 'Warning':
      case 'Maintenance':
      case 'Offline':
      case 'Critical':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F3F4F6] text-[#6B7280] dark:bg-[#1E242B] dark:text-slate-300 border border-[#E5E7EB] dark:border-[#283038]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-white dark:bg-[#121212] text-[#111827] dark:text-white transition-colors">
      <Sidebar />

      {/* pb-24 lg:pb-8 ensures mobile bottom nav never hides content */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-[1600px] w-full min-w-0 mx-auto space-y-6 overflow-x-hidden">

        {/* Top Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB] dark:border-[#283038]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1B3D3D] dark:text-[#D5E5F2] mb-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Substation Telemetry Operating Console</span>
            </div>
            <h1 className="text-xl font-bold text-[#111827] dark:text-white capitalize">
              {user?.accountType ? `${user.accountType} Solar Overview` : 'Solarix Overview'}
            </h1>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-0.5">
              Welcome back, {user?.name || 'Operator'}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1E242B] border border-[#E5E7EB] dark:border-[#283038] text-xs text-[#6B7280] dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{currentDate}</span>
            </div>

            <button
              onClick={handleManualSimulation}
              disabled={simulating}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1B3D3D] dark:bg-[#D5E5F2] hover:opacity-90 text-white dark:text-[#121212] font-semibold text-xs transition-colors shadow-subtle"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
              <span>Sync Sensor Pulse</span>
            </button>
          </div>
        </div>

        {/* 6 Core KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          <StatCard
            title="Total Energy"
            value={stats.monthlyEnergyKWh ? (stats.monthlyEnergyKWh / 1000).toFixed(1) : '428.5'}
            unit="MWh"
            icon={Zap}
            trend="up"
            trendValue="+4.2%"
            subtext="Rated: 500 MWh"
          />

          <StatCard
            title="Today's Production"
            value={stats.energyTodayKWh || '1,420'}
            unit="kWh"
            icon={Sun}
            trend="up"
            trendValue="+8.1%"
            subtext="6.2 Active Hrs"
          />

          <StatCard
            title="Average Efficiency"
            value={stats.avgEfficiency || '21.8'}
            unit="%"
            icon={Activity}
            trend="neutral"
            trendValue="Target 22%"
            subtext="Peak: 23.5%"
          />

          <StatCard
            title="Active Panels"
            value={`${stats.activePanels} / ${stats.totalPanels}`}
            unit="Operational"
            icon={Grid}
            trend="up"
            trendValue="96.8% Active"
            subtext={`${stats.offlinePanels} Offline`}
          />

          <StatCard
            title="Revenue Estimate"
            value={`$${stats.revenueEstimateUsd ? stats.revenueEstimateUsd.toLocaleString() : '18,450'}`}
            unit="USD"
            icon={DollarSign}
            trend="up"
            trendValue="+5.4% MTD"
            subtext="Rate $0.12/kWh"
          />

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
                <h3 className="text-sm font-bold text-[#111827] dark:text-white">
                  Generation vs Solar Irradiance
                </h3>
                <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                  2-Hour sensor sampling windows across active daytime spectrum
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1B3D3D]/10 text-[#1B3D3D] dark:bg-[#D5E5F2]/20 dark:text-[#D5E5F2]">
                Live Line Chart
              </span>
            </div>
            <div className="horizontal-scroll-container">
              <div className="h-64 min-w-[550px]">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>
          </div>

          {/* Chart 2: Bar Chart */}
          <div className="saas-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#111827] dark:text-white">
                  Daily Generation Comparison
                </h3>
                <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                  7-Day output comparison (kWh) between Rooftop, Ground & Carport arrays
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1B3D3D]/10 text-[#1B3D3D] dark:bg-[#D5E5F2]/20 dark:text-[#D5E5F2]">
                7-Day Comparison
              </span>
            </div>
            <div className="horizontal-scroll-container">
              <div className="h-64 min-w-[550px]">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </div>
          </div>

          {/* Chart 3: Gauge Chart */}
          <div className="saas-card p-5 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#111827] dark:text-white">
                  Fleet Photovoltaic Efficiency Gauge
                </h3>
                <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                  Real-time fleet conversion rating against STC (Standard Test Conditions)
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1B3D3D]/10 text-[#1B3D3D] dark:bg-[#D5E5F2]/20 dark:text-[#D5E5F2]">
                Gauge Metric
              </span>
            </div>
            <div className="py-2 flex justify-center">
              <GaugeChart percentage={stats.avgEfficiency || 21.8} max={30} title="Fleet Efficiency (%)" />
            </div>
            <div className="p-3 rounded-xl bg-[#F9FAFB] dark:bg-[#121212] border border-[#E5E7EB] dark:border-[#283038] text-xs flex items-center justify-between">
              <span className="text-[11px] text-[#6B7280] dark:text-slate-400">Optimal Range Standard</span>
              <span className="font-semibold text-[#111827] dark:text-white">20.0% – 25.0%</span>
            </div>
          </div>

          {/* Chart 4: Utilization Donut Chart */}
          <div className="saas-card p-5 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#111827] dark:text-white">
                  Energy Distribution & Grid Export
                </h3>
                <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                  Self-consumption vs BESS storage & Utility grid feed-in ratio
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1B3D3D]/10 text-[#1B3D3D] dark:bg-[#D5E5F2]/20 dark:text-[#D5E5F2]">
                Donut Metric
              </span>
            </div>
            <div className="h-56 relative flex items-center justify-center">
              <Doughnut data={donutChartData} options={donutChartOptions} />
            </div>
            <div className="p-3 rounded-xl bg-[#F9FAFB] dark:bg-[#121212] border border-[#E5E7EB] dark:border-[#283038] text-xs flex items-center justify-between">
              <span className="text-[11px] text-[#6B7280] dark:text-slate-400">Grid Feed-in Active</span>
              <span className="font-semibold text-[#1B3D3D] dark:text-[#D5E5F2] flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> 58% Exported
              </span>
            </div>
          </div>

        </div>

        {/* Live Panel Telemetry Table */}
        <div className="saas-card overflow-hidden">
          <div className="p-5 border-b border-[#E5E7EB] dark:border-[#283038] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">
                Solar Panel Monitoring Console
              </h3>
              <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                Real-time array telemetry and electrical parameters
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 text-[#6B7280] dark:text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search array..."
                  value={tableSearch}
                  onChange={(e) => { setTableSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F9FAFB] dark:bg-[#121212] border border-[#E5E7EB] dark:border-[#283038] text-xs text-[#111827] dark:text-white focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-[#F9FAFB] dark:bg-[#121212] border border-[#E5E7EB] dark:border-[#283038] text-xs text-[#6B7280] dark:text-slate-300 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active / Online</option>
                <option value="Degraded">Degraded</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          <div className="horizontal-scroll-container">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="bg-[#F9FAFB] dark:bg-[#121212] text-[#6B7280] dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-[#E5E7EB] dark:border-[#283038]">
                <tr>
                  <th className="px-5 py-3">Panel ID</th>
                  <th className="px-5 py-3">Model</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Output (kW)</th>
                  <th className="px-5 py-3">Efficiency</th>
                  <th className="px-5 py-3">Temp (°C)</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#283038] text-[#111827] dark:text-slate-200">
                {paginatedPanels.length > 0 ? (
                  paginatedPanels.map((panel) => (
                    <tr key={panel._id} className="hover:bg-[#F9FAFB] dark:hover:bg-[#121212]/50 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-[#1B3D3D] dark:text-[#D5E5F2]">{panel.panelId}</td>
                      <td className="px-5 py-3.5">{panel.model}</td>
                      <td className="px-5 py-3.5 text-[#6B7280] dark:text-slate-400">{panel.location}</td>
                      <td className="px-5 py-3.5 font-bold">{panel.currentOutputKW || panel.currentPowerKW || 0} kW</td>
                      <td className="px-5 py-3.5 font-semibold">{panel.efficiency || panel.efficiencyPct || 0}%</td>
                      <td className="px-5 py-3.5">{panel.temperatureC || 25}°C</td>
                      <td className="px-5 py-3.5">{getStatusBadge(panel.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-5 py-8 text-center text-[#6B7280]">
                      No solar panels found matching search filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#E5E7EB] dark:border-[#283038] flex items-center justify-between text-xs text-[#6B7280] dark:text-slate-400">
            <span>Showing {paginatedPanels.length} of {filteredPanels.length} panels</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#283038] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#283038] disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
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
