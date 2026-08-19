import React, { useState, useEffect } from 'react';
import type { Reservation } from '../../types';
import { X, QrCode, Clock, MapPin, ShoppingBag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface ActivePassesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: Reservation[];
  onOpenBykeaTracker?: (res: Reservation) => void;
}

function PassCountdown({ endTime, status }: { endTime: string; status: string }) {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const end = new Date(endTime).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((end - now) / 1000));
  });

  useEffect(() => {
    if (status !== 'pending') return;
    const interval = setInterval(() => {
      const end = new Date(endTime).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setSecondsLeft(diff);
      if (diff <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, status]);

  if (status === 'collected') {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
        <CheckCircle2 className="size-3 text-emerald-400" />
        COLLECTED
      </span>
    );
  }

  if (secondsLeft <= 0) {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1">
        <AlertTriangle className="size-3 text-red-400" />
        HOLD EXPIRED
      </span>
    );
  }

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse font-mono">
      <Clock className="size-3 text-amber-400" />
      Hold: {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
    </span>
  );
}

export const ActivePassesDrawer: React.FC<ActivePassesDrawerProps> = ({
  isOpen,
  onClose,
  reservations,
  onOpenBykeaTracker,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#09150e] border-l border-emerald-800/60 h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
        
        <div>
          <div className="flex items-center justify-between border-b border-emerald-900/60 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">My Reservations</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {reservations.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {reservations.length === 0 ? (
            <div className="text-center py-16">
              <div className="size-16 rounded-full bg-emerald-950 flex items-center justify-center mx-auto mb-3 text-2xl border border-emerald-800">
                🎟️
              </div>
              <h3 className="text-base font-bold text-white mb-1">No Active Reservations</h3>
              <p className="text-xs text-emerald-300/70 max-w-xs mx-auto">
                Reserve dynamic surplus food deals to generate your 15-minute pickup codes!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="glass-panel p-4 rounded-2xl border border-emerald-700/50 flex flex-col gap-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <PassCountdown endTime={res.pickupWindowEnd} status={res.status} />
                    <span className="font-mono text-xs font-bold text-amber-300">
                      Code: #{res.pickupCode}
                    </span>
                  </div>

                  <div className="flex gap-3 items-center">
                    <img
                      src={res.item.imageUrl}
                      alt={res.item.title}
                      className="size-14 rounded-xl object-cover border border-emerald-800"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">
                        {res.item.title}
                      </h4>
                      <p className="text-[11px] text-emerald-300/70 truncate flex items-center gap-1">
                        <MapPin className="size-3" />
                        {res.item.storeName}
                      </p>
                      <span className="text-xs font-black text-amber-300">
                        {formatCurrency(res.totalPricePkr)} (Qty: {res.quantity})
                      </span>
                    </div>
                  </div>

                  {res.fulfillmentType === 'bykea-delivery' && onOpenBykeaTracker && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenBykeaTracker(res);
                      }}
                      className="w-full py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>🏍️ Track Bykea Rider Live Route</span>
                    </button>
                  )}

                  <div className="p-3 rounded-xl bg-white text-slate-950 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="size-8 text-emerald-600" />
                      <div className="text-left">
                        <span className="text-[10px] text-slate-500 font-semibold block">Pickup Code</span>
                        <span className="font-mono text-xs font-bold">{res.pickupCode}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {res.paymentMethod}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors mt-6"
        >
          Close Drawer
        </button>

      </div>
    </div>
  );
};

