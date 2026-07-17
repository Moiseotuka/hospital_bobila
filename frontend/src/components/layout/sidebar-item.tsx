"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface SidebarSubItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  isCollapsed?: boolean;
  badge?: string | number;
  subItems?: SidebarSubItem[];
  onClick?: () => void;
}

export function SidebarItem({
  icon: Icon,
  label,
  href,
  isCollapsed = false,
  badge,
  subItems,
  onClick,
}: SidebarItemProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(
    subItems?.some((item) => pathname.startsWith(item.href)) ?? false
  );

  const isActive = href
    ? pathname === href
    : subItems?.some((item) => pathname.startsWith(item.href)) ?? false;

  const handleClick = () => {
    if (subItems) {
      setIsExpanded((prev) => !prev);
    }
    onClick?.();
  };

  const content = (
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 cursor-pointer",
        isActive
          ? "bg-sidebar-primary/10 text-sidebar-primary"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      )}
      onClick={handleClick}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-sidebar-primary"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <Icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && (
        <span className="flex-1 truncate">{label}</span>
      )}
      {!isCollapsed && badge && (
        <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
          {badge}
        </Badge>
      )}
      {!isCollapsed && subItems && (
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div>
      {href && !subItems ? (
        <Link href={href} onClick={onClick}>
          {content}
        </Link>
      ) : (
        content
      )}
      {!isCollapsed && subItems && (
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden pl-10 mt-1 space-y-1"
            >
              {subItems.map((subItem) => {
                const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href);
                return (
                  <Link key={subItem.href} href={subItem.href} onClick={onClick}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                        isSubActive
                          ? "bg-sidebar-primary/10 text-sidebar-primary font-medium"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                    >
                      {subItem.icon && (
                        <subItem.icon className="h-4 w-4 shrink-0" />
                      )}
                      <span className="truncate">{subItem.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
