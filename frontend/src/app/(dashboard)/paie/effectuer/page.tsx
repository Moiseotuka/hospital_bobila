"use client"

import { useState, useCallback, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { paiementService } from "@/services/paiement.service"
import { bulletinService } from "@/services/bulletin.service"
import { paieService } from "@/services/paie.service"
import { agentService } from "@/services/agent.service"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  Loader2,
  Check,
  ChevronsUpDown,
  CheckSquare,
  Square,
  DollarSign,
  Banknote,
  Landmark,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { PageHeader } from "@/components/layout/page-header"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Agent, PeriodePaie, BulletinPaie } from "@/types"

const modePaiementOptions = [
  { value: "virement_bancaire", label: "Virement Bancaire" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "espèces", label: "Espèces" },
  { value: "chèque", label: "Chèque" },
]

const today = new Date().toISOString().split("T")[0]

const individuelSchema = z.object({
  agent_id: z.string().min(1, "L'agent est requis"),
  periode_paie_id: z.string().min(1, "La période est requise"),
  mode_paiement: z.string().min(1, "Le mode de paiement est requis"),
  reference: z.string().optional(),
  banque: z.string().optional(),
  date_paiement: z.string().min(1, "La date est requise"),
})

type IndividuelForm = z.infer<typeof individuelSchema>

const moisList = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
]

