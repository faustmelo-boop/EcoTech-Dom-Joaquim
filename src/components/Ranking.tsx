import React from 'react';
import { Trophy, Star, Rocket, Leaf, Cloud, Sun } from 'lucide-react';
import { Card } from './UI';
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-950 tracking-tighter uppercase underline decoration-lime-400 decoration-8 underline-offset-8 transition-all">Ranking Escolar</h2>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-xs mt-4">A jornada pela sustentabilidade</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 mt-12">
        <h2 className="text-xl font-black text-stone-800 text-center mb-6 flex items-center justify-center gap-2 uppercase tracking-tighter">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Quem vai pro espaço?
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
        </h2>

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
                className="flex flex-col items-center group flex-1 max-w-[120px]"
              >
                {/* Rocket and Points Bubble */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                  className="mb-4 flex flex-col items-center"
                >
                   <div className="bg-white px-3 py-1 rounded-full shadow-lg border border-emerald-100 text-[10px] font-black text-emerald-700 mb-2 whitespace-nowrap">
                      {item.points} pts
                   </div>
                   <div className={cn(
                     "p-3 rounded-2xl shadow-xl transition-all",
                     index === 0 ? "bg-yellow-400 scale-125 z-10" : 
                     index === 1 ? "bg-stone-300 scale-110" : 
                     index === 2 ? "bg-orange-300 scale-105" : "bg-sky-200"
                   )}>
                      <Rocket className="w-6 h-6 text-white fill-white" />
                   </div>
                </motion.div>

                {/* Vertical Bar */}
                <div 
                  style={{ height: `${barHeight}px` }}
                  className={cn(
                    "w-full rounded-t-3xl relative overflow-hidden shadow-2xl border-x-2 border-t-2 transition-all",
                    index === 0 ? "bg-emerald-500 border-emerald-400" : 
                    index === 1 ? "bg-emerald-600 border-emerald-500" : 
                    index === 2 ? "bg-emerald-700 border-emerald-600" : "bg-emerald-800 border-emerald-700"
                  )}
                >
                   <div className="absolute top-0 inset-x-0 h-full bg-white/10" />
                   <div className="absolute bottom-4 inset-x-0 text-center">
                      <span className="text-4xl font-black text-white/20 select-none">{index + 1}º</span>
                   </div>
                </div>

                {/* Info at Bottom */}
                <div className="mt-4 text-center w-full">
                  <h4 className="text-[10px] font-black text-emerald-950 uppercase leading-tight truncate px-1">
                    {item.name}
                  </h4>
                  <p className="text-[8px] text-stone-400 font-bold uppercase tracking-tight truncate">
                    {item.teamName}
                  </p>
                </div>
              </motion.div>
            );
          }) : (
            <div className="bg-white/50 rounded-3xl p-12 text-center border-4 border-dashed border-sky-200 w-full">
               <p className="text-stone-400 font-bold text-xl italic">Ainda não temos campeões! Vamos começar? 🚀</p>
            </div>
          )}
        </div>
      </div>
      
      {/* If there are more than 5 classes, list them alphabetically */}
      {classes.length > 5 && (
        <div className="max-w-4xl mx-auto space-y-2 mt-12 bg-white/50 p-6 rounded-[2.5rem] border-2 border-dashed border-stone-200">
          <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest text-center mb-6">Todas as Equipes (Ordem Alfabética)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alphaClasses.map((item) => {
              const globalRank = sortedClasses.findIndex(c => c.id === item.id) + 1;
              return (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-100 group hover:border-emerald-200 transition-all">
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center",
                      globalRank <= 3 ? "bg-yellow-100 text-yellow-700" : "bg-stone-100 text-stone-400"
                    )}>
                      {globalRank}º
                    </span>
                    <div>
                      <p className="font-bold text-stone-900 text-sm leading-none">{item.name}</p>
                      <p className="text-[9px] text-stone-400 font-black uppercase tracking-tight">{item.teamName}</p>
                    </div>
                  </div>
                  <span className="font-black text-emerald-600 text-sm">{item.points} pts</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
