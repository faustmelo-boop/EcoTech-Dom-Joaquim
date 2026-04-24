import React, { useState, useEffect } from 'react';
import { Card, Button } from './UI';
import { Play as PlayIcon, Plus, Trash2, Youtube, X, Smartphone, Monitor, ChevronLeft, ChevronRight, PlayCircle, PauseCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { doc, onSnapshot, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { cn } from '../lib/utils';
import QRScanner from './QRScanner';

export default function Play({ videos, addVideo, deleteVideo, isAdmin }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  
  // Remote Control State
  const [remoteSessionId, setRemoteSessionId] = useState<string | null>(null);
  const [isRemoteMode, setIsRemoteMode] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  // Check for remote mode on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const remoteId = params.get('remote');
    if (remoteId) {
      setRemoteSessionId(remoteId);
      setIsRemoteMode(true);
    }
  }, []);

  // Monitor Logic: Listen for commands
  useEffect(() => {
    if (!remoteSessionId || isRemoteMode) return;

    const sessionRef = doc(db, 'remote_sessions', remoteSessionId);
    
    // Initialize session
    setDoc(sessionRef, { 
      active: true, 
      command: null, 
      timestamp: Date.now(),
      videoId: selectedVideo?.id || null 
    });

    const unsubscribe = onSnapshot(sessionRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.command) {
          handleRemoteCommand(data.command, data.payload);
          // Clear command after executing
          updateDoc(sessionRef, { command: null });
        }
      }
    });

    return () => {
      unsubscribe();
      deleteDoc(sessionRef);
    };
  }, [remoteSessionId, isRemoteMode]);

  const handleRemoteCommand = (command: string, payload?: any) => {
    switch (command) {
      case 'PLAY_VIDEO':
        const videoToPlay = videos.find((v: any) => v.id === payload);
        if (videoToPlay) setSelectedVideo(videoToPlay);
        break;
      case 'CLOSE_VIDEO':
        setSelectedVideo(null);
        break;
      case 'NEXT_VIDEO':
        if (selectedVideo) {
          const currentIndex = videos.findIndex((v: any) => v.id === selectedVideo.id);
          const nextVideo = videos[(currentIndex + 1) % videos.length];
          setSelectedVideo(nextVideo);
        } else if (videos.length > 0) {
          setSelectedVideo(videos[0]);
        }
        break;
      case 'PREV_VIDEO':
        if (selectedVideo) {
          const currentIndex = videos.findIndex((v: any) => v.id === selectedVideo.id);
          const prevVideo = videos[(currentIndex - 1 + videos.length) % videos.length];
          setSelectedVideo(prevVideo);
        } else if (videos.length > 0) {
          setSelectedVideo(videos[videos.length - 1]);
        }
        break;
    }
  };

  const startRemoteSession = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRemoteSessionId(id);
    setSessionActive(true);
  };

  const sendRemoteCommand = async (command: string, payload?: any) => {
    if (!remoteSessionId) return;
    const sessionRef = doc(db, 'remote_sessions', remoteSessionId);
    await updateDoc(sessionRef, { 
      command, 
      payload: payload || null,
      timestamp: Date.now() 
    });
  };

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

  // Remote Control UI (Mobile)
  if (isRemoteMode) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-[200] flex flex-col p-8 safe-bottom">
        <header className="flex justify-between items-center mb-12">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">
              Controle Remoto
            </h2>
            <p className="text-sky-400 font-bold uppercase tracking-widest text-[10px]">Sessão: {remoteSessionId}</p>
          </div>
          <Smartphone className="text-sky-400 w-8 h-8" />
        </header>

        <div className="flex-1 flex flex-col gap-6">
          <button 
            onClick={() => sendRemoteCommand('PLAY_VIDEO', videos[0]?.id)}
            className="w-full bg-sky-600 active:bg-sky-700 text-white rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 transition-all"
          >
            <PlayCircle className="w-12 h-12" />
            <span className="font-black uppercase tracking-widest text-sm">Iniciar Vídeos</span>
          </button>

          <div className="grid grid-cols-2 gap-6">
            <button 
              onClick={() => sendRemoteCommand('PREV_VIDEO')}
              className="aspect-square bg-slate-800 active:bg-slate-700 text-white rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-all"
            >
              <ChevronLeft className="w-10 h-10" />
              <span className="font-black uppercase tracking-widest text-[10px]">Anterior</span>
            </button>
            <button 
              onClick={() => sendRemoteCommand('NEXT_VIDEO')}
              className="aspect-square bg-slate-800 active:bg-slate-700 text-white rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-all"
            >
              <ChevronRight className="w-10 h-10" />
              <span className="font-black uppercase tracking-widest text-[10px]">Próximo</span>
            </button>
          </div>

          <button 
            onClick={() => sendRemoteCommand('CLOSE_VIDEO')}
            className="w-full bg-rose-600/20 text-rose-500 border-2 border-rose-500/20 rounded-[2rem] p-6 font-black uppercase tracking-widest text-sm"
          >
            Fechar Player
          </button>
        </div>

        <p className="text-slate-500 text-center text-xs font-bold uppercase tracking-widest mt-8">
          EcoTech • Controle por Gesto
        </p>
      </div>
    );
  }

  const handleScan = (data: string) => {
    if (data && data.startsWith(window.location.origin)) {
      window.location.href = data;
    } else {
      alert('QR Code inválido ou não pertence a esta plataforma.');
    }
  };

  return (
    <div className="space-y-12 pb-12">
      <AnimatePresence>
        {showScanner && (
          <QRScanner 
            onScan={handleScan} 
            onClose={() => setShowScanner(false)} 
          />
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase underline decoration-sky-400 decoration-8 underline-offset-8">
            EcoPlay
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Cine Ambiental & Educação</p>
        </div>
        <div className="flex items-center gap-4">
          {!remoteSessionId ? (
            <>
              {/* Desktop: Show QR trigger */}
              <Button 
                variant="outline"
                onClick={startRemoteSession}
                className="hidden md:flex rounded-2xl border-2 border-sky-100 h-14 px-6 text-xs tracking-widest"
              >
                <Smartphone className="w-4 h-4 mr-2 text-sky-500" /> CONTROLE REMOTO
              </Button>
              
              {/* Mobile: Show QR Scanner trigger */}
              <button 
                onClick={() => setShowScanner(true)}
                className="md:hidden p-4 bg-sky-50 text-sky-600 rounded-2xl border border-sky-100"
                title="Escanear Controle"
              >
                <Smartphone className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4 bg-sky-50 p-2 pl-4 rounded-2xl border border-sky-100">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase text-sky-600 tracking-tighter">Sessão Ativa</span>
                <span className="text-sm font-black text-slate-900">{remoteSessionId}</span>
              </div>
              <button 
                onClick={() => setRemoteSessionId(null)}
                className="p-2 hover:bg-white rounded-lg transition-all"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}
          {isAdmin && (
            <Button 
              onClick={() => setIsAdding(true)}
              className="rounded-2xl bg-sky-600 hover:bg-sky-700 h-14 px-8 text-xs tracking-widest"
            >
              <Plus className="w-4 h-4 mr-2" /> ADICIONAR VÍDEO
            </Button>
          )}
        </div>
      </header>

      <AnimatePresence>
        {remoteSessionId && !isRemoteMode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 right-10 z-[150] group hidden md:block"
          >
            <Card className="p-6 bg-white shadow-2xl border-4 border-sky-500 rounded-[2.5rem] flex flex-col items-center gap-4">
              <div className="p-4 bg-white rounded-2xl">
                <QRCodeSVG 
                  value={`${window.location.origin}${window.location.pathname}?tab=play&remote=${remoteSessionId}`} 
                  size={150}
                  level="H"
                  includeMargin
                />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Escaneie para Controlar</p>
                <p className="text-sm font-black text-slate-900">Modo Professor</p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

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
