import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Menu, Download } from "lucide-react";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";
import { CheckIndebtednessSheet } from "./CheckIndebtednessSheet";
import { CheckActivitiesSheet } from "./CheckActivitiesSheet";
import { AccreditedVotersSection } from "./AccreditedVotersSection";
import { UpcomingElectionsSection } from "./UpcomingElectionsSection";
import { PreviousResultsSection } from "./PreviousResultsSection";
import { UpcomingSchedulesSection } from "./UpcomingSchedulesSection";
import { toast } from "sonner";

export const ElectionAccreditationTab = () => {
  const [activeSubTab, setActiveSubTab] = useState<'financial' | 'activities'>('financial');
  const [showIndebtednessSheet, setShowIndebtednessSheet] = useState(false);
  const [showActivitiesSheet, setShowActivitiesSheet] = useState(false);
  const [debtsChecked, setDebtsChecked] = useState(false);
  const [receiptsChecked, setReceiptsChecked] = useState(false);
  const [isAccredited, setIsAccredited] = useState(false);

  const handleGetAccreditation = () => {
    toast.success("Accreditation successful! Check your email for your accreditation number.");
    setIsAccredited(true);
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
      toast.success("Downloading receipts...");
    } else {
      toast.error("Please check the box to confirm receipt download.");
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Voters Accreditation</h1>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="bg-purple-800 hover:bg-purple-900">Campaigns</Button>
        <Button size="sm" variant="link" className="text-blue-600">Start Voting</Button>
        <Button size="sm" variant="link" className="text-blue-600">Results</Button>
        <Button size="sm" variant="link" className="text-blue-600">View Winners</Button>
        <Button size="sm" variant="link" className="text-blue-600">...More</Button>
      </div>
      
      {/* Financial / Activities toggle */}
      <div className="flex items-center gap-2">
        <Button 
          className={`${activeSubTab === 'financial' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
          onClick={() => setActiveSubTab('financial')}
        >
          Financial
        </Button>
        <Button 
          className={`${activeSubTab === 'activities' ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
          onClick={() => setActiveSubTab('activities')}
        >
          Activities
        </Button>
      </div>
      
      {/* Info text */}
      <p className="text-sm leading-relaxed">
        Please complete the following <span className="text-blue-600 font-semibold">Verification</span> processes and endeavour to update your financial records to get mandatory <span className="text-purple-700 font-semibold">Voter Accreditation</span> to qualify for <span className="text-blue-600 font-semibold">Community Voting Rights & Privileges</span>.
      </p>
      
      {/* Action Buttons */}
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
          onClick={() => toast.info("Generating financial status report...")}
        >
          Financial Status Report
        </Button>
        
        <Button 
          className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold py-6"
          onClick={() => setShowActivitiesSheet(true)}
        >
          Check All Activities Index
        </Button>
      </div>
      
      {/* Get Accreditation Now button */}
      <Button 
        className="w-full bg-green-600 hover:bg-green-700 text-xl font-bold py-8"
        onClick={handleGetAccreditation}
      >
        Get Accreditation<br/>Now!
      </Button>
      
      {/* Success message */}
      {isAccredited && (
        <div className="p-4 bg-green-50 border-2 border-green-600 rounded-lg">
          <p className="text-sm text-center leading-relaxed font-semibold text-green-800">
            ✓ Accreditation Successful! Check your email for your accreditation number.
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
    </div>
  );
};
