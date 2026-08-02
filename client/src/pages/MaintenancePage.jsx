import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import { fetchMaintenanceApi, createMaintenanceApi, updateMaintenanceApi, deleteMaintenanceApi } from '../services/api';
import {
  Wrench,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  UserCheck,
  Calendar,
  AlertCircle,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

const MaintenancePage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [formData, setFormData] = useState({
    panelId: 'SP-103',
    issue: 'Thermal Hotspot & Bypass Diode Inspection',
    assignedEngineer: 'Elena Rostova',
    status: 'Scheduled',
    scheduledDate: new Date().toISOString().split('T')[0],
    priority: 'High',
    notes: 'Perform thermal imaging and clean glass surface.'
  });

  const loadMaintenance = async () => {
    setLoading(true);
    try {
      const res = await fetchMaintenanceApi();
      if (res.data.success) {
        setTickets(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load maintenance records:', err);
      setToast({ message: 'Error loading maintenance tickets.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaintenance();
  }, []);

  const handleOpenAddModal = () => {
    setEditingTicket(null);
    setFormData({
      panelId: 'SP-103',
      issue: 'Routine Photovoltaic Calibration',
      assignedEngineer: 'Elena Rostova',
      status: 'Scheduled',
      scheduledDate: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      notes: ''
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (ticket) => {
    setEditingTicket(ticket);
    setFormData({
      panelId: ticket.panelId,
      issue: ticket.issue,
      assignedEngineer: ticket.assignedEngineer,
      status: ticket.status,
      scheduledDate: ticket.scheduledDate,
      priority: ticket.priority || 'Medium',
      notes: ticket.notes || ''
    });
    setModalOpen(true);
  };

  const handleSaveTicket = async (e) => {
    e.preventDefault();
    try {
      if (editingTicket) {
        await updateMaintenanceApi(editingTicket._id, formData);
        setToast({ message: 'Maintenance ticket updated.', type: 'success' });
      } else {
        await createMaintenanceApi(formData);
        setToast({ message: 'New maintenance ticket created!', type: 'success' });
      }
      setModalOpen(false);
      loadMaintenance();
    } catch (err) {
      setToast({ message: 'Failed to save maintenance record.', type: 'error' });
    }
  };

  const handleDeleteTicket = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await deleteMaintenanceApi(id);
        setToast({ message: 'Maintenance ticket deleted.', type: 'info' });
        loadMaintenance();
      } catch (err) {
        setToast({ message: 'Failed to delete record.', type: 'error' });
      }
    }
  };

  const handleQuickStatusChange = async (id, status) => {
    try {
      await updateMaintenanceApi(id, { status });
      setToast({ message: `Status updated to ${status}`, type: 'success' });
      loadMaintenance();
    } catch (err) {
      setToast({ message: 'Status update failed.', type: 'error' });
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-skyAccent-400/15 text-skyAccent-400 border border-skyAccent-400/30 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> In Progress
          </span>
        );
      case 'Scheduled':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Scheduled
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-lightBg dark:bg-navy-950 transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10">
          <div>
            <span className="text-xs font-bold text-solar-500 uppercase tracking-wider">Field Operations</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
              Solar Panel Maintenance Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Dispatch field engineers, track component repairs, and resolve technical issues
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-solar-500 to-solar-600 hover:from-solar-600 hover:to-solar-700 text-white font-bold text-xs shadow-lg shadow-solar-500/25 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Add Maintenance Ticket
          </button>
        </div>

        {/* Maintenance Table */}
        <div className="glass-panel rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-solar-500" /> Active Maintenance Schedule
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Total Records: {tickets.length}
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading maintenance schedule...</div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No maintenance tickets found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 dark:bg-navy-900/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-white/10">
                  <tr>
                    <th className="px-6 py-4">Ticket ID & Panel</th>
                    <th className="px-6 py-4">Issue Description</th>
                    <th className="px-6 py-4">Assigned Engineer</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Scheduled Date</th>
                    <th className="px-6 py-4">Completed Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {tickets.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      
                      {/* Ticket ID & Panel */}
                      <td className="px-6 py-4 font-bold text-navy-900 dark:text-white">
                        <span className="text-solar-500 block">{t._id}</span>
                        <span className="text-[11px] text-slate-500 font-medium">Panel: {t.panelId}</span>
                      </td>

                      {/* Issue */}
                      <td className="px-6 py-4 max-w-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 block">{t.issue}</span>
                        {t.notes && <span className="text-[11px] text-slate-400 block truncate">{t.notes}</span>}
                      </td>

                      {/* Engineer */}
                      <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-skyAccent-400" />
                          <span>{t.assignedEngineer}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {statusBadge(t.status)}
                      </td>

                      {/* Scheduled Date */}
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                        {t.scheduledDate}
                      </td>

                      {/* Completed Date */}
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                        {t.completedDate || <span className="text-slate-400 italic">Pending</span>}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={t.status}
                            onChange={(e) => handleQuickStatusChange(t._id, e.target.value)}
                            className="px-2 py-1 rounded bg-slate-100 dark:bg-navy-900 text-[11px] border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200"
                          >
                            <option value="Scheduled">Scheduled</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>

                          <button
                            onClick={() => handleOpenEditModal(t)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-solar-500 hover:bg-solar-500/10"
                            title="Edit Record"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteTicket(t._id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Add / Edit Maintenance Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTicket ? `Edit Maintenance Ticket ${editingTicket._id}` : 'Create Maintenance Ticket'}
      >
        <form onSubmit={handleSaveTicket} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Panel ID</label>
              <input
                type="text"
                value={formData.panelId}
                onChange={(e) => setFormData({ ...formData, panelId: e.target.value })}
                placeholder="SP-103"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Assigned Engineer</label>
              <input
                type="text"
                value={formData.assignedEngineer}
                onChange={(e) => setFormData({ ...formData, assignedEngineer: e.target.value })}
                placeholder="Elena Rostova"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Technical Issue Description</label>
            <input
              type="text"
              value={formData.issue}
              onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
              placeholder="Thermal hotspot inspection & inverter relay test"
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Scheduled Date</label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Engineering Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes on replacement parts, voltage test results..."
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white"
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
              className="px-5 py-2 text-xs font-bold rounded-xl bg-solar-500 text-white hover:bg-solar-600 shadow-md shadow-solar-500/20"
            >
              Save Ticket
            </button>
          </div>
        </form>
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default MaintenancePage;
