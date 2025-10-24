import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { validateAccreditationCode, formatAccreditationCode, AccreditationTier } from "@/lib/accreditationUtils";

interface AccreditationVerificationProps {
  onVerified: (code: string, tier: AccreditationTier) => void;
  onBack: () => void;
}

export function AccreditationVerification({ onVerified, onBack }: AccreditationVerificationProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCodeChange = (value: string) => {
    setError(null);
    const formatted = formatAccreditationCode(value);
    // Limit to reasonable length (e.g., 20 characters including hyphens)
    if (formatted.length <= 25) {
      setCode(formatted);
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      setError("Please enter your accreditation code");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const result = await validateAccreditationCode(code);
      
      if (result.isValid && result.tier) {
        onVerified(code, result.tier);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An error occurred during verification. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isVerifying) {
      handleVerify();
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Verify Accreditation</h1>
          <p className="text-muted-foreground">
            Enter your <span className="font-semibold text-primary">Accreditation Code</span> to access slot packs with volume discounts
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Accreditation Code</CardTitle>
            <CardDescription>
              Your code should be in the format: XXXX-XXXX-XXXX
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Enter Code</Label>
              <Input
                id="code"
                placeholder="XXXX-XXXX-XXXX"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isVerifying}
                className="font-mono text-lg tracking-wider"
                autoComplete="off"
                autoFocus
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleVerify}
                disabled={isVerifying || !code.trim()}
                className="w-full"
                size="lg"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Verify & Continue
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={onBack}
                disabled={isVerifying}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to User Type
              </Button>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                <strong>Don't have a code?</strong>
                <br />
                Contact our support team to become an accredited advertiser and unlock exclusive benefits.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
