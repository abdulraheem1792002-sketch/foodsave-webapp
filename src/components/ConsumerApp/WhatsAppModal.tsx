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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel border border-slate-700/80 rounded-3xl p-6 shadow-2xl bg-slate-950/95">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="size-10 rounded-2xl bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 flex items-center justify-center font-bold text-xl">
            💬
          </div>
          <div>
            <h3 className="text-base font-black text-white tracking-tight">Instant WhatsApp Pass Dispatch</h3>
            <p className="text-xs text-slate-400 font-medium">Send pickup voucher directly to WhatsApp</p>
          </div>
        </div>

        {/* Formatted Message Preview Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-emerald-300 leading-relaxed mb-4 whitespace-pre-wrap shadow-inner max-h-56 overflow-y-auto">
          {messageText}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all"
          >
            <Send className="size-4" />
            <span>Open WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};

