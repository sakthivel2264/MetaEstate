import PropertyListingCard from "./property-list-card"


export const properties = [
    {
      id: "meta-123",
      name: "Crystal Oasis Villa",
      image: "https://images.pexels.com/photos/15461302/pexels-photo-15461302/free-photo-of-palm-tree-neara-house-garage-door.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      location: "Decentraland, Genesis Plaza",
      price: 1.25,
      currency: "ETH",
      size: 1024,
      features: ["Waterfront", "Custom Build", "Commercial Rights"],
      owner: {
        name: "MetaBuilder",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      chain: "Ethereum",
      tokenId: "0x1a2b3c4d5e6f",
      type: "minimal",
      color: "#ffffff",
      features: ["pool", "patio"],
      thumbnail: "/placeholder.svg?height=200&width=300",
      dimensions: { width: 30, depth: 40 },
    },
    {
      id: "meta-456",
      name: "Neon District Penthouse",
      image: "https://get.pxhere.com/photo/beach-house-beach-house-garden-backyard-swimming-pool-resort-property-building-real-estate-vacation-eco-hotel-leisure-villa-estate-home-palm-tree-tree-hotel-architecture-resort-town-hacienda-landscape-arecales-seaside-resort-cottage-tropics-1593845.jpg",
      location: "The Sandbox, Alpha District",
      price: 2.75,
      currency: "ETH",
      size: 2048,
      features: ["Skyview", "Fully Furnished", "Event Space"],
      owner: {
        name: "CryptoArchitect",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      chain: "Ethereum",
      tokenId: "0x7e8d9c0b2a1f",
      type: "beach",
    color: "#f5f5f0",
    features: ["pool", "patio"],
    thumbnail: "/placeholder.svg?height=200&width=300",
    dimensions: { width: 35, depth: 45 },
    },
    {
      id: "meta-789",
      name: "Quantum Gardens Estate",
      image: "https://content.mediastg.net/dyna_images/mls/10313/584472.jpgx?h=540&d=2024-12-13T01:04:08.4630000",
      location: "Somnium Space, Central Hub",
      price: 0.85,
      currency: "ETH",
      size: 512,
      features: ["Garden", "Art Gallery", "NFT Display"],
      owner: {
        name: "VirtualDreamer",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: false,
      },
      chain: "Ethereum",
      tokenId: "0x3d4e5f6a7b8c",
      type: "mountain",
    color: "#e0e0d0",
    features: ["pool", "patio"],
    thumbnail: "/placeholder.svg?height=200&width=300",
    dimensions: { width: 40, depth: 50 },
      
    },
    {
      id: "meta-101",
      name: "Digital Horizon Mansion",
      image: "https://www.palmspringslife.com/wp-content/uploads/data-import/10/10745e2e7859564ee1334479ca4bc458-articleLead-PSLITHouse-2730-Edit-cc.jpg",
      location: "Cryptovoxels, Origin City",
      price: 3.5,
      currency: "ETH",
      size: 4096,
      features: ["Beachfront", "Gaming Arena", "Metaverse HQ"],
      owner: {
        name: "BlockchainDev",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      chain: "Ethereum",
      tokenId: "0x9a8b7c6d5e4f",
       type: "desert",
    color: "#e8e0d5",
    features: ["pool", "patio"],
    thumbnail: "/placeholder.svg?height=200&width=300",
    dimensions: { width: 45, depth: 55 },
    },
    {
      id: "meta-202",
      name: "Cyber Loft",
      image: "https://get.pxhere.com/photo/villa-mansion-house-home-pool-swimming-pool-cottage-backyard-property-garden-resort-estate-yard-manor-house-real-estate-dream-home-988252.jpg",
      location: "Decentraland, Fashion District",
      price: 0.65,
      currency: "ETH",
      size: 256,
      features: ["Modern Design", "Retail Space", "Prime Location"],
      owner: {
        name: "MetaFashion",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: false,
      },
      chain: "Ethereum",
      tokenId: "0x2b3c4d5e6f7a",
      type: "tropical",
    color: "#f0f5f0",
    features: ["pool", "patio"],
    thumbnail: "/placeholder.svg?height=200&width=300",
    dimensions: { width: 50, depth: 60 },
    },
    {
      id: "meta-303",
      name: "Ethereal Heights Tower",
      image: "https://pics.craiyon.com/2023-09-24/2e14c508823b4e29a5a1e1bb91f22d6e.webp",
      location: "The Sandbox, Downtown",
      price: 4.2,
      currency: "ETH",
      size: 3072,
      features: ["Multi-level", "Conference Center", "VR Experience"],
      owner: {
        name: "VRPioneer",
        avatar: "/placeholder.svg?height=40&width=40",
        verified: true,
      },
      chain: "Ethereum",
      tokenId: "0x8f9e0d1c2b3a",
      type: "urban",
    color: "#f0f0f0",
    features: ["pool", "patio"],
    thumbnail: "/placeholder.svg?height=200&width=300",
    dimensions: { width: 35, depth: 35 },
    },
  ]

export default function PropertyListingsGrid() {

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Metaverse Property Listings</h1>
        <p className="text-muted-foreground">Discover and invest in premium virtual real estate across the metaverse</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyListingCard key={property.id} {...property} />
        ))}
      </div>
    </div>
  )
}
