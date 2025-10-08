import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import { Providers } from "@/components/providers/Providers"
import { Toaster } from "react-hot-toast"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "CVHS Community Service Hours",
    template: "%s | CVHS Community Service",
  },
  description: "Track and manage community service hours for CVHS students",
  keywords: ["community service", "volunteer hours", "CVHS", "student tracking"],
  authors: [{ name: "CVHS" }],
  openGraph: {
    title: "CVHS Community Service Hours",
    description: "Track and manage community service hours for CVHS students",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Providers>
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </AuthProvider>
        </Providers>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
