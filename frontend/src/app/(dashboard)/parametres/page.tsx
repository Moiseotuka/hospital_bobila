"use client"

import { useState, useRef, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { parametreService } from "@/services/parametre.service"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  Building2,
  DollarSign,
  Percent,
  Settings2,
  Save,
  Upload,
  Loader2,
  Image,
  FileSignature,
  Stamp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/layout/page-header"
import { Separator } from "@/components/ui/separator"

const hopitalSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  adresse: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
})

const paieSchema = z.object({
  jour_traitement: z.number().min(1, "Min 1").max(31, "Max 31"),
  devise: z.string().min(1, "La devise est requise"),
  taux_change: z.number().min(0, "Doit être positif"),
})

const taxesSchema = z.object({
  taux_impot: z.number().min(0, "Min 0").max(100, "Max 100"),
  taux_cnss: z.number().min(0, "Min 0").max(100, "Max 100"),
  taux_cnss_employeur: z.number().min(0, "Min 0").max(100, "Max 100"),
})

const generalSchema = z.object({
  fuseau_horaire: z.string().optional(),
  format_date: z.string().optional(),
  langue: z.string().optional(),
})

type HopitalForm = z.infer<typeof hopitalSchema>
type PaieForm = z.infer<typeof paieSchema>
type TaxesForm = z.infer<typeof taxesSchema>
type GeneralForm = z.infer<typeof generalSchema>

