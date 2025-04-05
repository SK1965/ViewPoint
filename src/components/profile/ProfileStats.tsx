"use client"
// components/profile/ProfileStats.tsx

import React from 'react';
import { z } from 'zod';
import { userSchema } from '@/schemas/userSchema';
import { querySchema } from '@/schemas/querySchema';

interface ProfileStatsProps {
  user: z.infer<typeof userSchema>;
  posts: z.infer<typeof querySchema>[];
}

export default function ProfileStats({ user, posts }: ProfileStatsProps) {
  // Calculate total views and likes across all posts
  const totalViews = posts.reduce((acc, post) => acc + (post.views || 0), 0);
  const totalLikes = posts.reduce((acc, post) => acc + (post.likes?.length || 0), 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-md overflow-hidden mb-8">
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 sm:px-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{posts.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Posts</div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{totalViews}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Views</div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{totalLikes}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Likes</div>
          </div>
        </div>
      </div>
    </div>
  );
}