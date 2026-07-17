"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { categorieSalarialeService } from "@/services/categorieSalariale.service"
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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { CategorieSalariale } from "@/types"
import { formatCurrency } from "@/lib/utils"

const schema = z.object({
  code: z.string().min(1, "Le code est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  salaire_base: z.number().min(0, "Doit être positif"),
  indemnites: z.number().optional().default(0),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function CategoriesSalarialesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<CategorieSalariale | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useQuery({
    queryKey: ["categories-salariales", debouncedSearch],
    queryFn: () => categorieSalarialeService.getCategories({ search: debouncedSearch || undefined, per_page: 100 }),
  })

  const createMut = useMutation({
    mutationFn: (d: any) => categorieSalarialeService.createCategorie(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["categories-salariales"] }); toast.success("Catégorie créée"); setDialogOpen(false) },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Erreur"),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => categorieSalarialeService.updateCategorie(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["categories-salariales"] }); toast.success("Catégorie mise à jour"); setDialogOpen(false); setEditItem(null) },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Erreur"),
  })
  const deleteMut = useMutation({
    mutationFn: (id: number) => categorieSalarialeService.deleteCategorie(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["categories-salariales"] }); toast.success("Catégorie supprimée"); setDeleteId(null) },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Erreur"),
  })

  const items = data?.data || data || []

  const columns: ColumnDef<CategorieSalariale>[] = [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "nom", header: "Nom" },
    { accessorKey: "salaire_base", header: "Salaire de Base", cell: ({ row }) => formatCurrency(row.original.salaire_base || 0) },
    { accessorKey: "indemnites", header: "Indemnités", cell: ({ row }) => formatCurrency(row.original.indemnites || 0) },
    {
      accessorKey: "is_active", header: "Statut",
      cell: ({ row }) => <Badge variant={row.original.is_active ? "success" : "secondary"}>{row.original.is_active ? "Actif" : "Inactif"}</Badge>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setEditItem(row.original); setDialogOpen(true) }}><Edit className="h-4 w-4 mr-2" /> Modifier</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(row.original.id)}><Trash2 className="h-4 w-4 mr-2" /> Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Catégories Salariales" description="Gestion des catégories salariales" actions={
        <Button onClick={() => { setEditItem(null); setDialogOpen(true) }}><Plus className="h-4 w-4 mr-2" /> Nouvelle Catégorie</Button>
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

      <CategorieDialog
        open={dialogOpen}
        onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditItem(null) }}
        editItem={editItem}
        onSubmit={(d) => editItem ? updateMut.mutate({ id: editItem.id, data: d }) : createMut.mutate(d)}
        isPending={createMut.isPending || updateMut.isPending}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Confirmer la suppression</AlertDialogTitle><AlertDialogDescription>Êtes-vous sûr ?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive" onClick={() => deleteId && deleteMut.mutate(deleteId)}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

function CategorieDialog({ open, onOpenChange, editItem, onSubmit, isPending }: {
  open: boolean; onOpenChange: (o: boolean) => void; editItem: CategorieSalariale | null; onSubmit: (d: FormData) => void; isPending: boolean
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: editItem ? { code: editItem.code, nom: editItem.nom, salaire_base: editItem.salaire_base, indemnites: editItem.indemnites || 0, description: editItem.description || "" } : undefined,
    defaultValues: { code: "", nom: "", salaire_base: 0, indemnites: 0, description: "" },
  })

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset() }}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editItem ? "Modifier" : "Nouvelle"} Catégorie Salariale</DialogTitle></DialogHeader>
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
              <Label>Indemnités</Label>
              <Input type="number" step="0.01" {...register("indemnites", { valueAsNumber: true })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input {...register("description")} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "En cours..." : editItem ? "Mettre à jour" : "Créer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
