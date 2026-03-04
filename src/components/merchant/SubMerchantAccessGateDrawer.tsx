import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerBody } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KeyRound, Phone, Mail, MapPin, CheckCircle, AlertCircle, ArrowRight, Shield } from "lucide-react";
import { mockSubMerchants, type SubMerchant } from "@/data/subMerchantData";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchantName: string;
}

export function SubMerchantAccessGateDrawer({ open, onOpenChange, merchantName }: Props) {
  const navigate = useNavigate();

  const [idCode, setIdCode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [matched, setMatched] = useState<SubMerchant | null>(null);
  const [error, setError] = useState("");
  const [filledBy, setFilledBy] = useState<"idCode" | "phone" | null>(null);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setIdCode("");
      setPhone("");
      setEmail("");
      setLocation("");
      setMatched(null);
      setError("");
      setFilledBy(null);
    }
  }, [open]);

  const lookupByIdCode = useCallback((code: string) => {
    setIdCode(code);
    setError("");
    if (filledBy === "phone") return; // don't override phone-triggered fill

    if (code.length >= 5) {
      const found = mockSubMerchants.find(sm => sm.idCode.toLowerCase() === code.toLowerCase());
      if (found) {
        setMatched(found);
        setPhone(found.phone);
        setEmail(found.email);
        setLocation(found.country);
        setFilledBy("idCode");
      } else {
        setMatched(null);
        if (code.length >= 10) {
          setError("No Retail Merchant found with this ID-Code");
        }
      }
    } else {
      if (filledBy === "idCode") {
        setMatched(null);
        setPhone("");
        setEmail("");
        setLocation("");
        setFilledBy(null);
      }
    }
  }, [filledBy]);

  const lookupByPhone = useCallback((p: string) => {
    setPhone(p);
    setError("");
    if (filledBy === "idCode") return; // don't override idCode-triggered fill

    if (p.length >= 8) {
      const found = mockSubMerchants.find(sm => sm.phone === p);
      if (found) {
        setMatched(found);
        setIdCode(found.idCode);
        setEmail(found.email);
        setLocation(found.country);
        setFilledBy("phone");
      } else {
        setMatched(null);
        if (p.length >= 11) {
          setError("No Retail Merchant found with this Phone Number");
        }
      }
    } else {
      if (filledBy === "phone") {
        setMatched(null);
        setIdCode("");
        setEmail("");
        setLocation("");
        setFilledBy(null);
      }
    }
  }, [filledBy]);

  const handleClearAndRetry = () => {
    setIdCode("");
    setPhone("");
    setEmail("");
    setLocation("");
    setMatched(null);
    setError("");
    setFilledBy(null);
  };

  const handleProceed = () => {
    if (!matched) return;
    onOpenChange(false);
    navigate(`/buy-vouchers?merchant=${encodeURIComponent(merchantName)}`);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh] flex flex-col">
        <DrawerHeader className="shrink-0 pb-2">
          <DrawerTitle className="flex items-center gap-2 text-base">
            <Shield className="h-5 w-5 text-primary" />
            Retail Merchant Access
          </DrawerTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Enter your Retail Merchant credentials to access voucher bundles
          </p>
        </DrawerHeader>

        <DrawerBody className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4 pb-6">
          {/* Access Code */}
          <div className="space-y-1.5">
            <Label htmlFor="gate-idcode" className="text-sm font-medium flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-primary" />
              Access Code (Retail Merchant ID-Code)
            </Label>
            <Input
              id="gate-idcode"
              placeholder="e.g. SM02753900101"
              value={idCode}
              onChange={e => lookupByIdCode(e.target.value.toUpperCase())}
              className="h-12 text-base font-mono tracking-wide"
              inputMode="text"
              autoCapitalize="characters"
              disabled={filledBy === "phone"}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Telephone */}
          <div className="space-y-1.5">
            <Label htmlFor="gate-phone" className="text-sm font-medium flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-primary" />
              Telephone Number
            </Label>
            <Input
              id="gate-phone"
              placeholder="e.g. +234 803 123 4567"
              value={phone}
              onChange={e => lookupByPhone(e.target.value.replace(/\D/g, ""))}
              className="h-12 text-base"
              inputMode="numeric"
              disabled={filledBy === "idCode"}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 mt-3 rounded-xl bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
              <p className="text-xs text-destructive font-medium">{error}</p>
            </div>
          )}

          {/* Auto-filled fields */}
          {matched && (
            <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Confirmed match card */}
              <Card className="p-3 border-primary/30 bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{matched.name}</p>
                    <Badge variant="secondary" className="text-[10px] mt-0.5">
                      {matched.idCode}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </Label>
                <Input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-11 bg-muted/50"
                  inputMode="email"
                  placeholder="Optional"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  City / State / Country
                </Label>
                <Input
                  value={location}
                  readOnly
                  className="h-11 bg-muted/50 cursor-default"
                />
              </div>
            </div>
          )}

          {/* Clear / Retry when filled */}
          {filledBy && (
            <button
              className="mt-3 text-xs text-primary font-medium underline underline-offset-2 touch-manipulation"
              onClick={handleClearAndRetry}
            >
              Clear & try different credentials
            </button>
          )}

          {/* Proceed */}
          <Button
            className="w-full h-12 mt-6 text-base font-semibold gap-2"
            disabled={!matched}
            onClick={handleProceed}
          >
            Proceed
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
