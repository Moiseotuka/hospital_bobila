"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
  User,
  Settings,
  ChevronRight,
  Home,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import { useMe, useLogout } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface NavbarProps {
  className?: string;
  onMenuClick?: () => void;
}

const breadcrumbMap: Record<string, string> = {
  dashboard: "Tableau de bord",
  agents: "Agents",
  grades: "Grades",
  fonctions: "Fonctions",
  departements: "Départements",
  services: "Services",
  "categories-salariales": "Catégories Salariales",
  primes: "Primes",
  retenues: "Retenues",
  paie: "Paie",
  bulletins: "Bulletins",
  rapports: "Rapports",
  audit: "Audit",
  parametres: "Paramètres",
  utilisateurs: "Utilisateurs",
  creer: "Création",
};

const searchItems = [
  { label: "Tableau de bord", href: "/dashboard", icon: Home },
  { label: "Agents", href: "/agents", icon: User },
  { label: "Grades", href: "/grades", icon: User },
  { label: "Fonctions", href: "/fonctions", icon: User },
  { label: "Départements", href: "/departements", icon: User },
  { label: "Services", href: "/services", icon: User },
  { label: "Catégories Salariales", href: "/categories-salariales", icon: User },
  { label: "Primes", href: "/primes", icon: User },
  { label: "Retenues", href: "/retenues", icon: User },
  { label: "Paie", href: "/paie", icon: User },
  { label: "Bulletins", href: "/bulletins", icon: User },
  { label: "Rapports", href: "/rapports", icon: User },
  { label: "Audit", href: "/audit", icon: User },
  { label: "Paramètres", href: "/parametres", icon: Settings },
  { label: "Utilisateurs", href: "/utilisateurs", icon: User },
];

export function Navbar({ className, onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { setMobileOpen } = useSidebar();
  const { data: user } = useMe();
  const logoutMutation = useLogout();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => ({
    label: breadcrumbMap[segment] || segment,
    href: "/" + pathSegments.slice(0, index + 1).join("/"),
  }));

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6",
          className
        )}
      >
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
          <Home className="h-4 w-4" />
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5" />
              <span
                className={cn(
                  index === breadcrumbs.length - 1
                    ? "font-medium text-foreground"
                    : "hover:text-foreground cursor-pointer"
                )}
                onClick={() => index < breadcrumbs.length - 1 && router.push(crumb.href)}
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <Button
          variant="outline"
          className="hidden md:flex h-9 w-60 items-center justify-between text-sm text-muted-foreground"
          onClick={() => setSearchOpen(true)}
        >
          <span className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Rechercher...
          </span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-4 min-w-4 px-1 text-[10px]"
          >
            3
          </Badge>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.photo} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(user?.name || "")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "Utilisateur"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/parametres")}>
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/parametres")}>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Command Palette */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Rechercher une page..." />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup heading="Pages">
            {searchItems.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => {
                  router.push(item.href);
                  setSearchOpen(false);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
