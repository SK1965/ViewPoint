'use client'
import Like from '@/components/Like'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatTimeAgo } from '@/lib/utils'
import { Dot, Mail, MessageCircle, Share, Share2 } from 'lucide-react'
import React, { use } from 'react'

const messages = [{

  owner : "John Doe",
  query : "Hey, I'm new here",
  createdAt : new Date().toISOString(),
  likes : 5
},
{
  owner : "Jane Doe",
  query : "Hey, I'm new here",
  createdAt : Date.now()-1000000000,
  likes : 5
},
{
  owner : "John Doe",
  query : "Hey, I'm new here",
  createdAt : new Date().toISOString(),
  likes:8
}]
const ExporePage = () => {

  
  return (
    <div className=' flex-col items-center justify-center'>
    
        {messages.map((message, index) => (
            <div className="flex items-center justify-center " key={index}>
              <Card className='border hover:border-accent-foreground rounded-xl w-full max-w-lg md:max-w-xl'>
                  <CardHeader>
                    <CardTitle className='flex items-center space-x-2'>
                    <Avatar className='h-12 w-12'>
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                      <span>
                      @{message.owner}
                      </span>
                      <div className='flex items-center pt-1.5'>
                      <Dot/>
                      <p className="relative text-xs text-muted-foreground mx-0">
                        {formatTimeAgo(message.createdAt)}
                      </p>
                      </div>
                      </CardTitle>
                   <Separator></Separator> 
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start justify-middle space-y-2 md:space-y-0 md:space-x-8 min-h-16">
                    <div className='w-64 md:w-96'>
                      <p >{message.query}</p>
                    </div>
                    
                  </CardContent>
                    {/* Right section with Heart Icon and Like count */}
                    <Separator />
                    <div className=''>
                      <div className="flex justify-between mx-16">
                        {/* Heart Icon */}
                        
                       <Like count = {message.likes}></Like>
                       <div className='flex-col items-center justify-center'>
                          <MessageCircle/>
                          <span >200</span>
                       </div>
                      <Share2/>
                      </div>
                    </div>
                  
                </Card>
            </div>  
        ))}  
    </div>
  )
}

export default ExporePage