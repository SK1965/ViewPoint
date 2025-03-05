'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'

const SigninPage =()=>{
  const [isSubmiting , setIsSubmiting] = useState(false)
  const router = useRouter() 
  const form  = useForm<z.infer<typeof signInSchema>>({
        resolver : zodResolver(signInSchema) ,
        defaultValues :{
          identifier : '',
          password : ''
        }
      })

  const onSubmit =async (data :z.infer<typeof signInSchema>)=>{ 
    setIsSubmiting(true)
    const response = await signIn('credentials' ,{
      identifier : data.identifier ,
      password : data.password
    })
    if(response?.error){
      toast("Login Failed" , {duration : 2000})
    }
    if(response?.url){
      router.push('/dashboard')
    }
    
    console.log(response)
    setIsSubmiting(false)

  }
  
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 '>
    <div className = 'w-full  max-w-md p-8 space-y-8 , bg-white rounded-lg  shadow-md'>
      <div className = 'text-center'>
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
                <FormLabel>Username/Email :</FormLabel>
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
                <FormLabel>Password :</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">{isSubmiting ? <Loader2/>:"Submit"}</Button>
        </form>
      </Form>
    </div>
  </div>
  )
}

export default SigninPage