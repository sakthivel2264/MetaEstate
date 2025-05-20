"use client"

import { useRef, useEffect, useState, useMemo } from "react"
import { Box, Cylinder, RoundedBox, Sphere } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

// Create reusable materials with realistic properties
const createMaterials = () => {
  // Building materials
  const concreteWhite = new THREE.MeshStandardMaterial({
    color: "#f5f5f5",
    roughness: 0.7,
    metalness: 0.1,
  })

  const concreteBeige = new THREE.MeshStandardMaterial({
    color: "#e8e0d5",
    roughness: 0.8,
    metalness: 0.05,
  })

  const concreteDark = new THREE.MeshStandardMaterial({
    color: "#555555",
    roughness: 0.75,
    metalness: 0.15,
  })

  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: "#a0a0a0",
    roughness: 0.9,
    metalness: 0.05,
  })

  // Wood materials
  const woodDark = new THREE.MeshStandardMaterial({
    color: "#5c3a21",
    roughness: 0.8,
    metalness: 0.05,
  })

  const woodMedium = new THREE.MeshStandardMaterial({
    color: "#8b4513",
    roughness: 0.85,
    metalness: 0.05,
  })

  const woodLight = new THREE.MeshStandardMaterial({
    color: "#ba8c63",
    roughness: 0.75,
    metalness: 0.05,
  })

  const woodDeck = new THREE.MeshStandardMaterial({
    color: "#9e7e5a",
    roughness: 0.85,
    metalness: 0.05,
  })

  // Glass materials
  const glassBlue = new THREE.MeshStandardMaterial({
    color: "#88c1ff",
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.6,
  })

  const glassClear = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.4,
  })

  // Metal materials
  const metalDark = new THREE.MeshStandardMaterial({
    color: "#333333",
    roughness: 0.3,
    metalness: 0.8,
  })

  const metalLight = new THREE.MeshStandardMaterial({
    color: "#a0a0a0",
    roughness: 0.2,
    metalness: 0.9,
  })

  const metalSilver = new THREE.MeshStandardMaterial({
    color: "#c0c0c0",
    roughness: 0.1,
    metalness: 0.9,
  })

  // Water material
  const waterMaterial = new THREE.MeshStandardMaterial({
    color: "#0077be",
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.8,
  })

  // Landscape materials
  const grassMaterial = new THREE.MeshStandardMaterial({
    color: "#4a7c59",
    roughness: 0.9,
    metalness: 0,
  })

  const grassLightMaterial = new THREE.MeshStandardMaterial({
    color: "#7caa69",
    roughness: 0.9,
    metalness: 0,
  })

  const sandMaterial = new THREE.MeshStandardMaterial({
    color: "#e0d5c0",
    roughness: 0.9,
    metalness: 0,
  })

  const gravelMaterial = new THREE.MeshStandardMaterial({
    color: "#b5b5b5",
    roughness: 1.0,
    metalness: 0.05,
  })

  const pavementMaterial = new THREE.MeshStandardMaterial({
    color: "#909090",
    roughness: 0.8,
    metalness: 0.1,
  })

  const brickMaterial = new THREE.MeshStandardMaterial({
    color: "#a85e32",
    roughness: 0.9,
    metalness: 0.05,
  })

  const roofTileMaterial = new THREE.MeshStandardMaterial({
    color: "#8B4513",
    roughness: 0.8,
    metalness: 0.1,
  })

  return {
    concreteWhite,
    concreteBeige,
    concreteDark,
    stoneMaterial,
    woodDark,
    woodMedium,
    woodLight,
    woodDeck,
    glassBlue,
    glassClear,
    metalDark,
    metalLight,
    metalSilver,
    waterMaterial,
    grassMaterial,
    grassLightMaterial,
    sandMaterial,
    gravelMaterial,
    pavementMaterial,
    brickMaterial,
    roofTileMaterial,
  }
}

// Safe device capability detection hook
function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isLowEnd: false,
    isMobile: false,
  })

  useEffect(() => {
    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    // Detect low-end devices based on user agent or memory
    const isLowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4
    const isLowCPU = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency < 4
    const isLowEnd = isMobile || isLowMemory || isLowCPU

    setCapabilities({
      isLowEnd,
      isMobile,
    })
  }, [])

  return capabilities
}

// Create a water ripple effect with optimized performance
function WaterSurface({ position, size, depth }) {
  const meshRef = useRef()
  const [geometry, setGeometry] = useState(null)
  const { capabilities } = useThree()
  const deviceCapabilities = useDeviceCapabilities()

  // Determine quality level based on device capabilities
  const isHighQuality = !deviceCapabilities.isLowEnd

  useEffect(() => {
    // Use lower resolution for performance
    const resolution = isHighQuality ? 16 : 8
    const geo = new THREE.PlaneGeometry(size[0], size[1], resolution, resolution)
    setGeometry(geo)

    return () => {
      if (geo) geo.dispose()
    }
  }, [size, isHighQuality])

  useFrame(({ clock }) => {
    if (meshRef.current && geometry) {
      const time = clock.getElapsedTime()
      const positions = geometry.attributes.position.array

      // Animate fewer vertices for better performance
      for (let i = 0; i < positions.length; i += 9) {
        const x = positions[i]
        const z = positions[i + 2]
        const distance = Math.sqrt(x * x + z * z)

        positions[i + 1] = Math.sin(distance * 2 + time * 1.5) * 0.05 + Math.sin(x * 3 + time) * 0.03
      }

      geometry.attributes.position.needsUpdate = true

      // Only compute normals on higher quality settings
      if (isHighQuality) {
        geometry.computeVertexNormals()
      }
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[position[0], position[1], position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      {geometry && <primitive object={geometry} />}
      <meshStandardMaterial color="#0077be" roughness={0.1} metalness={0.2} transparent={true} opacity={0.8} />
    </mesh>
  )
}

// Create a detailed tree
function DetailedTree({ position, scale = 1, type = "oak" }) {
  const materials = createMaterials()
  const deviceCapabilities = useDeviceCapabilities()

  // Adjust detail level based on device capability
  const segments = deviceCapabilities.isLowEnd ? 4 : 8

  // Different tree types
  const treeTypes = {
    oak: {
      trunkHeight: 1.5 * scale,
      trunkRadius: 0.3 * scale,
      foliageSize: 2.5 * scale,
      trunkColor: "#5c3a21",
      foliageColor: "#4a7c59",
    },
    pine: {
      trunkHeight: 2 * scale,
      trunkRadius: 0.25 * scale,
      foliageSize: 2 * scale,
      trunkColor: "#6b4226",
      foliageColor: "#2d4a3e",
    },
    palm: {
      trunkHeight: 3 * scale,
      trunkRadius: 0.2 * scale,
      foliageSize: 2.5 * scale,
      trunkColor: "#8b4513",
      foliageColor: "#5a8c69",
    },
    maple: {
      trunkHeight: 1.8 * scale,
      trunkRadius: 0.28 * scale,
      foliageSize: 2.8 * scale,
      trunkColor: "#6d4c41",
      foliageColor: "#689f38",
    },
    birch: {
      trunkHeight: 2.2 * scale,
      trunkRadius: 0.2 * scale,
      foliageSize: 2.2 * scale,
      trunkColor: "#e0e0e0",
      foliageColor: "#7cb342",
    },
  }

  const tree = treeTypes[type] || treeTypes.oak

  return (
    <group position={position}>
      {/* Tree trunk with bark texture */}
      <Cylinder
        args={[tree.trunkRadius, tree.trunkRadius * 0.8, tree.trunkHeight, segments]}
        position={[0, tree.trunkHeight / 2, 0]}
        castShadow
      >
        <meshStandardMaterial color={tree.trunkColor} roughness={0.9} metalness={0.05} />
      </Cylinder>

      {/* Tree foliage - more detailed based on type */}
      {type === "pine" ? (
        // Pine tree has multiple layers of foliage
        <group>
          <Cylinder
            args={[0, tree.foliageSize * 0.7, tree.foliageSize * 0.8, segments]}
            position={[0, tree.trunkHeight + tree.foliageSize * 0.3, 0]}
            castShadow
          >
            <meshStandardMaterial color={tree.foliageColor} roughness={0.9} metalness={0} />
          </Cylinder>
          <Cylinder
            args={[0, tree.foliageSize * 0.6, tree.foliageSize * 0.7, segments]}
            position={[0, tree.trunkHeight + tree.foliageSize * 0.7, 0]}
            castShadow
          >
            <meshStandardMaterial color={tree.foliageColor} roughness={0.9} metalness={0} />
          </Cylinder>
          <Cylinder
            args={[0, tree.foliageSize * 0.4, tree.foliageSize * 0.6, segments]}
            position={[0, tree.trunkHeight + tree.foliageSize * 1.1, 0]}
            castShadow
          >
            <meshStandardMaterial color={tree.foliageColor} roughness={0.9} metalness={0} />
          </Cylinder>
        </group>
      ) : type === "palm" ? (
        // Palm tree has radiating fronds
        <group position={[0, tree.trunkHeight, 0]}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = angle * (Math.PI / 180)
            return (
              <Box
                key={i}
                args={[0.1, 0.05, tree.foliageSize]}
                position={[
                  Math.sin(rad) * tree.foliageSize * 0.2,
                  tree.foliageSize * 0.1,
                  Math.cos(rad) * tree.foliageSize * 0.2,
                ]}
                rotation={[0.3, rad, 0]}
                castShadow
              >
                <meshStandardMaterial color={tree.foliageColor} roughness={0.9} metalness={0} />
              </Box>
            )
          })}
        </group>
      ) : type === "birch" ? (
        // Birch has a more vertical shape
        <group>
          <Sphere
            args={[tree.foliageSize * 0.6, segments, segments]}
            position={[0, tree.trunkHeight + tree.foliageSize * 0.4, 0]}
            castShadow
          >
            <meshStandardMaterial color={tree.foliageColor} roughness={0.9} metalness={0} />
          </Sphere>
          <Sphere
            args={[tree.foliageSize * 0.5, segments, segments]}
            position={[0, tree.trunkHeight + tree.foliageSize * 0.9, 0]}
            castShadow
          >
            <meshStandardMaterial color={tree.foliageColor} roughness={0.9} metalness={0} />
          </Sphere>
        </group>
      ) : (
        // Default rounded foliage for oak and maple
        <group>
          <Sphere
            args={[tree.foliageSize * 0.7, segments, segments]}
            position={[tree.foliageSize * 0.2, tree.trunkHeight + tree.foliageSize * 0.4, 0]}
            castShadow
          >
            <meshStandardMaterial color={tree.foliageColor} roughness={0.9} metalness={0} />
          </Sphere>
          <Sphere
            args={[tree.foliageSize * 0.8, segments, segments]}
            position={[-tree.foliageSize * 0.1, tree.trunkHeight + tree.foliageSize * 0.5, tree.foliageSize * 0.1]}
            castShadow
          >
            <meshStandardMaterial color={tree.foliageColor} roughness={0.9} metalness={0} />
          </Sphere>
          <Sphere
            args={[tree.foliageSize * 0.6, segments, segments]}
            position={[0, tree.trunkHeight + tree.foliageSize * 0.6, -tree.foliageSize * 0.2]}
            castShadow
          >
            <meshStandardMaterial color={tree.foliageColor} roughness={0.9} metalness={0} />
          </Sphere>
        </group>
      )}
    </group>
  )
}

