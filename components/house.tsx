"use client"

import { useRef } from "react"
import { Box, Cone } from "@react-three/drei"

export default function House({ position = [0, 0, 0], color = "#f5d0c5", scale = [1, 1, 1], rotation = [0, 0, 0] }) {
  const houseRef = useRef()

  return (
    <group ref={houseRef} position={position} scale={scale} rotation={rotation}>
      {/* Main house structure */}
      <Box args={[4, 3, 4]} position={[0, 1.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} />
      </Box>

      {/* Roof */}
      <Cone args={[3.5, 2, 4]} position={[0, 4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <meshStandardMaterial color="#8B4513" />
      </Cone>

      {/* Door */}
      <Box args={[1, 2, 0.1]} position={[0, 1, 2.05]} castShadow>
        <meshStandardMaterial color="#5c3a21" />
      </Box>

      {/* Windows */}
      <Box args={[1, 1, 0.1]} position={[-1.5, 1.5, 2.05]} castShadow>
        <meshStandardMaterial color="#add8e6" />
      </Box>

      <Box args={[1, 1, 0.1]} position={[1.5, 1.5, 2.05]} castShadow>
        <meshStandardMaterial color="#add8e6" />
      </Box>

      {/* Side windows */}
      <Box args={[0.1, 1, 1]} position={[2.05, 1.5, 0]} castShadow>
        <meshStandardMaterial color="#add8e6" />
      </Box>

      <Box args={[0.1, 1, 1]} position={[-2.05, 1.5, 0]} castShadow>
        <meshStandardMaterial color="#add8e6" />
      </Box>
    </group>
  )
}
