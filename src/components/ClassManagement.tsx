import React, { useState } from 'react';
import { Card, Button, Badge, Modal } from './UI';
import { Users, Trash2, Shield, Plus, Award, AlertTriangle } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-950 tracking-tighter uppercase underline decoration-lime-400 decoration-8 underline-offset-8 transition-all">Gestão de Turmas</h2>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-xs mt-4">Atribuição de professores e criação de equipes</p>
        </div>
        <div className="flex items-center gap-4">
           {classes.length > 0 && classes.some((c: any) => c.teacherId === '') && (
             <Button 
               variant="secondary" 
               className="text-[10px] h-10 border-rose-200 text-rose-500 hover:bg-rose-50"
               onClick={() => {
                 if (confirm('Deseja excluir todas as turmas exemplo (sem professor)?')) {
                   classes.filter((c: any) => c.teacherId === '').forEach((c: any) => deleteClass(c.id));
                 }
               }}
             >
               Limpar Exemplos
             </Button>
           )}
           <Users className="w-12 h-12 text-emerald-100 hidden md:block" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <Card title="Criar Nova Turma" icon={<Plus className="w-5 h-5" />}>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Nome da Turma</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: 1º Ano A"
                  className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-5 py-4 font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-stone-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Nome da Equipe</label>
                <input 
                  type="text" 
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Ex: Eco Pequenos"
                  className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-5 py-4 font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-stone-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Professor Responsável</label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-5 py-4 font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all appearance-none"
                  required
                >
                  <option value="">Selecione um Professor</option>
                  {users.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full h-16 shadow-lg shadow-emerald-500/20">
                Cadastrar Equipe
              </Button>
            </form>
          </Card>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...classes].sort((a: any, b: any) => a.name.localeCompare(b.name)).map((item: any) => {
              const level = getLevelInfo(item.points);
              return (
                <Card key={item.id} className="relative group flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="text-2xl font-black text-stone-900 leading-none tracking-tight">{item.name}</h4>
                      <p className="text-sm font-black text-emerald-600 uppercase tracking-widest">{item.teamName}</p>
                    </div>
                    <button 
                      onClick={() => setClassToDelete(item)}
                      className="text-stone-300 hover:text-rose-500 p-2 rounded-xl transition-all hover:bg-rose-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase text-stone-400 tracking-widest ml-1">Professor Responsável</label>
                    <select
                      value={item.teacherId || ''}
                      onChange={(e) => {
                        const selectedUser = users.find((u: any) => u.id === e.target.value);
                        assignTeacher(item.id, e.target.value, selectedUser?.name || '');
                      }}
                      className="w-full bg-emerald-50 border-2 border-emerald-100 rounded-xl px-4 py-3 text-xs font-bold text-emerald-900 focus:outline-none focus:border-emerald-500 appearance-none"
                    >
                      <option value="">Não atribuído</option>
                      {users.map((u: any) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-stone-50 rounded-2xl p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Award className="w-6 h-6 text-amber-500" />
                        <div>
                          <p className="text-[8px] font-black uppercase text-stone-400 tracking-widest leading-none">Pontuação</p>
                          <span className="text-xl font-black text-stone-900">{item.points}</span>
                        </div>
                     </div>
                     <Badge className={cn("text-[8px] px-3 font-black", level.color)}>
                       {level.label.split(' ')[0]}
                     </Badge>
                  </div>

                  <div className="mt-auto flex items-center gap-2 p-3 rounded-xl border border-dashed border-stone-200">
                     <Shield className="w-4 h-4 text-stone-300" />
                     <span className="text-[10px] font-black uppercase tracking-tight text-stone-500">{level.label}</span>
                  </div>
                </Card>
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
