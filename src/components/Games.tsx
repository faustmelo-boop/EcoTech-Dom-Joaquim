import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from './UI';
import { 
  Gamepad2, Recycle, Leaf, Search, Trophy, RotateCcw, 
  Timer, Heart, ArrowLeft, ArrowRight, CheckCircle2, XCircle, HelpCircle, AlertCircle, Info, MapPin, Users,
  Volume2, VolumeX, Smartphone, Music, Construction, Megaphone, Bird
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ClassTeam } from '../types';

type GameType = 'ecology' | 'sorting' | 'detective' | 'silence' | null;

interface GamesProps {
  classes: ClassTeam[];
  addGamePoints: (classId: string, points: number) => Promise<void>;
  profile: any;
  isAdmin: boolean;
}

export default function Games({ classes, addGamePoints, profile, isAdmin }: GamesProps) {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [sessionPoints, setSessionPoints] = useState(0);

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
    { id: 'detective', title: 'Detetives do Lixo', icon: Search, color: 'bg-purple-500', desc: 'Investigue e resolva problemas ambientais!' },
    { id: 'silence', title: 'Missão Silêncio', icon: Volume2, color: 'bg-sky-500', desc: 'Identifique e controle a poluição sonora!' }
  ];

  if (!activeGame) {
    const selectedClass = classes.find(c => c.id === selectedClassId);

    return (
      <div className="space-y-12 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-950 tracking-tighter uppercase underline decoration-lime-400 decoration-8 underline-offset-8 transition-all">
              Eco Games
            </h2>
            <p className="text-stone-500 font-bold uppercase tracking-widest text-xs mt-6">Aprender brincando é o nosso lema!</p>
          </div>
          
          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Sessão Atual</p>
                <div className="flex items-center gap-2 justify-end">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="font-black text-xl text-stone-900">{sessionPoints} pts</span>
                </div>
              </div>
              <div className="bg-emerald-100 p-4 rounded-3xl shrink-0">
                <Gamepad2 className="w-8 h-8 text-emerald-700" />
              </div>
            </div>
            {selectedClass && (
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                {selectedClass.name} - {selectedClass.teamName}
              </Badge>
            )}
          </div>
        </div>

        <Card className="p-6 bg-white border-2 border-stone-100">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="bg-purple-100 p-4 rounded-2xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-stone-900 uppercase tracking-tight">Turma Ativa</h4>
              <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">Os pontos serão registrados para sua equipe!</p>
            </div>
            {profile?.role === 'teacher' ? (
              <div className="bg-emerald-50 px-6 py-4 rounded-2xl border-2 border-emerald-100 min-w-[256px] text-center">
                <p className="font-black text-emerald-700 uppercase tracking-tighter">
                  {classes.find(c => c.id === selectedClassId)?.name || 'Sem turma'}
                </p>
                <p className="text-[10px] font-black text-emerald-600/50 uppercase tracking-widest">Equipe: {classes.find(c => c.id === selectedClassId)?.teamName || '-'}</p>
              </div>
            ) : (
              <select 
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                disabled={!!profile && !isAdmin}
                className="w-full sm:w-64 bg-stone-50 border-2 border-stone-100 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
              >
                <option value="">Escolher turma...</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - {c.teamName}</option>
                ))}
              </select>
            )}
          </div>
        </Card>

        {!selectedClassId && (
          <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
            <p className="text-amber-800 font-bold text-sm">Atenção detetives! Selecionem sua turma acima para que os pontos contem para o ranking oficial da escola!</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {gameCards.map((game, idx) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card 
                className="p-8 h-full flex flex-col items-center text-center cursor-pointer hover:border-emerald-500 hover:shadow-2xl transition-all group overflow-hidden relative"
                onClick={() => setActiveGame(game.id as GameType)}
              >
                <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mb-6 text-white shadow-xl group-hover:scale-110 transition-transform", game.color)}>
                  <game.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tighter mb-3">{game.title}</h3>
                <p className="text-stone-500 text-sm font-medium mb-8 leading-relaxed">{game.desc}</p>
                {lastResults[game.id] !== undefined && (
                  <Badge className="absolute top-4 right-4 bg-lime-100 text-lime-700 border-lime-200">
                    Recorde: {lastResults[game.id]}
                  </Badge>
                )}
                <Button className={cn("w-full mt-auto rounded-full py-6 text-lg font-black", game.color)}>JOGAR AGORA</Button>
              </Card>
            </motion.div>
          ))}
        </div>
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
          {activeGame === 'detective' && <DetectiveGame onComplete={(score) => saveScore('detective', score)} onExit={() => setActiveGame(null)} />}
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

// --- GAME 4: DETETIVES "DETETIVES DO LIXO" ---
function DetectiveGame({ onComplete, onExit }: { onComplete: (s: number) => void, onExit: () => void }) {
  const [round, setRound] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'investigating' | 'solution' | 'feedback' | 'finished'>('intro');
  const [foundErrors, setFoundErrors] = useState<number[]>([]);
  const [lastErrorMsg, setLastErrorMsg] = useState<string | null>(null);
  const [solutionResult, setSolutionResult] = useState<{ correct: boolean, msg: string } | null>(null);

  const scenes = [
    {
      title: "O Parque da Cidade",
      image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=1200",
      errors: [
        { id: 0, label: "Garrafa Plástica", x: 25, y: 75, msg: "A garrafa no chão demora centenas de anos para sumir!", icon: "🧴" },
        { id: 1, label: "Lixo Misturado", x: 75, y: 65, msg: "Papel e restos de comida juntos dificultam a reciclagem.", icon: "🍱" },
        { id: 2, label: "Comida no Banco", x: 55, y: 45, msg: "Restos de comida atraem insetos e animais que podem ficar doentes.", icon: "🍕" }
      ],
      solutions: [
        { text: "Instalar lixeiras coloridas e placas educativas", correct: true, feedback: "Exatamente! Placas ajudam as pessoas a aprender onde jogar cada coisa." },
        { text: "Proibir as pessoas de entrarem no parque", correct: false, feedback: "Poxa, o parque é para todos! Precisamos educar, não proibir." }
      ]
    },
    {
      title: "Cozinha da Escola",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200",
      errors: [
        { id: 3, label: "Torneira Pingando", x: 70, y: 35, msg: "Uma torneira pingando desperdiça muita água pura!", icon: "💧" },
        { id: 4, label: "Lixeira Única", x: 20, y: 80, msg: "Sem separação de lixo, perdemos a chance de reciclar.", icon: "🗑️" },
        { id: 5, label: "Prato com Sobras", x: 50, y: 60, msg: "Sobrou muita comida! Precisamos cozinhar apenas o necessário.", icon: "🍽️" }
      ],
      solutions: [
        { text: "Trocar a torneira e usar lixeiras separadas", correct: true, feedback: "Muito bem! Economizamos água e reciclamos o material!" },
        { text: "Comprar mais pratos e torneiras novas", correct: false, feedback: "Isso não resolve o desperdício, apenas gasta mais dinheiro." }
      ]
    },
    {
      title: "Nossa Sala de Aula",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200",
      errors: [
        { id: 6, label: "Luz Acesa", x: 80, y: 20, msg: "Sala vazia não precisa de luz acesa!", icon: "💡" },
        { id: 7, label: "Papel Amassado", x: 35, y: 75, msg: "Este papel poderia ser rascunho ou ir para reciclagem.", icon: "📄" },
        { id: 8, label: "Ar Condicionado", x: 15, y: 25, msg: "Janelas abertas com o ar ligado gastam muita energia.", icon: "❄️" }
      ],
      solutions: [
        { text: "Criar o 'Ajudante da Ecologia' para cuidar da sala", correct: true, feedback: "Incrível! A participação dos alunos é a melhor solução!" },
        { text: "Pedir para o zelador apagar tudo sempre", correct: false, feedback: "Nós também somos responsáveis pela nossa sala." }
      ]
    },
    {
      title: "Rua do Bairro",
      image: "https://images.unsplash.com/photo-1516515429572-1b606fa7019c?q=80&w=1200",
      errors: [
        { id: 9, label: "Bueiro com Lixo", x: 55, y: 80, msg: "Lixo no bueiro causa enchentes quando chove!", icon: "🕳️" },
        { id: 10, label: "Sacolas Plásticas", x: 25, y: 45, msg: "Sacolas voando poluem a natureza e bueiros.", icon: "🛍️" },
        { id: 11, label: "Lavando Calçada", x: 75, y: 75, msg: "Usar mangueira para varrer a calçada gasta muita água.", icon: "🚿" }
      ],
      solutions: [
        { text: "Fazer mutirão de limpeza e usar vassouras", correct: true, feedback: "Sim! Trabalhar juntos e usar vassoura economiza água!" },
        { text: "Esperar a prefeitura limpar e a chuva parar", correct: false, feedback: "Nossos atos diários evitam que a sujeira se acumule!" }
      ]
    },
    {
      title: "Pátio do Recreio",
      image: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=1200",
      errors: [
        { id: 12, label: "Copos Descartáveis", x: 35, y: 60, msg: "Muitos copos iguais! Poderíamos usar garrafas de casa.", icon: "🥤" },
        { id: 13, label: "Resto de Lanche", x: 65, y: 70, msg: "Lixo orgânico largado pelo pátio.", icon: "🍪" },
        { id: 14, label: "Chão Sujo", x: 40, y: 30, msg: "O pátio fica feio e sujo sem a nossa ajuda.", icon: "🍂" }
      ],
      solutions: [
        { text: "Campanha: Cada um traz sua garrafinha!", correct: true, feedback: "Isso mesmo! Reutilizar é melhor que descartar." },
        { text: "Comprar copos maiores para todos", correct: false, feedback: "Copos maiores ainda são lixo. O segredo é reutilizar!" }
      ]
    }
  ];

  const handleLevelClick = (errorId: number) => {
    if (gameState !== 'investigating') return;
    if (foundErrors.includes(errorId)) return;

    const error = current.errors.find(e => e.id === errorId);
    if (error) {
      setFoundErrors([...foundErrors, errorId]);
      setTotalScore(s => s + 1);
      setLastErrorMsg(error.msg);
      
      if (foundErrors.length + 1 === 3) {
        setTimeout(() => {
          setGameState('solution');
          setLastErrorMsg(null);
        }, 3000);
      } else {
        setTimeout(() => setLastErrorMsg(null), 1500);
      }
    }
  };

  const handleSolutionSelect = (solution: { text: string, correct: boolean, feedback: string }) => {
    if (solution.correct) setTotalScore(s => s + 2);
    setSolutionResult({ correct: solution.correct, msg: solution.feedback });
    setGameState('feedback');
  };

  const nextRound = () => {
    if (round + 1 < scenes.length) {
      setRound(round + 1);
      setFoundErrors([]);
      setSolutionResult(null);
      setGameState('investigating');
    } else {
      setGameState('finished');
      onComplete(totalScore);
    }
  };

  if (gameState === 'intro') return (
    <div className="text-center space-y-8 py-12">
      <div className="bg-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="w-12 h-12 text-purple-600" />
      </div>
      <h2 className="text-4xl font-black text-purple-600 uppercase tracking-tighter">Detetives do Lixo</h2>
      <p className="text-xl text-stone-600 font-bold max-w-md mx-auto">Observe a cena e encontre 3 problemas ambientais escondidos. Depois, escolha a melhor solução!</p>
      <Button onClick={() => setGameState('investigating')} className="px-12 py-6 rounded-full bg-purple-500 text-xl font-black">COMEÇAR INVESTIGAÇÃO</Button>
    </div>
  );

  const current = scenes[round];

  if (gameState === 'finished') {
    const finalMsg = totalScore >= scenes.length * 4 ? "Vocês são ótimos investigadores ambientais!" : "Vamos observar melhor o lixo no nosso dia a dia!";
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8 py-12">
        <Trophy className="w-24 h-24 mx-auto text-purple-500" />
        <div>
          <h2 className="text-5xl font-black text-purple-600 uppercase tracking-tighter mb-4">Caso Encerrado!</h2>
          <p className="text-2xl font-bold text-stone-700">{finalMsg}</p>
        </div>
        <div className="bg-stone-50 p-10 rounded-[3rem] border-2 border-purple-100 inline-block">
          <p className="text-stone-400 font-black uppercase text-xs tracking-widest mb-2">Pontuação Detetive</p>
          <p className="text-8xl font-black text-stone-900">{totalScore}<span className="text-2xl text-stone-300">/{scenes.length * 5}</span></p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button onClick={() => {setRound(0); setTotalScore(0); setFoundErrors([]); setGameState('investigating'); setSolutionResult(null);}} className="px-12 py-6 rounded-full bg-purple-500 text-lg font-black uppercase">NOVA INVESTIGAÇÃO</Button>
          <Button onClick={onExit} variant="outline" className="px-12 py-6 rounded-full text-lg font-black uppercase">SAIR</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-stone-50 p-4 rounded-3xl border border-stone-100">
        <div className="flex items-center gap-2 font-black text-purple-600"><MapPin className="w-5 h-5" /> {current.title}</div>
        <Badge className="bg-purple-100 text-purple-700 border-purple-200">Cena {round + 1}/{scenes.length}</Badge>
        <div className="font-black text-stone-700 uppercase text-xs tracking-widest">Pontos: {totalScore}</div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'investigating' && (
          <motion.div 
            key="investigating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="relative aspect-[16/9] bg-stone-100 rounded-[3rem] border-4 border-stone-200 overflow-hidden shadow-xl group cursor-crosshair"
          >
            <div className="absolute inset-0 z-0">
              <img src={current.image} alt={current.title} className="w-full h-full object-cover brightness-75 transition-all group-hover:brightness-90" />
              <div className="absolute inset-0 bg-purple-900/10 mix-blend-overlay" />
            </div>
            
            <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-purple-100 flex items-center justify-between z-30 shadow-lg">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-purple-600" />
                <p className="font-bold text-stone-700 text-sm md:text-base">Encontre {3 - foundErrors.length} problemas clicando neles!</p>
              </div>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={cn("w-3 h-3 rounded-full", i < foundErrors.length ? "bg-purple-600" : "bg-stone-200")} />
                ))}
              </div>
            </div>

            <AnimatePresence>
              {lastErrorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="absolute bottom-6 left-6 right-6 bg-white p-6 rounded-2xl shadow-2xl z-40 border-2 border-purple-500 flex items-start gap-4"
                >
                  <div className="bg-purple-100 p-2 rounded-full"><AlertCircle className="text-purple-600 w-6 h-6" /></div>
                  <div>
                    <p className="text-purple-900 font-black uppercase text-xs tracking-widest mb-1">Problema Encontrado!</p>
                    <p className="text-stone-700 font-bold">{lastErrorMsg}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {current.errors.map(err => {
              const isFound = foundErrors.includes(err.id);
              return (
                <button
                  key={err.id}
                  onClick={() => handleLevelClick(err.id)}
                  className={cn(
                    "absolute w-20 h-20 -ml-10 -mt-10 rounded-full flex items-center justify-center transition-all transform hover:scale-125 z-20",
                    isFound ? "pointer-events-none" : "cursor-pointer group/item"
                  )}
                  style={{ left: `${err.x}%`, top: `${err.y}%` }}
                >
                  <AnimatePresence mode="wait">
                    {isFound ? (
                      <motion.div 
                        initial={{ scale: 0, rotate: -20 }} 
                        animate={{ scale: 1, rotate: 0 }}
                        className="bg-emerald-500 p-2 rounded-full shadow-lg border-2 border-white"
                      >
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="text-4xl filter drop-shadow-lg transition-all duration-300 opacity-90 hover:opacity-100"
                      >
                        {err.icon}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </motion.div>
        )}

        {gameState === 'solution' && (
          <motion.div
            key="solution"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-8 md:p-12 text-center space-y-8">
              <div className="text-center">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-black text-stone-900 uppercase tracking-tighter mb-2">Problemas Encontrados!</h3>
                <p className="text-stone-600 font-bold max-w-md mx-auto">Excelente trabalho de observação! Agora, o que podemos fazer para resolver essa situação?</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 pt-4">
                {current.solutions.map((sol, i) => (
                  <Button 
                    key={i} 
                    onClick={() => handleSolutionSelect(sol)}
                    variant="outline" 
                    className="py-10 rounded-3xl text-xl font-bold border-2 hover:bg-purple-50 hover:border-purple-300 flex flex-col gap-1 h-auto px-6 whitespace-normal text-left"
                  >
                    {sol.text}
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {gameState === 'feedback' && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8 md:p-12 text-center space-y-8 h-full bg-stone-50/50">
              <div className="space-y-6">
                <div className={cn(
                  "p-8 rounded-[3rem] border-4 mb-8",
                  solutionResult?.correct ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
                )}>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    {solutionResult?.correct ? <CheckCircle2 className="w-10 h-10 text-emerald-600" /> : <XCircle className="w-10 h-10 text-red-600" />}
                    <h3 className={cn("text-3xl font-black uppercase tracking-tighter", solutionResult?.correct ? "text-emerald-700" : "text-red-700")}>
                      {solutionResult?.correct ? "Ótima Decisão!" : "Não foi dessa vez!"}
                    </h3>
                  </div>
                  <p className="text-lg font-bold text-stone-700">{solutionResult?.msg}</p>
                </div>

                <h3 className="text-2xl font-black text-purple-600 uppercase tracking-tighter">Relatório da Investigação</h3>
                <div className="bg-white p-6 rounded-3xl text-left space-y-4 border-2 border-stone-100 shadow-sm">
                  <p className="font-black text-[10px] text-stone-400 uppercase tracking-widest border-b border-stone-200 pb-2">Evidências Coletadas:</p>
                  <ul className="space-y-4">
                    {current.errors.map(e => (
                      <li key={e.id} className="flex gap-4 items-start text-stone-700">
                        <div className="bg-purple-100 p-2 rounded-xl shrink-0"><Info className="w-5 h-5 text-purple-600" /></div>
                        <div className="text-sm">
                          <p className="font-black uppercase tracking-tight text-purple-900">{e.label}</p>
                          <p className="font-medium text-stone-500">{e.msg}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Button onClick={nextRound} className="w-full py-8 rounded-[2rem] bg-purple-600 hover:bg-purple-700 text-xl font-black uppercase tracking-widest shadow-xl shadow-purple-200">
                {round + 1 < scenes.length ? "PRÓXIMA INVESTIGAÇÃO" : "VER RESULTADO FINAL"}
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => {setRound(0); setTotalScore(0); setFoundErrors([]); setGameState('intro'); setSolutionResult(null);}} className="flex items-center gap-2 mx-auto text-stone-400 hover:text-stone-600 uppercase font-black text-[10px] tracking-widest">
        <RotateCcw className="w-3 h-3" /> Reiniciar Investigação
      </button>
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
