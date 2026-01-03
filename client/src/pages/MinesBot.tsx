import { useState } from "react";
import { useCreatePrediction } from "@/hooks/use-predictions";
import { MinesGrid } from "@/components/MinesGrid";
import { Loader2, Dices } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import stakeLogo from "@assets/IMG_1152_1767458795544.png";
import { motion, AnimatePresence } from "framer-motion";

export default function MinesBot() {
  const [minesCount, setMinesCount] = useState<number>(3);
  const [predictedSpots, setPredictedSpots] = useState<number[]>([]);
  const { mutate: getPrediction, isPending } = useCreatePrediction();
  const { toast } = useToast();

  const handlePredict = () => {
    // Clear previous prediction immediately to trigger exit animations if any
    setPredictedSpots([]);

    getPrediction(minesCount, {
      onSuccess: (data) => {
        setPredictedSpots(data.predictedSpots);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Generate options for 1-25 mines
  const mineOptions = Array.from({ length: 25 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-8 px-4 font-sans">
      
      {/* Container simulating the mobile app view */}
      <div className="w-full max-w-[440px] flex flex-col gap-6">
        
        {/* Header */}
        <header className="flex items-center justify-center gap-4 py-4 mb-2">
          <img 
            src={stakeLogo} 
            alt="Mines Bot Logo" 
            className="h-12 w-auto object-contain drop-shadow-[0_0_2px_rgba(0,0,0,1)] invert brightness-0"
            style={{ 
              filter: 'brightness(0) invert(1) drop-shadow(1px 1px 0px black) drop-shadow(-1px -1px 0px black) drop-shadow(1px -1px 0px black) drop-shadow(-1px 1px 0px black)' 
            }}
          />
          <div className="h-8 w-[2px] bg-[#2f4553] rounded-full"></div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-muted-foreground leading-none">MINES</span>
            <span className="text-sm font-bold text-white leading-none">BOT</span>
          </div>
        </header>

        {/* Main Grid Area */}
        <div className="relative">
            <MinesGrid predictedSpots={predictedSpots} isAnimating={isPending} />
            
            {/* Loading Overlay */}
            <AnimatePresence>
              {isPending && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex items-center justify-center bg-[#0f212e]/80 backdrop-blur-sm rounded-xl overflow-hidden"
                >
                   <div className="relative flex flex-col items-center gap-4">
                     <div className="w-24 h-24 relative">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full"
                        />
                        <div className="absolute inset-4 flex items-center justify-center">
                          <motion.div
                            animate={{ scale: [0.8, 1.1, 0.8] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                             <img src={stakeLogo} alt="Loading" className="w-12 h-12 object-contain opacity-50" />
                          </motion.div>
                        </div>
                     </div>
                     <motion.p
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-primary font-display font-black tracking-widest text-sm"
                     >
                        АНАЛИЗ...
                     </motion.p>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="bg-card rounded-t-2xl p-6 flex flex-col gap-5 shadow-2xl border-t border-white/5 mt-4">
          
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-semibold text-white/90">Мины</label>
              <span className="text-xs text-muted-foreground font-medium">1-25 мин</span>
            </div>
            
            <Select 
              value={minesCount.toString()} 
              onValueChange={(val) => setMinesCount(parseInt(val))}
              disabled={isPending}
            >
              <SelectTrigger className="h-12 bg-[#0f212e] border-[#2f4553] text-white font-semibold focus:ring-primary/20 focus:border-primary">
                <SelectValue placeholder="Select mines" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f212e] border-[#2f4553] text-white max-h-[300px]">
                {mineOptions.map((num) => (
                  <SelectItem 
                    key={num} 
                    value={num.toString()}
                    className="focus:bg-[#2f4553] focus:text-white"
                  >
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 text-center">
            <p className="text-xs font-medium text-muted-foreground/80 uppercase tracking-widest">
              Получить сигнал
            </p>
          </div>

          <button
            onClick={handlePredict}
            disabled={isPending}
            className="
              w-full h-14 rounded-md font-display font-black text-lg tracking-wide
              bg-primary text-primary-foreground
              hover:brightness-110 active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-[0_4px_0_0_#00b500] active:shadow-none active:translate-y-[4px]
              transition-all duration-150 ease-out
              flex items-center justify-center gap-2
            "
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                РАСЧЕТ...
              </>
            ) : (
              "ПОЛУЧИТЬ СИГНАЛ"
            )}
          </button>

          <div className="flex justify-center mt-2">
             <div className="flex items-center gap-2 text-xs text-[#2f4553] font-mono">
                <Dices className="w-4 h-4" />
                <span>ДОКАЗУЕМО ЧЕСТНО</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
