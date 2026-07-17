"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Une erreur est survenue",
  description = "Impossible de charger les données. Veuillez réessayer.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10"
      >
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-semibold text-foreground mb-2"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="text-sm text-muted-foreground max-w-md mb-6"
      >
        {description}
      </motion.p>

      {onRetry && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
