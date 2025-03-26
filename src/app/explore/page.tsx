'use client'
import Like from '@/components/Like'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatTimeAgo } from '@/lib/utils'
import { querySchema } from '@/schemas/querySchema'
import axios from 'axios'
import { Dot, Mail, MessageCircle, Share, Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, {useEffect, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const messages = [{
  _id : "123",
  owner : "John Doe",
  query : "Hey, I'm new here",
  createdAt : new Date().toISOString(),
  likes : 5
},
{
  _id : "124",
  owner : "Jane Doe",
  query : "Hey, I'm new here",
  createdAt : Date.now()-1000000000,
  likes : 5
},
{
  _id : "125",
  owner : "John Doe",
  query : "Hey, I'm new here",
  createdAt : new Date().toISOString(),
  likes:8
}]
const ExporePage = () => {
  const [messages , setMessages] = useState<z.infer<typeof querySchema>>()

  const router = useRouter()

  const handleClick = (id : string)=>{
    router.push(`/post/${id}`)
  }

  useEffect(
    ()=>{
      const fetchQueries = async()=>{
        try {
          const response = await axios.get(`/api/suggest-messages`)
          console.log(response.data)
          setMessages(response.data.data)
        } catch (error) {
          if(axios.isAxiosError(error)){
            toast(error.response?.data.message)
          }
        }
      }
      fetchQueries()
    }
    ,[]
  )
  
  return (
    <div className=' flex-col items-center justify-center'>
    
        {messages && messages.map((message : z.infer<typeof querySchema>, index : number) => (
            <div className="flex items-center justify-center " key={index} >
              <Card className='border hover:border-accent-foreground rounded-xl w-full max-w-lg md:m ax-w-xl' onClick={()=>handleClick(message._id)}>
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