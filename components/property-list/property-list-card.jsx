"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CuboidIcon as Cube, Expand, Heart, Info, MapPin, Share2, Wallet } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"


export default function PropertyListingCard({
  id = "meta-123",
  name = "Crystal Oasis Villa",
  image = "/placeholder.svg?height=400&width=600",
  location = "Decentraland, Genesis Plaza",
  price = 1.25,
  currency = "ETH",
  size = 1024,
  features = ["Waterfront", "Custom Build", "Commercial Rights"],
  owner = {
    name: "MetaBuilder",
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
  },
  chain = "Ethereum",
  tokenId = "0x1a2b3c4d5e6f",
  liked = false,
}) {
  const [isLiked, setIsLiked] = useState(liked)
  const router = useRouter()

  return (
    <Link
      href={`/marketplace/${id}`}
      className="block transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 rounded-lg"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-200/20 border-slate-200 bg-gradient-to-br from-white to-slate-50 ">
        <div className="relative">
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/40"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`} />
                    <span className="sr-only">Like property</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isLiked ? "Remove from favorites" : "Add to favorites"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/40"
                  >
                    <Share2 className="h-4 w-4 text-white" />
                    <span className="sr-only">Share property</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this property</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="absolute bottom-2 left-2 z-10">
            <Badge variant="secondary" className="bg-black/30 text-white backdrop-blur-md hover:bg-black/40">
              <Cube className="mr-1 h-3 w-3" />
              {chain}
            </Badge>
          </div>

          <div className="group relative h-[200px] overflow-hidden">
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
            >
              <Expand className="h-4 w-4" />
              <span className="sr-only">View in metaverse</span>
            </Button>
          </div>
        </div>

        <CardHeader className="pb-2 pt-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg leading-tight">{name}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="mr-1 h-3.5 w-3.5" />
                {location}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="font-bold text-lg">
                {price} {currency}
              </div>
              <div className="text-xs text-muted-foreground">≈ ${(price * 3500).toLocaleString()}</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3 pt-0">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {features.map((feature, index) => (
              <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                {feature}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <img src={owner.avatar || "/placeholder.svg"} alt={owner.name} className="h-5 w-5 rounded-full" />
              <span className="text-muted-foreground">by</span>
              <span className="font-medium">{owner.name}</span>
              {owner.verified && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white">
                        <Info className="h-2.5 w-2.5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Verified Creator</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="text-muted-foreground">
              <span>{size} m²</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 pt-0">
          <Button className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <Wallet className="mr-2 h-4 w-4" />
            Buy Now
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => router.push(`/metaverse`)}>
            View in Metaverse
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
