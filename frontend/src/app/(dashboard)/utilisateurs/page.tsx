"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { userService } from "@/services/user.service"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  ShieldAlert,
  MoreHorizontal,
  UserPlus,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Ban,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTable } from "@/components/ui/data-table"
import { PageHeader } from "@/components/layout/page-header"
import { formatDateTime, getInitials } from "@/lib/utils"
import { User } from "@/types"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const roleColors: Record<string, string> = {
  administrateur: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  chef_rh: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  comptable: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  direction: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  auditeur: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
}

const roleLabels: Record<string, string> = {
  administrateur: "Administrateur",
  chef_rh: "Chef RH",
  comptable: "Comptable",
  direction: "Direction",
  auditeur: "Auditeur",
}

const userSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  role: z.string().min(1, "Le rôle est requis"),
  password: z.string().min(6, "Minimum 6 caractères").optional().or(z.literal("")),
  password_confirmation: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  is_active: z.boolean().default(true),
}).refine(
  (data) => {
    if (data.password && data.password !== data.password_confirmation) return false
    return true
  },
  { message: "Les mots de passe ne correspondent pas", path: ["password_confirmation"] }
)

type UserFormData = z.infer<typeof userSchema>

function UserDialog({
  open,
  onOpenChange,
  editItem,
  onSubmit,
  isPending,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  editItem: User | null
  onSubmit: (d: UserFormData) => void
  isPending: boolean
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      password: "",
      password_confirmation: "",
      phone: "",
      is_active: true,
    },
    values: editItem
      ? {
          name: editItem.name,
          email: editItem.email,
          role: editItem.role,
          password: "",
          password_confirmation: "",
          phone: editItem.phone || "",
          is_active: editItem.is_active,
        }
      : undefined,
  })

  const isActive = watch("is_active")

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o)
        if (!o) reset()
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            {editItem ? "Modifier l'utilisateur" : "Nouvel Utilisateur"}
          </DialogTitle>
          <DialogDescription>
            {editItem ? "Modifier les informations de l'utilisateur" : "Créer un nouveau compte utilisateur"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Nom complet *</Label>
            <Input {...register("name")} className={errors.name ? "border-destructive" : ""} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input type="email" {...register("email")} className={errors.email ? "border-destructive" : ""} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Rôle *</Label>
            <Select
              value={watch("role")}
              onValueChange={(v) => setValue("role", v, { shouldValidate: true })}
            >
              <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roleLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{editItem ? "Nouveau mot de passe" : "Mot de passe *"}</Label>
              <Input
                type="password"
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
                placeholder={editItem ? "Laisser vide pour conserver" : "Minimum 6 caractères"}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Confirmer le mot de passe</Label>
              <Input
                type="password"
                {...register("password_confirmation")}
                className={errors.password_confirmation ? "border-destructive" : ""}
              />
              {errors.password_confirmation && (
                <p className="text-xs text-destructive">{errors.password_confirmation.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Téléphone</Label>
            <Input {...register("phone")} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="is_active" className="cursor-pointer">Compte actif</Label>
              <p className="text-xs text-muted-foreground">
                {isActive ? "L'utilisateur peut se connecter" : "L'utilisateur est suspendu"}
              </p>
            </div>
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={(v) => setValue("is_active", v)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {editItem ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function UtilisateursPage() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<User | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [toggleId, setToggleId] = useState<number | null>(null)
  const [toggleAction, setToggleAction] = useState<boolean | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers({ per_page: 100 }),
  })

  const users = data?.data || data || []

  const createMut = useMutation({
    mutationFn: (d: any) => userService.createUser(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Utilisateur créé avec succès")
      setDialogOpen(false)
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Erreur lors de la création"),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data: d }: { id: number; data: any }) => userService.updateUser(id, d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Utilisateur mis à jour")
      setDialogOpen(false)
      setEditItem(null)
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Erreur lors de la mise à jour"),
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Utilisateur supprimé")
      setDeleteId(null)
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Erreur lors de la suppression"),
  })

  const handleToggleStatus = async (user: User) => {
    try {
      await userService.updateUser(user.id, { is_active: !user.is_active })
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success(`Utilisateur ${user.is_active ? "suspendu" : "activé"} avec succès`)
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Erreur lors de la modification")
    }
  }

  const handleSubmit = (formData: UserFormData) => {
    const payload = { ...formData }
    if (!payload.password) {
      delete payload.password
      delete payload.password_confirmation
    }
    if (editItem) {
      updateMut.mutate({ id: editItem.id, data: payload })
    } else {
      createMut.mutate(payload)
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      id: "avatar_name",
      header: "Utilisateur",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.original.photo} />
            <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="text-sm">{row.original.email}</span>,
    },
    {
      accessorKey: "role",
      header: "Rôle",
      cell: ({ row }) => {
        const role = row.original.role
        return (
          <Badge className={roleColors[role] || ""} variant="outline">
            {roleLabels[role] || role}
          </Badge>
        )
      },
    },
    {
      accessorKey: "is_active",
      header: "Statut",
      cell: ({ row }) => {
        const active = row.original.is_active
        return (
          <Badge variant={active ? "success" : "secondary"}>
            <div className="flex items-center gap-1">
              {active ? <CheckCircle2 className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
              {active ? "Actif" : "Suspendu"}
            </div>
          </Badge>
        )
      },
    },
    {
      accessorKey: "derniere_connexion",
      header: "Dernière Connexion",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.derniere_connexion ? formatDateTime(row.original.derniere_connexion) : "Jamais"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditItem(row.original)
                setDialogOpen(true)
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleStatus(row.original)}>
              {row.original.is_active ? (
                <><Ban className="h-4 w-4 mr-2" /> Suspendre</>
              ) : (
                <><CheckCircle2 className="h-4 w-4 mr-2" /> Activer</>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteId(row.original.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
        title="Utilisateurs"
        description="Gestion des accès"
        actions={
          <Button
            onClick={() => {
              setEditItem(null)
              setDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Utilisateur
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={Array.isArray(users) ? users : []}
            pageSize={10}
            isLoading={isLoading}
          />

          {isError && (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-destructive">
                Erreur lors du chargement des utilisateurs. Veuillez réessayer.
              </p>
            </div>
          )}

          {!isLoading && !isError && Array.isArray(users) && users.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShieldAlert className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Aucun utilisateur</p>
              <p className="text-sm text-muted-foreground mb-4">
                Commencez par créer un premier utilisateur.
              </p>
              <Button
                onClick={() => {
                  setEditItem(null)
                  setDialogOpen(true)
                }}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Créer un utilisateur
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <UserDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o)
          if (!o) setEditItem(null)
        }}
        editItem={editItem}
        onSubmit={handleSubmit}
        isPending={createMut.isPending || updateMut.isPending}
      />

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && deleteMut.mutate(deleteId)}
              disabled={deleteMut.isPending}
            >
              {deleteMut.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
