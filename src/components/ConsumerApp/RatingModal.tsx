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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel border border-amber-500/40 rounded-3xl p-6 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 transition-colors"
        >
          <X className="size-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
                <Star className="size-5 fill-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Rate &amp; Review Store</h3>
                <p className="text-xs text-emerald-300/70">{deal.storeName}</p>
              </div>
            </div>

            {/* Star Rating Bar */}
            <div className="flex items-center justify-center gap-2 py-3 bg-emerald-950/60 rounded-2xl border border-emerald-800/50">
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
                        : 'text-emerald-800/80 fill-emerald-950'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs text-emerald-300/80 mb-1 font-medium">Your Review Comment:</label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Super fresh Chaunsa Mangoes from Al-Fatah! Highly recommended..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all"
            >
              Submit Rating &amp; Review
            </button>
          </form>
        ) : (
          <div className="text-center py-6 flex flex-col items-center gap-2">
            <CheckCircle2 className="size-12 text-emerald-400 animate-bounce" />
            <h3 className="text-lg font-bold text-white">Thank You for Your Feedback!</h3>
            <p className="text-xs text-emerald-300/70">Your rating helps build trust for Pakistani surplus food rescue.</p>
          </div>
        )}

      </div>
    </div>
  );
};
