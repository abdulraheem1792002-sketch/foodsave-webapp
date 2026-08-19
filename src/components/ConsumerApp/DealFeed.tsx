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
      <div className="glass-panel p-4 lg:p-6 rounded-3xl border border-emerald-800/40 flex flex-col gap-4 shadow-xl">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-emerald-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search biryani, sourdough, chaunsa mangoes, Al-Fatah, Lahore, Karachi..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-100 placeholder-emerald-400/50 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          {/* Discount Slider Quick Filter */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-950/80 border border-emerald-800/50 text-xs">
            <Flame className="size-4 text-amber-400" />
            <span className="text-emerald-300 font-medium whitespace-nowrap">Min Discount:</span>
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
              <span className="font-bold text-amber-300 w-12">{minDiscount}%+</span>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-emerald-950/70 text-emerald-300/80 hover:text-white hover:bg-emerald-900/60 border border-emerald-800/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>


      </div>

      {/* Dynamic Deals Grid */}
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Live Surplus Flash Deals in Pakistan</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {filteredDeals.length} deals
          </span>
        </h2>

        <span className="text-xs text-emerald-300/60">
          Sorted by Time-Decay Discount & Proximity
        </span>
      </div>

      {filteredDeals.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-emerald-800/40">
          <div className="size-16 rounded-full bg-emerald-950 flex items-center justify-center mx-auto mb-3 text-2xl border border-emerald-800">
            🥭
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Surplus Deals Match Your Filters</h3>
          <p className="text-xs text-emerald-300/70 max-w-sm mx-auto mb-4">
            Try resetting your search query or lowering the minimum discount threshold.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setMinDiscount(30);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors"
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
