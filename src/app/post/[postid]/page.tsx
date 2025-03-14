'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTimeAgo } from '@/lib/utils'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Dot, MessageCircle, Share2 ,Heart } from 'lucide-react'
import React from 'react'


const message = {
  _id : "dcjsvsqre",
  owner : "John Doe",
  query : "have you read the book Automic habits. if yes, what do you think about it? if not I will suggest you read it",
  createdAt : Date.now() - (1000*60*60*12),
  likes : 32,
  countComments : 5
}

const comments  =[
  {
    _id :1,
    messageId : "dcjsvsqre",
    owner : "leesa",
    comment : "yes I red it and I think it is a good book",
    createdAt : Date.now() - ((1000*60*60*3)),
    likes : 21
  },
  {
    _id :2,
    messageId : "dcjsvsqre",
    owner : "animeDon",
    comment : "I have not read it but I will try to read it",
    createdAt : Date.now() - (1000*60*20),
    likes :3
  },
  {
    _id :3,
    messageId : "dcjsvsqre",
    owner: "minicop",
    comment : "who will read books in this generation. I will rather watch the movie",
    createdAt : Date.now() - (1000*60*100),
    likes : 9
  },
  {
    _id :4,
    messageId : "dcjsvsqre",
    owner : "leesa",
    comment : "@minicop who asked you. if you don't have anything to say just keep quiet",
    createdAt : Date.now()-(1000*60*30),
    likes : 18
  },
  {
    _id :5,
    messageId : "dcjsvsqre",
    owner : "minicop",
    comment : "@leesa cool boomer,I was not supposed to hurt your feelings",
    createdAt :  Date.now() - (1000*60*20),
    likes : 12
  }
]
const Post = () => {
  return (
    <div>
      < Card className='border hover:border-accent-foreground rounded-none w-full max-w-screen'>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
          <Avatar className='h-12 w-12'>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
            <span>
            {message.owner}
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
        <CardContent className="flex flex-col md:flex-row items-start justify-middle space-y-1 md:space-y-0 md:space-x-4 ">
          <div className=''>
            <p >{message.query} </p>
          </div>
          
        </CardContent>
          {/* Right section with Heart Icon and Like count */}
          <Separator />
          <div className=''>
            <div className="md:w-32 flex justify-between mx-16 ">
              {/* Heart Icon */}
              
              <div className='flex-col items-center justify-center text-center'>
                <Heart className='md:hover:h-5 md:hover:w-5'/>
                <span >{message.countComments}</span>
              </div>
              <div className='flex-col items-center justify-center' >
                <Share2 className='md:hover:h-5 md:hover:w-5 mx-2'/>
                <span>share</span>
              </div>
            </div>
          </div>
        
      </Card>
      <div>

      </div>

      {/* comments bolck */} ,
      <div className='border-2 md:min-h-96'>
        {comments.length==0 ? 
        <></>
        :
        <>
        {comments.map((item)=>(
          <div key={item._id} className=''>
           <Card className='border hover:border-accent-foreground rounded-xl w-full max-w-lg md:max-w-xl'>
                  <CardHeader>
                    <CardTitle className='flex items-center space-x-2'>
                    <Avatar className='h-12 w-12'>
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                      <span>
                      @{item.owner}
                      </span>
                      <div className='flex items-center pt-1.5'>
                      <Dot/>
                      <p className="relative text-xs text-muted-foreground mx-0">
                        {formatTimeAgo(item.createdAt)}
                      </p>
                      </div>
                      </CardTitle>
                   <Separator></Separator> 
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start justify-middle space-y-2 md:space-y-0 md:space-x-8 ">
                    <div className=''>
                      <p >{item.comment}</p>
                    </div>
                    
                  </CardContent>
                    {/* Right section with Heart Icon and Like count */}
                    <Separator />
                    <div className=''>
                      <div className=" flex justify-between mx-16 absolute   top-10 right-8">
                        {/* Heart Icon */}
                        
                        <div className='flex-col items-center justify-center text-center'>
                          <Heart className='md:hover:h-5 md:hover:w-5'/>
                          <span >{message.likes}</span>
                        </div>
                        
                      </div>
                    </div>
                  
                </Card>
          </div>
        ))}
        </>
        }
      </div>
    </div>
  )
}

export default Post