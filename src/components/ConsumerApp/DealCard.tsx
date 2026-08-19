import React, { useState, useEffect } from 'react';
import type { DealItem } from '../../types';
import { Clock, MapPin, Star, ShieldCheck, Flame, ShoppingBag } from 'lucide-react';
import { formatCurrency, formatTimeLeft } from '../../lib/utils';


interface DealCardProps {
  deal: DealItem;
  onReserve: (deal: DealItem) => void;
  onSelect: (deal: DealItem) => void;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onReserve, onSelect }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    Math.floor(deal.expiryHoursLeft * 3600)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="group relative glass-card rounded-3xl overflow-hidden border border-emerald-800/40 flex flex-col justify-between transition-all duration-300">
      
      {/* Top Banner Image with Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={deal.imageUrl}
          alt={deal.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Dynamic Discount Floating Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full decay-badge text-slate-950 font-black text-xs shadow-lg">
          <Flame className="size-4 animate-bounce" />
          <span>{deal.discountPercent}% OFF NOW</span>
        </div>

        {/* Mystery Bag Pill */}
        {deal.isMysteryBag && (
          <div className="absolute top-11 left-3 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-[10px] shadow-md flex items-center gap-1 animate-pulse">
            <span>🎁 Mystery Surprise Bag</span>
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-300 border border-emerald-700/60 font-semibold text-[11px]">
          {deal.stockQuantity} Left
        </div>

        {/* Store Name & Verification Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="font-bold flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-emerald-800/60">
            <MapPin className="size-3.5 text-emerald-400" />
            <span className="truncate max-w-[130px]">{deal.storeName}</span>
            {deal.isVerified && (
              <ShieldCheck className="size-3.5 text-emerald-400" />
            )}
          </span>
          <span className="bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-xl text-amber-400 font-semibold flex items-center gap-1 border border-emerald-800/60">
            <Star className="size-3.5 fill-amber-400" />
            {deal.storeRating}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Category Tag & City */}
          <div className="flex items-center justify-between gap-1.5 mb-2">
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${
              deal.isMysteryBag
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
            }`}>
              {deal.isMysteryBag ? 'Mystery Box' : deal.category}
            </span>
            <span className="text-[11px] text-emerald-300/70 font-medium">
              📍 {deal.location.city || 'Lahore'} ({deal.distanceKm} km)
            </span>
          </div>

          <h3
            onClick={() => onSelect(deal)}
            className="text-base font-bold text-white hover:text-emerald-300 cursor-pointer line-clamp-2 transition-colors mb-2"
          >
            {deal.title}
          </h3>

          {/* Time Decay Schedule Rule Preview or Mystery Bag Contents */}
          {deal.isMysteryBag && deal.mysteryBagContents ? (
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200">
              <p className="line-clamp-1">
                🎁 <strong>May contain: </strong>
                {deal.mysteryBagContents.join(' • ')}
              </p>
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-900/50 text-[11px] text-emerald-200/80">
              <p className="line-clamp-1">
                ⏱️ <strong className="text-amber-300 font-semibold">Auto-Decay Schedule: </strong>
                30% @ 3h → 50% @ 2h → 75% @ 1h before closing.
              </p>
            </div>
          )}
        </div>


        {/* Real-time Dynamic Pricing & Countdown Section */}
        <div className="pt-2 border-t border-emerald-900/40 flex flex-col gap-3">
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-emerald-400/70 font-semibold">
                Current Discount Price
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-amber-300 tracking-tight">
                  {formatCurrency(deal.currentPricePkr)}
                </span>
                <span className="text-xs line-through text-emerald-400/50">
                  {formatCurrency(deal.originalPricePkr)}
                </span>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs text-red-400 font-mono font-bold">
                <Clock className="size-3.5 animate-spin text-red-400" />
                <span>{formatTimeLeft(secondsRemaining)}</span>
              </div>
              <span className="text-[10px] text-emerald-400/60">
                15-min pickup window
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelect(deal)}
              className="py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-200 text-xs font-semibold transition-colors"
            >
              View Schedule
            </button>

            <button
              onClick={() => onReserve(deal)}
              className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-950/80 flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
            >
              <ShoppingBag className="size-4" />
              <span>Reserve Deal</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
