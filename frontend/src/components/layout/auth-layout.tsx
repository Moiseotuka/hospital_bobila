"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Hospital } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/10"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center bg-gradient-to-br from-primary via-primary/80 to-primary-foreground/10 overflow-hidden">
        <Particles />

        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, hsl(var(--primary-foreground)/0.15) 0%, transparent 50%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center px-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <Hospital className="h-20 w-20 text-primary-foreground mb-6" />
          </motion.div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-3">
            Hôpital Militaire Central
          </h1>
          <p className="text-xl font-semibold text-primary-foreground/90 mb-2">
            Camp Kokolo
          </p>
          <p className="text-primary-foreground/70 max-w-md leading-relaxed">
            Système de Gestion de Paie
          </p>
          <div className="mt-8 h-px w-32 bg-primary-foreground/20" />
          <p className="mt-6 text-sm text-primary-foreground/50 max-w-sm">
            Gérez efficacement la paie, les primes, les retenues et les
            bulletins de tout le personnel hospitalier.
          </p>
        </motion.div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-background p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <Hospital className="h-12 w-12 text-primary mb-3" />
            <h1 className="text-xl font-bold text-center">
              Hôpital Militaire Camp Kokolo
            </h1>
            <p className="text-sm text-muted-foreground">
              Système de Gestion de Paie
            </p>
          </div>

          <div className={cn("w-full", className)}>{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