// Create detailed plants and landscaping elements
function DetailedPlant({ position, type = "flower", color = "#ff5555", scale = 1 }) {
  const deviceCapabilities = useDeviceCapabilities()
  const segments = deviceCapabilities.isLowEnd ? 4 : 8

  return (
    <group position={position}>
      {type === "flower" ? (
        <group>
          {/* Flower stem */}
          <Cylinder
            args={[0.05 * scale, 0.08 * scale, 0.8 * scale, segments]}
            position={[0, 0.4 * scale, 0]}
            castShadow
          >
            <meshStandardMaterial color="#3a6c49" roughness={0.9} />
          </Cylinder>
          {/* Flower bloom */}
          <Sphere args={[0.3 * scale, segments, segments]} position={[0, 0.8 * scale, 0]} castShadow>
            <meshStandardMaterial color={color} roughness={0.8} />
          </Sphere>
          {/* Leaves */}
          <Box
            args={[0.4 * scale, 0.05 * scale, 0.2 * scale]}
            position={[0.2 * scale, 0.3 * scale, 0]}
            rotation={[0, 0, Math.PI / 6]}
            castShadow
          >
            <meshStandardMaterial color="#3a6c49" roughness={0.9} />
          </Box>
          <Box
            args={[0.4 * scale, 0.05 * scale, 0.2 * scale]}
            position={[-0.2 * scale, 0.25 * scale, 0]}
            rotation={[0, 0, -Math.PI / 6]}
            castShadow
          >
            <meshStandardMaterial color="#3a6c49" roughness={0.9} />
          </Box>
        </group>
      ) : type === "bush" ? (
        <group>
          {/* Multiple spheres for a more natural bush shape */}
          <Sphere args={[0.5 * scale, segments, segments]} position={[0, 0.5 * scale, 0]} castShadow>
            <meshStandardMaterial color="#3a6c49" roughness={0.9} />
          </Sphere>
          <Sphere
            args={[0.4 * scale, segments, segments]}
            position={[0.3 * scale, 0.4 * scale, 0.2 * scale]}
            castShadow
          >
            <meshStandardMaterial color="#3a6c49" roughness={0.9} />
          </Sphere>
          <Sphere
            args={[0.45 * scale, segments, segments]}
            position={[-0.25 * scale, 0.45 * scale, -0.2 * scale]}
            castShadow
          >
            <meshStandardMaterial color="#3a6c49" roughness={0.9} />
          </Sphere>
        </group>
      ) : type === "cactus" ? (
        <group>
          {/* Main cactus body */}
          <Cylinder args={[0.3 * scale, 0.3 * scale, 1.5 * scale, segments]} position={[0, 0.75 * scale, 0]} castShadow>
            <meshStandardMaterial color="#4a6741" roughness={0.8} />
          </Cylinder>
          {/* Cactus arms */}
          <Cylinder
            args={[0.2 * scale, 0.2 * scale, 0.8 * scale, segments]}
            position={[0.4 * scale, 1 * scale, 0]}
            rotation={[0, 0, Math.PI / 3]}
            castShadow
          >
            <meshStandardMaterial color="#4a6741" roughness={0.8} />
          </Cylinder>
          <Cylinder
            args={[0.15 * scale, 0.15 * scale, 0.6 * scale, segments]}
            position={[-0.3 * scale, 0.8 * scale, 0]}
            rotation={[0, 0, -Math.PI / 4]}
            castShadow
          >
            <meshStandardMaterial color="#4a6741" roughness={0.8} />
          </Cylinder>
        </group>
      ) : type === "rocks" ? (
        <group>
          {/* Cluster of decorative rocks */}
          <Sphere
            args={[0.4 * scale, segments, segments]}
            position={[0, 0.4 * scale, 0]}
            rotation={[Math.PI / 6, Math.PI / 4, 0]}
            castShadow
          >
            <meshStandardMaterial color="#808080" roughness={1.0} />
          </Sphere>
          <Sphere
            args={[0.3 * scale, segments, segments]}
            position={[0.35 * scale, 0.3 * scale, 0.2 * scale]}
            rotation={[Math.PI / 3, 0, Math.PI / 5]}
            castShadow
          >
            <meshStandardMaterial color="#707070" roughness={1.0} />
          </Sphere>
          <Sphere
            args={[0.25 * scale, segments, segments]}
            position={[-0.3 * scale, 0.25 * scale, -0.2 * scale]}
            rotation={[0, Math.PI / 3, Math.PI / 4]}
            castShadow
          >
            <meshStandardMaterial color="#909090" roughness={1.0} />
          </Sphere>
        </group>
      ) : (
        <Cylinder args={[0.2 * scale, 0.15 * scale, 0.5 * scale, segments]} position={[0, 0.4 * scale, 0]} castShadow>
          <meshStandardMaterial color="#4a6741" roughness={0.8} />
        </Cylinder>
      )}
    </group>
  )
}

