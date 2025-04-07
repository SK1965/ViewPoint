'use client'

import { Loader2 } from "lucide-react"
import {  SessionProvider } from "next-auth/react"
import { Suspense } from "react"

export default function AuthProvider({
  children
} : { children: React.ReactNode }) {
  return (
    <SessionProvider  >
      <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin"></Loader2></div>}>
          {children}
      </Suspense>
    </SessionProvider>
  )
}