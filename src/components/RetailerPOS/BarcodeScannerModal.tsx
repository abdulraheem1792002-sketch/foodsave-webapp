import React, { useState } from 'react';
import type { DealItem } from '../../types';
import { X, QrCode, Scan, ArrowRight, Camera, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { sounds } from '../../lib/soundEffects';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Partial<DealItem>) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
}) => {
  const [scanMode, setScanMode] = useState<'barcode' | 'ocr-expiry'>('barcode');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<{
    title: string;
    category: any;
    originalPricePkr: number;
    stockQuantity: number;
    expiryHoursLeft: number;
    ocrText?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      sounds.playLaserBeep();

      if (scanMode === 'barcode') {
        setScannedResult({
          title: 'Fresh Baked Naan & Samosa Combo Box',
          category: 'bakery',
          originalPricePkr: 950,
          stockQuantity: 8,
          expiryHoursLeft: 2.0,
        });
      } else {
        setScannedResult({
          title: 'Gourmet Marinated BBQ Chicken Tikka',
          category: 'restaurant',
          originalPricePkr: 1650,
          stockQuantity: 5,
          expiryHoursLeft: 1.5,
          ocrText: 'EXP: 19/08/2026 21:00 • BATCH: LHR-9281',
        });
      }
    }, 1200);
  };

  const handlePublishListing = () => {
    if (!scannedResult) return;

    sounds.playSuccessFanfare();

    onAddItem({
      title: scannedResult.title,
      category: scannedResult.category,
      originalPricePkr: scannedResult.originalPricePkr,
      currentPricePkr: Math.round(scannedResult.originalPricePkr * 0.4),
      discountPercent: 60,
      expiryHoursLeft: scannedResult.expiryHoursLeft,
      stockQuantity: scannedResult.stockQuantity,
      pickupDeadline: `Pick up within ${scannedResult.expiryHoursLeft} hrs`,
      distanceKm: 0.5,
      imageUrl: scannedResult.category === 'bakery'
        ? 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      isVerified: true,
      location: { x: 50, y: 50, address: 'Gulberg III', city: 'Lahore' },
      decaySchedule: [
        { hoursRemaining: 3, discountPercent: 40, pricePkr: Math.round(scannedResult.originalPricePkr * 0.6) },
        { hoursRemaining: 2, discountPercent: 60, pricePkr: Math.round(scannedResult.originalPricePkr * 0.4) },
        { hoursRemaining: 1, discountPercent: 80, pricePkr: Math.round(scannedResult.originalPricePkr * 0.2) },
      ],
      hoursRemaining: scannedResult.expiryHoursLeft,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel border border-amber-500/40 rounded-3xl p-6 shadow-2xl overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-2xl bg-emerald-950 border border-emerald-800">
          <button
            onClick={() => {
              setScanMode('barcode');
              setScannedResult(null);
            }}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              scanMode === 'barcode' ? 'bg-amber-500 text-slate-950 shadow' : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            <Scan className="size-3.5" />
            <span>POS Barcode</span>
          </button>

          <button
            onClick={() => {
              setScanMode('ocr-expiry');
              setScannedResult(null);
            }}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              scanMode === 'ocr-expiry' ? 'bg-purple-600 text-white shadow' : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            <Camera className="size-3.5" />
            <span>AI Expiry OCR</span>
          </button>
        </div>

        {/* Scanner Viewport */}
        <div className="relative w-full h-44 rounded-2xl bg-slate-950 border border-emerald-800 flex flex-col items-center justify-center overflow-hidden mb-4">
          {isScanning ? (
            <div className="flex flex-col items-center gap-2 text-emerald-400">
              <Scan className="size-12 animate-pulse text-amber-400" />
              <span className="text-xs font-mono font-bold animate-bounce">
                {scanMode === 'barcode' ? 'Scanning EAN Barcode...' : 'AI Vision OCR Parsing Label...'}
              </span>
            </div>
          ) : scannedResult ? (
            <div className="p-4 text-center">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2 inline-block">
                ✓ {scanMode === 'barcode' ? 'Barcode Matched' : 'AI OCR Parsed Successfully'}
              </span>
              <p className="text-sm font-bold text-white">{scannedResult.title}</p>
              {scannedResult.ocrText && (
                <p className="text-[10px] font-mono text-purple-300 mt-0.5">{scannedResult.ocrText}</p>
              )}
              <p className="text-xs text-amber-300 font-mono mt-1">
                Original Price: {formatCurrency(scannedResult.originalPricePkr)} • {scannedResult.stockQuantity} pcs
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-emerald-400/70">
              {scanMode === 'barcode' ? <QrCode className="size-12 opacity-60" /> : <Camera className="size-12 opacity-60 text-purple-400" />}
              <p className="text-xs text-center max-w-xs px-4">
                {scanMode === 'barcode'
                  ? 'Point barcode scanner or camera at packaging'
                  : 'Point camera at perishable expiry timestamp label'}
              </p>
              <button
                onClick={handleSimulateScan}
                className="mt-2 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1"
              >
                <Sparkles className="size-3.5" />
                <span>Simulate {scanMode === 'barcode' ? 'Scan Barcode' : 'AI Expiry OCR'}</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            disabled={!scannedResult}
            onClick={handlePublishListing}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-lg transition-all"
          >
            <span>Publish &amp; Apply Decay</span>
            <ArrowRight className="size-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

