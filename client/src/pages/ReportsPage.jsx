import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { fetchReportsApi, generateReportApi } from '../services/api';
import {
  FileText,
  Download,
  FileSpreadsheet,
  FileCheck,
  Calendar,
  Zap,
  TrendingUp,
  Globe,
  Plus,
  Eye,
  CheckCircle2
} from 'lucide-react';
import jsPDF from 'jspdf';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('Month'); // Day, Week, Month, Year
  const [customRange, setCustomRange] = useState('August 2026');
  const [previewReport, setPreviewReport] = useState(null);
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
        setToast({ message: `${selectedPeriod} Report generated successfully!`, type: 'success' });
        loadReports();
      }
    } catch (err) {
      setToast({ message: 'Failed to generate report.', type: 'error' });
    }
  };

  // Export CSV
  const handleExportCSV = (rep) => {
    const reportData = [
      ['Report ID', 'Title', 'Period', 'Date Range', 'Energy Generated (kWh)', 'Avg Efficiency (%)', 'Active Panels', 'CO2 Saved (kg)', 'Revenue (USD)'],
      [rep._id, rep.title, rep.period, rep.periodRange, rep.totalEnergyGeneratedKWh, rep.avgEfficiencyPct, rep.activePanelsCount, rep.carbonSavedKg, rep.revenueUsd]
    ];

    let csvContent = 'data:text/csv;charset=utf-8,';
    reportData.forEach(row => {
      csvContent += row.join(',') + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Solarix_Report_${rep._id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({ message: `Report ${rep._id} exported as CSV.`, type: 'success' });
  };

  // Export PDF using jsPDF
  const handleExportPDF = (rep) => {
    try {
      const doc = new jsPDF();

      // Title Header
      doc.setFillColor(11, 31, 51); // Navy #0B1F33
      doc.rect(0, 0, 210, 35, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('SOLARIX SOLAR MONITORING SYSTEM', 14, 18);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(56, 189, 248); // Sky blue
      doc.text('INDUSTRIAL IOT TELEMETRY & EFFICIENCY REPORT', 14, 26);

      // Report Info
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(rep.title, 14, 48);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Report Reference ID: ${rep._id}`, 14, 56);
      doc.text(`Audit Period: ${rep.period} (${rep.periodRange})`, 14, 62);
      doc.text(`Generated Date: ${rep.generatedDate}`, 14, 68);

      // Metrics Table Box
      doc.setFillColor(245, 247, 250);
      doc.rect(14, 76, 182, 70, 'F');

      doc.setFont('helvetica', 'bold');
      doc.text('Key Performance Indicators (KPIs)', 20, 86);
      doc.setFont('helvetica', 'normal');

      doc.text(`Total Solar Energy Output:`, 20, 96);
      doc.text(`${rep.totalEnergyGeneratedKWh} kWh`, 130, 96);

      doc.text(`Average Photovoltaic Efficiency:`, 20, 106);
      doc.text(`${rep.avgEfficiencyPct} %`, 130, 106);

      doc.text(`Active Monitored Solar Panels:`, 20, 116);
      doc.text(`${rep.activePanelsCount} Units`, 130, 116);

      doc.text(`Carbon Emission Offset:`, 20, 126);
      doc.text(`${rep.carbonSavedKg} kg CO2`, 130, 126);

      doc.text(`Estimated Energy Revenue:`, 20, 136);
      doc.text(`$${rep.revenueUsd}`, 130, 136);

      // Footer Stamp
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Verified by Solarix Telemetry Core Gateway | Confidential Environmental Audit', 14, 280);

      doc.save(`Solarix_Solar_Report_${rep._id}.pdf`);
      setToast({ message: `Report ${rep._id} exported as PDF.`, type: 'success' });
    } catch (err) {
      console.error('PDF export error:', err);
      setToast({ message: 'Failed to generate PDF.', type: 'error' });
    }
  };

  return (
    <div className="flex min-h-screen bg-lightBg dark:bg-navy-950 transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <div>
            <span className="text-xs font-bold text-solar-500 uppercase tracking-wider">Compliance & Export</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
              Solar Fleet Audit Reports
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Generate periodic yield analytics and export PDF & CSV audit documents
            </p>
          </div>
        </div>

        {/* Generate Report Card */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-solar-500" /> Generate New Audit Report
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Period Interval</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              >
                <option value="Day">Daily Report</option>
                <option value="Week">Weekly Report</option>
                <option value="Month">Monthly Report</option>
                <option value="Year">Yearly Report</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Date / Label Range</label>
              <input
                type="text"
                value={customRange}
                onChange={(e) => setCustomRange(e.target.value)}
                placeholder="August 2026"
                className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleGenerateReport}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-solar-500 to-solar-600 hover:from-solar-600 hover:to-solar-700 text-white font-bold text-xs shadow-md shadow-solar-500/25 transition-all hover:scale-[1.02]"
            >
              Compile & Save Report
            </button>

          </div>
        </div>

        {/* Reports History List */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Generated Reports Library ({reports.length})
          </h3>

          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading report library...</div>
          ) : reports.length === 0 ? (
            <div className="glass-panel p-8 text-center text-slate-400">No reports generated yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((rep) => (
                <div
                  key={rep._id}
                  className="glass-panel p-6 rounded-3xl glass-card border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-solar-500/15 text-solar-500 uppercase tracking-wider">
                        {rep.period} Audit
                      </span>
                      <h4 className="text-base font-extrabold text-navy-900 dark:text-white mt-1">
                        {rep.title}
                      </h4>
                      <span className="text-xs text-slate-400 block">ID: {rep._id} • Date: {rep.generatedDate}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-100/60 dark:bg-navy-900/60 p-3 rounded-xl border border-slate-200/50 dark:border-white/5 text-xs text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Generation</span>
                      <span className="font-bold text-solar-500">{rep.totalEnergyGeneratedKWh} kWh</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Avg Efficiency</span>
                      <span className="font-bold text-skyAccent-400">{rep.avgEfficiencyPct}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Revenue Value</span>
                      <span className="font-bold text-emerald-500">${rep.revenueUsd}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
                    <button
                      onClick={() => setPreviewReport(rep)}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-solar-500"
                    >
                      <Eye className="w-4 h-4" /> Preview
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleExportCSV(rep)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 transition-colors"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
                      </button>

                      <button
                        onClick={() => handleExportPDF(rep)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Export PDF
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Preview Modal */}
      <Modal
        isOpen={!!previewReport}
        onClose={() => setPreviewReport(null)}
        title={previewReport?.title || 'Report Audit Details'}
      >
        {previewReport && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-navy-900 text-white space-y-2">
              <div className="flex justify-between font-bold">
                <span>Reference: {previewReport._id}</span>
                <span className="text-skyAccent-400">{previewReport.period} Report</span>
              </div>
              <div className="text-[11px] text-slate-300">Generated on {previewReport.generatedDate} for range {previewReport.periodRange}</div>
            </div>

            <div className="space-y-2 border-t border-slate-200 dark:border-white/10 pt-3">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5 font-medium">
                <span className="text-slate-500">Total Solar Energy Yield:</span>
                <span className="font-bold text-solar-500">{previewReport.totalEnergyGeneratedKWh} kWh</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5 font-medium">
                <span className="text-slate-500">Photovoltaic Average Efficiency:</span>
                <span className="font-bold text-skyAccent-400">{previewReport.avgEfficiencyPct}%</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5 font-medium">
                <span className="text-slate-500">Active Panels in Operation:</span>
                <span className="font-bold text-slate-800 dark:text-white">{previewReport.activePanelsCount} Units</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5 font-medium">
                <span className="text-slate-500">Carbon Emissions Prevented:</span>
                <span className="font-bold text-emerald-500">{previewReport.carbonSavedKg} kg CO₂</span>
              </div>

              <div className="flex justify-between py-1.5 font-medium">
                <span className="text-slate-500">Financial Tariff Revenue Value:</span>
                <span className="font-bold text-amber-400">${previewReport.revenueUsd}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => handleExportPDF(previewReport)}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs"
              >
                Download PDF
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default ReportsPage;
