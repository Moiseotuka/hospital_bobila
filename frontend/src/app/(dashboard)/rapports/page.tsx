"use client"

import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { rapportService } from "@/services/rapport.service"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  Calendar,
  Download,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  Users,
  DollarSign,
  Percent,
  Gift,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/layout/page-header"
import { formatCurrency } from "@/lib/utils"

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#f97316"]

const moisList = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
]

const currentYear = new Date().getFullYear()
const anneesList = Array.from({ length: 10 }, (_, i) => currentYear - i)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
}

function CardSkeleton() {
  return (
    <Card>
      <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  )
}

function RapportMensuelCard() {
  const [mois, setMois] = useState(String(new Date().getMonth() + 1))
  const [annee, setAnnee] = useState(String(currentYear))

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["rapport-mensuel", mois, annee],
    queryFn: () => rapportService.getRapportBulletins({ mois: Number(mois), annee: Number(annee) }),
    enabled: false,
  })

  const rap = data?.data || data

  const handleGenerate = () => refetch()

  const handleExport = useCallback(async (format: string) => {
    try {
      const blob = await rapportService.exportRapport("bulletins", format, { mois: Number(mois), annee: Number(annee) })
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement("a")
      a.href = url
      a.download = `rapport-mensuel-${mois}-${annee}.${format}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Rapport exporté en ${format.toUpperCase()}`)
    } catch {
      toast.error("Erreur lors de l'export")
    }
  }, [mois, annee])

  return (
    <motion.div variants={itemVariants}>
      <Card className="group hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4 text-primary" />
            Rapport Mensuel
          </CardTitle>
          <CardDescription>Bulletins de paie du mois</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs">Mois</Label>
              <Select value={mois} onValueChange={setMois}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {moisList.map((m, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs">Année</Label>
              <Select value={annee} onValueChange={setAnnee}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {anneesList.map((a) => (
                    <SelectItem key={a} value={String(a)}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleGenerate} className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Générer
          </Button>
          {rap && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3 pt-2 border-t"
            >
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-muted/50 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Total Brut</p>
                  <p className="font-semibold">{formatCurrency(rap.salaire_brut || rap.total_brut || 0)}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Total Net</p>
                  <p className="font-semibold">{formatCurrency(rap.salaire_net || rap.total_net || 0)}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Nombre d'Agents</p>
                  <p className="font-semibold">{rap.nombre_agents || rap.nb_agents || 0}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Masse Salariale</p>
                  <p className="font-semibold">{formatCurrency(rap.masse_salariale || rap.total_brut || 0)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleExport("pdf")}>
                  <FileText className="h-4 w-4 mr-2" /> PDF
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleExport("xlsx")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function RapportAnnuelCard() {
  const [annee, setAnnee] = useState(String(currentYear))

  const { data, isLoading } = useQuery({
    queryKey: ["rapport-annuel", annee],
    queryFn: () => rapportService.getRapportBulletins({ annee: Number(annee), per_page: 500 }),
  })

  const rap = data?.data || data
  const bulletins = Array.isArray(rap) ? rap : rap?.data || []

  const monthlyData = moisList.map((label, i) => {
    const m = i + 1
    const items = bulletins.filter((b: any) => {
      const date = b.date_generation || b.created_at
      if (!date) return false
      const d = new Date(date)
      return d.getMonth() + 1 === m && d.getFullYear() === Number(annee)
    })
    return {
      mois: label.slice(0, 3),
      brut: items.reduce((s: number, b: any) => s + (b.salaire_brut || 0), 0),
      net: items.reduce((s: number, b: any) => s + (b.salaire_net || 0), 0),
    }
  })

  const totals = monthlyData.reduce(
    (acc, m) => ({ brut: acc.brut + m.brut, net: acc.net + m.net }),
    { brut: 0, net: 0 }
  )

  const handleExport = useCallback(async (format: string) => {
    try {
      const blob = await rapportService.exportRapport("bulletins", format, { annee: Number(annee), type: "annuel" })
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement("a")
      a.href = url
      a.download = `rapport-annuel-${annee}.${format}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Rapport annuel exporté en ${format.toUpperCase()}`)
    } catch {
      toast.error("Erreur lors de l'export")
    }
  }, [annee])

  return (
    <motion.div variants={itemVariants}>
      <Card className="group hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" />
            Rapport Annuel
          </CardTitle>
          <CardDescription>Résumé annuel et évolution mensuelle</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Année</Label>
            <Select value={annee} onValueChange={setAnnee}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {anneesList.map((a) => (
                  <SelectItem key={a} value={String(a)}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-muted/50 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Total Brut Annuel</p>
                  <p className="font-semibold">{formatCurrency(totals.brut)}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Total Net Annuel</p>
                  <p className="font-semibold">{formatCurrency(totals.net)}</p>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mois" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value)]} />
                    <Bar dataKey="brut" name="Brut" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="net" name="Net" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleExport("pdf")}>
                  <FileText className="h-4 w-4 mr-2" /> PDF
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleExport("xlsx")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function MasseSalarialeCard() {
  const today = new Date()
  const defaultFrom = new Date(today.getFullYear(), today.getMonth() - 11, 1).toISOString().slice(0, 10)
  const defaultTo = today.toISOString().slice(0, 10)
  const [dateFrom, setDateFrom] = useState(defaultFrom)
  const [dateTo, setDateTo] = useState(defaultTo)

  const { data, isLoading } = useQuery({
    queryKey: ["rapport-masse-salariale", dateFrom, dateTo],
    queryFn: () => rapportService.getRapportMasseSalariale({ date_debut: dateFrom, date_fin: dateTo }),
  })

  const rap = data?.data || data
  const evolution = Array.isArray(rap) ? rap : rap?.evolution || rap?.data || []

  const totalMasse = Array.isArray(evolution)
    ? evolution.reduce((s: number, e: any) => s + (e.montant || e.total || 0), 0)
    : rap?.total_masse || rap?.masse_salariale || 0

  const handleExport = useCallback(async (format: string) => {
    try {
      const blob = await rapportService.exportRapport("masse-salariale", format, { date_debut: dateFrom, date_fin: dateTo })
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement("a")
      a.href = url
      a.download = `masse-salariale-${dateFrom}-${dateTo}.${format}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Exporté en ${format.toUpperCase()}`)
    } catch {
      toast.error("Erreur lors de l'export")
    }
  }, [dateFrom, dateTo])

  return (
    <motion.div variants={itemVariants}>
      <Card className="group hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="h-4 w-4 text-primary" />
            Masse Salariale
          </CardTitle>
          <CardDescription>Évolution de la masse salariale</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs">Du</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs">Au</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <>
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Total Masse Salariale</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(totalMasse)}</p>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={Array.isArray(evolution) ? evolution : []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mois" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value), "Montant"]} />
                    <Line
                      type="monotone"
                      dataKey="montant"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleExport("pdf")}>
                  <FileText className="h-4 w-4 mr-2" /> PDF
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleExport("xlsx")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function AgentsImpPayesCard() {
  const [periode, setPeriode] = useState(String(new Date().getMonth() + 1))

  const { data, isLoading } = useQuery({
    queryKey: ["rapport-impayes", periode],
    queryFn: () => rapportService.getRapportPaiements({ mois: Number(periode), statut: "impayé" }),
  })

  const rap = data?.data || data
  const agents = Array.isArray(rap) ? rap : rap?.agents || rap?.data || []

  const handleExport = useCallback(async (format: string) => {
    try {
      const blob = await rapportService.exportRapport("paiements", format, { mois: Number(periode), statut: "impayé" })
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement("a")
      a.href = url
      a.download = `agents-impayes-${periode}.${format}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Exporté en ${format.toUpperCase()}`)
    } catch {
      toast.error("Erreur lors de l'export")
    }
  }, [periode])

  return (
    <motion.div variants={itemVariants}>
      <Card className="group hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Agents Impayés
          </CardTitle>
          <CardDescription>Liste des agents non payés</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Période (Mois)</Label>
            <Select value={periode} onValueChange={setPeriode}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {moisList.map((m, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {agents.length} agent{agents.length > 1 ? "s" : ""} impayé{agents.length > 1 ? "s" : ""}
              </p>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {agents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucun agent impayé</p>
                ) : (
                  agents.map((a: any, i: number) => (
                    <div key={a.id || i} className="flex items-center justify-between text-sm bg-muted/30 rounded-lg px-3 py-2">
                      <span className="font-medium">{a.nom || a.agent?.nom || `Agent #${a.agent_id}`}</span>
                      <span className="text-destructive font-semibold">{formatCurrency(a.montant || 0)}</span>
                    </div>
                  ))
                )}
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => handleExport("xlsx")}>
                <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function RetenuesCard() {
  const [periode, setPeriode] = useState(String(new Date().getMonth() + 1))

  const { data, isLoading } = useQuery({
    queryKey: ["rapport-retenues", periode],
    queryFn: () => rapportService.getRapportBulletins({ mois: Number(periode), per_page: 500 }),
  })

  const rap = data?.data || data
  const bulletins = Array.isArray(rap) ? rap : rap?.data || []

  const retenuesMap: Record<string, number> = {}
  bulletins.forEach((b: any) => {
    const detail = b.retenues_detail || b.detail_retenues
    if (detail && typeof detail === "object") {
      Object.entries(detail).forEach(([key, val]) => {
        retenuesMap[key] = (retenuesMap[key] || 0) + Number(val)
      })
    }
  })

  const pieData = Object.entries(retenuesMap).map(([name, value]) => ({ name, value }))

  const handleExport = useCallback(async (format: string) => {
    try {
      const blob = await rapportService.exportRapport("bulletins", format, { mois: Number(periode), type: "retenues" })
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement("a")
      a.href = url
      a.download = `retenues-${periode}.${format}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Exporté en ${format.toUpperCase()}`)
    } catch {
      toast.error("Erreur lors de l'export")
    }
  }, [periode])

  return (
    <motion.div variants={itemVariants}>
      <Card className="group hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Percent className="h-4 w-4 text-orange-500" />
            Retenues
          </CardTitle>
          <CardDescription>Répartition des retenues par type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Période (Mois)</Label>
            <Select value={periode} onValueChange={setPeriode}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {moisList.map((m, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : pieData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucune retenue pour cette période</p>
          ) : (
            <>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value)]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-muted/30 rounded-lg px-3 py-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => handleExport("xlsx")}>
                <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function PrimesCard() {
  const [periode, setPeriode] = useState(String(new Date().getMonth() + 1))

  const { data, isLoading } = useQuery({
    queryKey: ["rapport-primes", periode],
    queryFn: () => rapportService.getRapportBulletins({ mois: Number(periode), per_page: 500 }),
  })

  const rap = data?.data || data
  const bulletins = Array.isArray(rap) ? rap : rap?.data || []

  const primesMap: Record<string, number> = {}
  bulletins.forEach((b: any) => {
    const detail = b.primes_detail || b.detail_primes
    if (detail && typeof detail === "object") {
      Object.entries(detail).forEach(([key, val]) => {
        primesMap[key] = (primesMap[key] || 0) + Number(val)
      })
    }
  })

  const barData = Object.entries(primesMap).map(([name, value]) => ({ name, value }))

  const handleExport = useCallback(async (format: string) => {
    try {
      const blob = await rapportService.exportRapport("bulletins", format, { mois: Number(periode), type: "primes" })
      const url = URL.createObjectURL(blob)
      const a = window.document.createElement("a")
      a.href = url
      a.download = `primes-${periode}.${format}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Exporté en ${format.toUpperCase()}`)
    } catch {
      toast.error("Erreur lors de l'export")
    }
  }, [periode])

  return (
    <motion.div variants={itemVariants}>
      <Card className="group hover:shadow-md transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gift className="h-4 w-4 text-emerald-500" />
            Primes
          </CardTitle>
          <CardDescription>Répartition des primes par type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Période (Mois)</Label>
            <Select value={periode} onValueChange={setPeriode}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {moisList.map((m, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : barData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucune prime pour cette période</p>
          ) : (
            <>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatCurrency(value)]} />
                    <Bar dataKey="value" name="Montant" fill="#22c55e" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {barData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-muted/30 rounded-lg px-3 py-1.5">
                    <span>{item.name}</span>
                    <span className="font-semibold">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => handleExport("xlsx")}>
                <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function RapportsPage() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader
        title="Rapports"
        description="États et statistiques de la paie"
      />

      <motion.div
        variants={containerVariants}
        className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        <RapportMensuelCard />
        <RapportAnnuelCard />
        <MasseSalarialeCard />
        <AgentsImpPayesCard />
        <RetenuesCard />
        <PrimesCard />
      </motion.div>
    </motion.div>
  )
}
