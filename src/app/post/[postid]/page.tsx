'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { formatTimeAgo } from '@/lib/utils'
import { User } from '@/model/User'
import { querySchema } from '@/schemas/querySchema'
import { responseSchema } from '@/schemas/responseSchema'
import { Separator } from '@radix-ui/react-dropdown-menu'
import axios from 'axios'
import { Dot, Heart, Reply, Loader2 } from 'lucide-react'
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
  const { data: session } = useSession()
  const user : User = session?.user as User
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
        toast('first attempt passed')
        router.push('/sign-in')
      } else {
        const comment = {
          message : data.comment,
          userId : user._id ,
          queryId : postid
        }
        console.log(comment);
        const tempComment : z.infer<typeof responseSchema> = {
          message  :  data.comment,
          owner : user.username,
          createdAt : new Date(),
          likes : 0,
          replies :[]
        } 
        setComments([tempComment,...comments])
        const response = await axios.post('/api/comment' , comment)
        toast(response.data.message )
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
      console.log(postid)
      const response = await axios.post('/api/get-queries', { messageId: postid })
      console.log(response.data)
      setQuery(response.data?.data.query)
      setComments(response.data?.data.comments)
    }

    loadQuery()
  }, [postid])

  if (!query) {
    return (
      <div className="space-y-4">
        {/* Skeleton Loader for Card Header */}
        <div className="flex space-x-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col space-y-2">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-12 w-full" />
        {/* Skeleton Loader for Comments Section */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </div>
      </div>
    )
  }

  return (
    <div>
      {!query  ?
      <div className="space-y-4">
        {/* Skeleton Loader for Card Header */}
        <div className="flex space-x-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col space-y-2">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-12 w-full" />
        {/* Skeleton Loader for Comments Section */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </div>
      </div>
       :<Card className="border hover:border-accent-foreground rounded-none  max-w-screen">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span>{query.owner}</span>
            <div className="flex items-center pt-1.5">
              <Dot />
              <p className="relative text-xs text-muted-foreground mx-0">{formatTimeAgo(query.createdAt)}</p>
            </div>
          </CardTitle>
          <Separator></Separator>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-start justify-middle space-y-1 md:space-y-0 md:space-x-4 ">
          <div>
            <p>{query.query}</p>
          </div>
        </CardContent>
        {/* Right section with Heart Icon and Like count */}
        <Separator />
        <div>
          <div className="md:w-32 flex justify-between mx-16 ">
            <div className="flex-col items-center justify-center text-center">
              <Heart />
              <span>{query.likes}</span>
            </div>
            <div className="flex-col items-center justify-center">
              <Reply className="mx-2" />
              <span>share</span>
            </div>
          </div>
        </div>
      </Card>}

      {/* Comment input */}
      <div className="py-4 px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-1 md:space-x-2">
            <FormField
              name="comment"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="comment" {...field} className="w-72 md:w-96" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" variant={'secondary'}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Add'}
            </Button>
          </form>
        </Form>
      </div>

      {/* Comments Block */}
      <div className="md:px-8 px-2 border-2 md:min-h-96 max-w-screen  md:rounded-2xl ">
        <span className="tracking-wide text-lg text-muted-foreground">comments</span>
        {comments.length == 0 ? (
          <div>
            <span className="ext-muted-foreground ">No comments yet.</span>
          </div>
        ) : (
          <>
            {comments.map((item , index) => (
              <div key={index}>
                <Card className="border max-w-screen text-muted-foreground ">
                  <CardContent className="flex flex-col  items-start justify-middle space-y-2 md:space-y-0 md:space-x-8 ">
                    <CardTitle className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span>@{item.owner}</span>
                        <div className="flex items-center pt-1.5">
                          <Dot />
                          <Separator></Separator>
                          <p className="relative text-xs text-muted-foreground mx-0">{formatTimeAgo(item.createdAt)}</p>
                        </div>
                      </div>
                    </CardTitle>

                    <div className='mx-10'>
                      <p>{item.message}</p>
                    </div>
                  </CardContent>

                  <CardFooter className="space-x-10">
                    <div className="flex-col items-center justify-center text-center">
                      <Heart className="h-5 w-5" />
                      <span className="tracking-wide text-xs text-muted-foreground">{item.likes}</span>
                    </div>
                    <div className="flex-col items-center justify-center text-center cursor-pointer">
                      <Reply />
                      <span className="tracking-wide text-xs text-muted-foreground">reply</span>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Post
