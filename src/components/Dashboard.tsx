import { Card, Badge, Button, Counter, Modal } from './UI';
import { 
  Trophy, 
  Target, 
  Leaf, 
  Recycle, 
  PlusCircle, 
  Users, 
  Camera, 
  MessageSquare, 
  Heart, 
  Video, 
  Utensils, 
  PieChart as LucidePieChart, 
  LayoutDashboard,
  Plus,
  Send,
  Loader2,
  X,
  Upload,
  Trash2,
  Gamepad2,
  HelpCircle,
  ImageIcon,
  PlayCircle,
  BookOpen
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useState, useRef } from 'react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#f97316', '#6366f1'];

export default function Dashboard({ 
  classes, 
  entries, 
  missions, 
  logs, 
  onNavigate, 
  isAdmin, 
  profile,
  addLog,
  deleteLog,
  supportLog,
  feedbackLog 
}: any) {
  const activeMission = missions.find((m: any) => m.active);
  
  // Log Creation State
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [logTitle, setLogTitle] = useState('');
  const [logDesc, setLogDesc] = useState('');
  const [logMedia, setLogMedia] = useState<string | null>(null);
  const [logMediaType, setLogMediaType] = useState<'image' | 'video'>('image');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [activeComments, setActiveComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    if (file.size > 800 * 1024) {
      alert('O arquivo é muito grande. Use arquivos de até 800KB.');
      return;
    }
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) return;

    setLogMediaType(isImage ? 'image' : 'video');
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogMedia(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (logTitle && logMedia && profile) {
      addLog(logTitle, logDesc, logMedia, logMediaType, profile.id, profile.name);
      setLogTitle('');
      setLogDesc('');
      setLogMedia(null);
      setIsAddingLog(false);
    }
  };

  // Sort logs by date descending for the feed
  const recentLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
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
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 w-fit rounded-full">
            <LayoutDashboard className="w-3 h-3 text-emerald-600" />
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Painel Geral</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tighter uppercase leading-none underline decoration-lime-400 decoration-8 underline-offset-8">
            Olá, prof. <span className="text-emerald-600">{profile?.name || 'Visitante'}</span>!
          </h2>
          <p className="text-stone-500 font-medium italic text-xs max-w-lg leading-relaxed">
             "Educação não transforma o mundo. Educação muda as pessoas. Pessoas transformam o mundo." <span className="text-stone-400 not-italic font-black uppercase tracking-widest text-[9px] ml-2">— Paulo Freire</span>
          </p>
        </div>
        <div className="hidden md:block bg-stone-100 p-6 rounded-[2.5rem] border-2 border-dashed border-stone-200">
          <LayoutDashboard className="w-10 h-10 text-stone-300" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,_auto)]">
        {/* Impact Summary - Large Card */}
        <div className="md:col-span-8 lg:col-span-6 row-span-1 bg-white p-8 rounded-[2.5rem] border-2 border-stone-100 shadow-xl shadow-stone-200/40 flex flex-col justify-between group overflow-hidden relative">
           <div className="relative z-10">
              <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Impacto na Comunidade</p>
              <h3 className="text-6xl font-black text-stone-900 tracking-tighter leading-none mb-4">
                <Counter value={totalPoints} /> <span className="text-emerald-500">EcoPontos</span>
              </h3>
              <p className="text-stone-500 font-medium text-sm max-w-xs leading-relaxed">
                Nossa escola está transformando o futuro através de ações sustentáveis diárias. Continue assim!
              </p>
           </div>
           <div className="absolute top-8 right-8 p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Leaf className="w-8 h-8 fill-emerald-600" />
           </div>
           <div className="absolute -bottom-10 -right-10 opacity-5 rotate-12 pointer-events-none">
              <Trophy className="w-64 h-64" />
           </div>
        </div>

        {/* Quick Access - Bento Style Grid within Bento */}
        <div className="md:col-span-4 lg:col-span-3 row-span-1 grid grid-cols-2 gap-4">
          {[
            { id: 'data', label: 'Registrar', icon: PlusCircle, color: 'bg-emerald-500', text: 'text-white' },
            { id: 'games', label: 'Games', icon: Gamepad2, color: 'bg-white', text: 'text-stone-900' },
            { id: 'missions', label: 'Missões', icon: Target, color: 'bg-white', text: 'text-stone-900' },
            { id: 'play', label: 'Eco Play', icon: PlayCircle, color: 'bg-white', text: 'text-stone-900' }
          ].map((shortcut) => (
            <motion.button
              key={shortcut.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(shortcut.id)}
              className={cn(
                "p-4 rounded-3xl border transition-all flex flex-col items-center justify-center gap-3 text-center shadow-lg relative group overflow-hidden",
                shortcut.color,
                shortcut.color === 'bg-white' ? "border-stone-100 shadow-stone-200/40" : "border-emerald-400 shadow-emerald-200/40"
              )}
            >
              <div className={cn(
                "p-2.5 rounded-xl transition-transform group-hover:rotate-12",
                shortcut.color === 'bg-white' ? "bg-stone-50 text-stone-900" : "bg-white/20 text-white"
              )}>
                <shortcut.icon className="w-5 h-5" />
              </div>
              <span className={cn("font-black text-[10px] uppercase tracking-tighter", shortcut.text)}>{shortcut.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Active Mission - Medium Card */}
        <div 
          onClick={() => onNavigate('missions')}
          className="md:col-span-6 lg:col-span-3 row-span-1 bg-emerald-950 p-8 rounded-[2.5rem] text-white overflow-hidden relative cursor-pointer group hover:ring-4 hover:ring-emerald-500/20 transition-all"
        >
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="success" className="bg-lime-400 text-emerald-950">Missão Ativa</Badge>
              <Target className="w-5 h-5 text-emerald-500" />
            </div>
            {activeMission ? (
              <div>
                <h4 className="text-xl font-black tracking-tight leading-tight uppercase line-clamp-1">{activeMission.title}</h4>
                <p className="text-emerald-500 font-bold text-xs mt-2">+{activeMission.points} EcoPontos</p>
              </div>
            ) : (
              <p className="text-emerald-700 font-bold text-xs">Sem missões ativas no momento.</p>
            )}
          </div>
          <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
             <Recycle className="w-40 h-40" />
          </div>
        </div>


        {/* Timeline Feed - Tall Column */}
        <div className="md:col-span-7 lg:col-span-8 row-span-2 space-y-6">
           <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <Camera className="w-6 h-6 text-emerald-500" />
                <h3 className="text-xl font-black text-stone-900 uppercase tracking-tighter">Últimas do Mural</h3>
              </div>
              <button 
                onClick={() => setIsAddingLog(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
              >
                <Plus className="w-3 h-3" /> Postar Novo
              </button>
           </div>

           {/* Post Modal */}
           <Modal isOpen={isAddingLog} onClose={() => setIsAddingLog(false)} title="Novo Registro Visual">
             <form onSubmit={handleLogSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Título do Evento</label>
                   <input 
                     type="text" 
                     value={logTitle}
                     onChange={(e) => setLogTitle(e.target.value)}
                     placeholder="Ex: Horta Organizada"
                     className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-5 py-4 font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
                     required
                   />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Upload de Mídia</label>
                  <div 
                    className={cn(
                      "relative border-4 border-dashed rounded-[2.5rem] transition-all flex flex-col items-center justify-center p-10 min-h-[260px] text-center gap-4",
                      dragActive ? "border-emerald-500 bg-emerald-50" : "border-stone-100 bg-stone-50 hover:border-emerald-200",
                      logMedia ? "border-emerald-200 bg-white" : ""
                    )}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
                    }}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      accept="image/*,video/*"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />

                    {isUploading ? (
                      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                    ) : logMedia ? (
                      <div className="relative w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl aspect-video bg-black">
                        {logMediaType === 'image' ? (
                          <img src={logMedia} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-emerald-400 gap-2 font-black uppercase text-[10px]">
                            <Video className="w-12 h-12" />
                            Vídeo Pronto
                          </div>
                        )}
                        <button type="button" onClick={() => setLogMedia(null)} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-rose-500 transition-colors shadow-lg"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <div className="cursor-pointer group flex flex-col items-center" onClick={() => fileInputRef.current?.click()}>
                        <div className="p-5 bg-white rounded-3xl shadow-sm mb-4 group-hover:scale-110 group-hover:shadow-emerald-100 transition-all">
                          <Upload className="w-8 h-8 text-emerald-500" />
                        </div>
                        <p className="text-sm font-black text-stone-900 leading-none mb-2">Selecione uma Imagem ou Vídeo</p>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Tamanho máximo: 800KB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Descrição</label>
                  <textarea 
                    value={logDesc}
                    onChange={(e) => setLogDesc(e.target.value)}
                    placeholder="Conte o que aconteceu..."
                    className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-5 py-4 font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all h-24 resize-none shadow-inner"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                   <Button type="button" variant="ghost" onClick={() => setIsAddingLog(false)} className="flex-1 rounded-2xl">Cancelar</Button>
                   <Button type="submit" disabled={!logMedia || isUploading} className="flex-[2] h-16 rounded-[1.5rem] shadow-xl shadow-emerald-500/20 text-xs tracking-widest uppercase">Publicar no Mural</Button>
                </div>
             </form>
           </Modal>
           
           <div className="space-y-8">
             {recentLogs.length > 0 ? recentLogs.map((item: any) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={item.id} 
                  className="rounded-[3rem] bg-white border border-stone-50 overflow-hidden shadow-2xl shadow-stone-200/20 group"
                >
                   <div className="flex flex-col md:flex-row md:min-h-56">
                      <div className="md:w-2/5 relative bg-stone-100 overflow-hidden">
                        {item.mediaType === 'image' ? (
                          <img src={item.mediaUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full bg-emerald-950 flex flex-col items-center justify-center text-emerald-400 gap-2">
                            <Video className="w-12 h-12" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Digital Eco</span>
                          </div>
                        )}
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                           <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-stone-900 shadow-xl flex items-center gap-2">
                              <Heart className={cn("w-4 h-4 transition-all", (item.likes || 0) > 0 ? "fill-rose-500 text-rose-500" : "text-stone-300")} />
                              <span className="text-[10px] font-black">{item.likes || 0}</span>
                           </div>
                        </div>
                        {(isAdmin || item.teacherId === profile?.id) && (
                          <button 
                            onClick={() => deleteLog(item.id)}
                            className="absolute top-6 right-6 p-2.5 bg-rose-500 text-white rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="md:w-3/5 p-8 flex flex-col justify-between">
                         <div className="space-y-3">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-[10px] font-black text-emerald-700 border border-emerald-200">
                                    {item.teacherName?.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest leading-none mb-0.5">{item.teacherName}</p>
                                    <p className="text-[8px] font-bold text-stone-300 uppercase tracking-[0.2em] leading-none">Educador Eco</p>
                                  </div>
                               </div>
                               <div className="bg-stone-50 px-3 py-1 rounded-full border border-stone-100">
                                 <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest leading-none">
                                   {format(new Date(item.date), "dd MMM", { locale: ptBR })}
                                 </span>
                               </div>
                            </div>
                            <h5 className="font-black text-stone-900 text-2xl tracking-tighter uppercase leading-none mt-2">{item.title}</h5>
                            <p className="text-stone-500 text-sm font-medium line-clamp-3 leading-relaxed">
                              {item.description}
                            </p>
                         </div>
                         
                         <div className="mt-6">
                            <div className="flex items-center gap-6 pt-6 border-t border-stone-50">
                               <button 
                                 onClick={() => supportLog(item.id)} 
                                 className="flex items-center gap-2 group/btn"
                               >
                                  <div className={cn(
                                    "p-2 rounded-xl transition-all group-hover/btn:scale-110",
                                    (item.likes || 0) > 0 ? "bg-rose-50 text-rose-500 shadow-lg shadow-rose-100" : "bg-stone-50 text-stone-300"
                                  )}>
                                    <Heart className={cn("w-5 h-5", (item.likes || 0) > 0 && "fill-rose-500")} />
                                  </div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 group-hover/btn:text-rose-500 transition-colors">Apoiar</p>
                               </button>

                               <button 
                                 onClick={() => setActiveComments(activeComments === item.id ? null : item.id)} 
                                 className="flex items-center gap-2 group/btn"
                               >
                                  <div className={cn(
                                    "p-2 rounded-xl transition-all group-hover/btn:scale-110",
                                    activeComments === item.id ? "bg-sky-50 text-sky-500 shadow-lg shadow-sky-100" : "bg-stone-50 text-stone-300"
                                  )}>
                                    <MessageSquare className="w-5 h-5" />
                                  </div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 group-hover/btn:text-sky-500 transition-colors">Visualizar</p>
                               </button>
                            </div>

                            <AnimatePresence>
                              {activeComments === item.id && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden bg-stone-50/50 rounded-3xl mt-6 border border-stone-100"
                                >
                                  <div className="p-6 space-y-4">
                                    <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar pr-2">
                                      {(item.feedbacks || []).map((fb: any) => (
                                        <div key={fb.id} className="bg-white p-4 rounded-2xl border border-stone-50 shadow-sm relative">
                                          <div className="flex items-center justify-between mb-2">
                                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{fb.userName}</p>
                                            <p className="text-[8px] font-bold text-stone-300 uppercase italic">Feedback</p>
                                          </div>
                                          <p className="text-xs text-stone-600 font-medium leading-relaxed">{fb.text}</p>
                                        </div>
                                      ))}
                                      {(item.feedbacks || []).length === 0 && (
                                        <div className="py-8 text-center bg-white/50 rounded-2xl border-2 border-dashed border-stone-100">
                                          <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Seja o primeiro a comentar!</p>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                      <input 
                                        type="text" 
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        onKeyPress={(e) => {
                                          if (e.key === 'Enter' && commentText.trim()) {
                                            feedbackLog(item.id, commentText, profile?.name || 'Visitante');
                                            setCommentText('');
                                          }
                                        }}
                                        placeholder="Escreva algo inspirador..."
                                        className="flex-1 bg-white border-2 border-stone-50 rounded-2xl px-5 py-4 text-xs font-bold text-stone-900 focus:outline-none focus:border-emerald-500 placeholder:text-stone-300 transition-all shadow-sm"
                                      />
                                      <button 
                                        onClick={() => {
                                          if (commentText.trim()) {
                                            feedbackLog(item.id, commentText, profile?.name || 'Visitante');
                                            setCommentText('');
                                          }
                                        }}
                                        className="px-6 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100"
                                      >
                                        <Send className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                         </div>
                      </div>
                   </div>
                </motion.div>
             )) : (
                <div className="py-24 text-center bg-white border-4 border-dashed border-stone-100 rounded-[3.5rem] flex flex-col items-center gap-4">
                   <div className="p-4 bg-stone-50 rounded-full">
                    <ImageIcon className="w-12 h-12 text-stone-200" />
                   </div>
                   <div>
                    <p className="text-stone-300 font-black uppercase tracking-[0.2em] text-sm">O Mural está em silêncio</p>
                    <p className="text-stone-200 text-xs font-bold mt-1 max-w-[200px] mx-auto leading-relaxed">Inspire a escola postando as conquistas da sua turma.</p>
                   </div>
                </div>
             )}
           </div>
        </div>

        {/* Stats Column - Right Side */}
        <div className="md:col-span-5 lg:col-span-4 row-span-2 space-y-6">
           {/* Volume Chart */}
           <Card title="Resíduos Acumulados" icon={<Recycle className="w-6 h-6" />} className="rounded-[2.5rem] shadow-xl shadow-stone-200/40 border-stone-100">
              <div className="h-48 w-full">
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
                  <div className="h-full flex items-center justify-center text-stone-200">
                    <Recycle className="w-12 h-12 animate-pulse" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-stone-100">
                 <div>
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Total Coletado</p>
                    <p className="text-xl font-black text-stone-900 tracking-tighter">{totalEntries} kg</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Atividades</p>
                    <p className="text-xl font-black text-emerald-600 tracking-tighter">+{logs.length}</p>
                 </div>
              </div>
           </Card>

           {/* Small Status Card */}
           <div className="bg-lime-400 p-8 rounded-[2.5rem] shadow-xl shadow-lime-200/50 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                 <h4 className="text-2xl font-black text-emerald-950 tracking-tighter uppercase leading-none mb-2">Comunidade</h4>
                 <p className="text-emerald-900/60 font-bold text-[10px] uppercase tracking-widest">{classes.length} Turmas Engajadas</p>
              </div>
              <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar">
                 {classes.slice(0, 3).map((c: any) => (
                    <div key={c.id} className="bg-white/40 backdrop-blur-md px-3 py-2 rounded-xl text-[10px] font-black text-emerald-900 border border-white/50">
                       {c.name}
                    </div>
                 ))}
              </div>
              <div className="absolute -top-6 -right-6 text-emerald-900/5 rotate-in group-hover:scale-110 transition-transform">
                 <Users className="w-32 h-32" />
              </div>
           </div>

           {/* Reports Shortcut */}
           <Card className="bg-blue-50 border-blue-100 rounded-[2.5rem] hover:ring-4 hover:ring-blue-500/10 transition-all cursor-pointer shadow-xl shadow-blue-200/30" 
                 onClick={() => onNavigate('reports')}>
              <div className="flex items-center justify-between">
                 <div>
                    <h5 className="font-black text-blue-900 uppercase tracking-tighter text-lg">Métricas Escolares</h5>
                    <p className="text-blue-700/60 font-bold text-[9px] uppercase tracking-widest">Gráficos de Desempenho</p>
                 </div>
                 <div className="p-3 bg-blue-500 text-white rounded-2xl">
                    <LucidePieChart className="w-5 h-5" />
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
