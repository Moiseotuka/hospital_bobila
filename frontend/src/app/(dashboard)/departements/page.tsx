"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { departementService } from "@/services/departement.service"
import { agentService } from "@/services/agent.service"
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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Departement } from "@/types"

const schema = z.object({
  code: z.string().min(1, "Le code est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  chef_departement_id: z.string().optional(),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function DepartementsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<Departement | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading } = useQuery({
    queryKey: ["departements", debouncedSearch],
    queryFn: () => departementService.getDepartements({ search: debouncedSearch || undefined, per_page: 100 }),
  })

  const { data: agentsData } = useQuery({
    queryKey: ["agents", "chefs"],
    queryFn: () => agentService.getAgents({ per_page: 100 }),
  })

  const createMut = useMutation({
    mutationFn: (d: any) => departementService.createDepartement(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["departements"] }); toast.success("Département créé"); setDialogOpen(false) },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Erreur"),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => departementService.updateDepartement(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["departements"] }); toast.success("Département mis à jour"); setDialogOpen(false); setEditItem(null) },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Erreur"),
  })
  const deleteMut = useMutation({
    mutationFn: (id: number) => departementService.deleteDepartement(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["departements"] }); toast.success("Département supprimé"); setDeleteId(null) },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Erreur"),
  })

  const items = data?.data || data || []
  const agents = agentsData?.data || agentsData || []

  const columns: ColumnDef<Departement>[] = [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "nom", header: "Nom" },
    {
      id: "nb_services",
      header: "Nb Services",
      cell: () => <span className="text-muted-foreground">-</span>,
    },
    {
      id: "chef",
      header: "Chef Département",
      cell: ({ row }) => row.original.chef ? `${row.original.chef.nom} ${row.original.chef.prenom}` : <span className="text-muted-foreground">-</span>,
    },
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
      <PageHeader title="Départements" description="Gestion des départements" actions={
        <Button onClick={() => { setEditItem(null); setDialogOpen(true) }}><Plus className="h-4 w-4 mr-2" /> Nouveau Département</Button>
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

      <DepartementDialog
        open={dialogOpen}
        onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditItem(null) }}
        editItem={editItem}
        agents={agents}
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

function DepartementDialog({ open, onOpenChange, editItem, agents, onSubmit, isPending }: {
  open: boolean; onOpenChange: (o: boolean) => void; editItem: Departement | null; agents: any[]; onSubmit: (d: FormData) => void; isPending: boolean
}) {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: editItem ? { code: editItem.code, nom: editItem.nom, chef_departement_id: String(editItem.chef_departement_id || ""), description: editItem.description || "" } : undefined,
    defaultValues: { code: "", nom: "", chef_departement_id: "", description: "" },
  })

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset() }}>
      <DialogContent>
        <DialogHeader><DialogTitle>{editItem ? "Modifier" : "Nouveau"} Département</DialogTitle></DialogHeader>
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
            <Label>Chef de Département</Label>
            <Select onValueChange={(v) => setValue("chef_departement_id", v)} value={editItem?.chef_departement_id ? String(editItem.chef_departement_id) : ""}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un chef" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun</SelectItem>
                {(Array.isArray(agents) ? agents : []).map((a: any) => (
                  <SelectItem key={a.id} value={String(a.id)}>{a.nom} {a.prenom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
