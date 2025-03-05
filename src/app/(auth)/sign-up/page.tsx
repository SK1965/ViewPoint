'use client'
//form components from shadcn
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {Loader2} from 'lucide-react'

import { useDebounceCallback} from 'usehooks-ts'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios  from 'axios'


export default function page() {
  const [username , setUsername] = useState('')
  const [usernameMessage , setUsernameMessage]= useState('')
  const [isCheckingUsername , setIsCheckingUsername] = useState(false)
  const [isSubmitting , setIsSubmiting] = useState(false)

  const debounced = useDebounceCallback(setUsername , 700)
  const router = useRouter()

  //zodd implementation
  const form  = useForm<z.infer<typeof signUpSchema>>({
    resolver : zodResolver(signUpSchema) ,
    defaultValues : {
      username :  '' ,
      email : '',
      password : ''
    }

  })

  //username checking using debouncing
  useEffect(()=>{
    const checkUsernameUnique = async ()=>{
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          if (axios.isAxiosError(error)) {
            setUsernameMessage(error.response?.data.message)
          }else{
            setUsernameMessage("something went wrong.")
          }
        }finally{
        setIsCheckingUsername(false)
      }
      }
    }
    checkUsernameUnique()
  },[username])

  const onSubmit  = async (data : z.infer<typeof signUpSchema>)=>{
    setIsSubmiting(true)
    try {
      console.log(data)
      const response = await axios.post('/api/sign-up' , data)
      toast.success("success",{
        description: response.data.message || "signup successfull verify your account now",
        duration: 2000, // Toast stays visible for 2 seconds
      })

      router.replace(`/verify/${username}`)
    } catch (error) {
      if(axios.isAxiosError(error)){
        toast("signup failed",
          {
            description : error.response?.data.message||"signup failed , try again after sime time",
            duration : 2000
          }
        )
      }
      }
    finally{
      setIsSubmiting(false)
    }
  }
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 '>
      <div className = 'w-full  max-w-md p-8 space-y-8 , bg-white rounded-lg  shadow-md'>
        <div className = 'text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            Join ViewPoint
          </h1>
          <p className='mb-4'>Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field}
                onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                }} />
              </FormControl>
              {isCheckingUsername && <Loader2 className ="animate-spin"/>}
              <p className={`text-sm ${usernameMessage === "Username is available" ?'text-green-500' : 'text-red-500'}`} >
                 {usernameMessage}
              </p>
              
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@domain.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type = "password" placeholder="password" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled ={isSubmitting}>
          {
            isSubmitting ? (
              <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait
              </>
            ) : ('Signup')
          }
      </Button>
      </form>
    </Form>
      <div className='text-center mt-4'>
        <p>
          Already a member?{' '}
          <Link href='sign-in' className='text-blue-600 hover:text-blue-800'>
          Sign in
          </Link>
        </p>
      </div>  
      </div>
    </div>
    
  )
}