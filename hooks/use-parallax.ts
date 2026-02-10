"use client"

import { useEffect, useState, useCallback } from "react"

export function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0)

  const handleScroll = useCallback(() => {
    setOffset(window.scrollY * speed)
  }, [speed])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return offset
}

export function useMouseParallax(sensitivity = 0.02) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      setPosition({
        x: (e.clientX - centerX) * sensitivity,
        y: (e.clientY - centerY) * sensitivity,
      })
    },
    [sensitivity]
  )

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  return position
}
