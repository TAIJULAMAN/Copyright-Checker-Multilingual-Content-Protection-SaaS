"use strict";
"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetMeQuery, useChangePasswordMutation } from "@/redux/api/authApi";
import { useUpdateUserMutation, useUpdateAvatarMutation } from "@/redux/api/userApi";
import { toast } from "sonner";
import { Camera, Loader2, Save, Lock, User as UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Swal from "sweetalert2";
import { getImageUrl } from "@/redux/api/config";

export default function ProfilePage() {
  const t = useTranslations('Profile');
  const { data: userData, isLoading: isUserLoading } = useGetMeQuery();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [updateAvatar, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const user = userData?.data?.user;

  // Form states
  const [profileForm, setProfileForm] = useState({
    fullname: "",
    mobile: "",
    street: "",
    houseNumber: "",
    zipCode: "",
    city: "",
    country: "",
    company: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullname: user.fullname || "",
        mobile: user.mobile || "",
        street: user.street || "",
        houseNumber: user.houseNumber || "",
        zipCode: user.zipCode || "",
        city: user.city || "",
        country: user.country || "",
        company: user.company || ""
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await updateUser(profileForm).unwrap();
      // Using SweetAlert2 to show the success message with the full response data
      Swal.fire({
        title: "Success!",
        text: result.message,
        icon: "success",
        confirmButtonText: "Cool",
      });
      // toast.success(t('messages.profileSuccess'));
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error?.data?.message || t('messages.profileError'),
        icon: "error",
        confirmButtonText: "Cool",
      });
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      try {
        await updateAvatar(formData).unwrap();
        Swal.fire({
          title: "Success!",
          text: "Avatar updated successfully!",
          icon: "success",
          confirmButtonText: "Cool",
        });
      } catch (error: any) {
        Swal.fire({
          title: "Error!",
          text: error?.data?.message || t('messages.avatarError'),
          icon: "error",
          confirmButtonText: "Cool",
        });
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Swal.fire({
        title: "Error!",
        text: "Passwords do not match!",
        icon: "error",
        confirmButtonText: "Cool",
      });
      return;
    }

    try {
      await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      Swal.fire({
        title: "Success!",
        text: "Password changed successfully!",
        icon: "success",
        confirmButtonText: "Cool",
      });
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error?.data?.message || t('messages.passwordError'),
        icon: "error",
        confirmButtonText: "Cool",
      });
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader
        title={t('title')}
        description={t('description')}
        backLink={{ href: "/", text: t('backToHome') }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-[250px_1fr]">
          {/* Sidebar Area - User Info */}
          <Card className="h-fit">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <Avatar className="h-24 w-24 ring-2 ring-offset-2 ring-primary/10">
                  <AvatarImage src={getImageUrl(user?.avatar || "")} alt={user?.fullname || ""} className="object-cover" />
                  <AvatarFallback className="text-xl bg-primary/5 text-primary">
                    {user?.fullname?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full cursor-pointer shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/90"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isUpdatingAvatar}
                  />
                </label>
              </div>

              <h3 className="font-semibold text-lg text-gray-900">{user?.fullname}</h3>
              <p className="text-sm text-gray-500 mb-4">{user?.email}</p>

              <div className="w-full pt-4 border-t border-gray-100 flex flex-col gap-2 text-sm">
                <div className="flex justify-between items-center text-gray-600">
                  <span>{t('role')}</span>
                  <span className="font-medium px-2 py-0.5 bg-gray-100 rounded text-gray-900 capitalize">{user?.role}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>{t('memberType')}</span>
                  <span className={`font-medium px-2 py-0.5 rounded capitalize ${user?.isPremiumMember ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-900'}`}>
                    {user?.isPremiumMember ? t('premium') : t('free')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="flex-1">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" /> {t('tabs.profile')}
                </TabsTrigger>
                <TabsTrigger value="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> {t('tabs.security')}
                </TabsTrigger>
              </TabsList>

              {/* Profile Details Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('personalInfo.title')}</CardTitle>
                    <CardDescription>{t('personalInfo.description')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullname">{t('personalInfo.fullname')}</Label>
                        <Input
                          id="fullname"
                          name="fullname"
                          value={profileForm.fullname}
                          onChange={handleProfileChange}
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mobile">{t('personalInfo.phone')}</Label>
                        <Input
                          id="mobile"
                          name="mobile"
                          value={profileForm.mobile}
                          onChange={handleProfileChange}
                          placeholder="+1234567890"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="street">{t('personalInfo.street')}</Label>
                          <Input
                            id="street"
                            name="street"
                            value={profileForm.street}
                            onChange={handleProfileChange}
                            placeholder="Your Street"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="houseNumber">{t('personalInfo.houseNumber')}</Label>
                          <Input
                            id="houseNumber"
                            name="houseNumber"
                            value={profileForm.houseNumber}
                            onChange={handleProfileChange}
                            placeholder="123"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">{t('personalInfo.zipCode')}</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={profileForm.zipCode}
                            onChange={handleProfileChange}
                            placeholder="12345"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">{t('personalInfo.city')}</Label>
                          <Input
                            id="city"
                            name="city"
                            value={profileForm.city}
                            onChange={handleProfileChange}
                            placeholder="Your City"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">{t('personalInfo.country')}</Label>
                        <Input
                          id="country"
                          name="country"
                          value={profileForm.country}
                          onChange={handleProfileChange}
                          placeholder="Your Country"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">{t('personalInfo.company')}</Label>
                        <Input
                          id="company"
                          name="company"
                          value={profileForm.company}
                          onChange={handleProfileChange}
                          placeholder="Your Company"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">{t('personalInfo.email')}</Label>
                        <Input
                          id="email"
                          value={user?.email || ""}
                          disabled
                          className="bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-gray-500">{t('personalInfo.emailWarning')}</p>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={isUpdatingUser} className="min-w-[120px]">
                          {isUpdatingUser ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('personalInfo.saving')}
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" /> {t('personalInfo.save')}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Password Tab */}
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('password.title')}</CardTitle>
                    <CardDescription>{t('password.description')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="oldPassword">{t('password.current')}</Label>
                        <Input
                          id="oldPassword"
                          name="oldPassword"
                          type="password"
                          value={passwordForm.oldPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">{t('password.new')}</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">{t('password.confirm')}</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={isChangingPassword} variant="destructive" className="min-w-[120px]">
                          {isChangingPassword ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('password.updating')}
                            </>
                          ) : (
                            <>
                              <Lock className="mr-2 h-4 w-4" /> {t('password.update')}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
