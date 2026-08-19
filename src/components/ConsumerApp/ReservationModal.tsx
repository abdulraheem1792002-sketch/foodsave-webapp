import React, { useState } from 'react';
import type { DealItem, Reservation } from '../../types';
import { X, MapPin, QrCode, CheckCircle2, Sparkles, Wallet, Bike, Users } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import confetti from 'canvas-confetti';
import { createReservationApi } from '../../services/api';
import { sounds } from '../../lib/soundEffects';

interface ReservationModalProps {
  deal: DealItem | null;
  onClose: () => void;
  onConfirmReservation: (reservation: Reservation) => void;
  onOpenWhatsApp: (reservation: Reservation) => void;
  userWalletBalancePkr?: number;
  onOpenGroupSlash?: (deal: DealItem) => void;
  onOpenBykeaTracker?: (res: Reservation) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  deal,
  onClose,
  onConfirmReservation,
  onOpenWhatsApp,
  userWalletBalancePkr = 650,
  onOpenGroupSlash,
  onOpenBykeaTracker,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [fulfillmentType, setFulfillmentType] = useState<'self-pickup' | 'bykea-delivery'>('self-pickup');
  const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'EasyPaisa' | 'Cash on Pickup' | 'Rescue Wallet'>('JazzCash');
  const [useWalletBalance, setUseWalletBalance] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  if (!deal) return null;

  const deliveryFeePkr = fulfillmentType === 'bykea-delivery' ? 150 : 0;
  const itemTotalPkr = deal.currentPricePkr * quantity;
  const rawTotalPkr = itemTotalPkr + deliveryFeePkr;
  const walletDiscountPkr = useWalletBalance ? Math.min(userWalletBalancePkr, rawTotalPkr) : 0;
  const totalPricePkr = Math.max(0, rawTotalPkr - walletDiscountPkr);
  const originalTotalPkr = deal.originalPricePkr * quantity;
  const totalSavingsPkr = originalTotalPkr - itemTotalPkr + walletDiscountPkr;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    sounds.playCashChime();

