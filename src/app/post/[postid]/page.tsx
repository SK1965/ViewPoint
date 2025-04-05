'use client'
import QueryLike from '@/components/QueryLike'
import ReplyLike from '@/components/ReplyLike'
import Share from '@/components/Share'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { formatTimeAgo } from '@/lib/utils'
import { User } from '@/model/User'
import { querySchema } from '@/schemas/querySchema'
import { responseSchema } from '@/schemas/responseSchema'
import { Separator } from '@/components/ui/separator'
import axios from 'axios'
import { Dot, Loader2, MessageCircle, Eye } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const Post = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [query, setQuery] = useState<z.infer<typeof querySchema>>()
  const [comments, setComments] = useState<z.infer<typeof responseSchema>[]>([])
  const [viewCount, setViewCount] = useState(0)
  const { data: session } = useSession()
  const user= session?.user
  const router = useRouter()
  const { postid } = useParams()
  const form = useForm({
    defaultValues: {
      comment: '',
    },
  })
  
  const onSubmit = async(data: any) => {
    setIsSubmitting(true)
    try {
      if (!user || !session) {
        toast('Please sign in to comment')
        router.push('/sign-in')
      } else {
        const comment = {
          message: data.comment,
          userId: user._id,
          queryId: postid
        }
        
        const tempComment: z.infer<typeof responseSchema> = {
          _id: "temp-id-" + Date.now(),
          message: data.comment,
          owner: user.username,
          createdAt: new Date(),
          likes: [],
          replies: []
        } 
        
        setComments([tempComment, ...comments])
        form.reset()
        
        const response = await axios.post('/api/comment', comment)
        toast(response.data.message)
      }
    } catch (error) {
      if(axios.isAxiosError(error)){
        toast(error.response?.data.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const loadQuery = async () => {
      try {
        const response = await axios.post('/api/get-queries', { messageId: postid })
        setQuery(response.data?.data.query)
        setComments(response.data?.data.comments)
        
        // Set view count from response or use a default
        setViewCount(query?.views ||0)
        // Optionally increment view count on backend
        try {
          const res = await axios.post('/api/increment-view', { queryId: postid })
        } catch (error) {
          console.error('Failed to increment view count', error)
        }
      } catch (error) {
        toast('Failed to load post')
      }
    }

    loadQuery()
  }, [postid])

  if (!query) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto p-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        
        <div className="flex space-x-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col space-y-2">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>
        </div>
        
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-12 w-full" />
        
        <div className="space-y-4 mt-8">
          <Skeleton className="h-8 w-1/2" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Discussion Thread</h1>
        <p className="text-muted-foreground">Join the conversation</p>
      </div>
      
      {/* Main Post Card */}
      <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="flex items-center gap-2">
              <Avatar className='h-12 w-12 ring-2 ring-gray-50'>
                <AvatarImage src={query.avatar||`https://ui-avatars.com/api/?name=${query.owner}&background=random`} alt={query.owner} />
                <AvatarFallback>{query.owner.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-semibold">@{query.owner}</span>
                <p className="text-xs text-muted-foreground">{formatTimeAgo(query.createdAt)}</p>
              </div>
            </CardTitle>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="pt-4">
          <h2 className="text-xl font-semibold mb-4">{query.title || "Post Title"}</h2>
          <p className="whitespace-pre-wrap">{query.query}</p>
        </CardContent>
        
        <Separator />
        
        <CardFooter className="px-10 flex justify-between md:justify-start md:space-x-16">
              <QueryLike like={query.likes} queryId={query._id} />

              <div className="flex flex-col items-center justify-center">
                <Eye className="h-6 w-6" />
                <span className="">{query.views || 0}</span>
              </div>

              <Share queryId={query._id} />
        </CardFooter>
      </Card>

      {/* Comments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>
        </div>
        
        {/* Comment input */}
        <Card className="border shadow-sm">
          <CardContent className="pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2">
                <FormField
                  name="comment"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input 
                          placeholder="Add your comment..." 
                          {...field} 
                          className="w-full" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting} className="shrink-0">
                  {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Post'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Comments List */}
        <div className="space-y-3">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((item, index) => (
              <Card key={index} className="border shadow-sm">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://avatar.vercel.sh/${item.owner}`} alt={item.owner} />
                      <AvatarFallback>{item.owner.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">@{item.owner}</span>
                      <span className="mx-2 text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(item.createdAt)}</span>
                    </div>
                  </div>
                  
                  <p className="pl-10 whitespace-pre-wrap">{item.message}</p>
                </CardContent>
                
                <CardFooter className="py-2">
                  <div className="flex items-center space-x-4 pl-10">
                    <ReplyLike like={item.likes} replyId={item._id} />
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Post