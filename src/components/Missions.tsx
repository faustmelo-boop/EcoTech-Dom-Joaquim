import React, { useState } from 'react';
import { Card, Button, Badge } from './UI';
import { Target, Plus, CheckCircle2, Trash2, Trophy, Clock } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tighter uppercase underline decoration-lime-400 decoration-8 underline-offset-8 transition-all">Missões Eco</h2>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-xs mt-4">Desafios que valem pontos e mudam o mundo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Active and List */}
        <div className={cn("space-y-8", isAdmin ? "lg:col-span-2" : "lg:col-span-3")}>
           {activeMission && (
             <Card className="bg-emerald-900 text-white border-none p-10 relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center gap-2">
                      <Badge className="bg-lime-400 text-emerald-900 border-none font-black text-xs px-4">MISSÃO ATIVA</Badge>
                      {activeMission.difficulty && (
                         <Badge className="bg-emerald-800 text-emerald-300 border-none font-black text-[10px] px-3">
                           {activeMission.difficulty}
                         </Badge>
                      )}
                      <div className="flex items-center gap-2 text-emerald-200 ml-auto">
                         <Clock className="w-4 h-4" />
                         <span className="font-bold text-xs uppercase tracking-widest">Tempo Limitado</span>
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                     <h3 className="text-5xl font-black tracking-tighter leading-tight">{activeMission.title}</h3>
                     <p className="text-emerald-100/70 text-lg font-medium max-w-xl">{activeMission.description}</p>
                   </div>

                   {canComplete && (
                     <div className="flex flex-col md:flex-row items-end gap-6 pt-4">
                        {isAdmin ? (
                          <div className="flex-1 w-full space-y-2">
                             <label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-1">Completar para Turma:</label>
                             <select 
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full bg-emerald-800 border-2 border-emerald-700/50 rounded-2xl px-5 py-4 font-bold text-white focus:outline-none focus:border-lime-400 transition-all appearance-none"
                             >
                                <option value="">Selecione a turma vencedora...</option>
                                {classes.map((c: any) => (
                                  <option key={c.id} value={c.id}>{c.name} - {c.teamName}</option>
                                ))}
                             </select>
                          </div>
                        ) : (
                          <div className="flex-1 w-full space-y-2">
                             <label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest ml-1">Sua Turma:</label>
                             <div className="w-full bg-emerald-800/50 border-2 border-emerald-700/50 rounded-2xl px-5 py-4 font-bold text-white">
                               {teacherClass.name} - {teacherClass.teamName}
                             </div>
                          </div>
                        )}
                        <Button 
                           onClick={() => {
                             const targetClassId = isAdmin ? selectedClass : teacherClass.id;
                             if (targetClassId) {
                               completeMission(targetClassId, activeMission.id);
                               setSelectedClass('');
                               alert('Pontos de missão adicionados com sucesso!');
                             }
                           }}
                           disabled={isAdmin ? !selectedClass : !teacherClass}
                           className="h-16 w-full md:w-auto px-10 bg-lime-400 text-emerald-950 hover:bg-lime-500 rounded-2xl"
                         >
                           Concluir Missão & Ganhar {activeMission.points} pts
                        </Button>
                     </div>
                   )}
                </div>
                <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                   <Trophy className="w-80 h-80 rotate-12" />
                </div>
             </Card>
           )}

           <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-stone-400 tracking-[0.3em] ml-2">Banco de Desafios</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {missions.map((m: any) => (
                  <Card key={m.id} className={cn("relative p-6 border-2 transition-all", m.active ? "border-emerald-500 bg-emerald-50" : "border-stone-100")}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                         <div className="flex gap-2">
                           <div className={cn("p-3 rounded-xl", m.active ? "bg-emerald-500 text-white" : "bg-stone-50 text-stone-400")}>
                              <Target className="w-5 h-5" />
                           </div>
                           {m.difficulty && (
                             <div className={cn("px-3 py-1 rounded-lg text-[8px] font-black uppercase flex items-center", getDifficultyColor(m.difficulty))}>
                               {m.difficulty}
                             </div>
                           )}
                         </div>
                         {isAdmin && (
                           <button 
                              onClick={() => deleteMission(m.id)}
                              className="text-stone-300 hover:text-rose-500 p-2 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                           </button>
                         )}
                      </div>
                      
                      <div>
                        <h5 className="font-black text-stone-900 text-lg leading-tight uppercase mb-1">{m.title}</h5>
                        <p className="text-xs text-stone-500 font-medium line-clamp-2">{m.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-emerald-700 font-black text-sm">{m.points} pts</span>
                        {isAdmin && (
                          <button 
                             onClick={() => toggleMission(m.id)}
                             className={cn(
                               "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                               m.active ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-400 hover:bg-stone-200"
                             )}
                          >
                            {m.active ? 'Ativa' : 'Ativar'}
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
           </div>
        </div>

        {/* Create Sidebar */}
        {isAdmin && (
          <div className="lg:col-span-1">
             <Card title="Criar Nova Missão" icon={<Plus className="w-5 h-5" />}>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Título da Missão</label>
                     <input 
                       type="text" 
                       value={title}
                       onChange={(e) => setTitle(e.target.value)}
                       placeholder="Ex: Horta Comunitária"
                       className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-5 py-4 font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-stone-300"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Instruções</label>
                     <textarea 
                       value={desc}
                       onChange={(e) => setDesc(e.target.value)}
                       placeholder="Descreva o desafio para os alunos..."
                       className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-5 py-4 font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-stone-300 h-32 resize-none"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Dificuldade</label>
                     <div className="flex gap-2">
                        {(['Iniciante', 'Intermediário', 'Avançado'] as const).map((d) => (
                          <button
                           key={d}
                           type="button"
                           onClick={() => setDifficulty(d)}
                           className={cn(
                             "flex-1 py-3 rounded-xl font-black text-[10px] transition-all",
                             difficulty === d ? "bg-emerald-600 text-white" : "bg-stone-50 text-stone-400 border border-stone-100"
                           )}
                          >
                            {d}
                          </button>
                        ))}
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Pontuação Sugerida</label>
                     <div className="flex gap-2">
                        {[20, 30, 50, 100, 200].map((p) => (
                          <button
                           key={p}
                           type="button"
                           onClick={() => setPoints(p.toString())}
                           className={cn(
                             "flex-1 py-3 rounded-xl font-black text-xs transition-all",
                             points === p.toString() ? "bg-emerald-600 text-white" : "bg-stone-50 text-stone-400 border border-stone-100"
                           )}
                          >
                            {p}
                          </button>
                        ))}
                     </div>
                   </div>
                   <Button type="submit" className="w-full h-16 shadow-lg shadow-emerald-500/20">
                      Criar Desafio
                   </Button>
                </form>
             </Card>
          </div>
        )}
      </div>
    </div>
  );
}
