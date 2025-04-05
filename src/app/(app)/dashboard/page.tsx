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

export default function UserProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<z.infer<typeof userSchema>>();
  const [posts, setPosts] = useState<z.infer<typeof querySchema>[]>([]);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    if(!session || !session.user){
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

      {/* Posts List Component */}
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Posts</h2>
      <PostsList posts={posts} />
    </div>
  );
}