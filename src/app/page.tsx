'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail ,Heart, Loader2 } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import { Skeleton } from "@/components/ui/skeleton"


import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';
import ThreeDModel from '@/components/ThreeDModel';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageSchema } from '@/schemas/messageSchema';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { formatTimeAgo } from '@/lib/utils';
import { querySchema } from '@/schemas/querySchema';
import Like from '@/components/Like';

export default function Home() {
  const carouselRef = useRef(null);
  const [queries , setQueries] = useState<z.infer<typeof querySchema>[]>([])
  const [isSubmiting, setIsSubmiting] = useState(false)
  const resolver = zodResolver(messageSchema)
  const router = useRouter()
  const {data : session} = useSession()

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver,
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async(data  : z.infer<typeof messageSchema>)=>{
    const content = data.content
    setIsSubmiting(true)
    if (!session || !session.user) {
      router.replace('/sign-in')
      return;
    }
    try{
      const response = await axios.post('/api/create-query' ,
        {query :content , username : session.user.username}
      )
      toast(response.data.message || "Post Created")
      form.reset()
    }
    catch(error){
      if(axios.isAxiosError(error)){
        toast(error.response?.data.message || "Something went wrong")
      }else{
        toast("something went wrong!")
      }
    }
    finally{
      setIsSubmiting(false)
    }
  }

  useEffect(()=>{
    const fetchQueries = async()=>{

    try {
      const response = await axios.get('/api/famous')
      setQueries(response?.data?.data)
      
    } catch (error) {
      toast("Something went wrong")
    }
    }
    fetchQueries()
  } , [])
 
  return (
    <>
      {/* Main content */}
      <div className='absolute lg:block  hidden left-10 top-40 container h-96 w-96 '>
       <ThreeDModel/>
      </div>
      
      <main className="flex-grow flex flex-col lg:mt-6 items-center justify-center px-4 md:px-24 py-8 ">
        <section className="text-center md:mb-4">
          <h1 className="text-2xl md:text-3xl font-bold my-4">
          The world is full of stories. What's yours?
          </h1>
          <p className="text-center md:mt-4 text-base md:text-lg">
          Share your journey,<br />
           your passion,<br /> your truth - and let the world be a part of it.
          </p>
        </section>
        <div className="flex  justify-center items-center space-x-1 pt-4">
          
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2  space-x-1 flex items-center">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                <Textarea placeholder="share you story..."  className='md:w-96 w-64 ' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit"  >{isSubmiting ? <Loader2 className=' animate-spin'/>:"Post"}</Button>
        </form>
      </Form>
        </div>
        <div className='flex flex-col items-center space-y-2 mt-4'>
        <span className='text-xl mb-4'>
          Dive into our stories
          </span>
          <Button className='text-lg lg:py-6 lg:px-4 bg-auto' onClick={()=>router.push('/explore')}>Explore</Button>

        </div>

        {/* Carousel for Messages */}
       {queries.length==0 ?  
       <div className="flex items-center m-6 py-6 space-x-4 w-full max-w-lg md:max-w-xl border-2 rounded-xl">
       <Skeleton className="h-12 w-12 rounded-full" />
       <div className="space-y-2">
         <Skeleton className="h-6 w-[200px]" />
         <Skeleton className="h-5 w-[300px]" />
         <Skeleton className="h-3 w-[150px]" />

       </div>
     </div>
       : <Carousel
          ref={carouselRef}
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {queries.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className=''>
                  <CardHeader>
                    <CardTitle>Message by,{message.owner}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
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
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>}
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6">
        © 2025 View Point. All rights reserved.
      </footer>
    </>
  );
}