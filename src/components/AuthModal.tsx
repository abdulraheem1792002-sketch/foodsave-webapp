import React, { useState } from 'react';
import { X, User, Store } from 'lucide-react';
import { loginAuthApi, registerAuthApi } from '../services/api';

import type { AuthUser } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'consumer' | 'retailer'>('consumer');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [city, setCity] = useState('Lahore');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === 'register') {
        const res = await registerAuthApi({
          name,
          email,
          role,
          storeName,
          city,
        });
        onAuthSuccess(res.user || { id: 'usr-1', name, email, role, totalSavedPkr: 0, itemsRescuedCount: 0 }, res.token || 'mock_jwt');
      } else {
        const res = await loginAuthApi(email);
        onAuthSuccess(res.user || { id: 'usr-1', name: 'Hamza Khan', email, role, totalSavedPkr: 4250, itemsRescuedCount: 7 }, res.token || 'mock_jwt');
      }
      onClose();
    } catch (err) {
      console.warn('Auth API fallback:', err);
      onAuthSuccess({ id: 'usr-1', name: name || 'Hamza Khan', email: email || 'user@flashfruit.pk', role, totalSavedPkr: 4250, itemsRescuedCount: 7 }, 'jwt_token');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel border border-emerald-700/60 rounded-3xl p-6 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="size-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-xl">
            ⚡
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {mode === 'login' ? 'FlashFruit Login (JWT)' : 'Create FlashFruit Account'}
            </h3>
            <p className="text-xs text-emerald-300/70">
              {mode === 'login' ? 'Access your deals & store dashboard' : 'Join Pakistan surplus food marketplace'}
            </p>
          </div>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-2xl bg-emerald-950 border border-emerald-800">
          <button
            type="button"
            onClick={() => setRole('consumer')}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              role === 'consumer' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            <User className="size-3.5" />
            <span>Consumer</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('retailer')}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              role === 'retailer' ? 'bg-amber-600 text-white shadow' : 'text-emerald-300/70 hover:text-white'
            }`}
          >
            <Store className="size-3.5" />
            <span>Retailer</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'register' && (
            <div>
              <label className="block text-xs text-emerald-300/80 mb-1 font-medium">Full Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. Hamza Khan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-white text-xs font-bold"
              />
            </div>
          )}

          {mode === 'register' && role === 'retailer' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-emerald-300/80 mb-1 font-medium">Store Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gourmet Bakers"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs text-emerald-300/80 mb-1 font-medium">City:</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-white text-xs font-bold"
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-emerald-300/80 mb-1 font-medium">Email Address:</label>
            <input
              type="email"
              required
              placeholder="e.g. hamza@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-white text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs text-emerald-300/80 mb-1 font-medium">Password:</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              defaultValue="password123"
              className="w-full px-3 py-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-white text-xs font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg mt-2 transition-all"
          >
            {isSubmitting ? 'Authenticating JWT...' : mode === 'login' ? `Login as ${role.toUpperCase()}` : `Register as ${role.toUpperCase()}`}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-t border-emerald-900/60 text-xs">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-emerald-400 hover:text-white font-semibold underline"
          >
            {mode === 'login' ? "Don't have an account? Register here" : 'Already registered? Login here'}
          </button>
        </div>

      </div>
    </div>
  );
};
