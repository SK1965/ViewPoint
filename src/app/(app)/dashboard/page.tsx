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

// Import our newly created components
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import PostsList from '@/components/profile/PostsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@react-email/components';
import { messageSchema } from '@/schemas/messageSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function UserProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<z.infer<typeof userSchema>>(); 
  const [posts, setPosts] = useState<z.infer<typeof querySchema>[]>([]);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Initialize form with useForm hook outside of conditional logic
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  useEffect(() => {
    setLoading(true);
    if (!session || !session.user) {
      router.push('/sign-in');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/profile/${session?.user.username}`);
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
  }, [session, router]);

  // Handler to update user data after profile edits
  const handleProfileUpdate = (updatedData: Partial<z.infer<typeof userSchema>>) => {
    setUser(prev => prev ? { ...prev, ...updatedData } : prev);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    const content = data.content;
    setIsSubmiting(true);
    if (!session || !session.user) {
      router.push(`/sign-in?returnUrl=${encodeURIComponent(window.location.href)}`);
      return;
    }
    try {
      const response = await axios.post('/api/create-query', 
        { query: content, username: session.user.username }
      );
      toast(response.data.message || "Story shared successfully!");
      form.reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.response?.data.message || "Something went wrong");
      } else {
        toast("Something went wrong!");
      }
    } finally {
      setIsSubmiting(false);
    }
  };

  if (!user || loading) {
    return <ProfileSkeleton />;
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
                  <div className="flex justify-end ">
                    <Button 
                      type="submit" 
                      className="rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 "
                    >
                      <span className='flex items-center py-2 px-2 '>
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
