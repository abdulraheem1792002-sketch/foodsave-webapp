import React, { useState, useEffect, useCallback } from 'react';
import type { Reservation } from '../../types';
import { X, Zap, TrendingDown, Target, Clock, Trophy, Users } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { sounds } from '../../lib/soundEffects';

interface DutchAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReservation?: (res: Reservation) => void;
}

interface OrderBookBid {
  id: string;
  bidder: string;
  amountPkr: number;
  city: string;
  timestamp: string;
}

export const DutchAuctionModal: React.FC<DutchAuctionModalProps> = ({
  isOpen,
  onClose,
  onConfirmReservation,
}) => {
  const originalPricePkr = 3200;
  const startPricePkr = 1600;
  const floorPricePkr = 450;
  const priceDropStep = 50;

  const [currentPricePkr, setCurrentPricePkr] = useState<number>(startPricePkr);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(10);
  const [autoBidLimit, setAutoBidLimit] = useState<string>('650');
  const [isAutoBidActive, setIsAutoBidActive] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [wonPrice, setWonPrice] = useState<number>(0);

  const [orderBook, setOrderBook] = useState<OrderBookBid[]>([
    { id: 'b1', bidder: 'Zainab M. (Gulberg)', amountPkr: 550, city: 'Lahore', timestamp: '10s ago' },
    { id: 'b2', bidder: 'Bilal R. (DHA 5)', amountPkr: 600, city: 'Lahore', timestamp: '5s ago' },
    { id: 'b3', bidder: 'Hamza S. (Model Town)', amountPkr: 500, city: 'Lahore', timestamp: '12s ago' },
  ]);

  const handleSnipeDeal = useCallback(
    (overridePrice?: number) => {
      const finalPrice = overridePrice || currentPricePkr;
      setWonPrice(finalPrice);
      setIsWon(true);
      sounds.playCashChime();
      sounds.playSuccessFanfare();

      if (onConfirmReservation) {
        onConfirmReservation({
          id: `auc-${Date.now()}`,
          pickupCode: `AUC-${Math.floor(10000 + Math.random() * 90000)}`,
          quantity: 1,
          totalPricePkr: finalPrice,
          savedPkr: originalPricePkr - finalPrice,
          pickupWindowEnd: '10:30 PM',
          fulfillmentType: 'self-pickup',
          status: 'pending',
          createdAt: new Date().toISOString(),
          paymentMethod: 'Cash on Pickup',
          paymentStatus: 'pending',
          item: {
            id: 'dl-auc-1',
            storeId: 'ret-4',
            storeName: 'Kitchen Cuisine',
            storeType: 'restaurant',
            storeRating: 4.9,
            title: '🍰 Bulk Lot: 12x Belgian Chocolate Torte & Pastries',
            category: 'restaurant',
            originalPricePkr,
            currentPricePkr: finalPrice,
            discountPercent: Math.round(((originalPricePkr - finalPrice) / originalPricePkr) * 100),
            expiryHoursLeft: 1.5,
            stockQuantity: 1,
            pickupDeadline: 'Within 90 mins',
            distanceKm: 0.8,
            imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
            isVerified: true,
            location: { x: 55, y: 48, address: 'DHA Phase 5 Commercial', city: 'Lahore' },
            decaySchedule: [],
            hoursRemaining: 1.5,
          },
        });
      }
    },
    [currentPricePkr, onConfirmReservation]
  );

  // Live Dutch Auction Price Ticker
  useEffect(() => {
    if (!isOpen || isWon) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Drop price
          setCurrentPricePkr((oldPrice) => {
            const nextPrice = Math.max(floorPricePkr, oldPrice - priceDropStep);
            sounds.playLaserBeep();

            // Check auto bid trigger
            const limit = Number(autoBidLimit);
            if (isAutoBidActive && limit >= nextPrice) {
              handleSnipeDeal(nextPrice);
            }
            return nextPrice;
          });
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isWon, isAutoBidActive, autoBidLimit, handleSnipeDeal]);

  if (!isOpen) return null;

  const handleSetAutoBid = (e: React.FormEvent) => {

    e.preventDefault();
    const limit = Number(autoBidLimit);
    if (!limit || limit < floorPricePkr) return;

    setIsAutoBidActive(true);
    sounds.playAlertPing();
    setOrderBook((prev) => [
      {
        id: `b-${Date.now()}`,
        bidder: 'You (Standing Bid)',
        amountPkr: limit,
        city: 'Lahore',
        timestamp: 'Just now',
      },
      ...prev,
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel border border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden bg-[#06150e]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-slate-950 flex items-center justify-center shadow-lg font-black text-2xl animate-pulse">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">Live Perishable Dutch Auction</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500/20 text-red-300 border border-red-500/40 uppercase tracking-wider flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-red-400 animate-ping" />
                Live Floor Trading
              </span>
            </div>
            <p className="text-xs text-emerald-300/70">
              Prices tick DOWN every 10 seconds. Snipe before competing buyers claim the lot!
            </p>
          </div>
        </div>

        {isWon ? (
          <div className="p-8 rounded-3xl bg-slate-950 border border-emerald-500/80 text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
            <div className="size-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center text-3xl shadow-lg">
              <Trophy className="size-8 text-amber-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">AUCTION SNIPED &amp; WON!</h3>
              <p className="text-xs text-emerald-300/80 mt-1">
                You successfully sniped <strong>12x Belgian Chocolate Torte &amp; Pastries</strong> at:
              </p>
            </div>

            <div className="px-6 py-3 rounded-2xl bg-emerald-950/80 border border-emerald-600 font-mono text-3xl font-black text-amber-300">
              {formatCurrency(wonPrice)}
            </div>

            <p className="text-xs text-emerald-400 font-semibold">
              Original: <span className="line-through text-emerald-500/60">{formatCurrency(originalPricePkr)}</span> • Saved {formatCurrency(originalPricePkr - wonPrice)} (86% OFF)
            </p>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-xl transition-transform active:scale-95"
            >
              View in My Reservations
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">

            {/* Auction Product Details Banner */}
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
                alt="Auction Item"
                className="size-16 rounded-xl object-cover border border-emerald-700"
              />
              <div className="flex-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Kitchen Cuisine (DHA Phase 5, Lahore)</span>
                <h4 className="text-sm font-bold text-white">Bulk Lot: 12x Belgian Chocolate Torte &amp; Gourmet Pastries</h4>
                <div className="flex items-center gap-3 text-xs mt-1">
                  <span className="text-emerald-400/60 line-through">Org: {formatCurrency(originalPricePkr)}</span>
                  <span className="text-emerald-300 font-bold">Floor Price: {formatCurrency(floorPricePkr)}</span>
                </div>
              </div>
            </div>

            {/* Live Ticking Price Dropper Cockpit */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-amber-500/40 flex flex-col items-center justify-center gap-4 text-center relative overflow-hidden">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-amber-400 animate-spin" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Next Price Drop (-₨ 50) In: <strong className="font-mono text-white">{secondsRemaining}s</strong>
                </span>
              </div>

              {/* Glowing Dynamic Price */}
              <div className="font-mono text-5xl sm:text-6xl font-black bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent tracking-tight animate-pulse">
                {formatCurrency(currentPricePkr)}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                  <TrendingDown className="size-3.5" />
                  {Math.round(((originalPricePkr - currentPricePkr) / originalPricePkr) * 100)}% Discount Now
                </span>
                <span className="text-emerald-400/80 font-medium">1 Lot Left</span>
              </div>

              {/* Main Action Button */}
              <button
                onClick={() => handleSnipeDeal()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wide shadow-2xl flex items-center justify-center gap-2 transition-all transform active:scale-95 animate-bounce"
              >
                <Target className="size-5" />
                <span>SNIPE &amp; LOCK DEAL FOR {formatCurrency(currentPricePkr)}!</span>
              </button>
            </div>

            {/* Automated Standing Bid & Order Book */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Limit Auto-Bid Config */}
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800 flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                    <Zap className="size-3.5 text-amber-400" />
                    <span>Automated Limit Auto-Sniper</span>
                  </h5>
                  <p className="text-[11px] text-emerald-300/70 mb-3">
                    Set your target price in PKR. System auto-executes the instant the Dutch clock hits your limit.
                  </p>
                </div>

                <form onSubmit={handleSetAutoBid} className="flex gap-2">
                  <input
                    type="number"
                    min={floorPricePkr}
                    max={currentPricePkr}
                    placeholder="₨ Target (e.g. 650)"
                    value={autoBidLimit}
                    onChange={(e) => setAutoBidLimit(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-emerald-700 text-xs font-bold text-amber-300"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                  >
                    {isAutoBidActive ? 'Updated' : 'Set Limit'}
                  </button>
                </form>
              </div>

              {/* Live Competitor Order Book */}
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800">
                <h5 className="text-xs font-bold text-white mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="size-3.5 text-emerald-400" />
                    <span>Live Order Book</span>
                  </span>
                  <span className="text-[10px] text-emerald-400/80 font-mono">3 Waiting Bidders</span>
                </h5>

                <div className="space-y-1.5 text-[11px]">
                  {orderBook.map((b) => (
                    <div key={b.id} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/60 border border-emerald-900/60">
                      <span className="text-emerald-200 truncate max-w-[120px]">{b.bidder}</span>
                      <span className="font-mono font-bold text-amber-300">{formatCurrency(b.amountPkr)}</span>
                      <span className="text-[9px] text-emerald-500/80">{b.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
