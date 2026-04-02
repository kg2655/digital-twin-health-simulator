import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Moon, 
  Droplets, 
  Zap, 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  ChevronRight,
  Info,
  User,
  Target,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from 'recharts';
import { cn } from './lib/utils';
import { calculateHealthScore, simulateHealth, getHealthPersona, type HealthInputs, type ImpactFactor } from './lib/healthLogic';

const InputField = ({ label, icon: Icon, value, onChange, min, max, step = 1, unit = "" }: any) => (
  <div className="space-y-3 group">
    <div className="flex items-center justify-between">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
        <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-indigo-50 transition-colors">
          <Icon className="w-3.5 h-3.5" />
        </div>
        {label}
      </label>
      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
        {value}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all"
    />
  </div>
);

const ImpactBadge = ({ factor }: { factor: ImpactFactor }) => {
  const isPositive = factor.status === 'positive';
  const isNegative = factor.status === 'negative';
  
  return (
    <div className={cn(
      "p-4 rounded-2xl border transition-all hover:shadow-md",
      isPositive ? "bg-emerald-50 border-emerald-100" : 
      isNegative ? "bg-rose-50 border-rose-100" : 
      "bg-slate-50 border-slate-100"
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className={cn("text-xs font-bold uppercase tracking-wider", 
          isPositive ? "text-emerald-600" : isNegative ? "text-rose-600" : "text-slate-500"
        )}>
          {factor.name}
        </span>
        <span className={cn("text-xs font-mono font-bold",
          isPositive ? "text-emerald-600" : isNegative ? "text-rose-600" : "text-slate-500"
        )}>
          {factor.impact > 0 ? '+' : ''}{factor.impact}
        </span>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed font-medium">{factor.description}</p>
    </div>
  );
};

const DigitalTwinAvatar = ({ score }: { score: number }) => {
  const color = score > 80 ? '#10b981' : score > 60 ? '#6366f1' : score > 40 ? '#f59e0b' : '#f43f5e';
  
  return (
    <div className="relative w-32 h-32 mx-auto">
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ backgroundColor: color }}
      />
      <div className="relative z-10 w-full h-full rounded-full border-4 border-white bg-white shadow-xl flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-grid-slate-200" />
        <User className="w-16 h-16" style={{ color }} />
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20"
          animate={{ height: `${score}%` }}
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="absolute -top-2 -right-2 bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
        Active
      </div>
    </div>
  );
};

