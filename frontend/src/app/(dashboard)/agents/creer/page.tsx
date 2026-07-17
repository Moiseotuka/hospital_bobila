"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { agentService } from "@/services/agent.service"
import { gradeService } from "@/services/grade.service"
import { fonctionService } from "@/services/fonction.service"
import { departementService } from "@/services/departement.service"
import { serviceService } from "@/services/service.service"
import { categorieSalarialeService } from "@/services/categorieSalariale.service"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Upload,
  X,
  ArrowLeft,
  Save,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/layout/page-header"

const agentSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  postnom: z.string().optional(),
  prenom: z.string().min(1, "Le prénom est requis"),
  sexe: z.enum(["M", "F"], { required_error: "Le sexe est requis" }),
  date_naissance: z.string().min(1, "La date de naissance est requise"),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  matricule: z.string().min(1, "Le matricule est requis"),
  date_recrutement: z.string().min(1, "La date d'engagement est requise"),
  type_agent: z.enum(["militaire", "civil"], { required_error: "Le type est requis" }),
  grade_id: z.string().min(1, "Le grade est requis"),
  fonction_id: z.string().min(1, "La fonction est requise"),
  departement_id: z.string().min(1, "Le département est requis"),
  service_id: z.string().optional(),
  categorie_salariale_id: z.string().optional(),
  numero_compte: z.string().optional(),
  banque: z.string().optional(),
  numero_securite_sociale: z.string().optional(),
  statut: z.enum(["actif", "suspendu", "retraite", "decede"], { required_error: "Le statut est requis" }),
})

type AgentForm = z.infer<typeof agentSchema>

