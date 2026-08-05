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
  Wrench,
  Filter,
  Plus,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
  Search,
  Check
} from 'lucide-react';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  // New alert modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    panelId: 'SP-103',
    type: 'Thermal Hotspot',
    severity: 'Warning',
    description: 'Bypass diode thermal sensor reading exceeded 56.4°C threshold under peak load.'
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
      setToast({ message: 'Error loading system alerts.', type: 'error' });
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
      setToast({ message: `Alert status updated to '${newStatus}'.`, type: 'success' });
      loadAlerts();
    } catch (err) {
      setToast({ message: 'Failed to update alert status.', type: 'error' });
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      await createAlertApi(newAlert);
      setToast({ message: 'New incident alert logged.', type: 'success' });
      setModalOpen(false);
      loadAlerts();
    } catch (err) {
      setToast({ message: 'Failed to create alert.', type: 'error' });
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            Critical
          </span>
        );
      case 'Warning':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-copper-500/10 text-copper-600 border border-copper-500/20">
            Warning
          </span>
        );
      case 'Info':
      case 'Low':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-forest-500/10 text-forest-500 border border-forest-500/20">
            Informational
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400">
            {severity}
          </span>
        );
    }
  };

  const activeCount = alerts.filter((a) => a.status === 'Active').length;
  const criticalCount = alerts.filter((a) => a.severity === 'Critical').length;
  const resolvedCount = alerts.filter((a) => a.status === 'Resolved').length;

  return (
    <div className="flex min-h-screen bg-warmBg dark:bg-[#121212] text-primaryText dark:text-neutral-100 transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderNeutral dark:border-[#262626]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primaryText dark:text-white">
              Substation Telemetry Alert Center
            </h1>
            <p className="text-xs text-secondaryText mt-0.5">
              Automated anomaly detection, thermal hotspots, and grid synchronization fault logs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-xs transition-colors shadow-subtle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Manual Alert</span>
            </button>
          </div>
        </div>

        {/* Incident Summary Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="saas-card p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-secondaryText block">Active Incidents</span>
              <span className="text-2xl font-bold text-copper-600">{activeCount}</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-copper-500/10 flex items-center justify-center text-copper-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="saas-card p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-secondaryText block">Critical Alerts</span>
              <span className="text-2xl font-bold text-rose-600">{criticalCount}</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>

          <div className="saas-card p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-secondaryText block">Resolved (24h)</span>
              <span className="text-2xl font-bold text-forest-500">{resolvedCount}</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-forest-500/10 flex items-center justify-center text-forest-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="saas-card p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-secondaryText font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-secondaryText font-medium">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="Warning">Warning</option>
                <option value="Info">Informational</option>
              </select>
            </div>
          </div>

          <span className="text-secondaryText text-[11px]">
            Showing {alerts.length} event records
          </span>
        </div>

        {/* Timeline Layout */}
        {loading ? (
          <div className="py-12 text-center text-secondaryText text-xs font-semibold">
            Loading telemetry alerts...
          </div>
        ) : alerts.length === 0 ? (
          <div className="saas-card p-12 text-center text-secondaryText text-xs">
            No incidents recorded matching the current filter criteria.
          </div>
        ) : (
          <div className="relative border-l-2 border-borderNeutral dark:border-[#262626] ml-4 sm:ml-6 space-y-4 pl-6">
            {alerts.map((alert) => {
              const isExpanded = expandedId === (alert._id || alert.id);
              const eventDate = new Date(alert.createdAt || Date.now()).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={alert._id || alert.id} className="relative">
                  {/* Timeline Dot Indicator */}
                  <div className={`absolute -left-[31px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#121212] ${
                    alert.severity === 'Critical' ? 'bg-rose-500' : alert.severity === 'Warning' ? 'bg-copper-500' : 'bg-forest-500'
                  }`} />

                  {/* Expandable Alert Card */}
                  <div className="saas-card p-4 space-y-3 transition-all">
                    
                    <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => toggleExpand(alert._id || alert.id)}>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-primaryText dark:text-white">
                            {alert.panelId}: {alert.type}
                          </span>
                          {getSeverityBadge(alert.severity)}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            alert.status === 'Active'
                              ? 'bg-rose-500/10 text-rose-600'
                              : alert.status === 'Acknowledged'
                              ? 'bg-amber-500/10 text-amber-600'
                              : 'bg-forest-500/10 text-forest-500'
                          }`}>
                            {alert.status}
                          </span>
                        </div>
                        <p className="text-xs text-secondaryText mt-1 leading-relaxed">
                          {alert.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 whitespace-nowrap hidden sm:inline">
                          {eventDate}
                        </span>
                        <button className="p-1 rounded text-slate-400 hover:text-primaryText">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Details Section */}
                    {isExpanded && (
                      <div className="pt-3 mt-3 border-t border-borderNeutral dark:border-[#262626] space-y-3 text-xs">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-warmBg dark:bg-[#202020]">
                          <div>
                            <span className="text-[10px] text-secondaryText block font-medium">Panel ID</span>
                            <span className="font-semibold text-primaryText dark:text-white">{alert.panelId}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-secondaryText block font-medium">Event Type</span>
                            <span className="font-semibold text-primaryText dark:text-white">{alert.type}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-secondaryText block font-medium">Recorded At</span>
                            <span className="font-semibold text-primaryText dark:text-white">{eventDate}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-secondaryText block font-medium">System Status</span>
                            <span className="font-semibold text-primaryText dark:text-white">{alert.status}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 pt-1">
                          {alert.status !== 'Acknowledged' && alert.status !== 'Resolved' && (
                            <button
                              onClick={() => handleUpdateStatus(alert._id || alert.id, 'Acknowledged')}
                              className="px-3 py-1.5 rounded-xl border border-borderNeutral dark:border-[#333] text-secondaryText hover:text-primaryText font-medium text-xs transition-colors"
                            >
                              Acknowledge
                            </button>
                          )}
                          {alert.status !== 'Resolved' && (
                            <button
                              onClick={() => handleUpdateStatus(alert._id || alert.id, 'Resolved')}
                              className="px-3 py-1.5 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-xs transition-colors shadow-subtle flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Mark Resolved</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Manual Alert Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log Substation Telemetry Incident"
      >
        <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-secondaryText mb-1">Target Panel ID</label>
            <input
              type="text"
              required
              value={newAlert.panelId}
              onChange={(e) => setNewAlert({ ...newAlert, panelId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-secondaryText mb-1">Incident Category</label>
              <input
                type="text"
                required
                value={newAlert.type}
                onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-secondaryText mb-1">Severity Level</label>
              <select
                value={newAlert.severity}
                onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="Critical">Critical</option>
                <option value="Warning">Warning</option>
                <option value="Info">Informational</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-secondaryText mb-1">Incident Details & Observations</label>
            <textarea
              rows="3"
              required
              value={newAlert.description}
              onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-borderNeutral dark:border-[#333] text-secondaryText hover:text-primaryText font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold shadow-subtle"
            >
              Submit Alert
            </button>
          </div>
        </form>
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default AlertsPage;
