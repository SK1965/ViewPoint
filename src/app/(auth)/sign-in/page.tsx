'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

const SigninPage = () => {
  const [isSubmiting, setIsSubmiting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get the return URL from query parameters, or default to homepage
  const returnUrl = searchParams.get('returnUrl') || '/'

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmiting(true)
    try {
      const response = await signIn('credentials', {
        identifier: data.identifier,
        password: data.password,
        redirect: false // Prevent automatic redirect to handle it manually
      })

      if (response?.error) {
        toast("Login Failed", { 
          description: response.error,
          duration: 2000 
        })
      } else {
        // Show success message
        toast("Login Successful", { 
          duration: 2000,
        })
        
        // Redirect to the return URL or default page
        router.push(returnUrl)
      }
    } catch (error) {
      toast("An unexpected error occurred", { duration: 2000 })
      console.error(error)
    } finally {
      setIsSubmiting(false)
    }
  }
  
  return (
    <div className='flex justify-center items-center min-h-screen border-accent'>
      <div className='w-full max-w-md p-8 space-y-8 border-2 rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            Join ViewPoint
          </h1>
          <p className='mb-4'>Signin to start your anonymous adventure</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username/Email:</FormLabel>
                  <FormControl>
                    <Input placeholder="username/email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password:</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {isSubmiting ? <Loader2 className='animate-spin mr-2'/>:"Sign In"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SigninPage