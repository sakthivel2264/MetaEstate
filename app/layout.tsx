
import './globals.css'
import { Toaster } from "@/components/ui/sonner"
import { Suspense } from "react";
import FloatingChatbot from "@/components/floatingchatbot";
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: "MetaVerse RealEstate Marketplace",
  description: "A Nextjs APP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
        <Suspense>
          {children}
          <FloatingChatbot/>
        </Suspense>
        <Toaster />
        </body>
    </html>
    </ClerkProvider>
  )
}
