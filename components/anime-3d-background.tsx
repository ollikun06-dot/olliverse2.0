"use client"

import { useRef, useMemo, Suspense, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Stars, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

// Anime sakura-like falling petals
function SakuraPetals({ count = 60 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 30,
      y: Math.random() * 20 - 5,
      z: (Math.random() - 0.5) * 15 - 5,
      speedY: Math.random() * 0.008 + 0.004,
      speedX: (Math.random() - 0.5) * 0.006,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.5 + 0.3,
      scale: Math.random() * 0.12 + 0.04,
    }))
  }, [count])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const p = particles[i]
      p.y -= p.speedY
      p.x += p.speedX + Math.sin(t * p.wobbleSpeed + p.wobble) * 0.003

      if (p.y < -12) {
        p.y = 12
        p.x = (Math.random() - 0.5) * 30
      }

      dummy.position.set(p.x, p.y, p.z)
      dummy.rotation.set(t * p.rotSpeed, t * p.rotSpeed * 0.7, t * p.rotSpeed * 0.5)
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#e84393"
        transparent
        opacity={0.25}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  )
}

// Large anime energy sphere in center
function EnergyCore() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return
    const t = state.clock.elapsedTime
    const s = 1 + Math.sin(t * 0.8) * 0.15
    meshRef.current.scale.setScalar(s)
    meshRef.current.rotation.y = t * 0.1
    glowRef.current.scale.setScalar(s * 1.8 + Math.sin(t * 1.2) * 0.3)
  })

  return (
    <group position={[0, 0, -8]}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 4]} />
        <MeshDistortMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.2}
          transparent
          opacity={0.05}
          distort={0.4}
          speed={2}
          roughness={0}
          wireframe
        />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

// Orbiting anime sigils / rings
function SigilRing({ radius, speed, tilt, color }: {
  radius: number; speed: number; tilt: number; color: string
}) {
  const ringRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!ringRef.current) return
    const t = state.clock.elapsedTime
    ringRef.current.rotation.x = tilt + Math.sin(t * speed * 0.5) * 0.05
    ringRef.current.rotation.z = t * speed
  })

  return (
    <mesh ref={ringRef} position={[0, 0, -8]}>
      <torusGeometry args={[radius, 0.015, 16, 128]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

// Floating anime crystals
function Crystal({ position, color, speed = 1, size = 0.5 }: {
  position: [number, number, number]
  color: string; speed?: number; size?: number
}) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed
    ref.current.rotation.x = t * 0.3
    ref.current.rotation.z = t * 0.2
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.5
  })
  return (
    <Float speed={speed * 0.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={ref} position={position}>
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.12}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </Float>
  )
}

// Anime speed lines shooting through
function SpeedLines({ count = 40 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!)

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = Math.random() * -15 - 5
      vel[i] = Math.random() * 0.05 + 0.02
    }
    return [pos, vel]
  }, [count])

  useFrame(() => {
    if (!ref.current) return
    const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 2] += velocities[i]
      if (arr[i * 3 + 2] > 5) {
        arr[i * 3] = (Math.random() - 0.5) * 25
        arr[i * 3 + 1] = (Math.random() - 0.5) * 20
        arr[i * 3 + 2] = -20
      }
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#00d4ff"
        size={0.03}
        transparent
        opacity={0.35}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// Parallax camera that follows mouse
function ParallaxCamera() {
  const { camera } = useThree()
  const target = useRef({ x: 0, y: 0 })

  const handleMouse = useCallback((e: MouseEvent) => {
    target.current.x = (e.clientX / window.innerWidth - 0.5) * 2
    target.current.y = (e.clientY / window.innerHeight - 0.5) * 2
  }, [])

  useFrame(() => {
    camera.position.x += (target.current.x * 0.8 - camera.position.x) * 0.02
    camera.position.y += (-target.current.y * 0.5 - camera.position.y) * 0.02
    camera.lookAt(0, 0, -5)
  })

  // Attach listener
  useMemo(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouse)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handleMouse)
      }
    }
  }, [handleMouse])

  return null
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={0.4} color="#00d4ff" distance={30} />
      <pointLight position={[-5, -3, 3]} intensity={0.3} color="#e84393" distance={25} />
      <pointLight position={[0, 3, -3]} intensity={0.2} color="#6edb71" distance={20} />

      <Stars radius={60} depth={60} count={1200} factor={3} saturation={0.2} fade speed={0.3} />

      <ParallaxCamera />
      <EnergyCore />

      {/* Multiple sigil rings at different angles */}
      <SigilRing radius={3.5} speed={0.15} tilt={Math.PI / 3} color="#00d4ff" />
      <SigilRing radius={5} speed={-0.1} tilt={Math.PI / 2.2} color="#e84393" />
      <SigilRing radius={7} speed={0.06} tilt={Math.PI / 4} color="#00d4ff" />
      <SigilRing radius={4.2} speed={-0.08} tilt={Math.PI / 1.8} color="#6edb71" />

      {/* Floating crystals scattered around */}
      <Crystal position={[-5, 3, -6]} color="#00d4ff" speed={1.2} size={0.5} />
      <Crystal position={[6, -2, -7]} color="#e84393" speed={0.8} size={0.4} />
      <Crystal position={[-3, -4, -5]} color="#00d4ff" speed={1.5} size={0.35} />
      <Crystal position={[4, 4, -9]} color="#6edb71" speed={0.6} size={0.5} />
      <Crystal position={[0, 5, -10]} color="#e84393" speed={1} size={0.3} />
      <Crystal position={[-7, 0, -8]} color="#00d4ff" speed={0.9} size={0.45} />
      <Crystal position={[7, 1, -6]} color="#6edb71" speed={1.1} size={0.35} />

      <SakuraPetals count={80} />
      <SpeedLines count={50} />
    </>
  )
}

export function Anime3DBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" style={{ height: "100vh" }}>
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
