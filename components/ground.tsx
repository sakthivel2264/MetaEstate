"use client"

import { useRef } from "react"

export default function Ground() {
  const groundRef = useRef()

  return (
    <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#7caa69" />
    </mesh>
  )
}
