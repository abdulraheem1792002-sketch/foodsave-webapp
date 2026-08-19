import React, { useState, useEffect, useMemo } from 'react';
import type { DealItem, Reservation, RetailerStore, AuthUser, PakistanCity, AppTab } from './types';
import { INITIAL_DEALS, INITIAL_STORES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { DealMap } from './components/ConsumerApp/DealMap';
import { DealFeed } from './components/ConsumerApp/DealFeed';
import { ReservationModal } from './components/ConsumerApp/ReservationModal';
import { ActivePassesDrawer } from './components/ConsumerApp/ActivePassesDrawer';
import { WhatsAppModal } from './components/ConsumerApp/WhatsAppModal';
import { RatingModal } from './components/ConsumerApp/RatingModal';
import { SpinWheelModal } from './components/ConsumerApp/SpinWheelModal';
import { StoreProfileModal } from './components/ConsumerApp/StoreProfileModal';
import { ImpactCalculator } from './components/ConsumerApp/ImpactCalculator';
import { BykeaTrackerModal } from './components/ConsumerApp/BykeaTrackerModal';
import { GroupSlashModal } from './components/ConsumerApp/GroupSlashModal';
import { SocialProofTicker } from './components/ConsumerApp/SocialProofTicker';
import { FlashChefAiModal } from './components/ConsumerApp/FlashChefAiModal';
import { DutchAuctionModal } from './components/ConsumerApp/DutchAuctionModal';
import { CommuteRouteMatcherModal } from './components/ConsumerApp/CommuteRouteMatcherModal';
import { SmartLockerModal } from './components/ConsumerApp/SmartLockerModal';
import { CarbonLeagueModal } from './components/ConsumerApp/CarbonLeagueModal';
import { RetailerDashboard } from './components/RetailerPOS/RetailerDashboard';
import { AiCoreSimulator } from './components/AiCoreSimulator/AiCoreSimulator';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { fetchDealsApi, fetchMyReservationsApi } from './services/api';
import { Bell, Gift, Sun, Moon } from 'lucide-react';

const STORAGE_KEYS = {
  RESERVATIONS: 'flashfruit_reservations_v1',
  USER: 'flashfruit_user_v1',
  THEME: 'flashfruit_theme_v1',
};

export function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('consumer');
  const [selectedCity, setSelectedCity] = useState<PakistanCity>('All Pakistan');
  
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'dark' | 'light') || 'dark';
  });

  const [deals, setDeals] = useState<DealItem[]>(INITIAL_DEALS);
  const [stores] = useState<RetailerStore[]>(INITIAL_STORES);
  const [selectedDeal, setSelectedDeal] = useState<DealItem | null>(null);
  const [reserveModalDeal, setReserveModalDeal] = useState<DealItem | null>(null);
  const [whatsAppReservation, setWhatsAppReservation] = useState<Reservation | null>(null);
  const [ratingDeal, setRatingDeal] = useState<DealItem | null>(null);
  const [selectedStoreProfile, setSelectedStoreProfile] = useState<RetailerStore | null>(null);
  const [isSpinModalOpen, setIsSpinModalOpen] = useState<boolean>(false);
  
  // Advanced Modals State
  const [trackedBykeaReservation, setTrackedBykeaReservation] = useState<Reservation | null>(null);
  const [groupSlashDeal, setGroupSlashDeal] = useState<DealItem | null>(null);
  const [isFlashChefOpen, setIsFlashChefOpen] = useState<boolean>(false);
  const [isDutchAuctionOpen, setIsDutchAuctionOpen] = useState<boolean>(false);
  const [isCommuteMatcherOpen, setIsCommuteMatcherOpen] = useState<boolean>(false);
  const [isColdLockerOpen, setIsColdLockerOpen] = useState<boolean>(false);
  const [isCarbonLeagueOpen, setIsCarbonLeagueOpen] = useState<boolean>(false);

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isPassesDrawerOpen, setIsPassesDrawerOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });


  // Save to localStorage when state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    } catch (e) {
      console.warn('LocalStorage reservations error', e);
    }
  }, [reservations]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      }
    } catch (e) {
      console.warn('LocalStorage user error', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, themeMode);
    } catch (e) {
      console.warn('LocalStorage theme error', e);
    }
  }, [themeMode]);

  // Fetch initial deals & backend reservations from Express REST API
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [apiDeals, apiReservations] = await Promise.all([
          fetchDealsApi(),
          fetchMyReservationsApi(),
        ]);

        if (apiDeals && apiDeals.length > 0) {
          setDeals(apiDeals);
        }

        if (apiReservations && apiReservations.length > 0) {
          setReservations((prev) => {
            const combined = [...prev];
            apiReservations.forEach((ar) => {
              if (!combined.some((p) => p.id === ar.id || p.pickupCode === ar.pickupCode)) {
                combined.push(ar);
              }
            });
            return combined;
          });
        }
      } catch (err) {
        console.warn('Using seed data fallback:', err);
      }
    }
    loadInitialData();
  }, []);

  // Filter Deals by Selected City
  const filteredDealsByCity = useMemo(() => {
    if (selectedCity === 'All Pakistan') return deals;
    return deals.filter(
      (d) => d.location.city.toLowerCase() === selectedCity.toLowerCase()
    );
  }, [deals, selectedCity]);

  // Global PKR Impact Stats
  const totalSavedPkr = (currentUser?.totalSavedPkr || 0) + reservations.reduce((sum, r) => sum + r.savedPkr, 0);
  const itemsRescuedCount = (currentUser?.itemsRescuedCount || 0) + reservations.reduce((sum, r) => sum + r.quantity, 0);
  const rescueWalletBalancePkr = currentUser?.rescueWalletBalancePkr ?? 0;


  const handleAddItem = (partialItem: Partial<DealItem>) => {
    const newItem: DealItem = {
      id: `dl-${Date.now()}`,
      storeId: 'ret-1',
      storeName: 'Al-Fatah Gourmet Supermarket',
      storeType: 'grocery',
      storeRating: 4.9,
      title: partialItem.title || 'Surplus Item',
      category: partialItem.category || 'grocery',
      originalPricePkr: partialItem.originalPricePkr || 1200,
      currentPricePkr: partialItem.currentPricePkr || 480,
      discountPercent: partialItem.discountPercent || 60,
      expiryHoursLeft: partialItem.expiryHoursLeft || 2,
      stockQuantity: partialItem.stockQuantity || 5,
      pickupDeadline: `Pick up within ${partialItem.expiryHoursLeft || 2} hrs`,
      distanceKm: 0.5,
      imageUrl: partialItem.imageUrl || 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
      isVerified: true,
      location: { x: 50, y: 50, address: 'Main Boulevard, Gulberg III', city: selectedCity === 'All Pakistan' ? 'Lahore' : selectedCity },
      decaySchedule: partialItem.decaySchedule || [],
      hoursRemaining: partialItem.expiryHoursLeft || 2,
    };

    setDeals((prev) => [newItem, ...prev]);
  };

  const handleRemoveItem = (id: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  const handleConfirmReservation = (res: Reservation) => {
    setReservations((prev) => [res, ...prev]);
    setDeals((prev) =>
      prev.map((d) =>
        d.id === res.item.id
          ? { ...d, stockQuantity: Math.max(0, d.stockQuantity - res.quantity) }
          : d
      )
    );

    // Award 5% Instant PKR Rescue Cashback to user's wallet
    const cashbackEarned = Math.round(res.totalPricePkr * 0.05);
    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            rescueWalletBalancePkr: (prev.rescueWalletBalancePkr || 650) + cashbackEarned,
          }
        : null
    );
  };

  const handleCollectReservation = (reservationId: string) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId || r.pickupCode === reservationId
          ? { ...r, status: 'collected', paymentStatus: 'paid' }
          : r
      )
    );
  };

  const handleAddReview = (dealId: string, rating: number) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId ? { ...d, storeRating: Math.round(((d.storeRating + rating) / 2) * 10) / 10 } : d
      )
    );
  };

  const handleUpdateDealPrice = (dealId: string, newPricePkr: number) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id === dealId) {
          const discountPercent = Math.round(((d.originalPricePkr - newPricePkr) / d.originalPricePkr) * 100);
          return { ...d, currentPricePkr: newPricePkr, discountPercent: Math.max(0, discountPercent) };
        }
        return d;
      })
    );
  };

  const handleApplySlashDiscount = (dealId: string, slashPercent: number) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id === dealId) {
          const newPrice = Math.round(d.currentPricePkr * (1 - slashPercent / 100));
          const discountPercent = Math.round(((d.originalPricePkr - newPrice) / d.originalPricePkr) * 100);
          return { ...d, currentPricePkr: newPrice, discountPercent };
        }
        return d;
      })
    );
  };

  const storeDealsForModal = useMemo(() => {
    if (!selectedStoreProfile) return [];
    return deals.filter((d) => d.storeName === selectedStoreProfile.name);
  }, [deals, selectedStoreProfile]);

  return (
    <div className={`min-h-screen ${themeMode === 'dark' ? 'bg-[#0b1510] text-[#e2f1e8]' : 'bg-slate-50 text-slate-900'} flex flex-col font-sans transition-colors duration-300`}>
      
      {/* Top Push Alert Simulator Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 text-slate-950 py-1.5 px-4 text-center text-xs font-bold flex items-center justify-between shadow-md">
        <div className="flex items-center justify-center gap-2 mx-auto">
          <Bell className="size-3.5 animate-bounce" />
          <span>🚨 Flash Alert: Tehzeeb Bakery dropped Sourdough Bread to 70% OFF in Blue Area, Islamabad!</span>
        </div>

        {/* Theme Switcher Toggle */}
        <button
          onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
          className="px-2.5 py-0.5 rounded-full bg-slate-950/80 text-amber-300 border border-amber-400 text-[10px] font-bold flex items-center gap-1 hover:bg-slate-900"
        >
          {themeMode === 'dark' ? <Sun className="size-3 text-amber-400" /> : <Moon className="size-3 text-slate-200" />}
          <span>{themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        reservationCount={reservations.length}
        onOpenReservations={() => setIsPassesDrawerOpen(true)}
        totalSavedPkr={totalSavedPkr}
        itemsRescuedCount={itemsRescuedCount}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        rescueWalletBalancePkr={rescueWalletBalancePkr}
        onOpenFlashChef={() => setIsFlashChefOpen(true)}
        onOpenDutchAuction={() => setIsDutchAuctionOpen(true)}
        onOpenCommuteMatcher={() => setIsCommuteMatcherOpen(true)}
        onOpenColdLocker={() => setIsColdLockerOpen(true)}
        onOpenCarbonLeague={() => setIsCarbonLeagueOpen(true)}
      />


      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pt-6 pb-12">
        {activeTab === 'consumer' ? (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            
            {/* Consumer Hero Banner with Gamified Spin-to-Save Button */}
            <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-emerald-800/40 bg-gradient-to-r from-emerald-950/90 via-teal-950/70 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1.5 mb-3">
                  <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                  🇵🇰 Live Surplus Deals &amp; Mystery Bags in {selectedCity}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                  Save Delicious Retail Food at <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">Up to 85% OFF</span>
                </h1>
                <p className="text-xs sm:text-sm text-emerald-200/70 leading-relaxed">
                  Pakistani grocery stores, bakeries, and restaurants list surplus items with rule-based time-decay pricing. Pay via <strong>JazzCash, EasyPaisa, Cash on Pickup, or Rescue Wallet</strong> with 15-minute pickup hold codes or <strong>Bykea Express Delivery</strong>!
                </p>
              </div>

              <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2 text-right">
                <button
                  onClick={() => setIsSpinModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 transition-all transform active:scale-95 animate-pulse"
                >
                  <Gift className="size-4" />
                  <span>Spin-to-Save Wheel 🎰</span>
                </button>

                <button
                  onClick={() => setIsPassesDrawerOpen(true)}
                  className="px-4 py-2 rounded-2xl bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-700 font-bold text-xs shadow transition-all"
                >
                  <span>My Reservations ({reservations.length})</span>
                </button>
              </div>
            </div>

            {/* Pakistan Geolocation Map View */}
            <DealMap
              deals={filteredDealsByCity}
              selectedDeal={selectedDeal}
              onSelectDeal={(deal) => setSelectedDeal(deal)}
              onReserveDeal={(deal) => setReserveModalDeal(deal)}
            />

            {/* Filterable Deal Feed Grid */}
            <DealFeed
              deals={filteredDealsByCity}
              onReserveDeal={(deal) => setReserveModalDeal(deal)}
              onSelectDeal={(deal) => {
                const store = stores.find((s) => s.name === deal.storeName) || stores[0];
                setSelectedStoreProfile(store);
              }}
            />

            {/* Interactive Household Savings & Impact Calculator */}
            <ImpactCalculator />
          </div>
        ) : activeTab === 'retailer' ? (
          <div className="animate-in fade-in duration-300">
            <RetailerDashboard
              stores={stores}
              deals={deals}
              reservations={reservations}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onUpdateDealPrice={handleUpdateDealPrice}
              onCollectReservation={handleCollectReservation}
            />
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <AiCoreSimulator />
          </div>
        )}
      </main>

      {/* Reservation Checkout Modal */}
      <ReservationModal
        deal={reserveModalDeal}
        onClose={() => setReserveModalDeal(null)}
        onConfirmReservation={handleConfirmReservation}
        onOpenWhatsApp={(res) => setWhatsAppReservation(res)}
        userWalletBalancePkr={rescueWalletBalancePkr}
        onOpenGroupSlash={(deal) => setGroupSlashDeal(deal)}
        onOpenBykeaTracker={(res) => setTrackedBykeaReservation(res)}
      />

      {/* Active Pickup Passes Drawer */}
      <ActivePassesDrawer
        isOpen={isPassesDrawerOpen}
        onClose={() => setIsPassesDrawerOpen(false)}
        reservations={reservations}
        onOpenBykeaTracker={(res) => setTrackedBykeaReservation(res)}
      />

      {/* Live Bykea Rider Animated GPS Tracker Modal */}
      <BykeaTrackerModal
        isOpen={!!trackedBykeaReservation}
        onClose={() => setTrackedBykeaReservation(null)}
        reservation={trackedBykeaReservation}
      />

      {/* WhatsApp Group-Slash Modal */}
      <GroupSlashModal
        isOpen={!!groupSlashDeal}
        onClose={() => setGroupSlashDeal(null)}
        deal={groupSlashDeal}
        onApplySlashDiscount={handleApplySlashDiscount}
      />

      {/* WhatsApp Pass Dispatch Modal */}
      <WhatsAppModal
        isOpen={!!whatsAppReservation}
        onClose={() => setWhatsAppReservation(null)}
        reservation={whatsAppReservation}
      />

      {/* Rating & Review Modal */}
      <RatingModal
        isOpen={!!ratingDeal}
        onClose={() => setRatingDeal(null)}
        deal={ratingDeal}
        onAddReview={handleAddReview}
      />

      {/* Spin-to-Save Wheel Modal */}
      <SpinWheelModal
        isOpen={isSpinModalOpen}
        onClose={() => setIsSpinModalOpen(false)}
      />

      {/* Store Profile Modal */}
      <StoreProfileModal
        isOpen={!!selectedStoreProfile}
        onClose={() => setSelectedStoreProfile(null)}
        store={selectedStoreProfile}
        storeDeals={storeDealsForModal}
        onReserveDeal={(deal) => setReserveModalDeal(deal)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

      {/* FlashChef AI Conversational Recipe Engine Modal */}
      <FlashChefAiModal
        isOpen={isFlashChefOpen}
        onClose={() => setIsFlashChefOpen(false)}
        selectedDeal={reserveModalDeal}
      />

      {/* Perishable Live Dutch Auction Modal */}
      <DutchAuctionModal
        isOpen={isDutchAuctionOpen}
        onClose={() => setIsDutchAuctionOpen(false)}
        onConfirmReservation={handleConfirmReservation}
      />

      {/* Zero-Detour Smart Commute Route Matcher Modal */}
      <CommuteRouteMatcherModal
        isOpen={isCommuteMatcherOpen}
        onClose={() => setIsCommuteMatcherOpen(false)}
        deals={deals}
        onReserveDeal={(deal) => setReserveModalDeal(deal)}
      />

      {/* 24/7 Smart Refrigerated Cold-Locker Network Modal */}
      <SmartLockerModal
        isOpen={isColdLockerOpen}
        onClose={() => setIsColdLockerOpen(false)}
      />

      {/* Campus & Corporate Zero-Waste Carbon League Modal */}
      <CarbonLeagueModal
        isOpen={isCarbonLeagueOpen}
        onClose={() => setIsCarbonLeagueOpen(false)}
      />

      {/* Live Social Proof Activity Stream Ticker */}
      <SocialProofTicker />

      {/* Global Footer */}
      <Footer
        totalSavedPkr={totalSavedPkr}
        itemsRescuedCount={itemsRescuedCount}
      />

    </div>
  );
}

export default App;


