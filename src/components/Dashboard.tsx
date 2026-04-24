import { Card, Badge, Button } from './UI';
import { Trophy, Target, Leaf, ArrowRight, Recycle, PlusCircle, Users, Camera, MessageSquare, Heart, Video, ImageIcon, Utensils, Scale, Gamepad2, HelpCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getLevelInfo } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#f97316', '#6366f1'];

export default function Dashboard({ classes, entries, missions, logs, onNavigate, isAdmin, profile }: any) {
  const activeMission = missions.find((m: any) => m.active);
  
  // Sort logs by date descending for the feed
  const recentLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Use only logs for the feed
  const combinedFeed = [
    ...recentLogs.map(l => ({ ...l, feedType: 'log' }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
  
  const totalEntries = entries.reduce((acc: number, curr: any) => acc + curr.quantity, 0);

  const residueData = entries.reduce((acc: any, curr: any) => {
    const existing = acc.find((d: any) => d.name === curr.type);
    if (existing) {
      existing.value += curr.quantity;
    } else {
      acc.push({ name: curr.type, value: curr.quantity });
    }
    return acc;
  }, []);

  const totalPoints = classes.reduce((acc: number, curr: any) => acc + curr.points, 0);

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-950 tracking-tighter uppercase underline decoration-lime-400 decoration-8 underline-offset-8 transition-all">
            Olá, Prof. {profile?.name?.split(' ')[0]}!
          </h2>
          {profile?.role === 'teacher' && (
            <p className="text-emerald-600 font-black uppercase text-xs tracking-widest mt-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Turma: {classes.find((c: any) => c.teacherId === profile.id)?.name || 'Nenhuma turma vinculada'}
            </p>
          )}
          <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px] mt-6 leading-relaxed max-w-2xl">
            "Educação não transforma o mundo. Educação muda as pessoas. Pessoas transformam o mundo."
          </p>
        </div>
        <div className="bg-emerald-100 px-6 py-4 rounded-[2rem] border-b-4 border-emerald-200">
          <p className="text-emerald-800 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Impacto Total</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-emerald-900 tracking-tighter">{totalPoints} pts</span>
            <Leaf className="w-6 h-6 text-emerald-600 fill-emerald-600" />
          </div>
        </div>
      </div>

      {/* Quick Access Shortcuts */}
      <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0">
        {[
          { id: 'data', label: 'Registrar', icon: PlusCircle, color: 'bg-lime-400' },
          { id: 'games', label: 'Games', icon: Gamepad2, color: 'bg-emerald-400' },
          { id: 'logs', label: 'Diário', icon: Camera, color: 'bg-sky-400' },
          { id: 'help', label: 'Ajuda', icon: HelpCircle, color: 'bg-indigo-400' }
        ].map((shortcut) => (
          <motion.button
            key={shortcut.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(shortcut.id)}
            className="bg-white p-3 md:p-6 rounded-full md:rounded-[2rem] border-2 border-stone-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col items-center gap-2 md:gap-3 text-center group shrink-0"
          >
            <div className={cn("p-3 md:p-4 rounded-full md:rounded-2xl text-emerald-900 shadow-sm md:shadow-lg group-hover:rotate-12 transition-transform", shortcut.color)}>
              <shortcut.icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="font-black text-[8px] md:text-[10px] uppercase tracking-widest text-stone-600 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
              {shortcut.label}
            </span>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Feed Column - Middle */}
        <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tighter flex items-center gap-3">
              <Camera className="w-6 h-6 text-emerald-500" />
              Linha do Tempo
            </h3>
          </div>

          {combinedFeed.length > 0 ? combinedFeed.map((item: any) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={item.id} 
              className="rounded-[2.5rem] border-2 overflow-hidden shadow-sm hover:shadow-md transition-all group bg-white border-stone-100"
            >
               <div className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black">
                     {item.teacherName?.substring(0, 2).toUpperCase() || 'TR'}
                  </div>
                  <div>
                    <h4 className="font-black text-stone-900 leading-tight">{item.teacherName || 'Professor'}</h4>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest leading-none mt-1">
                      {format(new Date(item.date), "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
               </div>
               
               <div className="px-6 pb-4 space-y-4">
                 <h5 className="text-xl font-black text-stone-800 leading-tight tracking-tight uppercase">{item.title}</h5>
                 <p className="text-stone-600 text-sm font-medium leading-relaxed">
                   {item.description}
                 </p>
               </div>

               <div className="relative aspect-video bg-stone-100">
                  {item.mediaType === 'image' ? (
                    <img src={item.mediaUrl} className="w-full h-full object-cover" alt={item.title} referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-emerald-950 flex flex-col items-center justify-center text-emerald-400 gap-2">
                      <Video className="w-16 h-16" />
                      <span className="font-black text-xs uppercase tracking-widest">Vídeo de Atividade</span>
                    </div>
                  )}
               </div>
               
               <div className="p-6 flex items-center justify-between border-t border-stone-100 bg-stone-50/20">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-stone-400 hover:text-emerald-500 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase">Apoiar</span>
                    </button>
                    <button className="flex items-center gap-2 text-stone-400 hover:text-emerald-500 transition-colors">
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Feedback</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/50 rounded-full border border-stone-100">
                     <Recycle className="w-3 h-3 text-emerald-600" />
                     <span className="text-[9px] font-black text-emerald-700 uppercase tracking-tighter">Impacto Social</span>
                  </div>
               </div>
            </motion.div>
          )) : (
            <div className="py-20 text-center bg-white border-4 border-dashed border-stone-100 rounded-[3rem]">
               <Camera className="w-16 h-16 text-stone-100 mx-auto mb-4" />
               <p className="text-stone-300 font-black uppercase tracking-widest">Inicie as postagens!</p>
            </div>
          )}
        </div>

        {/* Info Column - Right Side */}
        <div className="lg:col-span-5 space-y-8 order-1 lg:order-2">
          
          {/* Active Mission Banner */}
          <Card 
            title="Missão Ativa" 
            icon={<Target className="w-6 h-6" />}
            className="bg-emerald-900 text-white border-none overflow-hidden relative"
          >
            <div className="relative z-10">
              {activeMission ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="bg-lime-400 text-emerald-950">Ativa</Badge>
                    <span className="text-emerald-300 font-bold text-sm tracking-widest uppercase">+{activeMission.points} Pontos</span>
                  </div>
                  <h4 className="text-3xl font-black tracking-tight leading-tight">{activeMission.title}</h4>
                  <p className="text-emerald-100/80 leading-relaxed font-medium text-sm line-clamp-2">
                    {activeMission.description}
                  </p>
                  <button 
                    onClick={() => onNavigate('missions')}
                    className="flex items-center gap-2 text-lime-400 font-bold text-xs group"
                  >
                    Ver detalhes <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="py-6 text-center bg-emerald-800/30 rounded-2xl border border-emerald-700/50">
                  <p className="text-emerald-400 font-bold text-sm">Nenhuma missão ativa.</p>
                </div>
              )}
            </div>
            <div className="absolute -bottom-12 -right-12 opacity-10">
              <Recycle className="w-48 h-48 rotate-12" />
            </div>
          </Card>

          {/* Volume Summary */}
          <Card title="Volume Acumulado" icon={<Recycle className="w-6 h-6" />}>
            <div className="h-48 w-full mt-2">
              {residueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={residueData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {residueData.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-stone-100 rounded-2xl">
                  <Recycle className="w-10 h-10 text-stone-100" />
                  <p className="text-stone-300 font-bold text-sm tracking-tight italic">Sem dados...</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between text-stone-400 text-xs font-bold uppercase tracking-widest">
              <span>Total no Mês</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">{totalEntries} kg</span>
            </div>
          </Card>

          <Card className="bg-lime-50 border-lime-200">
              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-lime-400 rounded-2xl">
                       <Leaf className="w-6 h-6 text-emerald-900 fill-emerald-900" />
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-emerald-950 uppercase tracking-tighter">Status Geral</h3>
                       <p className="text-emerald-700/60 font-bold text-[9px] uppercase tracking-widest leading-none">Plataforma EcoTech</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/80 p-4 rounded-2xl border border-lime-200 text-center">
                       <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest mb-1">Turmas</p>
                       <p className="text-2xl font-black text-emerald-900 tracking-tighter">{classes.length}</p>
                    </div>
                    <div className="bg-white/80 p-4 rounded-2xl border border-lime-200 text-center">
                       <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest mb-1">Impactos</p>
                       <p className="text-2xl font-black text-emerald-900 tracking-tighter">{logs.length}</p>
                    </div>
                 </div>
              </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
