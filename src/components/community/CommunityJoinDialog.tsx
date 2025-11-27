import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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

interface CommunityJoinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinSuccess: () => void;
}

export function CommunityJoinDialog({
  open,
  onOpenChange,
  onJoinSuccess,
}: CommunityJoinDialogProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate registration
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    toast({
      title: "Welcome to the Community!",
      description: `Account created successfully for ${fullName}. Redirecting to your profile...`,
    });

    // Reset form
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setAcceptTerms(false);

    onOpenChange(false);
    onJoinSuccess();
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="join-fullname" className="text-sm font-medium">
          Full Name
        </Label>
        <Input
          id="join-fullname"
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="h-11"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="join-email" className="text-sm font-medium">
          Email Address
        </Label>
        <Input
          id="join-email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-11"
        />
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="join-phone" className="text-sm font-medium">
          Phone Number <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <Input
          id="join-phone"
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-11"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="join-password" className="text-sm font-medium">
          Choose Password
        </Label>
        <div className="relative">
          <Input
            id="join-password"
            type={showPassword ? "text" : "password"}
            placeholder="Choose a secure password"
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

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="join-confirm-password" className="text-sm font-medium">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="join-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="h-11 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-11 w-11"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="join-terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
        />
        <Label
          htmlFor="join-terms"
          className="text-sm font-medium cursor-pointer leading-relaxed"
        >
          I accept the{" "}
          <span className="text-primary underline">Terms and Conditions</span>{" "}
          and{" "}
          <span className="text-primary underline">Privacy Policy</span>
        </Label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 bg-cyan-500 hover:bg-cyan-600 text-white font-medium"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Register"
        )}
      </Button>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="bg-black text-white py-4">
            <DrawerTitle className="text-center text-lg">
              Join Our Community
            </DrawerTitle>
          </DrawerHeader>
          <div className="max-h-[70vh] overflow-y-auto pt-6">{formContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-black text-white py-4 px-6">
          <DialogTitle className="text-center text-lg">
            Join Our Community
          </DialogTitle>
        </DialogHeader>
        <div className="pt-6">{formContent}</div>
      </DialogContent>
    </Dialog>
  );
}
