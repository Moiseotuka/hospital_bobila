"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { agentService } from "@/services/agent.service"
import { bulletinService } from "@/services/bulletin.service"
import { auditService } from "@/services/audit.service"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Briefcase,
  Building2,
  Server,
  Banknote,
  CreditCard,
  User,
  Download,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/layout/page-header"
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
import { formatCurrency, formatDate, getInitials } from "@/lib/utils"

export default function AgentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const agentId = Number(params.id)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data: agentData, isLoading } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: () => agentService.getAgent(agentId),
    enabled: !!agentId,
  })

  const { data: bulletinsData } = useQuery({
    queryKey: ["bulletins", "agent", agentId],
    queryFn: () => bulletinService.getBulletinsByAgent(agentId),
    enabled: !!agentId,
  })

  const { data: auditsData } = useQuery({
    queryKey: ["audits", "agent", agentId],
    queryFn: () => auditService.getAuditLogs({ model_type: "Agent", model_id: agentId }),
    enabled: !!agentId,
  })

  const deleteMutation = useMutation({
    mutationFn: () => agentService.deleteAgent(agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] })
      toast.success("Agent supprimé avec succès")
      router.push("/agents")
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erreur lors de la suppression")
    },
  })

  const agent = agentData?.data || agentData
  const bulletins = bulletinsData?.data || bulletinsData || []
  const audits = auditsData?.data || auditsData || []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <Skeleton className="h-48 lg:col-span-1" />
          <Skeleton className="h-48 lg:col-span-2" />
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Agent non trouvé</p>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/agents")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux agents
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/agents/${agentId}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer {agent.nom} {agent.prenom} ? Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={agent.photo} alt={`${agent.nom} ${agent.prenom}`} />
              <AvatarFallback className="text-lg">
                {getInitials(`${agent.nom} ${agent.prenom}`)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">
              {agent.nom} {agent.prenom}
            </h2>
            <p className="text-sm text-muted-foreground">{agent.grade?.nom || "Sans grade"}</p>
            <Badge variant="info" className="mt-2">
              {agent.matricule}
            </Badge>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant={agent.statut === "actif" ? "success" : agent.statut === "suspendu" ? "warning" : "secondary"}>
                {agent.statut}
              </Badge>
              <Badge variant={agent.type_agent === "militaire" ? "info" : "secondary"}>
                {agent.type_agent === "militaire" ? "Militaire" : "Civil"}
              </Badge>
            </div>
            <Separator className="my-4" />
            <div className="w-full space-y-2 text-sm">
              {agent.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" /> {agent.email}
                </div>
              )}
              {agent.telephone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" /> {agent.telephone}
                </div>
              )}
              {agent.adresse && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {agent.adresse}
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" /> Née le {formatDate(agent.date_naissance)}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="informations" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="informations">Informations</TabsTrigger>
              <TabsTrigger value="paie">Paie</TabsTrigger>
              <TabsTrigger value="bulletins">Bulletins</TabsTrigger>
              <TabsTrigger value="historique">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="informations" className="space-y-4 mt-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Professionnel</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    <div>
                      <Label>Fonction</Label>
                      <p className="text-sm font-medium">{agent.fonction?.nom || "-"}</p>
                    </div>
                    <div>
                      <Label>Département</Label>
                      <p className="text-sm font-medium">{agent.departement?.nom || "-"}</p>
                    </div>
                    <div>
                      <Label>Service</Label>
                      <p className="text-sm font-medium">{agent.service?.nom || "-"}</p>
                    </div>
                    <div>
                      <Label>Catégorie Salariale</Label>
                      <p className="text-sm font-medium">{agent.categorie_salariale?.nom || "-"}</p>
                    </div>
                    <div>
                      <Label>Date d'Engagement</Label>
                      <p className="text-sm font-medium">{formatDate(agent.date_recrutement)}</p>
                    </div>
                    <div>
                      <Label>Grade</Label>
                      <p className="text-sm font-medium">{agent.grade?.nom || "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Bancaire & CNSS</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    <div>
                      <Label>Compte Bancaire</Label>
                      <p className="text-sm font-medium">{agent.numero_compte || "-"}</p>
                    </div>
                    <div>
                      <Label>Banque</Label>
                      <p className="text-sm font-medium">{agent.banque || "-"}</p>
                    </div>
                    <div>
                      <Label>CNSS</Label>
                      <p className="text-sm font-medium">{agent.numero_securite_sociale || "-"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="paie" className="space-y-4 mt-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Bulletins de Paie</CardTitle></CardHeader>
                <CardContent>
                  {(!Array.isArray(bulletins) || bulletins.length === 0) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucun bulletin de paie trouvé
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {bulletins.map((b: any, i: number) => (
                        <motion.div
                          key={b.id || i}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {b.periode ? `${b.periode.mois}/${b.periode.annee}` : "N/A"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Net: {formatCurrency(b.salaire_net || 0)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={b.est_valide ? "success" : "warning"}>
                              {b.est_valide ? "Validé" : "En attente"}
                            </Badge>
                            <Button variant="ghost" size="icon" title="Télécharger PDF">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bulletins" className="space-y-4 mt-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Documents PDF</CardTitle></CardHeader>
                <CardContent>
                  {(!Array.isArray(bulletins) || bulletins.length === 0) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucun bulletin PDF disponible
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {bulletins.map((b: any, i: number) => (
                        <motion.div
                          key={b.id || i}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded bg-destructive/10 text-destructive">
                              <Download className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Bulletin - {b.periode ? `${b.periode.mois}/${b.periode.annee}` : "N/A"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(b.date_generation || b.created_at)}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            PDF
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historique" className="space-y-4 mt-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Historique des Actions</CardTitle></CardHeader>
                <CardContent>
                  {(!Array.isArray(audits) || audits.length === 0) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucune action enregistrée
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {audits.slice(0, 20).map((log: any, i: number) => (
                        <motion.div
                          key={log.id || i}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-start gap-3 rounded-lg border p-3"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">{log.user?.name || "Système"}</span>{" "}
                              {log.description || log.action}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatDate(log.created_at)}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {log.module}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground mb-0.5">{children}</p>
}
