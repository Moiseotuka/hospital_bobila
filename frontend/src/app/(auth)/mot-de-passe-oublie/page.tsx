"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useForgotPassword } from "@/hooks/useAuth"
import { toast } from "sonner"
import Link from "next/link"

const forgotSchema = z.object({
  email: z.string().email("Email invalide"),
})

type ForgotForm = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [resetToken, setResetToken] = useState<string | null>(null)
  const forgotMutation = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = async (data: ForgotForm) => {
    try {
      const res = await forgotMutation.mutateAsync({ email: data.email })
      setSent(true)
      if (res.token) {
        setResetToken(res.token)
      }
      toast.success("Instructions envoyées")
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Erreur lors de l'envoi"
      toast.error(message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-background to-primary-50/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-xl">
          <CardHeader className="space-y-4 pb-6 pt-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg"
            >
              {sent ? (
                <CheckCircle className="h-8 w-8 text-primary-foreground" />
              ) : (
                <Mail className="h-8 w-8 text-primary-foreground" />
              )}
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {sent ? "Email envoyé" : "Mot de passe oublié"}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {sent
                  ? "Vérifiez votre boîte de réception"
                  : "Saisissez votre email pour réinitialiser"}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pb-8">
            {sent ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-primary/5 p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Email envoyé à :</p>
                  <p className="text-primary">{resetToken ? "Votre email" : ""}</p>
                </div>
                {resetToken && (
                  <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm">
                    <p className="font-medium text-yellow-800 mb-1">
                      Mode hors-ligne : Token de réinitialisation
                    </p>
                    <p className="text-yellow-700 break-all font-mono text-xs bg-yellow-100 p-2 rounded">
                      {resetToken}
                    </p>
                    <p className="text-yellow-600 mt-2 text-xs">
                      Copiez ce token et utilisez-le sur la page de réinitialisation.
                    </p>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Link href="/reset-password">
                    <Button className="w-full">Réinitialiser le mot de passe</Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      Retour à la connexion
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@hopital.cd"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-10"
                    disabled={forgotMutation.isPending || isSubmitting}
                  >
                    {(forgotMutation.isPending || isSubmitting) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      "Envoyer le lien"
                    )}
                  </Button>
                </motion.div>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Retour à la connexion
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
