import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from './UI';
import { 
  Gamepad2, Recycle, Leaf, Search, Trophy, RotateCcw, 
  Timer, Heart, ArrowLeft, ArrowRight, CheckCircle2, XCircle, HelpCircle, AlertCircle, Info, MapPin, Users,
  Volume2, VolumeX, Smartphone, Music, Construction, Megaphone, Bird, X, PlayCircle, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { doc, onSnapshot, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';
import { ClassTeam } from '../types';

type GameType = 'ecology' | 'sorting' | 'silence' | null;

interface GamesProps {
  classes: ClassTeam[];
  addGamePoints: (classId: string, points: number) => Promise<void>;
  profile: any;
  isAdmin: boolean;
  onGameToggle?: (active: boolean) => void;
  isGuest?: boolean;
}

export default function Games({ classes, addGamePoints, profile, isAdmin, onGameToggle, isGuest }: GamesProps) {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  useEffect(() => {
    onGameToggle?.(!!activeGame);
    return () => onGameToggle?.(false);
  }, [activeGame, onGameToggle]);

  const handleManualConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.length === 6) {
      const url = `${window.location.origin}${window.location.pathname}?tab=games&remote=${manualCode.toUpperCase()}`;
      window.location.href = url;
    }
  };
  const [sessionPoints, setSessionPoints] = useState(0);

  // Remote Control State
  const [remoteSessionId, setRemoteSessionId] = useState<string | null>(null);
  const [isRemoteMode, setIsRemoteMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const remoteId = params.get('remote');
    if (remoteId && params.get('tab') === 'games') {
      setRemoteSessionId(remoteId);
      setIsRemoteMode(true);
    }
  }, []);

  // Monitor Logic
  useEffect(() => {
    if (!remoteSessionId || isRemoteMode) return;

    const sessionRef = doc(db, 'remote_sessions', remoteSessionId);
    console.log('Monitor Games: Iniciando sessão', remoteSessionId);
    
    setDoc(sessionRef, { 
      active: true, 
      command: null, 
      timestamp: Date.now(),
      view: 'games'
    }).catch(err => console.error("Erro ao criar sessão remota games:", err));

    const unsubscribe = onSnapshot(sessionRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        console.log('Monitor Games: Dados recebidos', data);
        if (data.command) {
          handleRemoteCommand(data.command, data.payload);
          setTimeout(() => {
            updateDoc(sessionRef, { command: null }).catch(() => {});
          }, 100);
        }
      }
    }, (error) => {
      console.error("Erro no onSnapshot games:", error);
    });

    return () => {
      console.log('Monitor Games: Limpando escuta');
      unsubscribe();
    };
  }, [remoteSessionId, isRemoteMode]);

  const handleRemoteCommand = (command: string, payload?: any) => {
    switch (command) {
      case 'START_GAME':
        setActiveGame(payload as GameType);
        break;
      case 'EXIT_GAME':
        setActiveGame(null);
        break;
      case 'GAME_ACTION':
        // Generic event listener for game-specific components to pick up
        window.dispatchEvent(new CustomEvent('eco-game-remote-action', { detail: payload }));
        break;
    }
  };

  const startRemoteSession = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRemoteSessionId(id);
  };

  const sendRemoteCommand = async (command: string, payload?: any) => {
    if (!remoteSessionId) return;
    console.log('Controller Games: Enviando comando', command, payload);
    const sessionRef = doc(db, 'remote_sessions', remoteSessionId);
    try {
      await setDoc(sessionRef, { 
        command, 
        payload: payload || null,
        timestamp: Date.now(),
        active: true
      }, { merge: true });
    } catch (err) {
      console.error("Erro ao enviar comando remoto games:", err);
    }
  };

  useEffect(() => {
    if (profile && !isAdmin) {
      const teacherClass = classes.find(c => c.teacherId === profile.id);
      if (teacherClass) {
        setSelectedClassId(teacherClass.id);
      }
    }
  }, [profile, isAdmin, classes]);
  const [lastResults, setLastResults] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('eco_games_scores');
    return saved ? JSON.parse(saved) : {};
  });

  const saveScore = async (gameId: string, score: number) => {
    const newResults = { ...lastResults, [gameId]: Math.max(lastResults[gameId] || 0, score) };
    setLastResults(newResults);
    localStorage.setItem('eco_games_scores', JSON.stringify(newResults));
    
    if (selectedClassId) {
      setSessionPoints(prev => prev + score);
      await addGamePoints(selectedClassId, score);
    }
  };

  const gameCards = [
    { id: 'ecology', title: 'Salve a Natureza', icon: Leaf, color: 'bg-emerald-500', desc: 'Faça as escolhas certas para o planeta!' },
    { id: 'sorting', title: 'Separe o Lixo', icon: Recycle, color: 'bg-blue-500', desc: 'Coloque cada lixo na lixeira certa.' },
    { id: 'silence', title: 'Missão Silêncio', icon: Volume2, color: 'bg-sky-500', desc: 'Identifique e controle a poluição sonora!' }
  ];

  if (isRemoteMode) {
    return (
      <div className="fixed inset-0 bg-stone-50 z-[200] flex flex-col safe-bottom">
        <div className="absolute top-0 inset-x-0 h-48 bg-emerald-600 rounded-b-[3rem] -z-10 shadow-2xl shadow-emerald-900/10" />
        
        <header className="p-8 pb-4 flex justify-between items-center text-white">
          <div className="space-y-0.5">
            <h2 className="text-xl font-black tracking-tight uppercase leading-none">
              Eco Control
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
              <p className="text-emerald-100 font-bold uppercase tracking-widest text-[8px]">Sessão Ativa: {remoteSessionId}</p>
            </div>
          </div>
          <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md">
            <Gamepad2 className="text-white w-6 h-6" />
          </div>
        </header>
        
        <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto no-scrollbar">
          {!activeGame ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center py-2">
                <span className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] bg-stone-100 px-4 py-1.5 rounded-full">Selecione o Jogo</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {gameCards.map((game, idx) => (
                  <motion.button 
                    key={game.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => {
                      setActiveGame(game.id as GameType);
                      sendRemoteCommand('START_GAME', game.id);
                    }}
                    className={cn(
                      "group w-full p-5 rounded-[2rem] flex items-center gap-4 transition-all active:scale-[0.97] text-white shadow-xl relative overflow-hidden",
                      game.color
                    )}
                  >
                    <div className="bg-white/20 p-3 rounded-2xl group-active:scale-90 transition-transform">
                      <game.icon className="w-7 h-7" />
                    </div>
                    <div className="text-left flex-1">
                      <span className="block font-black uppercase tracking-tight text-lg leading-none">{game.title}</span>
                      <span className="text-[9px] font-bold opacity-80 uppercase tracking-widest mt-1">Clique para Iniciar</span>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-50" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 flex-1 flex flex-col"
            >
              <div className="bg-white p-6 rounded-[2.5rem] border-2 border-stone-100 shadow-xl text-center space-y-1 relative overflow-hidden">
                 <div className={cn("absolute right-0 top-0 w-2 h-full opacity-50", gameCards.find(g => g.id === activeGame)?.color)} />
                 <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Jogo em Curso</p>
                 <p className="text-xl font-black text-stone-900 uppercase tracking-tighter">
                   {gameCards.find(g => g.id === activeGame)?.title}
                 </p>
              </div>
              
              {/* Main Game Controls - Enhanced visual of a controller */}
              <div className="flex-1 flex flex-col justify-center gap-8">
                {activeGame === 'sorting' ? (
                  <div className="grid grid-cols-2 gap-6 pb-4">
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => sendRemoteCommand('GAME_ACTION', 'blue')}
                      className="aspect-square bg-blue-600 text-white rounded-[2.5rem] flex flex-col items-center justify-center gap-3 shadow-xl active:bg-blue-700"
                    >
                      <Recycle className="w-10 h-10" />
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">Papel</span>
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => sendRemoteCommand('GAME_ACTION', 'red')}
                      className="aspect-square bg-red-600 text-white rounded-[2.5rem] flex flex-col items-center justify-center gap-3 shadow-xl active:bg-red-700"
                    >
                      <Recycle className="w-10 h-10" />
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">Plástico</span>
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => sendRemoteCommand('GAME_ACTION', 'green')}
                      className="aspect-square bg-green-600 text-white rounded-[2.5rem] flex flex-col items-center justify-center gap-3 shadow-xl active:bg-green-700"
                    >
                      <Recycle className="w-10 h-10" />
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">Vidro</span>
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => sendRemoteCommand('GAME_ACTION', 'yellow')}
                      className="aspect-square bg-yellow-600 text-white rounded-[2.5rem] flex flex-col items-center justify-center gap-3 shadow-xl active:bg-yellow-700"
                    >
                      <Recycle className="w-10 h-10" />
                      <span className="text-[10px] font-black uppercase tracking-widest leading-none">Metal</span>
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <motion.button 
                        whileTap={{ scale: 0.9, backgroundColor: '#f0fdf4' }}
                        onClick={() => sendRemoteCommand('GAME_ACTION', 'A')}
                        className="aspect-square bg-white border-2 border-stone-100 text-stone-900 rounded-[3.5rem] flex flex-col items-center justify-center gap-3 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] active:shadow-inner transition-all group"
                      >
                        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl font-black group-active:scale-90 transition-transform">A</div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Opção 1</span>
                      </motion.button>
                      <motion.button 
                        whileTap={{ scale: 0.9, backgroundColor: '#f0fdf4' }}
                        onClick={() => sendRemoteCommand('GAME_ACTION', 'B')}
                        className="aspect-square bg-white border-2 border-stone-100 text-stone-900 rounded-[3.5rem] flex flex-col items-center justify-center gap-3 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] active:shadow-inner transition-all group"
                      >
                        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl font-black group-active:scale-90 transition-transform">B</div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Opção 2</span>
                      </motion.button>
                    </div>

                    <div className="flex items-center justify-between gap-6 px-4">
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => sendRemoteCommand('GAME_ACTION', 'PREV')}
                        className="w-full h-20 bg-stone-100 text-stone-600 rounded-[2rem] flex items-center justify-center active:bg-stone-200 transition-all shadow-lg"
                      >
                        <ArrowLeft className="w-8 h-8" />
                      </motion.button>
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => sendRemoteCommand('GAME_ACTION', 'NEXT')}
                        className="w-full h-20 bg-stone-100 text-stone-600 rounded-[2rem] flex items-center justify-center active:bg-stone-200 transition-all shadow-lg"
                      >
                        <ArrowRight className="w-8 h-8" />
                      </motion.button>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-6 mt-auto">
                <button 
                  onClick={() => {
                    setActiveGame(null);
                    sendRemoteCommand('EXIT_GAME');
                  }}
                  className="w-full h-16 bg-stone-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" /> Finalizar Atividade
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <footer className="p-8 pt-0 flex flex-col items-center gap-2 opacity-40">
          <div className="h-1 w-12 bg-stone-300 rounded-full mb-2" />
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-600">
            EcoTech Mobile Control
          </p>
        </footer>
      </div>
    );
  }

  if (!activeGame) {
    const selectedClass = classes.find(c => c.id === selectedClassId);

    return (
      <div className="space-y-10 pb-20 no-scrollbar">
        <AnimatePresence>
          {showCodeInput && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm z-[200] flex items-center justify-center p-6 px-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-[3rem] w-full max-w-sm shadow-2xl p-8 outline-none"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-stone-900 leading-none">CONECTAR</h3>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] leading-none mt-1">CÓDIGO DO DISPOSITIVO</p>
                  </div>
                  <button onClick={() => setShowCodeInput(false)} className="p-3 bg-stone-100 rounded-2xl text-stone-400 active:scale-90 transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleManualConnect} className="space-y-6">
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      maxLength={6}
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                      placeholder="ABC123"
                      className="w-full h-20 bg-stone-50 border-2 border-stone-100 focus:border-emerald-500 rounded-[2rem] text-center text-4xl font-black tracking-[0.2em] focus:outline-none transition-all placeholder:text-stone-200 placeholder:tracking-normal"
                      autoFocus
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={manualCode.length !== 6}
                    className="w-full h-16 rounded-[2rem] bg-emerald-600 font-black shadow-xl shadow-emerald-200 text-sm tracking-widest"
                  >
                    VINCULAR AGORA
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 w-fit rounded-full">
              <Gamepad2 className="w-3 h-3 text-emerald-600" />
              <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Atividades</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tighter uppercase leading-none underline decoration-lime-400 decoration-8 underline-offset-8">
              Eco Games
            </h2>
            <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] max-w-sm leading-relaxed">
               Transforme a sustentabilidade em diversão e aprenda brincando com nossos desafios educativos.
            </p>
          </div>
          
          {!isGuest && (
            <div className="flex items-center gap-4">
              <div className="bg-white px-6 py-4 rounded-[2.5rem] border-2 border-stone-50 shadow-xl shadow-stone-200/50 flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Pontos na Sessão</p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="font-black text-2xl text-stone-900 tracking-tight">{sessionPoints}</span>
                    <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                </div>
                <div className="bg-emerald-50 p-2.5 rounded-2xl">
                  <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="hidden md:block bg-stone-100 p-6 rounded-[2.5rem] border-2 border-dashed border-stone-200">
                <Gamepad2 className="w-10 h-10 text-stone-300" />
              </div>
            </div>
          )}
        </div>

        {/* Remote Control & Class Info Grid */}
        {!isGuest && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Class Card */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/30 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-4 rounded-[1.5rem] group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none mb-1.5">Equipe Ativa</h3>
                    {profile?.role === 'teacher' ? (
                      <div className="flex flex-col">
                        <span className="font-black text-stone-900 text-lg leading-none">{classes.find(c => c.id === selectedClassId)?.name || 'Sem turma'}</span>
                        <span className="text-[9px] font-bold text-stone-400 mt-1">{classes.find(c => c.id === selectedClassId)?.teamName || 'Selecione no painel'}</span>
                      </div>
                    ) : (
                      <select 
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="bg-transparent font-black text-stone-900 outline-none cursor-pointer text-lg leading-none appearance-none"
                      >
                        <option value="">Escolher...</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    )}
                  </div>
              </div>
              {(!selectedClassId || isAdmin) && <ChevronRight className="w-5 h-5 text-stone-200" />}
            </div>

            {/* Remote Info Card */}
            {!remoteSessionId ? (
              <button 
                onClick={() => {
                  if (window.innerWidth < 768) setShowCodeInput(true);
                  else startRemoteSession();
                }}
                className="bg-emerald-600 p-6 rounded-[2.5rem] border border-emerald-400 shadow-xl shadow-emerald-200/50 flex items-center justify-between text-white group active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-4 rounded-[1.5rem]">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-[10px] font-black text-emerald-100 uppercase tracking-widest leading-none mb-1.5">Controle Remoto</h3>
                    <p className="font-black text-lg leading-none">Vincular Celular</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-emerald-200" />
              </button>
            ) : (
              <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 shadow-xl flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-600 p-4 rounded-[1.5rem] text-white">
                    <span className="font-black text-lg">{remoteSessionId}</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1.5">Sessão Ativa</h3>
                    <p className="font-black text-stone-900 text-lg leading-none">Controle Conectado</p>
                  </div>
                </div>
                <button 
                  onClick={() => setRemoteSessionId(null)}
                  className="p-3 bg-white rounded-2xl text-stone-300 hover:text-rose-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Remote QR (Desktop Overlay) */}
        <AnimatePresence>
          {remoteSessionId && !isRemoteMode && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="fixed bottom-24 right-10 z-[150] hidden md:block"
            >
              <Card className="p-6 bg-white shadow-2xl border-2 border-stone-100 rounded-[3rem] items-center text-center">
                <div className="p-4 bg-white rounded-[2rem] border-4 border-stone-50 mb-4 inline-block">
                  <QRCodeSVG 
                    value={`${window.location.origin}${window.location.pathname}?tab=games&remote=${remoteSessionId}`} 
                    size={160}
                    level="H"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest leading-none">Controle Remoto</p>
                  <p className="text-lg font-black text-stone-900 leading-none">{remoteSessionId}</p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameCards.map((game, idx) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div 
                className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/30 flex flex-col items-center text-center cursor-pointer transition-all hover:border-emerald-500 overflow-hidden relative active:scale-[0.98]"
                onClick={() => setActiveGame(game.id as GameType)}
              >
                <div className={cn(
                  "w-24 h-24 rounded-[2rem] flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6",
                  game.color
                )}>
                  <game.icon className="w-10 h-10" />
                </div>
                
                <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tighter mb-2">{game.title}</h3>
                <p className="text-stone-400 text-xs font-bold leading-relaxed mb-8 px-4 opacity-80">{game.desc}</p>
                
                {lastResults[game.id] !== undefined && (
                  <div className="absolute top-6 right-6 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-black text-emerald-600 block leading-none mb-1 uppercase tracking-tighter">Recorde</span>
                    <span className="text-lg font-black text-emerald-700 leading-none">{lastResults[game.id]}</span>
                  </div>
                )}
                
                <div className={cn(
                  "w-full h-16 rounded-[2rem] flex items-center justify-center gap-3 font-black text-white shadow-xl transition-all",
                  game.color
                )}>
                  <PlayCircle className="w-5 h-5" />
                  <span className="text-sm tracking-widest uppercase">Começar</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!selectedClassId && (
          <div className="bg-amber-50 rounded-[2rem] p-6 border-2 border-dashed border-amber-200 flex items-center gap-5">
            <div className="bg-amber-100 p-4 rounded-2xl">
               <AlertCircle className="w-8 h-8 text-amber-600 shrink-0" />
            </div>
            <p className="text-amber-900 font-bold text-sm leading-snug">
               {!isGuest && (
                 <>
                   <span className="font-black uppercase text-[10px] tracking-widest block mb-1">Atenção Detetive</span>
                   Selecione sua turma acima para acumular pontos no ranking oficial!
                 </>
               )}
               {isGuest && (
                 <>
                   <span className="font-black uppercase text-[10px] tracking-widest block mb-1">Modo Visitante</span>
                   Divirta-se! Para salvar pontos no ranking oficial, o professor deve logar você.
                 </>
               )}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setActiveGame(null)}
            className="flex items-center gap-2 text-stone-400 hover:text-emerald-600 font-black uppercase text-xs tracking-widest transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Voltar
          </button>
          <div className="text-stone-300"><Gamepad2 className="w-6 h-6" /></div>
        </div>

        <AnimatePresence mode="wait">
          {activeGame === 'ecology' && <EcologyGame onComplete={(score) => saveScore('ecology', score)} onExit={() => setActiveGame(null)} />}
          {activeGame === 'sorting' && <SortingGame onComplete={(score) => saveScore('sorting', score)} onExit={() => setActiveGame(null)} />}
          {activeGame === 'silence' && <SilenceMissionGame onComplete={(score) => saveScore('silence', score)} onExit={() => setActiveGame(null)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Helper Components
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border", className)}>
    {children}
  </span>
);

const GameScoreboard = ({ score, maxScore, onRestart, onExit }: { score: number, maxScore: number, onRestart: () => void, onExit: () => void }) => {
  const getFeedback = () => {
    const ratio = score / maxScore;
    if (ratio >= 0.8) return { text: "PARABÉNS!", color: "text-emerald-500", msg: "Você é um verdadeiro Eco-Herói!" };
    if (ratio >= 0.4) return { text: "BOM TRABALHO!", color: "text-blue-500", msg: "Você está no caminho certo para salvar o planeta!" };
    return { text: "PODE MELHORAR", color: "text-amber-500", msg: "Tente novamente para aprender mais sobre a natureza." };
  };

  const feedback = getFeedback();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="text-center space-y-8 py-12"
    >
      <Trophy className={cn("w-24 h-24 mx-auto", feedback.color)} />
      <div>
        <h2 className={cn("text-5xl font-black tracking-tighter mb-2", feedback.color)}>{feedback.text}</h2>
        <p className="text-xl font-bold text-stone-600">{feedback.msg}</p>
      </div>
      <div className="bg-stone-50 p-8 rounded-[3rem] inline-block border-2 border-stone-100">
        <p className="text-stone-400 font-black uppercase text-xs tracking-widest mb-2">Sua Pontuação</p>
        <p className="text-7xl font-black text-stone-900">{score}<span className="text-2xl text-stone-300">/{maxScore}</span></p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        <Button onClick={onRestart} className="px-12 py-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-lg font-black">JOGAR DE NOVO</Button>
        <Button onClick={onExit} variant="outline" className="px-12 py-6 rounded-full text-lg font-black tracking-widest uppercase">SAIR</Button>
      </div>
    </motion.div>
  );
};

// --- GAME 1: ECOLOGIA "SALVE A NATUREZA" ---
function EcologyGame({ onComplete, onExit }: { onComplete: (s: number) => void, onExit: () => void }) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<boolean | null>(null);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');

  const situations = [
    { q: "Você encontrou lixo no chão da escola. O que fazer?", c: "Recolher e jogar no lixo", i: "Deixar lá e sair correndo", icon: "🗑️", msg: "O lixo no chão polui e pode entupir bueiros!" },
    { q: "Sua sala está vazia com as luzes acesas. O que fazer?", c: "Apagar as luzes ao sair", i: "Deixar acesas gastando energia", icon: "💡", msg: "Economizar energia ajuda o meio ambiente!" },
    { q: "Você terminou de usar a água da torneira. O que fazer?", c: "Fechar bem a torneira", i: "Deixar pingando um pouco", icon: "🚰", msg: "Cada gota de água é muito preciosa!" },
    { q: "Você tem um papel de bala na mão. O que fazer?", c: "Guardar até achar uma lixeira", i: "Jogar pela janela do ônibus", icon: "🍬", msg: "Nunca jogue lixo pela janela!" },
    { q: "As plantas do jardim estão com sede. O que fazer?", c: "Regar com cuidado", i: "Arrancar as folhas delas", icon: "🌱", msg: "As plantas nos dão oxigênio para respirar!" },
    { q: "Sua garrafa de suco acabou. O que fazer?", c: "Colocar na lixeira de reciclagem", i: "Jogar no lixo comum", icon: "🧃", msg: "Reciclar transforma o velho em novo!" },
    { q: "Você vai para a escola que é pertinho. Como ir?", c: "Caminhando ou de bicicleta", i: "Pedir para ir de carro", icon: "🚲", msg: "Caminhar faz bem para a saúde e para o ar!" },
    { q: "Seu desenho ficou pronto, mas sobrou papel.", c: "Usar o outro lado para rascunho", i: "Amassar e jogar fora", icon: "📝", msg: "Usar os dois lados do papel salva árvores!" },
    { q: "Vi um passarinho no pátio. O que fazer?", c: "Observar de longe e respeitar", i: "Tentar acertar uma pedra", icon: "🐦", msg: "Devemos respeitar todos os animais!" },
    { q: "Sobrou muita comida no prato. Na próxima vez...", c: "Pegar apenas o que vou comer", i: "Pegar bastante e jogar o resto fora", icon: "🍲", msg: "Evitar o desperdício ajuda a alimentar o mundo!" }
  ];

  const handleChoice = (correct: boolean) => {
    if (correct) {
      setScore(s => s + 1);
      setShowFeedback(true);
    } else {
      setShowFeedback(false);
    }

    setTimeout(() => {
      setShowFeedback(null);
      if (step + 1 < situations.length) {
        setStep(step + 1);
      } else {
        setGameState('finished');
        onComplete(score + (correct ? 1 : 0));
      }
    }, 2500);
  };

  useEffect(() => {
    const handleRemoteAction = (e: any) => {
      if (gameState !== 'playing') return;
      const action = e.detail;
      const options = [situations[step].c, situations[step].i].sort();
      if (action === 'A') handleChoice(options[0] === situations[step].c);
      if (action === 'B') handleChoice(options[1] === situations[step].c);
    };

    window.addEventListener('eco-game-remote-action', handleRemoteAction);
    return () => window.removeEventListener('eco-game-remote-action', handleRemoteAction);
  }, [gameState, step]);

  if (gameState === 'intro') return (
    <div className="text-center space-y-8 py-12">
      <h2 className="text-4xl font-black text-emerald-600 uppercase tracking-tighter">Salve a Natureza</h2>
      <p className="text-xl text-stone-600 font-bold max-w-md mx-auto">Ajude o meio ambiente fazendo as escolhas certas! Clique na melhor opção para cada situação.</p>
      <Button onClick={() => setGameState('playing')} className="px-12 py-6 rounded-full bg-emerald-500 text-xl font-black">COMEÇAR</Button>
    </div>
  );

  if (gameState === 'finished') return <GameScoreboard score={score} maxScore={situations.length} onRestart={() => {setStep(0); setScore(0); setGameState('playing');}} onExit={onExit} />;

  const current = situations[step];
  const options = [current.c, current.i].sort();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Pergunta {step + 1}/10</Badge>
        <span className="font-black text-emerald-600">Pontos: {score}</span>
      </div>

      <Card className="p-8 md:p-12 text-center space-y-8 relative overflow-hidden">
        <AnimatePresence>
          {showFeedback !== null && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className={cn("absolute inset-0 z-50 flex items-center justify-center flex-col p-8 bg-white", showFeedback ? "text-emerald-600" : "text-red-500")}
            >
              {showFeedback ? <CheckCircle2 className="w-24 h-24 mb-4" /> : <XCircle className="w-24 h-24 mb-4" />}
              <h3 className="text-3xl font-black uppercase mb-4">{showFeedback ? "Muito Bem!" : "Ops, tente melhor!"}</h3>
              <p className="text-lg font-bold text-stone-600">{current.msg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-7xl mb-6">{current.icon}</div>
        <h3 className="text-2xl md:text-3xl font-black text-stone-900 leading-tight">{current.q}</h3>
        <div className="grid grid-cols-1 gap-4 pt-4">
          {options.map((opt, i) => (
            <Button 
              key={i} 
              variant="outline" 
              className="py-8 rounded-3xl text-xl font-bold hover:bg-emerald-50 border-2"
              onClick={() => handleChoice(opt === current.c)}
            >
              {opt}
            </Button>
          ))}
        </div>
      </Card>

      <button onClick={() => {setStep(0); setScore(0); setGameState('intro');}} className="flex items-center gap-2 mx-auto text-stone-400 hover:text-stone-600 uppercase font-black text-[10px]">
        <RotateCcw className="w-3 h-3" /> Reiniciar
      </button>
    </div>
  );
}

// --- GAME 2: RECICLAGEM "SEPARE O LIXO" ---
function SortingGame({ onComplete, onExit }: { onComplete: (s: number) => void, onExit: () => void }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [feedback, setFeedback] = useState<'ok' | 'err' | null>(null);

  const items = [
    { name: "Garrafa PET", type: "red", icon: "🥤" },
    { name: "Jornal", type: "blue", icon: "🗞️" },
    { name: "Lata de Refrigerante", type: "yellow", icon: "🥫" },
    { name: "Garrafa de Vidro", type: "green", icon: "🍾" },
    { name: "Caixa de Papelão", type: "blue", icon: "📦" },
    { name: "Sacola Plástica", type: "red", icon: "🛍️" },
    { name: "Tampa Metálica", type: "yellow", icon: "🧢" },
    { name: "Revista", type: "blue", icon: "📖" },
    { name: "Copo Plástico", type: "red", icon: "🥃" },
    { name: "Pote de Vidro", type: "green", icon: "🏺" },
    { name: "Papel Sulfite", type: "blue", icon: "📄" },
    { name: "Lata de Milho", type: "yellow", icon: "🌽" }
  ];

  const bins = [
    { type: 'blue', label: 'PAPEL', color: 'bg-blue-600', icon: Recycle },
    { type: 'red', label: 'PLÁSTICO', color: 'bg-red-600', icon: Recycle },
    { type: 'green', label: 'VIDRO', color: 'bg-green-600', icon: Recycle },
    { type: 'yellow', label: 'METAL', color: 'bg-yellow-600', icon: Recycle },
  ];

  useEffect(() => {
    const handleRemoteAction = (e: any) => {
      if (gameState !== 'playing') return;
      handleSort(e.detail);
    };

    window.addEventListener('eco-game-remote-action', handleRemoteAction);
    return () => window.removeEventListener('eco-game-remote-action', handleRemoteAction);
  }, [gameState, currentItemIdx]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      finishGame();
    }
  }, [gameState, timeLeft]);

  const finishGame = () => {
    setGameState('finished');
    onComplete(score);
  };

  const handleSort = (binType: string) => {
    if (!bins.some(b => b.type === binType)) return;
    
    if (binType === items[currentItemIdx].type) {
      setScore(s => s + 1);
      setFeedback('ok');
    } else {
      setFeedback('err');
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentItemIdx + 1 < items.length) {
        setCurrentItemIdx(currentItemIdx + 1);
      } else {
        finishGame();
      }
    }, 800);
  };

  if (gameState === 'intro') return (
    <div className="text-center space-y-8 py-12">
      <h2 className="text-4xl font-black text-blue-600 uppercase tracking-tighter">Separe o Lixo</h2>
      <p className="text-xl text-stone-600 font-bold max-w-md mx-auto">Coloque cada objeto na lixeira da cor certa antes que o tempo acabe!</p>
      <Button onClick={() => setGameState('playing')} className="px-12 py-6 rounded-full bg-blue-500 text-xl font-black">COMEÇAR</Button>
    </div>
  );

  if (gameState === 'finished') return <GameScoreboard score={score} maxScore={items.length} onRestart={() => {setTimeLeft(60); setScore(0); setCurrentItemIdx(0); setGameState('playing');}} onExit={onExit} />;

  const current = items[currentItemIdx];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-stone-50 p-4 rounded-3xl border border-stone-100">
        <div className="flex items-center gap-2 font-black text-blue-600">
          <Timer className="w-5 h-5" /> {timeLeft}s
        </div>
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">Item {currentItemIdx + 1}/{items.length}</Badge>
        <div className="font-black text-stone-700">Pontos: {score}</div>
      </div>

      <div className="relative h-64 flex items-center justify-center mb-12">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentItemIdx}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-8xl p-8 bg-white rounded-full shadow-2xl border-4 border-stone-100">
              {current.icon}
            </div>
            <p className="text-2xl font-black text-stone-800 uppercase tracking-tight">{current.name}</p>
          </motion.div>
        </AnimatePresence>
        
        {feedback && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5 }} className="absolute z-50">
            {feedback === 'ok' ? <CheckCircle2 className="w-32 h-32 text-emerald-500 bg-white rounded-full" /> : <XCircle className="w-32 h-32 text-red-500 bg-white rounded-full" />}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bins.map(bin => (
          <motion.button
            key={bin.type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSort(bin.type)}
            className={cn("p-6 rounded-[2rem] text-white flex flex-col items-center gap-4 shadow-xl transition-all", bin.color)}
          >
            <bin.icon className="w-12 h-12" />
            <span className="font-black text-sm tracking-widest">{bin.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// --- GAME 5: POLUIÇÃO SONORA "MISSÃO SILÊNCIO" ---
function SilenceMissionGame({ onComplete, onExit }: { onComplete: (s: number) => void, onExit: () => void }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'play' | 'classify' | 'solve' | 'result' | 'finished'>('intro');
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [fixedSources, setFixedSources] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ text: string, type: 'success' | 'warning' } | null>(null);

  const scenarios = [
    {
      id: 'classroom',
      title: "Sala de Aula",
      bg: "bg-amber-50",
      sources: [
        { id: 'voices', label: 'Conversas Altas', icon: '🗣️', isLoud: true, solution: 'Falar mais baixo' },
        { id: 'birds', label: 'Passarinhos', icon: '🐦', isLoud: false, solution: 'Manter como está' },
        { id: 'pencil', label: 'Lápis no Papel', icon: '✏️', isLoud: false, solution: 'Manter como está' },
        { id: 'shouting', label: 'Gritaria no Pátio', icon: '📢', isLoud: true, solution: 'Fechar a janela' },
        { id: 'clock', label: 'Relógio de Parede', icon: '⏰', isLoud: false, solution: 'Manter como está' }
      ]
    },
    {
      id: 'hospital',
      title: "Hospital",
      bg: "bg-sky-50",
      sources: [
        { id: 'horn', label: 'Buzina na Rua', icon: '🚗', isLoud: true, solution: 'Sinalizar área de silêncio' },
        { id: 'steps', label: 'Passos nos Corredores', icon: '👣', isLoud: false, solution: 'Manter como está' },
        { id: 'drilling', label: 'Obras Próximas', icon: '🚧', isLoud: true, solution: 'Pedir pausa na obra' },
        { id: 'heart', label: 'Monitor Cardíaco', icon: '💓', isLoud: false, solution: 'Manter como está' },
        { id: 'whisper', label: 'Sussurros', icon: '🤫', isLoud: false, solution: 'Manter como está' }
      ]
    },
    {
      id: 'library',
      title: "Biblioteca",
      bg: "bg-orange-50",
      sources: [
        { id: 'cellphone', label: 'Celular Tocando', icon: '📱', isLoud: true, solution: 'Colocar no Silencioso' },
        { id: 'turning_pages', label: 'Folheando Livros', icon: '📖', isLoud: false, solution: 'Manter como está' },
        { id: 'typing', label: 'Teclado de Computador', icon: '⌨️', isLoud: false, solution: 'Manter como está' },
        { id: 'laughing', label: 'Risadas Altas', icon: '😂', isLoud: true, solution: 'Pedir silêncio' },
        { id: 'air_cond', label: 'Ar Condicionado', icon: '❄️', isLoud: false, solution: 'Manter como está' }
      ]
    },
    {
      id: 'house',
      title: "Em Casa",
      bg: "bg-emerald-50",
      sources: [
        { id: 'tv_loud', label: 'TV no Volume Máximo', icon: '📺', isLoud: true, solution: 'Diminuir Volume' },
        { id: 'cat', label: 'Gato Ronronando', icon: '🐱', isLoud: false, solution: 'Manter como está' },
        { id: 'vacuum', label: 'Aspirador de Pó', icon: '🧹', isLoud: true, solution: 'Desligar aparelho' },
        { id: 'radio', label: 'Rádio Baixinho', icon: '📻', isLoud: false, solution: 'Manter como está' },
        { id: 'blender', label: 'Liquidificador', icon: '🍹', isLoud: true, solution: 'Usar com tampa' }
      ]
    },
    {
      id: 'street',
      title: "Rua Movimentada",
      bg: "bg-slate-50",
      sources: [
        { id: 'car_audio', label: 'Carro de Som', icon: '🔊', isLoud: true, solution: 'Pedir para baixar' },
        { id: 'traffic', label: 'Trânsito Normal', icon: '🛺', isLoud: false, solution: 'Manter como está' },
        { id: 'police', label: 'Sirene de Polícia', icon: '🚨', isLoud: true, solution: 'Afastar-se do ruído' },
        { id: 'wind', label: 'Vento nas Árvores', icon: '🍃', isLoud: false, solution: 'Manter como está' },
        { id: 'drilling_street', label: 'Britadeira', icon: '🏗️', isLoud: true, solution: 'Usar protetor auricular' }
      ]
    }
  ];

  const current = scenarios[round];

  const calculateNoise = (sources: any[], fixed: string[]) => {
    const loudSources = sources.filter(s => s.isLoud);
    if (loudSources.length === 0) return 0;
    const loudRemaining = loudSources.filter(s => !fixed.includes(s.id)).length;
    return (loudRemaining / loudSources.length) * 100;
  };

  useEffect(() => {
    setNoiseLevel(calculateNoise(current.sources, fixedSources));
  }, [fixedSources, round]);

  const handleSourceClick = (source: any) => {
    if (fixedSources.includes(source.id)) return;
    setSelectedSource(source);
    setGameState('classify');
  };

  const handleClassification = (isLoud: boolean) => {
    if (isLoud === selectedSource.isLoud) {
      setScore(s => s + 1);
      if (!isLoud) {
        setFeedback({ text: "Ótimo! Este é um som agradável que não incomoda.", type: 'success' });
        const newFixed = [...fixedSources, selectedSource.id];
        setFixedSources(newFixed);
        setTimeout(() => {
          setFeedback(null);
          setGameState('play');
          checkRoundEnd(newFixed);
        }, 1500);
      } else {
        setGameState('solve');
      }
    } else {
      setFeedback({ text: "Atenção! Analise melhor se o volume está adequado.", type: 'warning' });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleSolution = (solution: string) => {
    if (solution === selectedSource.solution) {
      setScore(s => s + 1);
      setFeedback({ text: "Excelente! Reduzir o ruído faz bem para a saúde de todos.", type: 'success' });
      const newFixed = [...fixedSources, selectedSource.id];
      setFixedSources(newFixed);
      setTimeout(() => {
        setFeedback(null);
        setGameState('play');
        checkRoundEnd(newFixed);
      }, 1500);
    } else {
      setFeedback({ text: "Hum, esta solução não parece a mais eficiente para este barulho.", type: 'warning' });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const checkRoundEnd = (fixed: string[]) => {
    if (fixed.length === current.sources.length) {
      setTimeout(() => setGameState('result'), 1000);
    }
  };

  const nextRound = () => {
    if (round + 1 < scenarios.length) {
      setRound(round + 1);
      setFixedSources([]);
      setGameState('play');
    } else {
      setGameState('finished');
      onComplete(score);
    }
  };

  if (gameState === 'intro') return (
    <div className="text-center space-y-8 py-12">
      <div className="bg-sky-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
        <Volume2 className="w-12 h-12 text-sky-600" />
      </div>
      <h2 className="text-4xl font-black text-sky-600 uppercase tracking-tighter">Missão Silêncio</h2>
      <p className="text-xl text-stone-600 font-bold max-w-md mx-auto">Em cada ambiente, identifique os sons barulhentos e ajude a manter o nível de ruído baixo para o bem-estar de todos!</p>
      <Button onClick={() => setGameState('play')} className="px-12 py-6 rounded-full bg-sky-500 text-xl font-black">ENTRAR NA MISSÃO</Button>
    </div>
  );

  if (gameState === 'finished') {
    return <GameScoreboard score={score} maxScore={scenarios.length * 5 + scenarios.length * 5} onRestart={() => {setRound(0); setScore(0); setFixedSources([]); setGameState('play');}} onExit={onExit} />;
  }

  if (gameState === 'result') {
    const isQuiet = calculateNoise(current.sources, fixedSources) <= 0;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-12">
        <div className={cn("w-32 h-32 rounded-full flex items-center justify-center mx-auto text-white shadow-2xl", isQuiet ? "bg-emerald-500" : "bg-amber-500")}>
          {isQuiet ? <CheckCircle2 className="w-16 h-16" /> : <AlertCircle className="w-16 h-16" />}
        </div>
        <div>
          <h3 className="text-4xl font-black text-stone-900 uppercase tracking-tighter mb-4">
            {isQuiet ? "Ambiente Tranquilo!" : "Ainda há ruídos..."}
          </h3>
          <p className="text-xl font-bold text-stone-600 max-w-md mx-auto">
            {isQuiet ? "Parabéns, turma! Vocês conseguiram tornar este ambiente um lugar melhor." : "Identificamos alguns sons que ainda incomodam. Vamos continuar?"}
          </p>
        </div>
        <Button onClick={nextRound} className="px-12 py-6 rounded-full bg-sky-600 text-xl font-black uppercase tracking-widest">
          {round + 1 < scenarios.length ? "PRÓXIMO CENÁRIO" : "ENCERRAR MISSÃO"}
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-stone-50 p-4 rounded-3xl border border-stone-100">
        <div className="flex items-center gap-2 font-black text-sky-600"><MapPin className="w-5 h-5" /> {current.title}</div>
        <div className="flex items-center gap-4">
          <Badge className="bg-sky-100 text-sky-700 border-sky-200">Rodada {round + 1}/{scenarios.length}</Badge>
          <div className="font-black text-stone-700 uppercase text-xs tracking-widest">Score: {score}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
             <Volume2 className="w-3 h-3" /> Nível de Ruído do Ambiente
          </span>
          <span className={cn("text-xs font-black", noiseLevel > 70 ? "text-red-500" : noiseLevel > 30 ? "text-amber-500" : "text-emerald-500")}>
            {noiseLevel.toFixed(0)}%
          </span>
        </div>
        <div className="h-4 w-full bg-stone-100 rounded-full overflow-hidden border-2 border-stone-200">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${noiseLevel}%` }}
            className={cn("h-full transition-all duration-1000", noiseLevel > 70 ? "bg-red-500" : noiseLevel > 30 ? "bg-amber-500" : "bg-emerald-500")}
          />
        </div>
      </div>

      <Card className={cn("relative aspect-[16/9] rounded-[3rem] border-4 border-stone-200 overflow-hidden shadow-2xl transition-all p-8 flex items-center justify-center", current.bg)}>
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-6 left-6 right-6 z-50 bg-white p-6 rounded-2xl shadow-2xl border-2 border-sky-500 flex items-center gap-4"
            >
              <div className={cn("p-2 rounded-full", feedback.type === 'success' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600")}>
                {feedback.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              </div>
              <p className="text-stone-700 font-bold">{feedback.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {gameState === 'play' && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-8">
            {current.sources.map(source => (
              <motion.button
                key={source.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSourceClick(source)}
                className={cn(
                  "flex flex-col items-center gap-4 group relative",
                  fixedSources.includes(source.id) && "opacity-40 grayscale pointer-events-none"
                )}
              >
                <div className="relative">
                  <div className="text-6xl md:text-7xl drop-shadow-xl z-20 relative">{source.icon}</div>
                </div>
                <Badge className="bg-white/80 backdrop-blur-sm text-stone-600 group-hover:bg-sky-600 group-hover:text-white transition-all text-[8px]">
                  {fixedSources.includes(source.id) ? "Resolvido" : "Analisar"}
                </Badge>
              </motion.button>
            ))}
          </div>
        )}

        {(gameState === 'classify' || gameState === 'solve') && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-2 border-sky-100 text-center space-y-8 z-40">
            <div className="text-7xl mb-4">{selectedSource.icon}</div>
            <h3 className="text-3xl font-black text-stone-900 tracking-tighter uppercase">{selectedSource.label}</h3>
            {gameState === 'classify' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={() => handleClassification(false)} variant="outline" className="h-20 border-2 rounded-2xl hover:bg-emerald-50 text-emerald-600 font-bold uppercase tracking-widest text-xs">SOM ADEQUADO</Button>
                <Button onClick={() => handleClassification(true)} variant="outline" className="h-20 border-2 rounded-2xl hover:bg-red-50 text-red-600 font-bold uppercase tracking-widest text-xs">MUITO BARULHO</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-stone-500 font-bold uppercase tracking-widest text-[10px]">Qual a melhor solução para este barulho?</p>
                <div className="grid grid-cols-1 gap-3">
                  {[selectedSource.solution, 'Não fazer nada', 'Aumentar o volume'].sort().map((sol, i) => (
                    <Button 
                      key={i} 
                      onClick={() => handleSolution(sol)} 
                      variant="outline" 
                      className="h-16 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-sky-50 border-2 border-stone-200 hover:border-sky-500 transition-all"
                    >
                      {sol}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </Card>

      <div className="flex items-center justify-between text-[10px] font-black text-stone-400 uppercase tracking-tighter">
        <p className="flex items-center gap-2"><Info className="w-3 h-3" /> Toque nos elementos para analisar os sons.</p>
        <button onClick={() => {setRound(0); setScore(0); setFixedSources([]); setGameState('play');}} className="flex items-center gap-2 hover:text-sky-600 transition-colors">
          <RotateCcw className="w-3 h-3" /> Reiniciar Cenário
        </button>
      </div>
    </div>
  );
}
