import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Star, Award, GraduationCap, PartyPopper, Check } from 'lucide-react';
import { Wheel } from './components/Wheel';
import { NameManager } from './components/NameManager';
import { cn } from './lib/utils';

type Category = 'junior' | 'senior' | 'master';

interface CategoryData {
  id: Category;
  label: string;
  teacher: string;
  icon: React.ReactNode;
  bg: string;
  accent: string;
  description: string;
}

const CATEGORIES: CategoryData[] = [
  { 
    id: 'master', 
    label: 'Master', 
    teacher: 'Muslima',
    icon: <Award className="w-6 h-6" />, 
    bg: '#0a0505', 
    accent: '#EF4444', // Red
    description: 'Eng tajribali MASTER guruh - Muslima ustoz!'
  },
  { 
    id: 'senior', 
    label: 'Senior', 
    teacher: 'Marhabo',
    icon: <GraduationCap className="w-6 h-6" />, 
    bg: '#050a05', 
    accent: '#22C55E', // Green
    description: 'Katta SENIOR guruh - Marhabo ustoz!'
  },
  { 
    id: 'junior', 
    label: 'Junior', 
    teacher: 'Iroda',
    icon: <Star className="w-6 h-6" />, 
    bg: '#05070a', 
    accent: '#3B82F6', // Blue
    description: 'Kichik JUNIOR guruh - Iroda ustoz!'
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Category>('master');
  const [names, setNames] = useState<Record<Category, string[]>>({
    master: [],
    senior: [],
    junior: []
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const activeCategory = CATEGORIES.find(c => c.id === activeTab)!;

  const handleAddName = (name: string) => {
    setNames(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], name]
    }));
  };

  const handleRemoveName = (index: number) => {
    setNames(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((_, i) => i !== index)
    }));
  };

  const handleClearNames = () => {
    setNames(prev => ({
      ...prev,
      [activeTab]: []
    }));
  };

  const handleResult = (name: string) => {
    setWinner(name);
    
    // Celebration
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: [activeCategory.accent, '#ffffff']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: [activeCategory.accent, '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <div className="min-h-screen transition-colors duration-500 overflow-x-hidden pb-10" style={{ backgroundColor: activeCategory.bg }}>
      {/* Background Shapes */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: activeCategory.accent }} />
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: activeCategory.accent }} />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full blur-3xl opacity-50" style={{ backgroundColor: activeCategory.accent }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-10 relative z-10">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-3 bg-black/40 border border-white/10 px-8 py-3 rounded-full shadow-2xl mb-10"
          >
            <div className="flex flex-col items-center">
              <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter text-white neon-text uppercase text-center leading-none">
                NAJOT <br /> <span className="text-[#22C55E]">TA'LIM</span>
              </h1>
              <div className="mt-4 flex items-center gap-4 w-full justify-center">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-gray-800" />
                <p className="text-gray-500 font-mono tracking-[0.5em] text-xs lg:text-sm uppercase">
                  Discover Challenge
                </p>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-gray-800" />
              </div>
            </div>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={cn(
                  "flex items-center gap-3 px-8 py-4 rounded-3xl font-black transition-all btn-bounce shadow-2xl border-2",
                  activeTab === cat.id 
                    ? "bg-gray-900 ring-2 scale-110" 
                    : "bg-gray-950/40 border-white/5 text-gray-500 hover:text-white"
                )}
                style={{ 
                  borderColor: activeTab === cat.id ? cat.accent : 'transparent',
                  color: activeTab === cat.id ? cat.accent : '',
                  boxShadow: activeTab === cat.id ? `0 0 20px ${cat.accent}30` : ''
                }}
              >
                <div 
                  className={cn("p-2 rounded-xl transition-colors", activeTab === cat.id ? "text-white shadow-lg" : "text-gray-600")}
                  style={{ backgroundColor: activeTab === cat.id ? cat.accent : 'transparent' }}
                >
                  {cat.icon}
                </div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-xl font-black">{cat.label}</span>
                  <span className="text-xs opacity-70 uppercase tracking-widest font-mono font-bold">{cat.teacher}</span>
                </div>
              </button>
            ))}
          </div>

          <motion.p
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold tracking-wide italic opacity-80"
            style={{ color: activeCategory.accent }}
          >
            {activeCategory.description}
          </motion.p>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          {/* Wheel Section */}
          <div className="space-y-10">
            <div className="relative">
              <div className="absolute -inset-10 bg-gradient-to-br from-transparent via-transparent to-white/5 rounded-full blur-3xl pointer-events-none" />
              <Wheel
                items={names[activeTab]}
                onResult={handleResult}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
                accentColor={activeCategory.accent}
              />
            </div>
            
            {/* Legend / Tip */}
            <div className="bg-gray-900/60 backdrop-blur-xl px-10 py-6 rounded-[40px] text-center shadow-2xl border border-white/5">
              <p className="text-lg font-bold" style={{ color: activeCategory.accent }}>
                {names[activeTab].length < 2 
                  ? "Kamida 2 ta ism qo'shing!" 
                  : "Aylantirish uchun markazni bosing!"}
              </p>
            </div>
          </div>

          {/* Management Section */}
          <div className="h-full">
            <NameManager
              names={names[activeTab]}
              onAdd={handleAddName}
              onRemove={handleRemoveName}
              onClear={handleClearNames}
              accentColor={activeCategory.accent}
              category={activeCategory.label}
              teacherName={activeCategory.teacher}
            />
          </div>
        </div>
      </div>

      {/* Winner Overlay */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
            onClick={() => setWinner(null)}
          >
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 border-2 border-white/10 rounded-[50px] p-12 max-w-sm w-full text-center shadow-[0_0_80px_rgba(34,197,94,0.3)] relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Confetti effect background inside modal */}
              <div className="absolute top-0 inset-x-0 h-4 flex justify-center gap-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-full h-full" style={{ backgroundColor: activeCategory.accent }} />
                ))}
              </div>

              <div className="w-28 h-28 bg-gray-800 rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner">
                <Trophy className="w-16 h-16" style={{ color: activeCategory.accent }} />
              </div>

              <h2 className="text-xl font-bold text-gray-500 mb-2 uppercase tracking-[0.3em] font-mono">
                G'OLIB ANIQLANDI
              </h2>
              <div className="text-6xl font-black mb-10 break-words" style={{ color: activeCategory.accent, textShadow: `0 0 30px ${activeCategory.accent}50` }}>
                {winner}
              </div>

              <button
                onClick={() => setWinner(null)}
                className="w-full py-5 rounded-[25px] text-black font-black text-2xl shadow-2xl active:scale-95 transition-transform flex items-center justify-center gap-3"
                style={{ backgroundColor: activeCategory.accent }}
              >
                <Check className="w-8 h-8 stroke-[4px]" />
                DAVOM ETAMIZ!
              </button>

              <div className="mt-6 text-sm font-black text-gray-700 tracking-widest uppercase">
                YOPISH UCHUN BOSING
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Trophy(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

