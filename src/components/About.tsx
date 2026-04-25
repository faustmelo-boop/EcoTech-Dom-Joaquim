import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Trees, ArrowLeft, Info, Target, BarChart3, Gamepad2, Users, Rocket } from 'lucide-react';
import { Button } from './UI';

export default function About({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#f9fbf2] pb-24 font-sans selection:bg-emerald-200">
      {/* Header */}
      <header className="px-8 pt-12 pb-12 bg-emerald-600 text-white relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-300 rounded-full blur-[100px]"
        />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-emerald-100 hover:text-white font-black uppercase text-[10px] tracking-widest mb-12 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para Portaria
          </button>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/30">
              <Info className="w-5 h-5 text-lime-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Sobre o Projeto</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
               Bem-vindos ao<br/>
               <span className="text-lime-400 font-cursive text-5xl md:text-7xl">EcoTech Escola! 🌿💻</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-stone-100 p-8 md:p-12 space-y-12">
          
          {/* Intro Section */}
          <section className="space-y-6">
            <div className="inline-block p-4 bg-emerald-50 rounded-3xl">
              <Leaf className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-stone-600 font-medium text-lg leading-relaxed">
              O <span className="font-black text-emerald-600 uppercase tracking-tight">EcoTech Escola</span> é uma iniciativa inovadora da Escola Municipal Dom Joaquim de Almeida, voltada para os alunos do Ensino Fundamental I. Nosso objetivo é unir a tecnologia e a sustentabilidade para transformar a nossa escola em um lugar mais verde, inteligente e consciente.
            </p>
          </section>

          {/* Pillars */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 bg-stone-50 p-6 rounded-[2rem] border border-stone-200/50">
               <div className="bg-sky-100 p-3 rounded-2xl w-fit">
                  <BarChart3 className="w-6 h-6 text-sky-600" />
               </div>
               <h3 className="font-black text-stone-900 uppercase tracking-tighter text-xl">Monitoramento</h3>
               <p className="text-stone-500 text-sm font-medium leading-relaxed">
                 Com o auxílio de celulares e tablets, os alunos registram a quantidade e o tipo de resíduos gerados na escola.
               </p>
            </div>
            <div className="space-y-4 bg-stone-50 p-6 rounded-[2rem] border border-stone-200/50">
               <div className="bg-emerald-100 p-3 rounded-2xl w-fit">
                  <Target className="w-6 h-6 text-emerald-600" />
               </div>
               <h3 className="font-black text-stone-900 uppercase tracking-tighter text-xl">Análise</h3>
               <p className="text-stone-500 text-sm font-medium leading-relaxed">
                 Os dados coletados são transformados automaticamente em gráficos e indicadores visuais aqui na nossa plataforma.
               </p>
            </div>
            <div className="space-y-4 bg-stone-50 p-6 rounded-[2rem] border border-stone-200/50">
               <div className="bg-purple-100 p-3 rounded-2xl w-fit">
                  <Rocket className="w-6 h-6 text-purple-600" />
               </div>
               <h3 className="font-black text-stone-900 uppercase tracking-tighter text-xl">Intervenção</h3>
               <p className="text-stone-500 text-sm font-medium leading-relaxed">
                 Com base nos dados, os alunos planejam e executam ações práticas para reduzir o lixo e melhorar o descarte.
               </p>
            </div>
          </section>

          {/* Detailed Content */}
          <div className="prose prose-stone max-w-none space-y-12">
            <section className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-lime-400 rounded-full" />
                <h2 className="text-3xl font-black text-stone-900 uppercase tracking-tighter">🌟 Nossa Missão</h2>
              </div>
              <p className="text-stone-600 text-lg leading-relaxed">
                Vivemos em um mundo digital e, ao mesmo tempo, enfrentamos grandes desafios ambientais. Nosso projeto nasce para responder a uma pergunta simples: <span className="text-emerald-600 font-bold">Como podemos usar os dados e a tecnologia para cuidar melhor do nosso planeta?</span>
              </p>
              <p className="text-stone-600 text-lg leading-relaxed">
                Através do letramento de dados (Data Literacy) e do pensamento computacional, incentivamos nossos estudantes a deixarem de ser apenas usuários de tecnologia para se tornarem cientistas e proponentes de soluções reais para o meio ambiente escolar.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-sky-400 rounded-full" />
                <h2 className="text-3xl font-black text-stone-900 uppercase tracking-tighter">🎮 Gamificação e Aprendizado</h2>
              </div>
              <p className="text-stone-600 text-lg leading-relaxed">
                Acreditamos que aprender pode (e deve) ser divertido! Por isso, o EcoTech utiliza elementos de gamificação. Os alunos ganham pontos, cumprem metas e acompanham o impacto real de suas atitudes no "termômetro da sustentabilidade" da escola.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-amber-400 rounded-full" />
                <h2 className="text-3xl font-black text-stone-900 uppercase tracking-tighter">🎯 Objetivos de Aprendizagem</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                 {[
                   { t: 'Pensamento Computacional', d: 'Organização de dados e identificação de padrões.' },
                   { t: 'Mundo Digital', d: 'Uso ético e criativo de ferramentas tecnológicas.' },
                   { t: 'Cultura Digital', d: 'Comunicação de resultados e colaboração para o bem comum.' }
                 ].map((obj, i) => (
                   <div key={i} className="p-6 bg-white border-2 border-stone-50 rounded-[2rem] shadow-sm select-none hover:shadow-md transition-shadow">
                      <p className="font-black text-emerald-600 text-sm mb-2">{obj.t}</p>
                      <p className="text-stone-500 text-xs font-medium leading-relaxed">{obj.d}</p>
                   </div>
                 ))}
              </div>
            </section>

            <section className="space-y-4 bg-emerald-600 rounded-[2.5rem] p-8 md:p-12 text-white">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-white/30 rounded-full" />
                <h2 className="text-3xl font-black uppercase tracking-tighter">🌱 Resultados Esperados</h2>
              </div>
              <p className="text-emerald-50 text-xl font-medium leading-relaxed">
                Esperamos não apenas reduzir a quantidade de resíduos produzidos na Escola Municipal Dom Joaquim de Almeida, mas, acima de tudo, formar cidadãos críticos, analíticos e preparados para os desafios do século XXI.
              </p>
            </section>
          </div>

          <div className="pt-12 text-center">
            <Button 
              onClick={onBack}
              className="px-12 h-16 rounded-3xl bg-stone-900 text-white font-black uppercase tracking-widest text-xs hover:bg-emerald-600 shadow-2xl"
            >
              Voltar para Início
            </Button>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center">
         <div className="flex items-center justify-center gap-4 text-stone-300">
            <Trees className="w-8 h-8" />
            <span className="font-black uppercase tracking-[0.4em] text-[10px]">EcoTech Dom Joaquim</span>
            <Trees className="w-8 h-8" />
         </div>
      </footer>
    </div>
  );
}
