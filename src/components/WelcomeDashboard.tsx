import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Rocket, Cloud, Leaf, ChevronRight, Users, ArrowRight, Trees, Bird, Wind, Flower2 } from 'lucide-react';
import { Card } from './UI';
import { cn } from '../lib/utils';
import { getLevelInfo } from '../types';

export default function WelcomeDashboard({ classes, onTeacherLogin }: { classes: any[], onTeacherLogin: () => void }) {
  const sortedClasses = [...classes].sort((a, b) => b.points - a.points);
  const alphaClasses = [...classes].sort((a, b) => a.name.localeCompare(b.name));
  const topClasses = sortedClasses.slice(0, 3); // Focar nos Top 3 no layout principal

  return (
    <div className="min-h-screen bg-[#f9fbf2] overflow-hidden relative pb-32 no-scrollbar font-sans selection:bg-emerald-200">
      {/* 1. Whimsical Background Layers (Z-0) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 opacity-40">
          {/* Animated Trees */}
          <motion.div 
            animate={{ rotate: [0, 1, -1, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] -left-10 text-emerald-300"
          >
            <Trees className="w-64 h-64 opacity-30" strokeWidth={1} />
          </motion.div>
          
          <motion.div 
            animate={{ rotate: [0, -2, 2, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[10%] -right-20 text-emerald-200"
          >
            <Trees className="w-80 h-80 opacity-30" strokeWidth={1} />
          </motion.div>

          {/* Animated Birds */}
          <motion.div 
            animate={{ 
              x: [-100, 1200],
              y: [100, 150, 100]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 text-sky-400"
          >
            <Bird className="w-8 h-8" />
          </motion.div>

          {/* Floating Flowers */}
          <motion.div 
            animate={{ y: [0, -10, 0], rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-[15%] text-rose-300"
          >
            <Flower2 className="w-12 h-12" />
          </motion.div>

          <motion.div 
            animate={{ y: [10, -10, 10], rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[40%] right-[10%] text-amber-300"
          >
            <Flower2 className="w-16 h-16" />
          </motion.div>
        </div>
      </div>

      {/* 2. Header Background (Z-0) */}
      <div className="absolute top-0 inset-x-0 h-80 bg-emerald-600 z-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-10 right-10 w-64 h-64 bg-yellow-300 rounded-full blur-[100px]"
        />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#f9fbf2] to-transparent" />
      </div>
      
      {/* Floating Elements (Z-0) */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[10%] text-white/10 z-0"
      >
        <Cloud className="w-32 h-32" />
      </motion.div>

      {/* 3. Main Content Wrapper (Z-10) */}
      <div className="relative z-10">
        {/* Header */}
        <header className="px-8 pt-12 pb-8 text-center text-white relative">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/30">
            <Leaf className="w-5 h-5 fill-lime-400 text-lime-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Educação Ambiental</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
             ECOTECH<br/>
             <span className="text-lime-400">DOM JOAQUIM</span>
          </h1>
          <p className="text-emerald-50 font-bold text-xs uppercase tracking-[0.3em]">
             Missão Sustentável 2026
          </p>
        </motion.div>
      </header>

      {/* Podium Section (Simplified & Modern) */}
      <div className="max-w-4xl mx-auto px-6 relative z-10 mt-4">
        <div className="flex items-end justify-center gap-2 md:gap-6 h-[280px] mb-12">
          {topClasses.length > 0 ? (
            <>
              {/* 2nd Place */}
              {topClasses[1] && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center flex-1 max-w-[120px]"
                >
                  <div className="bg-stone-50 p-2 rounded-2xl mb-2 shadow-inner border border-stone-200">
                    <Rocket className="w-5 h-5 text-stone-400" />
                  </div>
                  <div className="w-full bg-stone-100 rounded-t-3xl h-[120px] relative overflow-hidden flex flex-col items-center justify-center p-2 shadow-lg border border-stone-200">
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/30" />
                    <span className="text-3xl font-black text-stone-400">2º</span>
                    <p className="text-[8px] font-black uppercase text-stone-600 text-center truncate w-full mt-1">{topClasses[1].name}</p>
                    <p className="text-[10px] font-black text-emerald-700 mt-1">{topClasses[1].points} pts</p>
                  </div>
                </motion.div>
              )}

              {/* 1st Place */}
              {topClasses[0] && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center flex-1 max-w-[140px] z-20"
                >
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="bg-yellow-400 p-4 rounded-3xl mb-3 shadow-2xl ring-8 ring-yellow-400/20"
                  >
                    <Trophy className="w-8 h-8 text-white fill-white" />
                  </motion.div>
                  <div className="w-full bg-emerald-600 rounded-t-[2.5rem] h-[180px] relative overflow-hidden flex flex-col items-center justify-center p-3 shadow-2xl border-x-2 border-t-2 border-emerald-400">
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-700 to-transparent opacity-50" />
                    <Star className="absolute top-4 w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
                    <span className="text-5xl font-black text-white relative z-10">1º</span>
                    <p className="text-[10px] font-black uppercase text-emerald-100 text-center truncate w-full mt-2 relative z-10">{topClasses[0].name}</p>
                    <p className="text-sm font-black text-lime-400 mt-1 relative z-10">{topClasses[0].points} pts</p>
                  </div>
                </motion.div>
              )}

              {/* 3rd Place */}
              {topClasses[2] && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center flex-1 max-w-[120px]"
                >
                  <div className="bg-orange-100 p-2 rounded-2xl mb-2 shadow-inner border border-orange-200">
                    <Rocket className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="w-full bg-orange-200 rounded-t-3xl h-[90px] relative overflow-hidden flex flex-col items-center justify-center p-2 shadow-lg border border-orange-300">
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/30" />
                    <span className="text-3xl font-black text-orange-400">3º</span>
                    <p className="text-[8px] font-black uppercase text-orange-800 text-center truncate w-full mt-1">{topClasses[2].name}</p>
                    <p className="text-[10px] font-black text-orange-900 mt-1">{topClasses[2].points} pts</p>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
             <div className="w-full h-32 flex items-center justify-center text-stone-300 font-black uppercase tracking-widest text-sm">Aguardando Missões...</div>
          )}
        </div>

        {/* Action Button - Simplified */}
        <div className="grid grid-cols-1 gap-4 pt-8">
           <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="bg-emerald-100 p-3 rounded-2xl">
                    <Users className="w-6 h-6 text-emerald-600" />
                 </div>
                 <div className="text-left">
                    <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest leading-none mb-1">Ranking Completo</h3>
                    <p className="font-black text-stone-900 text-lg leading-none">{classes.length} Equipes Participando</p>
                 </div>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-300" />
           </div>
        </div>

        {/* Alphabetical List - Bento Style */}
        <div className="mt-12 space-y-6">
           <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] flex-1 bg-stone-100" />
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] px-4">Todas as Equipes</span>
              <div className="h-[1px] flex-1 bg-stone-100" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {alphaClasses.map((item, idx) => {
                const globalRank = sortedClasses.findIndex(c => c.id === item.id) + 1;
                return (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 bg-white rounded-3xl border border-stone-200 hover:border-emerald-200 transition-all shadow-md active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black",
                        globalRank === 1 ? "bg-yellow-400 text-white" : 
                        globalRank === 2 ? "bg-stone-200 text-stone-600" : 
                        globalRank === 3 ? "bg-orange-200 text-orange-700" : "bg-stone-50 text-stone-400"
                      )}>
                        {globalRank}º
                      </div>
                      <div className="text-left">
                        <p className="font-black text-stone-900 text-sm leading-none mb-0.5">{item.name}</p>
                        <p className="text-[9px] text-stone-400 font-black uppercase tracking-tight">{item.teamName}</p>
                      </div>
                    </div>
                    <div className="bg-emerald-50 px-4 py-2 rounded-2xl">
                      <span className="font-black text-emerald-600 text-xs">{item.points} pts</span>
                    </div>
                  </motion.div>
                );
              })}
           </div>
        </div>
      </div>

      {/* Improved Bottom Access */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 pb-10 flex justify-center z-[100] bg-gradient-to-t from-[#f9fbf2] via-[#f9fbf2]/80 to-transparent">
        <button 
          onClick={onTeacherLogin}
          className="group relative h-16 px-10 bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-95 transition-all flex items-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-stone-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10">Acesso do Professor</span>
          <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>
      </footer>
      </div>
    </div>
  );
}

