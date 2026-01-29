import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, Clock, Loader2, Eye, EyeOff, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExtendedOfficerRole, EXTENDED_MOCK_PASSWORDS } from "@/types/adminAuthorization";
import { useToast } from "@/hooks/use-toast";

interface ModuleOfficerCardProps {
  role: ExtendedOfficerRole;
  name: string;
  imageUrl?: string;
  displayTitle: string;
  isRequired: boolean;
  isAlternative: boolean;
  isAuxiliary: boolean;
  status: "pending" | "authorized" | "rejected";
  onAuthorize: (role: ExtendedOfficerRole, password: string) => boolean;
  disabled?: boolean;
}

export function ModuleOfficerCard({
  role,
  name,
  imageUrl,
  displayTitle,
  isRequired,
  isAlternative,
  isAuxiliary,
  status,
  onAuthorize,
  disabled = false,
}: ModuleOfficerCardProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const { toast } = useToast();

  const handleAuthorize = async () => {
    if (!password.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter your authorization password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const isValid = onAuthorize(role, password);
    
    if (!isValid) {
      setShake(true);
      toast({
        title: "Wrong Password",
        description: "Authorization rejected. Please try again.",
        variant: "destructive",
      });
      setTimeout(() => setShake(false), 600);
      setPassword("");
    }
    
    setIsLoading(false);
  };

  const isAuthorized = status === "authorized";

  // Determine badge styling
  const getBadge = () => {
    if (isRequired) {
      return (
        <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 border-orange-300 text-orange-600 bg-orange-50 dark:bg-orange-950/30 shrink-0">
          REQUIRED
        </Badge>
      );
    }
    if (isAlternative) {
      return (
        <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 border-blue-300 text-blue-600 bg-blue-50 dark:bg-blue-950/30 shrink-0">
          PICK ONE
        </Badge>
      );
    }
    if (isAuxiliary) {
      return (
        <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 border-gray-300 text-gray-500 shrink-0">
          AUXILIARY
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card
      className={cn(
        "p-4 transition-all duration-200",
        isAuthorized && "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20",
        shake && "animate-shake"
      )}
    >
      <div className="space-y-3">
        {/* Header - Horizontal layout with avatar, info, and status */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback className="text-base">{name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            {/* Title Row with Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {displayTitle}
              </p>
              {getBadge()}
            </div>
            {/* Name - Full display */}
            <p className="text-base font-medium leading-tight mt-0.5">{name}</p>
          </div>
          
          {/* Status Icon */}
          {isAuthorized ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
          ) : (
            <Clock className="h-6 w-6 text-muted-foreground shrink-0" />
          )}
        </div>

        {/* Authorization Form or Status */}
        {isAuthorized ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
            <UserCheck className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Authorized
            </span>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={disabled || isLoading}
                className="h-11 pr-10 text-base"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAuthorize();
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <Button
              onClick={handleAuthorize}
              disabled={disabled || isLoading || !password.trim()}
              className="w-full h-11 text-sm"
              variant={isRequired ? "default" : "secondary"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Authorise"
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
