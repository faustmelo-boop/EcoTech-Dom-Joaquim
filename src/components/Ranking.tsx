import React from 'react';
import { Trophy, Star, Rocket, Leaf, Cloud, Sun } from 'lucide-react';
import { Card, Badge } from './UI';
import { cn } from '../lib/utils';
import { getLevelInfo, ClassTeam } from '../types';
import { motion } from 'motion/react';

export default function Ranking({ classes, ...props }: any) {
  const sortedClasses = [...classes].sort((a, b) => b.points - a.points);
  const alphaClasses = [...classes].sort((a, b) => a.name.localeCompare(b.name));
  const topClasses = sortedClasses.slice(0, 5);

  if (classes.length === 0) {
    return (
      <div className="py-20 text-center space-y-6">
        <Trophy className="w-24 h-24 text-stone-100 mx-auto" />
        <h2 className="text-3xl font-black text-stone-300 uppercase">Aguardando Equipes...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 w-fit rounded-full">
            <Trophy className="w-3 h-3 text-emerald-600" />
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Competição</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tighter uppercase leading-none underline decoration-lime-400 decoration-8 underline-offset-8">
            Ranking Escolar
          </h2>
          <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] max-w-sm leading-relaxed">
             A jornada pela sustentabilidade: veja quais equipes estão liderando a mudança.
          </p>
        </div>
        <div className="hidden md:block bg-stone-100 p-6 rounded-[2.5rem] border-2 border-dashed border-stone-200">
          <Trophy className="w-10 h-10 text-stone-300" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[minmax(150px,_auto)]">
        {/* Podium Bento Piece */}
        <div className="md:col-span-12 lg:col-span-8 lg:row-span-3 bg-white p-10 rounded-[3.5rem] border border-stone-100 shadow-2xl shadow-stone-200/40 relative overflow-hidden group">
          <div className="relative z-20">
            <h3 className="text-2xl font-black text-stone-900 text-center mb-12 flex items-center justify-center gap-3 uppercase tracking-tighter">
              <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" />
              Quem vai pro espaço?
              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500 animate-pulse" />
            </h3>

            <div className="flex items-end justify-center gap-4 h-[400px] mt-12 pb-8">
              {topClasses.length > 0 ? topClasses.map((item, index) => {
                const level = getLevelInfo(item.points);
                const maxHeight = 300;
                const maxPoints = topClasses[0].points || 1;
                const barHeight = Math.max((item.points / maxPoints) * maxHeight, 60);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, type: 'spring', stiffness: 50 }}
                    className="flex flex-col items-center group flex-1 max-w-[140px]"
                  >
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                      className="mb-4 flex flex-col items-center"
                    >
                       <div className="bg-emerald-950 px-4 py-1.5 rounded-full shadow-lg text-[10px] font-black text-emerald-400 mb-3 whitespace-nowrap border border-emerald-800">
                          {item.points} EcoPontos
                       </div>
                       <div className={cn(
                         "p-4 rounded-[1.5rem] shadow-xl transition-all relative overflow-hidden",
                         index === 0 ? "bg-yellow-400 scale-125 z-10" : 
                         index === 1 ? "bg-stone-300 scale-110" : 
                         index === 2 ? "bg-orange-300 scale-105" : "bg-sky-100"
                       )}>
                          <Rocket className={cn("w-7 h-7 text-white fill-white", index === 0 && "animate-[rocket_2s_infinite]")} />
                       </div>
                    </motion.div>

                    <div 
                      style={{ height: `${barHeight}px` }}
                      className={cn(
                        "w-full rounded-t-[2.5rem] relative overflow-hidden shadow-2xl border-x-2 border-t-2 transition-all",
                        index === 0 ? "bg-emerald-500 border-emerald-400" : 
                        index === 1 ? "bg-emerald-600 border-emerald-500" : 
                        index === 2 ? "bg-emerald-700 border-emerald-600" : "bg-emerald-800 border-emerald-700"
                      )}
                    >
                       <div className="absolute top-0 inset-x-0 h-full bg-white/10" />
                       <div className="absolute bottom-6 inset-x-0 text-center">
                          <span className="text-5xl font-black text-white/20 select-none">{index + 1}º</span>
                       </div>
                    </div>

                    <div className="mt-6 text-center w-full">
                      <h4 className="text-[11px] font-black text-emerald-950 uppercase leading-tight truncate px-1">
                        {item.name}
                      </h4>
                      <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest truncate">
                        {item.teamName}
                      </p>
                    </div>
                  </motion.div>
                );
              }) : (
                <div className="bg-stone-50 rounded-[3rem] p-12 text-center border-4 border-dashed border-stone-100 w-full flex flex-col items-center justify-center">
                   <Rocket className="w-16 h-16 text-stone-200 mb-4" />
                   <p className="text-stone-400 font-bold text-xl italic uppercase tracking-tighter">Aguardando Lançamento!</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="absolute -bottom-20 -right-20 opacity-[0.02] group-hover:scale-110 transition-transform duration-[3s] pointer-events-none z-0">
             <Trophy className="w-[40rem] h-[40rem] rotate-12" />
          </div>
        </div>

        {/* Global List Bento Piece */}
        <div className="md:col-span-12 lg:col-span-4 lg:row-span-3 bg-emerald-950 p-8 rounded-[3.5rem] shadow-2xl shadow-emerald-900/40 flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Classificação Geral</h3>
             <Badge className="bg-emerald-800 text-emerald-400 border-none font-black px-4">{classes.length} Equipes</Badge>
          </div>
          
          <div className="space-y-4 overflow-y-auto no-scrollbar flex-1 pr-1">
            {sortedClasses.map((item, index) => {
              const level = getLevelInfo(item.points);
              return (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={item.id} 
                  className={cn(
                    "flex items-center justify-between p-5 rounded-2xl transition-all border",
                    index < 3 ? "bg-white/10 border-white/10" : "bg-transparent border-white/5 opacity-60 hover:opacity-100"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "text-xs font-black w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                      index === 0 ? "bg-yellow-400 text-emerald-950 shadow-lg" : 
                      index === 1 ? "bg-stone-300 text-stone-900" : 
                      index === 2 ? "bg-orange-300 text-orange-950" : "bg-white/5 text-white/40"
                    )}>
                      {index + 1}
                    </span>
                    <div className="overflow-hidden">
                      <p className="font-black text-white text-sm leading-none truncate mb-1 uppercase tracking-tight">{item.name}</p>
                      <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest truncate">{item.teamName}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-emerald-400 text-sm leading-none">{item.points}</p>
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mt-1">{level.label.split(' ')[0]}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-center gap-4 text-emerald-100/30">
             <div className="flex flex-col items-center">
                <Sun className="w-5 h-5 mb-1" />
                <span className="text-[8px] font-black uppercase tracking-widest">Energia</span>
             </div>
             <div className="w-1 h-1 bg-white/20 rounded-full" />
             <div className="flex flex-col items-center">
                <Cloud className="w-5 h-5 mb-1" />
                <span className="text-[8px] font-black uppercase tracking-widest">Clima</span>
             </div>
             <div className="w-1 h-1 bg-white/20 rounded-full" />
             <div className="flex flex-col items-center">
                <Leaf className="w-5 h-5 mb-1" />
                <span className="text-[8px] font-black uppercase tracking-widest">Vida</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
