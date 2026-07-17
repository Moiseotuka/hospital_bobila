"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { gradeService } from "@/services/grade.service"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"
import { Search, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { PageHeader } from "@/components/layout/page-header"
import { useDebounce } from "@/hooks/useDebounce"
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
import { Label } from "@/components/ui/label"
import { Grade } from "@/types"
import { formatCurrency } from "@/lib/utils"

const gradeSchema = z.object({
  code: z.string().min(1, "Le code est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  salaire_base: z.number().min(0, "Le salaire doit être positif"),
  prime: z.number().optional().default(0),
  description: z.string().optional(),
})

type GradeForm = z.infer<typeof gradeSchema>

export default function GradesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<Grade | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useQuery({
    queryKey: ["grades", debouncedSearch],
    queryFn: () => gradeService.getGrades({ search: debouncedSearch || undefined, per_page: 100 }),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => gradeService.createGrade(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] })
      toast.success("Grade créé avec succès")
      setDialogOpen(false)
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Erreur"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => gradeService.updateGrade(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] })
      toast.success("Grade mis à jour")
      setDialogOpen(false)
      setEditItem(null)
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Erreur"),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => gradeService.deleteGrade(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] })
      toast.success("Grade supprimé")
      setDeleteId(null)
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Erreur"),
  })

  const items = data?.data || data || []

  const columns: ColumnDef<Grade>[] = [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "nom", header: "Nom" },
    {
      accessorKey: "salaire_base",
      header: "Salaire de Base",
      cell: ({ row }) => formatCurrency(row.original.salaire_base || 0),
    },
    {
      accessorKey: "prime",
      header: "Prime",
      cell: ({ row }) => formatCurrency(row.original.prime || 0),
    },
    {
      accessorKey: "is_active",
      header: "Statut",
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? "success" : "secondary"}>
          {row.original.is_active ? "Actif" : "Inactif"}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setEditItem(row.original); setDialogOpen(true) }}>
              <Edit className="h-4 w-4 mr-2" /> Modifier
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(row.original.id)}>
              <Trash2 className="h-4 w-4 mr-2" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Grades" description="Gestion des grades" actions={
        <Button onClick={() => { setEditItem(null); setDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Nouveau Grade
        </Button>
      } />

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>
          <DataTable columns={columns} data={items} isLoading={isLoading} />
        </CardContent>
      </Card>

      <GradeDialog
        open={dialogOpen}
        onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditItem(null) }}
        editItem={editItem}
        onSubmit={(data) => {
          if (editItem) updateMutation.mutate({ id: editItem.id, data })
          else createMutation.mutate(data)
        }}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>Êtes-vous sûr de vouloir supprimer ce grade ?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

function GradeDialog({
  open,
  onOpenChange,
  editItem,
  onSubmit,
  isPending,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editItem: Grade | null
  onSubmit: (data: GradeForm) => void
  isPending: boolean
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GradeForm>({
    resolver: zodResolver(gradeSchema),
    defaultValues: editItem || { code: "", nom: "", salaire_base: 0, prime: 0, description: "" },
    values: editItem
      ? { code: editItem.code, nom: editItem.nom, salaire_base: editItem.salaire_base, prime: editItem.prime || 0, description: editItem.description || "" }
      : undefined,
  })

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editItem ? "Modifier le Grade" : "Nouveau Grade"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Code *</Label>
              <Input {...register("code")} className={errors.code ? "border-destructive" : ""} />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input {...register("nom")} className={errors.nom ? "border-destructive" : ""} />
              {errors.nom && <p className="text-xs text-destructive">{errors.nom.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Salaire de Base *</Label>
              <Input type="number" step="0.01" {...register("salaire_base", { valueAsNumber: true })} className={errors.salaire_base ? "border-destructive" : ""} />
              {errors.salaire_base && <p className="text-xs text-destructive">{errors.salaire_base.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Prime</Label>
              <Input type="number" step="0.01" {...register("prime", { valueAsNumber: true })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input {...register("description")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "En cours..." : editItem ? "Mettre à jour" : "Créer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
