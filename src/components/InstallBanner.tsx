import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './UI';

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode
    const checkStandalone = () => {
      return (window.matchMedia('(display-mode: standalone)').matches) || ((window.navigator as any).standalone) || document.referrer.includes('android-app://');
    };

    setIsInstalled(checkStandalone());

    // Detect iOS
    const checkIOS = () => {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    };
    setIsIOS(checkIOS());

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent browser from showing its own prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom banner if not installed
      if (!checkStandalone()) {
        setShowBanner(true);
      }
    });

    // On iOS, we can't detect beforeinstallprompt, so we suggest it manually
    if (checkIOS() && !checkStandalone()) {
      // Show after a small delay to not annoy immediately
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the native prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowBanner(false);
    }
    
    // Clear the deferredPrompt for next time
    setDeferredPrompt(null);
  };

  if (isInstalled || !showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[1000] p-4 md:p-6"
      >
        <div className="max-w-xl mx-auto bg-emerald-950 text-white rounded-[2rem] border border-emerald-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden backdrop-blur-xl bg-opacity-95">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400 opacity-5 blur-[50px] -mr-10 -mt-10" />
          
          <div className="bg-emerald-600/20 p-4 rounded-2xl shrink-0">
            <Smartphone className="w-8 h-8 text-lime-400" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-lg font-black tracking-tight uppercase leading-none mb-2">Instalar EcoTech App</h4>
            <p className="text-xs text-emerald-200/70 font-medium leading-relaxed">
              {isIOS 
                ? 'Clique no botão de compartilhamento (↑) e escolha "Adicionar à Tela de Início" para ter a melhor experiência!' 
                : 'Tenha acesso rápido ao mural, ranking e registros direto da sua tela inicial como um aplicativo real!'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {!isIOS ? (
              <Button 
                onClick={handleInstall}
                className="flex-1 md:w-32 h-14 bg-lime-400 text-emerald-950 hover:bg-lime-500 rounded-2xl font-black uppercase text-[10px] tracking-widest"
              >
                Instalar
              </Button>
            ) : (
              <div className="flex-1 md:w-32 h-14 bg-white/10 rounded-2xl flex items-center justify-center gap-2 border border-white/5">
                <Share className="w-4 h-4 text-lime-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Ver como</span>
              </div>
            )}
            
            <button 
              onClick={() => setShowBanner(false)}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
