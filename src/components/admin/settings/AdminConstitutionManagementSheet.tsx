import { useState, useRef } from "react";
import {
  FileText,
  Upload,
  Download,
  Eye,
  Edit3,
  EyeOff,
  Trash2,
  Shield,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  File,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ModuleAuthorizationDrawer } from "@/components/admin/authorization/ModuleAuthorizationDrawer";
import { getActionConfig, renderActionDetails } from "@/components/admin/authorization/authorizationActionConfigs";
import { DownloadFormatSheet, DownloadFormat } from "@/components/common/DownloadFormatSheet";
import { ConstitutionViewer } from "@/components/community/ConstitutionViewer";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Constitution action types
type ConstitutionActionType =
  | "upload_constitution"
  | "update_constitution"
  | "delete_constitution"
  | "deactivate_constitution";

interface ConstitutionDocument {
  id: string;
  title: string;
  version: string;
  effectiveDate: Date;
  fileSize: string;
  fileType: string;
  status: "active" | "hidden" | "archived";
  uploadedBy: string;
  uploadedAt: Date;
  changelog?: string;
}

// Mock constitution documents
const mockDocuments: ConstitutionDocument[] = [
  {
    id: "const-1",
    title: "Community Constitution v2.1",
    version: "2.1",
    effectiveDate: new Date("2024-07-01"),
    fileSize: "2.4 MB",
    fileType: "PDF",
    status: "active",
    uploadedBy: "Chief Emeka Obi",
    uploadedAt: new Date("2024-06-15"),
    changelog: "Updated Article 5 on membership eligibility and Article 8 on financial obligations",
  },
  {
    id: "const-2",
    title: "Community Constitution v2.0",
    version: "2.0",
    effectiveDate: new Date("2023-01-15"),
    fileSize: "2.1 MB",
    fileType: "PDF",
    status: "archived",
    uploadedBy: "Barr. Ngozi Okonkwo",
    uploadedAt: new Date("2023-01-10"),
    changelog: "Major revision including new governance structure",
  },
  {
    id: "const-3",
    title: "Community Constitution v1.0",
    version: "1.0",
    effectiveDate: new Date("2020-03-01"),
    fileSize: "1.8 MB",
    fileType: "PDF",
    status: "archived",
    uploadedBy: "Chief Emeka Obi",
    uploadedAt: new Date("2020-02-20"),
  },
];

