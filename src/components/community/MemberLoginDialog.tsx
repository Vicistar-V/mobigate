import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { OTPVerificationDialog } from "./OTPVerificationDialog";
import { CommunityJoinDialog } from "./CommunityJoinDialog";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";
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
import { toast } from "@/hooks/use-toast";

interface MemberLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess?: (role: "member") => void;
}

export function MemberLoginDialog({
  open,
  onOpenChange,
  onLoginSuccess,
}: MemberLoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otaaCode, setOtaaCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate login validation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);

    // Simulate "wrong password" scenario - send OTP
    toast({
      title: "Verification Required",
      description: "We've sent an OTP to your email for verification.",
    });
    setShowOTP(true);
  };

  const handleOTPVerified = () => {
    toast({
      title: "Welcome back!",
      description: `${email} - You're logged in as a Member.`,
    });
    onOpenChange(false);
    onLoginSuccess?.("member");
  };

  const handleJoin = () => {
    onOpenChange(false);
    setShowJoin(true);
  };

  const handleJoinSuccess = () => {
    toast({
      title: "Registration Complete!",
      description: "Welcome to the community. Viewing your profile...",
    });
    onLoginSuccess?.("member");
  };

  const handleForgotPassword = () => {
    onOpenChange(false);
    setShowForgotPassword(true);
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="member-email" className="text-sm font-medium">
          Enter Email
        </Label>
        <Input
          id="member-email"
          type="email"
          placeholder="Please enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-11"
        />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="member-password" className="text-sm font-medium">
          Enter Password
        </Label>
        <div className="relative">
          <Input
            id="member-password"
            type={showPassword ? "text" : "password"}
            placeholder="Please enter your Password or OTP"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-11 w-11"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* OTAA Code Field */}
      <div className="space-y-2">
        <Label htmlFor="member-otaa" className="text-sm font-medium">
          Enter One-Time Annual Access Code
        </Label>
        <Input
          id="member-otaa"
          type="text"
          placeholder="OTAA Code is only required once annually"
          value={otaaCode}
          onChange={(e) => setOtaaCode(e.target.value)}
          className="h-11"
        />
      </div>

      {/* OTP Message */}
      <p className="text-sm italic text-red-600 leading-relaxed">
        We will send you an OTP Code the moment you Submit a wrong Password you can Log in as a User!
      </p>

      {/* Remember Me */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="member-remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
        />
        <Label
          htmlFor="member-remember"
          className="text-sm font-medium cursor-pointer"
        >
          Remember me
        </Label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Submit"
          )}
        </Button>
        <Button
          type="button"
          onClick={handleJoin}
          disabled={isSubmitting}
          className="flex-1 h-11 bg-cyan-500 hover:bg-cyan-600 text-white font-medium"
        >
          Join
        </Button>
      </div>

      {/* Forgot Password Link */}
      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={handleForgotPassword}
          className="text-sm text-primary underline"
        >
          Forgot your Password? Click Here
        </Button>
      </div>
    </form>
  );

  const renderDialog = () => {
    if (isMobile) {
      return (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent>
            <DrawerHeader className="bg-black text-white py-4">
              <DrawerTitle className="text-center text-lg">User Login</DrawerTitle>
            </DrawerHeader>
            <div className="max-h-[70vh] overflow-y-auto pt-6">
              {formContent}
            </div>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md p-0">
          <DialogHeader className="bg-black text-white py-4 px-6">
            <DialogTitle className="text-center text-lg">User Login</DialogTitle>
          </DialogHeader>
          <div className="pt-6">
            {formContent}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      {renderDialog()}
      <OTPVerificationDialog
        open={showOTP}
        onOpenChange={setShowOTP}
        onVerified={handleOTPVerified}
        email={email}
      />
      <CommunityJoinDialog
        open={showJoin}
        onOpenChange={setShowJoin}
        onJoinSuccess={handleJoinSuccess}
      />
      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
      />
    </>
  );
}
