import React, { useState } from 'react';
import type { DealItem } from '../../types';
import { MapPin, Navigation, Compass, Layers, Star, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';


interface DealMapProps {
  deals: DealItem[];
  selectedDeal: DealItem | null;
  onSelectDeal: (deal: DealItem) => void;
  onReserveDeal: (deal: DealItem) => void;
}

export const DealMap: React.FC<DealMapProps> = ({
  deals,
  selectedDeal,
  onSelectDeal,
  onReserveDeal,
}) => {
  const [mapMode, setMapMode] = useState<'radar' | 'pins'>('radar');

  return (
    <div className="relative w-full h-[420px] lg:h-[480px] rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl">
      
      {/* Background Geolocation Radar Map */}
      <div className="absolute inset-0 bg-[#080d16] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-90" />

      {/* Radar Sweep Effect */}
      {mapMode === 'radar' && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] pointer-events-none opacity-40">
          <div className="radar-sweep" />
          <div className="absolute inset-0 rounded-full border border-emerald-500/20" />
          <div className="absolute inset-[25%] rounded-full border border-emerald-500/20" />
          <div className="absolute inset-[50%] rounded-full border border-emerald-500/20" />
        </div>
      )}

      {/* Geolocation Center Pin (User Location in Pakistan) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
        <div className="relative flex items-center justify-center">
          <span className="absolute size-10 rounded-full bg-emerald-500/30 animate-ping" />
          <div className="size-5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-lg shadow-emerald-500/50 flex items-center justify-center">
            <div className="size-2 rounded-full bg-slate-950" />
          </div>
        </div>
        <span className="mt-1 text-[11px] font-bold text-emerald-300 bg-slate-950/90 px-3 py-0.5 rounded-full border border-slate-800 shadow">
          📍 You (Gulberg III, Lahore)
        </span>
      </div>

      {/* Map Header Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs text-slate-200 shadow-sm">
          <Navigation className="size-3.5 text-emerald-400 animate-pulse" />
          <span>Live Pakistan Geolocation Scan: <strong className="text-emerald-300">6 Verified Stores</strong></span>
        </div>

        <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-2xl border border-slate-800 text-xs shadow-sm">
          <button
            onClick={() => setMapMode('radar')}
            className={`px-3 py-1 rounded-xl flex items-center gap-1.5 transition-all ${
              mapMode === 'radar' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="size-3.5" />
            <span>Radar View</span>
          </button>
          <button
            onClick={() => setMapMode('pins')}
            className={`px-3 py-1 rounded-xl flex items-center gap-1.5 transition-all ${
              mapMode === 'pins' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="size-3.5" />
            <span>Store Pins</span>
          </button>
        </div>
      </div>

      {/* Deal Store Pins Overlay */}
      {deals.map((deal) => {
        const isSelected = selectedDeal?.id === deal.id;

        return (
          <div
            key={deal.id}
            style={{ left: `${deal.location.x}%`, top: `${deal.location.y}%` }}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
          >
            <button
              onClick={() => onSelectDeal(deal)}
              className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-2xl border shadow-xl transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 border-amber-300 text-slate-950 scale-110 shadow-amber-500/40 z-30 ring-4 ring-amber-400/30'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-100 hover:scale-105 shadow-slate-950/80 hover:border-emerald-500/50'
              }`}
            >
              <div className={`size-7 rounded-xl flex items-center justify-center font-black text-xs ${
                isSelected ? 'bg-slate-950 text-amber-400' : 'bg-emerald-500 text-slate-950'
              }`}>
                {deal.discountPercent}%
              </div>

              <div className="text-left hidden sm:block">
                <p className="text-[11px] font-bold truncate max-w-[110px] leading-tight">
                  {deal.storeName}
                </p>
                <p className={`text-[10px] ${isSelected ? 'text-slate-950 font-bold' : 'text-slate-400'}`}>
                  {formatCurrency(deal.currentPricePkr)} • {deal.distanceKm}km
                </p>
              </div>

              <MapPin className={`size-4 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
            </button>
          </div>
        );
      })}

      {/* Selected Deal Floating Quick Preview Card */}
      {selectedDeal && (
        <div className="absolute bottom-4 left-4 right-4 z-30 max-w-md mx-auto glass-panel border border-amber-500/40 p-4 rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex gap-3 items-center">
            <img
              src={selectedDeal.imageUrl}
              alt={selectedDeal.title}
              className="size-20 rounded-2xl object-cover border border-slate-700 flex-shrink-0 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  ⚡ {selectedDeal.discountPercent}% OFF LIVE
                </span>
                <span className="text-[10px] text-slate-300 flex items-center gap-1 font-semibold">
                  <Star className="size-3 text-amber-400 fill-amber-400" />
                  {selectedDeal.storeRating} ({selectedDeal.distanceKm} km)
                </span>
              </div>

              <h4 className="text-xs font-bold text-white truncate mb-0.5">
                {selectedDeal.title}
              </h4>
              <p className="text-[11px] text-slate-400 truncate mb-2">
                {selectedDeal.storeName} • {selectedDeal.location.address}, {selectedDeal.location.city}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-black text-amber-400">
                    {formatCurrency(selectedDeal.currentPricePkr)}
                  </span>
                  <span className="text-xs line-through text-slate-500 font-medium">
                    {formatCurrency(selectedDeal.originalPricePkr)}
                  </span>
                </div>

                <button
                  onClick={() => onReserveDeal(selectedDeal)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black shadow-md flex items-center gap-1 transition-all active:scale-95"
                >
                  <span>Reserve (15m)</span>
                  <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 hidden md:flex items-center gap-4 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 shadow-sm">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-amber-400" /> High Discount (&gt;65% Off)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-emerald-400" /> Dynamic Pricing Active
        </span>
      </div>

    </div>

  );
};
