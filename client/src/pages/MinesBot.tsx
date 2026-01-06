import { useState, useEffect } from "react";
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
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const [predictionKey, setPredictionId] = useState(0);

  const handlePredict = () => {
    setPredictedSpots([]);
    setPredictionId(prev => prev + 1);
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

  const mineOptions = Array.from({ length: 24 }, (_, i) => i + 1);

  const [isRegistered, setIsRegistered] = useState(() => {
    return localStorage.getItem("mines_bot_registered") === "true";
  });
  const [stakeId, setStakeId] = useState(() => {
    return localStorage.getItem("mines_bot_stake_id") || "";
  });
  const [isChecking, setIsChecking] = useState(false);

  const [showIdHint, setShowIdHint] = useState(false);

  const handleRegister = () => {
    window.open("https://stake.com/?c=Minebot", "_blank");
  };

  const handleCheckRegistration = () => {
    if (!stakeId.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Stake ID",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    // Simulating API check
    setTimeout(() => {
      localStorage.setItem("mines_bot_registered", "true");
      localStorage.setItem("mines_bot_stake_id", stakeId);
      setIsRegistered(true);
      setIsChecking(false);
      toast({
        title: "Success",
        description: "Registration verified! Access granted.",
      });
    }, 2000);
  };

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-[#0f212e] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[440px] bg-[#1a2c38] rounded-2xl p-8 border border-white/10 shadow-2xl flex flex-col items-center gap-6 text-center"
        >
          <img 
            src={stakeLogo} 
            alt="Logo" 
            className="h-16 w-auto object-contain mb-2"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <div className="space-y-2">
            <h1 className="text-2xl font-display font-black text-white tracking-tight uppercase">Access Required</h1>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed">
              Register on Stake.com using the link below, then enter your ID to unlock signals.
            </p>
          </div>

          <div className="w-full space-y-4">
            <button
              onClick={handleRegister}
              className="
                w-full h-12 rounded-md font-display font-bold text-sm tracking-wide
                bg-[#2f4553] text-white
                hover:bg-[#3d5a6d] transition-colors
                flex items-center justify-center gap-2
              "
            >
              1. OPEN STAKE.COM
            </button>

            <div className="space-y-2 text-left relative">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  2. ENTER YOUR STAKE ID
                </label>
                <button 
                  onClick={() => setShowIdHint(!showIdHint)}
                  className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
                >
                  Where to find?
                </button>
              </div>

              <AnimatePresence>
                {showIdHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-[#0f212e] p-3 rounded-md border border-primary/20 mb-2 text-[11px] text-white/70 space-y-2">
                      <p>1. Go to <span className="text-white font-bold">Settings</span> on Stake.</p>
                      <p>2. Open <span className="text-white font-bold">General</span> tab.</p>
                      <p>3. Your ID is your <span className="text-white font-bold">Username</span> (shown at the top).</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <input 
                type="text"
                value={stakeId}
                onChange={(e) => setStakeId(e.target.value)}
                placeholder="Example: User123"
                className="w-full h-12 bg-[#0f212e] border border-[#2f4553] rounded-md px-4 text-white font-semibold focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <button
              onClick={handleCheckRegistration}
              disabled={isChecking}
              className="
                w-full h-14 rounded-md font-display font-black text-lg tracking-wide
                bg-primary text-primary-foreground
                hover:brightness-110 active:scale-[0.98]
                shadow-[0_4px_0_0_#00b500] active:shadow-none active:translate-y-[4px]
                transition-all duration-150 ease-out
                flex items-center justify-center gap-2
              "
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  VERIFYING...
                </>
              ) : (
                "VERIFY & START"
              )}
            </button>
          </div>
          
          <p className="text-[9px] text-muted-foreground/40 uppercase font-bold tracking-[0.2em]">
            Protected by Stake Affiliate System
          </p>
        </motion.div>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0f212e] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 border-4 border-primary/10 border-t-primary rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={stakeLogo} 
                alt="Logo" 
                className="w-16 h-16 object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-white font-display font-black text-2xl tracking-tighter">MINES BOT</h2>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
              className="h-1 bg-primary rounded-full w-48"
            />
            <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase mt-2">Initializing System</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f212e] flex flex-col items-center justify-start sm:justify-center py-4 sm:py-8 px-4 font-sans safe-area-inset">
      <div className="w-full max-w-[440px] flex flex-col gap-4 sm:gap-6">
        <header className="flex items-center justify-between px-2 py-2 sm:py-4 mb-1 sm:mb-2">
          <div className="flex items-center gap-4">
            <img 
              src={stakeLogo} 
              alt="Mines Bot Logo" 
              className="h-8 sm:h-10 w-auto object-contain"
              style={{ 
                filter: 'brightness(0) invert(1) drop-shadow(1px 1px 0px black) drop-shadow(-1px -1px 0px black) drop-shadow(1px -1px 0px black) drop-shadow(-1px 1px 0px black)' 
              }}
            />
            <div className="h-6 sm:h-8 w-[2px] bg-[#2f4553] rounded-full"></div>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-sm font-bold text-muted-foreground leading-none">MINES</span>
              <span className="text-[10px] sm:text-sm font-bold text-white leading-none">BOT</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#213743] border border-white/5 shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              <span className="text-[10px] sm:text-xs font-black text-white font-mono tracking-tighter">
                {Math.floor(Math.random() * (1450 - 1100 + 1)) + 1100}
              </span>
            </div>
          </div>
        </header>

        <div className="bg-[#1a2c38] p-1 sm:p-2 rounded-xl shadow-2xl border border-white/5 relative group">
          <div className="absolute -top-3 -right-3 z-10 bg-primary text-primary-foreground text-[10px] font-black px-2 py-1 rounded shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
            AI POWERED
          </div>
          <div className="relative">
              <MinesGrid key={predictionKey} predictedSpots={predictedSpots} isAnimating={isPending} />
              <AnimatePresence>
                {isPending && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-[#0f212e]/90 backdrop-blur-md rounded-xl overflow-hidden"
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
                          ANALYZING...
                       </motion.p>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>

        <div className="bg-[#213743] rounded-2xl p-6 flex flex-col gap-5 shadow-2xl border border-white/10">
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
              Get Signal
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
              relative overflow-hidden group
            "
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />
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
             <div className="flex flex-col items-center gap-3">
               <div className="flex items-center gap-2 text-[10px] text-[#2f4553] font-mono font-bold tracking-widest uppercase opacity-50">
                  <span>Provably Fair Control System</span>
               </div>
               <div className="flex items-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-300">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3 w-auto" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3 w-auto" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 w-auto" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg" alt="Bitcoin" className="h-4 w-auto" />
               </div>
               <p className="text-[9px] text-muted-foreground/30 font-medium">© 2024 MinesPredictor AI. Not affiliated with Stake.com</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
