import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from './UI';
import { PlusCircle, Calendar, Recycle, Scale, CheckCircle2, Users, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResidueType } from '../types';
import { cn } from '../lib/utils';

export default function DataRegistration({ classes, addEntry, profile, isAdmin }: any) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [classId, setClassId] = useState('');
  const [type, setType] = useState<ResidueType>('Plástico');
  const [quantity, setQuantity] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (profile && !isAdmin) {
      const teacherClass = classes.find((c: any) => c.teacherId === profile.id);
      if (teacherClass) {
        setClassId(teacherClass.id);
      }
    }
  }, [profile, isAdmin, classes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (classId && quantity) {
      addEntry(classId, type, Number(quantity), date);
      setQuantity('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const residueTypes: { type: ResidueType; color: string; icon: string }[] = [
    { type: 'Plástico', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '🥤' },
    { type: 'Papel', color: 'bg-stone-100 text-stone-700 border-stone-200', icon: '📄' },
    { type: 'Vidro', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: '🍾' },
    { type: 'Metal', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: '🥫' }
  ];

  return (
    <div className="space-y-10 pb-20 no-scrollbar">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 w-fit rounded-full">
            <PlusCircle className="w-3 h-3 text-emerald-600" />
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Coleta</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tighter uppercase leading-none underline decoration-lime-400 decoration-8 underline-offset-8 transition-all">
            Novo Registro
          </h2>
          <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] max-w-sm leading-relaxed">
             Transforme resíduos em pontos para sua equipe e impacto real para a ecologia da nossa escola.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-4 rounded-[2.5rem] border-2 border-stone-50 shadow-xl shadow-stone-200/50 flex items-center justify-between gap-6">
            <div className="text-left">
              <p className="text-emerald-700 text-[10px] font-black uppercase tracking-widest leading-none mb-1">+5 PONTOS</p>
              <span className="text-2xl font-black text-stone-900 tracking-tight leading-none">Bônus Agente</span>
            </div>
            <div className="bg-emerald-100 p-3 rounded-2xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-600/20" />
            </div>
          </div>
          <div className="hidden md:block bg-stone-100 p-6 rounded-[2.5rem] border-2 border-dashed border-stone-200">
            <PlusCircle className="w-10 h-10 text-stone-300" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl shadow-stone-200/30 border border-stone-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
          
          <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
            {/* Success Message */}
            <AnimatePresence>
               {showSuccess && (
                 <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-emerald-600 text-white p-6 rounded-[2rem] flex items-center gap-4 mb-8 shadow-xl shadow-emerald-200"
                  >
                    <div className="bg-white/20 p-2 rounded-xl">
                       <CheckCircle2 className="w-6 h-6 shrink-0" />
                    </div>
                    <div>
                       <p className="font-black text-lg leading-none">Registro Concluído!</p>
                       <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest mt-1">Pontuação enviada para o ranking</p>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Date Selection */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-stone-400 tracking-widest ml-4">
                  <Calendar className="w-4 h-4 text-emerald-500" /> Data da Coleta
                </label>
                <div className="relative group">
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-stone-50 border-2 border-stone-50 group-hover:border-stone-100 focus:border-emerald-500 px-8 py-5 rounded-[2.5rem] font-black text-stone-900 transition-all text-xl cursor-pointer outline-none shadow-inner"
                  />
                </div>
              </div>

              {/* Class Info Card - Enhanced Selection */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase text-stone-400 tracking-widest ml-4">
                  <Users className="w-4 h-4 text-purple-500" /> Equipe Responsável
                </label>
                {profile?.role === 'teacher' ? (
                  <div className="w-full bg-stone-50 border-2 border-stone-50 px-8 py-5 rounded-[2.5rem] flex flex-col justify-center shadow-inner">
                    <p className="font-black text-stone-900 text-xl leading-none">
                      {classes.find((c: any) => c.id === classId)?.name || 'Sem turma vinculada'}
                    </p>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1.5 leading-none">Prof. {profile?.name}</p>
                  </div>
                ) : (
                  <div className="relative group">
                    <select 
                      value={classId}
                      onChange={(e) => setClassId(e.target.value)}
                      disabled={!!profile && !isAdmin}
                      className="w-full bg-stone-50 border-2 border-stone-50 group-hover:border-stone-100 focus:border-emerald-500 px-8 py-5 rounded-[2.5rem] font-black text-stone-900 transition-all text-xl cursor-pointer outline-none appearance-none shadow-inner disabled:opacity-50"
                      required
                    >
                      <option value="">Selecione a turma...</option>
                      {[...classes].sort((a: any, b: any) => a.name.localeCompare(b.name)).map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-300 pointer-events-none group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </div>
            </div>

            {/* Residue Type Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between ml-4">
                <label className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em]">Material Coletado</label>
                <div className="h-[1px] flex-1 bg-stone-100 ml-6" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {residueTypes.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setType(item.type)}
                    className={cn(
                      "flex flex-col items-center gap-4 p-6 rounded-[2.5rem] border-2 transition-all group overflow-hidden relative",
                      type === item.type 
                        ? "bg-stone-900 border-stone-900 text-white shadow-2xl scale-[1.02]" 
                        : "bg-white border-stone-100 text-stone-400 hover:border-emerald-200 hover:text-emerald-600"
                    )}
                  >
                    {type === item.type && (
                      <motion.div 
                        layoutId="activeResidue"
                        className="absolute inset-0 bg-stone-900 -z-10"
                      />
                    )}
                    <span className="text-5xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">{item.type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Input - Brutalist Layout */}
            <div className="space-y-6">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] ml-4">
                <Scale className="w-4 h-4 text-blue-500" /> Massa Total
              </label>
              <div className="relative group">
                <input 
                  type="number" 
                  step="0.1"
                  min="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-stone-50 border-2 border-stone-50 group-hover:border-stone-100 focus:border-emerald-500 rounded-[3rem] px-10 py-12 font-black text-stone-900 transition-all text-6xl md:text-8xl placeholder:text-stone-100 outline-none shadow-inner"
                  required
                />
                <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-end">
                   <div className="bg-emerald-600 text-white px-6 py-2 rounded-2xl font-black text-xl tracking-tighter shadow-lg mb-2">KG</div>
                   <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest hidden md:block">Quilogramas</p>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!classId || !quantity}
              className="w-full h-24 bg-emerald-600 hover:bg-emerald-700 text-white text-2xl font-black uppercase tracking-[0.1em] rounded-[3rem] shadow-2xl shadow-emerald-200 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale disabled:scale-100"
            >
              Confirmar Registro <ArrowRight className="w-8 h-8" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
