import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  MapPin, 
  Globe, 
  Star,
  BadgePercent,
  CheckCircle,
  Store,
} from "lucide-react";
import { 
  MerchantCountry, 
  MobiMerchant, 
  getLocalCountry,
  getOtherCountries,
  calculateDiscountedAmount,
} from "@/data/mobiMerchantsData";

interface MerchantSelectionStepProps {
  totalAmount: number;
  onSelectMerchant: (country: MerchantCountry, merchant: MobiMerchant) => void;
  onBack: () => void;
}

type SubStep = "countries" | "merchants";

export function MerchantSelectionStep({
  totalAmount,
  onSelectMerchant,
  onBack,
}: MerchantSelectionStepProps) {
  const [subStep, setSubStep] = useState<SubStep>("countries");
  const [selectedCountry, setSelectedCountry] = useState<MerchantCountry | null>(null);

  const localCountry = getLocalCountry();
  const otherCountries = getOtherCountries();

  const handleSelectCountry = (country: MerchantCountry) => {
    setSelectedCountry(country);
    setSubStep("merchants");
  };

  const handleBackToCountries = () => {
    setSelectedCountry(null);
    setSubStep("countries");
  };

  const handleSelectMerchant = (merchant: MobiMerchant) => {
    if (selectedCountry) {
      onSelectMerchant(selectedCountry, merchant);
    }
  };

  // Render country selection
  if (subStep === "countries") {
    return (
      <>
        {/* Scrollable content using native scrolling */}
        <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4">
          <div className="space-y-4 pb-4">
            {/* Total Amount Card */}
            <Card className="p-3 bg-muted/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Amount</span>
                <div className="text-right">
                  <span className="font-bold">₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            {/* Info Banner */}
            <div className="p-3 bg-primary/5 rounded-lg">
              <div className="flex items-start gap-2">
                <Store className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  <strong>Mobi-Merchants</strong> are accredited shops that sell Mobi Vouchers. 
                  Each merchant offers unique <strong>discount rates</strong> (1% - 20%).
                </p>
              </div>
            </div>

            {/* Local Country Section */}
            {localCountry && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  Merchants in Local Country
                </h4>
                <Card
                  className="p-4 cursor-pointer transition-all duration-200 hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
                  onClick={() => handleSelectCountry(localCountry)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-2xl">{localCountry.flag}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{localCountry.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {localCountry.merchants.length} accredited merchants
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </div>
                </Card>
              </div>
            )}

            {/* International Countries Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-primary" />
                Select Another Country
              </h4>
              <div className="space-y-2">
                {otherCountries.map((country) => (
                  <Card
                    key={country.id}
                    className="p-3 cursor-pointer transition-all duration-200 hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
                    onClick={() => handleSelectCountry(country)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <span className="text-xl">{country.flag}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{country.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {country.merchants.length} merchants
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-4 py-3 border-t bg-background">
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Vouchers
          </Button>
        </div>
      </>
    );
  }

  // Render merchant list for selected country
  return (
    <>
      {/* Scrollable content using native scrolling */}
      <div className="flex-1 overflow-y-auto touch-auto overscroll-contain px-4">
        <div className="space-y-4 pb-4">
          {/* Country Header */}
          <Card className="p-3 bg-muted/50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedCountry?.flag}</span>
              <div className="flex-1">
                <p className="font-semibold">{selectedCountry?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedCountry?.merchants.length} accredited Mobi-Merchants
                </p>
              </div>
            </div>
          </Card>

          {/* Merchant List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Choose Merchant</h4>
            
            {selectedCountry?.merchants
              .filter((m) => m.isActive)
              .sort((a, b) => b.discountPercent - a.discountPercent)
              .map((merchant) => {
                const { discounted, savings } = calculateDiscountedAmount(
                  totalAmount,
                  merchant.discountPercent
                );

                return (
                  <Card
                    key={merchant.id}
                    className="p-4 cursor-pointer transition-all duration-200 hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
                    onClick={() => handleSelectMerchant(merchant)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Store className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{merchant.name}</p>
                          {merchant.isVerified && (
                            <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{merchant.city}</span>
                          <span className="text-muted-foreground/50">•</span>
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            <span>{merchant.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        {/* Discount Info */}
                        <div className="flex items-center gap-2 pt-1">
                          <Badge 
                            variant="secondary" 
                            className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 text-xs"
                          >
                            <BadgePercent className="h-3 w-3 mr-1" />
                            {merchant.discountPercent}% OFF
                          </Badge>
                          <span className="text-xs text-green-600 dark:text-green-400">
                            Save ₦{savings.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      </div>

      <div className="shrink-0 px-4 py-3 border-t bg-background">
        <Button
          variant="outline"
          onClick={handleBackToCountries}
          className="w-full"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Countries
        </Button>
      </div>
    </>
  );
}
