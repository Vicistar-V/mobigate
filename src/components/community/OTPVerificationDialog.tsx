import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface OTPVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
  email: string;
}

export function OTPVerificationDialog({
  open,
  onOpenChange,
  onVerified,
  email,
}: OTPVerificationDialogProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (open && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [open, timer]);

  useEffect(() => {
    if (open) {
      // Focus first input when dialog opens
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } else {
      // Reset state when dialog closes
      setOtp(["", "", "", "", "", ""]);
      setIsVerifying(false);
      setIsVerified(false);
      setTimer(60);
      setCanResend(false);
    }
  }, [open]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return;

    setIsVerifying(true);

    // Simulate verification - accepts any 6-digit code
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsVerifying(false);
    setIsVerified(true);

    // Show success animation then close
    setTimeout(() => {
      onVerified();
      onOpenChange(false);
    }, 1000);
  };

  const handleResend = async () => {
    setCanResend(false);
    setTimer(60);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const isComplete = otp.every((digit) => digit !== "");

  const formContent = (
    <div className="space-y-6 px-6 pb-6">
      {/* Email Display */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          We sent a verification code to:
        </p>
        <p className="text-sm font-semibold">{email}</p>
      </div>

      {/* OTP Input */}
      <div className="space-y-4">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center text-lg font-semibold"
              disabled={isVerifying || isVerified}
            />
          ))}
        </div>

        {/* Timer / Resend */}
        <div className="text-center">
          {canResend ? (
            <Button
              type="button"
              variant="link"
              onClick={handleResend}
              className="text-sm"
            >
              Resend OTP
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Resend OTP in {timer}s
            </p>
          )}
        </div>
      </div>

      {/* Verify Button */}
      <Button
        onClick={handleVerify}
        disabled={!isComplete || isVerifying || isVerified}
        className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
      >
        {isVerifying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : isVerified ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Verified!
          </>
        ) : (
          "Verify OTP"
        )}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="bg-black text-white py-4">
            <DrawerTitle className="text-center text-lg">
              Enter Verification Code
            </DrawerTitle>
          </DrawerHeader>
          <div className="max-h-[70vh] overflow-y-auto pt-6">{formContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="bg-black text-white py-4 px-6">
          <DialogTitle className="text-center text-lg">
            Enter Verification Code
          </DialogTitle>
        </DialogHeader>
        <div className="pt-6">{formContent}</div>
      </DialogContent>
    </Dialog>
  );
}
