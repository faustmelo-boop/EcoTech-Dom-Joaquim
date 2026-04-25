import React, { useState } from 'react';
import { Card, Button, Badge, Modal } from './UI';
import { Users, Trash2, Shield, Plus, Award, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getLevelInfo } from '../types';
import { cn } from '../lib/utils';

export default function ClassManagement({ classes, users, addClass, deleteClass, assignTeacher, isAdmin }: any) {
  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [classToDelete, setClassToDelete] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && teamName && teacherId) {
      addClass(name, teamName, teacherId);
      setName('');
      setTeamName('');
      setTeacherId('');
    }
  };

  const confirmDelete = () => {
    if (classToDelete) {
      deleteClass(classToDelete.id);
      setClassToDelete(null);
    }
  };

  if (!isAdmin) {
    // ... rest of restricted access ...
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="bg-rose-100 p-6 rounded-full text-rose-500">
           <Shield className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-black text-rose-950 uppercase tracking-tighter">Acesso Restrito</h3>
        <p className="text-stone-500 font-bold max-w-sm">Apenas administradores podem gerenciar as turmas e equipes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 w-fit rounded-full">
            <Users className="w-3 h-3 text-emerald-600" />
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Administração</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tighter uppercase leading-none underline decoration-lime-400 decoration-8 underline-offset-8">
            Gestão de Turmas
          </h2>
          <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] max-w-sm leading-relaxed">
             Crie novas equipes, atribua professores e monitore o engajamento das turmas.
          </p>
        </div>
        <div className="flex items-center gap-4">
           {classes.length > 0 && classes.some((c: any) => c.teacherId === '') && (
             <Button 
               variant="secondary" 
               className="text-[10px] h-10 border-rose-200 text-rose-500 hover:bg-rose-50 rounded-2xl"
               onClick={() => {
                 if (confirm('Deseja excluir todas as turmas exemplo (sem professor)?')) {
                   classes.filter((c: any) => c.teacherId === '').forEach((c: any) => deleteClass(c.id));
                 }
               }}
             >
               Limpar Exemplos
             </Button>
           )}
           <div className="hidden md:block bg-stone-100 p-6 rounded-[2.5rem] border-2 border-dashed border-stone-200">
             <Users className="w-10 h-10 text-stone-300" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[minmax(180px,_auto)]">
        {/* Form - Bento Sidebar Piece */}
        <div className="md:col-span-12 lg:col-span-4 lg:row-span-2">
          <Card title="Nova Equipe" icon={<Plus className="w-5 h-5" />} className="h-full rounded-[3rem] p-10 shadow-2xl shadow-stone-200/40 border-stone-100 flex flex-col">
            <form onSubmit={handleSubmit} className="space-y-8 mt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] ml-1">Identificação da Turma</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: 1º Ano A"
                  className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-6 py-5 font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-stone-300 shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] ml-1">Nome de Guerra (Equipe)</label>
                <input 
                  type="text" 
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Ex: Guardiões da Natureza"
                  className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-6 py-5 font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-stone-300 shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] ml-1">Professor Responsável</label>
                <div className="relative group/select">
                   <select
                     value={teacherId}
                     onChange={(e) => setTeacherId(e.target.value)}
                     className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-6 py-5 font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer shadow-inner pr-12"
                     required
                   >
                     <option value="">Selecione um Educador</option>
                     {users.map((u: any) => (
                       <option key={u.id} value={u.id}>{u.name}</option>
                     ))}
                   </select>
                </div>
              </div>
              <Button type="submit" className="w-full h-20 rounded-[1.5rem] bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-900/20 font-black uppercase tracking-[0.2em] text-[10px]">
                Consolidar Equipe
              </Button>
            </form>

            <div className="mt-12 bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100/50 flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Shield className="w-6 h-6 text-emerald-500" />
               </div>
               <p className="text-[10px] font-bold text-emerald-700 leading-relaxed uppercase tracking-tight">Todas as turmas devem ter um professor para realizar registros.</p>
            </div>
          </Card>
        </div>

        {/* Classes List - Grid Interaction Piece */}
        <div className="md:col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...classes].sort((a: any, b: any) => a.name.localeCompare(b.name)).map((item: any, index: number) => {
              const level = getLevelInfo(item.points);
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "rounded-[3rem] bg-white border border-stone-100 p-8 shadow-xl shadow-stone-200/40 relative overflow-hidden group flex flex-col justify-between min-h-[300px] transition-all hover:shadow-2xl hover:border-emerald-100",
                    index % 3 === 0 ? "md:col-span-1" : ""
                  )}
                >
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <h4 className="text-3xl font-black text-stone-900 tracking-tighter leading-none">{item.name}</h4>
                           <Badge className={cn("text-[8px] font-black uppercase tracking-widest px-3", level.color)}>{level.label.split(' ')[0]}</Badge>
                        </div>
                        <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">{item.teamName}</p>
                      </div>
                      <button 
                        onClick={() => setClassToDelete(item)}
                        className="text-stone-300 hover:text-rose-500 p-3 bg-stone-50 rounded-[1.25rem] transition-all hover:bg-rose-50 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-stone-400 tracking-widest ml-1">Educador(a) em Campo</label>
                      <div className="relative">
                        <select
                          value={item.teacherId || ''}
                          onChange={(e) => {
                            const selectedUser = users.find((u: any) => u.id === e.target.value);
                            assignTeacher(item.id, e.target.value, selectedUser?.name || '');
                          }}
                          className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-5 py-4 text-xs font-black text-stone-700 focus:outline-none focus:border-emerald-500 appearance-none transition-all"
                        >
                          <option value="">Não atribuído</option>
                          {users.map((u: any) => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between pt-6 border-t border-stone-100">
                     <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                           <Award className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                           <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest leading-none">Pontuação Total</p>
                           <span className="text-2xl font-black text-stone-900 tracking-tighter">{item.points}</span>
                        </div>
                     </div>
                     <div className="flex flex-col items-end">
                         <span className="text-[8px] font-black uppercase text-stone-300 tracking-widest">Nível Atual</span>
                         <span className="text-xs font-black text-stone-500 uppercase tracking-tight">{level.label}</span>
                     </div>
                  </div>

                  <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000 rotate-12">
                     <Users className="w-48 h-48" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={!!classToDelete} 
        onClose={() => setClassToDelete(null)}
        title="Confirmar Exclusão"
      >
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 bg-rose-100 rounded-[2rem] flex items-center justify-center mx-auto text-rose-500">
             <AlertTriangle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
             <p className="text-stone-500 font-bold leading-relaxed">
               Você está prestes a excluir a turma <span className="text-stone-900 font-black">{classToDelete?.name}</span> ({classToDelete?.teamName}).
             </p>
             <p className="text-rose-500 text-xs font-black uppercase tracking-widest">Essa ação não pode ser desfeita!</p>
          </div>
          <div className="flex gap-4">
             <Button 
               variant="secondary" 
               className="flex-1 h-14" 
               onClick={() => setClassToDelete(null)}
             >
               Cancelar
             </Button>
             <Button 
               variant="danger" 
               className="flex-1 h-14 shadow-lg shadow-rose-500/20" 
               onClick={confirmDelete}
             >
               Sim, Excluir
             </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
