import React from 'react';
import { Sun, ShieldCheck, Globe, Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#F2F0E9] dark:bg-[#132F29] border-t border-borderNeutral dark:border-[#1E5B4C]/40 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-forest-500 text-white flex items-center justify-center font-bold text-xs">
                <Sun className="w-3.5 h-3.5 text-sand-400" />
              </div>
              <span className="font-bold text-base tracking-tight text-primaryText dark:text-white">SOLARIX</span>
            </div>
            <p className="text-xs text-secondaryText leading-relaxed">
              Industrial IoT Solar Performance & Telemetry Monitoring System. Enterprise SaaS platform for renewable energy companies.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-primaryText dark:text-white mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-secondaryText">
              <li>Real-Time Sensor Telemetry</li>
              <li>Photovoltaic Degradation Analytics</li>
              <li>Automated Thermal Anomaly Center</li>
              <li>Field Maintenance Dispatch</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-primaryText dark:text-white mb-3">
              Environmental Impact
            </h4>
            <ul className="space-y-2 text-xs text-secondaryText">
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-forest-500" /> 14.2 Metric Tons CO₂ Offset
              </li>
              <li className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-olive-500" /> 21.8% Average Fleet Efficiency
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-500" /> IEC 61724 Standard Compliant
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-primaryText dark:text-white mb-3">
              Substation Telemetry
            </h4>
            <div className="p-3 rounded-xl bg-warmBg dark:bg-[#101815] border border-borderNeutral dark:border-[#1E5B4C]/40 text-xs space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-secondaryText">Gateway Status:</span>
                <span className="text-forest-500 font-bold">ONLINE</span>
              </div>
              <div className="flex justify-between text-[11px] text-secondaryText">
                <span>Latency: 14ms</span>
                <span>Uptime: 99.98%</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-borderNeutral dark:border-[#1E5B4C]/40 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-secondaryText">
          <p>© {new Date().getFullYear()} Solarix Systems. Industrial Telemetry Platform.</p>
          <p className="mt-2 sm:mt-0 font-medium">Enterprise Photovoltaic Infrastructure</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
