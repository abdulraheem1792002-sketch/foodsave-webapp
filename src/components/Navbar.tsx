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
    <header className="sticky top-0 z-50 glass-panel border-b border-emerald-900/40 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand Logo & Pakistan Market Tagline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('consumer')}>
            <div className="size-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-300/30">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent">
                  FlashFruit
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full flex items-center gap-1">
                  <span>🇵🇰</span> MERN Stack
                </span>
              </div>
              <p className="text-xs text-emerald-200/60 hidden sm:block">
                Matching surplus retail food with nearby buyers in real time
              </p>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-bold font-mono">
              🪙 ₨ {rescueWalletBalancePkr}
            </span>
            <button
              onClick={onOpenReservations}
              className="relative p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/50 transition-colors"
            >
              <ShoppingBag className="size-5" />
              {reservationCount > 0 && (
                <span className="absolute -top-1 -right-1 size-5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center animate-bounce">
                  {reservationCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pakistan City Switcher Bar */}
        <div className="flex items-center gap-1 bg-emerald-950/80 p-1 rounded-2xl border border-emerald-800/60 text-xs">
          <span className="text-emerald-400/80 px-2 flex items-center gap-1 font-semibold text-[11px]">
            <MapPin className="size-3 text-amber-400" /> City:
          </span>
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                selectedCity === c
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-emerald-300/70 hover:text-white hover:bg-emerald-900/50'
              }`}
            >
              {c.replace(' Pakistan', '')}
            </button>
          ))}
        </div>

        {/* Impact Bar (Total Saved PKR & Wallet Balance) */}
        <div className="hidden xl:flex items-center gap-4 px-4 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-xs">
          <div className="flex items-center gap-2">
            <Leaf className="size-4 text-emerald-400" />
            <span className="text-emerald-300/70">Rescued:</span>
            <span className="font-bold text-emerald-200">{itemsRescuedCount} items</span>
          </div>
          <div className="h-4 w-px bg-emerald-800/50" />
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">₨</span>
            <span className="text-emerald-300/70">Total Saved:</span>
            <span className="font-bold text-amber-300">{formatCurrency(totalSavedPkr)}</span>
          </div>
          <div className="h-4 w-px bg-emerald-800/50" />
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-300 font-bold">
            <span>🪙 Wallet:</span>
            <span>₨ {rescueWalletBalancePkr}</span>
          </div>
        </div>


        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-emerald-950/80 p-1 rounded-2xl border border-emerald-800/50 self-center md:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('consumer')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap",
              activeTab === 'consumer'
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/50 font-semibold"
                : "text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-900/40"
            )}
          >
            <ShoppingBag className="size-4" />
            <span>Consumer App</span>
          </button>

          <button
            onClick={() => setActiveTab('retailer')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap",
              activeTab === 'retailer'
                ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-900/50 font-semibold"
                : "text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-900/40"
            )}
          >
            <Store className="size-4" />
            <span>Retailer POS</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-simulator')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap",
              activeTab === 'ai-simulator'
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/50 font-semibold"
                : "text-purple-300/70 hover:text-purple-200 hover:bg-purple-950/40"
            )}
          >
            <Cpu className="size-4 text-purple-300" />
            <span>AI Simulator</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-400/20 text-purple-300 border border-purple-400/30">
              TFT
            </span>
          </button>

          {/* User Auth Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-700/50 text-emerald-200 text-xs sm:text-sm font-semibold transition-colors ml-1"
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
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-emerald-900/30 flex items-center gap-2 overflow-x-auto text-xs pb-0.5 scrollbar-none">
        <span className="text-[10px] uppercase font-bold text-amber-400/80 flex items-center gap-1 pl-1 flex-shrink-0">
          <span>✨ Patent Tech:</span>
        </span>

        {onOpenFlashChef && (
          <button
            onClick={onOpenFlashChef}
            className="px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition-all flex-shrink-0"
          >
            <span>👨‍🍳 FlashChef AI™</span>
          </button>
        )}

        {onOpenDutchAuction && (
          <button
            onClick={onOpenDutchAuction}
            className="px-2.5 py-1 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-[11px] font-bold flex items-center gap-1.5 transition-all flex-shrink-0 animate-pulse"
          >
            <span>⚡ Dutch Auction Live</span>
          </button>
        )}

        {onOpenCommuteMatcher && (
          <button
            onClick={onOpenCommuteMatcher}
            className="px-2.5 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 transition-all flex-shrink-0"
          >
            <span>🚗 0-Min Commute Matcher</span>
          </button>
        )}

        {onOpenColdLocker && (
          <button
            onClick={onOpenColdLocker}
            className="px-2.5 py-1 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 transition-all flex-shrink-0"
          >
            <span>🧊 24/7 Smart Cold Locker</span>
          </button>
        )}

        {onOpenCarbonLeague && (
          <button
            onClick={onOpenCarbonLeague}
            className="px-2.5 py-1 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 text-[11px] font-bold flex items-center gap-1.5 transition-all flex-shrink-0"
          >
            <span>🏆 Campus Carbon League</span>
          </button>
        )}
      </div>
    </header>
  );
};


