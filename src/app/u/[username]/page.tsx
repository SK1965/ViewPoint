"use client"
// pages/[username]/page.tsx

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Link2, MessageSquare, ThumbsUp, Eye, Clock } from 'lucide-react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { z } from 'zod';
import { userSchema } from '@/schemas/userSchema';
import { querySchema } from '@/schemas/querySchema';
import ProfileSkeleton from '@/components/skeleton/ProfileSkeleton';

 

export default function UserProfilePage() {
  const [loading  ,setLoading] = useState(true)
  const [user , setUser] = useState<z.infer<typeof userSchema>>()
  const [posts , setPosts] = useState<z.infer<typeof querySchema>[]>()
  const { username } = useParams();

  useEffect( ()=>{
    setLoading(true)
    const fetchProfile  = async()=>{
      const response = await axios.get(`/api/profile/${username}`)
      setUser(response.data.data.user)
      setPosts(response.data.data.posts)
      setLoading(false)
    }
    fetchProfile()
  }, [username])

  if(!user || !posts || loading){
    return (
      <ProfileSkeleton />
    )
  }

  const handleCopyProfileLink = async () => {
    const profileLink = `${window.location.origin}/u/${user.username}`;
    try {
      navigator.clipboard.writeText(profileLink);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
        <div className="px-6 py-4 sm:px-8 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="flex-shrink-0 -mt-16 mb-4 sm:mb-0 sm:mr-6">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                alt={user.name || user.username}
                className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.username}</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-4">@{user.username}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{user.bio || ''}</p>

              <div className="flex flex-wrap gap-y-2">
                {user.location && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mr-6">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm mr-6">
                    <Link2 className="h-4 w-4 mr-1" />
                    <button 
                      onClick={()=>{handleCopyProfileLink()}} 
                      className="hover:underline cursor-pointer"
                    >
                      {user.username}
                    </button>
                  </div>
                )}
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

        {/* Stats */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 sm:px-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{posts.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Posts</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{ posts.reduce((acc, post) => acc + post.views, 0)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Views</div>
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{ posts.reduce((acc, post) => acc + post.likes.length, 0)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Likes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Posts</h2>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center text-gray-500 dark:text-gray-400">
            No posts yet.
          </div>
        ) : (
          posts.map(post => (
            <article key={post._id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  <a href={`/posts/${post._id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                    {post.title}
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
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{0}</span>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
