"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useRouter } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLoginMutation } from "@/redux/api/authApi"
import { setCredentials } from "@/redux/slices/authSlice"
import { useDispatch } from "react-redux"
import { Eye, EyeOff } from "lucide-react"
import Cookies from 'js-cookie'
import { useTranslations } from "next-intl"

function LoginForm() {
  const t = useTranslations('Auth.login');
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/scan"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useDispatch()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate inputs
    if (!email || !password) {
      setError(t('validationError'))
      return
    }

    try {
      const result = await login({ email, password }).unwrap()
      if (result.success) {
        dispatch(
          setCredentials({
            user: result.data.user,
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
          }),
        )
        // Store user data in session storage (optional if persisting redux)
        sessionStorage.setItem("user", JSON.stringify(result.data.user))

        // Store tokens in cookies
        Cookies.set('accessToken', result.data.accessToken)
        Cookies.set('refreshToken', result.data.refreshToken)

        // Mark as returning user
        localStorage.setItem("returningUser", "true")

        router.push(callbackUrl)
      }
    } catch (err: any) {
      console.error("Login failed:", err)
      setError(err?.data?.message || t('error'))
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('email')}</label>
            <Input
              type="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-700">{t('password')}</label>
              <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
                {t('forgotPassword')}
              </Link>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? t('hidePassword') : t('showPassword')}
                </span>
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
            {isLoading ? t('submitting') : t('submit')}
          </Button>

          <p className="text-center text-sm text-gray-600">
            {t('noAccount')}{" "}
            <Link href="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
              {t('signUp')}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  const t = useTranslations('Auth.login');
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>{t('loading')}</div>}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
