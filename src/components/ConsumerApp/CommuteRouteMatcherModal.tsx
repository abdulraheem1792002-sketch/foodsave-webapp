import React, { useState } from 'react';
import type { DealItem } from '../../types';
import { X, Car, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

import { sounds } from '../../lib/soundEffects';

interface CommuteRouteMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  deals: DealItem[];
  onReserveDeal: (deal: DealItem) => void;
}

const PRESET_ROUTES = [
  {
    id: 'lhr-1',
    city: 'Lahore',
    origin: 'Office (Gulberg III Main Blvd)',
    destination: 'Home (DHA Phase 5)',
    distanceKm: 9.4,
    commuteMinutes: 22,
    storeId: 'ret-1',
    storeName: 'Al-Fatah Gourmet Supermarket',
    detourMins: 0,
    fuelSavedPkr: 240,
  },
  {
    id: 'isb-1',
    city: 'Islamabad',
    origin: 'Office (Blue Area)',
    destination: 'Home (F-10 / F-11 Markaz)',
    distanceKm: 8.1,
    commuteMinutes: 18,
    storeId: 'ret-3',
    storeName: 'Tehzeeb Bakery',
    detourMins: 0,
    fuelSavedPkr: 210,
  },
  {
    id: 'khi-1',
    city: 'Karachi',
    origin: 'Bank (I.I. Chundrigar Road)',
    destination: 'Home (Clifton Block 4)',
    distanceKm: 11.2,
    commuteMinutes: 28,
    storeId: 'ret-6',
    storeName: 'Espresso Cafe & Deli',
    detourMins: 1,
    fuelSavedPkr: 280,
  },
];

export const CommuteRouteMatcherModal: React.FC<CommuteRouteMatcherModalProps> = ({
  isOpen,
  onClose,
  deals,
  onReserveDeal,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('lhr-1');
  const activeRoute = PRESET_ROUTES.find((r) => r.id === selectedRouteId) || PRESET_ROUTES[0];

  const matchedDeals = deals.filter((d) =>
    d.storeName.toLowerCase().includes(activeRoute.storeName.split(' ')[0].toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel border border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto bg-[#07170f]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Car className="size-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Smart Commute Route Matcher</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                0-Min Detour AI
              </span>
            </div>
            <p className="text-xs text-emerald-300/70">
              Pick up tonight’s dinner on your drive home without adding a single extra minute
            </p>
          </div>
        </div>

        {/* Preset Commute Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {PRESET_ROUTES.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRouteId(r.id);
                sounds.playLaserBeep();
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedRouteId === r.id
                  ? 'bg-amber-500 text-slate-950 shadow-lg scale-105'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
              }`}
            >
              <span>{r.city}: {r.origin.split(' ')[0]} ➔ {r.destination.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Route Telemetry Card */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-emerald-700/60 flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-900/60 pb-3">
            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <span className="font-bold text-amber-300">{activeRoute.origin}</span>
              <ArrowRight className="size-3 text-emerald-400" />
              <span className="font-bold text-emerald-300">{activeRoute.destination}</span>
            </div>
            <span className="text-[11px] text-emerald-400/80 font-mono">
              {activeRoute.distanceKm} km • ~{activeRoute.commuteMinutes} mins drive
            </span>
          </div>

          {/* Savings Metric Pills */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800">
              <span className="text-[10px] text-emerald-400 font-semibold uppercase block">Detour Added</span>
              <span className="font-black text-amber-300 text-base">+{activeRoute.detourMins} Mins (Zero)</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800">
              <span className="text-[10px] text-emerald-400 font-semibold uppercase block">Fuel Saved</span>
              <span className="font-black text-emerald-200 text-base">₨ {activeRoute.fuelSavedPkr}</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800">
              <span className="text-[10px] text-emerald-400 font-semibold uppercase block">Curbside Handover</span>
              <span className="font-black text-teal-300 text-base">Car Trunk Ready</span>
            </div>
          </div>
        </div>

        {/* Deals Directly on Route */}
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ShoppingBag className="size-4 text-amber-400" />
            <span>Surplus Bags Directly Along Your Driving Path:</span>
          </h3>

          <div className="space-y-3">
            {matchedDeals.length > 0 ? (
              matchedDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 hover:border-emerald-600 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={deal.imageUrl}
                      alt={deal.title}
                      className="size-14 rounded-xl object-cover border border-emerald-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{deal.title}</h4>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {deal.discountPercent}% OFF
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-300/70">{deal.storeName} • {deal.pickupDeadline}</p>
                      <span className="font-mono text-xs font-black text-amber-300 mt-0.5 block">
                        {formatCurrency(deal.currentPricePkr)}{' '}
                        <span className="line-through text-emerald-500/60 text-[10px] font-normal">{formatCurrency(deal.originalPricePkr)}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onReserveDeal(deal);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-1"
                  >
                    <span>Reserve for Drive</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900 text-center text-xs text-emerald-300/70">
                No active deals directly on this route at this minute. Checking surrounding branches...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
