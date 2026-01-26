import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, 
  Vote, 
  Trophy, 
  AlertTriangle, 
  ChevronRight,
  Crown,
  Calendar,
  Clock,
  CheckCircle,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatMobiAmount, formatLocalAmount } from "@/lib/mobiCurrencyTranslation";

interface PrimaryCandidate {
  id: string;
  name: string;
  avatar?: string;
  declarationDate: Date;
  nominationFee: number;
  votes: number;
  percentage: number;
  isAdvancing: boolean;
  campaignActive: boolean;
}

interface OfficePrimaryData {
  officeId: string;
  officeName: string;
  totalCandidates: number;
  primaryThreshold: number; // Default: 20
  advancementSlots: number; // Default: 4
  requiresPrimary: boolean;
  primaryStatus: 'not_required' | 'pending' | 'scheduled' | 'ongoing' | 'completed';
  primaryDate?: Date;
  candidates: PrimaryCandidate[];
}

// Mock data for primary election management
const mockPrimaryData: OfficePrimaryData[] = [
  {
    officeId: "president",
    officeName: "President General",
    totalCandidates: 25,
    primaryThreshold: 20,
    advancementSlots: 4,
    requiresPrimary: true,
    primaryStatus: 'scheduled',
    primaryDate: new Date("2025-03-15"),
    candidates: [
      { id: "c1", name: "Chief Adebayo Okonkwo", avatar: "https://randomuser.me/api/portraits/men/32.jpg", declarationDate: new Date("2025-01-10"), nominationFee: 50000, votes: 0, percentage: 0, isAdvancing: false, campaignActive: true },
      { id: "c2", name: "Barr. Samuel Okoro", avatar: "https://randomuser.me/api/portraits/men/45.jpg", declarationDate: new Date("2025-01-11"), nominationFee: 50000, votes: 0, percentage: 0, isAdvancing: false, campaignActive: true },
      { id: "c3", name: "Dr. Chukwuemeka Nwosu", avatar: "https://randomuser.me/api/portraits/men/52.jpg", declarationDate: new Date("2025-01-12"), nominationFee: 50000, votes: 0, percentage: 0, isAdvancing: false, campaignActive: true },
      { id: "c4", name: "Chief Mrs. Adaeze Obi", avatar: "https://randomuser.me/api/portraits/women/44.jpg", declarationDate: new Date("2025-01-13"), nominationFee: 50000, votes: 0, percentage: 0, isAdvancing: false, campaignActive: true },
      { id: "c5", name: "Engr. Victor Eze", avatar: "https://randomuser.me/api/portraits/men/67.jpg", declarationDate: new Date("2025-01-14"), nominationFee: 50000, votes: 0, percentage: 0, isAdvancing: false, campaignActive: false },
    ]
  },
  {
    officeId: "secretary",
    officeName: "Secretary General",
    totalCandidates: 22,
    primaryThreshold: 20,
    advancementSlots: 4,
    requiresPrimary: true,
    primaryStatus: 'pending',
    candidates: [
      { id: "s1", name: "Mrs. Ngozi Ibe", avatar: "https://randomuser.me/api/portraits/women/28.jpg", declarationDate: new Date("2025-01-15"), nominationFee: 30000, votes: 0, percentage: 0, isAdvancing: false, campaignActive: true },
      { id: "s2", name: "Dr. Emeka Okafor", avatar: "https://randomuser.me/api/portraits/men/38.jpg", declarationDate: new Date("2025-01-16"), nominationFee: 30000, votes: 0, percentage: 0, isAdvancing: false, campaignActive: true },
    ]
  },
  {
    officeId: "treasurer",
    officeName: "Treasurer",
    totalCandidates: 8,
    primaryThreshold: 20,
    advancementSlots: 4,
    requiresPrimary: false,
    primaryStatus: 'not_required',
    candidates: []
  },
  {
    officeId: "pro",
    officeName: "Public Relations Officer",
    totalCandidates: 12,
    primaryThreshold: 20,
    advancementSlots: 4,
    requiresPrimary: false,
    primaryStatus: 'not_required',
    candidates: []
  }
];

