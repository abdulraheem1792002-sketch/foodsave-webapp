import React, { useState } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';
import type { DealItem } from '../../types';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: DealItem | null;
  onAddReview: (dealId: string, rating: number, comment: string) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  deal,
  onAddReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen || !deal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReview(deal.id, rating, comment);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
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

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center justify-center">
                <Star className="size-5 fill-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-tight">Rate &amp; Review Store</h3>
                <p className="text-xs text-slate-400 font-medium">{deal.storeName}</p>
              </div>
            </div>

            {/* Star Rating Bar */}
            <div className="flex items-center justify-center gap-2 py-3 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`size-8 ${
                      star <= rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-700 fill-slate-800'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">Your Review Comment:</label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Super fresh Chaunsa Mangoes from Al-Fatah! Highly recommended..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95"
            >
              Submit Rating &amp; Review
            </button>
          </form>
        ) : (
          <div className="text-center py-6 flex flex-col items-center gap-2">
            <CheckCircle2 className="size-12 text-emerald-400 animate-bounce" />
            <h3 className="text-lg font-black text-white">Thank You for Your Feedback!</h3>
            <p className="text-xs text-slate-400">Your rating helps build trust for Pakistani surplus food rescue.</p>
          </div>
        )}

      </div>
    </div>
  );
};