export default function EffectuerPaiementPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState("individuel")

  const { data: agentsData } = useQuery({
    queryKey: ["agents", "all-active"],
    queryFn: () => agentService.getAgents({ per_page: 200, is_active: true }),
  })

  const { data: periodesData } = useQuery({
    queryKey: ["periodes-paie", "all"],
    queryFn: () => paieService.getPeriodes({ per_page: 100 }),
  })

  const agents: Agent[] = agentsData?.data || agentsData || []
  const periodes: PeriodePaie[] = periodesData?.data || periodesData || []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Effectuer un Paiement"
        description="Paiement des bulletins de paie"
        actions={
          <Button variant="outline" onClick={() => router.push("/paie")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="individuel">Paiement Individuel</TabsTrigger>
          <TabsTrigger value="collectif">Paiement Collectif</TabsTrigger>
        </TabsList>

        <TabsContent value="individuel" className="space-y-6">
          <PaiementIndividuel
            agents={agents}
            periodes={periodes}
            queryClient={queryClient}
          />
        </TabsContent>

        <TabsContent value="collectif" className="space-y-6">
          <PaiementCollectif
            periodes={periodes}
            queryClient={queryClient}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

function PaiementIndividuel({
  agents,
  periodes,
  queryClient,
}: {
  agents: Agent[]
  periodes: PeriodePaie[]
  queryClient: any
}) {
  const router = useRouter()
  const [agentPopoverOpen, setAgentPopoverOpen] = useState(false)
  const [agentSearch, setAgentSearch] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IndividuelForm>({
    resolver: zodResolver(individuelSchema),
    defaultValues: {
      agent_id: "",
      periode_paie_id: "",
      mode_paiement: "",
      reference: "",
      banque: "",
      date_paiement: today,
    },
  })

  const selectedAgentId = watch("agent_id")
  const selectedPeriodeId = watch("periode_paie_id")
  const selectedMode = watch("mode_paiement")
  const showBanque = selectedMode === "virement_bancaire" || selectedMode === "chèque"

  const { data: bulletinData, isLoading: bulletinLoading } = useQuery({
    queryKey: ["bulletin", "agent-periode", selectedAgentId, selectedPeriodeId],
    queryFn: () =>
      bulletinService.getBulletins({
        agent_id: selectedAgentId,
        periode_paie_id: selectedPeriodeId,
      }),
    enabled: !!selectedAgentId && !!selectedPeriodeId,
  })

  const bulletins: BulletinPaie[] = bulletinData?.data || bulletinData || []
  const bulletin = Array.isArray(bulletins) && bulletins.length > 0 ? bulletins[0] : null

  const filteredAgents = agentSearch
    ? (Array.isArray(agents) ? agents : []).filter(
        (a) =>
          a.nom.toLowerCase().includes(agentSearch.toLowerCase()) ||
          a.prenom?.toLowerCase().includes(agentSearch.toLowerCase()) ||
          a.matricule.toLowerCase().includes(agentSearch.toLowerCase())
      )
    : agents

  const selectedAgent = (Array.isArray(agents) ? agents : []).find(
    (a) => String(a.id) === selectedAgentId
  )

  const createMutation = useMutation({
    mutationFn: (data: any) => paiementService.createPaiement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paiements"] })
      queryClient.invalidateQueries({ queryKey: ["bulletins"] })
      toast.success("Paiement effectué avec succès")
      router.push("/paie/historique")
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Erreur lors du paiement"),
  })

  const onSubmit = (data: IndividuelForm) => {
    if (!bulletin) {
      toast.error("Aucun bulletin trouvé pour cet agent et cette période")
      return
    }
    createMutation.mutate({
      bulletin_paie_id: bulletin.id,
      agent_id: parseInt(data.agent_id),
      periode_paie_id: parseInt(data.periode_paie_id),
      montant: bulletin.net_a_payer,
      mode_paiement: data.mode_paiement,
      reference: data.reference || undefined,
      banque: showBanque ? (data.banque || undefined) : undefined,
      date_paiement: data.date_paiement,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sélection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Agent *</Label>
              <Popover open={agentPopoverOpen} onOpenChange={setAgentPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={agentPopoverOpen}
                    className="w-full justify-between"
                  >
                    {selectedAgent
                      ? `${selectedAgent.nom} ${selectedAgent.prenom} (${selectedAgent.matricule})`
                      : "Sélectionner un agent..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Rechercher par nom ou matricule..."
                      value={agentSearch}
                      onValueChange={setAgentSearch}
                    />
                    <CommandList>
                      <CommandEmpty>Aucun agent trouvé</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-y-auto">
                        {(Array.isArray(filteredAgents) ? filteredAgents : []).map((agent) => (
                          <CommandItem
                            key={agent.id}
                            value={String(agent.id)}
                            onSelect={() => {
                              setValue("agent_id", String(agent.id))
                              setAgentPopoverOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedAgentId === String(agent.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {agent.nom} {agent.prenom}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {agent.matricule} - {agent.grade?.nom || "N/A"}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.agent_id && (
                <p className="text-xs text-destructive">{errors.agent_id.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Période de Paie *</Label>
              <Select
                value={selectedPeriodeId}
                onValueChange={(val) => setValue("periode_paie_id", val)}
              >
                <SelectTrigger className={errors.periode_paie_id ? "border-destructive" : ""}>
                  <SelectValue placeholder="Sélectionner une période" />
                </SelectTrigger>
                <SelectContent>
                  {(Array.isArray(periodes) ? periodes : []).map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {moisList[p.mois - 1] || p.mois} {p.annee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.periode_paie_id && (
                <p className="text-xs text-destructive">{errors.periode_paie_id.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {bulletinLoading && (
        <Card>
          <CardContent className="py-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">Chargement du bulletin...</p>
          </CardContent>
        </Card>
      )}

      {bulletin && !bulletinLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Récapitulatif du Bulletin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Salaire Brut</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(bulletin.salaire_brut || 0)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Total Primes</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(bulletin.total_primes || 0)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Total Retenues</p>
                  <p className="text-lg font-semibold text-red-600">
                    {formatCurrency(bulletin.total_retenues || 0)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Salaire Net</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(bulletin.salaire_net || 0)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Net à Payer</p>
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(bulletin.net_a_payer || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration du Paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Mode de Paiement *</Label>
                  <Select
                    value={selectedMode}
                    onValueChange={(val) => setValue("mode_paiement", val)}
                  >
                    <SelectTrigger className={errors.mode_paiement ? "border-destructive" : ""}>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {modePaiementOptions.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.mode_paiement && (
                    <p className="text-xs text-destructive">{errors.mode_paiement.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Référence</Label>
                  <Input {...register("reference")} placeholder="Référence du paiement" />
                </div>
                {showBanque && (
                  <div className="space-y-2">
                    <Label>Banque</Label>
                    <Input {...register("banque")} placeholder="Nom de la banque" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Date de Paiement *</Label>
                  <Input
                    type="date"
                    {...register("date_paiement")}
                    className={errors.date_paiement ? "border-destructive" : ""}
                  />
                  {errors.date_paiement && (
                    <p className="text-xs text-destructive">{errors.date_paiement.message}</p>
                  )}
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <DollarSign className="h-4 w-4 mr-2" />
                )}
                Effectuer le Paiement
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {!bulletin && !bulletinLoading && selectedAgentId && selectedPeriodeId && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Aucun bulletin trouvé pour cet agent et cette période.
            </p>
          </CardContent>
        </Card>
      )}
    </form>
  )
}

function PaiementCollectif({
  periodes,
  queryClient,
}: {
  periodes: PeriodePaie[]
  queryClient: any
}) {
  const router = useRouter()
  const [selectedPeriodeId, setSelectedPeriodeId] = useState("")
  const [selectedBulletins, setSelectedBulletins] = useState<Set<number>>(new Set())
  const [collectifMode, setCollectifMode] = useState("")
  const [collectifReference, setCollectifReference] = useState("")
  const [collectifBanque, setCollectifBanque] = useState("")

  const { data: bulletinsData } = useQuery({
    queryKey: ["bulletins", "periode", selectedPeriodeId],
    queryFn: () => bulletinService.getBulletinsByPeriode(parseInt(selectedPeriodeId)),
    enabled: !!selectedPeriodeId,
  })

  const { data: paiementsData } = useQuery({
    queryKey: ["paiements", "periode", selectedPeriodeId],
    queryFn: () => paiementService.getPaiementsByPeriode(parseInt(selectedPeriodeId)),
    enabled: !!selectedPeriodeId,
  })

  const createMultipleMutation = useMutation({
    mutationFn: (data: any[]) =>
      Promise.all(data.map((d) => paiementService.createPaiement(d))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paiements"] })
      queryClient.invalidateQueries({ queryKey: ["bulletins"] })
      toast.success("Paiements effectués avec succès")
      router.push("/paie/historique")
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Erreur lors des paiements"),
  })

  const bulletins: BulletinPaie[] = bulletinsData?.data || bulletinsData || []
  const paiements: any[] = paiementsData?.data || paiementsData || []

  const paidBulletinIds = new Set(
    (Array.isArray(paiements) ? paiements : [])
      .filter((p: any) => p.statut === "payé" || p.statut === "paye")
      .map((p: any) => p.bulletin_paie_id)
  )

  const unpaidBulletins = (Array.isArray(bulletins) ? bulletins : []).filter(
    (b) => !paidBulletinIds.has(b.id)
  )

  const showBanque = collectifMode === "virement_bancaire" || collectifMode === "chèque"

  const handleSelectAll = () => {
    if (selectedBulletins.size === unpaidBulletins.length && unpaidBulletins.length > 0) {
      setSelectedBulletins(new Set())
    } else {
      setSelectedBulletins(new Set(unpaidBulletins.map((b) => b.id)))
    }
  }

  const handleToggleBulletin = (id: number) => {
    setSelectedBulletins((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const totalMontant = unpaidBulletins
    .filter((b) => selectedBulletins.has(b.id))
    .reduce((sum, b) => sum + (b.net_a_payer || 0), 0)

  const handleCollectifSubmit = () => {
    if (!collectifMode) {
      toast.error("Veuillez sélectionner un mode de paiement")
      return
    }
    const selected = unpaidBulletins.filter((b) => selectedBulletins.has(b.id))
    if (selected.length === 0) {
      toast.error("Veuillez sélectionner au moins un bulletin")
      return
    }
    const data = selected.map((b, idx) => ({
      bulletin_paie_id: b.id,
      agent_id: b.agent_id,
      periode_paie_id: parseInt(selectedPeriodeId),
      montant: b.net_a_payer,
      mode_paiement: collectifMode,
      reference: collectifReference
        ? `${collectifReference}-${String(idx + 1).padStart(3, "0")}`
        : undefined,
      banque: showBanque ? (collectifBanque || undefined) : undefined,
      date_paiement: today,
    }))
    createMultipleMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sélectionner la Période</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label>Période de Paie *</Label>
          <Select value={selectedPeriodeId} onValueChange={setSelectedPeriodeId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              {(Array.isArray(periodes) ? periodes : []).map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {moisList[p.mois - 1] || p.mois} {p.annee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {!!selectedPeriodeId && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              Bulletins Non Payés ({unpaidBulletins.length})
            </CardTitle>
            {unpaidBulletins.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedBulletins.size === unpaidBulletins.length ? (
                  <CheckSquare className="h-4 w-4 mr-2" />
                ) : (
                  <Square className="h-4 w-4 mr-2" />
                )}
                {selectedBulletins.size === unpaidBulletins.length
                  ? "Tout désélectionner"
                  : "Tout sélectionner"}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {unpaidBulletins.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Tous les bulletins de cette période ont été payés.
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {unpaidBulletins.map((bulletin) => (
                  <div
                    key={bulletin.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedBulletins.has(bulletin.id)}
                        onCheckedChange={() => handleToggleBulletin(bulletin.id)}
                      />
                      <div>
                        <p className="font-medium text-sm">{bulletin.nom_complet}</p>
                        <p className="text-xs text-muted-foreground">{bulletin.matricule}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(bulletin.net_a_payer || 0)}</p>
                      <Badge variant={bulletin.est_valide ? "success" : "warning"}>
                        {bulletin.est_valide ? "Validé" : "En attente"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedBulletins.size > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration du Paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Mode de Paiement *</Label>
                  <Select value={collectifMode} onValueChange={setCollectifMode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {modePaiementOptions.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Référence de base</Label>
                  <Input
                    value={collectifReference}
                    onChange={(e) => setCollectifReference(e.target.value)}
                    placeholder="Ex: PAIE-2024-001"
                  />
                </div>
                {showBanque && (
                  <div className="space-y-2">
                    <Label>Banque</Label>
                    <Input
                      value={collectifBanque}
                      onChange={(e) => setCollectifBanque(e.target.value)}
                      placeholder="Nom de la banque"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                <span className="text-sm font-medium">Nombre de bulletins</span>
                <span className="font-bold">{selectedBulletins.size}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-primary/5 p-3 border border-primary/20">
                <span className="text-sm font-medium">Montant total</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(totalMontant)}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                disabled={!collectifMode || createMultipleMutation.isPending}
                onClick={handleCollectifSubmit}
              >
                {createMultipleMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <DollarSign className="h-4 w-4 mr-2" />
                )}
                Effectuer les Paiements Sélectionnés
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
