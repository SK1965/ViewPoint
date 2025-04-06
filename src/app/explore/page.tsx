'use client'
import QueryLike from '@/components/QueryLike'
import Share from '@/components/Share'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatTimeAgo } from '@/lib/utils'
import { querySchema } from '@/schemas/querySchema'
import axios from 'axios'
import { Eye, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const ExporePage = () => {
  const router = useRouter()
  const [messages, setMessages] = useState<z.infer<typeof querySchema>[]>()
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  const toggleExpand = (id: string) => {
    if (expandedPost === id) {
      setExpandedPost(null)
    } else {
      setExpandedPost(id)
    }
  }

  const handleClick = (id: string) => {
    router.push(`/post/${id}`)
  }

  const incrementViews = async (id: string) => {
    try {
      await axios.post(`/api/increment-view`, { queryId: id });
    } catch (error) {
      // Check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        console.error("Error response from server:", error.response);
        toast.error(error.response?.data?.message || 'Failed to increment views');
      } else {
        console.error("Unknown error:", error);
      }
    }
  };
  

  useEffect(() => {
    const fetchQueries = async() => {
      setLoading(true)
      try {
        const response = await axios.get(`/api/suggest-messages`)
        setMessages(response.data.data)
      } catch (error) {
        if(axios.isAxiosError(error)){
          toast(error.response?.data.message)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchQueries()
  }, [])

  if (loading) {
    return (
      <div className='max-w-5xl mx-auto px-4 py-8 space-y-8'>
        <div className="animate-pulse space-y-6">
          {[1, 2, 3 , 5,6,7].map((item) => (
            <div key={item} className="bg-gray-700 h-36 w-full max-w-5xl rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-5xl mx-auto px-4 py-8 space-y-8'>
      
      {messages && messages.length > 0 ? (
        messages.map((message: z.infer<typeof querySchema>) => (
          <Card key={message._id} className='border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden'>
            <CardHeader className="px-6">
              <div className="flex items-center space-x-4">
                <Avatar className='h-12 w-12 ring-2 ring-gray-50'>
                  <AvatarImage src={message.avatar||`https://ui-avatars.com/api/?name=${message.owner}&background=random`} alt={message.owner} />
                  <AvatarFallback>{message.owner.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className='text-base mb-1'>@{message.owner}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {formatTimeAgo(message.createdAt)}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <Separator className="bg-gray-100" />

            <CardContent 
              className="pt-2 px-6"
              onClick={() => handleClick(message._id)} // Navigation handler for card content
            >
              {/* Title - always visible */}
              <h3 className="font-medium text-lg mb-3">{message.title || "Untitled Query"}</h3>
              
              {/* Read more button */}
              {expandedPost !== message._id && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-accent-foreground hover:text-primary/80 p-0 h-auto font-medium mt-1"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click from propagating to CardContent
                    incrementViews(message._id)
                    toggleExpand(message._id)
                  }}
                >
                  Read more...
                </Button>
              )}
              
              {/* Expanded content */}
              {expandedPost === message._id && (
                <div className="mt-4 space-y-4">
                  <div className=" p-4 rounded-lg">
                    <p className=" leading-relaxed" onClick={(e)=>e.stopPropagation()}>{message.query}</p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground hover:text-foreground p-0 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(message._id)
                        
                      }}
                    >
                      Show less
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 text-xs shadow-sm hover:shadow"
                      onClick={() => {
                        handleClick(message._id)
                      }}
                    >
                      <ExternalLink size={14} />
                      View full post
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>

            <Separator className="bg-gray-100" />
            
            <CardFooter className="px-10 flex justify-between md:justify-start md:space-x-16">
              <QueryLike like={message.likes} queryId={message._id} />

              <div className="flex flex-col items-center justify-center">
                <Eye className="h-6 w-6" />
                <span className="">{message.views || 0}</span>
              </div>

              <Share queryId={message._id} />
            </CardFooter>


          </Card>
        ))
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-muted-foreground">No queries found</p>
        </div>
      )}
    </div>
  )
}

export default ExporePage
