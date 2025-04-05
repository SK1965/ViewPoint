import React from 'react'
import { Skeleton } from '../ui/skeleton'

const ProfileSkeleton = () => {
  return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Profile Header Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
            <div className="bg-gray-300 dark:bg-gray-600 mb-2 h-32"></div>
            <div className="px-6 py-4 sm:px-8 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center">
                {/* Avatar Skeleton */}
                <Skeleton className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-4 sm:mb-0 sm:mr-6" />
  
                <div className="flex-1">
                  <Skeleton className="h-6 bg-gray-300 dark:bg-gray-600 mb-2" />
                  <Skeleton className="h-4 bg-gray-300 dark:bg-gray-600 mb-4" />
                  <Skeleton className="h-6 bg-gray-300 dark:bg-gray-600 mb-4" />
  
                  <div className="flex flex-wrap gap-y-2">
                    <Skeleton className="h-4 w-32 bg-gray-300 dark:bg-gray-600 mb-2" />
                    <Skeleton className="h-4 w-48 bg-gray-300 dark:bg-gray-600 mb-2" />
                    <Skeleton className="h-4 w-32 bg-gray-300 dark:bg-gray-600 mb-2" />
                  </div>
                </div>
              </div>
            </div>
  
            {/* Stats Skeleton */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 sm:px-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                <Skeleton className="h-8 w-16 bg-gray-300 dark:bg-gray-600" />
                <Skeleton className="h-8 w-16 bg-gray-300 dark:bg-gray-600" />
                <Skeleton className="h-8 w-16 bg-gray-300 dark:bg-gray-600" />
              </div>
            </div>
          </div>
  
          {/* Posts Skeleton */}
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            <Skeleton className="h-6 bg-gray-300 dark:bg-gray-600" />
          </h2>
  
          <div className="space-y-4">
            <Skeleton className="h-12 bg-gray-300 dark:bg-gray-600 rounded-lg" />
            <Skeleton className="h-12 bg-gray-300 dark:bg-gray-600 rounded-lg" />
            <Skeleton className="h-12 bg-gray-300 dark:bg-gray-600 rounded-lg" />
          </div>
        </div>
  )
}

export default ProfileSkeleton