export default function App() {
  const [inputs, setInputs] = useState<HealthInputs>({
    age: 30,
    sleep: 7,
    water: 2,
    exercise: 30,
    stress: 5,
  });
  const [whatIfInputs, setWhatIfInputs] = useState<HealthInputs>({
    age: 30,
    sleep: 7,
    water: 2,
    exercise: 30,
    stress: 5,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showWhatIf, setShowWhatIf] = useState(false);

  const { score, impacts } = useMemo(() => calculateHealthScore(showWhatIf ? whatIfInputs : inputs), [inputs, whatIfInputs, showWhatIf]);
  const persona = useMemo(() => getHealthPersona(showWhatIf ? whatIfInputs : inputs, score), [inputs, whatIfInputs, showWhatIf, score]);
  const simulationData = useMemo(() => simulateHealth(inputs, 30, showWhatIf ? whatIfInputs : undefined), [inputs, whatIfInputs, showWhatIf]);

  const updateInput = (key: keyof HealthInputs, value: number) => {
    if (showWhatIf) {
      setWhatIfInputs(prev => ({ ...prev, [key]: value }));
    } else {
      setInputs(prev => ({ ...prev, [key]: value }));
      setWhatIfInputs(prev => ({ ...prev, [key]: value }));
    }
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 400);
    return () => clearTimeout(timer);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation / Top Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">DigitalTwin <span className="text-indigo-600">Health</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="text-indigo-600">Simulator</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Insights</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Digital Twin v2.0</a>
          </div>
          <button className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Reset Twin
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Digital Twin Overview */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 text-center space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-right from-indigo-500 via-purple-500 to-pink-500" />
              
              <DigitalTwinAvatar score={score} />
              
              <div className="space-y-2">
                <h2 className={cn("text-2xl font-black tracking-tight", persona.color)}>
                  {persona.name}
                </h2>
                <p className="text-sm text-slate-500 font-medium px-4">
                  {persona.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className={cn(
                  "p-4 rounded-3xl border transition-all duration-300",
                  isUpdating ? "bg-indigo-50 border-indigo-200 scale-105" : "bg-slate-50 border-slate-100"
                )}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Health Score</p>
                  <p className="text-2xl font-black text-slate-900">{score}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Biological Age</p>
                  <p className="text-2xl font-black text-slate-900">{inputs.age + (score < 50 ? 5 : score > 80 ? -3 : 0)}</p>
                </div>
              </div>
            </motion.div>

            {/* Inputs Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-4 h-4" /> Lifestyle Parameters
                </h3>
                <button 
                  onClick={() => setShowWhatIf(!showWhatIf)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all",
                    showWhatIf ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                  )}
                >
                  {showWhatIf ? "What If: ON" : "What If: OFF"}
                </button>
              </div>
              
              <div className="space-y-6">
                <InputField label="Age" icon={User} value={showWhatIf ? whatIfInputs.age : inputs.age} onChange={(v: number) => updateInput('age', v)} min={18} max={100} unit=" yrs" />
                <InputField label="Sleep Quality" icon={Moon} value={showWhatIf ? whatIfInputs.sleep : inputs.sleep} onChange={(v: number) => updateInput('sleep', v)} min={3} max={12} step={0.5} unit=" hrs" />
                <InputField label="Hydration" icon={Droplets} value={showWhatIf ? whatIfInputs.water : inputs.water} onChange={(v: number) => updateInput('water', v)} min={0.5} max={5} step={0.1} unit=" L" />
                <InputField label="Activity Level" icon={Zap} value={showWhatIf ? whatIfInputs.exercise : inputs.exercise} onChange={(v: number) => updateInput('exercise', v)} min={0} max={120} unit=" min" />
                <InputField label="Stress Load" icon={Brain} value={showWhatIf ? whatIfInputs.stress : inputs.stress} onChange={(v: number) => updateInput('stress', v)} min={1} max={10} unit="/10" />
              </div>
            </motion.div>
          </div>

          {/* Simulation & Analysis */}
          <div className="lg:col-span-8 space-y-8">
            {/* Main Chart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                    Future Health Trajectory
                  </h2>
                  <AnimatePresence>
                    {isUpdating && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1.5"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        Live Updating Twin...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  {showWhatIf && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 shadow-sm border border-amber-100">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-xs font-bold text-amber-700">What-If</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white shadow-sm border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-xs font-bold text-slate-700">Ideal</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="text-xs font-bold text-slate-500">Baseline</span>
                  </div>
                </div>
              </div>

              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simulationData}>
                    <defs>
                      <linearGradient id="colorImproved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                      dy={15}
                      interval={4}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '20px', 
                        border: 'none', 
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        padding: '16px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="improved" 
                      stroke="#6366f1" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorImproved)" 
                      animationDuration={1500}
                    />
                    {showWhatIf && (
                      <Line 
                        type="monotone" 
                        dataKey="whatIf" 
                        stroke="#f59e0b" 
                        strokeWidth={4} 
                        dot={false}
                        animationDuration={1000}
                      />
                    )}
                    <Line 
                      type="monotone" 
                      dataKey="current" 
                      stroke="#cbd5e1" 
                      strokeWidth={3} 
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Impact Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
                  <ShieldCheck className="w-4 h-4" /> Impact Analysis
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {impacts.map((impact, i) => (
                    <div key={i}>
                      <ImpactBadge factor={impact} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
                  <Sparkles className="w-4 h-4" /> Optimization Roadmap
                </h3>
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full -mr-16 -mt-16" />
                  
                  <div className="space-y-4 relative z-10">
                    <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest">Next 30 Days</p>
                    <h4 className="text-xl font-bold leading-tight">Focus on Sleep & Hydration to boost score by 15 points.</h4>
                    <div className="space-y-3">
                      {[
                        "Set a consistent 10 PM bedtime.",
                        "Drink 500ml water upon waking.",
                        "Limit screen time 1hr before bed."
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                          <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 border border-indigo-500/30">
                            {i + 1}
                          </div>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-2xl font-bold text-sm flex items-center justify-center gap-2 group">
                    Generate Full Report <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-xs font-medium">
          <p>© 2026 Digital Twin Health Simulator. AI-Powered Predictive Analysis.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Medical Disclaimer</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
