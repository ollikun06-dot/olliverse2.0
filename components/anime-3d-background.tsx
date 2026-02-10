"use client"

import { useRef, useMemo, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Stars, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

// Anime-style floating crystal/gem shapes
function FloatingCrystal({ position, color, speed = 1, size = 1 }: {
  position: [number, number, number]
  color: string
  speed?: number
  size?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.3
    meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * speed * 0.2) * 0.2
  })

  return (
    <Float
      speed={speed}
      rotationIntensity={0.6}
      floatIntensity={1.5}
      floatingRange={[-0.3, 0.3]}
    >
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[size, 0]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
          distort={0.2}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </Float>
  )
}

// Anime energy ring
function EnergyRing({ radius = 3, color = "#00d4ff", speed = 0.5 }: {
  radius?: number
  color?: string
  speed?: number
}) {
  const ringRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!ringRef.current) return
    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * speed) * 0.1
    ringRef.current.rotation.z = state.clock.elapsedTime * speed * 0.2
  })

  return (
    <mesh ref={ringRef} position={[0, 0, -2]}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.12} />
    </mesh>
  )
}

// Floating particles that drift upward like anime sparkles
function AnimeParticles({ count = 100 }: { count?: number }) {
  const particlesRef = useRef<THREE.Points>(null!)

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3
      vel[i * 3] = (Math.random() - 0.5) * 0.005
      vel[i * 3 + 1] = Math.random() * 0.008 + 0.002
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003
    }
    return [pos, vel]
  }, [count])

  const sizes = useMemo(() => {
    const s = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      s[i] = Math.random() * 0.04 + 0.01
    }
    return s
  }, [count])

  useFrame(() => {
    if (!particlesRef.current) return
    const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute
    const posArray = posAttr.array as Float32Array

    for (let i = 0; i < count; i++) {
      posArray[i * 3] += velocities[i * 3]
      posArray[i * 3 + 1] += velocities[i * 3 + 1]
      posArray[i * 3 + 2] += velocities[i * 3 + 2]

      // Reset particles that drift too far
      if (posArray[i * 3 + 1] > 12) {
        posArray[i * 3] = (Math.random() - 0.5) * 20
        posArray[i * 3 + 1] = -10
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3
      }
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00d4ff"
        size={0.05}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// Main orbiting geometric shapes
function OrbitingShape({ orbitRadius, speed, offset, color, shape }: {
  orbitRadius: number
  speed: number
  offset: number
  color: string
  shape: "box" | "tetra" | "dodeca" | "ico"
}) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime * speed + offset
    meshRef.current.position.x = Math.cos(t) * orbitRadius
    meshRef.current.position.y = Math.sin(t * 0.7) * orbitRadius * 0.4
    meshRef.current.position.z = Math.sin(t) * orbitRadius * 0.5 - 3
    meshRef.current.rotation.x = t * 0.5
    meshRef.current.rotation.y = t * 0.3
  })

  const geometry = useMemo(() => {
    switch (shape) {
      case "box": return <boxGeometry args={[0.4, 0.4, 0.4]} />
      case "tetra": return <tetrahedronGeometry args={[0.35, 0]} />
      case "dodeca": return <dodecahedronGeometry args={[0.3, 0]} />
      case "ico": return <icosahedronGeometry args={[0.3, 0]} />
    }
  }, [shape])

  return (
    <mesh ref={meshRef}>
      {geometry}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        transparent
        opacity={0.08}
        wireframe
        roughness={0.3}
      />
    </mesh>
  )
}

// Center glowing orb
function GlowOrb() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!meshRef.current) return
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1
    meshRef.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <MeshDistortMaterial
        color="#00d4ff"
        emissive="#00d4ff"
        emissiveIntensity={0.15}
        transparent
        opacity={0.06}
        distort={0.3}
        speed={1.5}
        roughness={0}
      />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#00d4ff" />
      <pointLight position={[-5, -3, 3]} intensity={0.2} color="#e84393" />

      <Stars
        radius={50}
        depth={50}
        count={800}
        factor={3}
        saturation={0.3}
        fade
        speed={0.5}
      />

      <GlowOrb />

      {/* Floating crystals around the scene */}
      <FloatingCrystal position={[-4, 2, -4]} color="#00d4ff" speed={1.2} size={0.6} />
      <FloatingCrystal position={[5, -1, -5]} color="#e84393" speed={0.8} size={0.5} />
      <FloatingCrystal position={[-2, -3, -3]} color="#00d4ff" speed={1.5} size={0.4} />
      <FloatingCrystal position={[3, 3, -6]} color="#6edb71" speed={0.6} size={0.55} />
      <FloatingCrystal position={[0, 4, -7]} color="#00d4ff" speed={1} size={0.35} />

      {/* Energy rings */}
      <EnergyRing radius={4} color="#00d4ff" speed={0.3} />
      <EnergyRing radius={6} color="#e84393" speed={0.2} />

      {/* Orbiting wireframe shapes */}
      <OrbitingShape orbitRadius={5} speed={0.15} offset={0} color="#00d4ff" shape="box" />
      <OrbitingShape orbitRadius={6} speed={0.1} offset={Math.PI / 2} color="#e84393" shape="tetra" />
      <OrbitingShape orbitRadius={4} speed={0.2} offset={Math.PI} color="#6edb71" shape="dodeca" />
      <OrbitingShape orbitRadius={7} speed={0.08} offset={Math.PI * 1.5} color="#00d4ff" shape="ico" />

      {/* Anime sparkle particles */}
      <AnimeParticles count={150} />
    </>
  )
}

export function Anime3DBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  )
}
