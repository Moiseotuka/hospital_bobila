"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  className,
  children,
}: StatCardProps) {
  const TrendIcon =
    trend?.direction === "up"
      ? TrendingUp
      : trend?.direction === "down"
        ? TrendingDown
        : Minus;

  const trendColor =
    trend?.direction === "up"
      ? "text-emerald-500"
      : trend?.direction === "down"
        ? "text-red-500"
        : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {label}
              </p>
              <motion.p
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
                className="text-3xl font-bold tracking-tight"
              >
                {value}
              </motion.p>
              {trend && (
                <div className="flex items-center gap-1.5">
                  <TrendIcon
                    className={cn("h-4 w-4", trendColor)}
                  />
                  <span
                    className={cn("text-sm font-medium", trendColor)}
                  >
                    {trend.value > 0 ? "+" : ""}
                    {trend.value}%
                  </span>
                  {trend.label && (
                    <span className="text-xs text-muted-foreground">
                      {trend.label}
                    </span>
                  )}
                </div>
              )}
            </div>
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg",
                iconBgColor
              )}
            >
              <Icon className={cn("h-6 w-6", iconColor)} />
            </motion.div>
          </div>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
