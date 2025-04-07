'use client'

import React, { useState } from 'react';
import { MapPin, Link2, Calendar, Edit } from 'lucide-react';
import axios from 'axios';
import { z } from 'zod';
import { userSchema } from '@/schemas/userSchema';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ProfileImageUploader from './ProfileImageUploader';
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

interface ProfileHeaderProps {
  user: z.infer<typeof userSchema>;
  isCurrentUser: boolean;
  onProfileUpdate: (updatedData: Partial<z.infer<typeof userSchema>>) => void;
}

export default function ProfileHeader({ user, isCurrentUser, onProfileUpdate }: ProfileHeaderProps) {
  // Dialog open state
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Define form with react-hook-form
  const form = useForm({
    defaultValues: {
      name: user.name || '',
      bio: user.bio || '',
      location: user.location || '',
      
    }
  });

  // Reset form when dialog opens
  const handleDialogOpen = (open: boolean) => {
    if (open) {
      form.reset({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        
      });
    }
    setDialogOpen(open);
  };

  const updateProfileData = async (formData: any) => {
    try {
      const response = await axios.put(`/api/profile/update-profile`, formData);
      onProfileUpdate(formData);
      toast.success("Profile updated successfully");
      handleDialogOpen(false);
      return true;
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile");
      return false;
    }
  };

  // Handle profile image update
  const handleProfileImageUpdate = (newImageUrl: string) => {
    onProfileUpdate({ avatar: newImageUrl });
  };

  // Handle cover image update
  const handleCoverImageUpdate = (newImageUrl: string) => {
    onProfileUpdate({ coverImage: newImageUrl });
  };

  // Copy profile link to clipboard
  const handleCopyProfileLink = async () => {
    const profileLink = `${window.location.origin}/u/${user.username}`;
    try {
      navigator.clipboard.writeText(profileLink);
    } catch (err) {
      console.error(err);
    }
  };
    
 

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
      {/* Cover Image */}
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32">
          {user.coverImage && (
            <img 
              src={user.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {isCurrentUser && (
          <ProfileImageUploader
            currentImageUrl={user.coverImage || null}
            username={user.username}
            onImageUpdate={handleCoverImageUpdate}
            type="cover"
          />
        )}
      </div>
      
      <div className="px-6 py-4 sm:px-8 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center">
          {/* Profile Image */}
          <div className="relative flex-shrink-0 -mt-16 mb-4 sm:mb-0 sm:mr-6">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
              alt={user.name || user.username}
              className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 object-cover"
            />
            
            {isCurrentUser && (
              <ProfileImageUploader
                currentImageUrl={user.avatar || null}
                username={user.username}
                onImageUpdate={handleProfileImageUpdate}
                type="profile"
              />
            )}
          </div>
          
          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.name || user.username}</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-4">@{user.username}</p>
              </div>
              
              {isCurrentUser && (
                <Dialog open={dialogOpen} onOpenChange={handleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-1">
                      <Edit className="h-4 w-4 mr-1" />
                      <span>Edit Profile</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your profile information.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(updateProfileData)} className="space-y-4 py-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us about yourself" 
                                  className="resize-none" 
                                  rows={3} 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="Your location" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        
                        <DialogFooter className="mt-4">
                          <Button type="button" variant="outline" onClick={() => handleDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            Save changes
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                    
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4"
               style={{ whiteSpace: 'pre-line' }} >
                {`${user.bio}` || ''}
            </p>

            <div className="flex flex-wrap gap-y-2">
              {user.location && (
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mr-6">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{user.location}</span>
                </div>
              )}
               
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm mr-6">
                  <Link2 className="h-4 w-4 mr-1" />
                  <button 
                    onClick={()=>{handleCopyProfileLink()}} 
                    className="hover:underline cursor-pointer"
                  >
                    {user.username}
                  </button>
                </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
