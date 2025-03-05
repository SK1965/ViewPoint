"use client"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut} from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {
    const {data : session} = useSession()
    const user : User = session?.user as User

  return (
    <nav className='p-4 md:p-6 shadow-md bg-slate-600 z-10'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <a href="#" className='text-xl fold-bold mb-4 md:mb-0'>ViewPoint</a>
            { 
                session ? (
                    <>
                    <span className='mr-4'>welcome, {user?.username ||user?.email} </span>
                    <Button onClick={()=>signOut()} className='w-full md:w-auto'>Signout</Button>
                    </>
                ) :(
                    <Link href='/sign-in'>
                        <Button className='w-full md:w-auto'>Signin</Button>
                        </Link>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar