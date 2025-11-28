import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { FundRaiserCampaign, currencyRates } from "@/data/fundraiserData";
import { DollarSign, Calendar, Target } from "lucide-react";

interface DonationCardProps {
  campaign: FundRaiserCampaign;
  onDonate?: () => void;
}

export const DonationCard = ({ campaign, onDonate }: DonationCardProps) => {
  const [donationAmount, setDonationAmount] = useState("");
  const [currency, setCurrency] = useState<'USD' | 'MOBI'>(campaign.currency === 'MOBI' ? 'MOBI' : 'USD');

  const progressPercentage = (campaign.raisedAmount / campaign.targetAmount) * 100;

  const convertAmount = (amount: number, toCurrency: 'USD' | 'MOBI') => {
    if (campaign.currency === toCurrency) return amount;
    
    if (campaign.currency === 'USD' && toCurrency === 'MOBI') {
      return amount * currencyRates.USD_TO_MOBI;
    } else if (campaign.currency === 'MOBI' && toCurrency === 'USD') {
      return amount * currencyRates.MOBI_TO_USD;
    }
    return amount;
  };

  const getConvertedAmount = () => {
    const amount = parseFloat(donationAmount) || 0;
    const targetCurrency = currency === 'USD' ? 'MOBI' : 'USD';
    const converted = currency === 'USD' 
      ? amount * currencyRates.USD_TO_MOBI 
      : amount * currencyRates.MOBI_TO_USD;
    
    return `${targetCurrency === 'MOBI' ? 'M' : '$'} ${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  return (
    <Card className="p-6 border-4 border-green-500 shadow-lg">
      {/* Convener Info */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={campaign.convenerAvatar} />
          <AvatarFallback>{campaign.convenerName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-lg">{campaign.convenerName}</p>
          <p className="text-sm text-blue-600">ID-CODE: {campaign.idCode}</p>
        </div>
      </div>

      {/* Campaign Theme */}
      <h3 className="text-xl font-bold mb-3">{campaign.theme}</h3>
      
      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
        {campaign.description}
      </p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold">
            ${campaign.raisedAmount.toLocaleString()} raised
          </span>
          <span className="text-muted-foreground">
            of ${campaign.targetAmount.toLocaleString()} goal
          </span>
        </div>
        <Progress value={progressPercentage} className="h-3" />
      </div>

      {/* Campaign Details */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2 bg-yellow-50 p-2 rounded">
          <Calendar className="h-4 w-4 text-yellow-600" />
          <span className="font-semibold">{campaign.urgencyLevel}</span>
        </div>
        {campaign.timeFrame && (
          <div className="flex items-center gap-2 bg-blue-50 p-2 rounded">
            <Target className="h-4 w-4 text-blue-600" />
            <span>{campaign.timeFrame}</span>
          </div>
        )}
      </div>

      {/* Donation Amount Input */}
      <div className="space-y-3 mb-4">
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Enter amount"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrency(currency === 'USD' ? 'MOBI' : 'USD')}
            className="min-w-[80px]"
          >
            {currency === 'USD' ? 'US$' : 'Mobi'}
          </Button>
        </div>
        
        {donationAmount && (
          <p className="text-sm text-muted-foreground text-center">
            ≈ {getConvertedAmount()}
          </p>
        )}
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 p-3 rounded text-center">
          <p className="text-xs text-muted-foreground">Target Amount</p>
          <p className="font-bold">${campaign.targetAmount.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-3 rounded text-center">
          <p className="text-xs text-muted-foreground">Minimum</p>
          <p className="font-bold">${campaign.minimumDonation}</p>
        </div>
      </div>

      {/* Donate Button */}
      <Button 
        className="w-full bg-red-600 hover:bg-red-700 font-bold text-lg py-6"
        onClick={onDonate}
      >
        <DollarSign className="h-5 w-5 mr-2" />
        Donate
      </Button>

      {/* Token Donation Link */}
      <p className="text-center mt-3 text-sm">
        <span className="text-muted-foreground">Can't afford Cash Donation? </span>
        <Button variant="link" className="text-blue-600 p-0 h-auto">
          Send Token Donation here
        </Button>
      </p>

      {/* Donors Count */}
      <p className="text-center text-xs text-muted-foreground mt-2">
        {campaign.donors.length} people have donated
      </p>
    </Card>
  );
};
