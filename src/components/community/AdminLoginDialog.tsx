import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
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

interface AdminLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminLoginDialog({ open, onOpenChange }: AdminLoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Admin Login Submitted",
      description: "OTP has been sent to your email address.",
    });
    onOpenChange(false);
  };

  const handleJoin = () => {
    toast({
      title: "Join Community",
      description: "Redirecting to registration...",
    });
    onOpenChange(false);
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="admin-email" className="text-sm font-medium">
          Enter Email
        </Label>
        <Input
          id="admin-email"
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
        <Label htmlFor="admin-password" className="text-sm font-medium">
          Enter Password
        </Label>
        <div className="relative">
          <Input
            id="admin-password"
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

      {/* Authentication Code Field */}
      <div className="space-y-2">
        <Label htmlFor="admin-auth-code" className="text-sm font-medium">
          Enter Authentication Code
        </Label>
        <Input
          id="admin-auth-code"
          type="text"
          placeholder="Please enter your AAC or OTP"
          value={authCode}
          onChange={(e) => setAuthCode(e.target.value)}
          required
          className="h-11"
        />
      </div>

      {/* OTP Message */}
      <p className="text-sm italic text-red-600 leading-relaxed">
        We will send you an OTP Code the moment you Submit a wrong Password or Admin Authentication Code so you can Log in as an Admin!
      </p>

      {/* Remember Me */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="admin-remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
        />
        <Label
          htmlFor="admin-remember"
          className="text-sm font-medium cursor-pointer"
        >
          Remember me
        </Label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
        >
          Submit
        </Button>
        <Button
          type="button"
          onClick={handleJoin}
          className="flex-1 h-11 bg-cyan-500 hover:bg-cyan-600 text-white font-medium"
        >
          Join
        </Button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="bg-black text-white py-4">
            <DrawerTitle className="text-center text-lg">Admin</DrawerTitle>
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
          <DialogTitle className="text-center text-lg">Admin</DialogTitle>
        </DialogHeader>
        <div className="pt-6">
          {formContent}
        </div>
      </DialogContent>
    </Dialog>
  );
}
