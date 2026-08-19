import React, { useState } from 'react';
import { CloudRain, AlertTriangle, Zap, CheckCircle2, Thermometer, Eye } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

import { sounds } from '../../lib/soundEffects';

interface ZoneRisk {
  id: string;
  name: string;
  category: string;
  itemsAtRiskCount: number;
  atRiskValuePkr: number;
  riskLevel: 'Low' | 'Medium' | 'Critical';
  riskPercent: number;
  temperatureC: number;
  recommendation: string;
}

export const DigitalTwinCockpit: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string>('bakery');
  const [isPreemptiveDeployed, setIsPreemptiveDeployed] = useState<boolean>(false);

  const zones: ZoneRisk[] = [
    {
      id: 'bakery',
      name: 'Aisle 1: Bakery & Artisanal Breads',
      category: 'Bakery',
      itemsAtRiskCount: 42,
      atRiskValuePkr: 18900,
      riskLevel: 'Critical',
      riskPercent: 88,
      temperatureC: 24.2,
      recommendation: 'Preemptive 65% discount trigger at 3:00 PM before evening footfall drop.',
    },
    {
      id: 'produce',
      name: 'Aisle 2: Fresh Organic Produce & Mangoes',
      category: 'Produce',
      itemsAtRiskCount: 65,
      atRiskValuePkr: 24500,
      riskLevel: 'Critical',
      riskPercent: 82,
      temperatureC: 18.5,
      recommendation: 'Bundle into Surplus Mystery Bags (Gold Tier) at ₨ 599.',
    },
    {
      id: 'dairy',
      name: 'Aisle 3: Dairy, Cheeses & Yogurts',
      category: 'Dairy',
      itemsAtRiskCount: 18,
      atRiskValuePkr: 9800,
      riskLevel: 'Medium',
      riskPercent: 52,
      temperatureC: 4.1,
      recommendation: 'Step-decay to 40% OFF at 6:00 PM.',
    },
    {
      id: 'deli',
      name: 'Aisle 4: Hot Deli, BBQ & Prepared Meals',
      category: 'Restaurant',
      itemsAtRiskCount: 14,
      atRiskValuePkr: 12400,
      riskLevel: 'Medium',
      riskPercent: 44,
      temperatureC: 65.0,
      recommendation: 'Flash 50% discount for dinner commute window (7:00 PM - 9:00 PM).',
    },
  ];

  const activeZone = zones.find((z) => z.id === selectedZone) || zones[0];
  const totalAtRiskPkr = zones.reduce((sum, z) => sum + z.atRiskValuePkr, 0);

  const handleDeployPreemptive = () => {
    setIsPreemptiveDeployed(true);
    sounds.playLaserBeep();
    sounds.playSuccessFanfare();
  };

  return (
    <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-teal-500/40 bg-gradient-to-br from-emerald-950/90 via-teal-950/70 to-slate-950 flex flex-col gap-6 shadow-2xl animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-white">Predictive AI Digital Twin &amp; Spoilage Forecaster</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1">
              <Eye className="size-3 text-teal-400" />
              24h Advance Prediction
            </span>
          </div>
          <p className="text-xs text-emerald-300/70 mt-1">
            Simulates supermarket floor inventory dynamics using local weather forecasts and historical footfall models.
          </p>
        </div>

        {/* Weather Intelligence Feed */}
        <div className="p-3 rounded-2xl bg-slate-950/90 border border-amber-500/40 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
            <CloudRain className="size-5 text-amber-400 animate-bounce" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-amber-300 block">Monsoon Rain Forecast Tomorrow</span>
            <span className="text-[11px] text-emerald-300/80">Lahore: -40% foot traffic predicted after 2:00 PM</span>
          </div>
        </div>
      </div>

      {/* Store Aisle Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            onClick={() => {
              setSelectedZone(zone.id);
              sounds.playAlertPing();
            }}
            className={`p-4 rounded-2xl cursor-pointer transition-all border ${
              selectedZone === zone.id
                ? 'bg-emerald-900/90 border-amber-400 shadow-lg scale-102'
                : 'bg-emerald-950/40 border-emerald-800/80 hover:bg-emerald-900/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                zone.riskLevel === 'Critical'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {zone.riskLevel} Risk ({zone.riskPercent}%)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                <Thermometer className="size-3" />
                {zone.temperatureC}°C
              </span>
            </div>

            <h4 className="text-xs font-bold text-white mb-1">{zone.name.split(':')[0]}</h4>
            <p className="text-[11px] text-emerald-300/70 mb-2">{zone.name.split(':')[1]}</p>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-emerald-800/60 font-mono">
              <span className="text-emerald-400/80">{zone.itemsAtRiskCount} items</span>
              <span className="font-bold text-amber-300">{formatCurrency(zone.atRiskValuePkr)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Zone Deep Dive & Preemptive Action Cockpit */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-emerald-700/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="size-4 text-amber-400" />
            <h4 className="text-sm font-black text-white">{activeZone.name}</h4>
          </div>
          <p className="text-xs text-emerald-200/80 leading-relaxed mb-3">
            AI Recommendation: <strong className="text-amber-300">{activeZone.recommendation}</strong>
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-emerald-400">Total Store Spoilage Exposure: <strong>{formatCurrency(totalAtRiskPkr)}</strong></span>
            <span className="text-teal-300">Protected Revenue: <strong>{formatCurrency(Math.round(totalAtRiskPkr * 0.72))}</strong></span>
          </div>
        </div>

        <div>
          {isPreemptiveDeployed ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="size-5" />
              <span>Preemptive Schedules Active in POS!</span>
            </div>
          ) : (
            <button
              onClick={handleDeployPreemptive}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-xl flex items-center gap-2 transition-transform active:scale-95"
            >
              <Zap className="size-4" />
              <span>Deploy Preemptive AI Schedules</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
