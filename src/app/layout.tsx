import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import HideOnPos from "@/components/hide-on-pos";
import { LogOut } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="antialiased">

        <SidebarProvider>
          <div className="h-dvh w-full flex overflow-hidden">

            {/* SIDEBAR */}
            <AppSidebar />

            {/* MAIN SHELL */}
            <SidebarInset className="flex flex-col flex-1 min-w-0">

              {/* HEADER */}
              <header className="h-16 shrink-0 flex items-center border-b">
                <div className="w-full flex justify-between px-4">
                  <SidebarTrigger />

                  <HideOnPos>
                    <Button variant="outline">
                      <LogOut className="size-3.5" />
                      Log out
                    </Button>
                  </HideOnPos>
                </div>
              </header>

              {/* MAIN AREA (IMPORTANT) */}
              <main className="flex-1 min-h-0 overflow-hidden">
                {children}
              </main>

            </SidebarInset>
          </div>
        </SidebarProvider>

      </body>
    </html>
  );
}