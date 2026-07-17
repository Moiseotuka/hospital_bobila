"use client"

import { useQuery } from "@tanstack/react-query"
import { bulletinService } from "@/services/bulletin.service"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  Download,
  Printer,
  Send,
  Loader2,
  FileText,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/layout/page-header"
import { BulletinPaie } from "@/types"
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils"

const moisList = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
]

export default function BulletinDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const { data: bulletinData, isLoading } = useQuery({
    queryKey: ["bulletin", id],
    queryFn: () => bulletinService.getBulletin(id),
    enabled: !!id,
  })

  const bulletin: BulletinPaie | null = bulletinData?.data || bulletinData || null

  const handleDownloadPDF = async () => {
    try {
      const blob = await bulletinService.exportPDF(id)
      const url = window.URL.createObjectURL(blob)
      const a = window.document.createElement("a")
      a.href = url
      a.download = `bulletin-${id}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success("PDF téléchargé avec succès")
    } catch (error) {
      toast.error("Erreur lors du téléchargement du PDF")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSendEmail = () => {
    toast.success("Bulletin envoyé par email")
  }

  if (isLoading) {
    return <BulletinSkeleton />
  }

  if (!bulletin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Bulletin non trouvé</h2>
        <p className="text-muted-foreground">Le bulletin demandé n&apos;existe pas ou a été supprimé.</p>
        <Button onClick={() => router.push("/bulletins")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux bulletins
        </Button>
      </div>
    )
  }

  const primesDetail = bulletin.primes_detail
    ? typeof bulletin.primes_detail === "string"
      ? JSON.parse(bulletin.primes_detail)
      : bulletin.primes_detail
    : null

  const retenuesDetail = bulletin.retenues_detail
    ? typeof bulletin.retenues_detail === "string"
      ? JSON.parse(bulletin.retenues_detail)
      : bulletin.retenues_detail
    : null

  const primesList: { nom: string; montant: number }[] = primesDetail
    ? Array.isArray(primesDetail)
      ? primesDetail
      : Object.entries(primesDetail).map(([nom, montant]) => ({ nom, montant: Number(montant) }))
    : []

  const retenuesList: { nom: string; montant: number }[] = retenuesDetail
    ? Array.isArray(retenuesDetail)
      ? retenuesDetail
      : Object.entries(retenuesDetail).map(([nom, montant]) => ({ nom, montant: Number(montant) }))
    : []

  const periode = bulletin.periode
  const moisPeriode = periode ? `${moisList[periode.mois - 1] || periode.mois} ${periode.annee}` : ""

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Bulletin de Paie"
        description={`Détail du bulletin - ${bulletin.nom_complet}`}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => router.push("/bulletins")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <Button size="sm" onClick={handleSendEmail}>
              <Send className="h-4 w-4 mr-2" />
              Envoyer par Email
            </Button>
          </div>
        }
      />

      <div id="bulletin-content" className="max-w-4xl mx-auto space-y-6 print:space-y-4">
        <Card className="print:shadow-none print:border print:border-gray-300">
          <CardContent className="p-8 print:p-6">
            <div className="text-center mb-8 print:mb-6">
              <div className="flex justify-center mb-2">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center print:bg-gray-100">
                  <Shield className="h-8 w-8 text-primary print:text-gray-700" />
                </div>
              </div>
              <h1 className="text-2xl font-bold tracking-tight print:text-xl">
                Hôpital Militaire Central Camp Kokolo
              </h1>
              <p className="text-sm text-muted-foreground">
                République Démocratique du Congo
              </p>
              <Separator className="my-4 print:my-3" />
              <h2 className="text-xl font-bold text-primary print:text-gray-900">
                BULLETIN DE PAIE
              </h2>
              <p className="text-lg font-semibold mt-1">{moisPeriode}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg print:bg-gray-50 print:border print:border-gray-200">
              <div>
                <p className="text-xs text-muted-foreground">Matricule</p>
                <p className="font-mono font-semibold">{bulletin.matricule}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Nom Complet</p>
                <p className="font-semibold">{bulletin.nom_complet}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Grade</p>
                <p className="font-medium">{bulletin.grade_nom || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fonction</p>
                <p className="font-medium">{bulletin.fonction_nom || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Département</p>
                <p className="font-medium">{bulletin.departement_nom || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Service</p>
                <p className="font-medium">{bulletin.service_nom || "N/A"}</p>
              </div>
            </div>

            <table className="w-full border-collapse mb-6 print:mb-4">
              <thead>
                <tr className="border-b-2 border-primary print:border-gray-800">
                  <th className="text-left py-3 px-2 font-semibold text-primary print:text-gray-900">
                    Rubrique
                  </th>
                  <th className="text-right py-3 px-2 font-semibold text-primary print:text-gray-900">
                    Montant (CDF)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-2 font-medium">Salaire de Base</td>
                  <td className="py-3 px-2 text-right font-medium">
                    {formatCurrency(bulletin.salaire_base || 0)}
                  </td>
                </tr>

                {primesList.length > 0 && (
                  <>
                    <tr className="border-b bg-green-50/50 print:bg-gray-50">
                      <td className="py-2 px-2 text-sm font-semibold text-green-700 print:text-gray-700">
                        Total Primes
                      </td>
                      <td className="py-2 px-2 text-right text-sm font-semibold text-green-700 print:text-gray-700">
                        {formatCurrency(bulletin.total_primes || 0)}
                      </td>
                    </tr>
                    {primesList.map((prime, idx) => (
                      <tr key={idx} className="border-b text-sm">
                        <td className="py-1.5 px-4 text-muted-foreground">{prime.nom}</td>
                        <td className="py-1.5 px-2 text-right text-muted-foreground">
                          {formatCurrency(prime.montant)}
                        </td>
                      </tr>
                    ))}
                  </>
                )}

                {retenuesList.length > 0 && (
                  <>
                    <tr className="border-b bg-red-50/50 print:bg-gray-50">
                      <td className="py-2 px-2 text-sm font-semibold text-red-700 print:text-gray-700">
                        Total Retenues
                      </td>
                      <td className="py-2 px-2 text-right text-sm font-semibold text-red-700 print:text-gray-700">
                        -{formatCurrency(bulletin.total_retenues || 0)}
                      </td>
                    </tr>
                    {retenuesList.map((retenue, idx) => (
                      <tr key={idx} className="border-b text-sm">
                        <td className="py-1.5 px-4 text-muted-foreground">{retenue.nom}</td>
                        <td className="py-1.5 px-2 text-right text-muted-foreground">
                          -{formatCurrency(retenue.montant)}
                        </td>
                      </tr>
                    ))}
                  </>
                )}

                <tr className="border-b border-t-2 border-gray-300">
                  <td className="py-3 px-2 font-semibold">Salaire Brut</td>
                  <td className="py-3 px-2 text-right font-semibold">
                    {formatCurrency(bulletin.salaire_brut || 0)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-2 font-semibold">Salaire Net</td>
                  <td className="py-3 px-2 text-right font-semibold">
                    {formatCurrency(bulletin.salaire_net || 0)}
                  </td>
                </tr>
                <tr className="bg-primary/5 print:bg-gray-100">
                  <td className="py-4 px-2 text-lg font-bold text-primary print:text-gray-900">
                    Net à Payer
                  </td>
                  <td className="py-4 px-2 text-right text-lg font-bold text-primary print:text-gray-900">
                    {formatCurrency(bulletin.net_a_payer || 0)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/30 rounded-lg print:bg-gray-50 print:border print:border-gray-200">
              <div>
                <p className="text-xs text-muted-foreground">Date de génération</p>
                <p className="font-medium text-sm">
                  {bulletin.date_generation
                    ? formatDateTime(bulletin.date_generation)
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Validé</p>
                <p className="font-medium text-sm">
                  <Badge variant={bulletin.est_valide ? "success" : "warning"}>
                    {bulletin.est_valide ? "Oui" : "Non"}
                  </Badge>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Verrouillé</p>
                <p className="font-medium text-sm">
                  <Badge variant={bulletin.est_verrouille ? "secondary" : "outline"}>
                    {bulletin.est_verrouille ? "Oui" : "Non"}
                  </Badge>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">QR Code</p>
                <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  QR
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end pt-4 border-t print:border-gray-300">
              <div className="text-center">
                <div className="h-16 w-32 border-b border-gray-400 mb-1" />
                <p className="text-xs text-muted-foreground">Signature de l&apos;agent</p>
              </div>
              <div className="text-center">
                <div className="h-16 w-32 border-b border-gray-400 mb-1" />
                <p className="text-xs text-muted-foreground">Signature du responsable</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

function BulletinSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-40" />
        </div>
      </div>
      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-6 w-64 mx-auto" />
              <Skeleton className="h-4 w-48 mx-auto" />
              <Skeleton className="h-8 w-40 mx-auto" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
