import Link from "next/link"
import { Building2, Grid3X3, LayoutGrid, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/navbar/navBar"
import { WalletConnect } from "@/components/navbar/wallet-connect"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar/>
      <main className="grid mt-16 ">
        <section className="w-full px-4 py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="px-6 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Discover Real Estate in the Metaverse
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Buy, sell, and rent properties as NFTs across multiple platforms.
                </p>
              </div>
              <div className="w-full max-w-md space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for properties, locations, or worlds..."
                    className="w-full bg-background pl-8 pr-4"
                  />
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <WalletConnect/>
                <Button variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">Learn About NFT Properties</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="px-4 md:px-6">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Featured NFT Properties</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </div>
              <Tabs defaultValue="grid">
                <div className="flex justify-end mb-4">
                  <TabsList className="grid w-16 grid-cols-2">
                    <TabsTrigger value="grid">
                      <LayoutGrid className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="list">
                      <Grid3X3 className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="grid" className="mt-0">
                  {/* <NFTGallery /> */}
                </TabsContent>
                <TabsContent value="list" className="mt-0">
                  <div className="grid gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex items-center gap-4">
                            <div className="w-[120px] h-[120px] relative">
                              <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                  backgroundImage: `url(/placeholder.svg?height=120&width=120)`,
                                }}
                              />
                            </div>
                            <div className="flex-1 p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold">NFT Property #{i + 1}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {["Decentraland", "The Sandbox", "Somnium Space", "CryptoVoxels"][i % 4]}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{(Math.random() * 10 + 1).toFixed(1)} ETH</p>
                                  <p className="text-sm text-muted-foreground">Token ID: #{i + 1001}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-2 bg-muted/50">
                          <Button asChild variant="ghost" size="sm" className="ml-auto">
                            <Link href={`/property/${i + 1}`}>View Details</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-center">
                <Button variant="outline">Load More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Browse by Metaverse</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground">
                  Explore NFT properties across different metaverse platforms
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { name: "Decentraland", count: 156 },
                  { name: "The Sandbox", count: 243 },
                  { name: "Somnium Space", count: 87 },
                  { name: "CryptoVoxels", count: 124 },
                ].map((platform) => (
                  <Card key={platform.name} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center space-y-2">
                        <Building2 className="h-10 w-10" />
                        <h3 className="font-semibold">{platform.name}</h3>
                        <p className="text-sm text-muted-foreground">{platform.count} NFT properties</p>
                      </div>
                    </CardContent>
                    <CardFooter className="p-0">
                      <Button asChild variant="ghost" className="w-full rounded-none">
                        <Link href={`/platform/${platform.name.toLowerCase().replace(" ", "-")}`}>Browse</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            © 2025 MetaVerse RealEstate Marketplace. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