    try {
      const apiRes = await createReservationApi(deal.id, quantity, paymentMethod);
      
      const newReservation: Reservation = {
        id: apiRes.reservation?.id || `res-${Date.now()}`,
        item: deal,
        quantity,
        totalPricePkr,
        savedPkr: totalSavingsPkr,
        pickupWindowEnd: apiRes.pickupWindowEnd || new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        status: 'pending',
        pickupCode: apiRes.pickupCode || `PK-${Math.floor(10000 + Math.random() * 90000)}`,
        fulfillmentType,
        bykeaRiderName: fulfillmentType === 'bykea-delivery' ? 'Tariq Mahmood (Suzuki GD110)' : undefined,
        bykeaRiderPhone: fulfillmentType === 'bykea-delivery' ? '+92 312 8889900' : undefined,
        bykeaEtaMinutes: fulfillmentType === 'bykea-delivery' ? 12 : undefined,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Pickup' ? 'pending' : 'paid',
        createdAt: new Date().toISOString(),
      };

      setConfirmedReservation(newReservation);
      setIsConfirmed(true);
      onConfirmReservation(newReservation);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34d399', '#f59e0b', '#10b981', '#fbbf24'],
      });
    } catch (error) {
      console.error('Reservation API error:', error);
      const fallbackCode = `PK-${Math.floor(10000 + Math.random() * 90000)}`;
      const newReservation: Reservation = {
        id: `res-${Date.now()}`,
        item: deal,
        quantity,
        totalPricePkr,
        savedPkr: totalSavingsPkr,
        pickupWindowEnd: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        status: 'pending',
        pickupCode: fallbackCode,
        fulfillmentType,
        bykeaRiderName: fulfillmentType === 'bykea-delivery' ? 'Tariq Mahmood (Suzuki GD110)' : undefined,
        bykeaRiderPhone: fulfillmentType === 'bykea-delivery' ? '+92 312 8889900' : undefined,
        bykeaEtaMinutes: fulfillmentType === 'bykea-delivery' ? 12 : undefined,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Pickup' ? 'pending' : 'paid',
        createdAt: new Date().toISOString(),
      };

      setConfirmedReservation(newReservation);
      setIsConfirmed(true);
      onConfirmReservation(newReservation);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel border border-slate-700/80 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
        >
          <X className="size-5" />
        </button>

        {!isConfirmed ? (
          <div className="flex flex-col gap-4">
            
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm">
                ⚡ 15-Minute Pickup Hold
              </span>
              {onOpenGroupSlash && (
                <button
                  onClick={() => onOpenGroupSlash(deal)}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[11px] font-black flex items-center gap-1 shadow-md hover:scale-102 transition-all"
                >
                  <Users className="size-3" />
                  <span>Group Slash (-15%)</span>
                </button>
              )}
            </div>

            {/* Item Summary */}
            <div className="flex gap-4 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 items-center shadow-inner">
              <img
                src={deal.imageUrl}
                alt={deal.title}
                className="size-20 rounded-2xl object-cover border border-slate-700 flex-shrink-0 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white truncate mb-1">
                  {deal.title}
                </h3>
                <p className="text-xs text-slate-400 mb-1 flex items-center gap-1 font-medium">
                  <MapPin className="size-3.5 text-emerald-400" />
                  {deal.storeName} ({deal.distanceKm} km away)
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-amber-400">
                    {formatCurrency(deal.currentPricePkr)}
                  </span>
                  <span className="text-xs line-through text-slate-500 font-medium">
                    {formatCurrency(deal.originalPricePkr)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                    {deal.discountPercent}% OFF
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs font-semibold text-slate-300">Quantity (Max {deal.stockQuantity}):</span>
              <div className="flex items-center gap-3">
                <button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="size-8 rounded-lg bg-slate-800 text-slate-200 font-bold border border-slate-700 disabled:opacity-40 hover:bg-slate-700"
                >
                  -
                </button>
                <span className="font-black text-white text-sm w-4 text-center">{quantity}</span>
                <button
                  disabled={quantity >= deal.stockQuantity}
                  onClick={() => setQuantity((q) => Math.min(deal.stockQuantity, q + 1))}
                  className="size-8 rounded-lg bg-slate-800 text-slate-200 font-bold border border-slate-700 disabled:opacity-40 hover:bg-slate-700"
                >
                  +
                </button>
              </div>
            </div>

            {/* Fulfillment Type Selector (Self-Pickup vs Bykea Rider Delivery) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Bike className="size-3.5 text-amber-400" />
                Fulfillment Mode:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('self-pickup')}
                  className={`p-3 rounded-2xl border text-center font-bold transition-all ${
                    fulfillmentType === 'self-pickup'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 ring-2 ring-emerald-400/30 shadow-md'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  🚶 Self-Pickup (Free)
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillmentType('bykea-delivery')}
                  className={`p-3 rounded-2xl border text-center font-bold transition-all ${
                    fulfillmentType === 'bykea-delivery'
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 border-amber-300 ring-2 ring-amber-300/30 shadow-md'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  🏍️ Bykea Express (+ ₨ 150)
                </button>
              </div>
            </div>

            {/* Rescue Wallet Balance Deduction Toggle */}
            {userWalletBalancePkr > 0 && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-700/80 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-sm">
                    🪙
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Use Rescue Cashback Wallet</span>
                    <span className="text-[10px] text-amber-300 font-medium">Balance: {formatCurrency(userWalletBalancePkr)} available</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setUseWalletBalance(!useWalletBalance)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    useWalletBalance
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {useWalletBalance ? '✓ Applied' : 'Apply'}
                </button>
              </div>
            )}

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Wallet className="size-3.5 text-amber-400" />
                Select Payment Method:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('JazzCash')}
                  className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold ${
                    paymentMethod === 'JazzCash'
                      ? 'bg-red-600 text-white border-red-400 ring-2 ring-red-400/30 shadow-md'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  🔴 JazzCash
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('EasyPaisa')}
                  className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold ${
                    paymentMethod === 'EasyPaisa'
                      ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/30 shadow-md'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  🟢 EasyPaisa
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Pickup')}
                  className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold ${
                    paymentMethod === 'Cash on Pickup'
                      ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-300/30 shadow-md'
                      : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  💵 Cash
                </button>
              </div>
            </div>

            {/* Order Summary Breakdown */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs shadow-inner">
              <div>
                <span className="text-amber-400 font-bold block">Savings: {formatCurrency(totalSavingsPkr)}</span>
                <span className="text-emerald-400 text-[10px] block font-medium">Includes 5% Instant PKR Rescue Cashback!</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Total Payable</span>
                <span className="text-xl font-black text-amber-400">{formatCurrency(totalPricePkr)}</span>
              </div>
            </div>

            {/* Confirm Reservation Action */}
            <button
              disabled={isSubmitting}
              onClick={handleConfirm}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400 hover:from-emerald-400 hover:to-amber-300 disabled:opacity-50 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-98 hover:scale-101"
            >
              <Sparkles className="size-5 text-slate-950" />
              <span>{isSubmitting ? 'Reserving...' : `Reserve with ${paymentMethod}`}</span>
            </button>

          </div>
        ) : (

          /* Reserved Confirmation View (Pickup Code & Bykea Rider Tracking) */
          <div className="flex flex-col items-center text-center gap-4 py-2 animate-in zoom-in-95 duration-300">
            
            <div className="size-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/40">
              <CheckCircle2 className="size-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-1">Deal Locked Successfully!</h2>
              <p className="text-xs text-emerald-300/80">
                {confirmedReservation?.fulfillmentType === 'bykea-delivery'
                  ? 'Bykea Express Rider assigned and en route to store!'
                  : 'Show your pickup code at store counter within 15 minutes.'}
              </p>
            </div>

            {/* Bykea Rider Live Tracking Trigger Box */}
            {confirmedReservation?.fulfillmentType === 'bykea-delivery' && (
              <div
                onClick={() => {
                  if (confirmedReservation && onOpenBykeaTracker) {
                    onOpenBykeaTracker(confirmedReservation);
                  }
                }}
                className="w-full p-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-left flex items-center justify-between gap-3 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Bike className="size-6 animate-bounce" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                      Bykea Express Rider Assigned
                    </span>
                    <p className="text-xs font-bold text-white">
                      {confirmedReservation.bykeaRiderName}
                    </p>
                    <p className="text-[11px] text-emerald-300/80">
                      ETA: <strong>12 mins</strong> • Click to View Live GPS Route
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs">
                  Track Live 📍
                </span>
              </div>
            )}


            {/* Pickup Code Voucher Card */}
            <div className="w-full p-4 rounded-2xl bg-white text-slate-950 border border-emerald-500/50 flex flex-col items-center gap-2 shadow-2xl">
              <div className="p-3 bg-slate-950 text-emerald-400 rounded-xl">
                <QrCode className="size-24" />
              </div>
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Pickup Pass Code
              </span>
              <span className="font-mono text-2xl font-black tracking-widest text-emerald-900 bg-emerald-100 px-4 py-1 rounded-lg border border-emerald-300">
                {confirmedReservation?.pickupCode}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Payment: {confirmedReservation?.paymentMethod} ({confirmedReservation?.paymentStatus})
              </span>
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  onClose();
                  if (confirmedReservation) onOpenWhatsApp(confirmedReservation);
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>💬 WhatsApp Voucher</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
