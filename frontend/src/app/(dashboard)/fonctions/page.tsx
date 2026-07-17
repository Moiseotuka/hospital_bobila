"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fonctionService } from "@/services/fonction.service"
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
import { Fonction } from "@/types"
import { formatCurrency } from "@/lib/utils"

const schema = z.object({
  code: z.string().min(1, "Le code est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  prime_fonction: z.number().min(0).default(0),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function FonctionsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<Fonction | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useQuery({
    queryKey: ["fonctions", debouncedSearch],
    queryFn: () => fonctionService.getFonctions({ search: debouncedSearch || undefined, per_page: 100 }),
  })

  const createMut = useMutation({
    mutationFn: (d: any) => fonctionService.createFonction(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["fonctions"] }); toast.success("Fonction créée"); setDialogOpen(false) },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Erreur"),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => fonctionService.updateFonction(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["fonctions"] }); toast.success("Fonction mise à jour"); setDialogOpen(false); setEditItem(null) },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Erreur"),
  })
  const deleteMut = useMutation({
    mutationFn: (id: number) => fonctionService.deleteFonction(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["fonctions"] }); toast.success("Fonction supprimée"); setDeleteId(null) },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Erreur"),
  })

  const items = data?.data || data || []

  const columns: ColumnDef<Fonction>[] = [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "nom", header: "Nom" },
    { accessorKey: "prime_fonction", header: "Prime Fonction", cell: ({ row }) => formatCurrency(row.original.prime_fonction || 0) },
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
      <PageHeader title="Fonctions" description="Gestion des fonctions" actions={
        <Button onClick={() => { setEditItem(null); setDialogOpen(true) }}><Plus className="h-4 w-4 mr-2" /> Nouvelle Fonction</Button>
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

      <FonctionDialog
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

function FonctionDialog({ open, onOpenChange, editItem, onSubmit, isPending }: {
  open: boolean; onOpenChange: (o: boolean) => void; editItem: Fonction | null; onSubmit: (d: FormData) => void; isPending: boolean
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: editItem ? { code: editItem.code, nom: editItem.nom, prime_fonction: editItem.prime_fonction || 0, description: editItem.description || "" } : undefined,
    defaultValues: { code: "", nom: "", prime_fonction: 0, description: "" },
  })

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset() }}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editItem ? "Modifier" : "Nouvelle"} Fonction</DialogTitle></DialogHeader>
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
          <div className="space-y-2">
            <Label>Prime Fonction</Label>
            <Input type="number" step="0.01" {...register("prime_fonction", { valueAsNumber: true })} />
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
