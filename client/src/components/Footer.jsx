import React from 'react';
import { Zap, ShieldCheck, Heart, Globe, Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-panel border-t border-slate-200 dark:border-white/10 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-solar-500" />
              <span className="font-bold text-lg text-slate-900 dark:text-white">SOLARIX</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Industrial IoT Telemetry & Solar Panel Efficiency Monitoring System. Maximizing clean energy output with AI analytics.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>Real-time Telemetry Analytics</li>
              <li>Photovoltaic Degradation Tracking</li>
              <li>Automated Thermal Fault Detection</li>
              <li>Maintenance Workflow Dispatch</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Environmental Impact
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-solar-500" /> 5.9 Metric Tons CO₂ Offset
              </li>
              <li className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-skyAccent-400" /> 22.8% Average Fleet Efficiency
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Zero Thermal Runaway Incidents
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              System Health
            </h4>
            <div className="p-3 rounded-xl bg-solar-500/10 border border-solar-500/20 text-xs space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700 dark:text-slate-300">Gateway Status:</span>
                <span className="text-solar-600 dark:text-solar-400 font-bold">ONLINE</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Latency: 14ms</span>
                <span>Uptime: 99.98%</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-200 dark:border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Solarix Efficiency Monitoring System. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Powered by <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> Renewable Solar Energy
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
