import { useState } from "react";
import { X, Play, Image as ImageIcon, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface FilePreviewGridProps {
  files: File[];
  onRemove: (index: number) => void;
  maxFiles?: number;
  isMultiple?: boolean;
}

export const FilePreviewGrid = ({ files, onRemove, maxFiles = 1, isMultiple = false }: FilePreviewGridProps) => {
  const [previewFile, setPreviewFile] = useState<{ file: File; url: string } | null>(null);

  const getFileUrl = (file: File) => URL.createObjectURL(file);

  const isVideo = (file: File) => file.type.startsWith("video/");
  const isImage = (file: File) => file.type.startsWith("image/");

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <>
      <div className={`grid gap-4 ${isMultiple ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
        {files.map((file, index) => {
          const fileUrl = getFileUrl(file);
          return (
            <Card key={index} className="relative group overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center relative">
                {isImage(file) && (
                  <img
                    src={fileUrl}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {isVideo(file) && (
                  <>
                    <video
                      src={fileUrl}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </>
                )}
                {!isImage(file) && !isVideo(file) && (
                  <FileVideo className="h-12 w-12 text-muted-foreground" />
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setPreviewFile({ file, url: fileUrl })}
                  >
                    {isVideo(file) ? <Play className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* File info badge */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black/70 backdrop-blur-sm rounded px-2 py-1 text-xs text-white truncate">
                    <div className="font-medium truncate">{file.name}</div>
                    <div className="text-white/70">{formatFileSize(file.size)}</div>
                  </div>
                </div>

                {/* Position badge for multiple displays */}
                {isMultiple && (
                  <div className="absolute top-2 left-2">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}

        {/* Empty slots for multiple displays */}
        {isMultiple && files.length < maxFiles && (
          Array.from({ length: maxFiles - files.length }).map((_, index) => (
            <Card key={`empty-${index}`} className="aspect-video bg-muted/50 border-dashed flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileVideo className="h-8 w-8 mx-auto mb-2" />
                <p className="text-xs">Slot {files.length + index + 1}</p>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl">
          {previewFile && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold">{previewFile.file.name}</h3>
                <p className="text-sm text-muted-foreground">{formatFileSize(previewFile.file.size)}</p>
              </div>
              {isImage(previewFile.file) && (
                <img
                  src={previewFile.url}
                  alt={previewFile.file.name}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              )}
              {isVideo(previewFile.file) && (
                <video
                  src={previewFile.url}
                  controls
                  className="w-full h-auto max-h-[70vh]"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
