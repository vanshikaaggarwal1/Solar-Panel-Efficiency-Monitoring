import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchAlertsApi } from '../services/api';
import { useAuth } from './AuthContext';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [activeCount, setActiveCount] = useState(0);

  const refreshAlerts = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await fetchAlertsApi();
      if (res.data && res.data.success) {
        const fetchedAlerts = res.data.data || [];
        setAlerts(fetchedAlerts);
        const count = fetchedAlerts.filter(a => a.status === 'Active' || a.status === 'Critical').length;
        setActiveCount(count);
      }
    } catch (err) {
      console.error('Failed to fetch shared alert badge count:', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshAlerts();
      const interval = setInterval(refreshAlerts, 30000);
      return () => clearInterval(interval);
    } else {
      setAlerts([]);
      setActiveCount(0);
    }
  }, [isAuthenticated, refreshAlerts]);

  return (
    <AlertContext.Provider value={{ alerts, activeCount, refreshAlerts }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);
