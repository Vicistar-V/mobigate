import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Image, 
  FileImage, 
  FileType, 
  Download, 
  Check,
  File 
} from "lucide-react";
import { cn } from "@/lib/utils";

export type DownloadFormat = "pdf" | "jpeg" | "png" | "svg" | "txt" | "docx" | "csv";

interface FormatOption {
  id: DownloadFormat;
  name: string;
  description: string;
  icon: React.ReactNode;
  extension: string;
  recommended?: boolean;
}

const formatOptions: FormatOption[] = [
  {
    id: "pdf",
    name: "PDF Document",
    description: "Best for printing and sharing",
    icon: <FileText className="h-5 w-5" />,
    extension: ".pdf",
    recommended: true,
  },
  {
    id: "jpeg",
    name: "JPEG Image",
    description: "Compressed image format",
    icon: <Image className="h-5 w-5" />,
    extension: ".jpg",
  },
  {
    id: "png",
    name: "PNG Image",
    description: "High quality with transparency",
    icon: <FileImage className="h-5 w-5" />,
    extension: ".png",
  },
  {
    id: "svg",
    name: "SVG Vector",
    description: "Scalable vector graphics",
    icon: <FileType className="h-5 w-5" />,
    extension: ".svg",
  },
  {
    id: "txt",
    name: "Text Document",
    description: "Plain text format",
    icon: <FileText className="h-5 w-5" />,
    extension: ".txt",
  },
  {
    id: "docx",
    name: "Word Document",
    description: "Microsoft Word format",
    icon: <File className="h-5 w-5" />,
    extension: ".docx",
  },
  {
    id: "csv",
    name: "CSV Spreadsheet",
    description: "For data and tables",
    icon: <FileText className="h-5 w-5" />,
    extension: ".csv",
  },
];

interface DownloadFormatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (format: DownloadFormat) => void;
  title?: string;
  documentName?: string;
  availableFormats?: DownloadFormat[];
  isDownloading?: boolean;
}

export function DownloadFormatSheet({
  open,
  onOpenChange,
  onDownload,
  title = "Download Document",
  documentName,
  availableFormats = ["pdf", "jpeg", "png", "svg", "txt"],
  isDownloading = false,
}: DownloadFormatSheetProps) {
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat | null>(null);

  const filteredFormats = formatOptions.filter((f) =>
    availableFormats.includes(f.id)
  );

  const handleDownload = () => {
    if (selectedFormat) {
      onDownload(selectedFormat);
    }
  };

  const handleFormatSelect = (formatId: DownloadFormat) => {
    setSelectedFormat(formatId);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="pb-2 border-b">
          <DrawerTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            {title}
          </DrawerTitle>
          {documentName && (
            <DrawerDescription className="text-xs truncate">
              {documentName}
            </DrawerDescription>
          )}
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-y-auto touch-auto">
          <div className="p-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Select your preferred file format:
            </p>

            <div className="space-y-2">
              {filteredFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => handleFormatSelect(format.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                    "active:scale-[0.98] touch-manipulation",
                    selectedFormat === format.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      selectedFormat === format.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {format.icon}
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{format.name}</span>
                      {format.recommended && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 h-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        >
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format.description}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {selectedFormat === format.id ? (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Fixed Footer */}
        <div className="p-4 border-t bg-background sticky bottom-0">
          <Button
            onClick={handleDownload}
            disabled={!selectedFormat || isDownloading}
            className="w-full gap-2"
            size="lg"
          >
            {isDownloading ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                {selectedFormat
                  ? `Download as ${formatOptions.find((f) => f.id === selectedFormat)?.extension.toUpperCase()}`
                  : "Select Format"}
              </>
            )}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
