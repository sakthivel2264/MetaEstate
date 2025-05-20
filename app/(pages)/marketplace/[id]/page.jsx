"use client";

import Web3 from 'web3';
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowLeft,
  Eye,
  GalleryHorizontal,
  Heart,
  History,
  Info,
  MapPin,
  Share2,
  Tag,
  User,
  Wallet,
} from "lucide-react"
import Navbar from "@/components/navbar/navBar"
import { useRouter } from "next/navigation"
import { use } from 'react';
import { useState, useEffect } from "react";
import Land from '@/app/contracts/Land.json';
import { properties } from '@/components/property-list/property-listings-grid';

// Mock database - in a real app, this would be fetched from your API
const getPropertyData = (id) => {
  const properties = [
    {
      id: "meta-123",
      name: "Crystal Oasis Villa",
      images: [
        "https://images.pexels.com/photos/15461302/pexels-photo-15461302/free-photo-of-palm-tree-neara-house-garage-door.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      location: "Decentraland, Genesis Plaza",
      price: 1.25,
      currency: "ETH",
      size: 1024,
      features: ["Waterfront", "Custom Build", "Commercial Rights"],
      owner: {
        name: "MetaBuilder",
        avatar: "/placeholder.svg?height=100&width=100",
        verified: true,
        joinedSince: "May 2021",
        otherProperties: 8,
      },
      chain: "Ethereum",
      tokenId: "0x1a2b3c4d5e6f",
      description:
        "Crystal Oasis Villa is a premium metaverse property located in the heart of Decentraland's Genesis Plaza. This stunning virtual estate features panoramic views of the plaza, custom architecture with crystal-themed design elements, and ample space for commercial or residential use. The property includes full commercial rights, allowing owners to monetize the space through events, advertising, or leasing.",
      parcels: [
        { x: 12, y: 34 },
        { x: 12, y: 35 },
        { x: 13, y: 34 },
        { x: 13, y: 35 },
      ],
      amenities: [
        "Interactive water features",
        "Custom lighting system",
        "Built-in media players",
        "Visitor analytics",
        "Security protocols",
      ],
      history: [
        {
          date: "2023-03-15",
          price: 0.95,
          currency: "ETH",
          from: "0x7a8b9c...",
          to: "0x1d2e3f...",
        },
        {
          date: "2022-09-30",
          price: 0.75,
          currency: "ETH",
          from: "0x4g5h6i...",
          to: "0x7a8b9c...",
        },
      ],
    },
    {
      id: "meta-456",
      name: "Neon District Penthouse",
      images: [
        "https://get.pxhere.com/photo/beach-house-beach-house-garden-backyard-swimming-pool-resort-property-building-real-estate-vacation-eco-hotel-leisure-villa-estate-home-palm-tree-tree-hotel-architecture-resort-town-hacienda-landscape-arecales-seaside-resort-cottage-tropics-1593845.jpg",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      location: "The Sandbox, Alpha District",
      price: 2.75,
      currency: "ETH",
      size: 2048,
      features: ["Skyview", "Fully Furnished", "Event Space"],
      owner: {
        name: "CryptoArchitect",
        avatar: "/placeholder.svg?height=100&width=100",
        verified: true,
        joinedSince: "January 2020",
        otherProperties: 15,
      },
      chain: "Ethereum",
      tokenId: "0x7e8d9c0b2a1f",
      description:
        "Located in the bustling Alpha District of The Sandbox, this Neon District Penthouse offers unparalleled views and premium virtual real estate. The fully furnished property comes equipped with customizable spaces perfect for hosting events, displaying NFT collections, or creating immersive experiences. With its strategic location near major attractions, this property represents a prime investment opportunity in the metaverse.",
      parcels: [
        { x: 87, y: 45 },
        { x: 87, y: 46 },
        { x: 87, y: 47 },
        { x: 88, y: 45 },
        { x: 88, y: 46 },
        { x: 88, y: 47 },
      ],
      amenities: [
        "Holographic displays",
        "Interactive furniture",
        "Private elevator",
        "NFT gallery walls",
        "Social gathering spaces",
        "Digital concierge",
      ],
      history: [
        {
          date: "2023-07-21",
          price: 2.45,
          currency: "ETH",
          from: "0x3e4f5g...",
          to: "0x8h9i0j...",
        },
        {
          date: "2022-11-12",
          price: 1.85,
          currency: "ETH",
          from: "0x5k6l7m...",
          to: "0x3e4f5g...",
        },
      ],
    },
    {
      id: "meta-789",
      name: "Quantum Gardens Estate",
      images: [
        "https://content.mediastg.net/dyna_images/mls/10313/584472.jpgx?h=540&d=2024-12-13T01:04:08.4630000",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      location: "Somnium Space, Central Hub",
      price: 0.85,
      currency: "ETH",
      size: 512,
      features: ["Garden", "Art Gallery", "NFT Display"],
      owner: {
        name: "VirtualDreamer",
        avatar: "/placeholder.svg?height=100&width=100",
        verified: false,
        joinedSince: "August 2021",
        otherProperties: 3,
      },
      chain: "Ethereum",
      tokenId: "0x3d4e5f6a7b8c",
      description:
        "Quantum Gardens Estate is a unique property in Somnium Space featuring an enchanting virtual garden with interactive flora and fauna. The property includes a dedicated art gallery space perfect for NFT displays and digital exhibitions. Its central location in the Somnium Space hub ensures high foot traffic and visibility, making it ideal for both personal enjoyment and potential commercial applications.",
      parcels: [
        { x: 56, y: 78 },
        { x: 56, y: 79 },
      ],
      amenities: [
        "Interactive botanical garden",
        "Seasonal weather effects",
        "Art exhibition space",
        "Meditation zones",
        "Digital water features",
      ],
      history: [
        {
          date: "2023-05-03",
          price: 0.75,
          currency: "ETH",
          from: "0x9n0o1p...",
          to: "0x2q3r4s...",
        },
      ],
    },
    {
      id: "meta-101",
      name: "Digital Horizon Mansion",
      images: [
        "https://www.palmspringslife.com/wp-content/uploads/data-import/10/10745e2e7859564ee1334479ca4bc458-articleLead-PSLITHouse-2730-Edit-cc.jpg",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      location: "Cryptovoxels, Origin City",
      price: 3.5,
      currency: "ETH",
      size: 4096,
      features: ["Beachfront", "Gaming Arena", "Metaverse HQ"],
      owner: {
        name: "BlockchainDev",
        avatar: "/placeholder.svg?height=100&width=100",
        verified: true,
        joinedSince: "March 2019",
        otherProperties: 22,
      },
      chain: "Ethereum",
      tokenId: "0x9a8b7c6d5e4f",
      description:
        "Digital Horizon Mansion is a sprawling beachfront property in Cryptovoxels' prestigious Origin City. This massive estate features multiple floors with dedicated spaces including a gaming arena, conference facilities, and versatile entertainment areas. As one of the largest properties in the area, it's perfect for organizations looking to establish a metaverse headquarters or investors seeking a landmark virtual real estate holding.",
      parcels: [
        { x: 23, y: 67 },
        { x: 23, y: 68 },
        { x: 23, y: 69 },
        { x: 24, y: 67 },
        { x: 24, y: 68 },
        { x: 24, y: 69 },
        { x: 25, y: 67 },
        { x: 25, y: 68 },
        { x: 25, y: 69 },
      ],
      amenities: [
        "Virtual beachfront access",
        "Multi-purpose gaming arena",
        "Conference facilities",
        "Dedicated server room",
        "Entertainment zones",
        "Trophy display hall",
        "Custom sound system",
      ],
      history: [
        {
          date: "2023-09-18",
          price: 3.25,
          currency: "ETH",
          from: "0x6t7u8v...",
          to: "0x9w0x1y...",
        },
        {
          date: "2023-02-05",
          price: 2.8,
          currency: "ETH",
          from: "0x2z3a4b...",
          to: "0x6t7u8v...",
        },
        {
          date: "2022-07-11",
          price: 2.2,
          currency: "ETH",
          from: "0x5c6d7e...",
          to: "0x2z3a4b...",
        },
      ],
    },
    {
      id: "meta-202",
      name: "Cyber Loft Apartment",
      images: [
        "https://get.pxhere.com/photo/villa-mansion-house-home-pool-swimming-pool-cottage-backyard-property-garden-resort-estate-yard-manor-house-real-estate-dream-home-988252.jpg",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      location: "Decentraland, Fashion District",
      price: 0.65,
      currency: "ETH",
      size: 256,
      features: ["Modern Design", "Retail Space", "Prime Location"],
      owner: {
        name: "MetaFashion",
        avatar: "/placeholder.svg?height=100&width=100",
        verified: false,
        joinedSince: "October 2021",
        otherProperties: 2,
      },
      chain: "Ethereum",
      tokenId: "0x2b3c4d5e6f7a",
      description:
        "This stylish Cyber Loft Apartment is located in Decentraland's exclusive Fashion District, making it perfect for fashion brands, designers, or retail enthusiasts. The modern design features sleek cyberpunk aesthetics with customizable retail display areas. Its prime location ensures high visibility and foot traffic, ideal for showcasing digital fashion items, hosting product launches, or operating a virtual storefront.",
      parcels: [{ x: 34, y: 89 }],
      amenities: [
        "Digital mannequins",
        "Customizable display shelves",
        "Changing room simulation",
        "Runway space",
        "Product showcase lighting",
      ],
      history: [
        {
          date: "2023-04-27",
          price: 0.6,
          currency: "ETH",
          from: "0x8f9g0h...",
          to: "0x1i2j3k...",
        },
      ],
    },
    {
      id: "meta-303",
      name: "Ethereal Heights Tower",
      images: [
        "https://pics.craiyon.com/2023-09-24/2e14c508823b4e29a5a1e1bb91f22d6e.webp",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      location: "The Sandbox, Downtown",
      price: 4.2,
      currency: "ETH",
      size: 3072,
      features: ["Multi-level", "Conference Center", "VR Experience"],
      owner: {
        name: "VRPioneer",
        avatar: "/placeholder.svg?height=100&width=100",
        verified: true,
        joinedSince: "February 2018",
        otherProperties: 37,
      },
      chain: "Ethereum",
      tokenId: "0x8f9e0d1c2b3a",
      description:
        "Ethereal Heights Tower is a prestigious multi-level property in The Sandbox's downtown district. This architectural marvel features multiple floors dedicated to different functions including a state-of-the-art conference center, immersive VR experience zones, and exclusive social spaces. The tower's unique design and central location make it one of the most recognizable landmarks in the metaverse, perfect for businesses looking to make a statement with their virtual presence.",
      parcels: [
        { x: 45, y: 12 },
        { x: 45, y: 13 },
        { x: 45, y: 14 },
        { x: 46, y: 12 },
        { x: 46, y: 13 },
        { x: 46, y: 14 },
      ],
      amenities: [
        "360° observation deck",
        "Holographic presentation system",
        "Virtual reality chambers",
        "Sky garden",
        "Digital waterfall",
        "Private meeting pods",
        "AI-guided tour system",
      ],
      history: [
        {
          date: "2023-08-09",
          price: 4.0,
          currency: "ETH",
          from: "0x4l5m6n...",
          to: "0x7o8p9q...",
        },
        {
          date: "2023-01-17",
          price: 3.5,
          currency: "ETH",
          from: "0x1r2s3t...",
          to: "0x4l5m6n...",
        },
        {
          date: "2022-05-28",
          price: 2.75,
          currency: "ETH",
          from: "0x7u8v9w...",
          to: "0x1r2s3t...",
        },
        {
          date: "2021-11-03",
          price: 1.9,
          currency: "ETH",
          from: "0x2x3y4z...",
          to: "0x7u8v9w...",
        },
      ],
    },
  ]

  return properties.find((property) => property.id === id)
}


export default function PropertyDetail({ params }) {
  const { id } = use(params);
  const property = getPropertyData(id)

  if (!property) {
    notFound()
  }
  const router = useRouter()

  const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
  
    // Contract & Contract States
    const [landContract, setLandContract] = useState(null);
  
    const [cost, setCost] = useState(0);
    const [buildings, setBuildings] = useState(null);
    const [landId, setLandId] = useState(null);
    const [landName, setLandName] = useState(null);
    const [landOwner, setLandOwner] = useState(null);
    const [hasOwner, setHasOwner] = useState(false);
  
    const loadBlockchainData = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
  
        const accounts = await web3.eth.getAccounts();
  
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
  
        const networkId = await web3.eth.net.getId();
  
        const land = new web3.eth.Contract(Land.abi, Land.networks[networkId].address);
        setLandContract(land);
  
        const cost = await land.methods.cost().call();
        setCost(web3.utils.fromWei(cost.toString(), 'ether'));
  
        const buildings = await land.methods.getBuildings().call();
        setBuildings(buildings);
  
        // Event listeners...
        window.ethereum.on('accountsChanged', function (accounts) {
          setAccount(accounts[0]);
        });
  
        window.ethereum.on('chainChanged', (chainId) => {
          window.location.reload();
        });
      }
    };
  
    useEffect(() => {
      loadBlockchainData();
    }, [account]);

    console.log("buildings", buildings)
    // console.log("landId", landId)
    // console.log("landName", landName)
    // console.log("landOwner", landOwner)
    // console.log("hasOwner", hasOwner)
    console.log("account", account)


      const buyHandler = async (_id) => {
		try {
			await landContract.methods.mint(_id).send({ from: account, value: '1000000000000000000' });

			const buildings = await landContract.methods.getBuildings().call();
			setBuildings(buildings);

			setLandName(buildings[_id - 1].name);
			setLandOwner(buildings[_id - 1].owner);
			setHasOwner(true);
		} catch (error) {
			window.alert('Error occurred when buying');
		}
	};

   const propertyIndex = properties.findIndex((property) => property.id === id);

  return (
    <div>
      <Navbar/>
    <main className="container mx-auto px-4 py-8 mt-16">
      <div className="mb-6">
        <Link
          href="/marketplace"
          className="mb-4 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to listings
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{property?.name}</h1>
            <div className="mt-1 flex items-center text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              {property?.location}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Heart className="mr-2 h-4 w-4" />
              Save
            </Button>
           {(() => {
              const propertyIndex = properties.findIndex((property) => property.id === id);
              const currentBuilding = buildings?.[propertyIndex];

              if (!currentBuilding) return null;

              const isAvailable = currentBuilding.owner === '0x0000000000000000000000000000000000000000';
              const isOwner = currentBuilding.owner === account;

              return (
                <>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={isAvailable ? () => buyHandler(propertyIndex + 1) : undefined}
                    disabled={!isAvailable}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    {isAvailable
                      ? `Buy Now (${property?.price} ${property?.currency})`
                      : "Sold Out"}
                  </Button>

                  {isOwner && (
                    <div className="p-1 bg-purple-50 text-green-700 hover:bg-purple-100">
                      You Own This Property
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Property Images Gallery */}
          <div className="mb-8 overflow-hidden rounded-xl border bg-white">
            <div className="relative aspect-video w-full overflow-hidden">
              <img
                src={property?.images[0] || "/placeholder.svg"}
                alt={property?.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 p-2">
              {property?.images.map((image, index) => (
                <div key={index} className="aspect-video cursor-pointer overflow-hidden rounded-md">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${property?.name} view ${index + 1}`}
                    className={`h-full w-full object-cover transition-opacity ${index === 0 ? "ring-2 ring-purple-500" : "opacity-80 hover:opacity-100"}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Property Tabs */}
          <Tabs defaultValue="details" className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="rounded-md border bg-white p-6">
              <h3 className="mb-4 text-xl font-semibold">About This Property</h3>
              <p className="mb-6 text-muted-foreground">{property?.description}</p>

              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-sm text-muted-foreground">Size</div>
                  <div className="font-medium">{property?.size} m²</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-sm text-muted-foreground">Blockchain</div>
                  <div className="font-medium">{property?.chain}</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-sm text-muted-foreground">Token ID</div>
                  <div className="font-medium truncate">{property?.tokenId}</div>
                </div>
              </div>

              <h4 className="mb-3 text-lg font-medium">Metaverse Amenities</h4>
              <ul className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {property?.amenities.map((amenity, index) => (
                  <li key={index} className="flex items-center">
                    <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Info className="h-3 w-3" />
                    </div>
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>

              <Button variant="outline" className="w-full" onClick={() => router.push(`/marketplace/${id}/metaverse`)}>
                <Eye className="mr-2 h-4 w-4" />
                View in Metaverse
              </Button>
            </TabsContent>

            <TabsContent value="features" className="rounded-md border bg-white p-6">
              <h3 className="mb-4 text-xl font-semibold">Property Features</h3>

              <div className="mb-6">
                <h4 className="mb-3 text-lg font-medium">Highlights</h4>
                <div className="flex flex-wrap gap-2">
                  {property?.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="mb-3 text-lg font-medium">Parcel Information</h4>
                <div className="overflow-hidden rounded-md border">
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 font-medium">
                    <div>X Coordinate</div>
                    <div>Y Coordinate</div>
                  </div>
                  <div className="divide-y">
                    {property?.parcels.map((parcel, index) => (
                      <div key={index} className="grid grid-cols-2 gap-2 p-3">
                        <div>{parcel.x}</div>
                        <div>{parcel.y}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <GalleryHorizontal className="mr-2 h-4 w-4" />
                View Parcel Map
              </Button>
            </TabsContent>

            <TabsContent value="location" className="rounded-md border bg-white p-6">
              <h3 className="mb-4 text-xl font-semibold">Metaverse Location</h3>

              <div className="mb-6 aspect-video overflow-hidden rounded-lg bg-slate-100">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto h-12 w-12 text-slate-400" />
                    <p className="mt-2 text-muted-foreground">Map visualization of {property?.location}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="mb-3 text-lg font-medium">Nearby Attractions</h4>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between rounded-md border p-3">
                    <span>Central Plaza</span>
                    <span className="text-sm text-muted-foreground">2 parcels away</span>
                  </li>
                  <li className="flex items-center justify-between rounded-md border p-3">
                    <span>NFT Gallery District</span>
                    <span className="text-sm text-muted-foreground">5 parcels away</span>
                  </li>
                  <li className="flex items-center justify-between rounded-md border p-3">
                    <span>Virtual Concert Arena</span>
                    <span className="text-sm text-muted-foreground">8 parcels away</span>
                  </li>
                </ul>
              </div>

              <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Visit Location
              </Button>
            </TabsContent>

            <TabsContent value="history" className="rounded-md border bg-white p-6">
              <h3 className="mb-4 text-xl font-semibold">Transaction History</h3>

              <div className="mb-6">
                <div className="mb-4 flex items-center">
                  <History className="mr-2 h-5 w-5 text-muted-foreground" />
                  <h4 className="text-lg font-medium">Previous Sales</h4>
                </div>

                <div className="overflow-hidden rounded-md border">
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 font-medium sm:grid-cols-4">
                    <div>Date</div>
                    <div>Price</div>
                    <div className="hidden sm:block">From</div>
                    <div>To</div>
                  </div>
                  <div className="divide-y">
                    {property?.history.map((transaction, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-4">
                        <div>{transaction.date}</div>
                        <div>
                          {transaction.price} {transaction.currency}
                        </div>
                        <div className="hidden truncate sm:block">{transaction.from}</div>
                        <div className="truncate">{transaction.to}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Tag className="mr-2 h-4 w-4" />
                View on Blockchain Explorer
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          {/* Property Price Card */}
          <Card className="mb-6 sticky top-6 border bg-white">
            <div className="p-6">
              <div className="mb-4">
                <div className="text-3xl font-bold">
                  {property?.price} {property?.currency}
                </div>
                <div className="text-sm text-muted-foreground">≈ ${(property?.price * 3500).toLocaleString()}</div>
              </div>
              {(() => {
              const propertyIndex = properties.findIndex((property) => property.id === id);
              const currentBuilding = buildings?.[propertyIndex];

              if (!currentBuilding) return null;

              const isAvailable = currentBuilding.owner === '0x0000000000000000000000000000000000000000';

              return (
                <>
                  <Button
                    className="mb-2 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={isAvailable ? () => buyHandler(propertyIndex + 1) : undefined}
                    disabled={!isAvailable}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    {isAvailable
                      ? `Buy Now (${property?.price} ${property?.currency})`
                      : "Sold Out"}
                  </Button>
                  {isAvailable&& (
                     <Button variant="outline" className="w-full">
                      Make Offer
                    </Button>
                  )}
                </>
              );
            })()}
            </div>

            <Separator />

            <div className="p-6">
              <div className="mb-4 flex items-center">
                <User className="mr-2 h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Owner</h3>
              </div>

              <div className="flex items-center space-x-3">
                <img
                  src={property?.owner.avatar || "/placeholder.svg"}
                  alt={property?.owner.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <div className="flex items-center">
                    <div className="font-medium">{property?.owner.name}</div>
                    {property?.owner.verified && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white">
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
                  <div className="text-sm text-muted-foreground">Member since {property?.owner.joinedSince}</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-muted-foreground">Properties</div>
                  <div className="font-medium">{property?.owner.otherProperties}</div>
                </div>
                <Button variant="outline" size="sm" className="h-auto justify-start py-3">
                  View Profile
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
    </div>
  )
}
