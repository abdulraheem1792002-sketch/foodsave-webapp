import React from 'react';
import { ShoppingBag, Store, Leaf, User, LogIn, MapPin, Cpu } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import type { AuthUser, PakistanCity, AppTab } from '../types';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedCity: PakistanCity;
  setSelectedCity: (city: PakistanCity) => void;
  reservationCount: number;
  onOpenReservations: () => void;
  totalSavedPkr: number;
  itemsRescuedCount: number;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  rescueWalletBalancePkr?: number;
  onOpenFlashChef?: () => void;
  onOpenDutchAuction?: () => void;
  onOpenCommuteMatcher?: () => void;
  onOpenColdLocker?: () => void;
  onOpenCarbonLeague?: () => void;
}

const CITIES: PakistanCity[] = ['All Pakistan', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi'];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCity,
  setSelectedCity,
  reservationCount,
  onOpenReservations,
  totalSavedPkr,
  itemsRescuedCount,
  currentUser,
  onOpenAuth,
  rescueWalletBalancePkr = 650,
  onOpenFlashChef,
  onOpenDutchAuction,
  onOpenCommuteMatcher,
  onOpenColdLocker,
  onOpenCarbonLeague,
}) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/60 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand Logo & Pakistan Market Tagline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('consumer')}>
            <div className="size-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-300/40 group-hover:scale-105 transition-transform">
              <span className="text-2xl drop-shadow-md">⚡</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent">
                  FlashFruit
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <span>🇵🇰</span> Pakistan
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block font-medium">
                Rescuing surplus retail food with smart dynamic pricing
              </p>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono shadow-sm">
              🪙 ₨ {rescueWalletBalancePkr}
            </span>
            <button
              onClick={onOpenReservations}
              className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-emerald-300 hover:bg-slate-800 transition-colors shadow-md"
            >
              <ShoppingBag className="size-5" />
              {reservationCount > 0 && (
                <span className="absolute -top-1 -right-1 size-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center animate-bounce shadow-md">
                  {reservationCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pakistan City Switcher Bar */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs shadow-inner">
          <span className="text-slate-400 px-2 flex items-center gap-1 font-semibold text-[11px]">
            <MapPin className="size-3 text-emerald-400" /> City:
          </span>
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                selectedCity === c
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-900/40 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {c.replace(' Pakistan', '')}
            </button>
          ))}
        </div>

        {/* Impact Bar (Total Saved PKR & Wallet Balance) */}
        <div className="hidden xl:flex items-center gap-4 px-4 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <Leaf className="size-4 text-emerald-400" />
            <span className="text-slate-400">Rescued:</span>
            <span className="font-bold text-emerald-300">{itemsRescuedCount} items</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">₨</span>
            <span className="text-slate-400">Total Saved:</span>
            <span className="font-bold text-amber-300">{formatCurrency(totalSavedPkr)}</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold shadow-inner">
            <span>🪙 Wallet:</span>
            <span>₨ {rescueWalletBalancePkr}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 self-center md:self-auto overflow-x-auto shadow-inner">
          <button
            onClick={() => setActiveTab('consumer')}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap",
              activeTab === 'consumer'
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-950/50 scale-102"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            )}
          >
            <ShoppingBag className="size-4" />
            <span>Consumer App</span>
          </button>

          <button
            onClick={() => setActiveTab('retailer')}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap",
              activeTab === 'retailer'
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-950/50 scale-102"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            )}
          >
            <Store className="size-4" />
            <span>Retailer POS</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-simulator')}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap",
              activeTab === 'ai-simulator'
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-950/50 scale-102"
                : "text-purple-300/80 hover:text-purple-200 hover:bg-purple-950/40"
            )}
          >
            <Cpu className="size-4 text-purple-300" />
            <span>Dynamic Pricing</span>
            <span className="px-1.5 py-0.2 rounded-md text-[9px] bg-purple-400/20 text-purple-200 border border-purple-400/30 font-bold">
              AI
            </span>
          </button>

          {/* User Auth Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-all ml-1"
          >
            {currentUser ? (
              <>
                <User className="size-3.5 text-emerald-400" />
                <span className="truncate max-w-[70px]">{currentUser.name.split(' ')[0]}</span>
              </>
            ) : (
              <>
                <LogIn className="size-3.5 text-amber-400" />
                <span>Login</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Innovation Quick-Launch Strip */}
      <div className="max-w-7xl mx-auto mt-2.5 pt-2.5 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto text-xs pb-0.5 scrollbar-none">
        <span className="text-[10px] uppercase font-black text-amber-400 flex items-center gap-1 pl-1 flex-shrink-0 tracking-wider">
          <span>⚡ Smart Features:</span>
        </span>

        {onOpenFlashChef && (
          <button
            onClick={onOpenFlashChef}
            className="px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition-all hover:scale-105 flex-shrink-0 shadow-sm"
          >
            <span>👨‍🍳 FlashChef AI™</span>
          </button>
        )}

        {onOpenDutchAuction && (
          <button
            onClick={onOpenDutchAuction}
            className="px-3 py-1 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-[11px] font-bold flex items-center gap-1.5 transition-all hover:scale-105 flex-shrink-0 shadow-sm animate-pulse"
          >
            <span>⚡ Dutch Auction Live</span>
          </button>
        )}

        {onOpenCommuteMatcher && (
          <button
            onClick={onOpenCommuteMatcher}
            className="px-3 py-1 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-[11px] font-bold flex items-center gap-1.5 transition-all hover:scale-105 flex-shrink-0 shadow-sm"
          >
            <span>🚗 0-Min Commute Matcher</span>
          </button>
        )}

        {onOpenColdLocker && (
          <button
            onClick={onOpenColdLocker}
            className="px-3 py-1 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 transition-all hover:scale-105 flex-shrink-0 shadow-sm"
          >
            <span>🧊 24/7 Smart Cold Locker</span>
          </button>
        )}

        {onOpenCarbonLeague && (
          <button
            onClick={onOpenCarbonLeague}
            className="px-3 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 transition-all hover:scale-105 flex-shrink-0 shadow-sm"
          >
            <span>🏆 Campus Carbon League</span>
          </button>
        )}
      </div>
    </header>
  );
};
