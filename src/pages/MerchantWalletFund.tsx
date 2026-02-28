import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Wallet, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initialMerchantWalletBalance, formatNum } from "@/data/merchantVoucherData";

type Step = "amount" | "processing" | "success";

const QUICK_AMOUNTS = [50000, 100000, 500000, 1000000];

export default function MerchantWalletFund() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState<number>(0);
  const [customInput, setCustomInput] = useState("");
  const [processingStep, setProcessingStep] = useState(0);
  const txnRef = `TXN-FND-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  const handleQuickPick = (val: number) => {
    setAmount(val);
    setCustomInput(String(val));
  };

  const handleCustomChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, "");
    setCustomInput(clean);
    setAmount(parseInt(clean) || 0);
  };

  const handleFund = () => {
    if (amount <= 0) return;
    setStep("processing");
    setProcessingStep(0);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (step !== "processing") return;
    const msgs = ["Connecting to bank...", "Processing transfer...", "Verifying payment..."];
    const timers: ReturnType<typeof setTimeout>[] = [];
    msgs.forEach((_, i) => {
      if (i > 0) timers.push(setTimeout(() => setProcessingStep(i), i * 1000));
    });
    timers.push(setTimeout(() => {
      setStep("success");
      window.scrollTo(0, 0);
    }, 3000));
    return () => timers.forEach(clearTimeout);
  }, [step]);

  const processingMsgs = ["Connecting to bank...", "Processing transfer...", "Verifying payment..."];

  if (step === "processing") {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-muted/30" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary/50 animate-spin" />
          <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
        </div>
        <p className="text-base font-semibold text-foreground mb-2">{processingMsgs[processingStep]}</p>
        <p className="text-xs text-muted-foreground">Funding ₦{formatNum(amount)}</p>
        <div className="flex gap-2 mt-6">
          {processingMsgs.map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full transition-all duration-300 ${i <= processingStep ? "bg-primary scale-110" : "bg-muted"}`} />
          ))}
        </div>
      </div>
    );
  }

  if (step === "success") {
    const newBalance = initialMerchantWalletBalance + amount;
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6">
        <div className="relative w-28 h-28 mb-6">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute inset-2 rounded-full bg-emerald-500 flex items-center justify-center animate-scale-in">
            <CheckCircle2 className="h-14 w-14 text-white" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-1">Wallet Funded!</h2>
        <p className="text-3xl font-black text-emerald-600 mb-2">₦{formatNum(amount)}</p>
        <p className="text-sm text-muted-foreground mb-6">Successfully added to your merchant wallet</p>
        <div className="w-full rounded-xl border border-border/50 bg-card p-4 space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-mono text-xs font-semibold text-foreground">{txnRef}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-bold text-foreground">₦{formatNum(amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">New Balance</span>
            <span className="font-bold text-emerald-600">₦{formatNum(newBalance)}</span>
          </div>
        </div>
        <Button
          onClick={() => navigate("/merchant-voucher-management")}
          className="w-full h-12 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90 touch-manipulation active:scale-[0.97]"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-28">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 touch-manipulation">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-base font-bold text-foreground">Fund Wallet</h1>
          <p className="text-xs text-muted-foreground">Add local currency (₦) to wallet</p>
        </div>
      </div>
      <div className="px-4 pt-4 space-y-4">
        {/* Current Balance */}
        <div className="rounded-xl border border-border/50 bg-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Current Balance</p>
            <p className="text-lg font-bold text-foreground">₦{formatNum(initialMerchantWalletBalance)}</p>
          </div>
        </div>

        {/* Amount Input */}
        <div className="rounded-2xl border-2 border-primary/20 bg-card p-6 text-center">
          <p className="text-xs text-muted-foreground mb-3">Enter funding amount (₦)</p>
          <div className="flex items-center justify-center gap-1 mb-4">
            <span className="text-2xl font-bold text-muted-foreground">₦</span>
            <input
              type="text"
              inputMode="numeric"
              value={customInput}
              onChange={e => handleCustomChange(e.target.value)}
              placeholder="0"
              className="text-3xl font-black text-foreground bg-transparent text-center focus:outline-none w-48 [appearance:textfield]"
            />
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            {QUICK_AMOUNTS.map(q => (
              <button
                key={q}
                onClick={() => handleQuickPick(q)}
                className={`h-9 px-3 rounded-xl text-xs font-semibold touch-manipulation active:scale-90 transition-all ${
                  amount === q ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                ₦{formatNum(q)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-sm border-t border-border/50 px-4 py-3 safe-area-bottom">
        <Button
          onClick={handleFund}
          disabled={amount <= 0}
          className="w-full h-12 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 touch-manipulation active:scale-[0.97]"
        >
          Fund ₦{formatNum(amount)}
        </Button>
      </div>
    </div>
  );
}
