import { Card, Badge } from './UI';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieChartIcon, ArrowUpRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Reports({ entries, classes }: any) {
  // Process data for charts
  const classData = classes.map((c: any) => ({
    name: c.name,
    pontos: c.points,
  })).sort((a: any, b: any) => b.pontos - a.pontos);

  const typeData = entries.reduce((acc: any, curr: any) => {
    const existing = acc.find((d: any) => d.name === curr.type);
    if (existing) {
      existing.kg += curr.quantity;
    } else {
      acc.push({ name: curr.type, kg: curr.quantity });
    }
    return acc;
  }, []);

  // Evolution over time
  const historyData = entries.reduce((acc: any, curr: any) => {
    const date = curr.date;
    const existing = acc.find((d: any) => d.label === date);
    if (existing) {
      existing.kg += curr.quantity;
    } else {
      acc.push({ label: date, kg: curr.quantity });
    }
    return acc;
  }, []).sort((a: any, b: any) => a.label.localeCompare(b.label))
    .map((d: any) => ({ ...d, data: format(parseISO(d.label), 'dd/MM') }));

  if (entries.length === 0) {
    return (
      <div className="py-20 text-center space-y-6">
        <BarChart3 className="w-24 h-24 text-stone-100 mx-auto" />
        <h2 className="text-3xl font-black text-stone-300 uppercase italic underline decoration-stone-100 decoration-8 underline-offset-8">Dados Insuficientes...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 w-fit rounded-full">
            <BarChart3 className="w-3 h-3 text-emerald-600" />
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Análise</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tighter uppercase leading-none underline decoration-lime-400 decoration-8 underline-offset-8">
            Relatórios
          </h2>
          <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] max-w-sm leading-relaxed">
             Visualize dados quantitativos e o impacto positivo das ações de reciclagem da escola.
          </p>
        </div>
        <div className="hidden md:block bg-stone-100 p-6 rounded-[2.5rem] border-2 border-dashed border-stone-200">
          <BarChart3 className="w-10 h-10 text-stone-300" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[minmax(200px,_auto)]">
        {/* Main Stats Comparison - Large piece */}
        <div className="md:col-span-12 lg:col-span-8 bg-white p-10 rounded-[3rem] border border-stone-100 shadow-2xl shadow-stone-200/40 relative overflow-hidden group">
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tighter leading-none mb-1">Impacto por Turma</h3>
                    <p className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em]">Comparativo de Pontuação acumulada</p>
                 </div>
                 <BarChart3 className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 10 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 10 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '1rem' }}
                    />
                    <Bar 
                      dataKey="pontos" 
                      fill="#10b981" 
                      radius={[15, 15, 15, 15]} 
                      barSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Highlight Card - Secondary piece */}
        <div className="md:col-span-12 lg:col-span-4 bg-emerald-950 p-10 rounded-[3rem] text-white flex flex-col justify-between overflow-hidden relative group">
           <div className="relative z-10">
              <Badge className="bg-lime-400 text-emerald-950 border-none font-black text-[10px] mb-6">INSIGHT DA SEMANA</Badge>
              <h3 className="text-4xl font-black tracking-tight leading-[0.95] uppercase mb-4">Meta Escolar Superada</h3>
              <p className="text-emerald-100/60 font-medium leading-relaxed italic">
                "Aumentamos a coleta de orgânicos em 15% comparado ao mês anterior. O engajamento das turmas do 8º ano foi decisivo."
              </p>
           </div>
           <div className="mt-12 flex items-center gap-4">
              <div className="flex-1 bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/5">
                 <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Média Semanal</p>
                 <span className="text-2xl font-black">{(entries.reduce((a:any, b:any) => a + b.quantity, 0) / 4).toFixed(1)}kg</span>
              </div>
              <div className="p-6 bg-lime-400 text-emerald-950 rounded-3xl">
                 <ArrowUpRight className="w-8 h-8" />
              </div>
           </div>
           <div className="absolute -bottom-10 -right-10 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-700">
              <TrendingUp className="w-64 h-64" />
           </div>
        </div>

        {/* Evolution Chart - Wide Piece */}
        <div className="md:col-span-12 lg:col-span-7 bg-white p-10 rounded-[3rem] border border-stone-100 shadow-2xl shadow-stone-200/40 relative group">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tighter leading-none mb-1">Linha de Evolução</h3>
                 <p className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em]">Frequência de registros ao longo do tempo</p>
              </div>
              <TrendingUp className="w-8 h-8 text-lime-500" />
           </div>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                     <linearGradient id="colorReport" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#84cc16" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="data" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 700, fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="kg" stroke="#84cc16" strokeWidth={5} fillOpacity={1} fill="url(#colorReport)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Types Distribution - Secondary Square */}
        <div className="md:col-span-12 lg:col-span-5 bg-white p-10 rounded-[3rem] border border-stone-100 shadow-2xl shadow-stone-200/40 group relative overflow-hidden">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tighter leading-none">Mix de Resíduos</h3>
              <PieChartIcon className="w-8 h-8 text-blue-500" />
           </div>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontWeight: 900, fontSize: 11 }} />
                   <Tooltip />
                   <Bar dataKey="kg" fill="#3b82f6" radius={[10, 10, 10, 10]} barSize={25} />
                </BarChart>
             </ResponsiveContainer>
           </div>
           <div className="absolute bottom-6 left-10 right-10 flex justify-between text-[9px] font-black uppercase text-stone-300 tracking-[0.3em]">
              <span>Materiais</span>
              <span>Volume Total</span>
           </div>
        </div>
      </div>
    </div>
  );
}
