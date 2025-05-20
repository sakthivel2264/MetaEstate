"use client";

import React from 'react'
import { MainNav } from './main-nav'
import { WalletConnect } from './wallet-connect'
import { UserNav } from './user-nav'
import { Button } from '../ui/button'
import { useSearchParams } from 'next/navigation';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const searchParams = useSearchParams();
  const address = searchParams.get('address');
  const router = useRouter();


  return (
    <div>
        <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between">
            <div className="container flex h-16 items-center">
                <MainNav />
            </div>
            <div className="mx-10 flex items-center space-x-4">
              <SignedOut>
              <SignInButton className="h-10 w-24 cursor-pointer border-2 rounded-md px-4 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100" />
              <SignUpButton className="h-10 w-24 cursor-pointer border-2 rounded-md px-4 py-1.5 flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white" />
            </SignedOut>
            <SignedIn>
              {address && <Button className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 cursor-pointer" onClick={() => router.push(`/marketplace?address=${address}`)}>Start Buying</Button>}
              <WalletConnect />
              <UserButton />
            </SignedIn>
            </div>
        </header>
    </div>
  )
}

export default Navbar