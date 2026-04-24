import React, { useState } from 'react';
import { Card, Button, Badge } from './UI';
import { HelpCircle, BookOpen, MessageCircle, ChevronDown, ChevronUp, LayoutDashboard, Users, PlusCircle, Trophy, Target, BarChart3, Camera, Utensils, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Help() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-950 tracking-tighter uppercase underline decoration-lime-400 decoration-8 underline-offset-8 transition-all">
            Centro de Ajuda
          </h2>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-xs mt-6">Instruções e dúvidas frequentes sobre o EcoTech</p>
        </div>
        <div className="bg-emerald-100 p-4 rounded-3xl">
           <HelpCircle className="w-8 h-8 text-emerald-700" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Interactive Features Guide */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tighter">Guia de Funcionalidades</h3>
           </div>
                      <div className="grid grid-cols-1 gap-4">
              {features.map((feature, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={feature.title}
                  className={cn(
                    "bg-white p-6 rounded-[2rem] border-2 transition-all group cursor-pointer",
                    activeFeature === feature.id ? "border-emerald-500 shadow-xl" : "border-stone-100 hover:border-emerald-200 shadow-sm"
                  )}
                  onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
                >
                   <div className="flex gap-5">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform", feature.color)}>
                        <feature.icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-stone-900 uppercase tracking-tight mb-1">{feature.title}</h4>
                        <p className="text-sm text-stone-500 font-medium leading-relaxed">{feature.desc}</p>
                      </div>
                      <div className="flex items-center text-stone-300">
                        {activeFeature === feature.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                   </div>
                   
                   <AnimatePresence>
                      {activeFeature === feature.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-stone-100"
                        >
                           <p className="text-sm text-emerald-900 font-bold leading-relaxed bg-emerald-50 p-4 rounded-2xl">
                             {feature.detail}
                           </p>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </motion.div>
              ))}
            </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="w-5 h-5 text-emerald-500" />
              <h3 className="text-xl font-black text-emerald-950 uppercase tracking-tighter">Perguntas Frequentes</h3>
           </div>

           <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-100">
                   <button 
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-emerald-50 transition-colors"
                   >
                      <span className="font-black text-stone-900 tracking-tight">{faq.question}</span>
                      {activeFaq === index ? <ChevronUp className="w-5 h-5 text-emerald-600" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
                   </button>
                   <AnimatePresence>
                      {activeFaq === index && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6"
                        >
                           <p className="text-stone-600 text-sm leading-relaxed font-medium pt-2 border-t border-stone-200">
                             {faq.answer}
                           </p>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
              ))}
           </div>

           <Card className="bg-emerald-900 text-white border-none p-8 mt-8">
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="bg-white/10 p-4 rounded-full">
                    <Target className="w-8 h-8 text-lime-400" />
                 </div>
                 <h4 className="text-2xl font-black uppercase tracking-tighter">Precisa de Suporte?</h4>
                 <p className="text-emerald-100/60 text-sm font-medium">
                    Se você encontrou algum problema ou tem uma sugestão, procure a coordenação da escola ou entre em contato com o administrador do sistema.
                 </p>
                 <Button className="bg-lime-400 text-emerald-950 hover:bg-lime-500 border-none w-full mt-4">
                    Falar com Suporte
                 </Button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
