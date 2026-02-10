"use client"

import React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Menu, X, Flame, Sparkles, Gamepad2, Zap, BookOpen, Globe } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const links = [
    { href: "/", label: "Hub", icon: Gamepad2 },
    { href: "/category/manga", label: "Manga", icon: BookOpen },
    { href: "/category/manhwa", label: "Manhwa", icon: Globe },
    { href: "/category/nsfw", label: "NSFW", icon: Flame },
    { href: "/popular", label: "Top Picks", icon: Sparkles },
  ]

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setSearchOpen(false)
      setMobileOpen(false)
    }
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0, filter: "blur(10px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="absolute inset-0 glass" />

      {/* Animated neon line under navbar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ background: "linear-gradient(90deg, transparent, hsl(185 100% 55% / 0.3), transparent)" }}
      />

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="relative"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 8px hsl(185 100% 55% / 0.2)",
                  "0 0 20px hsl(185 100% 55% / 0.4)",
                  "0 0 8px hsl(185 100% 55% / 0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-1 rounded-xl opacity-0 transition-opacity group-hover:opacity-100"
            />
          </motion.div>
          <motion.span
            className="text-xl font-extrabold tracking-tight"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Olli<span className="text-primary neon-text">Verse</span>
          </motion.span>
        </Link>

        {/* Desktop nav with 3D-style tab indicator */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link, i) => {
            const isActive = pathname === link.href
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl bg-primary/10 ring-1 ring-primary/25"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      style={{
                        boxShadow: "0 0 15px hsl(185 100% 55% / 0.1), inset 0 0 15px hsl(185 100% 55% / 0.05)",
                      }}
                    />
                  )}
                  <motion.span
                    className={`relative z-10 flex items-center gap-1.5 ${isActive ? "text-primary neon-text" : "text-muted-foreground hover:text-foreground"}`}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </motion.span>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Desktop search + mobile toggle */}
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {searchOpen && (
              <motion.form
                initial={{ width: 0, opacity: 0, filter: "blur(8px)" }}
                animate={{ width: 260, opacity: 1, filter: "blur(0px)" }}
                exit={{ width: 0, opacity: 0, filter: "blur(8px)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                onSubmit={handleSearch}
                className="overflow-hidden"
              >
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your quest..."
                  className="w-full rounded-xl border border-primary/20 bg-secondary px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 neon-box"
                />
              </motion.form>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1, rotate: searchOpen ? 90 : 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary ring-1 ring-border text-muted-foreground transition-colors hover:text-primary hover:ring-primary/30"
            aria-label="Toggle search"
          >
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div key="search" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Search className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary ring-1 ring-border text-muted-foreground md:hidden"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile menu with stagger animation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden border-b border-primary/10 glass md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold uppercase tracking-wider transition-all ${
                      pathname === link.href
                        ? "bg-primary/10 text-primary ring-1 ring-primary/20 neon-box"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                onSubmit={handleSearch}
                className="mt-2"
              >
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your quest..."
                  className="w-full rounded-xl border border-primary/20 bg-secondary px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </motion.form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
