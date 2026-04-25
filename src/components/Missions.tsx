import React, { useState } from 'react';
import { Card, Button, Badge } from './UI';
import { Target, Plus, CheckCircle2, Trash2, Trophy, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Missions({ missions, classes, addMission, toggleMission, deleteMission, completeMission, isAdmin, profile }: any) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [points, setPoints] = useState('30');
  const [difficulty, setDifficulty] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Iniciante');
  const [selectedClass, setSelectedClass] = useState('');

  const activeMission = missions.find((m: any) => m.active);
  const teacherClass = classes.find((c: any) => c.teacherId === profile?.id);
  const canComplete = isAdmin || (!!teacherClass);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && desc) {
      addMission(title, desc, Number(points), difficulty);
      setTitle('');
      setDesc('');
      setDifficulty('Iniciante');
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Iniciante': return 'bg-emerald-50 text-emerald-600';
      case 'Intermediário': return 'bg-amber-50 text-amber-600';
      case 'Avançado': return 'bg-rose-50 text-rose-600';
      default: return 'bg-stone-50 text-stone-500';
    }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 w-fit rounded-full">
            <Target className="w-3 h-3 text-emerald-600" />
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Desafios</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tighter uppercase leading-none underline decoration-lime-400 decoration-8 underline-offset-8">
            Missões Eco
          </h2>
          <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] max-w-sm leading-relaxed">
             Participe de desafios exclusivos que valem pontos preciosos no ranking e transformam a realidade local.
          </p>
        </div>
        <div className="hidden md:block bg-stone-100 p-6 rounded-[2.5rem] border-2 border-dashed border-stone-200">
          <Target className="w-10 h-10 text-stone-300" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Active Mission - Main Bento Piece */}
        <div className="md:col-span-12 lg:col-span-8 space-y-8">
           {activeMission ? (
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-emerald-950 p-12 rounded-[3.5rem] text-white relative overflow-hidden group shadow-2xl shadow-emerald-900/40"
             >
                <div className="relative z-10 space-y-8">
                   <div className="flex flex-wrap items-center gap-4">
                      <Badge className="bg-lime-400 text-emerald-950 border-none font-black text-xs px-6 py-2 rounded-full tracking-widest">DESAFIO ATIVO</Badge>
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-[0.2em] bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                         <Clock className="w-3.5 h-3.5" />
                         <span>Expira em breve</span>
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                     <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase">{activeMission.title}</h3>
                     <p className="text-emerald-100/70 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">{activeMission.description}</p>
                   </div>
 
                   <div className="flex flex-wrap items-center gap-8 pt-4">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest leading-none mb-1">Recompensa</span>
                         <span className="text-3xl font-black text-lime-400 tracking-tighter">+{activeMission.points} EcoPontos</span>
                      </div>
                      <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest leading-none mb-1">Dificuldade</span>
                         <span className="text-xl font-black tracking-tighter">{activeMission.difficulty || 'Normal'}</span>
                      </div>
                   </div>
 
                   {canComplete && (
                     <div className="flex flex-col md:flex-row items-end gap-6 pt-6 border-t border-white/10">
                        {isAdmin ? (
                          <div className="flex-1 w-full space-y-3">
                             <label className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em] ml-1">Turma Vencedora</label>
                             <select 
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full bg-emerald-900/50 border-2 border-emerald-800 rounded-3xl px-6 py-5 font-black text-white focus:outline-none focus:border-lime-400 transition-all appearance-none shadow-inner"
                             >
                                <option value="">Escolha a turma...</option>
                                {classes.map((c: any) => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                             </select>
                          </div>
                        ) : (
                          <div className="flex-1 w-full space-y-3">
                             <label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-1">Sua Equipe</label>
                             <div className="w-full bg-emerald-900/30 border-2 border-emerald-800 rounded-3xl px-6 py-5 font-black text-white/50">
                               {teacherClass.name}
                             </div>
                          </div>
                        )}
                        <Button 
                           onClick={() => {
                             const targetClassId = isAdmin ? selectedClass : teacherClass.id;
                             if (targetClassId) {
                               completeMission(targetClassId, activeMission.id);
                               setSelectedClass('');
                             }
                           }}
                           disabled={isAdmin ? !selectedClass : !teacherClass}
                           className="h-20 w-full md:w-auto px-12 bg-lime-400 text-emerald-950 hover:bg-lime-500 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-lime-900/20 active:scale-95 transition-all"
                         >
                           Registrar Conquista
                        </Button>
                     </div>
                   )}
                </div>
                <div className="absolute -top-20 -right-20 opacity-[0.03] group-hover:scale-125 transition-transform duration-[2s] pointer-events-none">
                   <Trophy className="w-[30rem] h-[30rem] rotate-12" />
                </div>
             </motion.div>
           ) : (
             <div className="bg-stone-50 border-4 border-dashed border-stone-100 rounded-[3.5rem] py-32 flex flex-col items-center justify-center text-center px-8">
                <Target className="w-20 h-20 text-stone-200 mb-6" />
                <h3 className="text-3xl font-black text-stone-300 uppercase leading-none">Aguardando Missão</h3>
                <p className="text-stone-300 font-bold max-w-xs mt-2">Novas missões são publicadas semanalmente pela coordenação.</p>
             </div>
           )}
 
           {/* Secondary Grid Pieces */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {missions.filter((m:any) => !m.active).slice(0, 4).map((m: any) => (
                <motion.div 
                  key={m.id}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/30 flex flex-col justify-between group"
                >
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <div className={cn("p-4 rounded-2xl", getDifficultyColor(m.difficulty))}>
                            <Target className="w-6 h-6" />
                         </div>
                         <span className="text-xl font-black text-stone-900 tracking-tighter">+{m.points} EcoPontos</span>
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-stone-800 uppercase tracking-tighter leading-[0.95] mb-2">{m.title}</h4>
                        <p className="text-stone-400 text-[11px] font-bold uppercase tracking-widest mb-3">{m.difficulty}</p>
                        <p className="text-stone-500 text-sm font-medium line-clamp-2 leading-relaxed">{m.description}</p>
                      </div>
                   </div>
                   <div className="mt-8 flex gap-2">
                      {isAdmin && (
                        <>
                          <button 
                            onClick={() => toggleMission(m.id)}
                            className="flex-1 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-2xl hover:bg-emerald-700 transition-colors"
                          >
                            Ativar
                          </button>
                          <button 
                            onClick={() => deleteMission(m.id)}
                            className="p-4 bg-stone-50 text-stone-300 hover:text-rose-500 rounded-2xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
 
        {/* Right Sidebar Pieces */}
        <div className="md:col-span-12 lg:col-span-4 space-y-8">
           {isAdmin && (
             <Card className="rounded-[3rem] p-8 border-stone-100 shadow-2xl shadow-stone-200/40" title="Novo Desafio" icon={<Plus className="w-5 h-5" />}>
                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] ml-1">Nome</label>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Horta Comunitária"
                        className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-6 py-4 font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-stone-300"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] ml-1">Descrição</label>
                      <textarea 
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Instruções para os alunos..."
                        className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-6 py-4 font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all h-32 resize-none"
                      />
                   </div>
                   
                   <div className="grid grid-cols-3 gap-2">
                      {(['Iniciante', 'Intermediário', 'Avançado'] as const).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDifficulty(d)}
                          className={cn(
                            "py-3 rounded-xl font-black text-[8px] uppercase tracking-widest transition-all",
                            difficulty === d ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-stone-50 text-stone-400"
                          )}
                        >
                          {d}
                        </button>
                      ))}
                   </div>
 
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] ml-1">Ponto</label>
                      <div className="flex gap-2">
                         {[30, 50, 100, 200].map((p) => (
                           <button
                             key={p}
                             type="button"
                             onClick={() => setPoints(p.toString())}
                             className={cn(
                               "flex-1 py-3 rounded-xl font-black text-xs transition-all",
                               points === p.toString() ? "bg-stone-900 text-white" : "bg-stone-50 text-stone-400"
                             )}
                           >
                             {p}
                           </button>
                         ))}
                      </div>
                   </div>
 
                   <Button type="submit" className="w-full h-16 rounded-2xl shadow-xl shadow-emerald-100">
                      Criar Missão
                   </Button>
                </form>
             </Card>
           )}
           
           {/* Achievement Stats Piece */}
           <div className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/30 overflow-hidden relative group">
              <div className="relative z-10 flex flex-col h-full justify-between">
                 <div>
                    <h3 className="text-xl font-black text-stone-900 uppercase tracking-tighter leading-none mb-1">Mural de Glória</h3>
                    <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Últimas Conclusões</p>
                 </div>
                 
                 <div className="mt-8 space-y-4">
                    {classes.slice(0, 3).map((c: any, idx: number) => (
                      <div key={c.id} className="flex items-center gap-4 group/item">
                         <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center font-black text-stone-400 group-hover/item:bg-lime-400 group-hover/item:text-emerald-950 transition-colors">
                            {idx + 1}
                         </div>
                         <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-black text-stone-800 tracking-tight leading-none truncate mb-1">{c.name}</p>
                            <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest">{c.teamName}</p>
                         </div>
                         <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </div>
                    ))}
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 text-emerald-500/5 rotate-12 transition-transform group-hover:scale-110">
                 <CheckCircle2 className="w-48 h-48" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
