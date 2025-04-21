
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  title: string;
  description: string;
  accept: Record<string, string[]>;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  onFilesAdded: (files: File[]) => void;
}

const FileUpload = ({
  title,
  description,
  accept,
  multiple = false,
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB default
  onFilesAdded,
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      
      // Check max files
      if (multiple && maxFiles && acceptedFiles.length + files.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} files.`);
        return;
      }
      
      const newFiles = multiple 
        ? [...files, ...acceptedFiles] 
        : acceptedFiles;
        
      setFiles(newFiles);
      onFilesAdded(newFiles);
    },
    [files, maxFiles, multiple, onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: (rejections) => {
      setIsDragActive(false);
      
      // Handle file type rejection
      if (rejections.some(r => r.errors.some(e => e.code === 'file-invalid-type'))) {
        setError('Invalid file type. Please upload PDF files only.');
        return;
      }
      
      // Handle file size rejection
      if (rejections.some(r => r.errors.some(e => e.code === 'file-too-large'))) {
        const sizeMB = Math.round(maxSize / 1024 / 1024);
        setError(`File is too large. Maximum size is ${sizeMB}MB.`);
        return;
      }
      
      setError('File upload failed. Please try again.');
    }
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesAdded(newFiles);
  };

  const removeAllFiles = () => {
    setFiles([]);
    onFilesAdded([]);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
          isDragReject && "border-destructive bg-destructive/5",
          error && "border-destructive/50"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center gap-3">
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
            isDragActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
            isDragReject && "bg-destructive/10 text-destructive"
          )}>
            <Upload size={24} className={cn(
              "transition-transform",
              isDragActive && "transform scale-110"
            )} />
          </div>
          
          <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Click to upload</span> or drag and drop
          </div>
          
          <div className="text-xs text-muted-foreground">
            PDF files only (max {Math.round(maxSize / 1024 / 1024)}MB)
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      {files.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">{files.length} file{files.length !== 1 ? 's' : ''} selected</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={removeAllFiles}
              className="h-8 text-xs"
            >
              Remove all
            </Button>
          </div>
          
          <div className="space-y-3">
            {files.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="bg-muted/50 border border-border rounded-lg p-3 flex items-center justify-between gap-3 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-muted-foreground flex-shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 text-primary">
                    <CheckCircle2 size={20} />
                  </div>
                  
                  <button 
                    onClick={() => removeFile(index)} 
                    className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export default FileUpload;
