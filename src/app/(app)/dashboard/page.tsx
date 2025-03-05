'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Query } from '@/model/Query'
import { User } from '@/model/User'
import { ApiResponse } from '@/types/ApiResponse'
import { Separator } from '@radix-ui/react-separator'
import axios from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

function dashboard() {
  const [queries , setQueries] = useState<Query[]>([])
  const [isLoading,setIsLoading] = useState(false)

  const handleDeleteQuery = (queryId : string)=>{
    setQueries(queries.filter((query)=>query._id !== queryId))
  }

  const {data : session} = useSession()

  const fetchQueries =  useCallback(async(refresh : boolean =false)=>{
      setIsLoading(true)
      try{
        const response = await axios.get<ApiResponse>('/api/get-queries');
        setQueries(response.data.data|| [])
        if(refresh){
          toast("refreshed Posts") 
        }
      }catch(error){
        if(axios.isAxiosError(error)){
          toast(error.response?.data.message)
        }
      }finally{
        setIsLoading(false)
      }
  } ,[setIsLoading ,setQueries])

  useEffect(()=>{
      if(!session || !session.user){
        return 
      }
      fetchQueries()
  },
  [session , fetchQueries])
  
  if(!session || !session.user){
    return <div>Please Login</div>
  }

  const {username} = session.user as User

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`; 

  const copyToClipboard = ()=>{
    navigator.clipboard.writeText(profileUrl)
    toast(
      "URL copied!" , {description : 'Profile URL has been copied to clipboard.'}
    )
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchQueries(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {queries.length > 0 ? (
          queries.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteQuery}
            />
          ))
        ) : (
          <p>No queries to display.</p>
        )}
      </div>
    </div>
  )
}
 
export default dashboard