export default function CreerAgentPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-salariales", "all"],
    queryFn: () => categorieSalarialeService.getCategories({ per_page: 100 }),
  })

  const grades = gradesData?.data || gradesData || []
  const fonctions = fonctionsData?.data || fonctionsData || []
  const departements = departementsData?.data || departementsData || []
  const services = servicesData?.data || servicesData || []
  const categories = categoriesData?.data || categoriesData || []

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AgentForm>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      nom: "",
      postnom: "",
      prenom: "",
      sexe: "M",
      date_naissance: "",
      telephone: "",
      adresse: "",
      email: "",
      matricule: "",
      date_recrutement: "",
      type_agent: "civil",
      grade_id: "",
      fonction_id: "",
      departement_id: "",
      service_id: "",
      categorie_salariale_id: "",
      numero_compte: "",
      banque: "",
      numero_securite_sociale: "",
      statut: "actif",
    },
  })

  const selectedDepartement = watch("departement_id")
  const filteredServices = selectedDepartement
    ? services.filter((s: any) => String(s.departement_id) === selectedDepartement)
    : services

  const createMutation = useMutation({
    mutationFn: (data: FormData) => agentService.createAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] })
      toast.success("Agent créé avec succès")
      router.push("/agents")
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Erreur lors de la création")
    },
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => setPhotoPreview(event.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: AgentForm) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        formData.append(key, value)
      }
    })
    if (fileInputRef.current?.files?.[0]) {
      formData.append("photo", fileInputRef.current.files[0])
    }
    createMutation.mutate(formData)
  }

  const inputClass = (fieldName: keyof AgentForm) =>
    errors[fieldName] ? "border-destructive" : ""

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Nouvel Agent"
        description="Création d'un nouvel agent"
        actions={
          <Button variant="outline" onClick={() => router.push("/agents")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations Personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input id="nom" {...register("nom")} className={inputClass("nom")} />
                  {errors.nom && <p className="text-xs text-destructive">{errors.nom.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postnom">Postnom</Label>
                  <Input id="postnom" {...register("postnom")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input id="prenom" {...register("prenom")} className={inputClass("prenom")} />
                  {errors.prenom && <p className="text-xs text-destructive">{errors.prenom.message}</p>}
                </div>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Sexe *</Label>
                  <RadioGroup
                    defaultValue="M"
                    onValueChange={(value) => setValue("sexe", value as "M" | "F")}
                    className="flex gap-4 pt-1"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="M" id="sexe-m" />
                      <Label htmlFor="sexe-m" className="font-normal">Masculin</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="F" id="sexe-f" />
                      <Label htmlFor="sexe-f" className="font-normal">Féminin</Label>
                    </div>
                  </RadioGroup>
                  {errors.sexe && <p className="text-xs text-destructive">{errors.sexe.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_naissance">Date de Naissance *</Label>
                  <Input id="date_naissance" type="date" {...register("date_naissance")} className={inputClass("date_naissance")} />
                  {errors.date_naissance && <p className="text-xs text-destructive">{errors.date_naissance.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" {...register("telephone")} placeholder="+243 8XX XXX XXX" />
                </div>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input id="adresse" {...register("adresse")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} className={inputClass("email")} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Photo</Label>
                <div className="flex items-center gap-4">
                  {photoPreview && (
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden border">
                      <img
                        src={photoPreview}
                        alt="Aperçu"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview(null)
                          if (fileInputRef.current) fileInputRef.current.value = ""
                        }}
                        className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-bl-lg p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center gap-2 cursor-pointer rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent">
                    <Upload className="h-4 w-4" />
                    {photoPreview ? "Changer" : "Télécharger"}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations Professionnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="matricule">Matricule *</Label>
                  <Input id="matricule" {...register("matricule")} className={inputClass("matricule")} />
                  {errors.matricule && <p className="text-xs text-destructive">{errors.matricule.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_recrutement">Date d'Engagement *</Label>
                  <Input id="date_recrutement" type="date" {...register("date_recrutement")} className={inputClass("date_recrutement")} />
                  {errors.date_recrutement && <p className="text-xs text-destructive">{errors.date_recrutement.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Type d'Agent *</Label>
                <RadioGroup
                  defaultValue="civil"
                  onValueChange={(value) => setValue("type_agent", value as "militaire" | "civil")}
                  className="flex gap-4 pt-1"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="militaire" id="type-militaire" />
                    <Label htmlFor="type-militaire" className="font-normal">Militaire</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="civil" id="type-civil" />
                    <Label htmlFor="type-civil" className="font-normal">Civil</Label>
                  </div>
                </RadioGroup>
                {errors.type_agent && <p className="text-xs text-destructive">{errors.type_agent.message}</p>}
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="grade_id">Grade *</Label>
                  <Select onValueChange={(value) => setValue("grade_id", value)}>
                    <SelectTrigger className={inputClass("grade_id")}>
                      <SelectValue placeholder="Sélectionner un grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Array.isArray(grades) ? grades : []).map((g: any) => (
                        <SelectItem key={g.id} value={String(g.id)}>{g.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.grade_id && <p className="text-xs text-destructive">{errors.grade_id.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fonction_id">Fonction *</Label>
                  <Select onValueChange={(value) => setValue("fonction_id", value)}>
                    <SelectTrigger className={inputClass("fonction_id")}>
                      <SelectValue placeholder="Sélectionner une fonction" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Array.isArray(fonctions) ? fonctions : []).map((f: any) => (
                        <SelectItem key={f.id} value={String(f.id)}>{f.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fonction_id && <p className="text-xs text-destructive">{errors.fonction_id.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categorie_salariale_id">Catégorie Salariale</Label>
                  <Select onValueChange={(value) => setValue("categorie_salariale_id", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucune</SelectItem>
                      {(Array.isArray(categories) ? categories : []).map((c: any) => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="departement_id">Département *</Label>
                  <Select onValueChange={(value) => {
                    setValue("departement_id", value)
                    setValue("service_id", "")
                  }}>
                    <SelectTrigger className={inputClass("departement_id")}>
                      <SelectValue placeholder="Sélectionner un département" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Array.isArray(departements) ? departements : []).map((d: any) => (
                        <SelectItem key={d.id} value={String(d.id)}>{d.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.departement_id && <p className="text-xs text-destructive">{errors.departement_id.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service_id">Service</Label>
                  <Select onValueChange={(value) => setValue("service_id", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun</SelectItem>
                      {(Array.isArray(filteredServices) ? filteredServices : []).map((s: any) => (
                        <SelectItem key={s.id} value={String(s.id)}>{s.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations Administratives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="numero_compte">Compte Bancaire</Label>
                  <Input id="numero_compte" {...register("numero_compte")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="banque">Banque</Label>
                  <Input id="banque" {...register("banque")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero_securite_sociale">CNSS</Label>
                  <Input id="numero_securite_sociale" {...register("numero_securite_sociale")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statut">Statut *</Label>
                <Select onValueChange={(value) => setValue("statut", value as any)} defaultValue="actif">
                  <SelectTrigger className={inputClass("statut")}>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                    <SelectItem value="retraite">Retraité</SelectItem>
                    <SelectItem value="decede">Décédé</SelectItem>
                  </SelectContent>
                </Select>
                {errors.statut && <p className="text-xs text-destructive">{errors.statut.message}</p>}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/agents")}>
              Annuler
            </Button>
            <Button type="submit" disabled={createMutation.isPending || isSubmitting}>
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Enregistrer
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
