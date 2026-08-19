import React, { useState, useMemo } from 'react';
import type { DealItem, CategoryType } from '../../types';
import { DealCard } from './DealCard';
import { Search, Flame } from 'lucide-react';


interface DealFeedProps {
  deals: DealItem[];
  onReserveDeal: (deal: DealItem) => void;
  onSelectDeal: (deal: DealItem) => void;
}

const CATEGORIES: { key: CategoryType; label: string }[] = [
  { key: 'All', label: 'All Deals' },
  { key: 'mystery-bag', label: '🎁 Mystery Bags' },
  { key: 'grocery', label: 'Grocery' },
  { key: 'bakery', label: 'Bakery' },
  { key: 'restaurant', label: 'Restaurant' },
];

export const DealFeed: React.FC<DealFeedProps> = ({
  deals,
  onReserveDeal,
  onSelectDeal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [minDiscount, setMinDiscount] = useState<number>(30);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch =
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.location.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'All'
          ? true
          : selectedCategory === 'mystery-bag'
          ? !!deal.isMysteryBag
          : deal.category === selectedCategory;

      const matchesDiscount = deal.discountPercent >= minDiscount;

      return matchesSearch && matchesCategory && matchesDiscount;
    });
  }, [deals, searchTerm, selectedCategory, minDiscount]);


  return (
    <div className="flex flex-col gap-6">
      
      {/* Search & Filter Header Bar */}
      <div className="glass-panel p-4 lg:p-6 rounded-3xl border border-slate-800/80 flex flex-col gap-4 shadow-xl">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-emerald-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search biryani, artisan sourdough, chaunsa mangoes, Al-Fatah, Karachi, Lahore..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all"
            />
          </div>

          {/* Discount Slider Quick Filter */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs shadow-inner">
            <Flame className="size-4 text-amber-400 animate-pulse" />
            <span className="text-slate-300 font-semibold whitespace-nowrap">Min Discount:</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="30"
                max="80"
                step="5"
                value={minDiscount}
                onChange={(e) => setMinDiscount(Number(e.target.value))}
                className="w-24 accent-emerald-500 cursor-pointer"
              />
              <span className="font-bold text-amber-400 w-12">{minDiscount}%+</span>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-950/40 scale-102'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Dynamic Deals Grid */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-black text-white flex items-center gap-2 tracking-tight">
          <span>Live Surplus Flash Deals</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            {filteredDeals.length} active
          </span>
        </h2>

        <span className="text-xs text-slate-400 font-medium">
          Sorted by Time-Decay & Proximity
        </span>
      </div>

      {filteredDeals.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
          <div className="size-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto mb-3 text-2xl border border-slate-800">
            🥭
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Surplus Deals Match Your Filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try resetting your search query or lowering the minimum discount threshold.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setMinDiscount(30);
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-all shadow-md"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onReserve={onReserveDeal}
              onSelect={onSelectDeal}
            />
          ))}
        </div>
      )}

    </div>

  );
};
