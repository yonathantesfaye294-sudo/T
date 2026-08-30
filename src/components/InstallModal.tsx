import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Monitor, CheckCircle2, X, Share2, Sparkles, PlusSquare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InstallModalProps {
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'desktop'>('desktop');

  useEffect(() => {
    // Check user agent to auto-select tab
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setActivePlatform('ios');
    } else if (/android/.test(ua)) {
      setActivePlatform('android');
    } else {
      setActivePlatform('desktop');
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-yellow-400/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-black text-white flex items-center gap-2">
                Install Logo Rush
              </h2>
              <p className="text-xs text-slate-400">Play offline, full-screen without browser bars</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Quick Install Button if supported */}
          {deferredPrompt && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/25 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Click to Install App Directly</span>
            </button>
          )}

          {isInstalled && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Logo Rush is already installed as a standalone app!</span>
            </div>
          )}

          {/* Platform Selector Tabs */}
          <div className="flex gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActivePlatform('desktop')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activePlatform === 'desktop' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>PC / Mac</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePlatform('android')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activePlatform === 'android' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Android</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePlatform('ios')}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activePlatform === 'ios' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>iPhone / iPad</span>
            </button>
          </div>

          {/* Platform specific guides */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            {activePlatform === 'desktop' && (
              <div className="space-y-2.5 text-slate-300">
                <div className="font-bold text-white flex items-center gap-2">
                  <span>In Chrome, Edge, or Brave:</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-400">
                  <li>Open this app in a full browser tab.</li>
                  <li>Click the <strong className="text-yellow-400">Install icon</strong> in the address bar (on the right side).</li>
                  <li>Click <strong className="text-white">Install</strong> to add Logo Rush to your desktop and launch it in fullscreen.</li>
                </ol>
              </div>
            )}

            {activePlatform === 'android' && (
              <div className="space-y-2.5 text-slate-300">
                <div className="font-bold text-white flex items-center gap-2">
                  <span>In Chrome on Android:</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-400">
                  <li>Tap the three dots menu (<strong className="text-white">⋮</strong>) at the top-right.</li>
                  <li>Select <strong className="text-yellow-400">Install app</strong> or <strong className="text-yellow-400">Add to Home screen</strong>.</li>
                  <li>Confirm installation to create an app icon on your home screen.</li>
                </ol>
              </div>
            )}

            {activePlatform === 'ios' && (
              <div className="space-y-2.5 text-slate-300">
                <div className="font-bold text-white flex items-center gap-2">
                  <span>In Safari on iPhone / iPad:</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-400">
                  <li>Tap the <strong className="text-white">Share button</strong> (<Share2 className="w-3.5 h-3.5 inline text-sky-400" />) at the bottom toolbar.</li>
                  <li>Scroll down and tap <strong className="text-yellow-400">Add to Home Screen</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-slate-300" />).</li>
                  <li>Tap <strong className="text-white">Add</strong> in the top-right corner to place Logo Rush on your home screen.</li>
                </ol>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span>Installed apps store progress locally and load instantly.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </div>
  );
};
