import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

interface MinesGridProps {
  predictedSpots: number[]; // Array of indices (0-24)
  isAnimating: boolean;
}

export function MinesGrid({ predictedSpots, isAnimating }: MinesGridProps) {
  // Create a 5x5 grid (25 cells)
  const cells = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className="grid grid-cols-5 gap-3 p-4 bg-card rounded-xl border border-white/5 shadow-xl w-full max-w-[400px] aspect-square mx-auto">
      {cells.map((index) => {
        const isPredicted = predictedSpots.includes(index);

        return (
          <div
            key={index}
            className={`
              relative rounded-lg overflow-hidden
              bg-[#2f4553] shadow-inner border-b-4 border-[#213743]
              hover:bg-[#395261] transition-colors duration-200
              flex items-center justify-center
            `}
          >
            <AnimatePresence>
              {isPredicted && !isAnimating && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: index * 0.02 // Stagger effect based on index 
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-[#0f212e]/50"
                >
                  <Star 
                    className="w-8 h-8 text-[#ffbf00] fill-[#ffbf00] drop-shadow-[0_0_8px_rgba(255,191,0,0.6)]" 
                    strokeWidth={1.5}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
