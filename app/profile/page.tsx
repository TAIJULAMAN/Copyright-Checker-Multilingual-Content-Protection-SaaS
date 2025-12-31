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

export default function ProfilePage() {
  const { data: userData, isLoading: isUserLoading } = useGetMeQuery();
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [updateAvatar, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const user = userData?.data?.user;

  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      // Split fullname if firstName/lastName not distinct in user object, 
      // but API usually returns them or expects them. 
      // Based on prompt, GET me returns 'fullname'. UPDATE expects 'firstName', 'lastName'.
      // usage: "fullname": "parves mosarof"
      const names = user.fullname ? user.fullname.split(' ') : ["", ""];
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(' ') || "";

      setProfileForm({
        firstName: userIdFirstName || firstName, 
        lastName: userIdLastName || lastName,
        mobile: user.mobile || "",
      });
    }
  }, [user]);
  
  // Correction: user object in prompt has 'fullname', but likely doesn't have firstName/lastName fields directly if it's just 'fullname'.
  // However, the update payload requires firstName/lastName. 
  // I'll assume splitting 'fullname' is the way to go for initial state.
  // Wait, I should better handle the initial state. 
  
  const userIdFirstName = ""; // Placeholder if schema differs
  const userIdLastName = "";

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(profileForm).unwrap();
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      try {
        await updateAvatar(formData).unwrap();
        toast.success("Profile picture updated successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to update profile picture");
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    try {
      await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      toast.success("Password changed successfully");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password");
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
        title="My Profile" 
        description="Manage your account settings and preferences" 
        backLink={{ href: "/", text: "Back to Home" }} 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-[250px_1fr]">
          {/* Sidebar Area - User Info */}
          <Card className="h-fit">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <Avatar className="h-24 w-24 ring-2 ring-offset-2 ring-primary/10">
                  <AvatarImage src={user?.avatar} alt={user?.fullname} className="object-cover" />
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
                    <span>Role</span>
                    <span className="font-medium px-2 py-0.5 bg-gray-100 rounded text-gray-900 capitalize">{user?.role}</span>
                 </div>
                 <div className="flex justify-between items-center text-gray-600">
                    <span>Member Type</span>
                    <span className={`font-medium px-2 py-0.5 rounded capitalize ${user?.isPremiumMember ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-900'}`}>
                      {user?.isPremiumMember ? 'Premium' : 'Free'}
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
                  <UserIcon className="h-4 w-4" /> Profile Details
                </TabsTrigger>
                <TabsTrigger value="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Security
                </TabsTrigger>
              </TabsList>

              {/* Profile Details Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            name="firstName" 
                            value={profileForm.firstName} 
                            onChange={handleProfileChange} 
                            placeholder="John" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            name="lastName" 
                            value={profileForm.lastName} 
                            onChange={handleProfileChange} 
                            placeholder="Doe" 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="mobile">Phone Number</Label>
                        <Input 
                          id="mobile" 
                          name="mobile" 
                          value={profileForm.mobile} 
                          onChange={handleProfileChange} 
                          placeholder="+1234567890" 
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          value={user?.email || ""} 
                          disabled 
                          className="bg-gray-50 text-gray-500 cursor-not-allowed" 
                        />
                         <p className="text-[10px] text-gray-500">Email address cannot be changed</p>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={isUpdatingUser} className="min-w-[120px]">
                          {isUpdatingUser ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" /> Save Changes
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
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="oldPassword">Current Password</Label>
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
                          <Label htmlFor="newPassword">New Password</Label>
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
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Changing...
                            </>
                          ) : (
                            <>
                              <Lock className="mr-2 h-4 w-4" /> Update Password
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
