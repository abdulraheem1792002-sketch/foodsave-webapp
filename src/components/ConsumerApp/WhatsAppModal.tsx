import React, { useState } from 'react';
import type { Reservation } from '../../types';
import { X, Copy, Check, Send } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';


interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  reservation,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !reservation) return null;

  const messageText = `⚡ *FLASHFRUIT PAKISTAN PICKUP PASS* ⚡\n\n📌 *Pickup Code:* ${reservation.pickupCode}\n🛍️ *Item:* ${reservation.item.title} (Qty: ${reservation.quantity})\n🏪 *Store:* ${reservation.item.storeName}\n📍 *Address:* ${reservation.item.location.address}, ${reservation.item.location.city}\n💰 *Total Paid:* ${formatCurrency(reservation.totalPricePkr)} via ${reservation.paymentMethod}\n⏱️ *Pickup Deadline:* ${reservation.item.pickupDeadline}\n\n*Show this pass at checkout counter!*`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(messageText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel border border-emerald-500/50 rounded-3xl p-6 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="size-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xl">
            💬
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Instant WhatsApp Pass Dispatch</h3>
            <p className="text-xs text-emerald-300/70">Send pickup voucher directly to WhatsApp</p>
          </div>
        </div>

        {/* Formatted Message Preview Box */}
        <div className="p-4 rounded-2xl bg-[#07130c] border border-emerald-800/80 text-xs font-mono text-emerald-200 leading-relaxed mb-4 whitespace-pre-wrap shadow-inner max-h-56 overflow-y-auto">
          {messageText}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all"
          >
            <Send className="size-4" />
            <span>Open WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
