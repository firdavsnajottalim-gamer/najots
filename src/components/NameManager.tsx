import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, X, Trash2, Users } from 'lucide-react';
import { cn } from '../lib/utils';

interface NameManagerProps {
  names: string[];
  onAdd: (name: string) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
  accentColor: string;
  category: string;
}

export const NameManager: React.FC<NameManagerProps> = ({
  names,
  onAdd,
  onRemove,
  onClear,
  accentColor,
  category
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950/40 backdrop-blur-xl rounded-[40px] p-8 shadow-2xl border-2 border-white/5" style={{ borderColor: accentColor + '30' }}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gray-900 border border-white/5">
            <Users className="w-6 h-6" style={{ color: accentColor }} />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter" style={{ color: accentColor }}>
              {category}
            </h3>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">A'zolar ro'yxati</p>
          </div>
        </div>
        <span className="bg-gray-900 text-gray-400 px-4 py-1.5 rounded-full text-sm font-black border border-white/5">
          {names.length}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ism kiriting..."
          className="flex-1 px-6 py-4 rounded-[20px] bg-gray-900/50 border-2 border-white/5 focus:border-white/20 outline-none transition-all placeholder:text-gray-600 text-white font-bold"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="p-4 rounded-[20px] text-black shadow-2xl disabled:opacity-30 btn-bounce flex items-center justify-center"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-8 h-8 stroke-[3px]" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        {names.map((name, index) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={index}
            className="flex items-center justify-between group bg-gray-900/40 hover:bg-gray-900/80 border border-white/5 p-4 rounded-2xl transition-all"
          >
            <span className="font-bold text-xl uppercase tracking-tight neon-text" style={{ color: accentColor }}>{name}</span>
            <button
              onClick={() => onRemove(index)}
              className="p-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
        {names.length === 0 && (
          <div className="text-center py-20 opacity-20 italic text-gray-500 font-mono">
            RO'YXAT BO'SH...
          </div>
        )}
      </div>

      {names.length > 0 && (
        <button
          onClick={onClear}
          className="mt-8 flex items-center justify-center gap-2 text-red-500/60 hover:text-red-500 font-black uppercase text-xs tracking-widest py-3 rounded-2xl bg-red-500/5 hover:bg-red-500/10 transition-all"
        >
          <Trash2 className="w-4 h-4" />
          Tozalash
        </button>
      )}
    </div>
  );
};
