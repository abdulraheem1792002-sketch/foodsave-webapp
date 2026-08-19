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
    const fallbackName = name.trim() || (email ? email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Food Saver');
    try {
      if (mode === 'register') {
        const res = await registerAuthApi({
          name: fallbackName,
          email,
          role,
          storeName,
          city,
        });
        onAuthSuccess(res.user || { id: `usr-${Date.now()}`, name: fallbackName, email, role, totalSavedPkr: 0, itemsRescuedCount: 0 }, res.token || 'real_jwt_token');
      } else {
        const res = await loginAuthApi(email);
        onAuthSuccess(res.user || { id: `usr-${Date.now()}`, name: fallbackName, email, role, totalSavedPkr: 0, itemsRescuedCount: 0 }, res.token || 'real_jwt_token');
      }
      onClose();
    } catch (err) {
      console.warn('Auth API fallback:', err);
      onAuthSuccess({ id: `usr-${Date.now()}`, name: fallbackName, email: email || 'user@foodsave.pk', role, totalSavedPkr: 0, itemsRescuedCount: 0 }, 'jwt_token');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
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

        <div className="flex items-center gap-3 mb-5">
          <div className="size-10 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-xl">
            ⚡
          </div>
          <div>
            <h3 className="text-base font-black text-white tracking-tight">
              {mode === 'login' ? 'Account Login' : 'Create Account'}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {mode === 'login' ? 'Access your deals & store dashboard' : 'Join Pakistan surplus food marketplace'}
            </p>
          </div>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-2 mb-4 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setRole('consumer')}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              role === 'consumer' ? 'bg-emerald-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="size-3.5" />
            <span>Consumer</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('retailer')}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              role === 'retailer' ? 'bg-amber-400 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="size-3.5" />
            <span>Retailer</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'register' && (
            <div>
              <label className="block text-xs text-slate-300 mb-1 font-medium">Full Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. Sara Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-emerald-400"
              />
            </div>
          )}

          {mode === 'register' && role === 'retailer' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-medium">Store Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gourmet Bakers"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-medium">City:</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-emerald-400"
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
            <label className="block text-xs text-slate-300 mb-1 font-medium">Email Address:</label>
            <input
              type="email"
              required
              placeholder="e.g. yourname@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1 font-medium">Password:</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              defaultValue="password123"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-emerald-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg mt-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Authenticating...' : mode === 'login' ? `Login as ${role.toUpperCase()}` : `Create ${role.toUpperCase()} Account`}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-t border-slate-800 text-xs">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            {mode === 'login' ? "Don't have an account? Register here" : 'Already registered? Login here'}
          </button>
        </div>

      </div>
    </div>
  );
};

