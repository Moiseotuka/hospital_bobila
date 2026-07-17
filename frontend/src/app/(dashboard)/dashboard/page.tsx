"use client"

import { useQuery } from "@tanstack/react-query"
import { dashboardService } from "@/services/dashboard.service"
import { motion } from "framer-motion"
import {
  Users,
  Shield,
  Briefcase,
  DollarSign,
  CheckCircle,
  Clock,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  Info,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/layout/page-header"
import { formatCurrency } from "@/lib/utils"

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"]

const statCards = [
  { key: "total_agents", label: "Total Agents", icon: Users, color: "blue" },
  { key: "total_militaires", label: "Militaires", icon: Shield, color: "green" },
  { key: "total_civils", label: "Civils", icon: Briefcase, color: "orange" },
  { key: "masse_salariale_mois", label: "Masse Salariale du Mois", icon: DollarSign, color: "primary", isCurrency: true },
]

const secondStatCards = [
  { key: "paiements_effectues", label: "Paiements Effectués", icon: CheckCircle, color: "green" },
  { key: "paiements_attente", label: "En Attente", icon: Clock, color: "yellow" },
  { key: "retenues_totales", label: "Retenues Totales", icon: ArrowDownCircle, color: "red", isCurrency: true },
  { key: "primes_totales", label: "Primes Totales", icon: ArrowUpCircle, color: "teal", isCurrency: true },
]

const colorMap: Record<string, string> = {
  blue: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
  green: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
  orange: "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400",
  primary: "text-primary bg-primary/10",
  yellow: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400",
  red: "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400",
  teal: "text-teal-600 bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400",
}

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

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCard({ item, value }: { item: any; value: any }) {
  const Icon = item.icon
  const displayValue = item.isCurrency ? formatCurrency(Number(value) || 0) : value ?? 0

  return (
    <motion.div variants={itemVariants}>
      <Card className="group hover:shadow-md transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colorMap[item.color]} transition-transform group-hover:scale-110 duration-200`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold mt-1">{displayValue}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.getDashboardData(),
  })

  const dashboardData = data?.data || data

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Tableau de Bord" description="Vue d'ensemble de la paie" />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader title="Tableau de Bord" description="Vue d'ensemble de la paie" />

      <motion.div
        variants={containerVariants}
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((item) => (
          <StatCard key={item.key} item={item} value={dashboardData?.[item.key]} />
        ))}
        {secondStatCards.map((item) => (
          <StatCard key={item.key} item={item} value={dashboardData?.[item.key]} />
        ))}
      </motion.div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Évolution Mensuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData?.evolution_mensuelle || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="mois"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [formatCurrency(value), "Montant"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="montant"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Répartition par Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData?.repartition_grade || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="valeur"
                      label={({ nom, percent }) => `${nom} ${(percent * 100).toFixed(0)}%`}
                    >
                      {(dashboardData?.repartition_grade || []).map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number, name: string) => [value, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Répartition par Département</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData?.repartition_departement || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="nom"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="nombre" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Derniers Paiements</CardTitle>
            </CardHeader>
            <CardContent>
              {(!dashboardData?.derniers_paiements || dashboardData.derniers_paiements.length === 0) ? (
                <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                  Aucun paiement récent
                </div>
              ) : (
                <div className="space-y-3">
                  {dashboardData.derniers_paiements.slice(0, 5).map((paiement: any, i: number) => (
                    <motion.div
                      key={paiement.id || i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {paiement.agent?.nom || paiement.agent_name || `Agent #${paiement.agent_id}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {paiement.date_paiement
                            ? new Date(paiement.date_paiement).toLocaleDateString("fr-FR")
                            : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{formatCurrency(paiement.montant || 0)}</p>
                        <Badge
                          variant={
                            paiement.statut === "effectué" || paiement.statut === "payé"
                              ? "success"
                              : paiement.statut === "en_attente"
                              ? "warning"
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {paiement.statut || "N/A"}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifications / Alertes</CardTitle>
          </CardHeader>
          <CardContent>
            {(!dashboardData?.alertes || dashboardData.alertes.length === 0) ? (
              <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
                Aucune alerte
              </div>
            ) : (
              <div className="space-y-2">
                {dashboardData.alertes.map((alerte: any, i: number) => (
                  <motion.div
                    key={alerte.id || i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    {alerte.type === "warning" || alerte.type === "danger" ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{alerte.message || alerte.titre}</p>
                      {alerte.date && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(alerte.date).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                    </div>
                    {alerte.type === "danger" && (
                      <Badge variant="destructive" className="ml-auto text-xs flex-shrink-0">
                        Urgent
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
