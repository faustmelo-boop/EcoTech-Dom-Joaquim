import { Card } from './UI';
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-emerald-950 tracking-tighter uppercase underline decoration-lime-400 decoration-8 underline-offset-8 transition-all">Análise Escolar</h2>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-xs mt-4">Transformando números em ações ambientais</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Comparison Bar Chart */}
        <Card title="Comparativo: Pontuação por Turma" icon={<BarChart3 className="w-5 h-5" />} className="h-[450px]">
          <div className="h-full pt-4 pb-12">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#a8a29e', fontWeight: 700, fontSize: 10 }}
                  dy={10}
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#a8a29e', fontWeight: 700, fontSize: 10 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                />
                <Bar 
                  dataKey="pontos" 
                  fill="#10b981" 
                  radius={[12, 12, 0, 0]} 
                  barSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Evolution Chart */}
        <Card title="Evolução da Coleta (kg)" icon={<TrendingUp className="w-5 h-5" />} className="h-[450px]">
          <div className="h-full pt-4 pb-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                   <linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#84cc16" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                   dataKey="data" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#a8a29e', fontWeight: 700, fontSize: 10 }}
                   dy={10}
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fill: '#a8a29e', fontWeight: 700, fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                />
                <Area 
                   type="monotone" 
                   dataKey="kg" 
                   stroke="#84cc16" 
                   strokeWidth={4}
                   fillOpacity={1} 
                   fill="url(#colorKg)" 
                   animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Residues Frequency */}
        <Card title="Frequência de Materiais" icon={<PieChartIcon className="w-5 h-5" />} className="h-[450px]">
          <div className="h-full pt-4 pb-12">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={typeData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#334155', fontWeight: 900, fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar 
                    dataKey="kg" 
                    fill="#3b82f6" 
                    radius={[0, 12, 12, 0]} 
                    barSize={30}
                    animationDuration={1000}
                  />
               </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Insight Bonus Card */}
        <Card className="bg-emerald-800 text-white border-none flex flex-col justify-center items-center text-center p-12">
           <div className="bg-white/10 p-6 rounded-full mb-6 relative">
              <ArrowUpRight className="w-12 h-12 text-lime-400" />
              <div className="absolute inset-0 bg-lime-400/20 blur-xl rounded-full" />
           </div>
           <h3 className="text-3xl font-black tracking-tight mb-4 uppercase">Análise de IA Escola</h3>
           <p className="text-emerald-100/60 font-medium leading-relaxed max-w-sm">
             A turma com maior crescimento esta semana foi <strong>{classData[0].name}</strong>. 
             A reciclagem de plásticos evitou a emissão de aproximadamente {(entries.filter((e:any) => e.type === 'Plástico').reduce((a:any, b:any) => a + b.quantity, 0) * 1.5).toFixed(1)}kg de CO2.
           </p>
           <div className="mt-8 flex gap-4">
              <div className="bg-emerald-950 p-4 rounded-2xl">
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Total Coletado</p>
                 <span className="text-2xl font-black">{entries.reduce((a:any, b:any) => a + b.quantity, 0)}kg</span>
              </div>
              <div className="bg-emerald-950 p-4 rounded-2xl">
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Média/Turma</p>
                 <span className="text-2xl font-black">{(entries.reduce((a:any, b:any) => a + b.quantity, 0) / classes.length || 0).toFixed(1)}kg</span>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
}
