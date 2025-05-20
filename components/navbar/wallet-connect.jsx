"use client"

import { useState, useEffect } from "react"
import { Wallet, Loader2, MoveRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function WalletConnect() {
  const [address, setAddress] = useState(null)
  const [balance, setBalance] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter();

  useEffect(() => {
    // Check if wallet is already connected
    checkConnection()
  }, [])

  const checkConnection = async () => {
    // Check if ethereum is available (MetaMask or other wallet)
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        // Get connected accounts
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        router.push(`?address=${accounts[0]}`)
        if (accounts.length > 0) {
          setAddress(accounts[0])
          fetchBalance(accounts[0])
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const fetchBalance = async (account) => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        })
        // Convert from wei to ETH
        const ethBalance = Number.parseInt(balance, 16) / 1e18
        setBalance(ethBalance.toFixed(4))
      } catch (error) {
        console.error("Error fetching balance:", error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      setIsConnecting(true)
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        router.push(`/?address=${accounts[0]}`)
        setAddress(accounts[0])
        fetchBalance(accounts[0])
        toast("Wallet Connected", {
          description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
        })
      } catch (error) {
        console.error("Error connecting wallet:", error)
        toast("Connection Failed",{
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsConnecting(false)
      }
    } else {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Web3 wallet to continue.",
        variant: "destructive",
      })
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    setBalance(null)
    toast("Wallet Disconnected", {
      description: "Your wallet has been disconnected.",
    })
  }

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div>
      {!address ? (
        <Button onClick={connectWallet} disabled={isConnecting}>
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </>
          )}
        </Button>
      ) : (
        <div className="flex items-center space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline"  className="bg-purple-50 text-purple-700 hover:bg-purple-100">
              <Wallet className="mr-2 h-4 w-4" />
              {formatAddress(address)}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Wallet Connected</DialogTitle>
              <DialogDescription>Your wallet is connected to MetaEstate</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Address</p>
                <p className="rounded-md bg-muted p-2 text-sm">{address}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Balance</p>
                <p className="rounded-md bg-muted p-2 text-sm">{balance} ETH</p>
              </div>
              {/* <div className="space-y-2">
                <p className="text-sm font-medium">Network</p>
                <p className="rounded-md bg-muted p-2 text-sm">Ethereum Mainnet</p>
              </div> */}
            </div>
            <Button variant="outline" onClick={disconnectWallet} className="w-full">
              Disconnect Wallet
            </Button>
          </DialogContent>
        </Dialog>
        </div>
      )}
    </div>
  )
}

