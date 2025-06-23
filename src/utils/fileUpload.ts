import { supabase } from '@/integrations/supabase/client';

export interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

export class FileUploadService {
  private static readonly BUCKET_NAME = 'product-images';
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  // Validate file before upload
  static validateFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: `File size must be less than ${this.MAX_FILE_SIZE / 1024 / 1024}MB` };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'Only JPG, PNG, and WebP files are allowed' };
    }

    return { valid: true };
  }

  // Upload a single file
  static async uploadFile(file: File): Promise<UploadedFile> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(fileName);

    return {
      name: fileName,
      url: urlData.publicUrl,
      size: file.size,
      type: file.type
    };
  }

  // Upload multiple files
  static async uploadFiles(files: File[]): Promise<UploadedFile[]> {
    const uploadPromises = files.map(file => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  // Delete a file from storage
  static async deleteFile(fileName: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  // Delete multiple files
  static async deleteFiles(fileNames: string[]): Promise<void> {
    if (fileNames.length === 0) return;

    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove(fileNames);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete files: ${error.message}`);
    }
  }

  // Get file size in readable format
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get file extension from filename
  static getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  // Check if file is an image
  static isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }
} 