import React, { useState } from 'react';
import { Card, Button, Badge } from './UI';
import { PlusCircle, Calendar, Recycle, Scale, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResidueType } from '../types';
import { cn } from '../lib/utils';
import { useEffect } from 'react';

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
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tighter uppercase underline decoration-lime-400 decoration-8 underline-offset-8 transition-all">Registrar Coleta</h2>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-xs mt-4">Transformando resíduos em pontos e aprendizado</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
           <Badge variant="success">+5 PONTOS POR REGISTRO</Badge>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="p-8 md:p-12 shadow-2xl shadow-emerald-900/5">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Success Message */}
            <AnimatePresence>
               {showSuccess && (
                 <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-emerald-500 text-white p-6 rounded-3xl flex items-center gap-4 mb-8"
                  >
                    <CheckCircle2 className="w-8 h-8 shrink-0" />
                    <div>
                       <p className="font-black text-lg">Sucesso! +5 Pontos Computados!</p>
                       <p className="text-emerald-50 text-sm font-medium">Os dados foram registrados no ranking geral.</p>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Date */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black uppercase text-stone-400 tracking-widest">
                  <Calendar className="w-3.5 h-3.5" /> Data da Coleta
                </label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-stone-100 rounded-[2rem] px-6 py-5 font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all text-lg cursor-pointer"
                />
              </div>

              {/* Class Selection */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black uppercase text-stone-400 tracking-widest">
                  <Recycle className="w-3.5 h-3.5" /> Turma Ativa
                </label>
                {profile?.role === 'teacher' ? (
                  <div className="w-full bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] px-6 py-5 flex flex-col justify-center">
                    <p className="font-black text-emerald-700 text-lg">
                      {classes.find((c: any) => c.id === classId)?.name || 'Sem turma'}
                    </p>
                    <p className="text-[10px] font-black text-emerald-600/50 uppercase tracking-widest leading-none">Equipe: {classes.find((c: any) => c.id === classId)?.teamName || '-'}</p>
                  </div>
                ) : (
                  <select 
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    disabled={!!profile && !isAdmin}
                    className="w-full bg-stone-50 border-2 border-stone-100 rounded-[2rem] px-6 py-5 font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all text-lg cursor-pointer appearance-none disabled:opacity-75 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">Selecione uma turma...</option>
                    {[...classes].sort((a: any, b: any) => a.name.localeCompare(b.name)).map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name} - {c.teamName}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Residue Type Selector */}
            <div className="space-y-4">
              <label className="text-xs font-black uppercase text-stone-400 tracking-widest">Tipo de Resíduo</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {residueTypes.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setType(item.type)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all group",
                      type === item.type 
                        ? cn(item.color, "shadow-lg scale-105") 
                        : "bg-white border-stone-100 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 hover:border-stone-200"
                    )}
                  >
                    <span className="text-4xl">{item.icon}</span>
                    <span className="font-black text-xs uppercase tracking-wider">{item.type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-4 pt-4">
              <label className="flex items-center gap-2 text-xs font-black uppercase text-stone-400 tracking-widest">
                <Scale className="w-3.5 h-3.5" /> Quantidade (em quilos)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  min="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Ex: 5.5"
                  className="w-full bg-stone-50 border-2 border-stone-100 rounded-[2.5rem] px-8 py-8 font-black text-stone-900 focus:outline-none focus:border-emerald-500 transition-all text-4xl placeholder:text-stone-200"
                  required
                />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-stone-200 text-stone-600 px-4 py-2 rounded-2xl font-black text-sm uppercase tracking-widest">
                  KG
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-24 text-2xl shadow-2xl shadow-emerald-500/40 rounded-[2.5rem] mt-8"
              disabled={!classId || !quantity}
            >
              Registrar Agora
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
