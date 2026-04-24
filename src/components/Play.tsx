import React, { useState } from 'react';
import { Card, Button } from './UI';
import { Play as PlayIcon, Plus, Trash2, Youtube, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Play({ videos, addVideo, deleteVideo, isAdmin }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase underline decoration-sky-400 decoration-8 underline-offset-8">
            EcoPlay
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cine Ambiental & Educação</p>
        </div>
        {isAdmin && (
          <Button 
            onClick={() => setIsAdding(true)}
            className="rounded-2xl bg-sky-600 hover:bg-sky-700 h-14 px-8 text-xs tracking-widest"
          >
            <Plus className="w-4 h-4 mr-2" /> ADICIONAR VÍDEO
          </Button>
        )}
      </header>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video: any) => (
          <motion.div 
            key={video.id}
            whileHover={{ y: -8 }}
            className="group relative"
          >
            <Card className="overflow-hidden border-none shadow-xl rounded-[2.5rem] bg-white h-full flex flex-col">
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img 
                  src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e: any) => {
                    e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/0.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => setSelectedVideo(video)}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-sky-600 shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-300"
                  >
                    <PlayIcon className="w-8 h-8 fill-current translate-x-0.5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-sky-600 transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Youtube className="w-4 h-4 text-rose-500" />
                    <span>YouTube Education</span>
                  </div>
                  {isAdmin && (
                    <button 
                      onClick={() => deleteVideo(video.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
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
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
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
