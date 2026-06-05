"use client"

import React from "react"
import { usePathname } from "next/navigation"

export default function HideOnPos({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // If pathname is not yet available, render children to avoid flicker.
  if (!pathname) return <>{children}</>

  if (pathname === "/pos" || pathname.startsWith("/pos/")) {
    return null
  }

  return <>{children}</>
}
