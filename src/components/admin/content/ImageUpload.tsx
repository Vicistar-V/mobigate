import React, { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, FileVideo, Music, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "uploading" | "complete" | "error";
  error?: string;
}

interface ImageUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  multiple?: boolean;
  label?: string;
  helperText?: string;
  aspectRatio?: "square" | "video" | "banner" | "auto";
  mediaType?: "image" | "video" | "audio" | "any";
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ACCEPTED_AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"];

export function ImageUpload({
  value,
  onChange,
  accept,
  maxSize = 10,
  maxFiles = 1,
  multiple = false,
  label = "Upload Image",
  helperText = "PNG, JPG, GIF up to 10MB",
  aspectRatio = "auto",
  mediaType = "image"
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine accepted file types
  const getAcceptedTypes = useCallback(() => {
    if (accept) return accept;
    switch (mediaType) {
      case "image": return ACCEPTED_IMAGE_TYPES.join(",");
      case "video": return ACCEPTED_VIDEO_TYPES.join(",");
      case "audio": return ACCEPTED_AUDIO_TYPES.join(",");
      case "any": return [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES, ...ACCEPTED_AUDIO_TYPES].join(",");
      default: return ACCEPTED_IMAGE_TYPES.join(",");
    }
  }, [accept, mediaType]);

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      return `File size exceeds ${maxSize}MB limit`;
    }

    // Check file type
    const acceptedTypes = getAcceptedTypes().split(",").map(t => t.trim());
    const isValidType = acceptedTypes.some(type => {
      if (type.includes("*")) {
        const baseType = type.split("/")[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `Invalid file type. Accepted: ${mediaType === "any" ? "images, videos, audio" : mediaType}`;
    }

    return null;
  }, [maxSize, getAcceptedTypes, mediaType]);

  // Generate preview URL
  const generatePreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  // Simulate upload progress (UI template - no actual upload)
  const simulateUpload = useCallback((uploadedFile: UploadedFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, progress: 100, status: "complete" as const }
            : f
        ));
        
        // Update parent value
        const preview = uploadedFile.preview;
        if (multiple) {
          const currentValue = Array.isArray(value) ? value : value ? [value] : [];
          onChange([...currentValue, preview]);
        } else {
          onChange(preview);
        }
      } else {
        setFiles(prev => prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, progress: Math.min(progress, 95) }
            : f
        ));
      }
    }, 100);
  }, [multiple, value, onChange]);

  // Handle file selection
  const handleFiles = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    setValidationError(null);

    const fileArray = Array.from(selectedFiles);
    
    // Check max files limit
    const currentCount = files.filter(f => f.status !== "error").length;
    if (currentCount + fileArray.length > maxFiles) {
      setValidationError(`Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed`);
      return;
    }

    fileArray.forEach(file => {
      const error = validateFile(file);
      
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: generatePreview(file),
        progress: 0,
        status: error ? "error" : "uploading",
        error: error || undefined
      };

      setFiles(prev => [...prev, uploadedFile]);

      if (!error) {
        simulateUpload(uploadedFile);
      }
    });
  }, [files, maxFiles, validateFile, simulateUpload]);

  // Drag handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  // Remove file
  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
        
        // Update parent value
        if (multiple && Array.isArray(value)) {
          onChange(value.filter(v => v !== fileToRemove.preview));
        } else {
          onChange("");
        }
      }
      return prev.filter(f => f.id !== id);
    });
    setValidationError(null);
  }, [multiple, value, onChange]);

  // Get aspect ratio class
  const getAspectClass = () => {
    switch (aspectRatio) {
      case "square": return "aspect-square";
      case "video": return "aspect-video";
      case "banner": return "aspect-[3/1]";
      default: return "";
    }
  };

  // Get file type icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith("video")) return FileVideo;
    if (file.type.startsWith("audio")) return Music;
    return ImageIcon;
  };

  // Check if we have existing value(s)
  const existingPreviews = Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];
  const hasExistingValue = existingPreviews.length > 0;
  const completedFiles = files.filter(f => f.status === "complete");
  const showDropzone = !hasExistingValue && completedFiles.length === 0;

  return (
    <div className="space-y-3">
      {/* Upload Area */}
      {showDropzone && (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-xl transition-all duration-200",
            isDragging 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30",
            getAspectClass()
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 cursor-pointer">
            <div className={cn(
              "rounded-full p-3 mb-3 transition-colors",
              isDragging ? "bg-primary/20" : "bg-muted"
            )}>
              <Upload className={cn(
                "h-6 w-6 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <p className="text-sm font-medium text-foreground">
              {isDragging ? "Drop to upload" : label}
            </p>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {helperText}
            </p>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              Choose File{multiple && "s"}
            </Button>
          </div>
          
          <input
            ref={inputRef}
            type="file"
            accept={getAcceptedTypes()}
            multiple={multiple}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Validation Error */}
      {validationError && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Existing Previews (for edit mode) */}
      {hasExistingValue && completedFiles.length === 0 && (
        <div className={cn(
          "grid gap-3",
          multiple && existingPreviews.length > 1 ? "grid-cols-2" : "grid-cols-1"
        )}>
          {existingPreviews.map((preview, index) => (
            <div 
              key={index}
              className="relative group rounded-xl overflow-hidden bg-muted"
            >
              <div className={cn("w-full", getAspectClass() || "aspect-video")}>
                {preview.includes("video") ? (
                  <video 
                    src={preview} 
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => inputRef.current?.click()}
                >
                  Replace
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => {
                    if (multiple) {
                      onChange(existingPreviews.filter((_, i) => i !== index));
                    } else {
                      onChange("");
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
              
              <input
                ref={inputRef}
                type="file"
                accept={getAcceptedTypes()}
                multiple={multiple}
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress & Previews */}
      {files.length > 0 && (
        <div className={cn(
          "grid gap-3",
          multiple && files.length > 1 ? "grid-cols-2" : "grid-cols-1"
        )}>
          {files.map((uploadedFile) => {
            const FileIcon = getFileIcon(uploadedFile.file);
            const isComplete = uploadedFile.status === "complete";
            const isError = uploadedFile.status === "error";
            const isImage = uploadedFile.file.type.startsWith("image");
            const isVideo = uploadedFile.file.type.startsWith("video");
            const isAudio = uploadedFile.file.type.startsWith("audio");
            
            return (
              <div 
                key={uploadedFile.id}
                className={cn(
                  "relative rounded-xl overflow-hidden border transition-all",
                  isError ? "border-destructive bg-destructive/5" : "border-border bg-muted"
                )}
              >
                {/* Preview Area */}
                <div className={cn(
                  "relative w-full bg-muted",
                  getAspectClass() || "aspect-video"
                )}>
                  {isImage && (
                    <img 
                      src={uploadedFile.preview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  )}
                  {isVideo && (
                    <video 
                      src={uploadedFile.preview} 
                      className="w-full h-full object-cover"
                      muted
                    />
                  )}
                  {isAudio && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                      <Music className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Loading Overlay */}
                  {!isComplete && !isError && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4">
                      <Loader2 className="h-8 w-8 text-white animate-spin mb-2" />
                      <span className="text-white text-sm font-medium">
                        {Math.round(uploadedFile.progress)}%
                      </span>
                    </div>
                  )}
                  
                  {/* Error Overlay */}
                  {isError && (
                    <div className="absolute inset-0 bg-destructive/20 flex flex-col items-center justify-center p-4">
                      <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                      <span className="text-destructive text-xs text-center font-medium">
                        {uploadedFile.error}
                      </span>
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black rounded-full p-1.5 transition-colors"
                    onClick={() => removeFile(uploadedFile.id)}
                  >
                    <X className="h-3.5 w-3.5 text-white" />
                  </button>
                  
                  {/* Success Badge */}
                  {isComplete && (
                    <div className="absolute top-2 left-2 bg-green-500 rounded-full p-1">
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                
                {/* File Info */}
                <div className="p-2.5 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs font-medium truncate flex-1">
                      {uploadedFile.file.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {(uploadedFile.file.size / (1024 * 1024)).toFixed(1)}MB
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  {!isComplete && !isError && (
                    <Progress 
                      value={uploadedFile.progress} 
                      className="h-1 mt-2"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add More Button */}
      {multiple && (files.length > 0 || hasExistingValue) && files.length < maxFiles && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Add More
        </Button>
      )}
    </div>
  );
}
