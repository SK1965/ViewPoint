"use client"

import { Moon, Sun, Menu, UserRound } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from 'react'
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
    const user = session?.user as User
    const { setTheme } = useTheme()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    // Add mounted state to prevent hydration mismatch
    const [mounted, setMounted] = useState(false)

    // Effect to set mounted state after hydration
    useEffect(() => {
        setMounted(true)
    }, [])

    const toggleMenu = () => setIsMenuOpen(prev => !prev)
    
    const handleSignOut = () => signOut()
    
    const navigateToDashboard = () => router.push('/dashboard')

    // Theme options for reuse
    const themeOptions = [
        { name: "Light", action: () => setTheme("light") },
        { name: "Dark", action: () => setTheme("dark") },
        { name: "System", action: () => setTheme("system") }
    ]

    // Theme toggle button component for reuse
    const ThemeToggle = ({ className = "" }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className={className}>
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {themeOptions.map((option) => (
                    <DropdownMenuItem key={option.name} onClick={option.action}>
                        {option.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )

    return (
        <nav className="sticky top-0 bg-background p-3 px-6 shadow-md z-50 border-b">
            <div className=" mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold hover:text-primary transition-colors">
                    View Point
                </Link>
                
                {/* Mobile menu button */}
                <div className="md:hidden">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
                        aria-label="Toggle menu"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
                
                {/* Desktop menu */}
                <div className="hidden md:flex items-center space-x-12">
                    {mounted && <ThemeToggle className="h-9 w-9 rounded-full" />}

                    {mounted && session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full p-0 border-2">         
                                    <UserRound className="h-5 w-5" />
                                    <span className="sr-only">User menu</span>                   
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={navigateToDashboard} className="cursor-pointer">
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/subscription')}>
                                    Subscription
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer focus:bg-background">
                                    <Button onClick={handleSignOut} className="w-full" variant="destructive" size="sm">
                                        Sign Out
                                    </Button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : mounted ? (
                        <Link href="/sign-in">
                            <Button variant="default" size="sm">Login</Button>
                        </Link>
                    ) : (
                        <div className="h-10 w-16 animate-pulse rounded-md bg-muted" />
                    )}
                </div>
            </div>
            
            {/* Mobile menu dropdown */}
            {isMenuOpen && mounted && (
                <div 
                    id="mobile-menu"
                    className="md:hidden absolute right-4 mt-2 w-60 bg-background rounded-md shadow-lg border border-border"
                >
                    <div className="flex flex-col space-y-3 p-4">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Theme</span>
                            <ThemeToggle />
                        </div>
                        
                        <div className="h-px bg-border my-1" />
                        
                        {session ? (
                            <>
                                <div className="flex items-center space-x-2">
                                    <UserRound className="h-4 w-4" />
                                    <span className="text-sm font-medium truncate">
                                        {user?.username || user?.email || 'User'}
                                    </span>
                                </div>
                                
                                <Button size="sm" onClick={navigateToDashboard} variant="outline" className="w-full justify-start">
                                    Profile
                                </Button>
                                
                                <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => router.push('/subscription')}>
                                    Subscription
                                </Button>
                                
                                <Button size="sm" onClick={handleSignOut} variant="destructive" className="w-full">
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <Link href="/sign-in" className="w-full">
                                <Button size="sm" variant="default" className="w-full">
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