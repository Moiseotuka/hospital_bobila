"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { paieService } from "@/services/paie.service"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"
import {
  Plus,
  FilePlus,
  CheckCircle,
  Lock,
  Eye,
  Trash2,
  MoreHorizontal,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { DataTable } from "@/components/ui/data-table"
import { PageHeader } from "@/components/layout/page-header"
import { Label } from "@/components/ui/label"
import { PeriodePaie } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"

const statutColors: Record<string, "warning" | "info" | "success" | "secondary" | "default"> = {
  en_attente: "warning",
  généré: "info",
  generé: "info",
  validé: "success",
  valide: "success",
  verrouillé: "secondary",
  verrouille: "secondary",
}

const moisList = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" },
]

const currentYear = new Date().getFullYear()
const anneeOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

const periodeSchema = z.object({
  mois: z.string().min(1, "Le mois est requis"),
  annee: z.string().min(1, "L'année est requise"),
})

type PeriodeForm = z.infer<typeof periodeSchema>

export default function PaiePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: periodesData, isLoading } = useQuery({
    queryKey: ["periodes-paie"],
    queryFn: () => paieService.getPeriodes({ per_page: 100 }),
  })

  const { data: couranteData } = useQuery({
    queryKey: ["periode-courante"],
    queryFn: () => paieService.getPeriodeCourante(),
    retry: false,
  })

  const periodes: PeriodePaie[] = periodesData?.data || periodesData || []
  const periodeCourante: PeriodePaie | null = couranteData?.data || couranteData || null

  const createMutation = useMutation({
    mutationFn: (data: PeriodeForm) =>
      paieService.createPeriode({ mois: parseInt(data.mois), annee: parseInt(data.annee) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodes-paie"] })
      queryClient.invalidateQueries({ queryKey: ["periode-courante"] })
      toast.success("Période créée avec succès")
      setDialogOpen(false)
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Erreur lors de la création"),
  })

  const genererMutation = useMutation({
    mutationFn: (id: number) => paieService.genererBulletins(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodes-paie"] })
      toast.success("Bulletins générés avec succès")
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Erreur lors de la génération"),
  })

  const validerMutation = useMutation({
    mutationFn: (id: number) => paieService.validerPeriode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodes-paie"] })
      toast.success("Période validée avec succès")
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Erreur lors de la validation"),
  })

  const verrouillerMutation = useMutation({
    mutationFn: (id: number) => paieService.verrouillerPeriode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodes-paie"] })
      toast.success("Période verrouillée avec succès")
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Erreur lors du verrouillage"),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => paieService.deletePeriode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["periodes-paie"] })
      queryClient.invalidateQueries({ queryKey: ["periode-courante"] })
      toast.success("Période supprimée avec succès")
      setDeleteId(null)
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Erreur lors de la suppression"),
  })

  const totalNet = periodes.reduce((sum, p) => sum + (p.total_net || 0), 0)
  const totalAgents = periodes.reduce((sum, p) => sum + (p.nombre_agents || 0), 0)
  const paidPeriodes = periodes.filter((p) => p.statut === "validé" || p.statut === "valide" || p.statut === "verrouillé" || p.statut === "verrouille")
  const tauxPaiement = periodes.length > 0 ? Math.round((paidPeriodes.length / periodes.length) * 100) : 0

  const columns: ColumnDef<PeriodePaie>[] = [
    {
      accessorKey: "mois",
      header: "Mois",
      cell: ({ row }) => {
        const m = moisList.find((ml) => ml.value === row.original.mois)
        return m?.label || row.original.mois
      },
    },
    {
      accessorKey: "annee",
      header: "Année",
    },
    {
      id: "periode",
      header: "Période",
      cell: ({ row }) => (
        <span className="text-sm">
          {formatDate(row.original.date_debut)} - {formatDate(row.original.date_fin)}
        </span>
      ),
    },
    {
      accessorKey: "statut",
      header: "Statut",
      cell: ({ row }) => {
        const statut = row.original.statut || "en_attente"
        return (
          <Badge variant={statutColors[statut] || "default"}>
            {statut.charAt(0).toUpperCase() + statut.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "nombre_agents",
      header: "Agents",
      cell: ({ row }) => row.original.nombre_agents ?? "-",
    },
    {
      accessorKey: "total_brut",
      header: "Brut",
      cell: ({ row }) => formatCurrency(row.original.total_brut || 0),
    },
    {
      accessorKey: "total_net",
      header: "Net",
      cell: ({ row }) => formatCurrency(row.original.total_net || 0),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const p = row.original
        const statut = p.statut || "en_attente"
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statut === "en_attente" && (
                <DropdownMenuItem onClick={() => genererMutation.mutate(p.id)}>
                  <FilePlus className="h-4 w-4 mr-2" />
                  Générer les bulletins
                </DropdownMenuItem>
              )}
              {statut === "généré" && (
                <DropdownMenuItem onClick={() => validerMutation.mutate(p.id)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Valider
                </DropdownMenuItem>
              )}
              {statut === "validé" && (
                <DropdownMenuItem onClick={() => verrouillerMutation.mutate(p.id)}>
                  <Lock className="h-4 w-4 mr-2" />
                  Verrouiller
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => router.push(`/paie/${p.id}`)}>
                <Eye className="h-4 w-4 mr-2" />
                Voir détails
              </DropdownMenuItem>
              {statut === "en_attente" && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setDeleteId(p.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              )}
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
        title="Gestion de la Paie"
        description="Gestion mensuelle des paies"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Période
          </Button>
        }
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Période en cours</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {periodeCourante
                ? `${moisList.find((m) => m.value === periodeCourante.mois)?.label || periodeCourante.mois} ${periodeCourante.annee}`
                : "Aucune"}
            </div>
            <p className="text-xs text-muted-foreground">
              {periodeCourante
                ? `Du ${formatDate(periodeCourante.date_debut)} au ${formatDate(periodeCourante.date_fin)}`
                : "Créer une nouvelle période"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total traitements</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgents}</div>
            <p className="text-xs text-muted-foreground">Agents traités</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Masse salariale</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalNet)}</div>
            <p className="text-xs text-muted-foreground">Total net cumulé</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux de paiement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tauxPaiement}%</div>
            <p className="text-xs text-muted-foreground">
              {paidPeriodes.length}/{periodes.length} périodes payées
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={Array.isArray(periodes) ? periodes : []}
            isLoading={isLoading}
            pageSize={15}
          />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle Période de Paie</DialogTitle>
          </DialogHeader>
          <CreatePeriodeForm
            onSubmit={(data) => createMutation.mutate(data)}
            isPending={createMutation.isPending}
            onClose={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette période de paie ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

function CreatePeriodeForm({
  onSubmit,
  isPending,
  onClose,
}: {
  onSubmit: (data: PeriodeForm) => void
  isPending: boolean
  onClose: () => void
}) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PeriodeForm>({
    resolver: zodResolver(periodeSchema),
    defaultValues: {
      mois: "",
      annee: "",
    },
  })

  const selectedMois = watch("mois")
  const selectedAnnee = watch("annee")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Mois *</Label>
          <Select onValueChange={(value) => setValue("mois", value)} value={selectedMois}>
            <SelectTrigger className={errors.mois ? "border-destructive" : ""}>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {moisList.map((m) => (
                <SelectItem key={m.value} value={String(m.value)}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.mois && <p className="text-xs text-destructive">{errors.mois.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Année *</Label>
          <Select onValueChange={(value) => setValue("annee", value)} value={selectedAnnee}>
            <SelectTrigger className={errors.annee ? "border-destructive" : ""}>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {anneeOptions.map((a) => (
                <SelectItem key={a} value={String(a)}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.annee && <p className="text-xs text-destructive">{errors.annee.message}</p>}
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Création..." : "Créer"}
        </Button>
      </DialogFooter>
    </form>
  )
}
