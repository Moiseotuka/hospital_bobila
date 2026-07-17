"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { paiementService } from "@/services/paiement.service"
import { agentService } from "@/services/agent.service"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"
import {
  Search,
  Eye,
  XCircle,
  Printer,
  Download,
  Filter,
  MoreHorizontal,
  CalendarIcon,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Paiement } from "@/types"
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils"
import { cn } from "@/lib/utils"

const statutColors: Record<string, "success" | "warning" | "destructive"> = {
  payé: "success",
  paye: "success",
  en_attente: "warning",
  annulé: "destructive",
  annule: "destructive",
}

const modePaiementLabels: Record<string, string> = {
  virement_bancaire: "Virement Bancaire",
  mobile_money: "Mobile Money",
  espèces: "Espèces",
  especes: "Espèces",
  chèque: "Chèque",
  cheque: "Chèque",
}

export default function HistoriquePaiementPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [statutFilter, setStatutFilter] = useState("all")
  const [modeFilter, setModeFilter] = useState("all")
  const [agentFilter, setAgentFilter] = useState("all")
  const [dateDebut, setDateDebut] = useState<Date | undefined>(undefined)
  const [dateFin, setDateFin] = useState<Date | undefined>(undefined)
  const [agentSearchQuery, setAgentSearchQuery] = useState("")
  const [agentPopoverOpen, setAgentPopoverOpen] = useState(false)
  const [detailPaiement, setDetailPaiement] = useState<Paiement | null>(null)
  const [annulerId, setAnnulerId] = useState<number | null>(null)
  const [motifAnnulation, setMotifAnnulation] = useState("")

  const { data: paiementsData, isLoading } = useQuery({
    queryKey: [
      "paiements",
      statutFilter,
      modeFilter,
      agentFilter,
      dateDebut?.toISOString(),
      dateFin?.toISOString(),
    ],
    queryFn: () =>
      paiementService.getPaiements({
        statut: statutFilter !== "all" ? statutFilter : undefined,
        mode_paiement: modeFilter !== "all" ? modeFilter : undefined,
        agent_id: agentFilter !== "all" ? agentFilter : undefined,
        date_debut: dateDebut?.toISOString().split("T")[0],
        date_fin: dateFin?.toISOString().split("T")[0],
        per_page: 100,
      }),
  })

  const { data: agentsData } = useQuery({
    queryKey: ["agents", "all"],
    queryFn: () => agentService.getAgents({ per_page: 200 }),
  })

  const annulerMutation = useMutation({
    mutationFn: ({ id, motif }: { id: number; motif: string }) =>
      paiementService.annulerPaiement(id, motif),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paiements"] })
      toast.success("Paiement annulé avec succès")
      setAnnulerId(null)
      setMotifAnnulation("")
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Erreur lors de l'annulation"),
  })

  const agents: any[] = agentsData?.data || agentsData || []
  const paiementsList: Paiement[] = paiementsData?.data || paiementsData || []

  const filteredAgents = agentSearchQuery
    ? (Array.isArray(agents) ? agents : []).filter(
        (a: any) =>
          a.nom?.toLowerCase().includes(agentSearchQuery.toLowerCase()) ||
          a.prenom?.toLowerCase().includes(agentSearchQuery.toLowerCase()) ||
          a.matricule?.toLowerCase().includes(agentSearchQuery.toLowerCase())
      )
    : agents

  const selectedAgent = (Array.isArray(agents) ? agents : []).find(
    (a: any) => String(a.id) === agentFilter
  )

  const totalMontant = (Array.isArray(paiementsList) ? paiementsList : []).reduce(
    (sum, p) => sum + (p.montant || 0),
    0
  )

  const columns: ColumnDef<Paiement>[] = [
    {
      accessorKey: "date_paiement",
      header: "Date",
      cell: ({ row }) => formatDate(row.original.date_paiement),
    },
    {
      id: "agent",
      header: "Agent",
      cell: ({ row }) => {
        const agent = row.original.agent
        return (
          <div>
            <p className="font-medium text-sm">
              {agent ? `${agent.nom} ${agent.prenom || ""}` : "N/A"}
            </p>
            <p className="text-xs text-muted-foreground">
              {agent?.matricule || ""}
            </p>
          </div>
        )
      },
    },
    {
      id: "periode",
      header: "Période",
      cell: ({ row }) => {
        const bulletin = row.original.bulletin
        const periode = bulletin?.periode
        if (periode) {
          const mois = [
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
          ]
          return `${mois[periode.mois - 1] || periode.mois} ${periode.annee}`
        }
        return "-"
      },
    },
    {
      accessorKey: "montant",
      header: "Montant",
      cell: ({ row }) => (
        <span className="font-semibold">{formatCurrency(row.original.montant || 0)}</span>
      ),
    },
    {
      accessorKey: "mode_paiement",
      header: "Mode",
      cell: ({ row }) =>
        modePaiementLabels[row.original.mode_paiement] || row.original.mode_paiement,
    },
    {
      accessorKey: "reference",
      header: "Référence",
      cell: ({ row }) => row.original.reference || "-",
    },
    {
      accessorKey: "statut",
      header: "Statut",
      cell: ({ row }) => {
        const statut = row.original.statut || "paye"
        const variant = statutColors[statut] || "default"
        return (
          <Badge variant={(statutColors as any)[statut] || "default"}>
            {statut.charAt(0).toUpperCase() + statut.slice(1)}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const p = row.original
        const isAnnulable = p.statut === "en_attente"
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDetailPaiement(p)}>
                <Eye className="h-4 w-4 mr-2" />
                Voir détail
              </DropdownMenuItem>
              {isAnnulable && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setAnnulerId(p.id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Annuler
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" />
                Reçu d&apos;imprimé
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Historique des Paiements"
        description="Suivi de tous les paiements effectués"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {dateDebut ? formatDate(dateDebut) : "Date début"}
                  {dateDebut && (
                    <X
                      className="h-3 w-3 ml-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDateDebut(undefined)
                      }}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateDebut}
                  onSelect={setDateDebut}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {dateFin ? formatDate(dateFin) : "Date fin"}
                  {dateFin && (
                    <X
                      className="h-3 w-3 ml-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDateFin(undefined)
                      }}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFin}
                  onSelect={setDateFin}
                />
              </PopoverContent>
            </Popover>

            <Popover open={agentPopoverOpen} onOpenChange={setAgentPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 justify-start min-w-[180px]">
                  {selectedAgent
                    ? `${selectedAgent.nom} ${selectedAgent.prenom || ""}`
                    : "Filtrer par agent"}
                  {agentFilter !== "all" && (
                    <X
                      className="h-3 w-3 ml-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        setAgentFilter("all")
                      }}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Rechercher un agent..."
                    value={agentSearchQuery}
                    onValueChange={setAgentSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>Aucun agent trouvé</CommandEmpty>
                    <CommandGroup className="max-h-48 overflow-y-auto">
                      <CommandItem onSelect={() => { setAgentFilter("all"); setAgentPopoverOpen(false) }}>
                        Tous les agents
                      </CommandItem>
                      {(Array.isArray(filteredAgents) ? filteredAgents : []).map((a: any) => (
                        <CommandItem
                          key={a.id}
                          value={String(a.id)}
                          onSelect={() => { setAgentFilter(String(a.id)); setAgentPopoverOpen(false) }}
                        >
                          <Checkbox
                            checked={agentFilter === String(a.id)}
                            className="mr-2"
                          />
                          <div>
                            <p className="text-sm">{a.nom} {a.prenom || ""}</p>
                            <p className="text-xs text-muted-foreground">{a.matricule}</p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Select value={statutFilter} onValueChange={setStatutFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="paye">Payé</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="annule">Annulé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les modes</SelectItem>
                <SelectItem value="virement_bancaire">Virement Bancaire</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="espèces">Espèces</SelectItem>
                <SelectItem value="chèque">Chèque</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={Array.isArray(paiementsList) ? paiementsList : []}
            isLoading={isLoading}
            pageSize={15}
          />
          <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
            <span className="text-sm font-medium">Total des montants :</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(totalMontant)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!detailPaiement} onOpenChange={(o) => !o && setDetailPaiement(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Détail du Paiement</DialogTitle>
            <DialogDescription>Informations complètes du paiement</DialogDescription>
          </DialogHeader>
          {detailPaiement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Agent</p>
                  <p className="font-medium">
                    {detailPaiement.agent
                      ? `${detailPaiement.agent.nom} ${detailPaiement.agent.prenom || ""}`
                      : "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {detailPaiement.agent?.matricule}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Montant</p>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(detailPaiement.montant || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Mode de Paiement</p>
                  <p className="font-medium">
                    {modePaiementLabels[detailPaiement.mode_paiement] || detailPaiement.mode_paiement}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Référence</p>
                  <p className="font-medium">{detailPaiement.reference || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(detailPaiement.date_paiement)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Statut</p>
                  <Badge
                    variant={(statutColors as any)[detailPaiement.statut] || "default"}
                  >
                    {detailPaiement.statut?.charAt(0).toUpperCase() +
                      detailPaiement.statut?.slice(1)}
                  </Badge>
                </div>
                {detailPaiement.banque && (
                  <div>
                    <p className="text-xs text-muted-foreground">Banque</p>
                    <p className="font-medium">{detailPaiement.banque}</p>
                  </div>
                )}
                {detailPaiement.motif_annulation && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Motif d&apos;annulation</p>
                    <p className="font-medium text-destructive">
                      {detailPaiement.motif_annulation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailPaiement(null)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!annulerId} onOpenChange={(o) => { if (!o) { setAnnulerId(null); setMotifAnnulation("") } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler le Paiement</AlertDialogTitle>
            <AlertDialogDescription>
              Veuillez fournir un motif pour l&apos;annulation de ce paiement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label>Motif d&apos;annulation *</Label>
            <Textarea
              value={motifAnnulation}
              onChange={(e) => setMotifAnnulation(e.target.value)}
              placeholder="Saisissez le motif de l'annulation..."
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              disabled={!motifAnnulation || annulerMutation.isPending}
              onClick={() =>
                annulerId &&
                annulerMutation.mutate({ id: annulerId, motif: motifAnnulation })
              }
            >
              {annulerMutation.isPending ? "Annulation..." : "Confirmer l'annulation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
