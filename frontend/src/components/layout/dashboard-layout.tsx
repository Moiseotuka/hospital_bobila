"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSidebar, SidebarProvider } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayoutInner({ children }: DashboardLayoutProps) {
  const { isCollapsed, isMobileOpen, setMobileOpen } = useSidebar();

  return (
    <div className="relative min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <Sidebar />
      </aside>

      {/* Mobile sidebar as Sheet */}
      <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[260px]">
          <Sidebar onItemClick={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        )}
      >
        <Navbar />

        <main className="p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={typeof children === "string" ? children : "page-content"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </SidebarProvider>
  );
}
