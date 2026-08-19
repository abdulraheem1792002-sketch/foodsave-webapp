import React from 'react';
import type { DonationRecord } from '../../types';
import { X, Award, Download, CheckCircle2, QrCode } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';


interface CsrCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: DonationRecord | null;
}

export const CsrCertificateModal: React.FC<CsrCertificateModalProps> = ({
  isOpen,
  onClose,
  donation,
}) => {
  if (!isOpen || !donation) return null;

  const handlePrintOrDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl glass-panel border border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden bg-[#07170f]">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Certificate Printable Canvas */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white text-slate-950 border-4 border-amber-400/80 shadow-2xl relative flex flex-col items-center text-center">
          
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
            <span>🇵🇰</span> FlashFruit Zero-Waste Alliance
          </div>

          <div className="absolute top-4 right-4 text-[10px] font-mono font-bold text-slate-500">
            {donation.certificateNumber}
          </div>

          <div className="size-16 rounded-full bg-amber-100 text-amber-600 border-2 border-amber-400 flex items-center justify-center my-4 shadow-md">
            <Award className="size-9" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-emerald-950 mb-1">
            Certificate of Food Rescue &amp; CSR Impact
          </h2>
          <p className="text-xs text-slate-600 mb-6 uppercase tracking-wider font-semibold">
            Official Green Tax Relief &amp; Waste Diversion Voucher
          </p>

          <div className="w-full border-t border-b border-slate-200 py-4 mb-6 text-xs text-slate-700 leading-relaxed text-left flex flex-col gap-2">
            <p>
              This certifies that <strong>{donation.storeName}</strong> has diverted <strong>{donation.quantity} surplus food items</strong> ({donation.itemTitle}) valued at <strong>{formatCurrency(donation.estimatedValuePkr)}</strong> to registered charity partner <strong>{donation.charityName}</strong>.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[10px] text-emerald-800 block font-bold">Meals Served</span>
                <span className="font-black text-sm text-emerald-950">{donation.mealsServed} Meals</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[10px] text-emerald-800 block font-bold">CO₂ Avoided</span>
                <span className="font-black text-sm text-emerald-950">{donation.co2SavedKg} kg</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[10px] text-emerald-800 block font-bold">Tax Code</span>
                <span className="font-black text-sm text-emerald-950">FBR Sec 61</span>
              </div>
            </div>
          </div>

          <div className="w-full flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-left">
              <QrCode className="size-12 text-slate-800" />
              <div>
                <span className="text-[10px] font-mono block text-slate-500">Scan to Verify</span>
                <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> FBR Compliant
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="border-b border-slate-400 w-32 mb-1" />
              <span className="text-[10px] font-bold text-slate-600 block">Authorized Signature</span>
              <span className="text-[9px] text-slate-400">{new Date(donation.dispatchedAt).toLocaleDateString()}</span>
            </div>
          </div>

        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handlePrintOrDownload}
            className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all"
          >
            <Download className="size-4" />
            <span>Download &amp; Print CSR Certificate (PDF)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
