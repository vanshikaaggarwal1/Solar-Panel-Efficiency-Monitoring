import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { fetchPanelsApi, createPanelApi, updatePanelApi, deletePanelApi } from '../services/api';
import {
  Activity,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  SlidersHorizontal,
  Wrench,
  Trash2,
  Edit,
  Zap,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle
} from 'lucide-react';

const MonitoringPage = () => {
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter, Sort state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('panelId');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPanel, setEditingPanel] = useState(null);
  const [formData, setFormData] = useState({
    panelId: '',
    model: 'SunPower Maxeon 6 400W',
    type: 'Monocrystalline Silicon',
    status: 'Active',
    location: '',
    ratedCapacityKW: 4.0,
    tiltAngleDeg: 28,
    azimuthDeg: 180
  });

  const [toast, setToast] = useState({ message: '', type: 'info' });

  const loadPanels = async () => {
    setLoading(true);
    try {
      const res = await fetchPanelsApi({
        search,
        status: statusFilter,
        sortBy,
        sortOrder
      });
      if (res.data.success) {
        setPanels(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load panel telemetry:', err);
      setToast({ message: 'Error loading panel list.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPanels();
  }, [search, statusFilter, sortBy, sortOrder]);

  const handleOpenAddModal = () => {
    setEditingPanel(null);
    setFormData({
      panelId: `SP-${100 + panels.length + 1}`,
      model: 'SunPower Maxeon 6 400W',
      type: 'Monocrystalline Silicon',
      status: 'Active',
      location: 'Rooftop Field Annex',
      ratedCapacityKW: 4.0,
      tiltAngleDeg: 28,
      azimuthDeg: 180
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (panel) => {
    setEditingPanel(panel);
    setFormData({
      panelId: panel.panelId,
      model: panel.model,
      type: panel.type,
      status: panel.status,
      location: panel.location,
      ratedCapacityKW: panel.ratedCapacityKW,
      tiltAngleDeg: panel.tiltAngleDeg || 28,
      azimuthDeg: panel.azimuthDeg || 180
    });
    setModalOpen(true);
  };

  const handleSavePanel = async (e) => {
    e.preventDefault();
    try {
      if (editingPanel) {
        await updatePanelApi(editingPanel._id || editingPanel.panelId, formData);
        setToast({ message: `Panel ${formData.panelId} configuration updated!`, type: 'success' });
      } else {
        await createPanelApi(formData);
        setToast({ message: `New panel ${formData.panelId} registered in solar fleet!`, type: 'success' });
      }
      setModalOpen(false);
      loadPanels();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to save panel configuration.', type: 'error' });
    }
  };

  const handleDeletePanel = async (id, panelId) => {
    if (window.confirm(`Are you sure you want to remove panel ${panelId} from monitoring?`)) {
      try {
        await deletePanelApi(id);
        setToast({ message: `Panel ${panelId} removed.`, type: 'info' });
        loadPanels();
      } catch (err) {
        setToast({ message: 'Failed to delete panel.', type: 'error' });
      }
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span>;
      case 'Degraded':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"><AlertCircle className="w-3.5 h-3.5" /> Degraded</span>;
      case 'Maintenance':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-skyAccent-400/15 text-skyAccent-500 border border-skyAccent-400/30"><Clock className="w-3.5 h-3.5" /> Maintenance</span>;
      case 'Offline':
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"><XCircle className="w-3.5 h-3.5" /> Offline</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-lightBg dark:bg-navy-950 transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <div>
            <span className="text-xs font-bold text-solar-500 uppercase tracking-wider">Fleet Management</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
              Solar Panel Monitoring Console
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Detailed telemetry inspection, status filtering, and panel configuration
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-solar-500 to-solar-600 hover:from-solar-600 hover:to-solar-700 text-white font-bold text-xs shadow-lg shadow-solar-500/25 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Add Solar Panel
          </button>
        </div>

        {/* Search, Filter & Sort Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Panel ID, Location, or Model..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-solar-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            {/* Filter by Status */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Filter className="w-4 h-4 text-solar-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Degraded">Degraded Only</option>
                <option value="Maintenance">Maintenance Only</option>
                <option value="Offline">Offline Only</option>
              </select>
            </div>

            {/* Sort Field */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <ArrowUpDown className="w-4 h-4 text-skyAccent-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="panelId">Sort by ID</option>
                <option value="currentOutputKW">Sort by Output (kW)</option>
                <option value="efficiency">Sort by Efficiency (%)</option>
                <option value="temperatureC">Sort by Temp (°C)</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2.5 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                {sortOrder.toUpperCase()}
              </button>
            </div>

          </div>

        </div>

        {/* Panel Telemetry Grid & Table */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading solar panels...</div>
        ) : panels.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl space-y-3">
            <Zap className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Solar Panels Found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search keywords or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {panels.map((panel) => (
              <div
                key={panel._id || panel.panelId}
                className="glass-panel p-5 rounded-2xl glass-card border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-4 relative group"
              >
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-base font-extrabold text-navy-900 dark:text-white tracking-tight block">
                      {panel.panelId}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block max-w-[150px]">
                      {panel.model}
                    </span>
                  </div>
                  {statusBadge(panel.status)}
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-slate-100/50 dark:bg-navy-900/50 p-3 rounded-xl border border-slate-200/50 dark:border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block">Current Output</span>
                    <span className="text-sm font-bold text-solar-500">{panel.currentOutputKW} kW</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block">Efficiency</span>
                    <span className="text-sm font-bold text-skyAccent-400">{panel.efficiency}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block">Temperature</span>
                    <span className={`text-xs font-bold ${panel.temperatureC > 50 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                      {panel.temperatureC}°C
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block">Voltage / Current</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {panel.voltageV}V / {panel.currentA}A
                    </span>
                  </div>
                </div>

                {/* Location & Dates */}
                <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-solar-500 flex-shrink-0" />
                    <span className="truncate">{panel.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> Installed: {panel.installationDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 dark:border-white/5 text-[10px]">
                    <span>Last Maint:</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {panel.lastMaintenanceDate || 'None recorded'}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                  <button
                    onClick={() => handleOpenEditModal(panel)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-solar-500 hover:bg-solar-500/10 transition-colors"
                    title="Edit Panel Configuration"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePanel(panel._id || panel.panelId, panel.panelId)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Remove Panel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* Add / Edit Solar Panel Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPanel ? `Edit Panel ${editingPanel.panelId}` : 'Register New Solar Panel'}
      >
        <form onSubmit={handleSavePanel} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Panel ID</label>
              <input
                type="text"
                value={formData.panelId}
                onChange={(e) => setFormData({ ...formData, panelId: e.target.value })}
                placeholder="SP-109"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                required
                disabled={!!editingPanel}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Operational Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="Degraded">Degraded</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Panel Model</label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="SunPower Maxeon 6 400W"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Location / Field Substation</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Rooftop Sector Alpha (Bay 3)"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Capacity (kW)</label>
              <input
                type="number"
                step="0.1"
                value={formData.ratedCapacityKW}
                onChange={(e) => setFormData({ ...formData, ratedCapacityKW: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tilt Angle (°)</label>
              <input
                type="number"
                value={formData.tiltAngleDeg}
                onChange={(e) => setFormData({ ...formData, tiltAngleDeg: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Azimuth (°)</label>
              <input
                type="number"
                value={formData.azimuthDeg}
                onChange={(e) => setFormData({ ...formData, azimuthDeg: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>
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
              className="px-5 py-2 text-xs font-bold rounded-xl bg-solar-500 text-white hover:bg-solar-600 shadow-md shadow-solar-500/20"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default MonitoringPage;