function HopitalTab() {
  const queryClient = useQueryClient()
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)
  const [cachetPreview, setCachetPreview] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const signatureInputRef = useRef<HTMLInputElement>(null)
  const cachetInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["parametres", "hopital"],
    queryFn: () => parametreService.getParametreByKey("hopital"),
  })

  const settings = data?.data || data || {}

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<HopitalForm>({
    resolver: zodResolver(hopitalSchema),
    defaultValues: { nom: "", adresse: "", telephone: "", email: "" },
    values: {
      nom: settings.nom || "",
      adresse: settings.adresse || "",
      telephone: settings.telephone || "",
      email: settings.email || "",
    },
  })

  const mutation = useMutation({
    mutationFn: (formData: any) => parametreService.updateParametre(1, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parametres"] })
      toast.success("Paramètres de l'hôpital enregistrés")
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Erreur lors de la sauvegarde"),
  })

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setSignaturePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleCachetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setCachetPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Image className="h-4 w-4 text-primary" />
            Logo
          </CardTitle>
          <CardDescription>Logo de l'hôpital</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => logoInputRef.current?.click()}
          >
            {logoPreview || settings.logo ? (
              <img
                src={logoPreview || settings.logo}
                alt="Logo preview"
                className="max-h-32 max-w-full object-contain mb-2"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                <p className="text-sm">Cliquez pour uploader le logo</p>
                <p className="text-xs">PNG, JPG, SVG</p>
              </div>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4 text-primary" />
            Informations
          </CardTitle>
          <CardDescription>Informations générales de l'hôpital</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nom de l'hôpital *</Label>
            <Input {...register("nom")} className={errors.nom ? "border-destructive" : ""} />
            {errors.nom && <p className="text-xs text-destructive">{errors.nom.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Adresse</Label>
            <Input {...register("adresse")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input {...register("telephone")} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...register("email")} className={errors.email ? "border-destructive" : ""} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileSignature className="h-4 w-4 text-primary" />
            Signature & Cachet
          </CardTitle>
          <CardDescription>Signature autorisée et cachet officiel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2 block">Signature</Label>
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => signatureInputRef.current?.click()}
            >
              {signaturePreview || settings.signature ? (
                <img
                  src={signaturePreview || settings.signature}
                  alt="Signature"
                  className="max-h-20 object-contain mb-1"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <FileSignature className="h-6 w-6" />
                  <p className="text-xs">Cliquez pour uploader</p>
                </div>
              )}
              <input ref={signatureInputRef} type="file" accept="image/*" className="hidden" onChange={handleSignatureChange} />
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Cachet</Label>
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => cachetInputRef.current?.click()}
            >
              {cachetPreview || settings.cachet ? (
                <img
                  src={cachetPreview || settings.cachet}
                  alt="Cachet"
                  className="max-h-20 object-contain mb-1"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Stamp className="h-6 w-6" />
                  <p className="text-xs">Cliquez pour uploader</p>
                </div>
              )}
              <input ref={cachetInputRef} type="file" accept="image/*" className="hidden" onChange={handleCachetChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Enregistrer
        </Button>
      </div>
    </form>
  )
}

function PaieTab() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["parametres", "paie"],
    queryFn: () => parametreService.getParametreByKey("paie"),
  })

  const settings = data?.data || data || {}

  const { register, handleSubmit, formState: { errors } } = useForm<PaieForm>({
    resolver: zodResolver(paieSchema),
    defaultValues: { jour_traitement: 25, devise: "FC", taux_change: 1 },
    values: {
      jour_traitement: Number(settings.jour_traitement) || 25,
      devise: settings.devise || "FC",
      taux_change: Number(settings.taux_change) || 1,
    },
  })

  const mutation = useMutation({
    mutationFn: (formData: any) => parametreService.updateParametre(2, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parametres"] })
      toast.success("Paramètres de paie enregistrés")
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Erreur"),
  })

  if (isLoading) return <Card><CardContent className="p-6 space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</CardContent></Card>

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="h-4 w-4 text-primary" />
            Configuration de la Paie
          </CardTitle>
          <CardDescription>Paramètres généraux de traitement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Jour de traitement (du mois)</Label>
            <Input
              type="number"
              min={1}
              max={31}
              {...register("jour_traitement", { valueAsNumber: true })}
              className={errors.jour_traitement ? "border-destructive" : ""}
            />
            {errors.jour_traitement && <p className="text-xs text-destructive">{errors.jour_traitement.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Devise</Label>
              <Input {...register("devise")} className={errors.devise ? "border-destructive" : ""} />
              {errors.devise && <p className="text-xs text-destructive">{errors.devise.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Taux de change</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                {...register("taux_change", { valueAsNumber: true })}
                className={errors.taux_change ? "border-destructive" : ""}
              />
              {errors.taux_change && <p className="text-xs text-destructive">{errors.taux_change.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Enregistrer
        </Button>
      </div>
    </form>
  )
}

function TaxesTab() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["parametres", "taxes"],
    queryFn: () => parametreService.getParametreByKey("taxes"),
  })

  const settings = data?.data || data || {}

  const { register, handleSubmit, formState: { errors } } = useForm<TaxesForm>({
    resolver: zodResolver(taxesSchema),
    defaultValues: { taux_impot: 0, taux_cnss: 0, taux_cnss_employeur: 0 },
    values: {
      taux_impot: Number(settings.taux_impot) || 0,
      taux_cnss: Number(settings.taux_cnss) || 0,
      taux_cnss_employeur: Number(settings.taux_cnss_employeur) || 0,
    },
  })

  const mutation = useMutation({
    mutationFn: (formData: any) => parametreService.updateParametre(3, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parametres"] })
      toast.success("Paramètres fiscaux enregistrés")
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Erreur"),
  })

  if (isLoading) return <Card><CardContent className="p-6 space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</CardContent></Card>

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Percent className="h-4 w-4 text-primary" />
            Taux & Taxes
          </CardTitle>
          <CardDescription>Configuration des taux de prélèvement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Taux d'Impôt (%)</Label>
            <Input
              type="number"
              step="0.01"
              min={0}
              max={100}
              {...register("taux_impot", { valueAsNumber: true })}
              className={errors.taux_impot ? "border-destructive" : ""}
            />
            {errors.taux_impot && <p className="text-xs text-destructive">{errors.taux_impot.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Taux CNSS (Salarié) (%)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                max={100}
                {...register("taux_cnss", { valueAsNumber: true })}
                className={errors.taux_cnss ? "border-destructive" : ""}
              />
              {errors.taux_cnss && <p className="text-xs text-destructive">{errors.taux_cnss.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Taux CNSS (Employeur) (%)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                max={100}
                {...register("taux_cnss_employeur", { valueAsNumber: true })}
                className={errors.taux_cnss_employeur ? "border-destructive" : ""}
              />
              {errors.taux_cnss_employeur && <p className="text-xs text-destructive">{errors.taux_cnss_employeur.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Enregistrer
        </Button>
      </div>
    </form>
  )
}

function GeneralTab() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["parametres", "general"],
    queryFn: () => parametreService.getParametreByKey("general"),
  })

  const settings = data?.data || data || {}

  const { register, handleSubmit } = useForm<GeneralForm>({
    defaultValues: { fuseau_horaire: "", format_date: "", langue: "" },
    values: {
      fuseau_horaire: settings.fuseau_horaire || "",
      format_date: settings.format_date || "",
      langue: settings.langue || "",
    },
  })

  const mutation = useMutation({
    mutationFn: (formData: any) => parametreService.updateParametre(4, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parametres"] })
      toast.success("Paramètres généraux enregistrés")
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Erreur"),
  })

  if (isLoading) return <Card><CardContent className="p-6 space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</CardContent></Card>

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings2 className="h-4 w-4 text-primary" />
            Configuration Générale
          </CardTitle>
          <CardDescription>Préférences de l'application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Fuseau horaire</Label>
            <select
              {...register("fuseau_horaire")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Sélectionner...</option>
              <option value="Africa/Kinshasa">Africa/Kinshasa (UTC+1)</option>
              <option value="Africa/Lubumbashi">Africa/Lubumbashi (UTC+2)</option>
              <option value="UTC">UTC</option>
              <option value="Europe/Paris">Europe/Paris</option>
              <option value="America/New_York">America/New_York</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Format de date</Label>
            <select
              {...register("format_date")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Sélectionner...</option>
              <option value="dd/mm/yyyy">JJ/MM/AAAA</option>
              <option value="mm/dd/yyyy">MM/JJ/AAAA</option>
              <option value="yyyy-mm-dd">AAAA-MM-JJ</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Langue</Label>
            <select
              {...register("langue")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Sélectionner...</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="nl">Nederlands</option>
            </select>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Enregistrer
        </Button>
      </div>
    </form>
  )
}

export default function ParametresPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Paramètres"
        description="Configuration de l'application"
      />

      <Tabs defaultValue="hopital" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hopital" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Hôpital
          </TabsTrigger>
          <TabsTrigger value="paie" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Paie
          </TabsTrigger>
          <TabsTrigger value="taxes" className="flex items-center gap-2">
            <Percent className="h-4 w-4" /> Taxes
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" /> Général
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hopital"><HopitalTab /></TabsContent>
        <TabsContent value="paie"><PaieTab /></TabsContent>
        <TabsContent value="taxes"><TaxesTab /></TabsContent>
        <TabsContent value="general"><GeneralTab /></TabsContent>
      </Tabs>
    </motion.div>
  )
}
