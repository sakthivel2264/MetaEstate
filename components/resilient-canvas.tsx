"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import LoadingScreen from "./loading-screen"

interface ResilientCanvasProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  lowPerformance?: boolean
}

export default function ResilientCanvas({ children, fallback, lowPerformance = false }: ResilientCanvasProps) {
  const [contextLost, setContextLost] = useState(false)
  const [recoveryAttempts, setRecoveryAttempts] = useState(0)
  const [fatalError, setFatalError] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current

    const handleContextLost = (event: Event) => {
      event.preventDefault()
      console.warn("WebGL context lost")
      setContextLost(true)
    }

    const handleContextRestored = () => {
      console.log("WebGL context restored")
      setContextLost(false)
      setRecoveryAttempts((prev) => prev + 1)
    }

    canvas.addEventListener("webglcontextlost", handleContextLost)
    canvas.addEventListener("webglcontextrestored", handleContextRestored)

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost)
      canvas.removeEventListener("webglcontextrestored", handleContextRestored)
    }
  }, [canvasRef.current])

  // If we've tried to recover too many times, show a fatal error
  useEffect(() => {
    if (recoveryAttempts >= 3) {
      setFatalError(true)
    }
  }, [recoveryAttempts])

  // Attempt to recover by forcing a new canvas instance
  useEffect(() => {
    if (contextLost && !fatalError) {
      const recoveryTimer = setTimeout(() => {
        // Force React to create a new Canvas instance
        setContextLost(false)
      }, 2000)

      return () => clearTimeout(recoveryTimer)
    }
  }, [contextLost, fatalError])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (fatalError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-6 max-w-md bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-3">3D Rendering Error</h2>
          <p className="mb-4">
            We're having trouble rendering the 3D view on your device. This might be due to memory constraints or device
            limitations.
          </p>
          {fallback ? (
            <div className="mt-4">{fallback}</div>
          ) : (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    )
  }

  if (contextLost) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-6">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Recovering 3D View...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait a moment</p>
        </div>
      </div>
    )
  }

  return (
    <Canvas
      ref={canvasRef}
      shadows
      dpr={lowPerformance ? 1 : [1, 2]} // More conservative DPR handling
      gl={{
        antialias: !lowPerformance,
        powerPreference: "default", // Less aggressive power preference
        alpha: false,
        stencil: false,
        depth: true,
        preserveDrawingBuffer: true, // Help with context restoration
        failIfMajorPerformanceCaveat: false, // Don't fail on low-end devices
      }}
      onCreated={({ gl }) => {
        // In React Three Fiber, gl is a THREE.WebGLRenderer, not a raw WebGL context
        // We need to access the underlying WebGL context through the domElement
        const canvas = gl.domElement

        // Store a reference to the canvas for context loss handling
        canvasRef.current = canvas

        // We don't need to manually enable the context loss extension here
        // as it's handled by the event listeners we set up in the useEffect
      }}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
    >
      {children}
    </Canvas>
  )
}
