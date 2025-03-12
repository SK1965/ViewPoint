'use client'
import Like from '@/components/Like'
import MessageCard from '@/components/MessageCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { formatTimeAgo } from '@/lib/utils'
import { Mail } from 'lucide-react'
import React from 'react'

const messages = [{

  owner : "John Doe",
  query : "Hey, I'm new here",
  createdAt : new Date().toISOString(),
  likes : 5
},
{
  owner : "Jane Doe",
  query : "Hey, I'm new here",
  createdAt : new Date().toISOString(),
  likes : 5
},
{
  owner : "John Doe",
  query : "Hey, I'm new here",
  createdAt : new Date().toISOString(),
  
}]
const ExporePage = () => {
  return (
    <div className=' flex-col items-center justify-center'>
    
        {messages.map((message, index) => (
            <div className="flex items-center justify-center " key={index}>
              <Card className=''>
                  <CardHeader>
                    <CardTitle className='flex items-center space-x-2'>
                    <Avatar className='h-12 w-12'>
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                      <span>
                      @{message.owner}
                      </span>
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-8">
                    <div className='w-64 md:w-96'>
                      <p >{message.query}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(message.createdAt)}
                      </p>
                    </div>
                    
                  </CardContent>
                    {/* Right section with Heart Icon and Like count */}
                    <div className='relative'>
                      <div className=" absolute right-8 bottom-4 flex flex-col  space-y-2">
                        {/* Heart Icon */}
                       <Like count = {message.likes}></Like>
                      </div>
                    </div>
                  
                </Card>
            </div>  
        ))}  
    </div>

  )
}

export default ExporePage