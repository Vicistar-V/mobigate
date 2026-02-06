import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Menu, Download, Calendar, Users, Mail, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";
import { CheckIndebtednessSheet } from "./CheckIndebtednessSheet";
import { CheckActivitiesSheet } from "./CheckActivitiesSheet";
import { AccreditedVotersSection } from "./AccreditedVotersSection";
import { UpcomingElectionsSection } from "./UpcomingElectionsSection";
import { PreviousResultsSection } from "./PreviousResultsSection";
import { UpcomingSchedulesSection } from "./UpcomingSchedulesSection";
import { FinancialStatusDialog } from "@/components/community/finance/FinancialStatusDialog";
import { DownloadFormatSheet, DownloadFormat } from "@/components/common/DownloadFormatSheet";
import { toast } from "sonner";

// Mock activities data
const activitiesData = {
  meetings: { attended: 8, total: 12, percentage: 67 },
  events: { attended: 5, total: 8, percentage: 63 },
  invitations: { honoured: 10, total: 15, percentage: 67 },
  penalties: [
    { type: "Late Meeting Attendance", count: 3, penalty: "₦500 each" },
    { type: "Missed Events", count: 2, penalty: "₦1,000 each" },
    { type: "Ignored Invitations", count: 5, penalty: "₦200 each" },
  ],
  totalPenalty: 4500
};

interface ElectionAccreditationTabProps {
  initialSubTab?: 'financial' | 'activities' | 'accredited';
}

