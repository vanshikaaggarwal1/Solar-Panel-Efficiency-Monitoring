import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { fetchPanelsApi, createPanelApi, updatePanelApi, deletePanelApi } from '../services/api';
import {
  Grid as GridIcon,
  List as ListIcon,
  Search,
  Plus,
  SlidersHorizontal,
  Wrench,
  Trash2,
  Edit,
  Zap,
  MapPin,
  Calendar,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle
} from 'lucide-react';

const MonitoringPage = () => {
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Search, Filter, Sort state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [sortBy, setSortBy] = useState('panelId');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPanel, setEditingPanel] = useState(null);
  const [formData, setFormData] = useState({
    panelId: '',
    model: 'SunPower Maxeon 6 400W',
    type: 'Monocrystalline Silicon',
    status: 'Active',
    location: 'Rooftop Field Annex',
    ratedCapacityKW: 4.0,
    tiltAngleDeg: 28,
    azimuthDeg: 180
  });

  const [modelOptions, setModelOptions] = useState([
    "Monocrystalline 400W",
    "Monocrystalline 450W",
    "Monocrystalline 500W",
    "Monocrystalline 550W",
    "Polycrystalline 330W",
    "Polycrystalline 350W",
    "Polycrystalline 400W",
    "Thin Film 300W",
    "Thin Film 350W",
  ]);
  const [customModel, setCustomModel] = useState("");

  const [toast, setToast] = useState({ message: '', type: 'info' });

  const loadPanels = async () => {
    setLoading(true);
    try {
      const res = await fetchPanelsApi({
        search,
        status: statusFilter,
        sortBy
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
  }, [search, statusFilter, sortBy]);

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

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    try {
      if (editingPanel) {
        await updatePanelApi(editingPanel._id || editingPanel.panelId, formData);
        setToast({ message: `Panel ${formData.panelId} updated successfully.`, type: 'success' });
      } else {
        await createPanelApi(formData);
        setToast({ message: `New panel ${formData.panelId} registered.`, type: 'success' });
      }
      setModalOpen(false);
      loadPanels();
    } catch (err) {
      console.error('Save panel error:', err);
      setToast({ message: err.response?.data?.error || 'Failed to save panel.', type: 'error' });
    }
  };

  const handleDelete = async (id, panelId) => {
    if (!window.confirm(`Are you sure you want to unregister panel ${panelId}?`)) return;
    try {
      await deletePanelApi(id);
      setToast({ message: `Panel ${panelId} removed from inventory.`, type: 'success' });
      loadPanels();
    } catch (err) {
      setToast({ message: 'Failed to delete panel.', type: 'error' });
    }
  };

  const filteredPanels = panels.filter((p) => {
    const matchesLoc = locationFilter === 'All' || p.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesLoc;
  });

  const getStatusChip = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-forest-500/10 text-forest-500 border border-forest-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-500"></span> Online
          </span>
        );
      case 'Degraded':
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Warning
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sand-400/20 text-copper-600 border border-sand-400/40">
            <span className="w-1.5 h-1.5 rounded-full bg-copper-500"></span> Maintenance
          </span>
        );
      case 'Offline':
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Offline
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-warmBg dark:bg-[#121212] text-primaryText dark:text-neutral-100 transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">

        {/* Header & Main Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderNeutral dark:border-[#262626]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primaryText dark:text-white">
              Solar Panels Fleet Inventory
            </h1>
            <p className="text-xs text-secondaryText mt-0.5">
              Monitor, calibrate, and configure individual photovoltaic panel telemetry modules
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-white dark:bg-[#1A1A1A] border border-borderNeutral dark:border-[#262626] rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${viewMode === 'grid'
                  ? 'bg-forest-500 text-white'
                  : 'text-secondaryText hover:text-primaryText'
                  }`}
                title="Grid view"
              >
                <GridIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${viewMode === 'list'
                  ? 'bg-forest-500 text-white'
                  : 'text-secondaryText hover:text-primaryText'
                  }`}
                title="List view"
              >
                <ListIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-xs transition-colors shadow-subtle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Panel</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="saas-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">

            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search panel ID, model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-secondaryText font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Online</option>
                <option value="Degraded">Warning</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            {/* Sector Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-secondaryText font-medium">Sector:</span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="All">All Sectors</option>
                <option value="Rooftop">Rooftop Field</option>
                <option value="Ground">Ground Array</option>
                <option value="Carport">Carport Sector</option>
              </select>
            </div>

          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-secondaryText font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
            >
              <option value="panelId">Panel ID</option>
              <option value="currentPowerKW">Power Output</option>
              <option value="efficiencyPct">Efficiency</option>
            </select>
          </div>
        </div>

        {/* Content View */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-forest-500">
            <div className="w-8 h-8 border-2 border-forest-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold text-secondaryText">Loading panel inventory...</span>
          </div>
        ) : filteredPanels.length === 0 ? (
          <div className="saas-card p-12 text-center space-y-2">
            <p className="text-sm font-semibold text-primaryText dark:text-white">No solar panels found</p>
            <p className="text-xs text-secondaryText">Try adjusting your search criteria or register a new module.</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPanels.map((panel) => (
              <div key={panel.panelId} className="saas-card p-4 flex flex-col justify-between space-y-4">

                {/* Top Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primaryText dark:text-white">{panel.panelId}</span>
                      {getStatusChip(panel.status)}
                    </div>
                    <p className="text-[11px] text-secondaryText mt-0.5 truncate">{panel.model}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(panel)}
                      className="p-1 rounded-lg text-slate-400 hover:text-primaryText hover:bg-slate-100 dark:hover:bg-[#2A2A2A] transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(panel._id || panel.panelId, panel.panelId)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-warmBg dark:bg-[#202020] border border-borderNeutral dark:border-[#262626]">
                  <div>
                    <span className="text-[10px] font-semibold text-secondaryText block">Power Output</span>
                    <span className="text-sm font-bold text-primaryText dark:text-white">{panel.currentPowerKW} kW</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-secondaryText block">Efficiency</span>
                    <span className="text-sm font-bold text-forest-500">{panel.efficiencyPct}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-secondaryText block">Voltage</span>
                    <span className="text-xs font-medium text-primaryText dark:text-slate-200">{panel.voltageV} V</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-secondaryText block">Temperature</span>
                    <span className="text-xs font-medium text-primaryText dark:text-slate-200">{panel.temperatureC}°C</span>
                  </div>
                </div>

                {/* Footer Subtext */}
                <div className="flex items-center justify-between text-[11px] text-secondaryText pt-1 border-t border-borderNeutral dark:border-[#262626]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="truncate max-w-[140px]">{panel.location}</span>
                  </span>
                  <span>Cap: {panel.ratedCapacityKW} kW</span>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="saas-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#1A1A1A] border-b border-borderNeutral dark:border-[#262626] text-secondaryText font-semibold sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Panel ID</th>
                    <th className="py-3 px-4">Model & Type</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Rated Cap</th>
                    <th className="py-3 px-4">Power</th>
                    <th className="py-3 px-4">Voltage</th>
                    <th className="py-3 px-4">Temp</th>
                    <th className="py-3 px-4">Efficiency</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderNeutral dark:divide-[#262626]">
                  {filteredPanels.map((panel) => (
                    <tr key={panel.panelId} className="hover:bg-slate-50/60 dark:hover:bg-[#222] transition-colors">
                      <td className="py-3 px-4 font-bold text-primaryText dark:text-white">{panel.panelId}</td>
                      <td className="py-3 px-4 text-secondaryText">
                        <div className="font-medium text-primaryText dark:text-slate-200">{panel.model}</div>
                        <div className="text-[10px] text-secondaryText">{panel.type}</div>
                      </td>
                      <td className="py-3 px-4 text-secondaryText">{panel.location}</td>
                      <td className="py-3 px-4 text-secondaryText">{panel.ratedCapacityKW} kW</td>
                      <td className="py-3 px-4 font-semibold text-primaryText dark:text-white">{panel.currentPowerKW} kW</td>
                      <td className="py-3 px-4 text-secondaryText">{panel.voltageV} V</td>
                      <td className="py-3 px-4 text-secondaryText">{panel.temperatureC}°C</td>
                      <td className="py-3 px-4 font-bold text-forest-500">{panel.efficiencyPct}%</td>
                      <td className="py-3 px-4">{getStatusChip(panel.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(panel)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-primaryText hover:bg-slate-100 dark:hover:bg-[#2A2A2A]"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(panel._id || panel.panelId, panel.panelId)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-500/10"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Add / Edit Panel Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPanel ? `Edit Telemetry: ${editingPanel.panelId}` : 'Register New Photovoltaic Module'}
      >
        <form onSubmit={handleSubmitModal} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-secondaryText mb-1">Panel Identifier</label>
              <input
                type="text"
                required
                value={formData.panelId}
                onChange={(e) => setFormData({ ...formData, panelId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-secondaryText mb-1">Operational Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="Active">Online (Active)</option>
                <option value="Degraded">Warning (Degraded)</option>
                <option value="Maintenance">Maintenance Required</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-secondaryText mb-1">Model & Specification</label>
            <select
              required
              value={formData.model}
              onChange={(e) => {
                setFormData({ ...formData, model: e.target.value });
                if (e.target.value !== "Other") {
                  setCustomModel("");
                }
              }}
              className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
            >
              <option value="">Select Model & Specification</option>
              {modelOptions.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}

              <option value="Other">Other</option>
            </select>
            {formData.model === "Other" && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="Enter model & specification"
                  className="flex-1 px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />

                <button
                  type="button"
                  onClick={() => {
                    const model = customModel.trim();

                    if (!model) return;

                    if (!modelOptions.includes(model)) {
                      setModelOptions([...modelOptions, model]);
                    }

                    setFormData({ ...formData, model });
                    setCustomModel("");
                  }}
                  className="px-4 py-2 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold shadow-subtle"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-secondaryText mb-1">Substation Location Sector</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-secondaryText mb-1">Rated Capacity (kW)</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.ratedCapacityKW}
                onChange={(e) => setFormData({ ...formData, ratedCapacityKW: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-secondaryText mb-1">Tilt Angle (°)</label>
              <input
                type="number"
                value={formData.tiltAngleDeg}
                onChange={(e) => setFormData({ ...formData, tiltAngleDeg: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-secondaryText mb-1">Azimuth (°)</label>
              <input
                type="number"
                value={formData.azimuthDeg}
                onChange={(e) => setFormData({ ...formData, azimuthDeg: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-borderNeutral dark:border-[#262626]">
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
              {editingPanel ? 'Save Changes' : 'Register Module'}
            </button>
          </div>
        </form>
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default MonitoringPage;
