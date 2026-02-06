import { useState } from "react";
import { 
  ShieldCheck, 
  Award, 
  CheckCircle, 
  XCircle, 
  Loader2,
  ArrowLeft,
  FileText,
  Calendar,
  Building,
  User,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CertificateOfReturn } from "@/types/certificateOfReturn";
import { CertificateOfReturnDisplay } from "./CertificateOfReturnDisplay";
import { format, addYears } from "date-fns";

interface VerifyCertificateDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type VerificationStatus = 'idle' | 'verifying' | 'success' | 'error';

// Mock certificate for demo - matches the code Y5LE6SLJ
const mockVerifiedCertificate: CertificateOfReturn = {
  id: "cert-verified-001",
  certificateNumber: "COR/2026/0042",
  communityName: "Ndigbo Progressive Union",
  communityId: "comm-001",
  communityLocation: "Lagos, Nigeria",
  winnerName: "Daniel Obiora Chibueze",
  winnerId: "user-123",
  winnerAvatar: "/placeholder.svg",
  officePosition: "Secretary",
  officeCategory: 'executive',
  electionId: "elec-2026",
  electionName: "2026 Community Leadership Elections",
  electionDate: new Date(2026, 1, 4),
  totalVotesReceived: 847,
  totalVotesCast: 1245,
  votePercentage: 68,
  tenureStart: new Date(2026, 1, 4),
  tenureEnd: addYears(new Date(2026, 1, 4), 4),
  tenureDurationYears: 4,
  issuedDate: new Date(2026, 1, 4),
  issuedBy: "Mobigate Independent Electoral System",
  digitalSignature: "MOBIGATE-SIG-Y5LE6SLJ",
  verificationCode: "Y5LE6SLJ",
  status: 'issued'
};

export function VerifyCertificateDrawer({
  open,
  onOpenChange
}: VerifyCertificateDrawerProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [verifiedCertificate, setVerifiedCertificate] = useState<CertificateOfReturn | null>(null);
  const [showFullCertificate, setShowFullCertificate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerify = async () => {
    if (!verificationCode.trim()) return;
    
    setStatus('verifying');
    setErrorMessage("");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock verification - check against demo code
    const inputCode = verificationCode.trim().toUpperCase();
    if (inputCode === mockVerifiedCertificate.verificationCode) {
      setVerifiedCertificate(mockVerifiedCertificate);
      setStatus('success');
    } else {
      setErrorMessage("The verification code you entered could not be found. Please check the code and try again.");
      setStatus('error');
    }
  };

  const handleReset = () => {
    setVerificationCode("");
    setStatus('idle');
    setVerifiedCertificate(null);
    setErrorMessage("");
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[92vh] flex flex-col">
          {/* Header */}
          <DrawerHeader className="border-b pb-3 shrink-0 px-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 shrink-0"
                onClick={handleClose}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <DrawerTitle className="text-base">Verify Certificate</DrawerTitle>
                  <p className="text-xs text-muted-foreground">Authenticate a Certificate of Return</p>
                </div>
              </div>
            </div>
          </DrawerHeader>

          {/* Content */}
          <ScrollArea className="flex-1 overflow-y-auto touch-auto">
            <div className="p-4 space-y-4 pb-8">
              {/* Idle State - Entry Form */}
              {status === 'idle' && (
                <>
                  {/* Info Card */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Award className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">Certificate Verification</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Enter the verification code from a Certificate of Return to verify its authenticity. 
                            This service is available to banks, institutions, and the public.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Input Form */}
                  <div className="space-y-3">
                    <Label htmlFor="verification-code" className="text-sm font-medium">
                      Verification Code *
                    </Label>
                    <Input
                      id="verification-code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                      placeholder="e.g., Y5LE6SLJ"
                      maxLength={12}
                      className="h-12 text-center text-lg font-mono tracking-widest uppercase touch-manipulation"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Enter the 8-character code found on the certificate
                    </p>
                  </div>

                  {/* Verify Button */}
                  <Button 
                    className="w-full h-12 gap-2"
                    onClick={handleVerify}
                    disabled={!verificationCode.trim()}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Verify Now
                  </Button>
                </>
              )}

              {/* Verifying State */}
              {status === 'verifying' && (
                <Card className="bg-muted/30">
                  <CardContent className="p-8 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <div className="text-center">
                      <p className="font-medium">Verifying Certificate</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Checking code: {verificationCode}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Success State */}
              {status === 'success' && verifiedCertificate && (
                <>
                  {/* Success Header */}
                  <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                          <CheckCircle className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-emerald-700 dark:text-emerald-400">
                            Certificate Verified!
                          </h4>
                          <p className="text-xs text-emerald-600/80 dark:text-emerald-500">
                            This certificate is authentic and valid
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Certificate Details */}
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        <span className="font-semibold text-sm">Certificate Details</span>
                      </div>

                      {/* Winner */}
                      <div className="flex items-start gap-3">
                        <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Winner</p>
                          <p className="font-semibold text-sm">{verifiedCertificate.winnerName}</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Office */}
                      <div className="flex items-start gap-3">
                        <Award className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Office Position</p>
                          <p className="font-medium text-sm">{verifiedCertificate.officePosition}</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Community */}
                      <div className="flex items-start gap-3">
                        <Building className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Community</p>
                          <p className="font-medium text-sm">{verifiedCertificate.communityName}</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Tenure */}
                      <div className="flex items-start gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Tenure Period</p>
                          <p className="font-medium text-sm">
                            {format(verifiedCertificate.tenureStart, "yyyy")} - {format(verifiedCertificate.tenureEnd, "yyyy")}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Issued Date */}
                      <div className="flex items-start gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Issued On</p>
                          <p className="font-medium text-sm">
                            {format(verifiedCertificate.issuedDate, "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button 
                      className="w-full h-11 gap-2"
                      onClick={() => setShowFullCertificate(true)}
                    >
                      <FileText className="h-4 w-4" />
                      View Full Certificate
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full h-11"
                      onClick={handleReset}
                    >
                      Verify Another Certificate
                    </Button>
                  </div>
                </>
              )}

              {/* Error State */}
              {status === 'error' && (
                <>
                  {/* Error Header */}
                  <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/50">
                          <XCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-red-700 dark:text-red-400">
                            Verification Failed
                          </h4>
                          <p className="text-sm text-red-600/80 dark:text-red-500 mt-1">
                            {errorMessage}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Code Entered */}
                  <Card className="bg-muted/50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="text-muted-foreground">Code entered:</span>
                        <span className="font-mono font-bold tracking-wider">{verificationCode}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Try Again Button */}
                  <Button 
                    className="w-full h-11"
                    onClick={handleReset}
                  >
                    Try Again
                  </Button>
                </>
              )}
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>

      {/* Full Certificate Display */}
      {verifiedCertificate && (
        <CertificateOfReturnDisplay
          open={showFullCertificate}
          onOpenChange={setShowFullCertificate}
          certificate={verifiedCertificate}
        />
      )}
    </>
  );
}
