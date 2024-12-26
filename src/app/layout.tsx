import { Navbar } from '@/components/navbar'
import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SecretCord',
  description: 'A secret santa room for you and your friends',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='dark'>
      <body className={`bg-zinc-700 antialiased`}>
        <main className='mx-auto flex h-screen max-w-md flex-col items-center justify-center gap-2 overflow-hidden py-8'>
          <Navbar />
          {children}
        </main>
        <Toaster position='bottom-center' richColors />
      </body>
    </html>
  )
}
