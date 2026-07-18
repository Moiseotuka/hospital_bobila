"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useResetPassword } from "@/hooks/useAuth"
import { toast } from "sonner"
import Link from "next/link"

const resetSchema = z
  .object({
    email: z.string().email("Email invalide"),
    token: z.string().min(1, "Token requis"),
    password: z.string().min(8, "Minimum 8 caractères"),
    passwordConfirmation: z.string().min(1, "Confirmation requise"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["passwordConfirmation"],
  })

type ResetForm = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const resetMutation = useResetPassword()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
      token: "",
      password: "",
      passwordConfirmation: "",
    },
  })

  const onSubmit = async (data: ResetForm) => {
    try {
      await resetMutation.mutateAsync({
        email: data.email,
        token: data.token,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      })
      toast.success("Mot de passe réinitialisé avec succès")
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Erreur lors de la réinitialisation"
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
              <Lock className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Réinitialisation
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Saisissez votre email, le token et votre nouveau mot de passe
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pb-8">
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
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="space-y-2"
              >
                <Label htmlFor="token">Token de réinitialisation</Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Collez le token reçu par email"
                  {...register("token")}
                  className={errors.token ? "border-destructive" : ""}
                />
                {errors.token && (
                  <p className="text-xs text-destructive">{errors.token.message}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 caractères"
                    {...register("password")}
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
                className="space-y-2"
              >
                <Label htmlFor="passwordConfirmation">Confirmer le mot de passe</Label>
                <Input
                  id="passwordConfirmation"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirmez le nouveau mot de passe"
                  {...register("passwordConfirmation")}
                  className={errors.passwordConfirmation ? "border-destructive" : ""}
                />
                {errors.passwordConfirmation && (
                  <p className="text-xs text-destructive">{errors.passwordConfirmation.message}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full h-10"
                  disabled={resetMutation.isPending || isSubmitting}
                >
                  {(resetMutation.isPending || isSubmitting) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Réinitialisation...
                    </>
                  ) : (
                    "Réinitialiser"
                  )}
                </Button>
              </motion.div>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Retour à la connexion
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
