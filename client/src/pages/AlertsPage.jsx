import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { fetchAlertsApi, updateAlertStatusApi, createAlertApi } from '../services/api';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flame,
  ZapOff,
  Cpu,
  Wrench,
  Filter,
  Plus,
  ShieldAlert,
  Info
} from 'lucide-react';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  // New alert modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    panelId: 'SP-103',
    type: 'Overheating',
    severity: 'Warning',
    description: 'Thermal camera detected 58.2°C surface temperature hotspot on diode bank B.'
  });

  const [toast, setToast] = useState({ message: '', type: 'info' });

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetchAlertsApi({ status: statusFilter, severity: severityFilter });
      if (res.data.success) {
        setAlerts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [statusFilter, severityFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateAlertStatusApi(id, newStatus);
      setToast({ message: `Alert status updated to '${newStatus}'`, type: 'success' });
      loadAlerts();
    } catch (err) {
      setToast({ message: 'Failed to update alert status.', type: 'error' });
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      await createAlertApi(newAlert);
      setToast({ message: 'Custom alert logged in safety gateway.', type: 'success' });
      setModalOpen(false);
      loadAlerts();
    } catch (err) {
      setToast({ message: 'Failed to log alert.', type: 'error' });
    }
  };

  const severityBadge = (sev) => {
    switch (sev) {
      case 'Critical':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> Critical
          </span>
        );
      case 'Warning':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Warning
          </span>
        );
      case 'Info':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-skyAccent-400/15 text-skyAccent-400 border border-skyAccent-400/30 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Info
          </span>
        );
    }
  };

  const alertTypeIcon = (type) => {
    switch (type) {
      case 'Overheating':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'Low Efficiency':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'Sensor Failure':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'Low Voltage':
        return <ZapOff className="w-5 h-5 text-rose-400" />;
      case 'Maintenance Due':
      default:
        return <Wrench className="w-5 h-5 text-skyAccent-400" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-lightBg dark:bg-navy-950 transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <div>
            <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Safety & Fault Center</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
              Solar Panel Anomaly Alerts
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time fault notifications for overheating, voltage drops, and sensor disconnection
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Log Test Alert
          </button>
        </div>

        {/* Filter Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-solar-500" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="Warning">Warning</option>
                <option value="Info">Info</option>
              </select>
            </div>
          </div>

          <div className="text-xs font-bold text-slate-500">
            Showing <span className="text-solar-500">{alerts.length}</span> Anomaly Events
          </div>

        </div>

        {/* Alerts Cards Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">All Solar Systems Operating Normally</h3>
            <p className="text-xs text-slate-500">No active thermal or electrical alerts match your filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className={`glass-panel p-5 rounded-2xl glass-card border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  alert.status === 'Active'
                    ? 'border-rose-500/40 bg-rose-500/5'
                    : alert.status === 'Acknowledged'
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'border-slate-200 dark:border-white/10 opacity-75'
                }`}
              >
                
                {/* Left info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-navy-900/80 border border-slate-200 dark:border-white/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                    {alertTypeIcon(alert.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-extrabold text-navy-900 dark:text-white">
                        {alert.type} — Panel {alert.panelId}
                      </span>
                      {severityBadge(alert.severity)}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        alert.status === 'Active' ? 'bg-rose-500 text-white' : alert.status === 'Acknowledged' ? 'bg-amber-500 text-white' : 'bg-slate-500 text-white'
                      }`}>
                        {alert.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {alert.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> Logged: {alert.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {alert.status === 'Active' && (
                    <button
                      onClick={() => handleUpdateStatus(alert._id, 'Acknowledged')}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30 transition-colors"
                    >
                      Acknowledge Alert
                    </button>
                  )}

                  {alert.status !== 'Resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(alert._id, 'Resolved')}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
                    >
                      Resolve Alert
                    </button>
                  )}

                  {alert.status === 'Resolved' && (
                    <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Resolved
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* Log Custom Test Alert Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log System Alert Anomaly"
      >
        <form onSubmit={handleCreateAlert} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Panel ID</label>
              <input
                type="text"
                value={newAlert.panelId}
                onChange={(e) => setNewAlert({ ...newAlert, panelId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Alert Category</label>
              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              >
                <option value="Overheating">Overheating</option>
                <option value="Low Efficiency">Low Efficiency</option>
                <option value="Sensor Failure">Sensor Failure</option>
                <option value="Maintenance Due">Maintenance Due</option>
                <option value="Low Voltage">Low Voltage</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Severity Tier</label>
            <select
              value={newAlert.severity}
              onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
            >
              <option value="Critical">Critical</option>
              <option value="Warning">Warning</option>
              <option value="Info">Info</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Alert Diagnostic Description</label>
            <textarea
              rows={3}
              value={newAlert.description}
              onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-500/20"
            >
              Trigger Alert Event
            </button>
          </div>
        </form>
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default AlertsPage;
