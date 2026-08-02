import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: {
      bg: 'bg-white dark:bg-[#1C1C1C] border-forest-500/40 text-primaryText dark:text-white',
      icon: CheckCircle2,
      iconColor: 'text-forest-500'
    },
    error: {
      bg: 'bg-white dark:bg-[#1C1C1C] border-rose-500/40 text-primaryText dark:text-white',
      icon: AlertCircle,
      iconColor: 'text-rose-600'
    },
    info: {
      bg: 'bg-white dark:bg-[#1C1C1C] border-borderNeutral dark:border-[#333] text-primaryText dark:text-white',
      icon: Info,
      iconColor: 'text-copper-500'
    }
  };

  const Config = typeConfig[type] || typeConfig.info;
  const Icon = Config.icon;

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border ${Config.bg} shadow-dropdown text-xs font-semibold`}>
      <Icon className={`w-4 h-4 flex-shrink-0 ${Config.iconColor}`} />
      <span>{message}</span>
      <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-[#222] ml-2 text-secondaryText">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default Toast;
