import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from '@/components/layout/NavBar'
import { ThemeProvider } from "@/components/theme-provider"
import Container from '@/components/Container'
import { Toaster } from "@/components/ui/toaster"
import { CursorProvider } from '@/providers/CursorProvider'
import CustomCursor from '@/components/CustomCursor'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jannicks Hotel',
  description: 'Book a Hotel Room of your dreams',
  icons: {icon: '/logo.png'}
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>

      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
              <main className='flex flex-col min-h-screen bg-secondary'>
                <CursorProvider>
                <NavBar />
                <section className='flex-grow'>
                  <Container>
                    {children}
                    <CustomCursor />
                  </Container>
                </section>
                </CursorProvider>
              </main>
          </ThemeProvider>
        </body>
      </html>

    </ClerkProvider>
  )
}
