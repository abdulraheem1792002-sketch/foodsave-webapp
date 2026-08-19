import React, { useState } from 'react';
import { Calculator, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';


export const ImpactCalculator: React.FC = () => {
  const [weeklySpendPkr, setWeeklySpendPkr] = useState<number>(8000);

  // Assumptions based on buying 40% of groceries/dining surplus at ~60% discount
  const monthlySavingsPkr = Math.round(weeklySpendPkr * 4 * 0.35);
  const annualSavingsPkr = monthlySavingsPkr * 12;
  const foodSavedKg = Math.round((weeklySpendPkr / 500) * 4 * 1.5);
  const co2AvoidedKg = Math.round(foodSavedKg * 2.5);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-emerald-800/40 bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-slate-950 flex flex-col gap-5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/50 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calculator className="size-5 text-amber-400" />
            <span>Interactive Household Savings &amp; Impact Calculator</span>
          </h3>
          <p className="text-xs text-emerald-300/70">
            Estimate how much money you save &amp; food waste you prevent by rescuing surplus meals on FlashFruit.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 self-start sm:self-auto">
          <Sparkles className="size-3.5" /> 60% Avg Surplus Discount
        </span>
      </div>

      {/* Slider Input */}
      <div>
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-emerald-300/80 font-medium">Weekly Household Grocery &amp; Food Spend:</span>
          <span className="font-black text-amber-300 text-sm">{formatCurrency(weeklySpendPkr)} / week</span>
        </div>
        <input
          type="range"
          min="2000"
          max="30000"
          step="1000"
          value={weeklySpendPkr}
          onChange={(e) => setWeeklySpendPkr(Number(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-emerald-400/60 font-mono mt-1">
          <span>₨ 2,000/wk</span>
          <span>₨ 15,000/wk</span>
          <span>₨ 30,000/wk</span>
        </div>
      </div>

      {/* Results Output Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-amber-500/40">
          <span className="text-[10px] font-bold text-amber-300/80 uppercase block mb-1">Monthly PKR Saved</span>
          <span className="text-xl font-black text-amber-300">{formatCurrency(monthlySavingsPkr)}</span>
          <span className="text-[10px] text-emerald-300/70 block mt-0.5">35% Net Grocery Reduction</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40">
          <span className="text-[10px] font-bold text-emerald-300/80 uppercase block mb-1">Annual PKR Saved</span>
          <span className="text-xl font-black text-emerald-200">{formatCurrency(annualSavingsPkr)}</span>
          <span className="text-[10px] text-emerald-300/70 block mt-0.5">Per Year Household Surplus</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-teal-500/40">
          <span className="text-[10px] font-bold text-teal-300/80 uppercase block mb-1">Edible Food Rescued</span>
          <span className="text-xl font-black text-white">{foodSavedKg} kg</span>
          <span className="text-[10px] text-teal-300/70 block mt-0.5">Monthly Landfill Prevention</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-purple-500/40">
          <span className="text-[10px] font-bold text-purple-300/80 uppercase block mb-1">CO₂ Emissions Avoided</span>
          <span className="text-xl font-black text-purple-300">{co2AvoidedKg} kg</span>
          <span className="text-[10px] text-purple-300/70 block mt-0.5">Clean Environmental Impact</span>
        </div>
      </div>

    </div>
  );
};
