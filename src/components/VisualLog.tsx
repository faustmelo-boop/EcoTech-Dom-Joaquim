import React, { useState, useRef } from 'react';
import { Card, Button } from './UI';
import { 
  Camera, 
  Plus, 
  Trash2, 
  ImageIcon, 
  Video, 
  Calendar, 
  Upload, 
  X, 
  Loader2, 
  Heart, 
  MessageSquare, 
  Send 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function VisualLog({ logs, addLog, deleteLog, supportLog, feedbackLog, profile, isAdmin }: any) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [mediaData, setMediaData] = useState<string | null>(null);
  const [type, setType] = useState<'image' | 'video'>('image');
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [activeComments, setActiveComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;

    // Limit size to 600KB for Firestore documents (1MB absolute limit including base64 overhead)
    if (file.size > 600 * 1024) {
      alert('O arquivo é muito grande. Para garantir o salvamento, use arquivos de até 600KB. Tente reduzir a resolução ou duração do vídeo.');
      return;
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      alert('Por favor, selecione uma imagem ou um vídeo de formato válido (MP4, PNG, JPG).');
      return;
    }

    setType(isImage ? 'image' : 'video');
    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaData(reader.result as string);
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Erro ao ler o arquivo. Tente novamente.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && mediaData && profile) {
      addLog(title, desc, mediaData, type, profile.id, profile.name);
      setTitle('');
      setDesc('');
      setMediaData(null);
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tighter uppercase underline decoration-lime-400 decoration-8 underline-offset-8 transition-all">Diário de Bordo</h2>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-xs mt-4">Registrando nossas conquistas em fotos e vídeos</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="rounded-full px-8 h-14">
            <Plus className="w-5 h-5" /> Novo Registro
          </Button>
        )}
      </div>

      {isAdding && (
        <Card title="Novo Registro Visual" icon={<Camera className="w-5 h-5" />} className="max-w-2xl mx-auto border-emerald-200">
           <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-1 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Título do Evento</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Horta Organizada"
                      className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-5 py-4 font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all"
                      required
                    />
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Upload de Mídia</label>
                
                <div 
                  className={cn(
                    "relative border-4 border-dashed rounded-[2rem] transition-all flex flex-col items-center justify-center p-8 min-h-[240px] text-center gap-4",
                    dragActive ? "border-emerald-500 bg-emerald-50" : "border-stone-100 bg-stone-50 hover:border-emerald-200",
                    mediaData ? "border-emerald-200 bg-white" : ""
                  )}
                  onDragEnter={onDrag}
                  onDragLeave={onDrag}
                  onDragOver={onDrag}
                  onDrop={onDrop}
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept="image/*,video/*"
                    onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                  />

                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                      <span className="font-bold text-emerald-900">Processando arquivo...</span>
                    </div>
                  ) : mediaData ? (
                    <div className="relative w-full max-w-sm rounded-[1.5rem] overflow-hidden shadow-xl aspect-video bg-black">
                      {type === 'image' ? (
                        <img src={mediaData} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-emerald-400 gap-2">
                          <Video className="w-12 h-12" />
                          <span className="text-xs font-black uppercase">Vídeo Selecionado</span>
                        </div>
                      )}
                      <button 
                        type="button"
                        onClick={() => setMediaData(null)}
                        className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-rose-500 text-white rounded-full transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="p-5 bg-white rounded-[1.5rem] shadow-sm">
                        <Upload className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-stone-900">Arraste ou clique para enviar</p>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Fotos ou vídeos curtos (max 600kb)</p>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      >
                        Selecionar Arquivo
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest ml-1">Descrição</label>
                <textarea 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Conte o que aconteceu..."
                  className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl px-5 py-4 font-bold text-stone-900 focus:outline-none focus:border-emerald-500 transition-all h-24 resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                 <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="flex-1">Cancelar</Button>
                 <Button type="submit" disabled={!mediaData || isUploading} className="flex-[2] h-16 shadow-lg shadow-emerald-500/20 disabled:opacity-50">Salvar no Diário</Button>
              </div>
           </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {logs.map((log: any) => (
          <Card key={log.id} className="p-0 overflow-hidden flex flex-col hover:shadow-xl transition-all group">
             <div className="relative aspect-video bg-stone-100 flex items-center justify-center overflow-hidden">
                {log.mediaType === 'image' ? (
                  <img 
                    src={log.mediaUrl} 
                    alt={log.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?w=800&auto=format&fit=crop';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-950 flex flex-col items-center justify-center text-emerald-400 gap-2">
                    <Video className="w-12 h-12" />
                    <span className="font-bold text-[10px] uppercase tracking-[0.2em]">Vídeo Educativo</span>
                    <p className="text-[8px] text-emerald-300 opacity-50 px-4 text-center">Pré-visualização de vídeo integrada</p>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                   {(isAdmin || log.teacherId === profile?.id) && (
                     <button 
                        onClick={() => deleteLog(log.id)}
                        className="p-2 bg-white/20 hover:bg-rose-500 backdrop-blur-md rounded-xl text-white transition-all shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                     </button>
                   )}
                   {log.mediaUrl.startsWith('http') && (
                     <a 
                        href={log.mediaUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-white/20 hover:bg-emerald-500 backdrop-blur-md rounded-xl text-white transition-all shadow-lg"
                      >
                        <Upload className="w-4 h-4 transform rotate-45" />
                     </a>
                   )}
                </div>
                <div className="absolute top-4 left-4">
                   <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 text-white border border-white/20">
                      <Calendar className="w-3 h-3" />
                      <span className="text-[10px] font-black">{log.date ? format(new Date(log.date), 'dd MMM yyyy', { locale: ptBR }) : 'Recent'}</span>
                   </div>
                </div>
             </div>
             
             <div className="p-6 space-y-3 flex-1 flex flex-col">
                <h4 className="text-xl font-black text-stone-900 tracking-tight leading-tight uppercase">{log.title}</h4>
                <p className="text-sm text-stone-500 font-medium leading-relaxed italic flex-1">
                  "{log.description || 'Sem descrição cadastrada.'}"
                </p>
                <div className="pt-4 flex items-center justify-between border-t border-stone-100 mt-auto">
                    <div className="flex items-center gap-4">
                       <button 
                         onClick={() => supportLog(log.id)}
                         className="flex items-center gap-1.5 group/btn"
                       >
                          <div className="p-2 rounded-full group-hover/btn:bg-rose-50 transition-colors">
                             <Heart className={cn("w-5 h-5", (log.likes || 0) > 0 ? "text-rose-500 fill-rose-500" : "text-stone-400")} />
                          </div>
                          <span className="text-xs font-black text-stone-500">{log.likes || 0}</span>
                       </button>
                       <button 
                         onClick={() => setActiveComments(activeComments === log.id ? null : log.id)}
                         className="flex items-center gap-1.5 group/btn"
                       >
                          <div className="p-2 rounded-full group-hover/btn:bg-sky-50 transition-colors">
                             <MessageSquare className="w-5 h-5 text-stone-400 group-hover/btn:text-sky-500" />
                          </div>
                          <span className="text-xs font-black text-stone-500">{(log.feedbacks || []).length}</span>
                       </button>
                    </div>
                    <div className="flex items-center gap-2">
                       {log.mediaType === 'image' ? <ImageIcon className="w-3.5 h-3.5 text-stone-400" /> : <Video className="w-3.5 h-3.5 text-stone-400" />}
                       <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-none">
                         {log.teacherName?.split(' ')[0] || 'Docente'}
                       </span>
                    </div>
                 </div>

                 <AnimatePresence>
                   {activeComments === log.id && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="overflow-hidden bg-stone-50 rounded-2xl mt-4"
                     >
                       <div className="p-4 space-y-4">
                         <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
                           {(log.feedbacks || []).map((fb: any) => (
                             <div key={fb.id} className="bg-white p-3 rounded-xl shadow-sm border border-stone-100">
                               <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">{fb.userName}</p>
                               <p className="text-xs text-stone-600 font-medium">{fb.text}</p>
                             </div>
                           ))}
                           {(log.feedbacks || []).length === 0 && (
                             <p className="text-[10px] text-stone-400 font-bold uppercase text-center py-2">Nenhum comentário ainda.</p>
                           )}
                         </div>
                         <div className="flex gap-2">
                           <input 
                             type="text" 
                             value={commentText}
                             onChange={(e) => setCommentText(e.target.value)}
                             onKeyPress={(e) => {
                               if (e.key === 'Enter') {
                                 feedbackLog(log.id, commentText, profile?.name || 'Mestre');
                                 setCommentText('');
                               }
                             }}
                             placeholder="Dê um feedback..."
                             className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500"
                           />
                           <button 
                             onClick={() => {
                               feedbackLog(log.id, commentText, profile?.name || 'Mestre');
                               setCommentText('');
                             }}
                             className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                           >
                             <Send className="w-4 h-4" />
                           </button>
                         </div>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
          </Card>
        ))}

        {logs.length === 0 && !isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="col-span-full py-32 border-4 border-dashed border-stone-100 bg-white rounded-[3rem] group hover:border-emerald-200 transition-all flex flex-col items-center justify-center gap-6"
          >
             <div className="p-6 bg-stone-50 rounded-full group-hover:bg-emerald-50 group-hover:scale-110 transition-all">
                <Camera className="w-16 h-16 text-stone-200 group-hover:text-emerald-300" />
             </div>
             <div className="text-center">
                <h3 className="text-2xl font-black text-stone-300 uppercase tracking-tight">O diário está vazio</h3>
                <p className="text-stone-300 font-bold max-w-xs mt-1">Nenhum momento sustentável registrado ainda. Vamos mudar isso?</p>
             </div>
          </button>
        )}
      </div>
    </div>
  );
}

