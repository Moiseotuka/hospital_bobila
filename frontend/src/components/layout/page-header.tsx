"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  children,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col gap-4 pb-6 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-sm text-muted-foreground max-w-xl"
          >
            {description}
          </motion.p>
        )}
        {children}
      </div>
      {actions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="flex items-center gap-2 shrink-0"
        >
          {actions}
        </motion.div>
      )}
    </motion.div>
  )
}