// Create outdoor furniture
function OutdoorFurniture({ position, type = "chair", material = "wood", rotation = [0, 0, 0] }) {
  const materials = createMaterials()
  const deviceCapabilities = useDeviceCapabilities()
  const segments = deviceCapabilities.isLowEnd ? 4 : 8

  const getMaterial = () => {
    switch (material) {
      case "wood":
        return materials.woodDeck
      case "metal":
        return materials.metalLight
      case "plastic":
        return new THREE.MeshStandardMaterial({
          color: "#f0f0f0",
          roughness: 0.7,
          metalness: 0.1,
        })
      default:
        return materials.woodDeck
    }
  }

  const furnitureMaterial = getMaterial()

  return (
    <group position={position} rotation={rotation}>
      {type === "chair" && (
        <>
          {/* Chair seat */}
          <Box args={[0.8, 0.1, 0.8]} position={[0, 0.4, 0]} castShadow>
            <primitive object={furnitureMaterial} attach="material" />
          </Box>
          {/* Chair back */}
          <Box args={[0.8, 0.8, 0.1]} position={[0, 0.85, -0.35]} castShadow>
            <primitive object={furnitureMaterial} attach="material" />
          </Box>
          {/* Chair legs */}
          <Cylinder args={[0.05, 0.05, 0.8, segments]} position={[0.35, 0.2, 0.35]} castShadow>
            <primitive object={furnitureMaterial} attach="material" />
          </Cylinder>
          <Cylinder args={[0.05, 0.05, 0.8, segments]} position={[-0.35, 0.2, 0.35]} castShadow>
            <primitive object={furnitureMaterial} attach="material" />
          </Cylinder>
          <Cylinder args={[0.05, 0.05, 0.8, segments]} position={[0.35, 0.2, -0.35]} castShadow>
            <primitive object={furnitureMaterial} attach="material" />
          </Cylinder>
          <Cylinder args={[0.05, 0.05, 0.8, segments]} position={[-0.35, 0.2, -0.35]} castShadow>
            <primitive object={furnitureMaterial} attach="material" />
          </Cylinder>
        </>
      )}

      {type === "table" && (
        <>
          {/* Table top */}
          <Cylinder args={[0.8, 0.8, 0.1, segments]} position={[0, 0.7, 0]} castShadow>
            <primitive object={furnitureMaterial} attach="material" />
          </Cylinder>
          {/* Table leg */}
          <Cylinder args={[0.1, 0.1, 1.4, segments]} position={[0, 0, 0]} castShadow>
            <primitive object={furnitureMaterial} attach="material" />
          </Cylinder>
          {/* Table base */}
          <Cylinder args={[0.4, 0.4, 0.05, segments]} position={[0, -0.675, 0]} castShadow>
            <primitive object={furnitureMaterial} attach="material" />
          </Cylinder>
        </>
      )}

      {type === "lounger" && (
        <>
          {/* Lounger base */}
          <Box args={[0.8, 0.1, 2]} position={[0, 0.05, 0]} castShadow>
            <primitive object={furnitureMaterial} attach="material" />
          </Box>
          {/* Lounger back rest */}
          <Box args={[0.8, 0.1, 0.8]} position={[0, 0.25, -0.6]} rotation={[Math.PI / 6, 0, 0]} castShadow>
            <primitive object={furnitureMaterial} attach="material" />
          </Box>
          {/* Lounger legs */}
          <Cylinder args={[0.05, 0.05, 0.2, segments]} position={[0.35, 0.1, 0.9]} castShadow>
            <primitive object={furnitureMaterial} attach="material" />
          </Cylinder>
          <Cylinder args={[0.05, 0.05, 0.2, segments]} position={[-0.35, 0.1, 0.9]} castShadow>
            <primitive object={furnitureMaterial} attach="material" />
          </Cylinder>
          <Cylinder args={[0.05, 0.05, 0.2, segments]} position={[0.35, 0.1, -0.9]} castShadow>
            <primitive object={furnitureMaterial} attach="material" />
          </Cylinder>
          <Cylinder args={[0.05, 0.05, 0.2, segments]} position={[-0.35, 0.1, -0.9]} castShadow>
            <primitive object={furnitureMaterial} attach="material" />
          </Cylinder>
        </>
      )}

      {type === "umbrella" && (
        <>
          {/* Umbrella pole */}
          <Cylinder args={[0.05, 0.05, 2.5, segments]} position={[0, 1.25, 0]} castShadow>
            <meshStandardMaterial color="#a0a0a0" roughness={0.3} metalness={0.8} />
          </Cylinder>
          {/* Umbrella canopy */}
          <Cylinder args={[0, 1.5, 0.8, segments]} position={[0, 2.4, 0]} castShadow>
            <meshStandardMaterial color="#3d85c6" roughness={0.7} metalness={0.1} />
          </Cylinder>
        </>
      )}
    </group>
  )
}

// Create landscape features like walkways, driveways, etc.
function LandscapeFeature({ position, type = "walkway", dimensions = [5, 0.1, 1], rotation = [0, 0, 0] }) {
  const materials = createMaterials()

  const getMaterial = () => {
    switch (type) {
      case "walkway":
        return materials.pavementMaterial
      case "driveway":
        return materials.gravelMaterial
      case "deck":
        return materials.woodDeck
      case "fence":
        return materials.woodMedium
      default:
        return materials.pavementMaterial
    }
  }

  const featureMaterial = getMaterial()

  return (
    <group position={position} rotation={rotation}>
      {type === "walkway" && (
        <Box args={dimensions} castShadow receiveShadow>
          <primitive object={featureMaterial} attach="material" />
        </Box>
      )}

      {type === "driveway" && (
        <Box args={dimensions} castShadow receiveShadow>
          <primitive object={featureMaterial} attach="material" />
        </Box>
      )}

      {type === "deck" && (
        <Box args={dimensions} castShadow receiveShadow>
          <primitive object={featureMaterial} attach="material" />
        </Box>
      )}

      {type === "fence" && (
        <group>
          {/* Generate fence posts and rails based on dimensions */}
          {Array.from({ length: Math.floor(dimensions[0]) + 1 }).map((_, i) => (
            <Cylinder
              key={`post-${i}`}
              args={[0.1, 0.1, dimensions[1] * 2, 8]}
              position={[i - dimensions[0] / 2, dimensions[1], 0]}
              castShadow
            >
              <primitive object={featureMaterial} attach="material" />
            </Cylinder>
          ))}
          {/* Horizontal rails */}
          <Box args={[dimensions[0], 0.05, 0.05]} position={[0, dimensions[1] * 0.5, 0]} castShadow>
            <primitive object={featureMaterial} attach="material" />
          </Box>
          <Box args={[dimensions[0], 0.05, 0.05]} position={[0, dimensions[1] * 1.5, 0]} castShadow>
            <primitive object={featureMaterial} attach="material" />
          </Box>
        </group>
      )}
    </group>
  )
}

export default function ModernHouse({
  type = "minimal",
  position = [0, 0, 0],
  color = "#ffffff",
  features = ["pool", "patio"],
  dimensions = { width: 30, depth: 40 },
}) {
  const houseRef = useRef()
  const materials = useMemo(() => createMaterials(), [])
  const deviceCapabilities = useDeviceCapabilities()

  // Render different house types with appropriate level of detail
  switch (type) {
    case "minimal":
      return (
        <MinimalistHouse
          position={position}
          color={color}
          features={features}
          dimensions={dimensions}
          deviceCapabilities={deviceCapabilities}
        />
      )
    case "beach":
      return (
        <BeachHouse
          position={position}
          color={color}
          features={features}
          dimensions={dimensions}
          deviceCapabilities={deviceCapabilities}
        />
      )
    case "mountain":
      return (
        <MountainVilla
          position={position}
          color={color}
          features={features}
          dimensions={dimensions}
          deviceCapabilities={deviceCapabilities}
        />
      )
    case "desert":
      return (
        <DesertRetreat
          position={position}
          color={color}
          features={features}
          dimensions={dimensions}
          deviceCapabilities={deviceCapabilities}
        />
      )
    case "tropical":
      return (
        <TropicalVilla
          position={position}
          color={color}
          features={features}
          dimensions={dimensions}
          deviceCapabilities={deviceCapabilities}
        />
      )
    case "urban":
      return (
        <UrbanLoft
          position={position}
          color={color}
          features={features}
          dimensions={dimensions}
          deviceCapabilities={deviceCapabilities}
        />
      )
    default:
      return (
        <MinimalistHouse
          position={position}
          color={color}
          features={features}
          dimensions={dimensions}
          deviceCapabilities={deviceCapabilities}
        />
      )
  }
}

