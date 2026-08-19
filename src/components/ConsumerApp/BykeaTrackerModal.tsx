import React, { useState, useEffect } from 'react';
import type { Reservation } from '../../types';
import { X, Bike, MapPin, Phone, ShieldCheck, Navigation, MessageCircle } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';


interface BykeaTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
}

const STAGES = [
  { stage: 'Assigned', title: 'Bykea Express Rider Assigned', desc: 'Rider moving to merchant store' },
  { stage: 'Pickup', title: 'Arrived at Merchant Store', desc: 'Merchant verifying code and packing items' },
  { stage: 'EnRoute', title: 'On Road (Main Boulevard)', desc: 'Rider speeding to your delivery drop-off' },
  { stage: 'Arrived', title: 'Arrived at Customer Doorstep', desc: 'Please meet rider and collect your package' },
];

export const BykeaTrackerModal: React.FC<BykeaTrackerModalProps> = ({
  isOpen,
  onClose,
  reservation,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [riderSpeedKmh, setRiderSpeedKmh] = useState<number>(38);
  const [etaMinutes, setEtaMinutes] = useState<number>(12);

  useEffect(() => {
    if (!isOpen) return;

    // Simulate animated ride progression across 4 stages
    const timer1 = setTimeout(() => {
      setCurrentStageIdx(1);
      setEtaMinutes(9);
    }, 3500);

    const timer2 = setTimeout(() => {
      setCurrentStageIdx(2);
      setEtaMinutes(5);
      setRiderSpeedKmh(46);
    }, 7500);

    const timer3 = setTimeout(() => {
      setCurrentStageIdx(3);
      setEtaMinutes(0);
      setRiderSpeedKmh(0);
    }, 12000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen]);

  if (!isOpen || !reservation) return null;

  const riderName = reservation.bykeaRiderName || 'Tariq Mahmood';
  const riderPhone = reservation.bykeaRiderPhone || '+92 312 8889900';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel border border-amber-500/50 rounded-3xl p-6 shadow-2xl overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="size-11 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shadow-lg">
            <Bike className="size-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Bykea Express Live GPS Tracker</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                🇵🇰 Express 15m
              </span>
            </div>
            <p className="text-xs text-emerald-300/70">Live delivery tracking for Pass #{reservation.pickupCode}</p>
          </div>
        </div>

        {/* Animated Map Route Visualizer */}
        <div className="relative w-full h-44 rounded-2xl bg-[#08150e] border border-emerald-800 overflow-hidden mb-4 p-4 flex flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(#1e3b2b_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
          
          <div className="relative z-10 flex items-center justify-between text-xs">
            <span className="px-2.5 py-1 rounded-xl bg-slate-950/90 text-emerald-300 border border-emerald-700 font-mono text-[11px]">
              Speed: <strong className="text-amber-300">{riderSpeedKmh} km/h</strong>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-[11px]">
              ETA: {etaMinutes > 0 ? `${etaMinutes} mins` : 'Arrived!'}
            </span>
          </div>

          {/* Animated Rider Marker Moving on Map */}
          <div className="relative z-10 w-full py-4">
            <div className="relative w-full h-2 rounded-full bg-emerald-950 border border-emerald-800 flex items-center">
              <div
                style={{ width: `${(currentStageIdx + 1) * 25}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-700"
              />
              <div
                style={{ left: `${(currentStageIdx + 1) * 25 - 4}%` }}
                className="absolute size-8 rounded-full bg-amber-500 text-slate-950 border-2 border-white shadow-xl flex items-center justify-center transition-all duration-700 -translate-y-0.5"
              >
                <Bike className="size-4 animate-bounce" />
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-emerald-300/70 mt-2 font-mono">
              <span>🏪 {reservation.item.storeName.split(' ')[0]}</span>
              <span>🛣️ Main Blvd</span>
              <span>📍 Dropoff ({reservation.item.location.city})</span>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-emerald-200">
            <span className="flex items-center gap-1">
              <Navigation className="size-3 text-emerald-400" />
              <span>Status: <strong className="text-white">{STAGES[currentStageIdx].title}</strong></span>
            </span>
            <span className="text-[10px] text-emerald-400/80">{STAGES[currentStageIdx].desc}</span>
          </div>
        </div>

        {/* Rider Profile Card */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-base">
              TM
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white">{riderName}</h4>
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
                  <ShieldCheck className="size-2.5 text-emerald-400" /> 4.9 ★
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/70">Vehicle: Suzuki GD110 (LEB-8921)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${riderPhone}`}
              className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 transition-colors"
              title="Call Rider"
            >
              <Phone className="size-4" />
            </a>
            <a
              href={`https://wa.me/?text=Hi%20${encodeURIComponent(riderName)},%20tracking%20my%20FlashFruit%20order%20pass%20${reservation.pickupCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors"
              title="WhatsApp Rider"
            >
              <MessageCircle className="size-4" />
            </a>
          </div>
        </div>

        {/* Order Details Summary */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-emerald-900 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <MapPin className="size-4 text-emerald-400 flex-shrink-0" />
            <span className="text-emerald-200/80 truncate">
              {reservation.item.title} (Qty: {reservation.quantity})
            </span>
          </div>
          <span className="font-black text-amber-300 flex-shrink-0 ml-2">
            {formatCurrency(reservation.totalPricePkr)}
          </span>
        </div>

      </div>
    </div>
  );
};
