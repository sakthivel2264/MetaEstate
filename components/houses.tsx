"use client"

import { useRef } from "react"
import House from "./house"

export default function Houses() {
  const group = useRef()

  // House positions in a circular arrangement
  const positions = [
    [-8, 0, -8], // back left
    [-8, 0, 0], // middle left
    [-8, 0, 8], // front left
    [8, 0, -8], // back right
    [8, 0, 0], // middle right
    [8, 0, 8], // front right
  ]

  // Different colors for each house
  const colors = [
    "#f5d0c5", // Soft pink
    "#d7e5ca", // Light green
    "#c5ddf5", // Light blue
    "#f5ebc5", // Light yellow
    "#e5c5f5", // Light purple
    "#c5f5e8", // Light teal
  ]

  // Different scales for variety
  const scales = [
    [1, 1, 1],
    [1.2, 0.9, 1],
    [0.9, 1.1, 0.9],
    [1.1, 1, 1.1],
    [1, 1.2, 1],
    [0.95, 1.05, 0.95],
  ]

  // Different rotations for variety
  const rotations = [0, Math.PI / 12, -Math.PI / 12, Math.PI / 6, -Math.PI / 6, Math.PI / 8]

  return (
    <group ref={group}>
      {positions.map((position, index) => (
        <House
          key={index}
          position={position}
          color={colors[index]}
          scale={scales[index]}
          rotation={[0, rotations[index], 0]}
        />
      ))}
    </group>
  )
}
