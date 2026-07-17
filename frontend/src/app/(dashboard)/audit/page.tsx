"use client"

import { useState, useEffect, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { auditService } from "@/services/audit.service"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"
import {
  Search,
  RefreshCw,
  Download,
  Eye,
  FileSpreadsheet,
  ToggleLeft,
  ToggleRight,
  Loader2,
  History,
  Monitor,
  Globe,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { DataTable } from "@/components/ui/data-table"
import { PageHeader } from "@/components/layout/page-header"
import { formatDateTime } from "@/lib/utils"
import { AuditLog, User } from "@/types"
import { userService } from "@/services/user.service"
import { useDebounce } from "@/hooks/useDebounce"

const actionColors: Record<string, string> = {
  connexion: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  creation: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  modification: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  suppression: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  paiement: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  export: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  impression: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
}

const actionLabels: Record<string, string> = {
  connexion: "Connexion",
  creation: "Création",
  modification: "Modification",
  suppression: "Suppression",
  paiement: "Paiement",
  export: "Export",
  impression: "Impression",
}

const moduleList = [
  "Tous",
  "Agents",
  "Grades",
  "Fonctions",
  "Départements",
  "Services",
  "Catégories Salariales",
  "Primes",
  "Retenues",
  "Paie",
  "Bulletins",
  "Paiements",
  "Rapports",
  "Utilisateurs",
  "Paramètres",
  "Auth",
]

export default function AuditPage() {
  const [actionFilter, setActionFilter] = useState("all")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [userIdFilter, setUserIdFilter] = useState<string>("all")
  const [userSearch, setUserSearch] = useState("")
  const debouncedUserSearch = useDebounce(userSearch, 300)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [searchText, setSearchText] = useState("")
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const { data: usersData } = useQuery({
    queryKey: ["users", "audit", debouncedUserSearch],
    queryFn: () => userService.getUsers({ search: debouncedUserSearch || undefined, per_page: 50 }),
  })

  const users = usersData?.data || usersData || []

  const queryParams: any = {}
  if (actionFilter !== "all") queryParams.action = actionFilter
  if (moduleFilter !== "all") queryParams.module = moduleFilter
  if (userIdFilter !== "all") queryParams.user_id = userIdFilter
  if (dateFrom) queryParams.date_debut = dateFrom
  if (dateTo) queryParams.date_fin = dateTo
  if (searchText) queryParams.search = searchText

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["audit-logs", queryParams],
    queryFn: () => auditService.getAuditLogs({ ...queryParams, per_page: 100 }),
  })

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => refetch(), 30000)
    return () => clearInterval(interval)
  }, [autoRefresh, refetch])

  const logs = data?.data || data || []

  const handleExportExcel = useCallback(async () => {
    try {
      const response = await auditService.getAuditLogs({ ...queryParams, per_page: 10000 })
      const allLogs = response?.data || response || []
      const headers = ["Date/Heure", "Utilisateur", "Action", "Module", "Description", "IP"]
      const csvRows = [headers.join(",")]
      ;(Array.isArray(allLogs) ? allLogs : []).forEach((log: AuditLog) => {
        csvRows.push([
          log.created_at ? new Date(log.created_at).toISOString() : "",
          log.user?.name || log.user?.email || "N/A",
          log.action,
          log.module,
          `"${(log.description || "").replace(/"/g, '""')}"`,
          log.ip_address || "",
        ].join(","))
      })
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement("a")
      a.href = url
      a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Export réussi")
    } catch {
      toast.error("Erreur lors de l'export")
    }
  }, [queryParams])

  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: "created_at",
      header: "Date/Heure",
      cell: ({ row }) => {
        const date = row.original.created_at
        return (
          <span className="text-sm whitespace-nowrap">
            {date ? formatDateTime(date) : "-"}
          </span>
        )
      },
    },
    {
      id: "utilisateur",
      header: "Utilisateur",
      cell: ({ row }) => {
        const user = row.original.user
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={user?.photo} />
              <AvatarFallback className="text-[10px]">
                {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{user?.name || user?.email || "N/A"}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.original.action
        return (
          <Badge className={actionColors[action] || "bg-gray-100 text-gray-700"} variant="outline">
            {actionLabels[action] || action}
          </Badge>
        )
      },
    },
    {
      accessorKey: "module",
      header: "Module",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.module || "-"}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground max-w-[250px] truncate block">
          {row.original.description || "-"}
        </span>
      ),
    },
    {
      accessorKey: "ip_address",
      header: "IP",
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground">
          {row.original.ip_address || "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedLog(row.original)
            setDetailOpen(true)
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Journal d'Audit"
        description="Traçabilité complète des actions"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-xs">Auto-refresh</span>
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
              Actualiser
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <div className="space-y-1.5 min-w-[140px]">
              <Label className="text-xs">Action</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {Object.entries(actionLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 min-w-[160px]">
              <Label className="text-xs">Module</Label>
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {moduleList.map((m) => (
                    <SelectItem key={m} value={m === "Tous" ? "all" : m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 min-w-[180px]">
              <Label className="text-xs">Utilisateur</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between text-sm font-normal">
                    {userIdFilter === "all"
                      ? "Tous les utilisateurs"
                      : users.find((u: any) => String(u.id) === userIdFilter)?.name || "Sélectionner"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher..."
                      value={userSearch}
                      onValueChange={setUserSearch}
                    />
                    <CommandList>
                      <CommandEmpty>Aucun utilisateur</CommandEmpty>
                      <CommandGroup>
                        <CommandItem onSelect={() => { setUserIdFilter("all"); setUserSearch("") }}>
                          Tous les utilisateurs
                        </CommandItem>
                        {(Array.isArray(users) ? users : []).map((u: any) => (
                          <CommandItem
                            key={u.id}
                            value={u.name || u.email}
                            onSelect={() => { setUserIdFilter(String(u.id)); setUserSearch("") }}
                          >
                            <Avatar className="h-5 w-5 mr-2">
                              <AvatarFallback className="text-[8px]">{(u.name || u.email || "?").charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            {u.name || u.email}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5 min-w-[140px]">
              <Label className="text-xs">Du</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>

            <div className="space-y-1.5 min-w-[140px]">
              <Label className="text-xs">Au</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>

            <div className="space-y-1.5 min-w-[200px] flex-1">
              <Label className="text-xs">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans les logs..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={Array.isArray(logs) ? logs : []}
            pageSize={15}
            isLoading={isLoading}
            onRowClick={(row) => {
              setSelectedLog(row)
              setDetailOpen(true)
            }}
          />

          {isError && (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-destructive">
                Erreur lors du chargement des logs. Veuillez réessayer.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Détail de l'action
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur l'événement d'audit
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Date/Heure</p>
                  <p className="font-medium">{formatDateTime(selectedLog.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Utilisateur</p>
                  <p className="font-medium">{selectedLog.user?.name || selectedLog.user?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Action</p>
                  <Badge className={actionColors[selectedLog.action] || ""} variant="outline">
                    {actionLabels[selectedLog.action] || selectedLog.action}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Module</p>
                  <p className="font-medium">{selectedLog.module || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="font-medium">{selectedLog.description || "Aucune description"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3" /> Adresse IP
                  </p>
                  <p className="font-mono text-sm">{selectedLog.ip_address || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Monitor className="h-3 w-3" /> User Agent
                  </p>
                  <p className="text-xs font-mono truncate max-w-[200px]" title={selectedLog.user_agent}>
                    {selectedLog.user_agent || "N/A"}
                  </p>
                </div>
              </div>

              {selectedLog.anciennes_valeurs && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Anciennes valeurs</p>
                  <pre className="bg-muted rounded-lg p-3 text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.anciennes_valeurs, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.nouvelles_valeurs && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nouvelles valeurs</p>
                  <pre className="bg-muted rounded-lg p-3 text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.nouvelles_valeurs, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
