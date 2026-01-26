import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Crown,
  Calendar,
  CheckCircle,
  Star,
  Info
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
  autoQualified?: boolean;
}

interface OfficePrimaryData {
  officeId: string;
  officeName: string;
  totalCandidates: number;
  primaryThreshold: number;
  advancementSlots: number;
  advancementMinimum: number;
  autoQualifyThreshold: number;
  requiresPrimary: boolean;
  primaryStatus: 'not_required' | 'pending' | 'scheduled' | 'ongoing' | 'completed';
  primaryDate?: Date;
  candidates: PrimaryCandidate[];
}

const mockPrimaryData: OfficePrimaryData[] = [
  {
    officeId: "president",
    officeName: "President General",
    totalCandidates: 25,
    primaryThreshold: 20,
    advancementSlots: 4,
    advancementMinimum: 2,
    autoQualifyThreshold: 25,
    requiresPrimary: true,
    primaryStatus: 'completed',
    primaryDate: new Date("2025-03-15"),
    candidates: [
      { id: "c1", name: "Chief Adebayo Okonkwo", avatar: "https://randomuser.me/api/portraits/men/32.jpg", declarationDate: new Date("2025-01-10"), nominationFee: 50000, votes: 342, percentage: 38.2, isAdvancing: true, campaignActive: true, autoQualified: true },
      { id: "c2", name: "Barr. Samuel Okoro", avatar: "https://randomuser.me/api/portraits/men/45.jpg", declarationDate: new Date("2025-01-11"), nominationFee: 50000, votes: 287, percentage: 32.1, isAdvancing: true, campaignActive: true, autoQualified: true },
      { id: "c3", name: "Dr. Chukwuemeka Nwosu", avatar: "https://randomuser.me/api/portraits/men/52.jpg", declarationDate: new Date("2025-01-12"), nominationFee: 50000, votes: 156, percentage: 17.4, isAdvancing: false, campaignActive: true, autoQualified: false },
      { id: "c4", name: "Chief Mrs. Adaeze Obi", avatar: "https://randomuser.me/api/portraits/women/44.jpg", declarationDate: new Date("2025-01-13"), nominationFee: 50000, votes: 78, percentage: 8.7, isAdvancing: false, campaignActive: true, autoQualified: false },
      { id: "c5", name: "Engr. Victor Eze", avatar: "https://randomuser.me/api/portraits/men/67.jpg", declarationDate: new Date("2025-01-14"), nominationFee: 50000, votes: 32, percentage: 3.6, isAdvancing: false, campaignActive: false, autoQualified: false },
    ]
  },
  {
    officeId: "secretary",
    officeName: "Secretary General",
    totalCandidates: 22,
    primaryThreshold: 20,
    advancementSlots: 4,
    advancementMinimum: 2,
    autoQualifyThreshold: 25,
    requiresPrimary: true,
    primaryStatus: 'pending',
    candidates: [
      { id: "s1", name: "Mrs. Ngozi Ibe", avatar: "https://randomuser.me/api/portraits/women/28.jpg", declarationDate: new Date("2025-01-15"), nominationFee: 30000, votes: 0, percentage: 0, isAdvancing: false, campaignActive: true, autoQualified: false },
      { id: "s2", name: "Dr. Emeka Okafor", avatar: "https://randomuser.me/api/portraits/men/38.jpg", declarationDate: new Date("2025-01-16"), nominationFee: 30000, votes: 0, percentage: 0, isAdvancing: false, campaignActive: true, autoQualified: false },
    ]
  },
  {
    officeId: "treasurer",
    officeName: "Treasurer",
    totalCandidates: 8,
    primaryThreshold: 20,
    advancementSlots: 4,
    advancementMinimum: 2,
    autoQualifyThreshold: 25,
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
    advancementMinimum: 2,
    autoQualifyThreshold: 25,
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

  const autoQualifiedIds = useMemo(() => {
    if (!selectedOffice) return new Set<string>();
    return new Set(
      selectedOffice.candidates
        .filter(c => c.percentage >= selectedOffice.autoQualifyThreshold)
        .map(c => c.id)
    );
  }, [selectedOffice]);

  const handleSelectOffice = (office: OfficePrimaryData) => {
    setSelectedOffice(office);
    const autoQualified = office.candidates
      .filter(c => c.percentage >= office.autoQualifyThreshold)
      .map(c => c.id);
    setSelectedFinalists(autoQualified.slice(0, office.advancementSlots));
  };

  const handleSelectFinalist = (candidateId: string) => {
    const isAutoQualified = autoQualifiedIds.has(candidateId);
    
    setSelectedFinalists(prev => {
      if (prev.includes(candidateId)) {
        if (isAutoQualified) {
          toast({
            title: "Cannot Deselect",
            description: "Auto-qualified candidates (≥25%) cannot be deselected.",
            variant: "destructive"
          });
          return prev;
        }
        return prev.filter(id => id !== candidateId);
      }
      if (prev.length >= (selectedOffice?.advancementSlots || 4)) {
        toast({
          title: "Maximum Finalists Selected",
          description: `You can only select up to ${selectedOffice?.advancementSlots || 4} finalists.`,
          variant: "destructive"
        });
        return prev;
      }
      return [...prev, candidateId];
    });
  };

  const handleConfirmFinalists = () => {
    const minRequired = selectedOffice?.advancementMinimum || 2;
    if (selectedFinalists.length < minRequired) {
      toast({
        title: "Minimum Not Met",
        description: `At least ${minRequired} candidates must advance.`,
        variant: "destructive"
      });
      return;
    }
    
    const autoCount = selectedFinalists.filter(id => autoQualifiedIds.has(id)).length;
    const manualCount = selectedFinalists.length - autoCount;
    
    toast({
      title: "Finalists Confirmed!",
      description: `${selectedFinalists.length} advancing (${autoCount} auto, ${manualCount} manual).`
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

      <Card className="bg-amber-500/5 border-amber-500/20">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Primary Advancement Rules</p>
              <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                <li className="flex items-center gap-1.5">
                  <Star className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                  <span>Candidates with <strong>≥25%</strong> votes auto-qualify</span>
                </li>
                <li>• Maximum <strong>4</strong> candidates advance to Main</li>
                <li>• Minimum <strong>2</strong> candidates required</li>
                <li>• Top vote-getters fill remaining slots if needed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

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

                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                    25%+ = Auto
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-amber-500" />
                    Max {office.advancementSlots}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Min {office.advancementMinimum}
                  </span>
                </div>

                {office.primaryDate && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
                    <Calendar className="h-3 w-3" />
                    {office.primaryStatus === 'completed' ? 'Completed' : 'Scheduled'}: {format(office.primaryDate, "MMM d, yyyy")}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-9 text-xs"
                    onClick={() => handleSelectOffice(office)}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    {office.primaryStatus === 'completed' ? 'View Results' : 'View Candidates'}
                  </Button>
                  {office.primaryStatus === 'pending' && (
                    <Button 
                      size="sm" 
                      className="flex-1 h-9 text-xs"
                      onClick={() => {
                        toast({
                          title: "Primary Election Scheduled",
                          description: `Primary for ${office.officeName} has been scheduled.`
                        });
                      }}
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
              {selectedOffice.primaryStatus === 'completed' 
                ? `${selectedOffice.candidates.filter(c => c.isAdvancing).length} candidates advanced`
                : `${selectedOffice.totalCandidates} candidates • Select finalists`
              }
            </p>
            <Progress 
              value={(selectedFinalists.length / selectedOffice.advancementSlots) * 100} 
              className="h-2 mt-2" 
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{selectedFinalists.length}/{selectedOffice.advancementSlots} finalists</span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                {autoQualifiedIds.size} auto-qualified
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
          <Info className="h-3 w-3 shrink-0" />
          <span>Candidates with ≥25% are auto-selected and cannot be deselected.</span>
        </div>

        <div className="space-y-2">
          {selectedOffice.candidates
            .sort((a, b) => b.percentage - a.percentage)
            .map((candidate) => {
              const isSelected = selectedFinalists.includes(candidate.id);
              const isAutoQualified = candidate.percentage >= selectedOffice.autoQualifyThreshold;
              
              return (
                <Card 
                  key={candidate.id} 
                  className={`cursor-pointer transition-all ${
                    isAutoQualified 
                      ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20' 
                      : isSelected 
                      ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                      : ''
                  }`}
                  onClick={() => handleSelectFinalist(candidate.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={isSelected}
                        disabled={isAutoQualified}
                        onCheckedChange={() => handleSelectFinalist(candidate.id)}
                      />
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={candidate.avatar} alt={candidate.name} />
                        <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{candidate.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          {selectedOffice.primaryStatus === 'completed' ? (
                            <>
                              <span className="font-bold text-foreground">{candidate.percentage}%</span>
                              <span>({candidate.votes} votes)</span>
                            </>
                          ) : (
                            <>
                              <span>{formatMobiAmount(candidate.nominationFee)}</span>
                              <span className="text-muted-foreground/60">(≈ {formatLocalAmount(candidate.nominationFee, "NGN")})</span>
                            </>
                          )}
                        </div>
                      </div>
                      {isAutoQualified ? (
                        <Badge className="text-[10px] bg-emerald-500 text-white shrink-0">
                          <Star className="h-2.5 w-2.5 mr-0.5 fill-white" />
                          25%+
                        </Badge>
                      ) : isSelected ? (
                        <Badge className="text-[10px] bg-amber-500 text-white shrink-0">
                          <Trophy className="h-2.5 w-2.5 mr-0.5" />
                          Selected
                        </Badge>
                      ) : candidate.campaignActive ? (
                        <Badge className="text-xs bg-muted text-muted-foreground shrink-0">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs shrink-0">
                          No Campaign
                        </Badge>
                      )}
                    </div>
                    
                    {selectedOffice.primaryStatus === 'completed' && (
                      <div className="mt-2 ml-14">
                        <div className="relative">
                          <Progress 
                            value={candidate.percentage} 
                            className={`h-1.5 ${isAutoQualified ? '[&>div]:bg-emerald-500' : isSelected ? '[&>div]:bg-amber-500' : ''}`}
                          />
                          <div 
                            className="absolute top-0 bottom-0 w-px bg-red-500/60"
                            style={{ left: '25%' }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </div>

        {selectedFinalists.length >= (selectedOffice?.advancementMinimum || 2) && (
          <Button 
            className="w-full h-11"
            onClick={handleConfirmFinalists}
          >
            <Crown className="h-4 w-4 mr-2" />
            Confirm {selectedFinalists.length} Finalist{selectedFinalists.length !== 1 ? 's' : ''}
            <span className="text-xs ml-1 opacity-80">
              ({autoQualifiedIds.size} auto + {selectedFinalists.length - autoQualifiedIds.size} manual)
            </span>
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
