import AuthProvider from "@/context/AuthProvider"

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthProvider>
      <body>{children}</body>
      </AuthProvider>
    </html>
  )
}
