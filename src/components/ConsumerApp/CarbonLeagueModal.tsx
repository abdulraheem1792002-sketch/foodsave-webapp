import React, { useState } from 'react';
import { X, Download, Building2, GraduationCap, Users } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

import { sounds } from '../../lib/soundEffects';

interface CarbonLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LeagueEntry {
  rank: number;
  name: string;
  category: 'university' | 'corporate';
  city: string;
  membersCount: number;
  rescuedKg: number;
  co2AvoidedKg: number;
  savedPkr: number;
  badge: string;
}

const UNIVERSITY_LEAGUE: LeagueEntry[] = [
  { rank: 1, name: 'LUMS (Lahore University of Management Sciences)', category: 'university', city: 'Lahore', membersCount: 1420, rescuedKg: 3840, co2AvoidedKg: 9600, savedPkr: 2840000, badge: '🥇 Gold Eco-Leader' },
  { rank: 2, name: 'NUST (National University of Sciences & Tech)', category: 'university', city: 'Islamabad', membersCount: 1290, rescuedKg: 3210, co2AvoidedKg: 8025, savedPkr: 2410000, badge: '🥈 Silver Warrior' },
  { rank: 3, name: 'IBA (Institute of Business Administration)', category: 'university', city: 'Karachi', membersCount: 980, rescuedKg: 2450, co2AvoidedKg: 6125, savedPkr: 1890000, badge: '🥉 Bronze Guardian' },
  { rank: 4, name: 'FAST-NUCES (Lahore / Islamabad / Karachi)', category: 'university', city: 'National', membersCount: 890, rescuedKg: 2100, co2AvoidedKg: 5250, savedPkr: 1650000, badge: '⭐ Green Tech Vanguard' },
  { rank: 5, name: 'GIKI (Ghulam Ishaq Khan Institute)', category: 'university', city: 'Topi', membersCount: 620, rescuedKg: 1580, co2AvoidedKg: 3950, savedPkr: 1180000, badge: '🌿 Eco Innovator' },
];

const CORPORATE_LEAGUE: LeagueEntry[] = [
  { rank: 1, name: 'Jazz (VEON Pakistan Telecom)', category: 'corporate', city: 'Islamabad', membersCount: 2850, rescuedKg: 8400, co2AvoidedKg: 21000, savedPkr: 6800000, badge: '🏆 Corporate ESG Champion' },
  { rank: 2, name: 'Systems Limited', category: 'corporate', city: 'Lahore', membersCount: 2100, rescuedKg: 6100, co2AvoidedKg: 15250, savedPkr: 4950000, badge: '⭐ Tech Zero-Waste Titan' },
  { rank: 3, name: 'HBL (Habib Bank Limited)', category: 'corporate', city: 'Karachi', membersCount: 1750, rescuedKg: 4900, co2AvoidedKg: 12250, savedPkr: 3980000, badge: '🌱 Sustainable Finance Award' },
  { rank: 4, name: 'Netsol Technologies', category: 'corporate', city: 'Lahore', membersCount: 1200, rescuedKg: 3400, co2AvoidedKg: 8500, savedPkr: 2750000, badge: '✨ Carbon Offset Hero' },
];

export const CarbonLeagueModal: React.FC<CarbonLeagueModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'university' | 'corporate'>('university');

  if (!isOpen) return null;

  const currentList = activeTab === 'university' ? UNIVERSITY_LEAGUE : CORPORATE_LEAGUE;

  const handleDownloadEsgReport = () => {
    sounds.playAlertPing();
    const content = `=====================================================
FLASHFRUIT PAKISTAN — NATIONAL ZERO-WASTE CARBON AUDIT
=====================================================
Category: ${activeTab.toUpperCase()} LEAGUE
Generated: ${new Date().toLocaleDateString('en-PK')}
Verified Standard: GHG Protocol & FBR Section 61 Tax Exemption

TOP PARTICIPATING ENTITIES:
${currentList
  .map(
    (e) =>
      `Rank #${e.rank}: ${e.name} (${e.city})
 - Rescued Food: ${e.rescuedKg} kg
 - Carbon Offset: ${e.co2AvoidedKg} kg CO2e
 - Community Value Saved: PKR ${e.savedPkr.toLocaleString()}
 - Active Eco-Members: ${e.membersCount}
 - Badge: ${e.badge}\n`
  )
  .join('\n')}
=====================================================
Issued by FlashFruit Pakistan Sustainable Technology Division
Contact: esg@flashfruit.pk | www.flashfruit.pk
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `FlashFruit_${activeTab}_ESG_Carbon_Audit_Report.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl glass-panel border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto bg-slate-950/95">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-bold text-2xl flex-shrink-0">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">National Zero-Waste Carbon League</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Pakistan Cup
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Live sustainability tournament between Pakistan’s top universities and tech enterprises
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadEsgReport}
            className="hidden sm:flex px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="size-3.5 text-amber-400" />
            <span>ESG Audit Report</span>
          </button>
        </div>

        {/* League Selector Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab('university');
              sounds.playLaserBeep();
            }}
            className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'university'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="size-4" />
            <span>🎓 University League (LUMS, NUST, IBA, FAST)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('corporate');
              sounds.playLaserBeep();
            }}
            className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'corporate'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Building2 className="size-4" />
            <span>🏢 Corporate ESG League (Jazz, Systems, HBL)</span>
          </button>
        </div>

        {/* Scoreboard Table */}
        <div className="space-y-3">
          {currentList.map((entry) => (
            <div
              key={entry.name}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                entry.rank === 1
                  ? 'bg-slate-900/90 border-amber-400/60 shadow-lg'
                  : 'bg-slate-900/70 border-slate-800 shadow-inner'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`size-9 rounded-xl flex items-center justify-center font-mono font-black text-sm ${
                  entry.rank === 1
                    ? 'bg-amber-400 text-slate-950'
                    : entry.rank === 2
                    ? 'bg-slate-300 text-slate-950'
                    : entry.rank === 3
                    ? 'bg-amber-700 text-white'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  #{entry.rank}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{entry.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {entry.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                    {entry.city} • <Users className="size-3 inline mr-1 text-amber-400" />{entry.membersCount} Eco-Members
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center justify-between sm:justify-end gap-6 text-xs border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Rescued Food</span>
                  <span className="font-bold text-white font-mono">{entry.rescuedKg.toLocaleString()} kg</span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">CO₂ Offset</span>
                  <span className="font-black text-emerald-400 font-mono">{entry.co2AvoidedKg.toLocaleString()} kg CO₂</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-amber-400 block uppercase font-semibold">Value Saved</span>
                  <span className="font-black text-amber-400 font-mono">{formatCurrency(entry.savedPkr)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>

  );
};
