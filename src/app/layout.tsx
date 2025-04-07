import AuthProvider from "@/context/AuthProvider"
import './globals.css'
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar"
import { ThemeProvider } from "@/context/ThemeProvider"

export const metadata = {
  title: 'viewpoint',
  description: 'social media app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
    <html lang="en"  suppressHydrationWarning={true} > 
      <head>
      <title>{metadata.title}</title>
            <meta name="description" content={metadata.description} />
            {/* Favicon */}
            <link rel="icon" href="/logo.ico" />
            {/* Optionally, you can add an apple-touch-icon */}
            <link rel="apple-touch-icon" href="/logo.ico" />
      </head> 
      <body className="min-h-screen">
      <ThemeProvider attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
        <Navbar ></Navbar>
        {children}
        </ThemeProvider>
      <Toaster/>
      </body>
    </html>
    </AuthProvider>
  )
}
