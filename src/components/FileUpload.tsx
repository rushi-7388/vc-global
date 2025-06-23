import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Image, FileImage, AlertCircle } from 'lucide-react';
import { FileUploadService, UploadedFile } from '@/utils/fileUpload';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from './LoadingSpinner';

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  existingFiles?: UploadedFile[];
  maxFiles?: number;
  className?: string;
}

export const FileUpload = ({ 
  onFilesUploaded, 
  existingFiles = [], 
  maxFiles = 5,
  className = '' 
}: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(existingFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const totalFiles = uploadedFiles.length + fileArray.length;

    if (totalFiles > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed. You can upload ${maxFiles - uploadedFiles.length} more files.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const newUploadedFiles = await FileUploadService.uploadFiles(fileArray);
      const allFiles = [...uploadedFiles, ...newUploadedFiles];
      
      setUploadedFiles(allFiles);
      onFilesUploaded(allFiles);

      toast({
        title: "Upload successful",
        description: `${fileArray.length} file(s) uploaded successfully.`,
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = async (fileToRemove: UploadedFile) => {
    try {
      await FileUploadService.deleteFile(fileToRemove.name);
      
      const updatedFiles = uploadedFiles.filter(file => file.name !== fileToRemove.name);
      setUploadedFiles(updatedFiles);
      onFilesUploaded(updatedFiles);

      toast({
        title: "File removed",
        description: "File has been removed successfully.",
      });
    } catch (error: any) {
      console.error('Remove error:', error);
      toast({
        title: "Remove failed",
        description: "Failed to remove file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>Product Images</Label>
      
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-muted">
                {isUploading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                {isUploading ? 'Uploading...' : 'Upload Product Images'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your images here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, WebP (Max 5MB each)
              </p>
            </div>

            <div className="flex justify-center space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={openFileDialog}
                disabled={isUploading || uploadedFiles.length >= maxFiles}
              >
                <FileImage className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
              
              <Badge variant="secondary">
                {uploadedFiles.length}/{maxFiles} files
              </Badge>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <Label>Uploaded Images ({uploadedFiles.length})</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedFiles.map((file, index) => (
              <Card key={file.name} className="relative group overflow-hidden">
                <CardContent className="p-2">
                  <div className="relative aspect-square">
                    <img
                      src={file.url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                    
                    {/* Remove button */}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveFile(file)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium truncate">
                      {file.name.split('-')[1]?.split('.')[0] || 'Image'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {FileUploadService.formatFileSize(file.size)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {uploadedFiles.length === 0 && !isUploading && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
          <span>No images uploaded yet. Upload at least one image for your product.</span>
        </div>
      )}
    </div>
  );
}; 