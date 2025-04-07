"use client"
// components/profile/ProfileImageUploader.tsx

import React, { useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProfileImageUploaderProps {
  currentImageUrl: string | null;
  username: string;
  onImageUpdate: (newImageUrl: string) => void;
  type: 'profile' | 'cover';
}

export default function ProfileImageUploader({ 
  currentImageUrl, 
  username, 
  onImageUpdate,
  type
}: ProfileImageUploaderProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isProfile = type === 'profile';
  const title = isProfile ? 'Profile Picture' : 'Cover Image';
  const endpoint = isProfile ? '/api/profile/update-avatar' : '/api/profile/update-cover';
  const fieldName = isProfile ? 'avatar' : 'coverImage';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Basic validation
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`File size too large. Maximum size is 5MB.`);
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error(`Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.`);
        return;
      }
      
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetState = () => {
    setImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // Clean up the blob URL
      setImagePreview('');
    }
    setIsDialogOpen(false);
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error(`Please select an image to upload.`);
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append(fieldName, image);
      
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Extract URL from response based on image type
      const newImageUrl = isProfile ? response.data.data.avatarUrl : response.data.data.coverImageUrl;
      
      if (newImageUrl) {
        onImageUpdate(newImageUrl);
        toast.success(`${title} updated successfully`);
        resetState();
      } else {
        throw new Error('No image URL returned from server');
      }
    } catch (error: any) {
      console.error(`Failed to update ${title.toLowerCase()}:`, error);
      // More detailed error logging
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
      toast.error(`Failed to update ${title.toLowerCase()}. ${error.message || 'Please try again.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentImageUrl) {
      toast.error(`No ${title.toLowerCase()} to delete.`);
      return;
    }
    
    setIsDeleting(true);
    
    try {
      // Use the same endpoint but with DELETE method
      const response = await axios.delete(endpoint);
      
      // Handle the response differently based on image type
      if (isProfile) {
        // For profile images, the API returns a default avatar URL
        const defaultAvatarUrl = response.data.data.avatarUrl;
        if (defaultAvatarUrl) {
          onImageUpdate(defaultAvatarUrl);
          toast.success(`${title} reset to default`);
        } else {
          throw new Error('No default avatar URL returned from server');
        }
      } else {
        // For cover images, the API returns null or no URL
        onImageUpdate(''); // Pass empty string to indicate cover image was removed
        toast.success(`${title} removed successfully`);
      }
      
      // Close dialogs
      setIsDeleteDialogOpen(false);
      setIsDialogOpen(false);
      resetState();
      
    } catch (error: any) {
      console.error(`Failed to delete ${title.toLowerCase()}:`, error);
      // More detailed error logging
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
      toast.error(`Failed to delete ${title.toLowerCase()}. ${error.message || 'Please try again.'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Button and UI styles based on type
  const buttonStyles = isProfile 
    ? "absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white dark:bg-gray-800"
    : "absolute top-2 right-2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800";

  // Delete button styles - only show delete button if there's a current image
  const deleteButtonStyles = isProfile 
    ? "absolute -bottom-2 -left-2 h-8 w-8 rounded-full bg-white dark:bg-gray-800"
    : "absolute top-2 left-2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800";

  return (
    <>
      {/* Upload Button */}
      <Button 
        variant="outline" 
        size={isProfile ? "icon" : "sm"}
        className={buttonStyles}
        onClick={() => setIsDialogOpen(true)} 
        aria-label={`Update ${title}`}
      >
        <Camera className="h-4 w-4" />
        {!isProfile && <span className="sr-only sm:not-sr-only sm:text-xs ml-1">Update Cover</span>}
      </Button>


      {/* Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open && !isUploading) resetState();
        setIsDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update {title}</DialogTitle>
            <DialogDescription>
              Upload a new {title.toLowerCase()} for your profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Show current image if no preview */}
            {!imagePreview && currentImageUrl && (
              <div className={isProfile ? "w-32 h-32 mx-auto overflow-hidden rounded-full" : "w-full h-32 overflow-hidden rounded-md"}>
                <img 
                  src={currentImageUrl} 
                  alt={`Current ${title}`} 
                  className="w-full h-full object-cover"
                />
                <p className="text-center text-sm text-gray-500 mt-2">Current {title.toLowerCase()}</p>
              </div>
            )}
            
            {/* Show preview of new image */}
            {imagePreview && (
              <div className={isProfile ? "w-32 h-32 mx-auto overflow-hidden rounded-full" : "w-full h-32 overflow-hidden rounded-md"}>
                <img 
                  src={imagePreview} 
                  alt={`${title} Preview`} 
                  className="w-full h-full object-cover"
                />
                <p className="text-center text-sm text-gray-500 mt-2">New {title.toLowerCase()} preview</p>
              </div>
            )}
            
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor={fieldName}>{title}</Label>
              <Input 
                id={fieldName} 
                name={fieldName}
                type="file" 
                accept="image/jpeg,image/png,image/gif,image/webp" 
                onChange={handleImageChange}
                disabled={isUploading}
              />
              <p className="text-xs text-gray-500">Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP</p>
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            {/* Add delete button in the dialog footer if there's a current image */}
            {currentImageUrl && (
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isUploading || isDeleting}
                className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isProfile ? "Reset to default" : "Remove"} {title}
              </Button>
            )}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={resetState}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpload}
                disabled={!image || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Save Changes'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        if (!isDeleting) setIsDeleteDialogOpen(open);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isProfile ? "Reset" : "Remove"} {title}</AlertDialogTitle>
            <AlertDialogDescription>
              {isProfile 
                ? `Are you sure you want to reset your ${title.toLowerCase()} to the default? This action cannot be undone.`
                : `Are you sure you want to remove your ${title.toLowerCase()}? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault(); 
                handleDelete();
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isDeleting}
            >
              {isDeleting 
                ? (isProfile ? 'Resetting...' : 'Removing...') 
                : (isProfile ? 'Reset to Default' : 'Remove Image')
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}