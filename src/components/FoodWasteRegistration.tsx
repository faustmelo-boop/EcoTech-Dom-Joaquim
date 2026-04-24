import React, { useState } from 'react';
import { Card, Button, Badge } from './UI';
import { Utensils, Calendar, Scale, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useEffect } from 'react';

export default function FoodWasteRegistration({ addFoodWaste, classes, profile, isAdmin }: any) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [classId, setClassId] = useState('');
  const [menu, setMenu] = useState('');
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
    if (menu && quantity && classId) {
      addFoodWaste(menu, Number(quantity), classId);
      setMenu('');
      setQuantity('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-950 tracking-tighter uppercase underline decoration-amber-400 decoration-8 underline-offset-8 transition-all">Combate ao Desperdício</h2>
           <p className="text-stone-500 font-bold uppercase tracking-widest text-xs mt-4">Monitoramento da merenda e aceitação do cardápio</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
           <Badge className="bg-amber-100 text-amber-800 border-none font-black">PROJETO ZERO DESPERDÍCIO</Badge>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="p-8 md:p-12 shadow-2xl shadow-amber-900/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Utensils className="w-48 h-48" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
            <AnimatePresence>
               {showSuccess && (
                 <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-amber-600 text-white p-6 rounded-3xl flex items-center gap-4 mb-8"
                  >
                    <CheckCircle2 className="w-8 h-8 shrink-0" />
                    <div>
                       <p className="font-black text-lg">Registro Realizado!</p>
                       <p className="text-amber-50 text-sm font-medium">Os dados da merenda foram publicados no Mural.</p>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>

             <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-black uppercase text-stone-400 tracking-widest">
                      <Calendar className="w-3.5 h-3.5" /> Data da Merenda
                    </label>
                    <input 
                      type="date" 
                      value={date}
                      readOnly
                      className="w-full bg-stone-50 border-2 border-stone-100 rounded-[2rem] px-6 py-5 font-bold text-stone-400 focus:outline-none transition-all text-lg"
                    />
                 </div>

                 <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-black uppercase text-stone-400 tracking-widest">
                      <Scale className="w-3.5 h-3.5" /> Turma Responsável
                    </label>
                    {profile?.role === 'teacher' ? (
                      <div className="w-full bg-amber-50 border-2 border-amber-100 rounded-[2rem] px-6 py-5 flex flex-col justify-center">
                        <p className="font-black text-amber-700 text-lg">
                          {classes.find((c: any) => c.id === classId)?.name || 'Sem turma'}
                        </p>
                        <p className="text-[10px] font-black text-amber-600/50 uppercase tracking-widest leading-none">Equipe: {classes.find((c: any) => c.id === classId)?.teamName || '-'}</p>
                      </div>
                    ) : (
                      <select 
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        disabled={!!profile && !isAdmin}
                        className="w-full bg-stone-50 border-2 border-stone-100 rounded-[2rem] px-6 py-5 font-bold text-stone-900 focus:outline-none focus:border-amber-500 transition-all text-lg cursor-pointer appearance-none disabled:opacity-75 disabled:cursor-not-allowed"
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

               <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-black uppercase text-stone-400 tracking-widest">
                    <Utensils className="w-3.5 h-3.5" /> O que foi servido hoje? (Cardápio)
                  </label>
                  <input 
                    type="text" 
                    value={menu}
                    onChange={(e) => setMenu(e.target.value)}
                    placeholder="Ex: Arroz, feijão, frango e salada"
                    className="w-full bg-stone-50 border-2 border-stone-100 rounded-[2rem] px-6 py-5 font-bold text-stone-900 focus:outline-none focus:border-amber-500 transition-all text-lg placeholder:text-stone-200"
                    required
                  />
               </div>

               <div className="space-y-4 pt-4">
                  <label className="flex items-center gap-2 text-xs font-black uppercase text-stone-400 tracking-widest">
                    <Scale className="w-3.5 h-3.5" /> Peso Total do Desperdício (Kg)
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.1"
                      min="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-stone-50 border-2 border-stone-100 rounded-[2.5rem] px-8 py-8 font-black text-amber-900 focus:outline-none focus:border-amber-500 transition-all text-6xl placeholder:text-stone-100"
                      required
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-amber-100 text-amber-800 px-6 py-3 rounded-2xl font-black text-lg uppercase tracking-widest">
                      KG
                    </div>
                  </div>
               </div>
            </div>

            <Button 
               type="submit" 
               className="w-full h-24 text-2xl shadow-2xl bg-amber-600 hover:bg-amber-700 shadow-amber-500/40 rounded-[2.5rem] mt-8 flex items-center justify-center gap-4 group"
               disabled={!menu || !quantity}
            >
               Publicar no Mural
               <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </Button>
          </form>
        </Card>
      </div>

      {/* Info Guide */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-8 bg-white rounded-[2rem] border-2 border-stone-100 flex flex-col gap-4">
            <h4 className="font-black text-stone-900 uppercase tracking-tighter">Por quê monitorar?</h4>
            <p className="text-stone-500 text-sm leading-relaxed">
              Resíduos orgânicos na escola vêm principalmente da merenda. Mapear o desperdício ajuda a ajustar a quantidade preparada e entender quais pratos os alunos mais gostam.
            </p>
         </div>
         <div className="p-8 bg-amber-950 rounded-[2rem] text-amber-100 flex flex-col gap-4">
            <h4 className="font-black text-white uppercase tracking-tighter">Critério de Aceitação</h4>
            <ul className="text-xs space-y-2 opacity-80 font-bold uppercase tracking-widest">
               <li className="flex justify-between"><span>&lt; 5kg</span> <span className="text-lime-400">Excelente</span></li>
               <li className="flex justify-between"><span>5kg - 10kg</span> <span className="text-amber-400">Boa</span></li>
               <li className="flex justify-between"><span>&gt; 10kg</span> <span className="text-rose-400">Regular / Alta</span></li>
            </ul>
         </div>
      </div>
    </div>
  );
}