function MinimalistHouse({ position, color, features, dimensions, deviceCapabilities }) {
  const { width, depth } = dimensions
  const materials = useMemo(() => createMaterials(), [])
  const isLowEnd = deviceCapabilities.isLowEnd

  // Custom color for this house style
  const houseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0.1,
      }),
    [color],
  )

  // Reduce number of objects for low-end devices
  const treePositions = isLowEnd
    ? [
        [-width / 2 + 5, -depth / 2 + 5],
        [width / 2 - 5, depth / 2 - 5],
      ]
    : [
        [-width / 2 + 5, -depth / 2 + 5],
        [-width / 2 + 5, depth / 2 - 5],
        [width / 2 - 5, -depth / 2 + 5],
        [width / 2 - 5, depth / 2 - 5],
      ]

  return (
    <group position={position}>
      {/* Property terrain with realistic grass */}
      <Box args={[width, 0.05, depth]} position={[0, 0.025, 0]} receiveShadow>
        <primitive object={materials.grassLightMaterial} attach="material" />
      </Box>

      {/* Property boundary walls - modern concrete */}
      <Box args={[width, 0.5, 0.2]} position={[0, 0.25, depth / 2]} castShadow>
        <primitive object={materials.concreteWhite} attach="material" />
      </Box>
      <Box args={[width, 0.5, 0.2]} position={[0, 0.25, -depth / 2]} castShadow>
        <primitive object={materials.concreteWhite} attach="material" />
      </Box>
      <Box args={[0.2, 0.5, depth]} position={[width / 2, 0.25, 0]} castShadow>
        <primitive object={materials.concreteWhite} attach="material" />
      </Box>
      <Box args={[0.2, 0.5, depth]} position={[-width / 2, 0.25, 0]} castShadow>
        <primitive object={materials.concreteWhite} attach="material" />
      </Box>

      {/* Driveway */}
      <LandscapeFeature
        type="driveway"
        dimensions={[5, 0.05, 8]}
        position={[0, 0.05, depth / 2 - 4]}
        rotation={[0, 0, 0]}
      />

      {/* Walkway to house */}
      <LandscapeFeature
        type="walkway"
        dimensions={[2, 0.05, 6]}
        position={[0, 0.05, depth / 2 - 10]}
        rotation={[0, 0, 0]}
      />

      {/* Main structure - flat roof modern house */}
      <RoundedBox args={[10, 4, 8]} position={[0, 2, 0]} radius={0.1} smoothness={isLowEnd ? 2 : 4} castShadow>
        <primitive object={houseMaterial} attach="material" />
      </RoundedBox>

      {/* Second floor/section */}
      <RoundedBox args={[6, 3, 6]} position={[0, 5.5, 0]} radius={0.1} smoothness={isLowEnd ? 2 : 4} castShadow>
        <primitive object={houseMaterial} attach="material" />
      </RoundedBox>

      {/* Architectural details - horizontal accent lines */}
      <Box args={[10.2, 0.1, 8.2]} position={[0, 3.5, 0]} castShadow>
        <primitive object={materials.metalLight} attach="material" />
      </Box>

      {/* Entrance feature */}
      <RoundedBox args={[3, 4.5, 1]} position={[0, 2.25, 4.5]} radius={0.1} smoothness={isLowEnd ? 2 : 4} castShadow>
        <primitive object={houseMaterial} attach="material" />
      </RoundedBox>

      {/* Front door */}
      <Box args={[1.5, 2.5, 0.1]} position={[0, 1.25, 5.05]} castShadow>
        <primitive object={materials.woodDark} attach="material" />
      </Box>

      {/* Large windows with realistic glass */}
      <Box args={[0.1, 2.5, 5]} position={[5.05, 2, 0]} castShadow>
        <primitive object={materials.glassBlue} attach="material" />
      </Box>

      <Box args={[5, 2.5, 0.1]} position={[0, 2, 4.05]} castShadow>
        <primitive object={materials.glassBlue} attach="material" />
      </Box>

      {/* Window frames */}
      <Box args={[0.15, 2.6, 0.15]} position={[5.05, 2, -2.5]} castShadow>
        <primitive object={materials.metalLight} attach="material" />
      </Box>
      <Box args={[0.15, 2.6, 0.15]} position={[5.05, 2, 2.5]} castShadow>
        <primitive object={materials.metalLight} attach="material" />
      </Box>
      <Box args={[0.15, 0.15, 5.15]} position={[5.05, 0.75, 0]} castShadow>
        <primitive object={materials.metalLight} attach="material" />
      </Box>
      <Box args={[0.15, 0.15, 5.15]} position={[5.05, 3.25, 0]} castShadow>
        <primitive object={materials.metalLight} attach="material" />
      </Box>

      {/* Second floor windows */}
      <Box args={[4, 2, 0.1]} position={[0, 5.5, 3.05]} castShadow>
        <primitive object={materials.glassBlue} attach="material" />
      </Box>

      {/* Window frames for second floor */}
      <Box args={[4.15, 0.15, 0.15]} position={[0, 4.5, 3.05]} castShadow>
        <primitive object={materials.metalLight} attach="material" />
      </Box>
      <Box args={[4.15, 0.15, 0.15]} position={[0, 6.5, 3.05]} castShadow>
        <primitive object={materials.metalLight} attach="material" />
      </Box>
      <Box args={[0.15, 2.15, 0.15]} position={[-2, 5.5, 3.05]} castShadow>
        <primitive object={materials.metalLight} attach="material" />
      </Box>
      <Box args={[0.15, 2.15, 0.15]} position={[2, 5.5, 3.05]} castShadow>
        <primitive object={materials.metalLight} attach="material" />
      </Box>

      {/* Patio deck */}
      {features.includes("patio") && (
        <LandscapeFeature type="deck" dimensions={[8, 0.2, 6]} position={[0, 0.1, -7]} rotation={[0, 0, 0]} />
      )}

      {/* Outdoor furniture on patio */}
      {features.includes("patio") && !isLowEnd && (
        <>
          <OutdoorFurniture type="table" position={[0, 0.2, -7]} material="wood" />
          <OutdoorFurniture type="chair" position={[1.2, 0.2, -7]} material="wood" rotation={[0, Math.PI / 2, 0]} />
          <OutdoorFurniture type="chair" position={[-1.2, 0.2, -7]} material="wood" rotation={[0, -Math.PI / 2, 0]} />
          <OutdoorFurniture type="chair" position={[0, 0.2, -8.2]} material="wood" rotation={[0, Math.PI, 0]} />
          <OutdoorFurniture type="chair" position={[0, 0.2, -5.8]} material="wood" />
          <OutdoorFurniture type="umbrella" position={[0, 0.2, -7]} material="metal" />
        </>
      )}

      {/* Pool with realistic water */}
      {features.includes("pool") && !isLowEnd && (
        <>
          <Box args={[5, 0.5, 3]} position={[6, 0.25, -6]} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </Box>

          {/* Water surface with ripple effect */}
          <WaterSurface position={[6, 0.5, -6]} size={[4.9, 2.9]} depth={0.4} />

          {/* Pool deck */}
          <LandscapeFeature type="deck" dimensions={[7, 0.1, 5]} position={[6, 0.05, -6]} rotation={[0, 0, 0]} />

          {/* Pool loungers */}
          <OutdoorFurniture type="lounger" position={[6, 0.15, -4]} material="wood" />
          <OutdoorFurniture type="lounger" position={[6, 0.15, -8]} material="wood" rotation={[0, Math.PI, 0]} />
        </>
      )}

      {/* Simplified pool for low-end devices */}
      {features.includes("pool") && isLowEnd && (
        <Box args={[5, 0.5, 3]} position={[6, 0.25, -6]} castShadow>
          <meshStandardMaterial color="#0077be" roughness={0.1} metalness={0.2} />
        </Box>
      )}

      {/* Trees */}
      {treePositions.map(([x, z], i) => (
        <DetailedTree key={i} position={[x, 0, z]} scale={1.2} type={i % 2 === 0 ? "oak" : "maple"} />
      ))}

      {/* Landscaping - bushes and flowers */}
      {!isLowEnd && (
        <>
          <DetailedPlant position={[-4, 0, 4]} type="bush" scale={1.2} />
          <DetailedPlant position={[4, 0, 4]} type="bush" scale={1.2} />
          <DetailedPlant position={[-3, 0, 4.5]} type="flower" color="#ff5555" scale={0.8} />
          <DetailedPlant position={[-2, 0, 4.5]} type="flower" color="#ffaa55" scale={0.8} />
          <DetailedPlant position={[2, 0, 4.5]} type="flower" color="#55ff55" scale={0.8} />
          <DetailedPlant position={[3, 0, 4.5]} type="flower" color="#5555ff" scale={0.8} />
          <DetailedPlant position={[-5, 0, -5]} type="rocks" scale={1.5} />
        </>
      )}

      {/* Property dimensions text markers */}
      <Box args={[0.5, 0.5, 0.5]} position={[0, 0.25, -depth / 2 - 1]} castShadow>
        <meshStandardMaterial color="#ff0000" />
      </Box>
      <Box args={[0.5, 0.5, 0.5]} position={[width / 2 + 1, 0.25, 0]} castShadow>
        <meshStandardMaterial color="#ff0000" />
      </Box>
    </group>
  )
}

