'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, Heart, Loader2, Send, Sparkles, Globe, ArrowRight, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useEffect, useRef, useState } from 'react';
import ThreeDModel from '@/components/ThreeDModel';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
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
import QueryLike from '@/components/QueryLike';
import { motion } from 'framer-motion';

export default function Home() {
  const carouselRef = useRef(null);
  const [queries, setQueries] = useState<z.infer<typeof querySchema>[]>([]);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const resolver = zodResolver(messageSchema);
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver,
    defaultValues: {
      content: '',
    },
  });

  // Function to truncate text and add "Read more" if text is longer than specified length
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    const content = data.content;
    setIsSubmiting(true);
    if (!session || !session.user) {
      router.replace('/sign-in');
      return;
    }
    try {
      const response = await axios.post('/api/create-query', 
        { query: content, username: session.user.username }
      );
      toast(response.data.message || "Story shared successfully!");
      form.reset();
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.response?.data.message || "Something went wrong");
      } else {
        toast("Something went wrong!");
      }
    }
    finally {
      setIsSubmiting(false);
    }
  };

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axios.get('/api/famous');
        setQueries(response?.data?.data);
      } catch (error) {
        toast("Something went wrong");
      }
    };
    fetchQueries();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* 3D Model Background */}
      <div className="absolute lg:block hidden left-10 top-40 w-96 h-96 opacity-90">
        <ThreeDModel />
      </div>
      
      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center mb-12">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              The world is full of stories. What's yours?
            </h1>
            <p className="text-base md:text-xl text-gray-700 dark:text-gray-300">
              Share your journey, your passion, your truth - and let the world be a part of it.
            </p>
          </div>
        </section>

        {/* Story Input Section */}
        <section className="max-w-2xl mx-auto mb-12">
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Share Your Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    name="content"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder="What story do you want to share today?" 
                            className="min-h-24 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                    >
                      {isSubmiting ? (
                        <Loader2 className="animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Share Story
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>

        {/* Explore Section */}
        <section className="max-w-4xl mx-auto mb-12 text-center">
          <div className="space-y-4">
            <h2 className="text-xl md:text-3xl font-semibold">
              Dive into our collection of inspiring stories
            </h2>
            <Button 
              onClick={() => router.push('/explore')}
              className="text-base py-4 px-6 md:text-lg md:py-6 md:px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Globe className="mr-2 h-5 w-5" />
              Explore Stories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Featured Stories Carousel - MODIFIED FOR SMALLER HEIGHT */}
        <section className="max-w-3xl mx-auto mb-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">Featured Stories</h2>
          
          {queries.length === 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="p-4 flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-[180px]" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Carousel
                ref={carouselRef}
                plugins={[Autoplay({ delay: 3000 })]}
                className="w-full"
                opts={{ loop: true }}
              >
                <CarouselContent className="px-2">
                  {queries.map((message, index) => (
                    <CarouselItem key={index} className="md:basis-1/1">
                      <div className="p-1 md:p-2">
                        <Card className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-[#1c1c1e]">
                          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#252526] dark:to-[#1c1c1e] px-4 py-3 rounded-t-xl">
                            <CardTitle className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-1.5 rounded-full shadow">
                                  <Mail className="h-4 w-4" />
                                </div>
                                <span className="font-semibold text-gray-800 dark:text-white text-sm">
                                  {message.owner}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTimeAgo(message.createdAt)}
                              </span>
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="px-4 pt-3 pb-3">
                            <div>
                              {expandedMessage === message._id ? (
                                <p className="text-sm md:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                                  {message.title}
                                </p>
                              ) : (
                                <p className="text-sm sm:block md:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                                  {truncateText(message.query, 100)}
                                  {message.query.length > 100 && (
                                    <Button 
                                      variant="link" 
                                      className="text-blue-600 dark:text-blue-400 p-0 h-auto text-sm font-medium"
                                      onClick={() => setExpandedMessage(message._id)}
                                    >
                                      Read more
                                    </Button>
                                  )}
                                </p>
                              )}
                            </div>
                          </CardContent>

                          <CardFooter className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 px-4 py-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                              Story #{index + 1}
                            </div>
                            <div className="flex items-center gap-2">
                              <QueryLike like={message.likes} queryId={message._id} />
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 p-1 h-7"
                                onClick={() => router.push(`/story/${message._id}`)}
                              >
                                View <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Controls */}
                <div className="flex justify-center mt-2 gap-2">
                  <CarouselPrevious className="transform-none bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full h-8 w-8 shadow" />
                  <CarouselNext className="transform-none bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full h-8 w-8 shadow" />
                </div>
          </Carousel>

          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            © 2025 View Point. All rights reserved.
          </div>
          <div className="mt-3 flex justify-center space-x-4 text-sm">
            <Link href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              About
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              Privacy
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              Terms
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}