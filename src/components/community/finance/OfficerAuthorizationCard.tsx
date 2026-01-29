import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, Clock, Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { OfficerRole, MOCK_OFFICER_PASSWORDS } from "@/types/transactionAuthorization";
import { useToast } from "@/hooks/use-toast";

interface OfficerAuthorizationCardProps {
  role: OfficerRole;
  name: string;
  imageUrl?: string;
  displayTitle: string;
  isRequired: boolean;
  status: "pending" | "authorized" | "rejected";
  onAuthorize: (role: OfficerRole, password: string) => boolean;
  disabled?: boolean;
}

export function OfficerAuthorizationCard({
  role,
  name,
  imageUrl,
  displayTitle,
  isRequired,
  status,
  onAuthorize,
  disabled = false,
}: OfficerAuthorizationCardProps) {
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

  return (
    <Card
      className={cn(
        "p-3 transition-all duration-200",
        isAuthorized && "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20",
        shake && "animate-shake"
      )}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback className="text-xs">{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                {displayTitle}
              </p>
              {isRequired && (
                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-orange-300 text-orange-600">
                  REQUIRED
                </Badge>
              )}
            </div>
            <p className="text-xs font-medium leading-tight">{name}</p>
          </div>
          {/* Status Icon */}
          {isAuthorized ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
          ) : (
            <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          )}
        </div>

        {/* Authorization Form or Status */}
        {isAuthorized ? (
          <div className="flex items-center gap-2 px-2 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Authorized
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={disabled || isLoading}
                className="h-10 pr-10 text-sm"
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
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <Button
              onClick={handleAuthorize}
              disabled={disabled || isLoading || !password.trim()}
              className="w-full h-10 text-sm"
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
