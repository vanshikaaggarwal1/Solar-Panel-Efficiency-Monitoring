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
  Calendar as CalendarIcon,
  List as ListIcon,
  AlertCircle,
  ShieldCheck,
  User,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const MaintenancePage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [formData, setFormData] = useState({
    panelId: 'SP-103',
    issue: 'Bypass Diode Thermal Calibration',
    assignedEngineer: 'Dr. Marcus Vance',
    status: 'Scheduled',
    scheduledDate: new Date().toISOString().split('T')[0],
    priority: 'High',
    notes: 'Perform thermal camera inspection and clear anti-reflective glass accumulation.'
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
      issue: 'Bypass Diode Thermal Calibration',
      assignedEngineer: 'Dr. Marcus Vance',
      status: 'Scheduled',
      scheduledDate: new Date().toISOString().split('T')[0],
      priority: 'High',
      notes: 'Perform thermal camera inspection and clear anti-reflective glass accumulation.'
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
      scheduledDate: ticket.scheduledDate ? ticket.scheduledDate.split('T')[0] : new Date().toISOString().split('T')[0],
      priority: ticket.priority || 'Medium',
      notes: ticket.notes || ''
    });
    setModalOpen(true);
  };

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    try {
      if (editingTicket) {
        await updateMaintenanceApi(editingTicket._id || editingTicket.id, formData);
        setToast({ message: 'Work order updated successfully.', type: 'success' });
      } else {
        await createMaintenanceApi(formData);
        setToast({ message: 'New maintenance task scheduled.', type: 'success' });
      }
      setModalOpen(false);
      loadMaintenance();
    } catch (err) {
      setToast({ message: 'Failed to save maintenance ticket.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this work order?')) return;
    try {
      await deleteMaintenanceApi(id);
      setToast({ message: 'Work order cancelled.', type: 'success' });
      loadMaintenance();
    } catch (err) {
      setToast({ message: 'Failed to delete ticket.', type: 'error' });
    }
  };

  const scheduledCount = tickets.filter((t) => t.status === 'Scheduled').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const completedCount = tickets.filter((t) => t.status === 'Completed').length;

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
      case 'Urgent':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            High Priority
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-copper-500/10 text-copper-600 border border-copper-500/20">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-forest-500/10 text-forest-500 border border-forest-500/20">
            Normal
          </span>
        );
    }
  };

  // Simple Month Calendar Grid Generator
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex min-h-screen bg-warmBg dark:bg-[#121212] text-primaryText dark:text-neutral-100 transition-colors">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-borderNeutral dark:border-[#262626]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primaryText dark:text-white">
              Preventative Maintenance & Field Work Orders
            </h1>
            <p className="text-xs text-secondaryText mt-0.5">
              Schedule array wash cycles, inverter servicing, and field engineer work orders
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-white dark:bg-[#1A1A1A] border border-borderNeutral dark:border-[#262626] rounded-xl">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-forest-500 text-white'
                    : 'text-secondaryText hover:text-primaryText'
                }`}
              >
                <ListIcon className="w-3.5 h-3.5" />
                <span>Work Orders</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-forest-500 text-white'
                    : 'text-secondaryText hover:text-primaryText'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Calendar View</span>
              </button>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-xs transition-colors shadow-subtle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Task</span>
            </button>
          </div>
        </div>

        {/* Metrics Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="saas-card p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-secondaryText block">Scheduled Tasks</span>
              <span className="text-2xl font-bold text-copper-600">{scheduledCount}</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-copper-500/10 flex items-center justify-center text-copper-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="saas-card p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-secondaryText block">In Progress</span>
              <span className="text-2xl font-bold text-amber-600">{inProgressCount}</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Wrench className="w-4 h-4" />
            </div>
          </div>

          <div className="saas-card p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-secondaryText block">Completed (This Month)</span>
              <span className="text-2xl font-bold text-forest-500">{completedCount}</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-forest-500/10 flex items-center justify-center text-forest-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Main View Area */}
        {loading ? (
          <div className="py-12 text-center text-secondaryText text-xs font-semibold">
            Loading maintenance schedule...
          </div>
        ) : viewMode === 'calendar' ? (
          /* CALENDAR VIEW */
          <div className="saas-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-primaryText dark:text-white">
                August 2026 Scheduled Maintenance Grid
              </h3>
              <div className="flex items-center gap-2 text-xs text-secondaryText">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-forest-500"></span> Completed
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-copper-500"></span> Scheduled
                </span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="py-1.5 font-bold text-secondaryText uppercase tracking-wider text-[10px]">
                  {d}
                </div>
              ))}

              {calendarDays.map((day) => {
                const dayTickets = tickets.filter((t) => {
                  const dNum = t.scheduledDate ? new Date(t.scheduledDate).getDate() : 0;
                  return dNum === day;
                });

                return (
                  <div
                    key={day}
                    className="min-h-[72px] p-1.5 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border border-borderNeutral dark:border-[#262626] text-left flex flex-col justify-between"
                  >
                    <span className="text-[10px] font-bold text-secondaryText">{day}</span>
                    <div className="space-y-1">
                      {dayTickets.map((t) => (
                        <div
                          key={t._id || t.id}
                          className={`p-1 rounded text-[10px] truncate font-medium ${
                            t.status === 'Completed'
                              ? 'bg-forest-500/15 text-forest-500'
                              : 'bg-copper-500/15 text-copper-600'
                          }`}
                          title={`${t.panelId}: ${t.issue}`}
                        >
                          {t.panelId}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* WORK ORDERS LIST VIEW */
          <div className="saas-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#1A1A1A] border-b border-borderNeutral dark:border-[#262626] text-secondaryText font-semibold sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Work Order</th>
                    <th className="py-3 px-4">Panel ID</th>
                    <th className="py-3 px-4">Assigned Engineer</th>
                    <th className="py-3 px-4">Scheduled Date</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderNeutral dark:divide-[#262626]">
                  {tickets.length > 0 ? (
                    tickets.map((t) => (
                      <tr key={t._id || t.id} className="hover:bg-slate-50/60 dark:hover:bg-[#222] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-primaryText dark:text-white">{t.issue}</div>
                          {t.notes && <div className="text-[10px] text-secondaryText truncate max-w-xs">{t.notes}</div>}
                        </td>
                        <td className="py-3 px-4 font-semibold text-primaryText dark:text-slate-200">{t.panelId}</td>
                        <td className="py-3 px-4 text-secondaryText">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{t.assignedEngineer || 'Unassigned'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-secondaryText">
                          {t.scheduledDate ? new Date(t.scheduledDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4">{getPriorityBadge(t.priority)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            t.status === 'Completed'
                              ? 'bg-forest-500/10 text-forest-500'
                              : 'bg-copper-500/10 text-copper-600'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditModal(t)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-primaryText hover:bg-slate-100 dark:hover:bg-[#2A2A2A]"
                              title="Edit work order"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(t._id || t.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-500/10"
                              title="Cancel"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-secondaryText text-xs">
                        No maintenance work orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Work Order Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTicket ? 'Update Work Order' : 'Schedule Preventative Maintenance Task'}
      >
        <form onSubmit={handleSubmitModal} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-secondaryText mb-1">Target Panel ID</label>
              <input
                type="text"
                required
                value={formData.panelId}
                onChange={(e) => setFormData({ ...formData, panelId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-secondaryText mb-1">Scheduled Date</label>
              <input
                type="date"
                required
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-secondaryText mb-1">Task Title / Issue Summary</label>
            <input
              type="text"
              required
              value={formData.issue}
              onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-secondaryText mb-1">Assigned Technician</label>
              <input
                type="text"
                required
                value={formData.assignedEngineer}
                onChange={(e) => setFormData({ ...formData, assignedEngineer: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-secondaryText mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="Normal">Normal</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-secondaryText mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-secondaryText mb-1">Work Instructions & Safety Notes</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              {editingTicket ? 'Save Changes' : 'Schedule Work Order'}
            </button>
          </div>
        </form>
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};

export default MaintenancePage;
