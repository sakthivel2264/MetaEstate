import * as THREE from "three"

/**
 * A utility class to help manage memory in Three.js applications
 */
export class MemoryManager {
  private static disposableObjects: Set<THREE.Object3D> = new Set()
  private static disposableMaterials: Set<THREE.Material> = new Set()
  private static disposableGeometries: Set<THREE.BufferGeometry> = new Set()
  private static disposableTextures: Set<THREE.Texture> = new Set()

  /**
   * Register an object for later disposal
   */
  static register(object: THREE.Object3D | THREE.Material | THREE.BufferGeometry | THREE.Texture): void {
    if (object instanceof THREE.Object3D) {
      this.disposableObjects.add(object)
    } else if (object instanceof THREE.Material) {
      this.disposableMaterials.add(object)
    } else if (object instanceof THREE.BufferGeometry) {
      this.disposableGeometries.add(object)
    } else if (object instanceof THREE.Texture) {
      this.disposableTextures.add(object)
    }
  }

  /**
   * Dispose a specific object and remove it from the registry
   */
  static dispose(object: THREE.Object3D | THREE.Material | THREE.BufferGeometry | THREE.Texture): void {
    if (object instanceof THREE.Object3D) {
      this.disposeObject(object)
      this.disposableObjects.delete(object)
    } else if (object instanceof THREE.Material) {
      this.disposeMaterial(object)
      this.disposableMaterials.delete(object)
    } else if (object instanceof THREE.BufferGeometry) {
      object.dispose()
      this.disposableGeometries.delete(object)
    } else if (object instanceof THREE.Texture) {
      object.dispose()
      this.disposableTextures.delete(object)
    }
  }

  /**
   * Dispose all registered objects
   */
  static disposeAll(): void {
    // Dispose objects first
    this.disposableObjects.forEach((object) => {
      this.disposeObject(object)
    })
    this.disposableObjects.clear()

    // Then materials
    this.disposableMaterials.forEach((material) => {
      this.disposeMaterial(material)
    })
    this.disposableMaterials.clear()

    // Then geometries
    this.disposableGeometries.forEach((geometry) => {
      geometry.dispose()
    })
    this.disposableGeometries.clear()

    // Finally textures
    this.disposableTextures.forEach((texture) => {
      texture.dispose()
    })
    this.disposableTextures.clear()
  }

  /**
   * Recursively dispose an object and all its children
   */
  private static disposeObject(object: THREE.Object3D): void {
    // First process children
    if (object.children.length > 0) {
      // Create a copy of the children array to avoid issues with it changing during iteration
      const children = [...object.children]
      children.forEach((child) => {
        this.disposeObject(child)
      })
    }

    // Then dispose the object's geometry and materials
    if ("geometry" in object && object.geometry instanceof THREE.BufferGeometry) {
      object.geometry.dispose()
      this.disposableGeometries.delete(object.geometry)
    }

    if ("material" in object) {
      if (Array.isArray(object.material)) {
        object.material.forEach((material) => {
          if (material) {
            this.disposeMaterial(material)
            this.disposableMaterials.delete(material)
          }
        })
      } else if (object.material) {
        this.disposeMaterial(object.material)
        this.disposableMaterials.delete(object.material)
      }
    }

    // Remove from parent
    if (object.parent) {
      object.parent.remove(object)
    }
  }

  /**
   * Dispose a material and its textures
   */
  private static disposeMaterial(material: THREE.Material): void {
    // Dispose all textures associated with the material
    Object.keys(material).forEach((prop) => {
      const value = material[prop]
      if (value instanceof THREE.Texture) {
        value.dispose()
        this.disposableTextures.delete(value)
      }
    })

    material.dispose()
  }

  /**
   * Force a garbage collection if the browser supports it
   * Note: This is not guaranteed to work in all browsers
   */
  static forceGC(): void {
    if (typeof window !== "undefined" && "gc" in window) {
      try {
        ;(window as any).gc()
      } catch (e) {
        console.warn("Failed to force garbage collection", e)
      }
    }
  }
}
