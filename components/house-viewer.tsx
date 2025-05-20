"use client"

import { Suspense, useState, useEffect, useRef } from "react"
import { OrbitControls, Environment, PerspectiveCamera, Text, AdaptiveDpr } from "@react-three/drei"
import ModernHouse from "./modern-house"
// import { houseData } from "@/lib/house-data"
import ResilientCanvas from "./resilient-canvas"
import { properties } from "./property-list/property-listings-grid"

// Simple fallback component for low-end devices
type LowQualityHouseProps = {
  type: string
  position: [number, number, number]
  color: string
  features: any
  dimensions: { width: number; depth: number }
}

function LowQualityHouse({ type, position, color, features, dimensions }: LowQualityHouseProps) {
  return (
    <group position={position}>
      {/* Simple house representation */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[10, 3, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Simple roof */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[11, 1, 9]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* Ground */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[dimensions.width, dimensions.depth]} />
        <meshStandardMaterial color="#7caa69" />
      </mesh>
    </group>
  )
}

type HouseViewerProps = {
  selectedHouse: number
}

export default function HouseViewer({ selectedHouse }: HouseViewerProps) {
  const house = properties[selectedHouse]
  console.log("Selected House:", house)
  const [showDimensions, setShowDimensions] = useState(false)
  const [isLowPerformance, setIsLowPerformance] = useState(false)
  const [isWebGLAvailable, setIsWebGLAvailable] = useState(true)
  const [hasContextLost, setHasContextLost] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    // Check if WebGL is available
    try {
      const canvas = document.createElement("canvas")
      const isWebGL2Available = !!window.WebGL2RenderingContext && !!canvas.getContext("webgl2")
      const isWebGL1Available =
        !!window.WebGLRenderingContext && (!!canvas.getContext("webgl") || !!canvas.getContext("experimental-webgl"))

      if (!isWebGL1Available && !isWebGL2Available) {
        setIsWebGLAvailable(false)
      }

      // Detect low-end devices based on user agent or memory
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      if (isMobile || (navigator.deviceMemory && navigator.deviceMemory < 4)) {
        setIsLowPerformance(true)
      }
    } catch (e) {
      console.error("Error detecting WebGL:", e)
      setIsWebGLAvailable(false)
    }
  }, [])

  // Handle WebGL context loss
  const handleContextLost = (event) => {
    event.preventDefault()
    console.warn("WebGL context lost")
    setHasContextLost(true)
  }

  const handleContextRestored = () => {
    console.log("WebGL context restored")
    setHasContextLost(false)
  }

  if (!isWebGLAvailable || hasContextLost) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-4">
          <h2 className="text-xl font-bold text-red-600">
            {hasContextLost ? "WebGL Context Lost" : "WebGL Not Available"}
          </h2>
          <p className="mt-2">
            {hasContextLost
              ? "The 3D rendering context was lost. This might be due to memory constraints or device limitations."
              : "Your browser or device doesn't support WebGL, which is required to view 3D models."}
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-md">
        <div className="text-sm font-medium">
          <div>
            Property Size: {house.dimensions.width}m × {house.dimensions.depth}m
          </div>
          <div>Total Area: {house.dimensions.width * house.dimensions.depth}m²</div>
        </div>
      </div>

      <Suspense fallback={<LoadingView />}>
        <ResilientCanvas
          lowPerformance={isLowPerformance}
          fallback={
            <div className="p-4 text-center">
              <img
                src={house.thumbnail || "/placeholder.svg?height=400&width=600"}
                alt={house.name}
                className="max-w-full h-auto rounded-lg mx-auto mb-4"
              />
              <p className="text-gray-600">Showing static image due to rendering limitations.</p>
            </div>
          }
        >
          <PerspectiveCamera makeDefault position={[20, 15, 20]} fov={60} />
          <color attach="background" args={["#f5f5f5"]} />

          <ambientLight intensity={0.5} />
          <directionalLight
            castShadow
            position={[10, 10, 10]}
            intensity={1.5}
            shadow-mapSize-width={isLowPerformance ? 512 : 1024}
            shadow-mapSize-height={isLowPerformance ? 512 : 1024}
            shadow-camera-far={50}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
          />

          {isLowPerformance ? (
            <LowQualityHouse
              type={house.type}
              position={[0, 0, 0]}
              color={house.color}
              features={house.features}
              dimensions={house.dimensions}
            />
          ) : (
            <ModernHouse
              type={house.type}
              position={[0, 0, 0]}
              color={house.color}
              features={house.features}
              dimensions={house.dimensions}
            />
          )}

          {/* Property dimension markers */}
          <Text position={[0, 1, -house.dimensions.depth / 2 - 2]} rotation={[0, 0, 0]} fontSize={1.5} color="red">
            {house.dimensions.width}m
          </Text>

          <Text
            position={[house.dimensions.width / 2 + 2, 1, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            fontSize={1.5}
            color="red"
          >
            {house.dimensions.depth}m
          </Text>

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="#e0e0e0" />
          </mesh>

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={50}
            target={[0, 2, 0]}
          />

          {!isLowPerformance ? (
            // Simple environment for low-end devices
            <hemisphereLight intensity={1} groundColor="#876a3c" />
          ) : (
            <Environment preset="sunset" />
          )}

          {!isLowPerformance && <fog attach="fog" args={["#f5f5f5", 50, 100]} />}

          {/* Performance optimization components */}
          <AdaptiveDpr pixelated />
        </ResilientCanvas>
      </Suspense>

      {isLowPerformance && (
        <div className="absolute bottom-4 left-4 z-10 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md text-sm">
          Running in low-performance mode for better compatibility
        </div>
      )}
    </div>
  )
}

function LoadingView() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading 3D View...</p>
      </div>
    </div>
  )
}
