"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { agentService } from "@/services/agent.service"
import { gradeService } from "@/services/grade.service"
import { fonctionService } from "@/services/fonction.service"
import { departementService } from "@/services/departement.service"
import { serviceService } from "@/services/service.service"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText,
  FileSpreadsheet,
  Filter,
  MoreHorizontal,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { PageHeader } from "@/components/layout/page-header"
import { useDebounce } from "@/hooks/useDebounce"
import { Agent } from "@/types"

const statutColors: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  actif: "success",
  suspendu: "warning",
  retraité: "secondary",
  retraite: "secondary",
  décédé: "destructive",
  decede: "destructive",
}

export default function AgentsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [departementFilter, setDepartementFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [statutFilter, setStatutFilter] = useState("all")
  const [situationFilter, setSituationFilter] = useState("all")
  const debouncedSearch = useDebounce(search, 300)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data: agentsData, isLoading } = useQuery({
    queryKey: ["agents", debouncedSearch, gradeFilter, departementFilter, serviceFilter, statutFilter, situationFilter],
    queryFn: () =>
      agentService.getAgents({
        search: debouncedSearch || undefined,
        grade_id: gradeFilter !== "all" ? gradeFilter : undefined,
        departement_id: departementFilter !== "all" ? departementFilter : undefined,
        service_id: serviceFilter !== "all" ? serviceFilter : undefined,
        statut: statutFilter !== "all" ? statutFilter : undefined,
        situation: situationFilter !== "all" ? situationFilter : undefined,
        per_page: 100,
      }),
  })

  const { data: gradesData } = useQuery({
    queryKey: ["grades", "all"],
    queryFn: () => gradeService.getGrades({ per_page: 100 }),
  })

  const { data: fonctionsData } = useQuery({
    queryKey: ["fonctions", "all"],
    queryFn: () => fonctionService.getFonctions({ per_page: 100 }),
  })

  const { data: departementsData } = useQuery({
    queryKey: ["departements", "all"],
    queryFn: () => departementService.getDepartements({ per_page: 100 }),
  })

  const { data: servicesData } = useQuery({
    queryKey: ["services", "all"],
    queryFn: () => serviceService.getServices({ per_page: 100 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => agentService.deleteAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] })
      toast.success("Agent supprimé avec succès")
      setDeleteId(null)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erreur lors de la suppression")
    },
  })

  const agents = agentsData?.data || agentsData || []
  const grades = gradesData?.data || gradesData || []
  const fonctions = fonctionsData?.data || fonctionsData || []
  const departements = departementsData?.data || departementsData || []
  const services = servicesData?.data || servicesData || []

  const filteredServices = serviceFilter === "all" || !departementFilter || departementFilter === "all"
    ? services
    : services.filter((s: any) => String(s.departement_id) === departementFilter)

  const columns: ColumnDef<Agent>[] = [
    {
      accessorKey: "matricule",
      header: "Matricule",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">{row.original.matricule}</span>
      ),
    },
    {
      id: "nom_complet",
      header: "Nom Complet",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.nom} {row.original.prenom}
        </span>
      ),
    },
    {
      accessorKey: "sexe",
      header: "Sexe",
      cell: ({ row }) => (
        <span>{row.original.sexe === "M" ? "Masculin" : "Féminin"}</span>
      ),
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ row }) => row.original.grade?.nom || "-",
    },
    {
      accessorKey: "fonction",
      header: "Fonction",
      cell: ({ row }) => row.original.fonction?.nom || "-",
    },
    {
      accessorKey: "departement",
      header: "Département",
      cell: ({ row }) => row.original.departement?.nom || "-",
    },
    {
      accessorKey: "statut",
      header: "Statut",
      cell: ({ row }) => {
        const statut = row.original.statut || "actif"
        return (
          <Badge variant={statutColors[statut] || "default"}>
            {statut.charAt(0).toUpperCase() + statut.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "type_agent",
      header: "Situation",
      cell: ({ row }) => {
        const type = row.original.type_agent
        return (
          <Badge variant={type === "militaire" ? "info" : "secondary"}>
            {type === "militaire" ? "Militaire" : "Civil"}
          </Badge>
        )
      },
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
            <DropdownMenuItem onClick={() => router.push(`/agents/${row.original.id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              Voir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/agents/${row.original.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </DropdownMenuItem>
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
        title="Agents"
        description="Gestion des agents"
        actions={
          <>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button asChild size="sm">
              <Link href="/agents/creer">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel Agent
              </Link>
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un agent..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les grades</SelectItem>
                  {(Array.isArray(grades) ? grades : []).map((g: any) => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={departementFilter} onValueChange={setDepartementFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  {(Array.isArray(departements) ? departements : []).map((d: any) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les services</SelectItem>
                  {(Array.isArray(filteredServices) ? filteredServices : []).map((s: any) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statutFilter} onValueChange={setStatutFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="suspendu">Suspendu</SelectItem>
                  <SelectItem value="retraite">Retraité</SelectItem>
                  <SelectItem value="decede">Décédé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={situationFilter} onValueChange={setSituationFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Situation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="militaire">Militaire</SelectItem>
                  <SelectItem value="civil">Civil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={Array.isArray(agents) ? agents : []}
            pageSize={15}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet agent ? Cette action est irréversible.
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