interface AdminPrimaryManagementSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminPrimaryManagementSheet({
  open,
  onOpenChange
}: AdminPrimaryManagementSheetProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedOffice, setSelectedOffice] = useState<OfficePrimaryData | null>(null);
  const [selectedFinalists, setSelectedFinalists] = useState<string[]>([]);

  const officesRequiringPrimary = mockPrimaryData.filter(o => o.requiresPrimary);
  const officesNoPrimary = mockPrimaryData.filter(o => !o.requiresPrimary);

  const handleSchedulePrimary = (office: OfficePrimaryData) => {
    toast({
      title: "Primary Election Scheduled",
      description: `Primary for ${office.officeName} has been scheduled.`
    });
  };

  const handleSelectFinalist = (candidateId: string) => {
    setSelectedFinalists(prev => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      }
      if (prev.length >= 4) {
        toast({
          title: "Maximum Finalists Selected",
          description: "You can only select up to 4 finalists for the main election.",
          variant: "destructive"
        });
        return prev;
      }
      return [...prev, candidateId];
    });
  };

  const handleConfirmFinalists = () => {
    if (selectedFinalists.length < 4) {
      toast({
        title: "Select More Finalists",
        description: `Please select ${4 - selectedFinalists.length} more finalist(s).`,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Finalists Confirmed!",
      description: `${selectedFinalists.length} candidates have advanced to the main election.`
    });
    setSelectedOffice(null);
    setSelectedFinalists([]);
  };

  const getStatusColor = (status: OfficePrimaryData['primaryStatus']) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-600';
      case 'ongoing': return 'bg-blue-500/10 text-blue-600';
      case 'scheduled': return 'bg-amber-500/10 text-amber-600';
      case 'pending': return 'bg-red-500/10 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const Content = () => (
    <div className="space-y-4">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-red-500/5 border-red-500/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-lg font-bold">{officesRequiringPrimary.length}</p>
                <p className="text-xs text-muted-foreground">Requires Primary</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-lg font-bold">{officesNoPrimary.length}</p>
                <p className="text-xs text-muted-foreground">Direct to Main</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Threshold Info */}
      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <Target className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Primary Threshold: 20+ Candidates</p>
              <p className="text-xs text-muted-foreground mt-1">
                When more than 20 candidates declare for a single office, a Primary Election 
                is triggered to select the Top 4 finalists who advance to the main ballot.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Offices Requiring Primary */}
      {officesRequiringPrimary.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            Offices Requiring Primary
          </h3>
          
          {officesRequiringPrimary.map((office) => (
            <Card key={office.officeId} className="border-red-500/20">
              <CardContent className="p-3 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm">{office.officeName}</h4>
                    <p className="text-xs text-muted-foreground">
                      {office.totalCandidates} declared candidates
                    </p>
                  </div>
                  <Badge className={`text-xs shrink-0 ${getStatusColor(office.primaryStatus)}`}>
                    {office.primaryStatus.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Threshold: {office.primaryThreshold}
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    Top {office.advancementSlots} Advance
                  </span>
                </div>

                {office.primaryDate && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
                    <Calendar className="h-3 w-3" />
                    Scheduled: {format(office.primaryDate, "MMM d, yyyy")}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-9 text-xs"
                    onClick={() => setSelectedOffice(office)}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    View Candidates
                  </Button>
                  {office.primaryStatus === 'pending' && (
                    <Button 
                      size="sm" 
                      className="flex-1 h-9 text-xs"
                      onClick={() => handleSchedulePrimary(office)}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Separator />

      {/* Offices Not Requiring Primary */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          Direct to Main Election
        </h3>
        
        {officesNoPrimary.map((office) => (
          <Card key={office.officeId} className="border-green-500/20 bg-green-500/5">
            <CardContent className="p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm">{office.officeName}</h4>
                  <p className="text-xs text-muted-foreground">
                    {office.totalCandidates} candidates • Under threshold
                  </p>
                </div>
                <Badge className="text-xs bg-green-500/10 text-green-600 shrink-0">
                  No Primary
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const CandidateDetailContent = () => {
    if (!selectedOffice) return null;

    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            setSelectedOffice(null);
            setSelectedFinalists([]);
          }}
          className="mb-2"
        >
          ← Back to Overview
        </Button>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3">
            <h3 className="font-semibold">{selectedOffice.officeName}</h3>
            <p className="text-sm text-muted-foreground">
              {selectedOffice.totalCandidates} candidates declared • Select Top 4 finalists
            </p>
            <Progress 
              value={(selectedFinalists.length / 4) * 100} 
              className="h-2 mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              {selectedFinalists.length}/4 finalists selected
            </p>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {selectedOffice.candidates.map((candidate) => {
            const isSelected = selectedFinalists.includes(candidate.id);
            return (
              <Card 
                key={candidate.id} 
                className={`cursor-pointer transition-all ${
                  isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
                }`}
                onClick={() => handleSelectFinalist(candidate.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => handleSelectFinalist(candidate.id)}
                    />
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={candidate.avatar} alt={candidate.name} />
                      <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{candidate.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatMobiAmount(candidate.nominationFee)}</span>
                        <span className="text-muted-foreground/60">(≈ {formatLocalAmount(candidate.nominationFee, "NGN")})</span>
                        <span>•</span>
                        <span>{format(candidate.declarationDate, "MMM d")}</span>
                      </div>
                    </div>
                    {candidate.campaignActive ? (
                      <Badge className="text-xs bg-green-500/10 text-green-600 shrink-0">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs shrink-0">
                        No Campaign
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedFinalists.length > 0 && (
          <Button 
            className="w-full h-11"
            onClick={handleConfirmFinalists}
            disabled={selectedFinalists.length < 4}
          >
            <Crown className="h-4 w-4 mr-2" />
            Confirm {selectedFinalists.length} Finalist{selectedFinalists.length !== 1 ? 's' : ''}
          </Button>
        )}
      </div>
    );
  };

  const MainContent = selectedOffice ? CandidateDetailContent : Content;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh]">
          <DrawerHeader className="border-b pb-3">
            <DrawerTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              Primary Election Management
            </DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4 overflow-y-auto touch-auto">
            <MainContent />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader className="pb-3">
          <SheetTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5 text-primary" />
            Primary Election Management
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] pr-4">
          <MainContent />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
