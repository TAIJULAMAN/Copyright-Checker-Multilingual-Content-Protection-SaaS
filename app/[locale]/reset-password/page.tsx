"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "@/i18n/routing"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"

export default function ResetPasswordPage() {
  const t = useTranslations('Auth.resetPassword');
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validation
    if (!password || !confirmPassword) {
      setError(t('validationError'))
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError(t('passwordLength'))
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError(t('passwordMismatch'))
      setLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setSuccess(true)
      setLoading(false)

      // Redirect to login after 2 seconds
      setTimeout(() => {
        sessionStorage.removeItem("resetEmail")
        sessionStorage.removeItem("otpVerified")
        router.push("/login")
      }, 2000)
    }, 1000)
  }

  if (success) {
    return (
      <>
 
        <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t('successTitle')}</h2>
              <p className="text-gray-600 text-sm mb-4">
                {t('successDesc')}
              </p>
            </CardContent>
          </Card>
        </main>
  
      </>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset} className="space-y-4">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t('newPassword')}</label>
                <Input
                  type="password"
                  placeholder={t('newPasswordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500">{t('passwordHint')}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t('confirmPassword')}</label>
                <Input
                  type="password"
                  placeholder={t('confirmPasswordPlaceholder')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                {loading ? t('submitting') : t('submit')}
              </Button>

              <p className="text-center text-sm text-gray-600">
                {t('rememberPassword')}{" "}
                <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                  {t('login')}
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
