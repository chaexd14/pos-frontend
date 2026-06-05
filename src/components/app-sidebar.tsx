"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  ShoppingCart,
  Tag,
  Coffee,
  ReceiptText,
  TrendingUp,
  Command,
  Settings,
  Bell,
} from "lucide-react"
import { NavUser } from "@/components/nav-user"

const data = {
  user: {
    name: "King Amato",
    email: "kingamato0@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
}

const navItems = [
  { label: "New Sale",   href: "/pos",         icon: ShoppingCart },
  { label: "Orders",     href: "/orders",       icon: ReceiptText  },
  { label: "Products",   href: "/products",     icon: Coffee       },
  { label: "Categories", href: "/categories",   icon: Tag          },
  { label: "Reports",    href: "/reports",      icon: TrendingUp   },
]

const systemItems = [
  { label: "Notifications", href: "/notifications", icon: Bell     },
  { label: "Settings",      href: "/settings",       icon: Settings },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "?") || pathname.startsWith(href + "/")

  return (
    <Sidebar variant="inset" {...props}>
      {/* Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/pos">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-900 text-white">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-gray-900">SaikoTeckh POS</span>
                  <span className="truncate text-xs text-gray-400">Enterprise v1.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 space-y-6">
        {/* Main Nav */}
        <div>
          <p className="px-3 mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Menu</p>
          <SidebarMenu>
            {navItems.map(({ label, href, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton asChild isActive={isActive(href)}>
                  <Link href={href}>
                    <Icon className="size-4 text-gray-500" />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

        {/* System Nav */}
        <div>
          <p className="px-3 mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">System</p>
          <SidebarMenu>
            {systemItems.map(({ label, href, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton asChild isActive={isActive(href)}>
                  <Link href={href}>
                    <Icon className="size-4 text-gray-500" />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
