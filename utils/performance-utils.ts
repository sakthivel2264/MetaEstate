/**
 * Detects if the current device is likely to be low-end
 * based on user agent and available memory
 */
export function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false

  // Check for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  // Check for device memory (if available)
  const hasLowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory < 4

  // Check for Safari on iOS (known WebGL limitations)
  const isSafariIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !window.MSStream &&
    /Safari/.test(navigator.userAgent) &&
    !/Chrome/.test(navigator.userAgent)

  return isMobile || hasLowMemory || isSafariIOS
}

/**
 * Checks if WebGL is available and returns the version
 */
export function checkWebGLSupport(): { supported: boolean; version: number } {
  if (typeof window === "undefined") return { supported: false, version: 0 }

  try {
    const canvas = document.createElement("canvas")

    // Try WebGL2 first
    const gl2 = canvas.getContext("webgl2")
    if (gl2) {
      return { supported: true, version: 2 }
    }

    // Fall back to WebGL1
    const gl1 = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (gl1) {
      return { supported: true, version: 1 }
    }

    return { supported: false, version: 0 }
  } catch (e) {
    console.error("Error checking WebGL support:", e)
    return { supported: false, version: 0 }
  }
}

/**
 * Safely disposes of Three.js resources
 */
export function disposeThreeObjects(object: any): void {
  if (!object) return

  if (object.geometry) {
    object.geometry.dispose()
  }

  if (object.material) {
    if (Array.isArray(object.material)) {
      object.material.forEach((material: any) => {
        disposeMaterial(material)
      })
    } else {
      disposeMaterial(object.material)
    }
  }
}

function disposeMaterial(material: any): void {
  if (!material) return

  // Dispose textures
  Object.keys(material).forEach((prop) => {
    if (!material[prop]) return
    if (material[prop].isTexture) {
      material[prop].dispose()
    }
  })

  // Dispose material itself
  material.dispose()
}