interface AdminConstitutionManagementSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminConstitutionManagementSheet({
  open,
  onOpenChange,
}: AdminConstitutionManagementSheetProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Document state
  const [documents] = useState<ConstitutionDocument[]>(mockDocuments);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Upload form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadVersion, setUploadVersion] = useState("");
  const [uploadEffectiveDate, setUploadEffectiveDate] = useState("");
  const [uploadChangelog, setUploadChangelog] = useState("");

  // Authorization state
  const [authDrawerOpen, setAuthDrawerOpen] = useState(false);
  const [authAction, setAuthAction] = useState<{
    type: ConstitutionActionType;
    details: string;
    documentId?: string;
  } | null>(null);

  // Download state
  const [showDownloadSheet, setShowDownloadSheet] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadDocName, setDownloadDocName] = useState("");

  // Viewer state
  const [showViewer, setShowViewer] = useState(false);

  // Stats
  const activeCount = documents.filter((d) => d.status === "active").length;
  const archivedCount = documents.filter((d) => d.status === "archived").length;
  const hiddenCount = documents.filter((d) => d.status === "hidden").length;

  // Authorization handlers
  const handleUploadWithAuth = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a document to upload",
        variant: "destructive",
      });
      return;
    }
    setAuthAction({
      type: "upload_constitution",
      details: `Upload ${selectedFile.name} (v${uploadVersion || "N/A"})`,
    });
    setAuthDrawerOpen(true);
  };

  const handleModifyWithAuth = (doc: ConstitutionDocument) => {
    setAuthAction({
      type: "update_constitution",
      details: doc.title,
      documentId: doc.id,
    });
    setAuthDrawerOpen(true);
  };

  const handleDeactivateWithAuth = (doc: ConstitutionDocument) => {
    setAuthAction({
      type: "deactivate_constitution",
      details: doc.title,
      documentId: doc.id,
    });
    setAuthDrawerOpen(true);
  };

  const handleDeleteWithAuth = (doc: ConstitutionDocument) => {
    setAuthAction({
      type: "delete_constitution",
      details: doc.title,
      documentId: doc.id,
    });
    setAuthDrawerOpen(true);
  };

  const handleAuthorizationComplete = () => {
    if (authAction) {
      const config = getActionConfig("settings", authAction.type);
      const actionMessages: Record<ConstitutionActionType, string> = {
        upload_constitution: "Document uploaded successfully",
        update_constitution: "Document updated successfully",
        delete_constitution: "Document deleted successfully",
        deactivate_constitution: "Document deactivated successfully",
      };
      toast({
        title: config?.title || "Action Authorized",
        description: actionMessages[authAction.type],
      });

      if (authAction.type === "upload_constitution") {
        setShowUploadForm(false);
        setSelectedFile(null);
        setUploadVersion("");
        setUploadEffectiveDate("");
        setUploadChangelog("");
      }
    }
    setAuthAction(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDownload = (doc: ConstitutionDocument) => {
    setDownloadDocName(doc.title);
    setShowDownloadSheet(true);
  };

  const handleDownloadFormat = (format: DownloadFormat) => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setShowDownloadSheet(false);
      toast({
        title: "Download Complete",
        description: `${downloadDocName} downloaded as ${format.toUpperCase()}`,
      });
    }, 1500);
  };

  // Get action config for authorization
  const actionConfig = authAction
    ? getActionConfig("settings", authAction.type)
    : null;

  const getAuthActionDetails = () => {
    if (!authAction || !actionConfig) return null;
    return renderActionDetails({
      config: actionConfig,
      primaryText: authAction.details,
      secondaryText: "Constitution Management",
      module: "settings",
    });
  };

  const getStatusBadge = (status: ConstitutionDocument["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-600 text-white text-xs">Active</Badge>
        );
      case "hidden":
        return (
          <Badge className="bg-amber-500 text-white text-xs">Hidden</Badge>
        );
      case "archived":
        return (
          <Badge variant="secondary" className="text-xs">
            Archived
          </Badge>
        );
    }
  };

  const activeDoc = documents.find((d) => d.status === "active");
  const historyDocs = documents.filter((d) => d.status !== "active");

  return (
    <>
      {/* Authorization Drawer */}
      <ModuleAuthorizationDrawer
        open={authDrawerOpen}
        onOpenChange={setAuthDrawerOpen}
        module="settings"
        actionTitle={actionConfig?.title || "Constitution Action"}
        actionDescription={
          actionConfig?.description ||
          "Multi-signature authorization required for constitution management"
        }
        actionDetails={getAuthActionDetails()}
        initiatorRole="secretary"
        onAuthorized={handleAuthorizationComplete}
      />

      {/* Download Format Sheet */}
      <DownloadFormatSheet
        open={showDownloadSheet}
        onOpenChange={setShowDownloadSheet}
        onDownload={handleDownloadFormat}
        title="Download Constitution"
        documentName={downloadDocName}
        availableFormats={["pdf", "docx", "txt"]}
        isDownloading={isDownloading}
      />

      {/* Constitution Viewer */}
      <ConstitutionViewer
        open={showViewer}
        onOpenChange={setShowViewer}
      />

      {/* Main Sheet */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="h-[92vh] rounded-t-2xl p-0 flex flex-col"
        >
          <SheetHeader className="px-4 pt-4 pb-3 border-b shrink-0">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Constitution Management
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 h-[calc(92vh-60px)] overflow-y-auto touch-auto">
            <div className="px-4 py-4 pb-6 space-y-4">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2">
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold text-green-600">
                      {activeCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Active</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold text-muted-foreground">
                      {archivedCount}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Archived
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold">
                      {documents.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </CardContent>
                </Card>
              </div>

              {/* Upload New Document Button */}
              <Button
                className="w-full h-12 font-semibold text-base touch-manipulation active:bg-primary/80"
                onClick={() => setShowUploadForm(!showUploadForm)}
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload New Document
              </Button>

              {/* Upload Form */}
              {showUploadForm && (
                <Card className="border-2 border-primary/30">
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Constitution Document
                    </h3>

                    {/* File Drop Zone */}
                    <div
                      className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 active:bg-muted/50 touch-manipulation transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      {selectedFile ? (
                        <div className="space-y-2">
                          <File className="h-8 w-8 mx-auto text-primary" />
                          <p className="font-medium text-sm">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="touch-manipulation"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                            }}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="text-sm font-medium">
                            Tap to select file
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF or DOCX format
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Version Number */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">
                        Version Number
                      </Label>
                      <Input
                        placeholder="e.g. 3.0"
                        value={uploadVersion}
                        onChange={(e) => setUploadVersion(e.target.value)}
                        className="h-11 touch-manipulation"
                        autoComplete="off"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Effective Date */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">
                        Effective Date
                      </Label>
                      <Input
                        type="date"
                        value={uploadEffectiveDate}
                        onChange={(e) =>
                          setUploadEffectiveDate(e.target.value)
                        }
                        className="h-11 touch-manipulation"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Changelog */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">
                        Notes / Changelog
                      </Label>
                      <Textarea
                        placeholder="Describe the changes in this version..."
                        value={uploadChangelog}
                        onChange={(e) => setUploadChangelog(e.target.value)}
                        className="min-h-[80px] touch-manipulation"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Submit */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 h-11 touch-manipulation active:bg-muted/70"
                        onClick={() => {
                          setShowUploadForm(false);
                          setSelectedFile(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 h-11 touch-manipulation active:bg-primary/80"
                        onClick={handleUploadWithAuth}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Submit for Authorization
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Active Document */}
              {activeDoc && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground px-1">
                    Active Document
                  </h3>
                  <Card className="border-2 border-green-200 dark:border-green-800">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm leading-tight">
                            {activeDoc.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Version {activeDoc.version} •{" "}
                            {activeDoc.fileSize} {activeDoc.fileType}
                          </p>
                        </div>
                        {getStatusBadge(activeDoc.status)}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          Effective:{" "}
                          {format(activeDoc.effectiveDate, "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          Uploaded:{" "}
                          {format(activeDoc.uploadedAt, "MMM d, yyyy")} by{" "}
                          {activeDoc.uploadedBy}
                        </div>
                      </div>

                      {activeDoc.changelog && (
                        <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5 leading-relaxed">
                          {activeDoc.changelog}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex flex-col gap-0 divide-y divide-border pt-2 border-t">
                        <button
                          className="flex items-center gap-3 py-3 text-sm hover:bg-muted/50 active:bg-muted/70 -mx-1 px-1 rounded touch-manipulation"
                          onClick={() => setShowViewer(true)}
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          View Document
                        </button>
                        <button
                          className="flex items-center gap-3 py-3 text-sm hover:bg-muted/50 active:bg-muted/70 -mx-1 px-1 rounded touch-manipulation"
                          onClick={() => handleDownload(activeDoc)}
                        >
                          <Download className="h-4 w-4 text-muted-foreground" />
                          Download
                        </button>
                        <button
                          className="flex items-center gap-3 py-3 text-sm hover:bg-muted/50 active:bg-muted/70 -mx-1 px-1 rounded touch-manipulation"
                          onClick={() => handleModifyWithAuth(activeDoc)}
                        >
                          <Edit3 className="h-4 w-4 text-muted-foreground" />
                          Modify Document
                        </button>
                        <button
                          className="flex items-center gap-3 py-3 text-sm text-amber-600 hover:bg-muted/50 active:bg-muted/70 -mx-1 px-1 rounded touch-manipulation"
                          onClick={() =>
                            handleDeactivateWithAuth(activeDoc)
                          }
                        >
                          <EyeOff className="h-4 w-4" />
                          Deactivate / Hide
                        </button>
                        <button
                          className="flex items-center gap-3 py-3 text-sm text-destructive hover:bg-muted/50 active:bg-muted/70 -mx-1 px-1 rounded touch-manipulation"
                          onClick={() => handleDeleteWithAuth(activeDoc)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Document
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Document History */}
              {historyDocs.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground px-1">
                    Document History
                  </h3>
                  {historyDocs.map((doc) => (
                    <Card key={doc.id}>
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm leading-tight">
                              {doc.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {doc.fileSize} {doc.fileType} • Effective{" "}
                              {format(doc.effectiveDate, "MMM d, yyyy")}
                            </p>
                          </div>
                          {getStatusBadge(doc.status)}
                        </div>

                        {doc.changelog && (
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {doc.changelog}
                          </p>
                        )}

                        <div className="flex gap-2 pt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-10 touch-manipulation active:bg-muted/70"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="h-3.5 w-3.5 mr-1.5" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 px-3 text-destructive border-destructive/30 hover:bg-destructive/10 touch-manipulation active:bg-destructive/20"
                            onClick={() => handleDeleteWithAuth(doc)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Authorization Info */}
              <div className="space-y-1.5 pt-2 border-t border-border/50">
                <div className="flex items-start gap-2">
                  <Shield className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-xs text-muted-foreground leading-snug">
                    Constitution changes require President + Secretary + Legal
                    Adviser
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <span className="text-xs text-amber-700 dark:text-amber-300 leading-snug">
                    If any required officer is unavailable, a deputy may act
                    with 4-signatory quorum
                  </span>
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