function BeachHouse({ position, color, features, dimensions, deviceCapabilities }) {
  const { width, depth } = dimensions
  const materials = useMemo(() => createMaterials(), [])
  const isLowEnd = deviceCapabilities.isLowEnd

  // Custom color for this house style
  const houseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
        metalness: 0.05,
      }),
    [color],
  )

  return (
    <group position={position}>
      {/* Sandy beach property */}
      <Box args={[width, 0.05, depth]} position={[0, 0.025, 0]} receiveShadow>
        <meshStandardMaterial color="#f0e6c3" roughness={0.9} metalness={0} />
      </Box>

      {/* Wooden boardwalk to house */}
      <LandscapeFeature
        type="deck"
        dimensions={[3, 0.1, 12]}
        position={[0, 0.05, depth / 2 - 6]}
        rotation={[0, 0, 0]}
      />

      {/* Main structure */}
      <RoundedBox args={[12, 3, 8]} position={[0, 1.5, 0]} radius={0.1} smoothness={isLowEnd ? 2 : 4} castShadow>
        <primitive object={houseMaterial} attach="material" />
      </RoundedBox>

      {/* Slightly angled roof */}
      <Box args={[12, 0.5, 9]} position={[0, 3.25, 0]} rotation={[0.1, 0, 0]} castShadow>
        <meshStandardMaterial color="#d0d0d0" roughness={0.8} metalness={0.1} />
      </Box>

      {/* Roof overhang for shade */}
      <Box args={[14, 0.2, 10]} position={[0, 3.1, 0]} castShadow>
        <meshStandardMaterial color="#d0d0d0" roughness={0.8} metalness={0.1} />
      </Box>

      {/* Wooden support columns */}
      <Cylinder args={[0.2, 0.2, 3, 8]} position={[-5.5, 1.5, -3.5]} castShadow>
        <primitive object={materials.woodLight} attach="material" />
      </Cylinder>
      <Cylinder args={[0.2, 0.2, 3, 8]} position={[-5.5, 1.5, 3.5]} castShadow>
        <primitive object={materials.woodLight} attach="material" />
      </Cylinder>
      <Cylinder args={[0.2, 0.2, 3, 8]} position={[5.5, 1.5, -3.5]} castShadow>
        <primitive object={materials.woodLight} attach="material" />
      </Cylinder>
      <Cylinder args={[0.2, 0.2, 3, 8]} position={[5.5, 1.5, 3.5]} castShadow>
        <primitive object={materials.woodLight} attach="material" />
      </Cylinder>

      {/* Large panoramic windows */}
      <Box args={[10, 2, 0.1]} position={[0, 1.5, 4.05]} castShadow>
        <primitive object={materials.glassBlue} attach="material" />
      </Box>

      {/* Window frames */}
      <Box args={[10.2, 0.1, 0.15]} position={[0, 0.5, 4.05]} castShadow>
        <primitive object={materials.woodLight} attach="material" />
      </Box>
      <Box args={[10.2, 0.1, 0.15]} position={[0, 2.5, 4.05]} castShadow>
        <primitive object={materials.woodLight} attach="material" />
      </Box>
      <Box args={[0.1, 2.1, 0.15]} position={[-5, 1.5, 4.05]} castShadow>
        <primitive object={materials.woodLight} attach="material" />
      </Box>
      <Box args={[0.1, 2.1, 0.15]} position={[5, 1.5, 4.05]} castShadow>
        <primitive object={materials.woodLight} attach="material" />
      </Box>
      <Box args={[0.1, 2.1, 0.15]} position={[0, 1.5, 4.05]} castShadow>
        <primitive object={materials.woodLight} attach="material" />
      </Box>

      {/* Wooden deck */}
      <LandscapeFeature type="deck" dimensions={[14, 0.2, 6]} position={[0, 0.1, 7]} rotation={[0, 0, 0]} />

      {/* Outdoor furniture on deck */}
      {!isLowEnd && (
        <>
          <OutdoorFurniture type="lounger" position={[-4, 0.2, 7]} material="wood" rotation={[0, Math.PI / 6, 0]} />
          <OutdoorFurniture type="lounger" position={[4, 0.2, 7]} material="wood" rotation={[0, -Math.PI / 6, 0]} />
          <OutdoorFurniture type="table" position={[0, 0.2, 8]} material="wood" />
          <OutdoorFurniture type="chair" position={[-1, 0.2, 8]} material="wood" rotation={[0, Math.PI / 2, 0]} />
          <OutdoorFurniture type="chair" position={[1, 0.2, 8]} material="wood" rotation={[0, -Math.PI / 2, 0]} />
          <OutdoorFurniture type="umbrella" position={[0, 0.2, 8]} material="metal" />
        </>
      )}

      {/* Infinity pool with glass edge */}
      {features.includes("pool") && !isLowEnd && (
        <>
          <Box args={[6, 0.5, 4]} position={[0, 0.25, -5]} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </Box>

          {/* Water surface with ripple effect */}
          <WaterSurface position={[0, 0.5, -5]} size={[5.9, 3.9]} depth={0.4} />

          {/* Glass edge for infinity effect */}
          <Box args={[6, 0.5, 0.1]} position={[0, 0.25, -7]} castShadow>
            <primitive object={materials.glassClear} attach="material" />
          </Box>

          {/* Pool deck */}
          <LandscapeFeature type="deck" dimensions={[8, 0.1, 2]} position={[0, 0.05, -3]} rotation={[0, 0, 0]} />
        </>
      )}

      {/* Simplified pool for low-end devices */}
      {features.includes("pool") && isLowEnd && (
        <Box args={[6, 0.5, 4]} position={[0, 0.25, -5]} castShadow>
          <meshStandardMaterial color="#0077be" roughness={0.1} metalness={0.2} />
        </Box>
      )}

      {/* Palm trees */}
      <DetailedTree position={[-width / 2 + 5, 0, -depth / 2 + 5]} scale={1.2} type="palm" />
      <DetailedTree position={[width / 2 - 5, 0, -depth / 2 + 5]} scale={1.2} type="palm" />
      <DetailedTree position={[-width / 2 + 5, 0, depth / 2 - 5]} scale={1.2} type="palm" />
      <DetailedTree position={[width / 2 - 5, 0, depth / 2 - 5]} scale={1.2} type="palm" />

      {/* Beach landscaping */}
      {!isLowEnd && (
        <>
          <DetailedPlant position={[-8, 0, 0]} type="bush" scale={1.2} />
          <DetailedPlant position={[8, 0, 0]} type="bush" scale={1.2} />
          <DetailedPlant position={[-6, 0, -8]} type="rocks" scale={1.5} />
          <DetailedPlant position={[6, 0, -8]} type="rocks" scale={1.5} />
          <DetailedPlant position={[-4, 0, 10]} type="bush" scale={1.0} />
          <DetailedPlant position={[4, 0, 10]} type="bush" scale={1.0} />
        </>
      )}

      {/* Property dimensions text markers */}
      <Box args={[0.5, 0.5, 0.5]} position={[0, 0.25, -depth / 2 - 1]} castShadow>
        <meshStandardMaterial color="#ff0000" />
      </Box>
      <Box args={[0.5, 0.5, 0.5]} position={[width / 2 + 1, 0.25, 0]} castShadow>
        <meshStandardMaterial color="#ff0000" />
      </Box>
    </group>
  )
}

