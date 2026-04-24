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
import VisualLog from './components/VisualLog';
import WelcomeDashboard from './components/WelcomeDashboard';
import Help from './components/Help';
import Games from './components/Games';
import Play from './components/Play';

type View = 'dashboard' | 'classes' | 'data' | 'ranking' | 'missions' | 'reports' | 'logs' | 'help' | 'games' | 'play';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showTeacherArea, setShowTeacherArea] = useState(false);

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
    { id: 'logs', label: 'Diário de Bordo', icon: Camera },
    { id: 'games', label: 'Eco Games', icon: Gamepad2 },
    { id: 'play', label: 'Eco Play', icon: PlayCircle },
    { id: 'help', label: 'Ajuda & FAQ', icon: HelpCircle },
  ];

  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

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
  const isRemote = params.get('remote') && (params.get('tab') === 'play' || params.get('tab') === 'games');

  if (!showTeacherArea && !user && !isRemote) {
    return (
      <WelcomeDashboard 
        classes={ecoState.classes} 
        onTeacherLogin={() => setShowTeacherArea(true)} 
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
      case 'logs': return <VisualLog {...ecoState} isAdmin={isAdmin} profile={profile} />;
      case 'play': return <Play videos={ecoState.videos} addVideo={ecoState.addVideo} deleteVideo={ecoState.deleteVideo} isAdmin={isAdmin} />;
      case 'games': return <Games classes={ecoState.classes} addGamePoints={ecoState.addGamePoints} profile={profile} isAdmin={isAdmin} />;
      case 'help': return <Help />;
      default: return <Dashboard {...ecoState} onNavigate={setCurrentView} isAdmin={isAdmin} profile={profile} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col md:flex-row font-sans text-stone-900">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-emerald-700 text-white shadow-md">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 fill-lime-400 text-lime-400" />
          <span className="font-bold text-base sm:text-lg tracking-tight">EcoTech Dom Joaquim</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-emerald-800 text-white transform transition-all duration-300 md:relative md:translate-x-0 outline-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          isSidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        <div className="flex flex-col h-full overflow-hidden relative">
          {/* Collapse Toggle Desktop */}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex absolute -right-3 top-24 bg-emerald-700 text-white p-1 rounded-full border-2 border-emerald-800 shadow-lg hover:bg-emerald-600 transition-all z-[60]"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <div className={cn("p-6 hidden md:flex items-center gap-3 transition-all", isSidebarCollapsed && "px-0 justify-center")}>
            <div className="bg-white p-2 rounded-xl shadow-lg shrink-0">
              <Leaf className="w-8 h-8 text-emerald-600 fill-emerald-600" />
            </div>
            {!isSidebarCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="font-black text-xl tracking-tighter leading-none">EcoTech</h1>
                <p className="text-emerald-300 text-[9px] font-medium uppercase tracking-widest mt-1">Dom Joaquim de Almeida</p>
              </motion.div>
            )}
          </div>

          <nav className={cn("flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar", isSidebarCollapsed && "px-2")}>
            {filteredNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as View);
                  setIsSidebarOpen(false);
                }}
                title={isSidebarCollapsed ? item.label : undefined}
                className={cn(
                  "w-full flex items-center rounded-xl transition-all duration-200 group text-left",
                  isSidebarCollapsed ? "justify-center p-3" : "gap-3 px-4 py-2.5",
                  currentView === item.id 
                    ? "bg-emerald-100 text-emerald-900 shadow-xl shadow-emerald-900/20" 
                    : "hover:bg-emerald-700/50 text-emerald-100"
                )}
              >
                <item.icon className={cn(
                  "shrink-0",
                  isSidebarCollapsed ? "w-6 h-6" : "w-4 h-4",
                  currentView === item.id ? "text-emerald-700" : "text-emerald-300 group-hover:text-emerald-100"
                )} />
                {!isSidebarCollapsed && (
                  <span className="font-bold text-sm tracking-tight truncate">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          <div className={cn("p-4 space-y-3 mt-auto", isSidebarCollapsed && "p-2")}>
            <div className={cn("bg-emerald-900/40 rounded-2xl border border-emerald-700/50 transition-all", isSidebarCollapsed ? "p-2" : "p-3")}>
              {isSidebarCollapsed ? (
                <div className="flex justify-center">
                   {user?.photoURL ? (
                      <img src={user.photoURL} className="w-8 h-8 rounded-full border border-emerald-500/50" alt="" />
                   ) : (
                      <div className="w-8 h-8 bg-emerald-700 rounded-full flex items-center justify-center text-[10px] font-black">
                        {user?.displayName?.charAt(0)}
                      </div>
                   )}
                </div>
              ) : (
                <>
                  <p className="text-emerald-400 text-[9px] uppercase font-bold tracking-widest mb-1.5 opacity-60">Status Professor</p>
                  <div className="flex items-center gap-3">
                     {user?.photoURL ? (
                        <img src={user.photoURL} className="w-7 h-7 rounded-full border border-emerald-500/50" alt="" />
                     ) : (
                        <div className="w-7 h-7 bg-emerald-700 rounded-full flex items-center justify-center text-[10px] font-black">
                          {user?.displayName?.charAt(0)}
                        </div>
                     )}
                     <div className="overflow-hidden">
                        <p className="text-[11px] font-black truncate leading-none mb-0.5">{user?.displayName}</p>
                        <p className="text-[8px] text-emerald-300 truncate opacity-60">
                           {ecoState.classes.find(c => c.teacherId === profile?.id)?.name || 'Sem turma'}
                        </p>
                     </div>
                  </div>
                </>
              )}
            </div>
            
            <button 
              onClick={logout}
              className={cn(
                "w-full flex items-center text-emerald-300 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest",
                isSidebarCollapsed ? "justify-center p-2" : "gap-2 px-3 py-2"
              )}
            >
              <LogOut className={isSidebarCollapsed ? "w-5 h-5" : "w-3 h-3"} />
              {!isSidebarCollapsed && <span>Sair da Área Restrita</span>}
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
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto h-screen scroll-smooth">
        <div className="max-w-6xl mx-auto">
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

