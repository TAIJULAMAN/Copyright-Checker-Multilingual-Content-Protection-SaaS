"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLoginMutation, useRegisterMutation } from "@/redux/api/authApi";
import { setCredentials } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SignupPage() {
  const t = useTranslations('Auth.signup');
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const callbackUrl = searchParams.get("callbackUrl") || "/scan"

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
    company: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [error, setError] = useState("");
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const isLoading = isRegisterLoading || isLoginLoading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.mobile ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError(t('validationError'));
      return;
    }

    if (formData.password.length < 8) {
      setError(t('passwordLength'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    if (!formData.agreeTerms) {
      setError(t('termsError'));
      return;
    }

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address,
        company: formData.company,
        password: formData.password,
      }).unwrap();

      if (result.success) {
        // Automatically login after successful registration
        try {
          const loginResult = await login({
            email: formData.email,
            password: formData.password
          }).unwrap();

          if (loginResult.success) {
            dispatch(
              setCredentials({
                user: loginResult.data.user,
                accessToken: loginResult.data.accessToken,
                refreshToken: loginResult.data.refreshToken,
              })
            );

            // Store user data in session storage (optional if persisting redux)
            sessionStorage.setItem("user", JSON.stringify(loginResult.data.user));

            // Store tokens in cookies
            Cookies.set("accessToken", loginResult.data.accessToken);
            Cookies.set("refreshToken", loginResult.data.refreshToken);

            // Mark as returning user
            localStorage.setItem("returningUser", "true");

            // Redirect to callbackUrl with welcome message
            const welcomeUrl = callbackUrl.includes('?')
              ? `${callbackUrl}&welcome=true`
              : `${callbackUrl}${callbackUrl === '/scan' ? '?welcome=true' : ''}`;

            router.push(welcomeUrl);
          }
        } catch (loginErr: any) {
          console.error("Auto-login failed:", loginErr);
          // If auto-login fails, still redirect to login page
          router.push("/login");
        }
      }
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err?.data?.message || t('error'));
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">{t('title')}</CardTitle>
            <CardDescription>
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t('firstName')}
                  </label>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder={t('firstNamePlaceholder')}
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {t('lastName')}
                  </label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder={t('lastNamePlaceholder')}
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('email')}
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder={t('emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('mobile')}
                </label>
                <Input
                  type="tel"
                  name="mobile"
                  placeholder={t('mobilePlaceholder')}
                  value={formData.mobile}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('address')}
                </label>
                <Input
                  type="text"
                  name="address"
                  placeholder={t('addressPlaceholder')}
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('company')}
                </label>
                <Input
                  type="text"
                  name="company"
                  placeholder={t('companyPlaceholder')}
                  value={formData.company}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('password')}
                </label>
                <Input
                  type="password"
                  name="password"
                  placeholder={t('passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {t('confirmPassword')}
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder={t('confirmPasswordPlaceholder')}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label className="ml-2 text-sm text-gray-600">
                  {t('agreeTerms')}{" "}
                  <Link
                    href="/privacy"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    {t('termsLink')}
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-base font-bold rounded-lg transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? t('submitting') : t('submit')}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t bg-gray-50/50 p-6">
            <div className="flex flex-col w-full gap-3">
              <p className="text-center text-sm text-gray-500 font-medium">
                {t('hasAccount')}
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 h-12 text-base font-semibold rounded-lg"
              >
                <Link href={`/login${callbackUrl !== '/scan' ? `?callbackUrl=${callbackUrl}` : ''}`}>
                  {t('login')}
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