function MountainVilla({ position, color, features, dimensions, deviceCapabilities }) {
  const { width, depth } = dimensions
  const materials = useMemo(() => createMaterials(), [])
  const isLowEnd = deviceCapabilities.isLowEnd

  // Custom color for this house style
  const houseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
        metalness: 0.05,
      }),
    [color],
  )

  return (
    <group position={position}>
      {/* Mountain terrain with grass */}
      <Box args={[width, 0.05, depth]} position={[0, 0.025, 0]} receiveShadow>
        <meshStandardMaterial color="#7d8c69" roughness={0.9} metalness={0} />
      </Box>

      {/* Stone pathway to house */}
      <LandscapeFeature
        type="walkway"
        dimensions={[3, 0.1, 10]}
        position={[0, 0.05, depth / 2 - 5]}
        rotation={[0, 0, 0]}
      />

      {/* Main structure */}
      <RoundedBox args={[10, 4, 8]} position={[0, 2, 0]} radius={0.1} smoothness={isLowEnd ? 2 : 4} castShadow>
        <primitive object={houseMaterial} attach="material" />
      </RoundedBox>

      {/* Stone accents */}
      <Box args={[10.2, 1, 8.2]} position={[0, 0.5, 0]} castShadow>
        <primitive object={materials.stoneMaterial} attach="material" />
      </Box>

      <Box args={[3, 4, 0.5]} position={[-3.5, 2, 4.25]} castShadow>
        <primitive object={materials.stoneMaterial} attach="material" />
      </Box>

      {/* Chimney */}
      <Box args={[1.5, 6, 1.5]} position={[4, 5, -3]} castShadow>
        <primitive object={materials.stoneMaterial} attach="material" />
      </Box>

      {/* Sloped roof for snow */}
      <Box args={[11, 2, 9]} position={[0, 5, 0]} rotation={[0.3, 0, 0]} castShadow>
        <primitive object={materials.roofTileMaterial} attach="material" />
      </Box>

      {/* Wooden beams */}
      <Box args={[12, 0.3, 0.3]} position={[0, 4, 4.5]} castShadow>
        <primitive object={materials.woodDark} attach="material" />
      </Box>
      <Box args={[12, 0.3, 0.3]} position={[0, 4, -4.5]} castShadow>
        <primitive object={materials.woodDark} attach="material" />
      </Box>
      <Box args={[0.3, 0.3, 10]} position={[-5.5, 4, 0]} castShadow>
        <primitive object={materials.woodDark} attach="material" />
      </Box>
      <Box args={[0.3, 0.3, 10]} position={[5.5, 4, 0]} castShadow>
        <primitive object={materials.woodDark} attach="material" />
      </Box>

      {/* Large windows */}
      <Box args={[6, 3, 0.1]} position={[0, 2.5, 4.05]} castShadow>
        <primitive object={materials.glassBlue} attach="material" />
      </Box>

      {/* Window frames */}
      <Box args={[6.2, 0.1, 0.15]} position={[0, 1, 4.05]} castShadow>
        <primitive object={materials.woodDark} attach="material" />
      </Box>
      <Box args={[6.2, 0.1, 0.15]} position={[0, 4, 4.05]} castShadow>
        <primitive object={materials.woodDark} attach="material" />
      </Box>
      <Box args={[0.1, 3.1, 0.15]} position={[-3, 2.5, 4.05]} castShadow>
        <primitive object={materials.woodDark} attach="material" />
      </Box>
      <Box args={[0.1, 3.1, 0.15]} position={[3, 2.5, 4.05]} castShadow>
        <primitive object={materials.woodDark} attach="material" />
      </Box>
      <Box args={[0.1, 3.1, 0.15]} position={[0, 2.5, 4.05]} castShadow>
        <primitive object={materials.woodDark} attach="material" />
      </Box>

      {/* Wooden deck */}
      <LandscapeFeature type="deck" dimensions={[12, 0.2, 5]} position={[0, 0.1, 6.5]} rotation={[0, 0, 0]} />

      {/* Outdoor furniture */}
      {!isLowEnd && (
        <>
          <OutdoorFurniture type="table" position={[0, 0.2, 6.5]} material="wood" />
          <OutdoorFurniture type="chair" position={[-1.2, 0.2, 6.5]} material="wood" rotation={[0, Math.PI / 2, 0]} />
          <OutdoorFurniture type="chair" position={[1.2, 0.2, 6.5]} material="wood" rotation={[0, -Math.PI / 2, 0]} />
          <OutdoorFurniture type="chair" position={[0, 0.2, 5.3]} material="wood" />
          <OutdoorFurniture type="chair" position={[0, 0.2, 7.7]} material="wood" rotation={[0, Math.PI, 0]} />
        </>
      )}

      {/* Hot tub with steam */}
      {features.includes("pool") && !isLowEnd && (
        <>
          <Cylinder args={[2, 2, 1, 16]} position={[-4, 0.5, -5]} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </Cylinder>

          {/* Water surface with ripple effect */}
          <WaterSurface position={[-4, 1, -5]} size={[3.9, 3.9]} depth={0.2} />

          {/* Wooden deck around hot tub */}
          <LandscapeFeature type="deck" dimensions={[6, 0.1, 6]} position={[-4, 0.05, -5]} rotation={[0, 0, 0]} />
        </>
      )}

      {/* Simplified hot tub for low-end devices */}
      {features.includes("pool") && isLowEnd && (
        <Cylinder args={[2, 2, 1, 8]} position={[-4, 0.5, -5]} castShadow>
          <meshStandardMaterial color="#0077be" roughness={0.1} metalness={0.2} />
        </Cylinder>
      )}

      {/* Pine trees */}
      <DetailedTree position={[-width / 2 + 5, 0, -depth / 2 + 5]} scale={1.2} type="pine" />
      <DetailedTree position={[width / 2 - 5, 0, -depth / 2 + 5]} scale={1.2} type="pine" />
      <DetailedTree position={[-width / 2 + 5, 0, depth / 2 - 5]} scale={1.2} type="pine" />
      <DetailedTree position={[width / 2 - 5, 0, depth / 2 - 5]} scale={1.2} type="pine" />

      {/* Mountain landscaping */}
      {!isLowEnd && (
        <>
          <DetailedPlant position={[-6, 0, -8]} type="rocks" scale={1.5} />
          <DetailedPlant position={[6, 0, -8]} type="rocks" scale={1.5} />
          <DetailedPlant position={[-3, 0, 4]} type="bush" scale={1.0} />
          <DetailedPlant position={[3, 0, 4]} type="bush" scale={1.0} />
        </>
      )}

      {/* Property dimensions text markers */}
      <Box args={[0.5, 0.5, 0.5]} position={[0, 0.25, -depth / 2 - 1]} castShadow>
        <meshStandardMaterial color="#ff0000" />
      </Box>
      <Box args={[0.5, 0.5, 0.5]} position={[width / 2 + 1, 0.25, 0]} castShadow>
        <meshStandardMaterial color="#ff0000" />
      </Box>
    </group>
  )
}