export const ElectionAccreditationTab = ({ 
  initialSubTab = 'financial' 
}: ElectionAccreditationTabProps) => {
  const [activeSubTab, setActiveSubTab] = useState<'financial' | 'activities' | 'accredited'>(initialSubTab);
  const [showIndebtednessSheet, setShowIndebtednessSheet] = useState(false);
  const [showActivitiesSheet, setShowActivitiesSheet] = useState(false);
  const [showFinancialStatusDialog, setShowFinancialStatusDialog] = useState(false);
  const [debtsChecked, setDebtsChecked] = useState(false);
  const [receiptsChecked, setReceiptsChecked] = useState(false);
  const [showReceiptsFormatSheet, setShowReceiptsFormatSheet] = useState(false);
  const [isAccredited, setIsAccredited] = useState(false);
  const [isAccreditationLoading, setIsAccreditationLoading] = useState(false);
  const [accreditationNumber, setAccreditationNumber] = useState<string | null>(null);
  const [isActivityDebtCleared, setIsActivityDebtCleared] = useState(false);
  const [isActivityDebtClearing, setIsActivityDebtClearing] = useState(false);

  const handleGetAccreditation = async () => {
    if (isAccredited) return;
    
    setIsAccreditationLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock accreditation number
    const generatedNumber = `ACC-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setAccreditationNumber(generatedNumber);
    setIsAccredited(true);
    setIsAccreditationLoading(false);
    
    toast.success("Accreditation successful! Check your email for your accreditation number.");
  };

  const handleActivityDebtClearing = async () => {
    if (isActivityDebtCleared) return;
    
    setIsActivityDebtClearing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsActivityDebtCleared(true);
    setIsActivityDebtClearing(false);
    
    toast.success(`₦${activitiesData.totalPenalty.toLocaleString()} (M${activitiesData.totalPenalty.toLocaleString()}) debited from your Mobi Wallet. Activity debts cleared!`);
  };

  const handleDebtsClearing = () => {
    if (debtsChecked) {
      toast.success("Processing debt clearance from your wallet...");
    } else {
      toast.error("Please check the box to confirm debt clearance.");
    }
  };

  const handleDownloadReceipts = () => {
    if (receiptsChecked) {
      setShowReceiptsFormatSheet(true);
    } else {
      toast.error("Please check the box to confirm receipt download.");
    }
  };

  const handleReceiptsFormatDownload = (selectedFormat: DownloadFormat) => {
    toast.success(`Receipts downloaded as ${selectedFormat.toUpperCase()}`);
    setShowReceiptsFormatSheet(false);
  };

  return (
    <div className="space-y-6 pb-20 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Voters Accreditation</h1>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Financial / Activities / Accredited Voters toggle */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Button 
          className={`shrink-0 ${activeSubTab === 'financial' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
          onClick={() => setActiveSubTab('financial')}
        >
          Financial
        </Button>
        <Button 
          className={`shrink-0 ${activeSubTab === 'activities' ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
          onClick={() => setActiveSubTab('activities')}
        >
          Activities
        </Button>
        <Button 
          className={`shrink-0 ${activeSubTab === 'accredited' ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
          onClick={() => setActiveSubTab('accredited')}
        >
          Accredited Voters
        </Button>
      </div>
      
      {/* Financial Tab Content */}
      {activeSubTab === 'financial' && (
        <>
          {/* Info text */}
          <p className="text-sm leading-relaxed">
            Please complete the following <span className="text-blue-600 font-semibold">Financial Verification</span> processes and endeavour to update your financial records to get mandatory <span className="text-purple-700 font-semibold">Voter Accreditation</span> to qualify for <span className="text-blue-600 font-semibold">Community Voting Rights & Privileges</span>.
          </p>
          
          {/* Financial Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button 
              className="bg-red-600 hover:bg-red-700 font-bold py-6"
              onClick={() => setShowIndebtednessSheet(true)}
            >
              Check Total Indebtedness
            </Button>
            
            <div className="flex items-center gap-3">
              <Checkbox 
                id="debts" 
                checked={debtsChecked}
                onCheckedChange={(checked) => setDebtsChecked(checked as boolean)}
              />
              <Button 
                className="bg-yellow-400 text-black hover:bg-yellow-500 flex-1 font-bold py-6"
                onClick={handleDebtsClearing}
              >
                Debts Clearance Now
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Checkbox 
                id="receipts"
                checked={receiptsChecked}
                onCheckedChange={(checked) => setReceiptsChecked(checked as boolean)}
              />
              <Button 
                className="bg-blue-600 hover:bg-blue-700 flex-1 font-bold py-6"
                onClick={handleDownloadReceipts}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipts
              </Button>
            </div>
            
            <Button 
              className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold py-6"
              onClick={() => setShowFinancialStatusDialog(true)}
            >
              Financial Status Report
            </Button>
          </div>
        </>
      )}
      
      {/* Activities Tab Content */}
      {activeSubTab === 'activities' && (
        <>
          {/* Info text */}
          <p className="text-sm leading-relaxed">
            Please check your <span className="text-blue-600 font-semibold">Activities Index</span> including meetings attendance, events participation, and invitations honoured to qualify for <span className="text-purple-700 font-semibold">Voter Accreditation</span>.
          </p>
          
          {/* Check Activities Button */}
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600 font-bold py-6"
            onClick={() => setShowActivitiesSheet(true)}
          >
            Check All Activities Index
          </Button>
          
          {/* Attendance Progress Cards */}
          <div className="grid grid-cols-1 gap-4">
            {/* Meetings Attendance */}
            <Card className="p-4 border-2 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900">Meetings Attendance</h4>
                  <p className="text-xs text-blue-700">{activitiesData.meetings.attended} of {activitiesData.meetings.total} meetings attended</p>
                </div>
                <span className="text-2xl font-bold text-blue-600">{activitiesData.meetings.percentage}%</span>
              </div>
              <Progress value={activitiesData.meetings.percentage} className="h-3 bg-blue-200" />
            </Card>
            
            {/* Events Participation */}
            <Card className="p-4 border-2 border-green-200 bg-green-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900">Events Participation</h4>
                  <p className="text-xs text-green-700">{activitiesData.events.attended} of {activitiesData.events.total} events attended</p>
                </div>
                <span className="text-2xl font-bold text-green-600">{activitiesData.events.percentage}%</span>
              </div>
              <Progress value={activitiesData.events.percentage} className="h-3 bg-green-200" />
            </Card>
            
            {/* Invitations Honoured */}
            <Card className="p-4 border-2 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-900">Invitations Honoured</h4>
                  <p className="text-xs text-purple-700">{activitiesData.invitations.honoured} of {activitiesData.invitations.total} invitations honoured</p>
                </div>
                <span className="text-2xl font-bold text-purple-600">{activitiesData.invitations.percentage}%</span>
              </div>
              <Progress value={activitiesData.invitations.percentage} className="h-3 bg-purple-200" />
            </Card>
          </div>
          
          {/* Penalties Summary */}
          <Card className="p-4 border-2 border-red-300 bg-red-50">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h4 className="font-bold text-red-900">Activity Penalties Summary</h4>
            </div>
            <div className="space-y-2">
              {activitiesData.penalties.map((penalty, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-red-800">{penalty.type} ({penalty.count}x)</span>
                  <span className="font-semibold text-red-700">{penalty.penalty}</span>
                </div>
              ))}
              <div className="border-t border-red-300 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span className="text-red-900">Total Activity Penalties</span>
                  <span className="text-red-600">₦{activitiesData.totalPenalty.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Accredited Voters Tab Content */}
      {activeSubTab === 'accredited' && (
        <AccreditedVotersSection />
      )}
      
      {/* Clear Activity Debts Now Button - Shows only on Activities tab when debts exist */}
      {activeSubTab === 'activities' && activitiesData.totalPenalty > 0 && (
        <div className="space-y-2">
          {!isActivityDebtCleared ? (
            <Button 
              className="w-full bg-orange-600 hover:bg-orange-700 text-lg font-bold py-6"
              onClick={handleActivityDebtClearing}
              disabled={isActivityDebtClearing}
            >
              {isActivityDebtClearing ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing Debit...</span>
                </div>
              ) : (
                <span>Clear Debts Now</span>
              )}
            </Button>
          ) : (
            <Button 
              className="w-full bg-green-600 hover:bg-green-600 text-lg font-bold py-6"
              disabled
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Activity Debts Cleared
            </Button>
          )}
          
          {!isActivityDebtCleared && (
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              This will debit <strong>M{activitiesData.totalPenalty.toLocaleString()}</strong> (≈ ₦{activitiesData.totalPenalty.toLocaleString()}) from your Mobi Wallet.
            </p>
          )}
        </div>
      )}

      {/* Get Accreditation Now button */}
      <Button 
        className={`w-full text-sm font-bold py-4 transition-all duration-300 ${
          isAccredited 
            ? "bg-green-700 hover:bg-green-700 cursor-default" 
            : isAccreditationLoading 
            ? "bg-green-500 hover:bg-green-500 cursor-wait" 
            : activeSubTab === 'activities' && !isActivityDebtCleared
            ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
        onClick={handleGetAccreditation}
        disabled={isAccreditationLoading || isAccredited || (activeSubTab === 'activities' && !isActivityDebtCleared)}
      >
        {isAccreditationLoading ? (
          <div className="flex items-center justify-center gap-1.5">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : isAccredited ? (
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>Accreditation Complete!</span>
          </div>
        ) : (
          "Get Accreditation Now!"
        )}
      </Button>
      
      {/* Success message */}
      {isAccredited && (
        <div className="p-4 bg-green-50 border-2 border-green-600 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-sm font-bold text-green-800">Accreditation Successful!</p>
          </div>
          <p className="text-sm text-center text-green-700">
            Check your email for your accreditation number.
          </p>
        </div>
      )}
      
      <p className="text-sm text-center leading-relaxed text-muted-foreground">
        You will receive your <strong>Accreditation Number</strong> in your registered e-mail address as soon as you have completed this process successfully. Please check your e-mail inbox now if you have done this.
      </p>
      
      {/* View All Accredited Voters */}
      <AccreditedVotersSection />
      
      {/* Sponsored Advert */}
      <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-accreditation" />
      
      {/* Upcoming Elections */}
      <UpcomingElectionsSection />
      
      {/* People You May Know */}
      <PeopleYouMayKnow />
      
      {/* Previous Election Results */}
      <PreviousResultsSection />
      
      {/* Upcoming Meeting Schedules */}
      <UpcomingSchedulesSection />
      
      {/* Sheets */}
      <CheckIndebtednessSheet 
        open={showIndebtednessSheet} 
        onOpenChange={setShowIndebtednessSheet} 
      />
      <CheckActivitiesSheet 
        open={showActivitiesSheet} 
        onOpenChange={setShowActivitiesSheet} 
      />
      <FinancialStatusDialog
        open={showFinancialStatusDialog}
        onOpenChange={setShowFinancialStatusDialog}
      />
      <DownloadFormatSheet
        open={showReceiptsFormatSheet}
        onOpenChange={setShowReceiptsFormatSheet}
        onDownload={handleReceiptsFormatDownload}
        title="Download Receipts"
        documentName="Financial Receipts"
        availableFormats={["pdf", "jpeg", "png", "txt"]}
      />
    </div>
  );
};
