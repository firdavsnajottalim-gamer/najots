import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

interface WheelProps {
  items: string[];
  onResult: (winner: string) => void;
  isSpinning: boolean;
  setIsSpinning: (state: boolean) => void;
  accentColor: string;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', 
  '#FF9F1C', '#2EC4B6', '#E71D36', '#9B5DE5',
  '#F15BB5', '#00BBF9', '#00F5D4', '#FEE440'
];

export const Wheel: React.FC<WheelProps> = ({ 
  items, 
  onResult, 
  isSpinning, 
  setIsSpinning,
  accentColor 
}) => {
  const controls = useAnimation();
  const [rotation, setRotation] = useState(0);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const spin = async () => {
    if (isSpinning || items.length < 2) return;

    setIsSpinning(true);
    
    // Choose winner randomly
    const winnerIndex = Math.floor(Math.random() * items.length);
    const segmentAngle = 360 / items.length;
    
    // Calculate final rotation
    // 5-10 full rotations + target angle
    // Target angle needs to be at the pointer (top/0 or right/90?)
    // Our pointer is at the top (center top)
    const extraRotations = 5 + Math.random() * 5;
    const targetAngle = 360 - (winnerIndex * segmentAngle) - (segmentAngle / 2);
    const finalRotation = rotation + (360 * extraRotations) + targetAngle - (rotation % 360);

    await controls.start({
      rotate: finalRotation,
      transition: {
        duration: 4 + Math.random() * 2,
        ease: [0.15, 0, 0.15, 1], // easeOutCirc-ish custom bezier
      }
    });

    setRotation(finalRotation);
    setIsSpinning(false);
    onResult(items[winnerIndex]);
  };

  useEffect(() => {
    if (isSpinning && rotation === 0) {
      // Allow parent to trigger spin if needed
    }
  }, [isSpinning]);

  const segmentAngle = items.length > 0 ? 360 / items.length : 360;

  return (
    <div className="relative flex items-center justify-center w-full max-w-md mx-auto aspect-square">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
        <div 
          className="w-12 h-14 bg-gray-900 rounded-b-full shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center border-4"
          style={{ borderColor: accentColor }}
        >
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[20px]" style={{ borderTopColor: accentColor }} />
        </div>
      </div>

      {/* The Wheel */}
      <motion.div
        animate={controls}
        initial={{ rotate: 0 }}
        className="w-full h-full relative rounded-full shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden border-[12px] border-gray-900 bg-gray-900"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {items.map((item, i) => {
            const startAngle = i * segmentAngle;
            const endAngle = (i + 1) * segmentAngle;
            
            const x1 = 50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 50 + 50 * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = 50 + 50 * Math.sin((endAngle - 90) * Math.PI / 180);
            
            const largeArc = segmentAngle > 180 ? 1 : 0;
            
            const segmentColor = COLORS[i % COLORS.length];
            const midAngle = startAngle + segmentAngle / 2;
            const shouldFlip = midAngle > 90 && midAngle < 270;

            return (
              <g key={i}>
                <path
                  d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={segmentColor}
                  className="transition-colors duration-300 stroke-black/20 stroke-[0.1]"
                />
                <g transform={`rotate(${midAngle - 90}, 50, 50)`}>
                  <text
                    x={shouldFlip ? "12" : "88"}
                    y="50"
                    fill="white"
                    fontSize={(() => {
                      const count = items.length;
                      let size = count > 24 ? 1.2 : count > 16 ? 1.8 : count > 10 ? 2.4 : 3.8;
                      if (item.length > 12) size *= 0.65;
                      else if (item.length > 8) size *= 0.8;
                      return size;
                    })()}
                    fontWeight="1000"
                    textAnchor={shouldFlip ? "start" : "end"}
                    transform={shouldFlip ? "rotate(180, 12, 50)" : ""}
                    className="select-none pointer-events-none font-mono uppercase tracking-tighter"
                    alignmentBaseline="middle"
                    style={{ 
                      filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8)) drop-shadow(0 0 5px rgba(0,0,0,0.5))',
                      paintOrder: 'stroke',
                      stroke: 'rgba(0,0,0,0.3)',
                      strokeWidth: '0.1px'
                    }}
                  >
                    {item}
                  </text>
                </g>
              </g>
            );
          })}
          {items.length === 0 && (
            <circle cx="50" cy="50" r="50" fill="#111" />
          )}
          
          {/* Inner center circle */}
          <circle cx="50" cy="50" r="8" fill="#050505" className="stroke-[2px]" style={{ stroke: accentColor }} />
        </svg>
      </motion.div>

      {/* Center Button */}
      <button
        onClick={spin}
        disabled={isSpinning || items.length < 2}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-20 h-20 rounded-full bg-gray-950 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-center cursor-pointer border-4 hover:scale-110 active:scale-95 transition-transform disabled:opacity-30 disabled:cursor-not-allowed group border-white/10"
        style={{ color: accentColor, borderColor: accentColor }}
      >
        <Trophy 
          className={cn("w-10 h-10 transition-all", isSpinning ? "animate-pulse scale-75" : "scale-100")} 
          style={{ filter: `drop-shadow(0 0 10px ${accentColor}80)` }}
        />
      </button>

      {/* Decorative Outer Ring */}
      <div className="absolute inset-0 border-dashed border-2 rounded-full scale-[1.12] pointer-events-none opacity-20" style={{ borderColor: accentColor }} />
    </div>
  );
};
