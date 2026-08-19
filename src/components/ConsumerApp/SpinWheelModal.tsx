import React, { useState } from 'react';
import { X, Sparkles, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';


interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIZES = [
  '₨ 150 Bykea Delivery Credit',
  '+15% Extra Surplus Discount',
  'Free Samosa & Chai Voucher',
  '₨ 250 FlashFruit Wallet Cash',
  'Free Delivery on Next Order',
  '+20% Mega Surplus Off',
];

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({ isOpen, onClose }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setWonPrize(null);

    const extraRounds = 5;
    const randomPrizeIndex = Math.floor(Math.random() * PRIZES.length);
    const degreesPerSlice = 360 / PRIZES.length;
    const targetDegree = rotation + extraRounds * 360 + randomPrizeIndex * degreesPerSlice;

    setRotation(targetDegree);

    setTimeout(() => {
      setSpinning(false);
      const prize = PRIZES[randomPrizeIndex];
      setWonPrize(prize);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
      });
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel border border-amber-500/50 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="size-6 text-amber-400 animate-spin" />
          <h3 className="text-lg font-black text-white">Daily Spin-to-Save Wheel</h3>
        </div>
        <p className="text-xs text-emerald-300/70 mb-4">
          Spin the lucky wheel once a day for bonus Pakistan surplus savings!
        </p>

        {/* Wheel Container */}
        <div className="relative size-64 mb-6 flex items-center justify-center">
          
          {/* Pointer Needle */}
          <div className="absolute -top-3 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-400 filter drop-shadow-md" />

          {/* Wheel Circle */}
          <div
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
            }}
            className="size-full rounded-full border-4 border-amber-400/80 shadow-2xl relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 flex items-center justify-center"
          >
            {PRIZES.map((prize, idx) => {
              const angle = (360 / PRIZES.length) * idx;
              return (
                <div
                  key={prize}
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: 'center center',
                  }}
                  className="absolute inset-0 flex items-start justify-center pt-3 text-[10px] font-black text-amber-200 tracking-tight"
                >
                  <span className="bg-slate-950/80 px-2 py-0.5 rounded-full border border-amber-500/40 truncate max-w-[90px]">
                    {prize.split(' ')[0]} {prize.split(' ')[1]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="absolute size-14 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-xl shadow-lg z-10 font-bold text-amber-300">
            🎰
          </div>
        </div>

        {/* Prize Notification Card */}
        {wonPrize ? (
          <div className="w-full p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-bold mb-4 animate-bounce flex items-center justify-center gap-2">
            <Gift className="size-5" />
            <span>You Won: {wonPrize}! (Code: SPIN-{Math.floor(1000 + Math.random() * 9000)})</span>
          </div>
        ) : null}

        <button
          disabled={spinning}
          onClick={handleSpin}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-transform transform active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="size-5" />
          <span>{spinning ? 'Spinning Lucky Wheel...' : 'Spin Wheel Now!'}</span>
        </button>

      </div>
    </div>
  );
};
