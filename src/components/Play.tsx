import React, { useState } from 'react';
import { Card, Button } from './UI';
import { Play as PlayIcon, Plus, Trash2, Youtube, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

export default function Play({ videos, addVideo, deleteVideo, isAdmin, onPlayToggle }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  useEffect(() => {
    onPlayToggle?.(!!selectedVideo);
    return () => onPlayToggle?.(false);
  }, [selectedVideo, onPlayToggle]);
  
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = getYoutubeId(url);
    if (id && title) {
      addVideo(title, id);
      setTitle('');
      setUrl('');
      setIsAdding(false);
    } else {
      alert('Por favor, insira um link válido do YouTube.');
    }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 w-fit rounded-full">
            <PlayIcon className="w-3 h-3 text-emerald-600" />
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Conteúdo</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tighter uppercase leading-none underline decoration-sky-400 decoration-8 underline-offset-8">
            EcoPlay
          </h2>
          <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] max-w-sm leading-relaxed">
             Vídeos educativos e tutoriais para fortalecer o aprendizado sustentável de forma lúdica.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Button 
              onClick={() => setIsAdding(true)}
              className="rounded-[1.5rem] bg-sky-600 hover:bg-sky-700 h-16 px-8 text-xs tracking-widest shadow-xl shadow-sky-200"
            >
              <Plus className="w-4 h-4 mr-2" /> ADICIONAR VÍDEO
            </Button>
          )}
          <div className="hidden md:block bg-stone-100 p-6 rounded-[2.5rem] border-2 border-dashed border-stone-200">
            <PlayIcon className="w-10 h-10 text-stone-300" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8 border-2 border-sky-100 bg-sky-50/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Título do Vídeo</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white border-2 border-slate-100 rounded-xl px-5 py-4 font-bold text-sm focus:outline-none focus:border-sky-500 transition-all"
                      placeholder="Ex: Como Reduzir o Plástico"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Link do YouTube</label>
                    <div className="relative">
                      <Youtube className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-500" />
                      <input 
                        type="text" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full bg-white border-2 border-slate-100 rounded-xl pl-14 pr-5 py-4 font-bold text-sm focus:outline-none focus:border-sky-500 transition-all"
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setIsAdding(false)} type="button">Cancelar</Button>
                  <Button type="submit" className="bg-sky-600 hover:bg-sky-700 px-8">Salvar Vídeo</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[280px]">
        {videos.map((video: any, index: number) => (
          <motion.div 
            key={video.id}
            whileHover={{ y: -8 }}
            className={cn(
              "group relative",
              index % 5 === 0 ? "md:col-span-8 md:row-span-2" : "md:col-span-4 md:row-span-1",
              index % 7 === 3 ? "md:col-span-6 md:row-span-1" : ""
            )}
          >
            <div className="rounded-[3rem] bg-white border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/30 group relative flex flex-col h-full hover:shadow-2xl transition-all duration-500">
              <div className="relative flex-1 bg-slate-100 overflow-hidden">
                <img 
                  src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e: any) => {
                    e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/0.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={() => setSelectedVideo(video)}
                    className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-500 hover:bg-white hover:text-sky-600"
                  >
                    <PlayIcon className="w-8 h-8 fill-current translate-x-0.5" />
                  </button>
                </div>
              </div>
              
              <div className="p-8 absolute bottom-0 left-0 right-0 pointer-events-none">
                <div className="flex flex-col gap-2 pointer-events-auto">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="px-3 py-1 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-rose-500/20">
                         <Youtube className="w-3 h-3" />
                         <span>EcoPlay TV</span>
                      </div>
                   </div>
                   <h3 className={cn(
                     "font-black text-white leading-[0.95] uppercase transition-all line-clamp-2",
                     index % 5 === 0 ? "text-4xl tracking-tighter" : "text-xl tracking-tight"
                   )}>
                     {video.title}
                   </h3>
                   {isAdmin && (
                     <div className="pt-4 mt-2 border-t border-white/10 flex justify-end">
                        <button 
                          onClick={() => deleteVideo(video.id)}
                          className="p-3 bg-white/10 hover:bg-rose-500 text-white rounded-2xl transition-all backdrop-blur-md border border-white/5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                   )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="absolute inset-0 bg-slate-900/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all transition-transform hover:scale-110"
              >
                <X className="w-6 h-6" />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&enablejsapi=1`}
                title={selectedVideo.title}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
