import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordDialog({
  open,
  onOpenChange,
}: ForgotPasswordDialogProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending reset link
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Close dialog after showing success
    setTimeout(() => {
      onOpenChange(false);
      setEmail("");
      setIsSubmitted(false);
    }, 2000);
  };

  const formContent = (
    <div className="space-y-6 px-6 pb-6">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your
            password.
          </div>

          <div className="space-y-2">
            <Label htmlFor="forgot-email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="forgot-email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-4 py-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Check Your Email</h3>
            <p className="text-sm text-muted-foreground">
              We've sent a password reset link to{" "}
              <span className="font-medium">{email}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="bg-black text-white py-4">
            <DrawerTitle className="text-center text-lg">
              Reset Password
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
            Reset Password
          </DialogTitle>
        </DialogHeader>
        <div className="pt-6">{formContent}</div>
      </DialogContent>
    </Dialog>
  );
}
