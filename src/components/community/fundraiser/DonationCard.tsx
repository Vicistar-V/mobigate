import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { FundRaiserCampaign, currencyRates } from "@/data/fundraiserData";
import { DollarSign, Calendar, Clock } from "lucide-react";
import { differenceInDays, addDays, parseISO } from "date-fns";

interface DonationCardProps {
  campaign: FundRaiserCampaign;
  onDonate?: () => void;
}

export const DonationCard = ({ campaign, onDonate }: DonationCardProps) => {
  const [donationAmount, setDonationAmount] = useState("");
  const [currency, setCurrency] = useState<'USD' | 'MOBI'>(campaign.currency === 'MOBI' ? 'MOBI' : 'USD');

  const progressPercentage = (campaign.raisedAmount / campaign.targetAmount) * 100;

  const calculateRemainingDays = () => {
    if (!campaign.timeFrame || !campaign.createdAt) return null;
    
    const daysMatch = campaign.timeFrame.match(/(\d+)/);
    if (!daysMatch) return null;
    
    const totalDays = parseInt(daysMatch[1], 10);
    const startDate = parseISO(campaign.createdAt);
    const endDate = addDays(startDate, totalDays);
    const today = new Date();
    
    return differenceInDays(endDate, today);
  };

  const remainingDays = calculateRemainingDays();

  const getConvertedAmount = () => {
    const amount = parseFloat(donationAmount) || 0;
    const targetCurrency = currency === 'USD' ? 'MOBI' : 'USD';
    const converted = currency === 'USD' 
      ? amount * currencyRates.USD_TO_MOBI 
      : amount * currencyRates.MOBI_TO_USD;
    
    return `${targetCurrency === 'MOBI' ? 'M' : '$'} ${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  return (
    <Card className="p-4 border-2 border-green-500 shadow-md">
      {/* Convener Info */}
      <div className="flex items-center gap-2.5 mb-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={campaign.convenerAvatar} />
          <AvatarFallback>{campaign.convenerName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight truncate">{campaign.convenerName}</p>
          <p className="text-xs text-blue-600">ID-CODE: {campaign.idCode}</p>
        </div>
      </div>

      {/* Campaign Theme */}
      <h3 className="text-base font-bold mb-2 leading-snug">{campaign.theme}</h3>
      
      {/* Description */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {campaign.description}
      </p>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-semibold">
            ${campaign.raisedAmount.toLocaleString()} raised
          </span>
          <span className="text-muted-foreground">
            of ${campaign.targetAmount.toLocaleString()}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2.5" />
      </div>

      {/* Campaign Details - 2 column */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="flex items-center gap-1.5 bg-yellow-50 p-2 rounded">
          <Calendar className="h-3.5 w-3.5 text-yellow-600 shrink-0" />
          <span className="font-medium truncate">{campaign.urgencyLevel}</span>
        </div>
        {campaign.timeFrame && (
          <div className={`flex items-center gap-1.5 p-2 rounded ${
            remainingDays !== null && remainingDays <= 7 
              ? 'bg-red-50' 
              : remainingDays !== null && remainingDays <= 14 
                ? 'bg-orange-50' 
                : 'bg-blue-50'
          }`}>
            <Clock className={`h-3.5 w-3.5 shrink-0 ${
              remainingDays !== null && remainingDays <= 7 
                ? 'text-red-600' 
                : remainingDays !== null && remainingDays <= 14 
                  ? 'text-orange-600' 
                  : 'text-blue-600'
            }`} />
            <span className={`font-medium truncate ${
              remainingDays !== null && remainingDays <= 7
                ? 'text-red-600'
                : ''
            }`}>
              {remainingDays !== null 
                ? remainingDays <= 0 
                  ? 'Expired' 
                  : `${remainingDays}d left`
                : campaign.timeFrame
              }
            </span>
          </div>
        )}
      </div>

      {/* Donation Amount Input */}
      <div className="space-y-2 mb-3">
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Enter amount"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            className="flex-1 h-10 text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrency(currency === 'USD' ? 'MOBI' : 'USD')}
            className="h-10 min-w-[70px] text-sm"
          >
            {currency === 'USD' ? 'US$' : 'Mobi'}
          </Button>
        </div>
        
        {donationAmount && (
          <p className="text-xs text-muted-foreground text-center">
            ≈ {getConvertedAmount()}
          </p>
        )}
      </div>

      {/* Info Boxes - Target & Minimum */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-blue-50 p-2.5 rounded text-center">
          <p className="text-xs text-muted-foreground">Target</p>
          <p className="font-bold text-sm">${campaign.targetAmount.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-2.5 rounded text-center">
          <p className="text-xs text-muted-foreground">Minimum</p>
          <p className="font-bold text-sm">${campaign.minimumDonation}</p>
        </div>
      </div>

      {/* Donate Button - Full width, touch-friendly */}
      <Button 
        className="w-full bg-red-600 hover:bg-red-700 font-bold text-base h-12"
        onClick={onDonate}
      >
        <DollarSign className="h-4 w-4 mr-1.5" />
        Donate
      </Button>

      {/* Token Donation Link */}
      <p className="text-center mt-2 text-xs">
        <span className="text-muted-foreground">Can't afford Cash? </span>
        <Button variant="link" className="text-blue-600 p-0 h-auto text-xs">
          Send Token Donation
        </Button>
      </p>

      {/* Donors Count */}
      <p className="text-center text-xs text-muted-foreground mt-1.5">
        {campaign.donors.length} people have donated
      </p>
    </Card>
  );
};
