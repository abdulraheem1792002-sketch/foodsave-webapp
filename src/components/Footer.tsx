import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../lib/utils';


interface FooterProps {
  totalSavedPkr: number;
  itemsRescuedCount: number;
}

export const Footer: React.FC<FooterProps> = ({ totalSavedPkr, itemsRescuedCount }) => {
  return (
    <footer className="border-t border-emerald-900/60 bg-[#060e0a] text-emerald-300/80 pt-12 pb-8 px-4 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Startup Impact & Business Model Banner */}
        <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-emerald-800/40 bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-slate-950 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <h3 className="text-lg font-bold text-white">FlashFruit Pakistan (MERN)</h3>
            </div>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              Matching surplus retail food from Pakistani supermarkets, bakeries, and restaurants with nearby deal-seeking consumers using rule-based time-decay pricing.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 text-xs">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              💳 Payments &amp; Checkout:
            </h4>
            <ul className="space-y-1 text-emerald-300/80">
              <li>• <strong>JazzCash</strong> &amp; <strong>EasyPaisa</strong> Sandbox Integration.</li>
              <li>• Cash on Pickup fallback option.</li>
              <li>• Auto-expiring 15-minute pickup hold codes.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 text-xs">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="size-4" /> Operational Impact:
            </h4>
            <ul className="space-y-1 text-emerald-300/80">
              <li>• <strong>{formatCurrency(totalSavedPkr)}</strong> Saved by Pakistani consumers.</li>
              <li>• <strong>{itemsRescuedCount} items</strong> rescued from daily retail waste.</li>
              <li>• Verified Store Badges &amp; Rule-Based Time Decay.</li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/60 border-t border-emerald-900/40 pt-6">
          <div className="flex items-center gap-2">
            <span>Built for FlashFruit MVP (MERN Stack) • Node.js + Express + MongoDB</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-emerald-200 cursor-pointer">Lahore</span>
            <span className="hover:text-emerald-200 cursor-pointer">Karachi</span>
            <span className="hover:text-emerald-200 cursor-pointer">Islamabad</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
