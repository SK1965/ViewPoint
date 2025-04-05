"use client"
// components/profile/PostsList.tsx

import React from 'react';
import { Clock, Eye, ThumbsUp, MessageSquare } from 'lucide-react';
import { z } from 'zod';
import { querySchema } from '@/schemas/querySchema';

interface PostsListProps {
  posts: z.infer<typeof querySchema>[];
}

export default function PostsList({ posts }: PostsListProps) {
  if (posts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center text-gray-500 dark:text-gray-400">
        No posts yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

interface PostCardProps {
  post: z.infer<typeof querySchema>;
}

function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          <a href={`/posts/${post._id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
            {post.title || "Untitled Post"}
          </a>
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{post.query}</p>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center mr-4">
            <Clock className="h-4 w-4 mr-1" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center mr-4">
            <Eye className="h-4 w-4 mr-1" />
            <span>{post.views || 0}</span>
          </div>
          <div className="flex items-center mr-4">
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{post.likes?.length || 0}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{0}</span>
          </div>
        </div>
      </div>
    </article>
  );
}