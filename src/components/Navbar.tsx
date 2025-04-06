"use client"
import { Moon, Sun, Menu, UserRound } from "lucide-react"
import { useTheme} from "next-themes"
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

const Navbar = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const user: User = session?.user as User
    const { setTheme } = useTheme()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <nav className='p-2 md:p-3 shadow-md z-10 '>
            <div className="lg:mx-14 flex justify-between items-center">
                <a href="#" className="text-xl font-bold">
                    View Point
                </a>
                
                {/* Mobile menu button - visible on small screens */}
                <div className="block md:hidden">
                    <Button 
                        variant="ghost" 
                        size="lg" 
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <Menu className="h-8 w-8" />
                    </Button>
                </div>
                
                {/* Desktop menu - hidden on mobile, visible on md and above */}
                <div className="hidden md:flex items-center space-x-6">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-10 w-10 p-0 rounded-full" >
                                <Sun className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {session ? (
                        <div className="text-center">
                            <DropdownMenu >
                                <DropdownMenuTrigger asChild>
                                <div className="p-2 rounded-full border-2 ">         
                                    <UserRound className="w-6 h-6" />                    
                                </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => router.replace('/dashboard')}>
                                        profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                                        subscription
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() =>signOut()}>
                                    <Button>
                                        SignOut
                                    </Button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <Link href="/sign-in">
                            <Button variant='outline' className="bg-slate-100 text-black">Login</Button>
                        </Link>
                    )}
                </div>
            </div>
            
            {/* Mobile menu dropdown - toggle visibility based on isMenuOpen */}
            {isMenuOpen && (
                <div className="md:hidden absolute w-48 top-16  right-12   shadow-lg border-2 border-accent">
                    <div className="flex flex-col justify-center space-y-4 p-4">
                        {/* Mobile theme toggle */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="">
                                    <Sun className=" rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute  rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    Light
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    Dark
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    System
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile login/logout */}
                        {session ? (
                            <>
                                <div className="text-center">
                                    Welcome, {user.username || user.email}
                                </div>
                                <Button onClick={() => signOut()} variant='outline' className="bg-slate-100 text-black w-full">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link href="/sign-in" className="w-full">
                                <Button variant='outline' className="align-middle">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
