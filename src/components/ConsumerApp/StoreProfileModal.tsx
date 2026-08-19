import React from 'react';
import { X, MapPin, Star, ShieldCheck } from 'lucide-react';
import type { DealItem, RetailerStore } from '../../types';
import { formatCurrency } from '../../lib/utils';


interface StoreProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: RetailerStore | null;
  storeDeals: DealItem[];
  onReserveDeal: (deal: DealItem) => void;
}

export const StoreProfileModal: React.FC<StoreProfileModalProps> = ({
  isOpen,
  onClose,
  store,
  storeDeals,
  onReserveDeal,
}) => {
  if (!isOpen || !store) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto bg-slate-950/95">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Store Banner */}
        <div className="relative h-44 -mx-6 -mt-6 mb-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 p-6 flex flex-col justify-end border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="size-14 rounded-2xl bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center justify-center text-3xl font-bold shadow-lg">
              🏪
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">{store.name}</h2>
                {store.isVerified && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="size-3.5 text-emerald-400" />
                    Verified Store
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                <MapPin className="size-3.5 text-emerald-400" />
                {store.address}, {store.city}
              </p>
            </div>
          </div>
        </div>

        {/* Store Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-inner">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Rating</span>
            <span className="text-base font-black text-amber-400 flex items-center justify-center gap-1">
              <Star className="size-4 fill-amber-400" /> {store.rating}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-inner">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Active Deals</span>
            <span className="text-base font-black text-emerald-400">
              {storeDeals.length} Listings
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-inner">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Revenue Recovered</span>
            <span className="text-base font-black text-amber-400">
              {formatCurrency(store.totalRecoveredPkr)}
            </span>
          </div>
        </div>

        {/* Store Active Deals Section */}
        <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
          <span>Active Surplus Deals by {store.name}</span>
          <span className="text-xs text-slate-400 font-medium">{storeDeals.length} active</span>
        </h3>

        {storeDeals.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No active surplus listings right now for this store.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {storeDeals.map((deal) => (
              <div key={deal.id} className="glass-panel p-3 rounded-2xl border border-slate-800 bg-slate-900/80 flex gap-3 items-center shadow-sm">
                <img src={deal.imageUrl} alt={deal.title} className="size-16 rounded-xl object-cover border border-slate-700 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{deal.title}</h4>
                  <div className="flex items-baseline gap-1.5 my-1">
                    <span className="text-sm font-black text-amber-400">{formatCurrency(deal.currentPricePkr)}</span>
                    <span className="text-[10px] line-through text-slate-500">{formatCurrency(deal.originalPricePkr)}</span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onReserveDeal(deal);
                    }}
                    className="w-full py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] shadow-sm transition-colors"
                  >
                    Reserve Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
