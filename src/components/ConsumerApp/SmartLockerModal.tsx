import React, { useState } from 'react';
import { X, Lock, Unlock, Thermometer, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../lib/soundEffects';


interface SmartLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartLockerModal: React.FC<SmartLockerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const assignedLockerNumber = 4;
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [chamberTemp] = useState<number>(3.8);

  if (!isOpen) return null;

  const handleUnlockLocker = () => {
    setIsUnlocking(true);
    sounds.playLaserBeep();

    setTimeout(() => {
      setIsUnlocking(false);
      setIsUnlocked(true);
      sounds.playSuccessFanfare();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel border border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden bg-[#061510]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-600 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20 font-black text-2xl">
            🧊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Smart 24/7 Refrigerated Cold-Locker Hub</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Contactless Pickup
              </span>
            </div>
            <p className="text-xs text-emerald-300/70">
              Outdoor temperature-controlled locker bay at Al-Fatah Gulberg III (Pakistan)
            </p>
          </div>
        </div>

        {/* Live Telemetry Sensors Banner */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center text-xs">
          <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-700/60">
            <span className="text-[10px] text-cyan-400 uppercase font-semibold flex items-center justify-center gap-1">
              <Thermometer className="size-3" />
              Chamber Temp
            </span>
            <span className="font-mono text-base font-black text-cyan-300">{chamberTemp}°C Chill</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-700/60">
            <span className="text-[10px] text-cyan-400 uppercase font-semibold flex items-center justify-center gap-1">
              <Sparkles className="size-3" />
              UV-C Sanitation
            </span>
            <span className="font-mono text-base font-black text-emerald-300">Active (Sterile)</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-700/60">
            <span className="text-[10px] text-cyan-400 uppercase font-semibold flex items-center justify-center gap-1">
              <ShieldCheck className="size-3" />
              Assigned Door
            </span>
            <span className="font-mono text-base font-black text-amber-300">Locker #{assignedLockerNumber}</span>
          </div>
        </div>

        {/* 12-Bay Locker Visualizer Grid */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-emerald-800/80 mb-6">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-white uppercase tracking-wider">Locker Grid Bay Status:</span>
            <span className="text-emerald-400/80 text-[11px]">Outdoor Station #01</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((lockerNum) => {
              const isAssigned = lockerNum === assignedLockerNumber;
              return (
                <div
                  key={lockerNum}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isAssigned
                      ? isUnlocked
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-105 shadow-lg shadow-emerald-500/20 animate-pulse'
                        : 'bg-amber-500/20 border-amber-400 text-amber-300 scale-105 shadow-lg shadow-amber-500/20'
                      : 'bg-emerald-950/40 border-emerald-900 text-emerald-600 opacity-60'
                  }`}
                >
                  {isAssigned ? (
                    isUnlocked ? <Unlock className="size-4 text-emerald-400" /> : <Lock className="size-4 text-amber-400" />
                  ) : (
                    <Lock className="size-3.5" />
                  )}
                  <span className="font-mono font-bold text-xs">#{lockerNum.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] font-semibold">
                    {isAssigned ? (isUnlocked ? 'OPEN' : 'YOURS') : 'OCCUPIED'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unlock Action Button / Confirmation */}
        <div className="p-6 rounded-3xl bg-emerald-950/70 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs">
            <h4 className="font-bold text-white mb-0.5">Surplus Package Waiting in Bay #{assignedLockerNumber}</h4>
            <p className="text-emerald-300/80">
              Hold code: <strong className="font-mono text-amber-300">PK-84920</strong> • 15 Mins Hold
            </p>
          </div>

          <div>
            {isUnlocked ? (
              <div className="px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg animate-bounce">
                <CheckCircle2 className="size-4" />
                <span>Door Latch Unlocked! Take Item</span>
              </div>
            ) : (
              <button
                onClick={handleUnlockLocker}
                disabled={isUnlocking}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-xl flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
              >
                <Unlock className="size-4" />
                <span>{isUnlocking ? 'Connecting Bluetooth Sensor...' : 'Unlock Locker Door #04 🔓'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
