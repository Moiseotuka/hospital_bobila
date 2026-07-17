"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Building,
  Blocks,
  Receipt,
  DollarSign,
  Wallet,
  FileText,
  BarChart3,
  FileSpreadsheet,
  Shield,
  Settings,
  UserCog,
  PanelLeftClose,
  PanelLeft,
  Hospital,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import { SidebarItem } from "@/components/layout/sidebar-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMe } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

const navigationItems = [
  {
    label: "Tableau de bord",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Gestion",
    icon: Users,
    subItems: [
      { label: "Agents", href: "/agents", icon: Users },
      { label: "Grades", href: "/grades", icon: Briefcase },
      { label: "Fonctions", href: "/fonctions", icon: Building2 },
      { label: "Départements", href: "/departements", icon: Building },
      { label: "Services", href: "/services", icon: Blocks },
      { label: "Catégories Salariales", href: "/categories-salariales", icon: Receipt },
    ],
  },
  {
    label: "Paie",
    icon: DollarSign,
    subItems: [
      { label: "Primes", href: "/primes", icon: DollarSign },
      { label: "Retenues", href: "/retenues", icon: Wallet },
      { label: "Paie", href: "/paie", icon: FileText },
      { label: "Bulletins", href: "/bulletins", icon: FileText },
    ],
  },
  {
    label: "Rapports",
    icon: BarChart3,
    href: "/rapports",
  },
  {
    label: "Administration",
    icon: Shield,
    subItems: [
      { label: "Audit", href: "/audit", icon: FileSpreadsheet },
      { label: "Paramètres", href: "/parametres", icon: Settings },
      { label: "Utilisateurs", href: "/utilisateurs", icon: UserCog },
    ],
  },
];

export function Sidebar({ className, onItemClick }: SidebarProps) {
  const { isCollapsed, toggleCollapse } = useSidebar();
  const { data: user } = useMe();

  const sidebarVariants = {
    expanded: { width: 260 },
    collapsed: { width: 72 },
  };

  return (
    <TooltipProvider delayDuration={300}>
      <motion.aside
        initial={isCollapsed ? "collapsed" : "expanded"}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground",
          className
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Hospital className="h-8 w-8 text-sidebar-primary" />
          </motion.div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <h1 className="text-sm font-bold leading-tight text-sidebar-foreground">
                  Hôpital Militaire
                </h1>
                <p className="text-[10px] text-sidebar-foreground/50">
                  Camp Kokolo
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1">
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isCollapsed={isCollapsed}
                subItems={item.subItems}
                onClick={onItemClick}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* Collapse Button */}
        <div className="border-t border-sidebar-border p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCollapse}
                className="w-full text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              >
                {isCollapsed ? (
                  <PanelLeft className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isCollapsed ? "Étendre" : "Réduire"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* User Info */}
        <div className="border-t border-sidebar-border p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/parametres"
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent",
                  isCollapsed && "justify-center"
                )}
              >
                <Avatar className="h-8 w-8 border border-sidebar-border">
                  <AvatarImage src={user?.photo} alt={user?.name} />
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                    {getInitials(user?.name || "")}
                  </AvatarFallback>
                </Avatar>
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 overflow-hidden"
                    >
                      <p className="text-sm font-medium truncate text-sidebar-foreground">
                        {user?.name || "Utilisateur"}
                      </p>
                      <p className="text-xs text-sidebar-foreground/50 truncate">
                        {user?.role || "Chargé de paie"}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {user?.name || "Utilisateur"}
            </TooltipContent>
          </Tooltip>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
