/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PlusCircle, 
  Trophy, 
  Target, 
  BarChart3, 
  Camera, 
  Leaf,
  Menu,
  X,
  LogOut,
  LogIn,
  Utensils,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Gamepad2,
  Loader2,
  PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEcoState } from './hooks/useEcoState';
import { cn } from './lib/utils';
import { AuthProvider, useAuth } from './context/AuthContext';

// Views
import { Card } from './components/UI';
import Dashboard from './components/Dashboard';
import ClassManagement from './components/ClassManagement';
import DataRegistration from './components/DataRegistration';
import FoodWasteRegistration from './components/FoodWasteRegistration';
import Ranking from './components/Ranking';
import Missions from './components/Missions';
import Reports from './components/Reports';
import WelcomeDashboard from './components/WelcomeDashboard';
import Help from './components/Help';
import Games from './components/Games';
import Play from './components/Play';
import About from './components/About';
import GuestGames from './components/GuestGames';
import InstallBanner from './components/InstallBanner';

type View = 'dashboard' | 'classes' | 'data' | 'ranking' | 'missions' | 'reports' | 'help' | 'games' | 'play' | 'about';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTeacherArea, setShowTeacherArea] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showGuestGames, setShowGuestGames] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  // Handle URL Parameters (Remote Control & Tab)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') as View;
    const remote = params.get('remote');

    if (tab) {
      setCurrentView(tab);
      if (remote) {
        setShowTeacherArea(true); // Bypass to teacher container
      }
    }
  }, []);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { user, profile, signIn, signInWithEmail, signUpWithEmail, logout, loading: authLoading } = useAuth();
  const ecoState = useEcoState();

  const isAdmin = profile?.role === 'admin';

  const [authSubmitting, setAuthSubmitting] = useState(false);

  const handleEmailAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitting(true);
    try {
      if (isRegistering) {
        await signUpWithEmail(email, password, name);
        setEmail('');
        setPassword('');
        setName('');
        setShowEmailForm(false);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: any) {
      // Errors already alerted in context
    } finally {
      setAuthSubmitting(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Mural', icon: LayoutDashboard },
    { id: 'classes', label: 'Turmas & Equipes', icon: Users, adminOnly: true },
    { id: 'data', label: 'Registrar Resíduos', icon: PlusCircle },
    { id: 'ranking', label: 'Ranking Escolar', icon: Trophy, adminOnly: true },
    { id: 'missions', label: 'Missões Eco', icon: Target },
    { id: 'reports', label: 'Relatórios', icon: BarChart3, adminOnly: true },
    { id: 'games', label: 'Eco Games', icon: Gamepad2 },
    { id: 'play', label: 'Eco Play', icon: PlayCircle },
    { id: 'help', label: 'Ajuda & FAQ', icon: HelpCircle },
  ];

  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  const mainNavItems = filteredNavItems.filter(item => 
    ['dashboard', 'data', 'missions', 'games'].includes(item.id)
  ).slice(0, 5);

  if (authLoading || ecoState.loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-sky-50">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Leaf className="w-16 h-16 text-emerald-500 fill-emerald-500" />
        </motion.div>
      </div>
    );
  }

  // PUBLIC VIEW (Children/Dashboard)
  const params = new URLSearchParams(window.location.search);
  const isRemote = params.get('remote') && params.get('tab') === 'games';

  if (showAbout) {
    return <About onBack={() => setShowAbout(false)} />;
  }

  if (showGuestGames) {
    return <GuestGames classes={ecoState.classes} onBack={() => setShowGuestGames(false)} />;
  }

  if (!showTeacherArea && !user && !isRemote && !isGuestMode) {
    return (
      <WelcomeDashboard 
        classes={ecoState.classes} 
        onTeacherLogin={() => setShowTeacherArea(true)} 
        onAbout={() => setShowAbout(true)}
        onGuestPlay={() => setShowGuestGames(true)}
      />
    );
  }

  // TEACHER LOGIN VIEW
  if (showTeacherArea && !user && !isRemote) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-100 rounded-full blur-[120px] opacity-50" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="p-8 md:p-10 space-y-8 bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[3rem] relative z-10 overflow-hidden">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-emerald-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-600/20 transform rotate-3">
                <Leaf className="w-7 h-7 text-white fill-white" />
              </div>
              
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">EcoTech</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Portal do Educador</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!showEmailForm ? (
                <motion.div 
                  key="options"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <button 
                    onClick={signIn}
                    className="w-full h-16 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-700 flex items-center justify-center gap-4 hover:border-emerald-500 hover:bg-emerald-50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all active:scale-[0.98] group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>

                  <div className="relative py-2 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                    <span className="relative px-4 bg-white/90 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Ou</span>
                  </div>

                  <button 
                    onClick={() => setShowEmailForm(true)}
                    className="w-full h-16 bg-slate-50 border-2 border-transparent rounded-2xl font-black text-slate-600 flex items-center justify-center gap-4 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-[0.98]"
                  >
                    <LogIn className="w-5 h-5 text-slate-400" />
                    E-mail e Senha
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <form onSubmit={handleEmailAction} className="space-y-4 text-left">
                    {isRegistering && (
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Quem é você?</label>
                         <input 
                           type="text" 
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 font-bold text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                           placeholder="Ex: Prof. José Silva"
                           required
                         />
                      </div>
                    )}
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Seu E-mail</label>
                       <input 
                         type="email" 
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 font-bold text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                         placeholder="seu@email.com"
                         required
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Sua Senha</label>
                       <input 
                         type="password" 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 font-bold text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                         placeholder="••••••••"
                         required
                       />
                    </div>
                    <button 
                      type="submit"
                      disabled={authSubmitting}
                      className={cn(
                        "w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2",
                        authSubmitting && "bg-emerald-600"
                      )}
                    >
                      {authSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        isRegistering ? 'Criar Conta' : 'Acessar Portal'
                      )}
                    </button>
                  </form>

                  <div className="flex flex-col gap-4 items-center">
                    <button 
                      onClick={() => setIsRegistering(!isRegistering)}
                      className="text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-emerald-600 transition-colors"
                    >
                      {isRegistering ? 'Já sou cadastrado' : 'Não tem conta? Começar agora'}
                    </button>
                    <button 
                      onClick={() => { setShowEmailForm(false); setIsRegistering(false); }}
                      className="text-slate-300 font-bold text-[10px] uppercase tracking-widest hover:text-rose-500 transition-colors flex items-center gap-2"
                    >
                      <ChevronLeft className="w-3 h-3" /> Escolher outro método
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-6 border-t border-slate-100 flex justify-center">
              <button 
                onClick={() => setShowTeacherArea(false)}
                className="group flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase hover:text-emerald-600 transition-colors"
              >
                <LogIn className="w-3 h-3 rotate-180" />
                Voltar para o Mural
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard {...ecoState} onNavigate={setCurrentView} isAdmin={isAdmin} profile={profile} />;
      case 'classes': return <ClassManagement {...ecoState} isAdmin={isAdmin} />;
      case 'data': return <DataRegistration {...ecoState} profile={profile} isAdmin={isAdmin} />;
      case 'ranking': return <Ranking {...ecoState} isAdmin={isAdmin} />;
      case 'missions': return <Missions {...ecoState} isAdmin={isAdmin} profile={profile} />;
      case 'reports': return <Reports {...ecoState} isAdmin={isAdmin} />;
      case 'play': return <Play videos={ecoState.videos} addVideo={ecoState.addVideo} deleteVideo={ecoState.deleteVideo} isAdmin={isAdmin} onPlayToggle={setIsGameActive} />;
      case 'games': return <Games classes={ecoState.classes} addGamePoints={ecoState.addGamePoints} profile={profile} isAdmin={isAdmin} onGameToggle={setIsGameActive} />;
      case 'help': return <Help 
        profile={profile} 
        isAdmin={isAdmin} 
        tickets={ecoState.tickets}
        addTicket={ecoState.addTicket}
        deleteTicket={ecoState.deleteTicket}
        closeTicket={ecoState.closeTicket}
      />;
      default: return <Dashboard {...ecoState} onNavigate={setCurrentView} isAdmin={isAdmin} profile={profile} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row font-sans text-stone-900 overflow-hidden">
      <InstallBanner />
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-stone-100 z-[100] sticky top-0">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-xl shadow-lg ring-4 ring-emerald-50">
            <Leaf className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tight text-stone-900 leading-none">ECOTECH</h1>
            <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600 mt-0.5 leading-none">DOM JOAQUIM</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {user && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 bg-stone-100 rounded-xl text-stone-600 active:scale-90 transition-transform"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Sidebar (Drawer on mobile) */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-[200] bg-zinc-950 text-white transform transition-all duration-500 md:relative md:translate-x-0 outline-none border-r border-white/5 shadow-[20px_0_60px_rgba(0,0,0,0.1)]",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "w-80"
        )}
      >
        <div className="flex flex-col h-full overflow-hidden relative">
          {/* Subtle Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-transparent pointer-events-none" />

          <div className="px-6 py-8 hidden md:flex items-center gap-4 transition-all relative z-10">
            <div className="bg-emerald-600 p-2.5 rounded-2xl shadow-xl shadow-emerald-900/40 shrink-0 transform -rotate-3 border border-emerald-500/50">
              <Leaf className="w-8 h-8 text-white fill-white" />
            </div>
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="font-black text-2xl tracking-tighter leading-none text-white">EcoTech</h1>
              <p className="text-emerald-500 text-[8px] font-black uppercase tracking-[0.3em] mt-1.5 leading-none">Dom Joaquim</p>
            </motion.div>
          </div>

          <nav className="flex-1 px-5 py-2 space-y-1 overflow-y-auto no-scrollbar relative z-10">
            <div className="mb-2 px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
              Menu Principal
            </div>
            {filteredNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as View);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center rounded-2xl transition-all duration-300 group text-left relative overflow-hidden",
                  "gap-4 px-4 py-2.5",
                  currentView === item.id 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/30" 
                    : "hover:bg-white/5 text-zinc-400 hover:text-white"
                )}
              >
                {currentView === item.id && (
                  <motion.div 
                    layoutId="activeSidebar"
                    className="absolute left-0 w-1 h-1/2 bg-emerald-400 rounded-full"
                  />
                )}
                <item.icon className={cn(
                  "shrink-0 transition-transform duration-300",
                  "w-5 h-5",
                  currentView === item.id ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className="font-bold text-sm tracking-tight truncate">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-5 space-y-3 mt-auto border-t border-white/5 bg-black/20">
            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/5 transition-all overflow-hidden p-4">
              <div className="flex items-center gap-4">
                 <div className="relative">
                    {user?.photoURL ? (
                       <img src={user.photoURL} className="w-10 h-10 rounded-2xl border-2 border-emerald-500/30 shadow-lg" alt="" />
                    ) : (
                       <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-xs font-black shadow-lg">
                         {user?.displayName?.charAt(0)}
                       </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-lime-500 border-2 border-zinc-900 rounded-full" />
                 </div>
                 <div className="overflow-hidden">
                    <p className="text-xs font-black truncate leading-none mb-1 text-white">{user?.displayName || 'Eco-Visitante'}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest truncate leading-none">
                       {isAdmin ? 'Admin Principal' : (ecoState.classes.find(c => c.teacherId === profile?.id)?.name || 'Aprendiz Eco')}
                    </p>
                 </div>
              </div>
            </div>
            
            <button 
              onClick={user ? logout : () => { setIsGuestMode(false); setCurrentView('dashboard'); }}
              className="w-full flex items-center text-zinc-500 hover:text-rose-500 transition-all text-[10px] font-black uppercase tracking-widest group gap-3 px-4 py-2 hover:bg-rose-500/5 rounded-2xl"
            >
              <LogOut className="transition-transform w-4 h-4 group-hover:-translate-x-1" />
              <span>{user ? 'Sair do Portal' : 'Voltar ao Início'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen scroll-smooth pb-32 md:pb-8 md:p-8 lg:p-12 no-scrollbar">
        <div className="max-w-6xl mx-auto p-4 md:p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Floating Bottom Nav */}
      <AnimatePresence>
        {!isGameActive && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="md:hidden fixed bottom-0 inset-x-0 p-6 pointer-events-none z-[100]"
          >
            <div className="max-w-xs mx-auto flex items-center justify-between bg-white/90 backdrop-blur-3xl rounded-[3rem] p-2 border border-white shadow-[0_25px_60px_rgba(0,0,0,0.15)] pointer-events-auto ring-1 ring-black/5">
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as View)}
                  className={cn(
                    "flex-1 flex flex-col items-center justify-center p-3 rounded-[2.5rem] transition-all relative overflow-hidden",
                    currentView === item.id 
                      ? "bg-emerald-600 text-white shadow-xl shadow-emerald-200" 
                      : "text-stone-400 hover:text-stone-600"
                  )}
                >
                  {currentView === item.id && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute inset-0 bg-emerald-600 -z-10"
                    />
                  )}
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform duration-300",
                    currentView === item.id ? "scale-110" : "group-hover:scale-110"
                  )} />
                  <span className={cn(
                    "text-[7px] font-black uppercase tracking-[0.1em] mt-1.5 leading-none transition-all",
                    currentView === item.id ? "opacity-100" : "opacity-0 h-0"
                  )}>
                    {item.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

