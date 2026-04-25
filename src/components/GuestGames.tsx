import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, ArrowLeft, Trophy, Star, Zap, Play, PlayCircle } from 'lucide-react';
import { Button } from './UI';
import Games from './Games';

export default function GuestGames({ onBack, classes }: { onBack: () => void, classes: any[] }) {
  return (
    <div className="min-h-screen bg-[#f1fcf4] selection:bg-emerald-200 font-sans overflow-x-hidden">
      {/* ... (background elements remains same) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-200/30 rounded-full blur-[80px]" 
        />
        <motion.div 
          animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/2 -right-20 w-80 h-80 bg-lime-200/30 rounded-full blur-[80px]" 
        />
      </div>

      <header className="px-8 pt-12 pb-8 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-black uppercase text-[10px] tracking-widest transition-all hover:-translate-x-1"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao Início
            </button>
            <div className="bg-emerald-600 p-4 rounded-[1.5rem] shadow-xl shadow-emerald-200 rotate-3">
              <Gamepad2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter uppercase">
              Eco <span className="text-emerald-600">Games</span>
            </h1>
            <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Portal de Diversão e Sustentabilidade</p>
          </div>

          <div className="hidden lg:flex gap-6">
            <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-lg flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-2xl">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Modo Guest</p>
                <p className="text-sm font-black text-stone-900">Jogue sem Limites</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] shadow-2xl border border-stone-100 p-8 min-h-[600px] relative overflow-hidden"
        >
          <div className="max-w-4xl mx-auto h-full">
              <Games 
                classes={classes} 
                addGamePoints={async () => {}} // Guest mode doesn't save points
                profile={{ id: 'guest', name: 'Eco Visitante' }} 
                isAdmin={false} 
                onGameToggle={() => {}} 
                isGuest={true}
              />
          </div>
        </motion.div>
      </main>

      <footer className="py-12 text-center">
         <p className="text-stone-300 font-black uppercase tracking-[0.4em] text-[10px]">EcoTech Dom Joaquim • Modo Aprendiz</p>
      </footer>
    </div>
  );
}
