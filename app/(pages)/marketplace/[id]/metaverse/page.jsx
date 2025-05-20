"use client"

import { use, useState } from "react"
import HouseViewer from "@/components/house-viewer"
import Navbar from "@/components/navbar/navBar"
import { properties } from "@/components/property-list/property-listings-grid";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Home({params}) {
  const { id } = use(params);
  console.log(id)
  const index = properties.findIndex((property) => property.id === id);
  return (
    <div>
      <Link href={`/marketplace/${id}`} className="absolute top-18 left-5 z-10">
				<Button className="flex items-center gap-2 bg-transparent text-white flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:text-white">
					<ArrowLeft className="h-4 w-4" /> Back
				</Button>
			</Link>
      <Navbar/>
      <main className="h-[95vh] m-1 bg-gradient-to-b from-gray-50 to-gray-100 pt-8 md:pt-8 mt-10">
        {/* 3D Viewer */}
          <HouseViewer selectedHouse={index} />
      </main>
    </div>
  )
}
