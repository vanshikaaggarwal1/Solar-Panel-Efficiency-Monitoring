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
  Trash2,
  Edit,
  Zap,
  MapPin,
  Calendar,
  Sun,
  Thermometer,
  Compass,
  Layers,
  Hash,
  ShieldCheck,
  Activity
} from 'lucide-react';

const DIRECTION_AZIMUTH_MAP = {
  'North': 0,
  'Northeast': 45,
  'East': 90,
  'Southeast': 135,
  'South': 180,
  'Southwest': 225,
  'West': 270,
  'Northwest': 315
};

const getDirectionFromAzimuth = (azimuth) => {
  if (azimuth === undefined || azimuth === null || azimuth === '') return 'South';
  const az = Number(azimuth);
  const entry = Object.entries(DIRECTION_AZIMUTH_MAP).find(([_, deg]) => deg === az);
  return entry ? entry[0] : 'South';
};

const isBlank = (val) => {
  if (val === null || val === undefined) return true;
  return String(val).trim() === '';
};

const isValidNumber = (val) => {
  if (isBlank(val)) return false;
  const num = Number(val);
  return !isNaN(num);
};

const getPanelMetrics = (panel) => {
  const irradiance = (panel.irradianceWM2 !== undefined && panel.irradianceWM2 !== null && panel.irradianceWM2 !== '')
    ? Number(panel.irradianceWM2)
    : ((panel.irradiance !== undefined && panel.irradiance !== null && panel.irradiance !== '') ? Number(panel.irradiance) : null);

  const tempC = (panel.temperatureC !== undefined && panel.temperatureC !== null && panel.temperatureC !== '')
    ? Number(panel.temperatureC)
    : null;

  const voltageV = (panel.voltageV !== undefined && panel.voltageV !== null && panel.voltageV !== '')
    ? Number(panel.voltageV)
    : ((panel.ratedVoltageV !== undefined && panel.ratedVoltageV !== null && panel.ratedVoltageV !== '') ? Number(panel.ratedVoltageV) : null);

  const currentA = (panel.currentA !== undefined && panel.currentA !== null && panel.currentA !== '')
    ? Number(panel.currentA)
    : ((panel.ratedCurrentA !== undefined && panel.ratedCurrentA !== null && panel.ratedCurrentA !== '') ? Number(panel.ratedCurrentA) : null);

  const area = (panel.panelArea !== undefined && panel.panelArea !== null && panel.panelArea !== '')
    ? Number(panel.panelArea)
    : ((panel.area !== undefined && panel.area !== null && panel.area !== '') ? Number(panel.area) : null);

  // Electrical Output Power: Power = Voltage × Current
  let powerW = null;
  let powerDisplay = 'N/A';
  if (voltageV !== null && currentA !== null && !isNaN(voltageV) && !isNaN(currentA)) {
    powerW = voltageV * currentA;
    if (powerW >= 1000) {
      powerDisplay = `${(powerW / 1000).toFixed(2)} kW`;
    } else {
      powerDisplay = `${powerW.toFixed(1)} W`;
    }
  } else if (panel.currentOutputKW !== undefined && panel.currentOutputKW !== null) {
    powerDisplay = `${Number(panel.currentOutputKW).toFixed(2)} kW`;
  } else if (panel.currentPowerKW !== undefined && panel.currentPowerKW !== null) {
    powerDisplay = `${Number(panel.currentPowerKW).toFixed(2)} kW`;
  }

  // Solar Input Power: Solar Input = Irradiance × Panel Area
  let solarInputDisplay = 'N/A';
  if (irradiance !== null && area !== null && !isNaN(irradiance) && !isNaN(area) && area > 0) {
    const solarInputW = irradiance * area;
    if (solarInputW >= 1000) {
      solarInputDisplay = `${(solarInputW / 1000).toFixed(2)} kW`;
    } else {
      solarInputDisplay = `${solarInputW.toFixed(1)} W`;
    }
  }

  // Efficiency: η = (Voltage × Current) / (Irradiance × Panel Area) × 100
  let efficiencyDisplay = 'N/A';
  if (
    voltageV !== null &&
    currentA !== null &&
    irradiance !== null &&
    area !== null &&
    !isNaN(voltageV) &&
    !isNaN(currentA) &&
    !isNaN(irradiance) &&
    !isNaN(area) &&
    (irradiance * area) > 0
  ) {
    const eff = ((voltageV * currentA) / (irradiance * area)) * 100;
    efficiencyDisplay = `${eff.toFixed(1)}%`;
  } else if (panel.efficiency !== undefined && panel.efficiency !== null) {
    efficiencyDisplay = `${Number(panel.efficiency).toFixed(1)}%`;
  } else if (panel.efficiencyPct !== undefined && panel.efficiencyPct !== null) {
    efficiencyDisplay = `${Number(panel.efficiencyPct).toFixed(1)}%`;
  } else if (panel.ratedEfficiency !== undefined && panel.ratedEfficiency !== null) {
    efficiencyDisplay = `${Number(panel.ratedEfficiency).toFixed(1)}%`;
  }

  return {
    irradianceDisplay: (irradiance !== null && !isNaN(irradiance)) ? `${irradiance} W/m²` : 'N/A',
    tempDisplay: (tempC !== null && !isNaN(tempC)) ? `${tempC}°C` : 'N/A',
    voltageDisplay: (voltageV !== null && !isNaN(voltageV)) ? `${voltageV} V` : 'N/A',
    currentDisplay: (currentA !== null && !isNaN(currentA)) ? `${currentA} A` : 'N/A',
    areaDisplay: (area !== null && !isNaN(area)) ? `${area} m²` : 'N/A',
    powerDisplay,
    solarInputDisplay,
    efficiencyDisplay
  };
};

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
    panelName: '',
    manufacturer: '',
    modelNumber: '',
    serialNumber: '',
    type: '',
    customType: '',
    ratedPowerW: '',
    panelArea: '',
    ratedVoltageV: '',
    ratedCurrentA: '',
    ratedEfficiency: '',
    location: '',
    installationDate: '',
    tiltAngleDeg: '',
    direction: '',
    status: 'Active'
  });

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
    const nextNum = panels.reduce((max, p) => {
      const num = parseInt((p.panelId || '').replace(/\D/g, ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 100) + 1;
    const autoId = `SP-${nextNum}`;

    setEditingPanel(null);
    setFormData({
      panelId: autoId,
      panelName: '',
      manufacturer: '',
      modelNumber: '',
      serialNumber: '',
      type: '',
      customType: '',
      ratedPowerW: '',
      panelArea: '',
      ratedVoltageV: '',
      ratedCurrentA: '',
      ratedEfficiency: '',
      location: '',
      installationDate: '',
      tiltAngleDeg: '',
      direction: '',
      status: 'Active'
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (panel) => {
    setEditingPanel(panel);
    const knownTypes = ['Monocrystalline', 'Polycrystalline', 'Thin-film'];
    const pType = panel.type || '';
    const isOther = pType && !knownTypes.includes(pType);

    const dirVal = panel.direction || getDirectionFromAzimuth(panel.azimuthDeg);

    setFormData({
      panelId: panel.panelId || '',
      panelName: panel.panelName || panel.name || panel.panelId || '',
      manufacturer: panel.manufacturer || '',
      modelNumber: panel.modelNumber || panel.model || '',
      serialNumber: panel.serialNumber || '',
      type: isOther ? 'Other' : (knownTypes.includes(pType) ? pType : ''),
      customType: isOther ? pType : '',
      ratedPowerW: (panel.ratedPowerW !== undefined && panel.ratedPowerW !== null && panel.ratedPowerW !== '')
        ? String(panel.ratedPowerW)
        : (panel.ratedCapacityKW ? String(panel.ratedCapacityKW * 1000) : ''),
      panelArea: (panel.panelAreaM2 !== undefined && panel.panelAreaM2 !== null && panel.panelAreaM2 !== '')
        ? String(panel.panelAreaM2)
        : ((panel.panelArea !== undefined && panel.panelArea !== null && panel.panelArea !== '')
          ? String(panel.panelArea)
          : (panel.area !== undefined && panel.area !== null ? String(panel.area) : '')),
      ratedVoltageV: (panel.ratedVoltageV !== undefined && panel.ratedVoltageV !== null && panel.ratedVoltageV !== '')
        ? String(panel.ratedVoltageV)
        : (panel.voltageV !== undefined && panel.voltageV !== null ? String(panel.voltageV) : ''),
      ratedCurrentA: (panel.ratedCurrentA !== undefined && panel.ratedCurrentA !== null && panel.ratedCurrentA !== '')
        ? String(panel.ratedCurrentA)
        : (panel.currentA !== undefined && panel.currentA !== null ? String(panel.currentA) : ''),
      ratedEfficiency: (panel.ratedEfficiency !== undefined && panel.ratedEfficiency !== null && panel.ratedEfficiency !== '')
        ? String(panel.ratedEfficiency)
        : (panel.efficiency !== undefined && panel.efficiency !== null ? String(panel.efficiency) : ''),
      location: panel.location || '',
      installationDate: panel.installationDate ? String(panel.installationDate).split('T')[0] : '',
      tiltAngleDeg: (panel.tiltAngleDeg !== undefined && panel.tiltAngleDeg !== null && panel.tiltAngleDeg !== '')
        ? String(panel.tiltAngleDeg)
        : '',
      direction: dirVal,
      status: panel.status || 'Active'
    });
    setModalOpen(true);
  };

  const handleSubmitModal = async (e) => {
    e.preventDefault();

    // 1. Validation check for all required fields
    const isFormValid =
      !isBlank(formData.panelId) &&
      !isBlank(formData.panelName) &&
      !isBlank(formData.manufacturer) &&
      !isBlank(formData.modelNumber) &&
      !isBlank(formData.serialNumber) &&
      !isBlank(formData.type) &&
      (formData.type !== 'Other' || !isBlank(formData.customType)) &&
      isValidNumber(formData.ratedPowerW) &&
      isValidNumber(formData.panelArea) &&
      isValidNumber(formData.ratedVoltageV) &&
      isValidNumber(formData.ratedCurrentA) &&
      isValidNumber(formData.ratedEfficiency) &&
      !isBlank(formData.location) &&
      !isBlank(formData.installationDate) &&
      isValidNumber(formData.tiltAngleDeg) &&
      !isBlank(formData.direction);

    if (!isFormValid) {
      setToast({
        message: 'Please fill in all required panel information.',
        type: 'error'
      });
      return;
    }

    const selectedType = formData.type === 'Other' ? formData.customType.trim() : formData.type.trim();
    const azimuth = DIRECTION_AZIMUTH_MAP[formData.direction] ?? 180;
    const powerW = Number(formData.ratedPowerW);
    const capacityKW = Number((powerW / 1000).toFixed(3));
    const areaM2 = Number(formData.panelArea);

    const payload = {
      panelId: formData.panelId.trim(),
      panelName: formData.panelName.trim(),
      manufacturer: formData.manufacturer.trim(),
      modelNumber: formData.modelNumber.trim(),
      serialNumber: formData.serialNumber.trim(),
      type: selectedType,
      ratedPowerW: powerW,
      panelAreaM2: areaM2,
      panelArea: areaM2,
      area: areaM2,
      ratedVoltageV: Number(formData.ratedVoltageV),
      ratedCurrentA: Number(formData.ratedCurrentA),
      ratedEfficiency: Number(formData.ratedEfficiency),
      location: formData.location.trim(),
      installationDate: formData.installationDate,
      tiltAngleDeg: Number(formData.tiltAngleDeg),
      direction: formData.direction,
      azimuthDeg: azimuth,
      status: formData.status || 'Active',
      // Compatibility fields for existing backend handlers & database schema:
      model: formData.modelNumber.trim(),
      ratedCapacityKW: capacityKW,
      voltageV: Number(formData.ratedVoltageV),
      currentA: Number(formData.ratedCurrentA),
      efficiency: Number(formData.ratedEfficiency)
    };

    try {
      if (editingPanel) {
        await updatePanelApi(
          editingPanel._id || editingPanel.panelId,
          payload
        );

        setToast({
          message: `Panel ${formData.panelId} updated successfully.`,
          type: 'success'
        });
      } else {
        await createPanelApi(payload);

        setToast({
          message: `New panel ${formData.panelId} registered.`,
          type: 'success'
        });
      }

      setModalOpen(false);
      loadPanels();

    } catch (err) {
      console.error('Save panel error:', err);

      setToast({
        message:
          err.response?.data?.error || err.response?.data?.message || 'Failed to save panel.',
        type: 'error'
      });
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
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || (
      (p.panelId && p.panelId.toLowerCase().includes(searchLower)) ||
      (p.panelName && p.panelName.toLowerCase().includes(searchLower)) ||
      (p.model && p.model.toLowerCase().includes(searchLower)) ||
      (p.modelNumber && p.modelNumber.toLowerCase().includes(searchLower)) ||
      (p.manufacturer && p.manufacturer.toLowerCase().includes(searchLower)) ||
      (p.location && p.location.toLowerCase().includes(searchLower)) ||
      (p.serialNumber && p.serialNumber.toLowerCase().includes(searchLower))
    );
    const matchesLoc = locationFilter === 'All' || (p.location && p.location.toLowerCase().includes(locationFilter.toLowerCase()));
    return matchesSearch && matchesLoc;
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
                placeholder="Search panel ID, model, name..."
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
            {filteredPanels.map((panel) => {
              const metrics = getPanelMetrics(panel);
              const pName = panel.panelName || panel.name || panel.panelId;
              const pModel = panel.modelNumber || panel.model || 'Standard Module';
              const pMfr = panel.manufacturer;
              const pType = panel.type || 'N/A';
              const pDir = panel.direction || getDirectionFromAzimuth(panel.azimuthDeg);
              const pRatedPwr = panel.ratedPowerW ? `${panel.ratedPowerW} W` : (panel.ratedCapacityKW ? `${panel.ratedCapacityKW * 1000} W` : 'N/A');

              return (
                <div key={panel.panelId} className="saas-card p-4 flex flex-col justify-between space-y-4">

                  {/* Top Info */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primaryText dark:text-white">{panel.panelId}</span>
                        {getStatusChip(panel.status)}
                      </div>
                      <p className="text-xs font-medium text-primaryText dark:text-slate-200 mt-0.5 truncate">{pName}</p>
                      <p className="text-[11px] text-secondaryText truncate">
                        {pMfr ? `${pMfr} - ${pModel}` : pModel}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
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

                  {/* Core Telemetry Display */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-warmBg dark:bg-[#202020] border border-borderNeutral dark:border-[#262626]">
                    <div>
                      <span className="text-[10px] font-semibold text-secondaryText block">Output Power</span>
                      <span className="text-xs font-bold text-primaryText dark:text-white">{metrics.powerDisplay}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-secondaryText block">Calculated Efficiency</span>
                      <span className="text-xs font-bold text-forest-500">{metrics.efficiencyDisplay}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-secondaryText block">Irradiance</span>
                      <span className="text-xs font-medium text-primaryText dark:text-slate-200">{metrics.irradianceDisplay}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-secondaryText block">Temperature</span>
                      <span className="text-xs font-medium text-primaryText dark:text-slate-200">{metrics.tempDisplay}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-secondaryText block">Voltage</span>
                      <span className="text-xs font-medium text-primaryText dark:text-slate-200">{metrics.voltageDisplay}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-secondaryText block">Current</span>
                      <span className="text-xs font-medium text-primaryText dark:text-slate-200">{metrics.currentDisplay}</span>
                    </div>
                  </div>

                  {/* Panel Specification & Installation Details */}
                  <div className="space-y-1 text-[11px] text-secondaryText pt-1 border-t border-borderNeutral dark:border-[#262626]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{panel.location || 'N/A'}</span>
                      </span>
                      <span className="shrink-0">{pType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Rated: {pRatedPwr} ({metrics.areaDisplay})</span>
                      <span>Tilt: {panel.tiltAngleDeg !== undefined ? `${panel.tiltAngleDeg}°` : 'N/A'} | {pDir}</span>
                    </div>
                    {panel.serialNumber && (
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>S/N: {panel.serialNumber}</span>
                        {panel.installationDate && <span>Installed: {String(panel.installationDate).split('T')[0]}</span>}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="saas-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#1A1A1A] border-b border-borderNeutral dark:border-[#262626] text-secondaryText font-semibold sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Panel ID & Name</th>
                    <th className="py-3 px-4">Manufacturer / Model / S/N</th>
                    <th className="py-3 px-4">Type & Location</th>
                    <th className="py-3 px-4">Rated Pwr & Area</th>
                    <th className="py-3 px-4">Irradiance</th>
                    <th className="py-3 px-4">Voltage / Current</th>
                    <th className="py-3 px-4">Temp</th>
                    <th className="py-3 px-4">Output Power</th>
                    <th className="py-3 px-4">Calculated Eff.</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderNeutral dark:divide-[#262626]">
                  {filteredPanels.map((panel) => {
                    const metrics = getPanelMetrics(panel);
                    const pName = panel.panelName || panel.name || panel.panelId;
                    const pModel = panel.modelNumber || panel.model || 'Standard';
                    const pMfr = panel.manufacturer || '';
                    const pType = panel.type || 'N/A';
                    const pRatedPwr = panel.ratedPowerW ? `${panel.ratedPowerW} W` : (panel.ratedCapacityKW ? `${panel.ratedCapacityKW * 1000} W` : 'N/A');

                    return (
                      <tr key={panel.panelId} className="hover:bg-slate-50/60 dark:hover:bg-[#222] transition-colors">
                        <td className="py-3 px-4 font-bold text-primaryText dark:text-white">
                          <div>{panel.panelId}</div>
                          <div className="text-[10px] font-normal text-secondaryText">{pName}</div>
                        </td>
                        <td className="py-3 px-4 text-secondaryText">
                          <div className="font-medium text-primaryText dark:text-slate-200">
                            {pMfr ? `${pMfr} ${pModel}` : pModel}
                          </div>
                          {panel.serialNumber && <div className="text-[10px] text-secondaryText">SN: {panel.serialNumber}</div>}
                        </td>
                        <td className="py-3 px-4 text-secondaryText">
                          <div>{panel.location}</div>
                          <div className="text-[10px] text-secondaryText">{pType}</div>
                        </td>
                        <td className="py-3 px-4 text-secondaryText">
                          <div>{pRatedPwr}</div>
                          <div className="text-[10px] text-secondaryText">{metrics.areaDisplay}</div>
                        </td>
                        <td className="py-3 px-4 text-secondaryText">{metrics.irradianceDisplay}</td>
                        <td className="py-3 px-4 text-secondaryText">{metrics.voltageDisplay} / {metrics.currentDisplay}</td>
                        <td className="py-3 px-4 text-secondaryText">{metrics.tempDisplay}</td>
                        <td className="py-3 px-4 font-semibold text-primaryText dark:text-white">{metrics.powerDisplay}</td>
                        <td className="py-3 px-4 font-bold text-forest-500">{metrics.efficiencyDisplay}</td>
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
                    );
                  })}
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
          
          {/* Header Section: Panel ID & Operational Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-borderNeutral dark:border-[#262626]">
            <div>
              <label className="block font-semibold text-secondaryText mb-1">Panel Identifier (Auto-generated)</label>
              <input
                type="text"
                disabled
                readOnly
                value={formData.panelId}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#1A1A1A] border border-borderNeutral dark:border-[#333] text-secondaryText dark:text-neutral-400 cursor-not-allowed font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-secondaryText mb-1">Operational Status <span className="text-rose-500">*</span></label>
              <select
                required
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

          {/* Module Identification */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-primaryText dark:text-white uppercase tracking-wider">Module Identification</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-secondaryText mb-1">Panel Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rooftop Bay 1 Module"
                  value={formData.panelName}
                  onChange={(e) => setFormData({ ...formData, panelName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-secondaryText mb-1">Manufacturer <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SunPower, Canadian Solar"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-secondaryText mb-1">Model Number <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maxeon 6 400W"
                  value={formData.modelNumber}
                  onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-secondaryText mb-1">Serial Number <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SN-2026-8841"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-secondaryText mb-1">Panel Type <span className="text-rose-500">*</span></label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, customType: e.target.value === 'Other' ? formData.customType : '' })}
                className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="">-- Select Panel Type --</option>
                <option value="Monocrystalline">Monocrystalline</option>
                <option value="Polycrystalline">Polycrystalline</option>
                <option value="Thin-film">Thin-film</option>
                <option value="Other">Other</option>
              </select>

              {formData.type === 'Other' && (
                <div className="mt-2">
                  <label className="block font-semibold text-secondaryText mb-1">Custom Panel Type <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Enter custom panel technology / type"
                    value={formData.customType}
                    onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Electrical & Rating Specifications */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-primaryText dark:text-white uppercase tracking-wider">Rated Specifications</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-secondaryText mb-1">Rated Power (W) <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 400"
                  value={formData.ratedPowerW}
                  onChange={(e) => setFormData({ ...formData, ratedPowerW: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-secondaryText mb-1">Panel Area (m²) <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 2.0"
                  value={formData.panelArea}
                  onChange={(e) => setFormData({ ...formData, panelArea: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-secondaryText mb-1">Rated Voltage (V) <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 48.2"
                  value={formData.ratedVoltageV}
                  onChange={(e) => setFormData({ ...formData, ratedVoltageV: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-secondaryText mb-1">Rated Current (A) <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 8.3"
                  value={formData.ratedCurrentA}
                  onChange={(e) => setFormData({ ...formData, ratedCurrentA: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>

              <div className="col-span-2 sm:col-span-2">
                <label className="block font-semibold text-secondaryText mb-1">Rated Efficiency (%) <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 22.5"
                  value={formData.ratedEfficiency}
                  onChange={(e) => setFormData({ ...formData, ratedEfficiency: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>
            </div>
          </div>

          {/* Installation & Physical Positioning */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-primaryText dark:text-white uppercase tracking-wider">Installation & Positioning</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-secondaryText mb-1">Installation Location <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rooftop Field Annex"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-secondaryText mb-1">Installation Date <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  required
                  value={formData.installationDate}
                  onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-secondaryText mb-1">Tilt Angle (°) <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 28"
                  value={formData.tiltAngleDeg}
                  onChange={(e) => setFormData({ ...formData, tiltAngleDeg: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-secondaryText mb-1">Direction <span className="text-rose-500">*</span></label>
                <select
                  required
                  value={formData.direction}
                  onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
                >
                  <option value="">-- Select Direction --</option>
                  <option value="North">North (0°)</option>
                  <option value="Northeast">Northeast (45°)</option>
                  <option value="East">East (90°)</option>
                  <option value="Southeast">Southeast (135°)</option>
                  <option value="South">South (180°)</option>
                  <option value="Southwest">Southwest (225°)</option>
                  <option value="West">West (270°)</option>
                  <option value="Northwest">Northwest (315°)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
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
