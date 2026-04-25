import React, { useState } from 'react';
import { Card, Button, Badge } from './UI';
import { HelpCircle, BookOpen, MessageCircle, ChevronDown, ChevronUp, LayoutDashboard, Users, PlusCircle, Trophy, Target, BarChart3, Camera, Utensils, Smartphone, X, Send, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { SupportTicket } from '../types';

interface HelpProps {
  profile: any;
  isAdmin: boolean;
  tickets: SupportTicket[];
  addTicket: (subject: string, message: string, teacherId: string, teacherName: string) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  closeTicket: (id: string) => Promise<void>;
}

export default function Help({ profile, isAdmin, tickets, addTicket, deleteTicket, closeTicket }: HelpProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const faqs = [
    {
      question: "Como as turmas ganham pontos?",
      answer: "As turmas ganham pontos através das pesagens de resíduos recicláveis (5 pontos por registro), participação em Missões Eco (pontuação variável) e bônus de Desperdício Zero na merenda (30 pontos)."
    },
    {
      question: "Quem pode registrar os dados?",
      answer: "Apenas professores e administradores cadastrados podem realizar registros no sistema para garantir a integridade dos dados escolares."
    },
    {
      question: "Como funciona o Ranking?",
      answer: "O ranking é atualizado em tempo real conforme os registros são salvos. Ele é dividido por níveis (Semente, Broto, Árvore, Floresta) baseados na pontuação acumulada."
    },
    {
      question: "O que é o Diário de Bordo?",
      answer: "É um espaço para compartilhar fotos e vídeos das atividades práticas, como a horta escolar ou mutirões de limpeza, servindo como um portfólio digital da escola."
    }
  ];

  const features = [
    {
      id: 'dashboard',
      title: "Mural (Dashboard)",
      icon: LayoutDashboard,
      desc: "Visão geral de tudo o que está acontecendo.",
      detail: "No Mural você acompanha as últimas atividades da escola, vê as fotos recentes do Diário de Bordo, confere a Missão Eco ativa e o pódio atual do ranking.",
      color: "bg-emerald-100 text-emerald-700"
    },
    {
      id: 'classes',
      title: "Turmas & Equipes",
      icon: Users,
      desc: "Área administrativa para gerenciar equipes.",
      detail: "Gerencie as turmas da escola, defina nomes de equipes criativos e atribua o professor responsável por cada grupo de alunos.",
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: 'data',
      title: "Registrar Coleta",
      icon: PlusCircle,
      desc: "Pese e registre o tipo de resíduo coletado.",
      detail: "É aqui que a mágica acontece! Selecione a turma, o tipo de material (Plástico, Papel, Metal ou Vidro) e insira o peso em Kg. Cada registro vale 5 pontos.",
      color: "bg-lime-100 text-lime-700"
    },
    {
      id: 'food',
      title: "Desperdício Zero",
      icon: Utensils,
      desc: "Monitoramento da merenda escolar.",
      detail: "Registre o cardápio do dia e o peso do que foi para o lixo. Se o desperdício for inferior a 5kg, todas as equipes recebem um bônus especial de 30 pontos!",
      color: "bg-amber-100 text-amber-700"
    },
    {
      id: 'missions',
      title: "Missões Eco",
      icon: Target,
      desc: "Desafios especiais com grandes prêmios.",
      detail: "Participe de mutirões, gincanas e desafios temáticos. As missões têm prazos e oferecem pontuações elevadas para acelerar o crescimento das equipes.",
      color: "bg-rose-100 text-rose-700"
    },
    {
      id: 'logs',
      title: "Diário de Bordo",
      icon: Camera,
      desc: "Registros visuais das nossas ações.",
      detail: "Faça upload de fotos e vídeos curtos que mostrem a sustentabilidade na prática. É o portfólio verde da nossa escola!",
      color: "bg-indigo-100 text-indigo-700"
    },
    {
      id: 'install',
      title: "Instalar no Dispositivo",
      icon: Smartphone,
      desc: "Use o EcoTech como um App nativo.",
      detail: "Para instalar: No Chrome (Android/PC), clique nos três pontos (⋮) e selecione 'Instalar Aplicativo'. No Safari (iOS), clique no botão Compartilhar (↑) e escolha 'Adicionar à Tela de Início'. Assim você acessa o EcoTech direto do seu celular ou tablet sem precisar abrir o navegador!",
      color: "bg-rose-100 text-rose-700"
    }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 w-fit rounded-full">
            <HelpCircle className="w-3 h-3 text-emerald-600" />
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Suporte</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tighter uppercase leading-none underline decoration-lime-400 decoration-8 underline-offset-8 transition-all">
            Centro de Ajuda
          </h2>
          <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] max-w-sm leading-relaxed">
             Encontre instruções, tire dúvidas frequentes e aprenda a usar todas as funcionalidades do EcoTech.
          </p>
        </div>
        <div className="hidden md:block bg-stone-100 p-6 rounded-[2.5rem] border-2 border-dashed border-stone-200">
          <HelpCircle className="w-10 h-10 text-stone-300" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[minmax(150px,_auto)]">
        {/* Main Bento Piece - Functional Guide */}
        <div className="md:col-span-12 lg:col-span-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={feature.title}
                  className={cn(
                    "bg-white p-8 rounded-[2.5rem] border border-stone-100 transition-all group cursor-pointer shadow-xl shadow-stone-200/20",
                    activeFeature === feature.id ? "ring-4 ring-emerald-500/20 border-emerald-500" : "hover:border-emerald-200"
                  )}
                  onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
                >
                   <div className="flex flex-col gap-5">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", feature.color)}>
                        <feature.icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-black text-stone-900 uppercase tracking-tighter mb-2">{feature.title}</h4>
                        <p className="text-xs text-stone-500 font-bold uppercase tracking-widest mb-3">{feature.desc}</p>
                      </div>
                   </div>
                   
                   <AnimatePresence>
                      {activeFeature === feature.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-stone-100 overflow-hidden"
                        >
                           <p className="text-sm text-stone-600 font-medium leading-relaxed italic">
                             "{feature.detail}"
                           </p>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Support Sidebar Piece */}
        <div className="md:col-span-12 lg:col-span-4 space-y-8">
           <div className="bg-emerald-950 p-10 rounded-[3rem] text-white flex flex-col justify-between relative overflow-hidden group min-h-[400px]">
              <div className="relative z-10">
                 <div className="bg-white/10 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 backdrop-blur-md">
                    <HelpCircle className="w-8 h-8 text-lime-400" />
                 </div>
                 <h3 className="text-4xl font-black tracking-tighter leading-[0.95] uppercase mb-6">Precisa de Suporte?</h3>
                 <p className="text-emerald-100/60 font-medium leading-relaxed">
                    Se você encontrou algum problema ou tem uma sugestão, procure a coordenação da escola ou entre em contato com nosso time de TI ambiental.
                 </p>
              </div>
              
              <div className="relative z-10 mt-12 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center text-emerald-950">
                       <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Canal Direto</span>
                 </div>
                 <Button 
                    onClick={() => setShowTicketModal(true)}
                    className="w-full h-16 bg-lime-400 text-emerald-950 hover:bg-lime-500 rounded-2xl font-black uppercase tracking-widest text-xs"
                 >
                    Abrir Chamado
                 </Button>
              </div>

              <div className="absolute -bottom-20 -right-20 opacity-5 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                 <HelpCircle className="w-[30rem] h-[30rem]" />
              </div>
           </div>

           {/* FAQ Bento Piece */}
           <div className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/30">
              <div className="flex items-center gap-3 mb-8">
                <BookOpen className="w-6 h-6 text-emerald-500" />
                <h3 className="text-xl font-black text-stone-900 uppercase tracking-tighter">Perguntas Frequentes</h3>
              </div>
              <div className="space-y-4">
                 {faqs.map((faq, index) => (
                   <div key={index} className="group">
                      <button 
                        onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                        className={cn(
                          "w-full flex items-center justify-between p-6 text-left rounded-2xl transition-all",
                          activeFaq === index ? "bg-stone-900 text-white" : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                        )}
                      >
                         <span className="font-black text-sm tracking-tight">{faq.question}</span>
                         {activeFaq === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <AnimatePresence>
                         {activeFaq === index && (
                           <motion.div 
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: 'auto', opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             className="overflow-hidden"
                           >
                              <div className="p-6 text-stone-500 text-sm font-medium leading-relaxed bg-white border-x border-b border-stone-50 rounded-b-2xl">
                                {faq.answer}
                              </div>
                           </motion.div>
                         )}
                      </AnimatePresence>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Admin Inbox */}
        {isAdmin && tickets && tickets.length > 0 && (
           <div className="md:col-span-12 bg-white p-8 rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/30">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-xl">
                       <MessageCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-stone-900 uppercase tracking-tighter">Inbox de Suporte</h3>
                       <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{tickets.filter((t: any) => t.status === 'open').length} chamados abertos</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[...tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((ticket) => (
                    <div key={ticket.id} className="p-6 bg-stone-50 rounded-3xl border border-stone-100 group relative">
                       <div className="flex justify-between items-start mb-3">
                          <div>
                             <Badge variant={ticket.status === 'open' ? 'emerald' : 'stone'} className="mb-2">
                                {ticket.status === 'open' ? 'Aberto' : 'Resolvido'}
                             </Badge>
                             <h4 className="font-black text-stone-900 text-sm leading-tight">{ticket.subject}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                             {ticket.status === 'open' && (
                                <button 
                                   onClick={() => closeTicket(ticket.id)}
                                   className="p-2 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                   title="Marcar como resolvido"
                                >
                                   <CheckCircle2 className="w-4 h-4" />
                                </button>
                             )}
                             <button 
                                onClick={() => deleteTicket(ticket.id)}
                                className="p-2 bg-rose-100 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                title="Excluir chamado"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                       <p className="text-xs text-stone-600 font-medium leading-relaxed italic mb-4">"{ticket.message}"</p>
                       <div className="flex items-center justify-between pt-4 border-t border-stone-200/50">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 bg-stone-200 rounded-lg flex items-center justify-center text-[10px] font-black text-stone-500">
                                {ticket.teacherName?.charAt(0)}
                             </div>
                             <span className="text-[10px] font-black text-stone-400 uppercase">{ticket.teacherName}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-stone-300">
                             <Clock className="w-3 h-3" />
                             {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {/* Ticket Modal */}
      <AnimatePresence>
         {showTicketModal && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowTicketModal(false)}
                  className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
               />
               <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden p-8 md:p-10"
               >
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                        <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg">
                           <MessageCircle className="w-6 h-6" />
                        </div>
                        <div>
                           <h3 className="text-2xl font-black text-stone-900 tracking-tighter uppercase">Abrir Chamado</h3>
                           <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Suporte Direto</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => setShowTicketModal(false)}
                        className="p-3 bg-stone-100 rounded-2xl text-stone-400 hover:text-stone-900 transition-colors"
                     >
                        <X className="w-6 h-6" />
                     </button>
                  </div>

                  <form onSubmit={async (e) => {
                     e.preventDefault();
                     if (!ticketSubject || !ticketMessage) return;
                     setIsSubmitting(true);
                     try {
                        await addTicket(ticketSubject, ticketMessage, profile.id, profile.name);
                        setShowTicketModal(false);
                        setTicketSubject('');
                        setTicketMessage('');
                     } finally {
                        setIsSubmitting(false);
                     }
                  }} className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Assunto</label>
                        <input 
                           type="text"
                           required
                           value={ticketSubject}
                           onChange={(e) => setTicketSubject(e.target.value)}
                           className="w-full bg-stone-50 border-2 border-transparent rounded-2xl px-6 py-4 font-bold text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                           placeholder="Ex: Dúvida sobre o Ranking"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Mensagem</label>
                        <textarea 
                           required
                           value={ticketMessage}
                           onChange={(e) => setTicketMessage(e.target.value)}
                           className="w-full bg-stone-50 border-2 border-transparent rounded-2xl px-6 py-4 font-bold text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner min-h-[150px] resize-none"
                           placeholder="Descreva detalhadamente sua dúvida ou sugestão..."
                        />
                     </div>
                     
                     <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-20 bg-stone-900 text-white hover:bg-emerald-600 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                     >
                        {isSubmitting ? 'Enviando...' : (
                           <>
                              <Send className="w-5 h-5" />
                              Enviar Mensagem
                           </>
                        )}
                     </Button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
