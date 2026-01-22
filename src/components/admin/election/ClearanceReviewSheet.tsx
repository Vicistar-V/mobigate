import { useState } from "react";
import { X, CheckCircle, XCircle, Clock, AlertCircle, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AdminClearanceRequest, ClearanceDocument } from "@/data/adminElectionData";
import { format } from "date-fns";

interface ClearanceReviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: AdminClearanceRequest | null;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onRequestMoreInfo: (id: string, notes: string) => void;
}

const getDocStatusIcon = (status: ClearanceDocument['status']) => {
  switch (status) {
    case 'verified':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'submitted':
      return <Clock className="h-4 w-4 text-amber-600" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'missing':
      return <AlertCircle className="h-4 w-4 text-gray-400" />;
    default:
      return null;
  }
};

const getDocStatusText = (status: ClearanceDocument['status']) => {
  switch (status) {
    case 'verified':
      return 'Verified';
    case 'submitted':
      return 'Pending Review';
    case 'rejected':
      return 'Rejected';
    case 'missing':
      return 'Not Submitted';
    default:
      return status;
  }
};

export function ClearanceReviewSheet({
  open,
  onOpenChange,
  request,
  onApprove,
  onReject,
  onRequestMoreInfo
}: ClearanceReviewSheetProps) {
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [sendNotification, setSendNotification] = useState(true);
  const [activeAction, setActiveAction] = useState<'approve' | 'reject' | 'more_info' | null>(null);

  if (!request) return null;

  const allDocumentsVerified = request.documents.every(doc => doc.status === 'verified');
  const hasMissingDocs = request.documents.some(doc => doc.status === 'missing');

  const handleAction = () => {
    if (activeAction === 'approve') {
      onApprove(request.id);
    } else if (activeAction === 'reject') {
      onReject(request.id, rejectionReason);
    } else if (activeAction === 'more_info') {
      onRequestMoreInfo(request.id, notes);
    }
    setNotes("");
    setRejectionReason("");
    setActiveAction(null);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Clearance Review</SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {/* Candidate Info */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Avatar className="h-14 w-14">
                <AvatarImage src={request.candidateAvatar} alt={request.candidateName} />
                <AvatarFallback>{request.candidateName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{request.candidateName}</h3>
                <p className="text-sm text-muted-foreground">Seeking: {request.office}</p>
                <p className="text-xs text-muted-foreground">
                  Submitted: {format(request.submittedAt, "MMM d, yyyy")}
                </p>
              </div>
            </div>

            {/* Documents */}
            <Accordion type="single" collapsible className="w-full">
              {request.documents.map((doc, index) => (
                <AccordionItem key={index} value={`doc-${index}`}>
                  <AccordionTrigger className="py-3">
                    <div className="flex items-center gap-2">
                      {getDocStatusIcon(doc.status)}
                      <span className="text-sm">{doc.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`ml-auto text-[10px] ${
                          doc.status === 'verified' ? 'border-green-500 text-green-600' :
                          doc.status === 'submitted' ? 'border-amber-500 text-amber-600' :
                          doc.status === 'rejected' ? 'border-red-500 text-red-600' :
                          'border-gray-300 text-gray-500'
                        }`}
                      >
                        {getDocStatusText(doc.status)}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-3 bg-muted rounded-lg space-y-2">
                      {doc.submittedAt && (
                        <p className="text-xs text-muted-foreground">
                          Submitted: {format(doc.submittedAt, "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      )}
                      {doc.status !== 'missing' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            View Document
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      )}
                      {doc.status === 'missing' && (
                        <p className="text-xs text-muted-foreground italic">
                          This document has not been submitted yet
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Decision Actions */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Decision</Label>
              
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={activeAction === 'approve' ? 'default' : 'outline'}
                  className={`h-auto flex-col py-3 ${activeAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => setActiveAction('approve')}
                  disabled={hasMissingDocs}
                >
                  <CheckCircle className="h-5 w-5 mb-1" />
                  <span className="text-xs">Approve</span>
                </Button>
                <Button
                  variant={activeAction === 'reject' ? 'default' : 'outline'}
                  className={`h-auto flex-col py-3 ${activeAction === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                  onClick={() => setActiveAction('reject')}
                >
                  <XCircle className="h-5 w-5 mb-1" />
                  <span className="text-xs">Reject</span>
                </Button>
                <Button
                  variant={activeAction === 'more_info' ? 'default' : 'outline'}
                  className={`h-auto flex-col py-3 ${activeAction === 'more_info' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  onClick={() => setActiveAction('more_info')}
                >
                  <AlertCircle className="h-5 w-5 mb-1" />
                  <span className="text-xs">More Info</span>
                </Button>
              </div>

              {hasMissingDocs && (
                <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-2 rounded">
                  ⚠️ Some documents are missing. Please request more information or reject.
                </p>
              )}
            </div>

            {/* Rejection Reason */}
            {activeAction === 'reject' && (
              <div className="space-y-2">
                <Label htmlFor="rejection">Rejection Reason *</Label>
                <Textarea
                  id="rejection"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why the clearance is being rejected..."
                  rows={3}
                />
              </div>
            )}

            {/* Request More Info Notes */}
            {activeAction === 'more_info' && (
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Information Needed *</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specify what additional documents or information is required..."
                  rows={3}
                />
              </div>
            )}

            {/* Notification Toggle */}
            {activeAction && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Send Notification</p>
                  <p className="text-xs text-muted-foreground">Notify the candidate of this decision</p>
                </div>
                <Switch
                  checked={sendNotification}
                  onCheckedChange={setSendNotification}
                />
              </div>
            )}
          </div>
        </ScrollArea>

        <SheetFooter className="p-4 border-t gap-2">
          <Button
            onClick={handleAction}
            disabled={
              !activeAction ||
              (activeAction === 'reject' && !rejectionReason) ||
              (activeAction === 'more_info' && !notes)
            }
            className={
              activeAction === 'approve' ? 'bg-green-600 hover:bg-green-700' :
              activeAction === 'reject' ? 'bg-red-600 hover:bg-red-700' :
              activeAction === 'more_info' ? 'bg-blue-600 hover:bg-blue-700' :
              ''
            }
          >
            {activeAction === 'approve' ? 'Approve Clearance' :
             activeAction === 'reject' ? 'Reject Clearance' :
             activeAction === 'more_info' ? 'Request More Information' :
             'Select an Action'}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
