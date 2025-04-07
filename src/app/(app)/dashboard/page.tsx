"use client"
// pages/[username]/page.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { z } from 'zod';
import { userSchema } from '@/schemas/userSchema';
import { querySchema } from '@/schemas/querySchema';
import ProfileSkeleton from '@/components/skeleton/ProfileSkeleton';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

// Import our components
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import PostsList from '@/components/profile/PostsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button'; // Fixed import from UI component instead of react-email
import { messageSchema } from '@/schemas/messageSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function UserProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<z.infer<typeof userSchema>>();
  const [posts, setPosts] = useState<z.infer<typeof querySchema>[]>([]);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  
  // Use status to properly handle auth state
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // This will run on the client-side when not authenticated
      router.push('/sign-in');
    },
  });
  
  const router = useRouter();

  // Initialize form with useForm hook
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  useEffect(() => {
    // Only proceed with API calls if session is loaded and authenticated
    if (status === 'loading') {
      return; // Still loading session, wait
    }
    
    if (status === 'unauthenticated') {
      // Handle in onUnauthenticated callback above
      return;
    }

    // At this point we're authenticated
    const fetchProfile = async () => {
      try {
        if (!session?.user?.username) {
          toast.error("User information not available");
          return;
        }
        
        const response = await axios.get(`/api/profile/${session.user.username}`);
        const fetchedUser = response.data.data.user;
        setUser(fetchedUser);
        setPosts(response.data.data.posts);

        // Check if current user is viewing their own profile
        setIsCurrentUser(session.user.username === fetchedUser.username);
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, status, router]);

  // Handler to update user data after profile edits
  const handleProfileUpdate = (updatedData: Partial<z.infer<typeof userSchema>>) => {
    setUser(prev => prev ? { ...prev, ...updatedData } : prev);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    const content = data.content;
    setIsSubmiting(true);
    
    // Double check authentication
    if (status !== 'authenticated' || !session?.user?.username) {
      toast.error("You must be logged in to share a story");
      router.push(`/sign-in?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    try {
      const response = await axios.post('/api/create-query', { 
        query: content, 
        username: session.user.username 
      });
      
      toast.success(response.data.message || "Story shared successfully!");
      form.reset();
      
      // Optionally refresh posts list after successful submission
      setPosts(prevPosts => [response.data.data, ...prevPosts]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Something went wrong");
      } else {
        toast.error("Failed to share your story");
      }
    } finally {
      setIsSubmiting(false);
    }
  };

  // Show loading state when session or user data is loading
  if (status === 'loading' || loading) {
    return <ProfileSkeleton />;
  }

  // Safety check for authenticated but no user data
  if (status === 'authenticated' && !user) {
    return <div className="max-w-5xl mx-auto px-4 py-8">Loading profile data...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Header Component */}
      <ProfileHeader 
        user={user} 
        isCurrentUser={isCurrentUser}
        onProfileUpdate={handleProfileUpdate}
      />
      
      {/* Profile Stats Component */}
      <ProfileStats user={user} posts={posts} />

      <section className="max-w-5xl mx-auto mb-12">
        <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Share Your Story
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  name="content"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="What story do you want to share today?" 
                          className="min-h-24 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                    disabled={isSubmiting}
                  >
                    <span className='flex items-center py-2 px-2'>
                    {isSubmiting ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Share Story
                    </span>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
      {/* Posts List Component */}
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Posts</h2>
      <PostsList posts={posts} />
    </div>
  );
}