function DesertRetreat({ position, color, features, dimensions, deviceCapabilities }) {
  const { width, depth } = dimensions
  const materials = useMemo(() => createMaterials(), [])
  const isLowEnd = deviceCapabilities.isLowEnd

  // Custom color for this house style
  const houseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.85,
        metalness: 0.05,
      }),
    [color],
  )

  return (
    <group position={position}>
      {/* Desert terrain */}
      <Box args={[width, 0.05, depth]} position={[0, 0.025, 0]} receiveShadow>
        <primitive object={materials.sandMaterial} attach="material" />
      </Box>

      {/* Stone pathway to house */}
      <LandscapeFeature
        type="walkway"
        dimensions={[3, 0.1, 10]}
        position={[0, 0.05, depth / 2 - 5]}
        rotation={[0, 0, 0]}
      />

      {/* Main structure */}
      <RoundedBox args={[12, 3, 8]} position={[0, 1.5, 0]} radius={0.2} smoothness={isLowEnd ? 2 : 4} castShadow>
        <primitive object={houseMaterial} attach="material" />
      </RoundedBox>

      {/* Flat roof with overhang for shade */}
      <Box args={[14, 0.3, 10]} position={[0, 3.15, 0]} castShadow>
        <meshStandardMaterial color="#d0d0d0" roughness={0.8} metalness={0.1} />
      </Box>

      {/* Courtyard with central feature */}
      <Box args={[6, 0.1, 6]} position={[0, 0.05, 6]} castShadow>
        <primitive object={materials.pavementMaterial} attach="material" />
      </Box>

      {/* Decorative central fountain */}
      <Cylinder args={[1, 1.2, 0.5, 8]} position={[0, 0.25, 6]} castShadow>
        <primitive object={materials.stoneMaterial} attach="material" />
      </Cylinder>

      {/* Large windows with sun protection */}
      <Box args={[8, 2, 0.1]} position={[0, 1.5, 4.05]} castShadow>
        <primitive object={materials.glassBlue} attach="material" />
      </Box>

      {/* Window shades */}
      <Box args={[8.5, 0.5, 0.5]} position={[0, 2.75, 4.3]} castShadow>
        <primitive object={materials.woodLight} attach="material" />
      </Box>

      {/* Window frames */}
      <Box args={[8.2, 0.1, 0.15]} position={[0, 0.5, 4.05]} castShadow>
        <primitive object={materials.metalLight} attach="material" />
      </Box>
      <Box args={[8.2, 0.1, 0.15]} position={[0, 2.5, 4.05]} castShadow>
        <primitive object={materials.metalLight} attach="material" />
      </Box>
      <Box args={[0.1, 2.1, 0.15]} position={[-4, 1.5, 4.05]} castShadow>
        <primitive object={materials.metalLight} attach="material" />
      </Box>
      <Box args={[0.1, 2.1, 0.15]} position={[4, 1.5, 4.05]} castShadow>
        <primitive object={materials.metalLight} attach="material" />
      </Box>
      <Box args={[0.1, 2.1, 0.15]} position={[0, 1.5, 4.05]} castShadow>
        <primitive object={materials.metalLight} attach="material" />
      </Box>

      {/* Pool with infinity edge and deck */}
      {features.includes("pool") && !isLowEnd && (
        <>
          <Box args={[6, 0.5, 4]} position={[0, 0.25, -4]} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </Box>

          {/* Water surface with ripple effect */}
          <WaterSurface position={[0, 0.5, -4]} size={[5.9, 3.9]} depth={0.4} />

          {/* Pool deck */}
          <LandscapeFeature type="deck" dimensions={[8, 0.1, 6]} position={[0, 0.05, -4]} rotation={[0, 0, 0]} />

          {/* Pool furniture */}
          <OutdoorFurniture type="lounger" position={[-2, 0.15, -6]} material="wood" />
          <OutdoorFurniture type="lounger" position={[2, 0.15, -6]} material="wood" />
          <OutdoorFurniture type="umbrella" position={[0, 0.15, -6]} material="metal" />
        </>
      )}

      {/* Simplified pool for low-end devices */}
      {features.includes("pool") && isLowEnd && (
        <Box args={[6, 0.5, 4]} position={[0, 0.25, -4]} castShadow>
          <meshStandardMaterial color="#0077be" roughness={0.1} metalness={0.2} />
        </Box>
      )}

      {/* Desert landscaping */}
      <DetailedPlant position={[-width / 2 + 5, 0, -depth / 2 + 5]} type="cactus" scale={1.5} />
      <DetailedPlant position={[width / 2 - 5, 0, -depth / 2 + 5]} type="cactus" scale={1.2} />
      <DetailedPlant position={[-width / 2 + 5, 0, depth / 2 - 5]} type="cactus" scale={1.3} />
      <DetailedPlant position={[width / 2 - 5, 0, depth / 2 - 5]} type="cactus" scale={1.4} />

      {/* Additional desert landscaping */}
      {!isLowEnd && (
        <>
          <DetailedPlant position={[-6, 0, -8]} type="rocks" scale={1.5} />
          <DetailedPlant position={[6, 0, -8]} type="rocks" scale={1.5} />
          <DetailedPlant position={[-4, 0, 8]} type="cactus" scale={0.8} />
          <DetailedPlant position={[4, 0, 8]} type="cactus" scale={0.8} />
        </>
      )}

      {/* Property dimensions text markers */}
      <Box args={[0.5, 0.5, 0.5]} position={[0, 0.25, -depth / 2 - 1]} castShadow>
        <meshStandardMaterial color="#ff0000" />
      </Box>
      <Box args={[0.5, 0.5, 0.5]} position={[width / 2 + 1, 0.25, 0]} castShadow>
        <meshStandardMaterial color="#ff0000" />
      </Box>
    </group>
  )
}

function TropicalVilla({ position, color, features, dimensions, deviceCapabilities }) {
  const { width, depth } = dimensions
  const materials = useMemo(() => createMaterials(), [])
  const isLowEnd = deviceCapabilities.isLowEnd

  // Custom color for this house style
  const houseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
        metalness: 0.05,
      }),
    [color],
  )

  return (
    <group position={position}>
      {/* Tropical terrain with lush grass */}
      <Box args={[width, 0.05, depth]} position={[0, 0.025, 0]} receiveShadow>
        <meshStandardMaterial color="#5caa69" roughness={0.9} metalness={0} />
      </Box>

      {/* Stone pathway to house */}
      <LandscapeFeature
        type="walkway"
        dimensions={[3, 0.1, 12]}
        position={[0, 0.05, depth / 2 - 6]}
        rotation={[0, 0, 0]}
      />

      {/* Main structure */}
      <RoundedBox args={[10, 3, 8]} position={[0, 1.5, 0]} radius={0.1} smoothness={isLowEnd ? 2 : 4} castShadow>
        <primitive object={houseMaterial} attach="material" />
      </RoundedBox>

      {/* Pavilion roof - layered for more detail */}
      <Box args={[12, 0.2, 10]} position={[0, 3.1, 0]} castShadow>
        <primitive object={materials.woodMedium} attach="material" />
      </Box>

      <Box args={[12, 1, 10]} position={[0, 3.7, 0]} rotation={[0.2, 0, 0]} castShadow>
        <primitive object={materials.woodMedium} attach="material" />
      </Box>

      {/* Open walls with large openings */}
      <Box args={[0.3, 3, 8]} position={[-5, 1.5, 0]} castShadow>
        <primitive object={materials.woodMedium} attach="material" />
      </Box>

      <Box args={[0.3, 3, 8]} position={[5, 1.5, 0]} castShadow>
        <primitive object={materials.woodMedium} attach="material" />
      </Box>

      {/* Support columns */}
      <Cylinder args={[0.3, 0.3, 3, 8]} position={[-5, 1.5, -4]} castShadow>
        <primitive object={materials.woodMedium} attach="material" />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 3, 8]} position={[-5, 1.5, 4]} castShadow>
        <primitive object={materials.woodMedium} attach="material" />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 3, 8]} position={[5, 1.5, -4]} castShadow>
        <primitive object={materials.woodMedium} attach="material" />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 3, 8]} position={[5, 1.5, 4]} castShadow>
        <primitive object={materials.woodMedium} attach="material" />
      </Cylinder>

      {/* Large open windows */}
      <Box args={[9, 2, 0.1]} position={[0, 1.5, 4.05]} castShadow>
        <primitive object={materials.glassBlue} attach="material" />
      </Box>
      <Box args={[9, 2, 0.1]} position={[0, 1.5, -4.05]} castShadow>
        <primitive object={materials.glassBlue} attach="material" />
      </Box>

      {/* Wooden deck surrounding house */}
      <LandscapeFeature type="deck" dimensions={[16, 0.2, 14]} position={[0, 0.1, 0]} rotation={[0, 0, 0]} />

      {/* Infinity pool with glass edge */}
      {features.includes("pool") && !isLowEnd && (
        <>
          <Box args={[12, 0.5, 6]} position={[0, 0.25, -7]} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </Box>

          {/* Water surface with ripple effect */}
          <WaterSurface position={[0, 0.5, -7]} size={[11.9, 5.9]} depth={0.4} />

          {/* Glass edge for infinity effect */}
          <Box args={[12, 0.5, 0.1]} position={[0, 0.25, -10]} castShadow>
            <primitive object={materials.glassClear} attach="material" />
          </Box>

          {/* Pool furniture */}
          <OutdoorFurniture type="lounger" position={[-4, 0.35, -5]} material="wood" rotation={[0, Math.PI / 6, 0]} />
          <OutdoorFurniture type="lounger" position={[4, 0.35, -5]} material="wood" rotation={[0, -Math.PI / 6, 0]} />
          <OutdoorFurniture type="table" position={[0, 0.35, -5]} material="wood" />
          <OutdoorFurniture type="umbrella" position={[0, 0.35, -5]} material="metal" />
        </>
      )}

      {/* Simplified pool for low-end devices */}
      {features.includes("pool") && isLowEnd && (
        <Box args={[12, 0.5, 6]} position={[0, 0.25, -7]} castShadow>
          <meshStandardMaterial color="#0077be" roughness={0.1} metalness={0.2} />
        </Box>
      )}

      {/* Tropical landscaping - palm trees */}
      <DetailedTree position={[-width / 2 + 5, 0, -depth / 2 + 5]} scale={1.2} type="palm" />
      <DetailedTree position={[width / 2 - 5, 0, -depth / 2 + 5]} scale={1.2} type="palm" />
      <DetailedTree position={[-width / 2 + 5, 0, depth / 2 - 5]} scale={1.2} type="palm" />
      <DetailedTree position={[width / 2 - 5, 0, depth / 2 - 5]} scale={1.2} type="palm" />

      {/* Additional tropical landscaping */}
      {!isLowEnd && (
        <>
          <DetailedPlant position={[-8, 0, 0]} type="bush" scale={1.2} />
          <DetailedPlant position={[8, 0, 0]} type="bush" scale={1.2} />
          <DetailedPlant position={[-6, 0, 8]} type="flower" color="#ff5555" scale={1.0} />
          <DetailedPlant position={[6, 0, 8]} type="flower" color="#ffaa55" scale={1.0} />
          <DetailedPlant position={[-6, 0, -8]} type="flower" color="#ff55ff" scale={1.0} />
          <DetailedPlant position={[6, 0, -8]} type="flower" color="#55ffff" scale={1.0} />
        </>
      )}

      {/* Property dimensions text markers */}
      <Box args={[0.5, 0.5, 0.5]} position={[0, 0.25, -depth / 2 - 1]} castShadow>
        <meshStandardMaterial color="#ff0000" />
      </Box>
      <Box args={[0.5, 0.5, 0.5]} position={[width / 2 + 1, 0.25, 0]} castShadow>
        <meshStandardMaterial color="#ff0000" />
      </Box>
    </group>
  )
}

