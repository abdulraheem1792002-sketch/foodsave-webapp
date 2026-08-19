import React, { useState } from 'react';
import type { DealItem } from '../../types';
import { X, Users, Sparkles, Send, Copy, Check } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { sounds } from '../../lib/soundEffects';

interface GroupSlashModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: DealItem | null;
  onApplySlashDiscount: (dealId: string, slashPercent: number) => void;
}

export const GroupSlashModal: React.FC<GroupSlashModalProps> = ({
  isOpen,
  onClose,
  deal,
  onApplySlashDiscount,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSlashClaimed, setIsSlashClaimed] = useState(false);

  if (!isOpen || !deal) return null;

  const slashedPrice = Math.round(deal.currentPricePkr * 0.85); // extra 15% off
  const savingsExtra = deal.currentPricePkr - slashedPrice;

  const shareText = `🇵🇰 *FLASHFRUIT PAKISTAN GROUP RESCUE SLASH* ⚡\n\nHey! Help me slash the price on *${deal.title}* at *${deal.storeName}* (${deal.location.city})!\n\n💰 *Standard Price:* ${formatCurrency(deal.currentPricePkr)}\n🔥 *Slashed Price for Both of Us:* ${formatCurrency(slashedPrice)} (Extra 15% OFF!)\n\nClick link to join my rescue team within 15 mins: https://flashfruit.pk/slash/${deal.id}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateClaim = () => {
    sounds.playSuccessFanfare();
    setIsSlashClaimed(true);
    onApplySlashDiscount(deal.id, 15);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel border border-amber-500/50 rounded-3xl p-6 shadow-2xl overflow-hidden text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="size-14 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/30">
          <Users className="size-7" />
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Sparkles className="size-4 text-amber-400" />
          <h3 className="text-lg font-black text-white">Group-Rescue Price Slash</h3>
        </div>
        <p className="text-xs text-emerald-200/70 max-w-xs mx-auto mb-4">
          Invite 1 friend on WhatsApp. When they join, both of you unlock an <strong>extra 15% OFF</strong> this surplus deal!
        </p>

        {/* Price Comparison Card */}
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700/80 flex items-center justify-between mb-4">
          <div className="text-left">
            <span className="text-[10px] text-emerald-400/80 block uppercase font-bold">Standard Deal</span>
            <span className="text-sm font-semibold text-emerald-300/80 line-through">
              {formatCurrency(deal.currentPricePkr)}
            </span>
          </div>

          <div className="text-center font-bold text-amber-400 text-xs px-2 py-1 bg-amber-500/10 rounded-xl border border-amber-500/30">
            -15% Group Bonus
          </div>

          <div className="text-right">
            <span className="text-[10px] text-amber-300 block uppercase font-bold">Group Slashed</span>
            <span className="text-xl font-black text-amber-300">
              {formatCurrency(slashedPrice)}
            </span>
          </div>
        </div>

        {isSlashClaimed ? (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold animate-bounce">
            🎉 Group Slash Applied! You save an extra {formatCurrency(savingsExtra)}!
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSimulateClaim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-transform transform active:scale-95"
            >
              <Send className="size-4" />
              <span>Share to WhatsApp &amp; Unlock 15% OFF</span>
            </a>

            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Invitation Link'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
