"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "@/i18n/routing"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import { useVerifyResetOtpMutation } from "@/redux/api/authApi"
import { toast } from "sonner"

export default function VerifyOTPPage() {
  const t = useTranslations('Auth.verifyOtp');
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [timer, setTimer] = useState(60)

  const [verifyOtp, { isLoading }] = useVerifyResetOtpMutation()

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Handle pasting entire code
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char
    })
    setOtp(newOtp)

    // Focus the last filled input or the next empty one
    const nextIndex = Math.min(pastedData.length, 5)
    document.getElementById(`otp-${nextIndex}`)?.focus()
  }

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    if (value.length > 1) {
      // Handle case where user might type quickly or paste via mobile keyboard suggestions that bypass onPaste
      const chars = value.split("").slice(0, 6)
      const newOtp = [...otp]
      chars.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char
      })
      setOtp(newOtp)
      const nextIndex = Math.min(index + chars.length, 5)
      document.getElementById(`otp-${nextIndex}`)?.focus()
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If empty, move to previous and delete that one
        const newOtp = [...otp]
        newOtp[index - 1] = ""
        setOtp(newOtp)
        document.getElementById(`otp-${index - 1}`)?.focus()
      }
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const otpCode = otp.join("")
    if (otpCode.length !== 6) {
      setError(t('error'))
      return
    }

    const email = sessionStorage.getItem("resetEmail")
    if (!email) {
      setError("Email not found. Please try forgot password again.")
      return
    }

    try {
      const response = await verifyOtp({ email, otp: otpCode }).unwrap()
      if (response.success && response.data?.resetToken) {
        sessionStorage.setItem("otpVerified", "true")
        sessionStorage.setItem("resetToken", response.data.resetToken)
        toast.success(response.message || "OTP Verified")
        router.push("/reset-password")
      } else {
        setError(response.message || "Verification failed")
      }
    } catch (err: any) {
      console.error("OTP Verification error:", err)
      setError(err?.data?.message || t('error') || "Verification failed")
    }
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
            <form onSubmit={handleVerify} className="space-y-4">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-bold"
                    disabled={isLoading}
                  />
                ))}
              </div>

              <div className="text-center text-sm text-gray-600">
                {timer > 0 ? (
                  <p>
                    {t('resendIn')} <span className="font-semibold text-purple-600">{timer}s</span>
                  </p>
                ) : (
                  <button type="button" className="text-purple-600 hover:text-purple-700 font-medium">
                    {t('resend')}
                  </button>
                )}
              </div>

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? t('submitting') : t('submit')}
              </Button>

              <p className="text-center text-sm text-gray-600">
                <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                  {t('backToLogin')}
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
