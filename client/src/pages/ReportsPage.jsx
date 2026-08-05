import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import { fetchReportsApi, generateReportApi } from '../services/api';
import {
  FileText,
  Download,
  FileSpreadsheet,
  Calendar,
  Zap,
  TrendingUp,
  Globe,
  Plus,
  Eye,
  CheckCircle2,
  Printer,
  ShieldCheck,
  FileDown
} from 'lucide-react';
import jsPDF from 'jspdf';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('Month'); // Day, Week, Month, Year
  const [customRange, setCustomRange] = useState('August 2026');
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await fetchReportsApi();
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleGenerateReport = async () => {
    try {
      const res = await generateReportApi({
        period: selectedPeriod,
        dateRange: customRange
      });
      if (res.data.success) {
        setToast({ message: `${selectedPeriod} Performance Report generated successfully!`, type: 'success' });
        loadReports();
      }
    } catch (err) {
      setToast({ message: 'Failed to generate report.', type: 'error' });
    }
  };

  const exportCSV = (report) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value,Unit\n' +
      `Report Title,${report.title || 'Solar Energy Audit'}\n` +
      `Date Range,${report.dateRange || customRange}\n` +
      `Total Energy Generated,${report.totalEnergyKWh || 428500},kWh\n` +
      `Average Fleet Efficiency,${report.avgEfficiency || 21.8},%\n` +
      `CO2 Offset,${report.co2SavedKg || 14200},kg\n` +
      `Estimated Revenue,$${report.estimatedRevenueUSD || 18450},USD\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Solar_Telemetry_Report_${report.period || 'Monthly'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({ message: 'CSV Report exported to downloads.', type: 'success' });
  };

  const exportPDF = (report) => {
    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('SOLARIX SYSTEMS - TELEMETRY AUDIT REPORT', 20, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Substation Sector 4 • Date: ${report.dateRange || customRange}`, 20, 28);
    doc.line(20, 32, 190, 32);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Metric Summary:', 20, 42);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`- Total Energy Generated: ${report.totalEnergyKWh || 428500} kWh`, 25, 52);
    doc.text(`- Average Fleet Photovoltaic Efficiency: ${report.avgEfficiency || 21.8}%`, 25, 60);
    doc.text(`- Total CO2 Emissions Avoided: ${report.co2SavedKg || 14200} kg`, 25, 68);
    doc.text(`- Cumulative Revenue Estimate: $${report.estimatedRevenueUSD || 18450} USD`, 25, 76);
    doc.text(`- Active Photovoltaic Arrays: ${report.activePanelsCount || 248} / 256`, 25, 84);

    doc.line(20, 92, 190, 92);
    doc.text('Authorized Compliance Signature: Dr. Marcus Vance, Chief Field Engineer', 20, 102);

    doc.save(`Solar_Telemetry_Report_${report.period || 'Monthly'}.pdf`);
    setToast({ message: 'PDF document generated.', type: 'success' });
  };

  return (
    <div className="flex min-h-screen bg-warmBg dark:bg-[#121212] text-primaryText dark:text-neutral-100 transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderNeutral dark:border-[#262626]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primaryText dark:text-white">
              Compliance & Performance Report Hub
            </h1>
            <p className="text-xs text-secondaryText mt-0.5">
              Compile, export, and certify energy yield reports for regulatory compliance and utility billing
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => exportPDF(reports[0] || {})}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-xs transition-colors shadow-subtle"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export PDF Audit</span>
            </button>
          </div>
        </div>

        {/* Report Generation Bar */}
        <div className="saas-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-primaryText dark:text-white">
            Generate Audit & Compliance Report
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-secondaryText mb-1">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="Daily">Daily Telemetry Audit</option>
                <option value="Weekly">Weekly Sector Yield</option>
                <option value="Month">Monthly Compliance Report</option>
                <option value="Year">Annual Substation Summary</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-secondaryText mb-1">Date Range Label</label>
              <input
                type="text"
                value={customRange}
                onChange={(e) => setCustomRange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerateReport}
                className="w-full py-2 px-4 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-xs transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Compile New Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Executive Report Preview Card */}
        <div className="saas-card p-6 space-y-6 bg-white dark:bg-[#181818] border border-borderNeutral dark:border-[#262626]">
          {/* Report Paper Style Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderNeutral dark:border-[#262626]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-forest-500" />
                <span className="font-bold text-base text-primaryText dark:text-white tracking-tight">
                  SOLARIX INDUSTRIAL ENERGY AUDIT
                </span>
              </div>
              <p className="text-xs text-secondaryText">
                Substation Array Sector 4 • Official Utility Generation Record
              </p>
            </div>

            <div className="text-right text-xs text-secondaryText">
              <div>Period: <span className="font-semibold text-primaryText dark:text-white">{customRange}</span></div>
              <div>Certified ID: <span className="font-mono text-forest-500 font-bold">SOL-2026-AUD-04</span></div>
            </div>
          </div>

          {/* Metric Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-warmBg dark:bg-[#202020] border border-borderNeutral dark:border-[#262626]">
            <div>
              <span className="text-[10px] font-semibold text-secondaryText uppercase block">Total Generation</span>
              <span className="text-lg font-bold text-primaryText dark:text-white">428,500 kWh</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-secondaryText uppercase block">Avg Efficiency</span>
              <span className="text-lg font-bold text-forest-500">21.8%</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-secondaryText uppercase block">CO₂ Offset</span>
              <span className="text-lg font-bold text-forest-500">14.2 Tons</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-secondaryText uppercase block">Revenue Yield</span>
              <span className="text-lg font-bold text-copper-600">$18,450.00</span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-primaryText dark:text-white">Array Sector Breakdown</h4>
            <div className="overflow-x-auto rounded-xl border border-borderNeutral dark:border-[#262626]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#1A1A1A] border-b border-borderNeutral dark:border-[#262626] text-secondaryText font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Array Sector</th>
                    <th className="py-2.5 px-4">Active Modules</th>
                    <th className="py-2.5 px-4">Power Output</th>
                    <th className="py-2.5 px-4">Performance Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderNeutral dark:divide-[#262626]">
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-primaryText dark:text-white">Rooftop Field Annex</td>
                    <td className="py-2.5 px-4 text-secondaryText">96 Panels</td>
                    <td className="py-2.5 px-4 font-medium text-primaryText dark:text-white">184,200 kWh</td>
                    <td className="py-2.5 px-4 font-semibold text-forest-500">86.2%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-primaryText dark:text-white">Ground Mount Solar Farm</td>
                    <td className="py-2.5 px-4 text-secondaryText">120 Panels</td>
                    <td className="py-2.5 px-4 font-medium text-primaryText dark:text-white">198,400 kWh</td>
                    <td className="py-2.5 px-4 font-semibold text-forest-500">84.8%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-primaryText dark:text-white">Carport Canopy East</td>
                    <td className="py-2.5 px-4 text-secondaryText">32 Panels</td>
                    <td className="py-2.5 px-4 font-medium text-primaryText dark:text-white">45,900 kWh</td>
                    <td className="py-2.5 px-4 font-semibold text-copper-600">81.5%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Export Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-borderNeutral dark:border-[#262626]">
            <button
              onClick={() => exportCSV(reports[0] || {})}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-borderNeutral dark:border-[#333] text-xs font-semibold text-secondaryText hover:text-primaryText transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => exportPDF(reports[0] || {})}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-forest-500 hover:bg-forest-600 text-white text-xs font-semibold shadow-subtle transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF Document</span>
            </button>
          </div>

        </div>

        {/* Recent Generated Reports Table */}
        <div className="saas-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-primaryText dark:text-white">
            Historical Report Archive
          </h3>

          <div className="overflow-x-auto rounded-xl border border-borderNeutral dark:border-[#262626]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#1A1A1A] border-b border-borderNeutral dark:border-[#262626] text-secondaryText font-semibold">
                <tr>
                  <th className="py-3 px-4">Report Identifier</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Date Range</th>
                  <th className="py-3 px-4">Generated Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderNeutral dark:divide-[#262626]">
                {reports.length > 0 ? (
                  reports.map((r) => (
                    <tr key={r._id || r.id} className="hover:bg-slate-50/60 dark:hover:bg-[#222] transition-colors">
                      <td className="py-3 px-4 font-bold text-primaryText dark:text-white">
                        {r.title || `Solar Audit ${r.period}`}
                      </td>
                      <td className="py-3 px-4 text-secondaryText">{r.period}</td>
                      <td className="py-3 px-4 text-secondaryText">{r.dateRange}</td>
                      <td className="py-3 px-4 text-secondaryText">
                        {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => exportCSV(r)}
                            className="p-1 rounded text-slate-400 hover:text-primaryText"
                            title="Export CSV"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => exportPDF(r)}
                            className="p-1 rounded text-slate-400 hover:text-forest-500"
                            title="Export PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-secondaryText text-xs">
                      No archived reports found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default ReportsPage;