function UrbanLoft({ position, color, features, dimensions, deviceCapabilities }) {
  const { width, depth } = dimensions
  const materials = useMemo(() => createMaterials(), [])
  const isLowEnd = deviceCapabilities.isLowEnd

  // Custom color for this house style
  const houseMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0.2,
      }),
    [color],
  )

  return (
    <group position={position}>
      {/* Urban terrain - concrete and pavement */}
      <Box args={[width, 0.05, depth]} position={[0, 0.025, 0]} receiveShadow>
        <meshStandardMaterial color="#a0a0a0" roughness={0.9} metalness={0.1} />
      </Box>

      {/* Concrete driveway */}
      <LandscapeFeature
        type="driveway"
        dimensions={[6, 0.1, 10]}
        position={[0, 0.05, depth / 2 - 5]}
        rotation={[0, 0, 0]}
      />

      {/* Main structure - multi-level glass and concrete */}
      <RoundedBox args={[10, 8, 8]} position={[0, 4, 0]} radius={0.1} smoothness={isLowEnd ? 2 : 4} castShadow>
        <primitive object={houseMaterial} attach="material" />
      </RoundedBox>

      {/* Glass facade with detailed framing */}
      <Box args={[10.1, 8, 0.1]} position={[0, 4, 4.05]} castShadow>
        <primitive object={materials.glassBlue} attach="material" />
      </Box>

      <Box args={[0.1, 8, 8]} position={[5.05, 4, 0]} castShadow>
        <primitive object={materials.glassBlue} attach="material" />
      </Box>

      {/* Window frames */}
      {!isLowEnd && (
        <>
          {/* Horizontal frames */}
          {[0, 2, 4, 6, 8].map((y) => (
            <Box key={`h-frame-${y}`} args={[10.2, 0.1, 0.15]} position={[0, y, 4.05]} castShadow>
              <primitive object={materials.metalDark} attach="material" />
            </Box>
          ))}

          {/* Vertical frames */}
          {[-4, -2, 0, 2, 4].map((x) => (
            <Box key={`v-frame-${x}`} args={[0.1, 8.1, 0.15]} position={[x, 4, 4.05]} castShadow>
              <primitive object={materials.metalDark} attach="material" />
            </Box>
          ))}

          {/* Side window frames */}
          {[0, 2, 4, 6, 8].map((y) => (
            <Box key={`side-h-frame-${y}`} args={[0.15, 0.1, 8.1]} position={[5.05, y, 0]} castShadow>
              <primitive object={materials.metalDark} attach="material" />
            </Box>
          ))}

          {[-4, -2, 0, 2, 4].map((z) => (
            <Box key={`side-v-frame-${z}`} args={[0.15, 8.1, 0.1]} position={[5.05, 4, z]} castShadow>
              <primitive object={materials.metalDark} attach="material" />
            </Box>
          ))}
        </>
      )}

      {/* Concrete elements */}
      <Box args={[2, 8, 8.1]} position={[-4, 4, 0]} castShadow>
        <primitive object={materials.concreteDark} attach="material" />
      </Box>

      {/* Modern entrance */}
      <Box args={[2, 3, 0.5]} position={[0, 1.5, 4.25]} castShadow>
        <primitive object={materials.metalDark} attach="material" />
      </Box>

      {/* Entrance door */}
      <Box args={[1.5, 2.5, 0.1]} position={[0, 1.25, 4.55]} castShadow>
        <primitive object={materials.glassBlue} attach="material" />
      </Box>

      {/* Rooftop terrace */}
      <Box args={[10, 0.2, 8]} position={[0, 8.1, 0]} castShadow>
        <primitive object={materials.concreteDark} attach="material" />
      </Box>

      {/* Rooftop railing */}
      <LandscapeFeature type="fence" dimensions={[10, 1, 0.1]} position={[0, 8.2, 4]} rotation={[0, 0, 0]} />
      <LandscapeFeature type="fence" dimensions={[10, 1, 0.1]} position={[0, 8.2, -4]} rotation={[0, 0, 0]} />
      <LandscapeFeature type="fence" dimensions={[0.1, 1, 8]} position={[5, 8.2, 0]} rotation={[0, 0, 0]} />
      <LandscapeFeature type="fence" dimensions={[0.1, 1, 8]} position={[-5, 8.2, 0]} rotation={[0, 0, 0]} />

      {/* Rooftop infinity pool */}
      {features.includes("pool") && !isLowEnd && (
        <>
          <Box args={[4, 0.5, 3]} position={[2, 8.25, 2]} castShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </Box>

          {/* Water surface with ripple effect */}
          <WaterSurface position={[2, 8.5, 2]} size={[3.9, 2.9]} depth={0.4} />

          {/* Rooftop furniture */}
          <OutdoorFurniture type="lounger" position={[2, 8.35, 0]} material="metal" />
          <OutdoorFurniture type="table" position={[-2, 8.35, 2]} material="metal" />
          <OutdoorFurniture type="chair" position={[-3, 8.35, 2]} material="metal" rotation={[0, Math.PI / 2, 0]} />
          <OutdoorFurniture type="chair" position={[-1, 8.35, 2]} material="metal" rotation={[0, -Math.PI / 2, 0]} />
          <OutdoorFurniture type="chair" position={[-2, 8.35, 1]} material="metal" />
          <OutdoorFurniture type="chair" position={[-2, 8.35, 3]} material="metal" rotation={[0, Math.PI, 0]} />
        </>
      )}

      {/* Simplified pool for low-end devices */}
      {features.includes("pool") && isLowEnd && (
        <Box args={[4, 0.5, 3]} position={[2, 8.25, 2]} castShadow>
          <meshStandardMaterial color="#0077be" roughness={0.1} metalness={0.2} />
        </Box>
      )}

      {/* Modern urban trees */}
      <DetailedTree position={[-width / 2 + 5, 0, -depth / 2 + 5]} scale={1.2} type="birch" />
      <DetailedTree position={[width / 2 - 5, 0, -depth / 2 + 5]} scale={1.2} type="birch" />
      <DetailedTree position={[-width / 2 + 5, 0, depth / 2 - 5]} scale={1.2} type="birch" />
      <DetailedTree position={[width / 2 - 5, 0, depth / 2 - 5]} scale={1.2} type="birch" />

      {/* Urban landscaping */}
      {!isLowEnd && (
        <>
          <DetailedPlant position={[-4, 0, 6]} type="bush" scale={1.0} />
          <DetailedPlant position={[4, 0, 6]} type="bush" scale={1.0} />
          <DetailedPlant position={[-2, 0, 6]} type="bush" scale={0.8} />
          <DetailedPlant position={[2, 0, 6]} type="bush" scale={0.8} />
          <DetailedPlant position={[-6, 0, -8]} type="rocks" scale={1.2} />
          <DetailedPlant position={[6, 0, -8]} type="rocks" scale={1.2} />
        </>
      )}

      {/* Property dimensions text markers */}
      <Box args={[0.5, 0.5, 0.5]} position={[0, 0.25, -depth / 2 - 1]} castShadow>
        <meshStandardMaterial color="#ff0000" />
      </Box>
      <Box args={[0.5, 0.5, 0.5]} position={[width / 2 + 1, 0.25, 0]} castShadow>
        <meshStandardMaterial color="#ff0000" />
      </Box>
    </group>
  )
}
