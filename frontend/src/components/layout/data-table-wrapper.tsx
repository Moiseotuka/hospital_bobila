"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Download,
  FileSpreadsheet,
  FileText,
  Columns,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Column {
  key: string;
  label: string;
  visible?: boolean;
}

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface DataTableWrapperProps {
  title?: string;
  columns: Column[];
  filters?: FilterOption[];
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onAdd?: () => void;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  onFilterChange?: (key: string, value: string) => void;
  onColumnVisibilityChange?: (columns: Column[]) => void;
  children: React.ReactNode;
  total?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  perPage?: number;
  onPerPageChange?: (perPage: number) => void;
  className?: string;
}

export function DataTableWrapper({
  title,
  columns: initialColumns,
  filters,
  searchPlaceholder = "Rechercher...",
  onSearch,
  onAdd,
  onExportPDF,
  onExportExcel,
  onFilterChange,
  onColumnVisibilityChange,
  children,
  total = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  perPage = 10,
  onPerPageChange,
  className,
}: DataTableWrapperProps) {
  const [searchValue, setSearchValue] = useState("");
  const [columns, setColumns] = useState<Column[]>(
    initialColumns.map((c) => ({ ...c, visible: c.visible ?? true }))
  );
  const [activeFilters, setActiveFilters] = useState<
    Record<string, string>
  >({});

  const debouncedSearch = useDebounce(searchValue, 300);

  useMemo(() => {
    onSearch?.(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const visibleColumns = columns.filter((c) => c.visible);
  const activeFilterCount = Object.keys(activeFilters).length;

  const toggleColumn = (key: string) => {
    const updated = columns.map((col) =>
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    setColumns(updated);
    onColumnVisibilityChange?.(updated);
  };

  const handleFilterChange = (key: string, value: string) => {
    const updated = { ...activeFilters };
    if (value === "all") {
      delete updated[key];
    } else {
      updated[key] = value;
    }
    setActiveFilters(updated);
    onFilterChange?.(key, value);
  };

  const clearFilters = () => {
    setActiveFilters({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-4", className)}
    >
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-8"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {filters?.map((filter) => (
            <Select
              key={filter.key}
              value={activeFilters[filter.key] || "all"}
              onValueChange={(value) => handleFilterChange(filter.key, value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {filter.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Effacer
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Columns className="h-4 w-4 mr-2" />
                Colonnes
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Visibilité</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.key}
                  checked={col.visible}
                  onCheckedChange={() => toggleColumn(col.key)}
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onExportPDF}>
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add button */}
          {onAdd && (
            <Button size="sm" className="h-9" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {total > 0 ? (
            <>
              Affichage de{" "}
              <span className="font-medium">
                {(currentPage - 1) * perPage + 1}
              </span>{" "}
              à{" "}
              <span className="font-medium">
                {Math.min(currentPage * perPage, total)}
              </span>{" "}
              sur <span className="font-medium">{total}</span> résultat(s)
            </>
          ) : (
            "Aucun résultat"
          )}
        </p>

        <div className="flex items-center gap-4">
          {onPerPageChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Par page</span>
              <Select
                value={String(perPage)}
                onValueChange={(v) => onPerPageChange(Number(v))}
              >
                <SelectTrigger className="h-8 w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 50, 100].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
              )
              .map((page, idx, arr) => (
                <span key={page} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== page - 1 && (
                    <span className="px-1 text-muted-foreground">...</span>
                  )}
                  <Button
                    variant={page === currentPage ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange?.(page)}
                  >
                    {page}
                  </Button>
                </span>
              ))}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
