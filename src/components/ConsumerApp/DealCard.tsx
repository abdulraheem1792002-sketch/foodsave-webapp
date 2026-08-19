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
    <div className="group relative glass-card rounded-3xl overflow-hidden border border-slate-800/80 flex flex-col justify-between transition-all duration-300 hover:border-emerald-500/40">
      
      {/* Top Banner Image with Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={deal.imageUrl}
          alt={deal.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Dynamic Discount Floating Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full decay-badge text-white font-black text-xs shadow-lg ring-1 ring-white/20">
          <Flame className="size-4 animate-bounce" />
          <span>{deal.discountPercent}% OFF NOW</span>
        </div>

        {/* Mystery Bag Pill */}
        {deal.isMysteryBag && (
          <div className="absolute top-11 left-3 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-[10px] shadow-md flex items-center gap-1 animate-pulse">
            <span>🎁 Mystery Bag</span>
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-300 border border-slate-700/80 font-bold text-[11px] shadow-sm">
          {deal.stockQuantity} Left
        </div>

        {/* Store Name & Verification Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="font-bold flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 shadow-sm">
            <MapPin className="size-3.5 text-emerald-400" />
            <span className="truncate max-w-[130px]">{deal.storeName}</span>
            {deal.isVerified && (
              <ShieldCheck className="size-3.5 text-emerald-400" />
            )}
          </span>
          <span className="bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-xl text-amber-400 font-bold flex items-center gap-1 border border-slate-800 shadow-sm">
            <Star className="size-3.5 fill-amber-400" />
            {deal.storeRating}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-slate-950/40">
        <div>
          {/* Category Tag & City */}
          <div className="flex items-center justify-between gap-1.5 mb-2">
            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
              deal.isMysteryBag
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            }`}>
              {deal.isMysteryBag ? 'Mystery Box' : deal.category}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              📍 {deal.location.city || 'Lahore'} ({deal.distanceKm} km)
            </span>
          </div>

          <h3
            onClick={() => onSelect(deal)}
            className="text-base font-bold text-white hover:text-emerald-300 cursor-pointer line-clamp-2 transition-colors mb-2 leading-snug"
          >
            {deal.title}
          </h3>

          {/* Time Decay Schedule Rule Preview or Mystery Bag Contents */}
          {deal.isMysteryBag && deal.mysteryBagContents ? (
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 shadow-inner">
              <p className="line-clamp-1">
                🎁 <strong>Includes: </strong>
                {deal.mysteryBagContents.join(' • ')}
              </p>
            </div>
          ) : (
            <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 shadow-inner">
              <p className="line-clamp-1">
                ⏱️ <strong className="text-amber-400 font-semibold">Auto-Decay: </strong>
                30% @ 3h → 50% @ 2h → 75% @ 1h before close.
              </p>
            </div>
          )}
        </div>

        {/* Real-time Dynamic Pricing & Countdown Section */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-3">
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Rescue Price
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-amber-400 tracking-tight drop-shadow-sm">
                  {formatCurrency(deal.currentPricePkr)}
                </span>
                <span className="text-xs line-through text-slate-500 font-medium">
                  {formatCurrency(deal.originalPricePkr)}
                </span>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono font-bold bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-lg">
                <Clock className="size-3.5 animate-spin text-rose-400" />
                <span>{formatTimeLeft(secondsRemaining)}</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Guaranteed hold
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelect(deal)}
              className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all hover:border-slate-600 shadow-sm"
            >
              View Schedule
            </button>

            <button
              onClick={() => onReserve(deal)}
              className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-1.5 transition-all transform active:scale-95 hover:scale-102"
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
