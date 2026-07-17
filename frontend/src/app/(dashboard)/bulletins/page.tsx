"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { bulletinService } from "@/services/bulletin.service"
import { paieService } from "@/services/paie.service"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import {
  Search,
  Eye,
  Download,
  Printer,
  Send,
  MoreHorizontal,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { PageHeader } from "@/components/layout/page-header"
import { BulletinPaie } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"

const moisList = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
]

export default function BulletinsPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [periodeFilter, setPeriodeFilter] = useState("all")
  const [statutFilter, setStatutFilter] = useState("all")

  const { data: bulletinsData, isLoading } = useQuery({
    queryKey: ["bulletins", search, periodeFilter, statutFilter],
    queryFn: () =>
      bulletinService.getBulletins({
        search: search || undefined,
        periode_paie_id: periodeFilter !== "all" ? periodeFilter : undefined,
        est_valide: statutFilter === "valide" ? true : statutFilter === "non_valide" ? false : undefined,
        per_page: 100,
      }),
  })

  const { data: periodesData } = useQuery({
    queryKey: ["periodes-paie", "list"],
    queryFn: () => paieService.getPeriodes({ per_page: 100 }),
  })

  const bulletins: BulletinPaie[] = bulletinsData?.data || bulletinsData || []
  const periodes: any[] = periodesData?.data || periodesData || []

  const totalBrut = (Array.isArray(bulletins) ? bulletins : []).reduce(
    (sum, b) => sum + (b.salaire_brut || 0),
    0
  )
  const totalNet = (Array.isArray(bulletins) ? bulletins : []).reduce(
    (sum, b) => sum + (b.net_a_payer || 0),
    0
  )

  const handleDownloadPDF = async (id: number) => {
    try {
      const blob = await bulletinService.exportPDF(id)
      const url = window.URL.createObjectURL(blob)
      const a = window.document.createElement("a")
      a.href = url
      a.download = `bulletin-${id}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Erreur lors du téléchargement PDF", error)
    }
  }

  const columns: ColumnDef<BulletinPaie>[] = [
    {
      accessorKey: "matricule",
      header: "Matricule",
      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">{row.original.matricule}</span>
      ),
    },
    {
      id: "agent",
      header: "Agent",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.nom_complet}</span>
      ),
    },
    {
      id: "periode",
      header: "Période",
      cell: ({ row }) => {
        const p = row.original.periode
        if (p) return `${moisList[p.mois - 1] || p.mois} ${p.annee}`
        return "-"
      },
    },
    {
      accessorKey: "salaire_brut",
      header: "Salaire Brut",
      cell: ({ row }) => formatCurrency(row.original.salaire_brut || 0),
    },
    {
      accessorKey: "total_primes",
      header: "Total Primes",
      cell: ({ row }) => (
        <span className="text-green-600 font-medium">
          {formatCurrency(row.original.total_primes || 0)}
        </span>
      ),
    },
    {
      accessorKey: "total_retenues",
      header: "Total Retenues",
      cell: ({ row }) => (
        <span className="text-red-600 font-medium">
          {formatCurrency(row.original.total_retenues || 0)}
        </span>
      ),
    },
    {
      accessorKey: "net_a_payer",
      header: "Net à Payer",
      cell: ({ row }) => (
        <span className="font-bold">{formatCurrency(row.original.net_a_payer || 0)}</span>
      ),
    },
    {
      id: "statut",
      header: "Statut",
      cell: ({ row }) => {
        const b = row.original
        if (b.est_verrouille) return <Badge variant="secondary">Verrouillé</Badge>
        if (b.est_valide) return <Badge variant="success">Validé</Badge>
        return <Badge variant="warning">En attente</Badge>
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
            <DropdownMenuItem onClick={() => router.push(`/bulletins/${row.original.id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              Voir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownloadPDF(row.original.id)}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Send className="h-4 w-4 mr-2" />
              Envoyer par Email
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
        title="Bulletins de Paie"
        description="Gestion des bulletins de paie des agents"
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou matricule..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={periodeFilter} onValueChange={setPeriodeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                {(Array.isArray(periodes) ? periodes : []).map((p: any) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {moisList[p.mois - 1] || p.mois} {p.annee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statutFilter} onValueChange={setStatutFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="valide">Validé</SelectItem>
                <SelectItem value="non_valide">Non validé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Brut</p>
            <p className="text-2xl font-bold">{formatCurrency(totalBrut)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Net</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalNet)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Nombre de bulletins</p>
            <p className="text-2xl font-bold">
              {(Array.isArray(bulletins) ? bulletins : []).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={Array.isArray(bulletins) ? bulletins : []}
            isLoading={isLoading}
            pageSize={15}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}
