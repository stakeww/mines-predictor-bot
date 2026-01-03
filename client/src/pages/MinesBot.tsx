import { useState } from "react";
import { useCreatePrediction } from "@/hooks/use-predictions";
import { MinesGrid } from "@/components/MinesGrid";
import { Loader2, Dices } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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

  // Generate options for 1-24 mines
  const mineOptions = Array.from({ length: 24 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-8 px-4 font-sans">
      
      {/* Container simulating the mobile app view */}
      <div className="w-full max-w-[440px] flex flex-col gap-6">
        
        {/* Header */}
        <header className="flex items-center justify-center gap-4 py-4 mb-2">
          <h1 className="text-3xl font-display font-black tracking-tighter italic text-white">
            Stake
          </h1>
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
            {isPending && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px] rounded-xl">
                 <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
            )}
        </div>

        {/* Controls */}
        <div className="bg-card rounded-t-2xl p-6 flex flex-col gap-5 shadow-2xl border-t border-white/5 mt-4">
          
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-semibold text-white/90">Mines</label>
              <span className="text-xs text-muted-foreground font-medium">1-24 mines</span>
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
              Receive Min Signal
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
                CALCULATING...
              </>
            ) : (
              "GET SIGNAL"
            )}
          </button>

          <div className="flex justify-center mt-2">
             <div className="flex items-center gap-2 text-xs text-[#2f4553] font-mono">
                <Dices className="w-4 h-4" />
                <span>PROVABLY FAIR</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
