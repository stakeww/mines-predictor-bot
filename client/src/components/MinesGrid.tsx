import { motion, AnimatePresence } from "framer-motion";
import gemImg from "@assets/generated_images/flat_vector_diamond_gem_icon.png";

interface MinesGridProps {
  predictedSpots: number[]; // Array of indices (0-24)
  isAnimating: boolean;
}

export function MinesGrid({ predictedSpots, isAnimating }: MinesGridProps) {
  // Create a 5x5 grid (25 cells)
  const cells = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3 p-3 sm:p-5 bg-[#1a2c38] rounded-xl w-full max-w-[400px] aspect-square mx-auto">
      {cells.map((index) => {
        const isPredicted = predictedSpots.includes(index);

        return (
          <div
            key={index}
            className={`
              relative rounded-lg overflow-hidden
              bg-[#2f4553] shadow-inner border-b-[3px] sm:border-b-4 border-[#213743]
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
                    delay: predictedSpots.indexOf(index) * 0.15 // Slightly slower stagger for better visual effect
                  }}
                  className="absolute inset-0 flex items-center justify-center p-1.5"
                >
                  <img 
                    src={gemImg} 
                    alt="Gem" 
                    className="w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
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
